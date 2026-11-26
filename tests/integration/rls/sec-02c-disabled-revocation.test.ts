/**
 * SEC-RELEASE-02C: revocation of already-issued student / staff / platform
 * administrator sessions. Disposable loopback Supabase ONLY.
 * RLS outcomes are checked against positive authorized controls and SQL
 * before/after evidence to rule out no-fixture / no-side-effect false passes.
 */
import { beforeAll, afterAll, describe, test, expect } from 'vitest'
import { execFileSync } from 'node:child_process'
import { assertTestEnvironment } from '../setup/production-guard'
import { getTestEnvironment } from '../setup/test-environment'
import { setupTestEnvironment, cleanupTestEnvironment, createAuthenticatedClient, getServiceClient, resolveActorId } from '../setup/db-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'

function sql(query: string) {
  assertTestEnvironment()
  return execFileSync('psql', [
    getTestEnvironment().databaseUrl, '-X', '-q', '-A', '-t',
    '-v', 'ON_ERROR_STOP=1', '-c', query,
  ], { encoding: 'utf8' }).trim()
}
const schoolA = TEST_SCHOOLS.SCHOOL_A.id
const schoolB = TEST_SCHOOLS.SCHOOL_B.id
let ownAttemptId: string
let studentA: string
let studentB: string

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
  studentA = resolveActorId('STUDENT_A')
  studentB = resolveActorId('STUDENT_B')
  // Materialize profile rows explicitly in this disposable test only. Auth
  // identities may be created without a corresponding legacy profile trigger.
  for (const key of ['PLATFORM_ADMIN','STUDENT_A','STUDENT_B','INSTRUCTOR_A','SCHOOL_ADMIN_A','SCHOOL_ADMIN_B'] as const) {
    const a = TEST_ACTORS[key]
    const id = resolveActorId(key)
    const schoolLiteral = a.schoolId ? `'${a.schoolId}'::uuid` : 'null'
    const returned = sql(`
      INSERT INTO public.profiles
        (id,email,full_name,role,school_id,approval_status,is_disabled,requires_password_change)
      VALUES ('${id}'::uuid,'${a.email}','02C local actor','${a.role}',
              ${schoolLiteral},'approved',false,false)
      ON CONFLICT (id) DO UPDATE SET
        role=excluded.role, school_id=excluded.school_id,
        approval_status='approved', is_disabled=false,
        requires_password_change=false
      RETURNING id::text;`)
    expect(returned).toBe(id)
  }
  ownAttemptId = sql(`
    INSERT INTO public.quiz_attempts
      (user_id,quiz_id,score,total_questions,percentage,answers_json)
    VALUES ('${studentA}'::uuid,'quiz-2',1,1,100,'{}'::jsonb)
    RETURNING id::text;`)
  expect(ownAttemptId).toBeTruthy()
})

afterAll(async () => { await cleanupTestEnvironment() })

describe('SEC-RELEASE-02C disabled existing-session isolation', () => {
  test('student retains own quiz access while enabled, but not after revocation; no write side effects', async () => {
    const id = studentA
    const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
    const own = await client.from('quiz_attempts').select('id').eq('id', ownAttemptId)
    expect(own.error).toBeNull()
    expect(own.data?.map(x => x.id)).toEqual([ownAttemptId])
    const before = sql(`select count(*)::text from public.quiz_attempts where user_id='${id}'::uuid;`)
    const { error: disableError } = await getServiceClient().from('profiles')
      .update({ is_disabled: true }).eq('id', id)
    expect(disableError).toBeNull()
    try {
      const denied = await client.from('quiz_attempts').select('id').eq('id', ownAttemptId)
      expect(denied.data ?? [], 'revoked student accessed own quiz history').toEqual([])
      const insertion = await client.from('quiz_attempts').insert({
        user_id: id, quiz_id: '02C-forbidden', score: 1,
        total_questions: 1, percentage: 100, answers_json: {},
      })
      expect(insertion.error).not.toBeNull()
      expect(sql(`select count(*)::text from public.quiz_attempts where user_id='${id}'::uuid;`)).toBe(before)
    } finally {
      const { error } = await getServiceClient().from('profiles')
        .update({ is_disabled: false }).eq('id', id)
      expect(error).toBeNull()
    }
    const restored = await client.from('quiz_attempts').select('id').eq('id', ownAttemptId)
    expect(restored.data?.map(x => x.id)).toEqual([ownAttemptId])
  })

  test.each([
    ['INSTRUCTOR_A', 'A'],
    ['SCHOOL_ADMIN_A', 'A'],
    ['SCHOOL_ADMIN_B', 'B'],
    ['PLATFORM_ADMIN', 'A'],
  ] as const)('%s existing session is denied school A/B sensitive rows after disabling', async (role, ownSchool) => {
    const uid = resolveActorId(role)
    const client = await createAuthenticatedClient(TEST_ACTORS[role])
    const ownTarget = ownSchool === 'A' ? studentA : studentB
    const positive = await client.from('students').select('id').eq('profile_id', ownTarget)
    expect(positive.error).toBeNull()
    expect(positive.data?.length).toBeGreaterThan(0)
    if (role === 'PLATFORM_ADMIN') {
      const cross = await client.from('students').select('id').eq('profile_id', studentB)
      expect(cross.error).toBeNull()
      expect(cross.data?.length).toBeGreaterThan(0)
    }
    const beforeA = sql(`SELECT count(*)::text FROM public.students WHERE school_id='${schoolA}'::uuid;`)
    const beforeB = sql(`SELECT count(*)::text FROM public.students WHERE school_id='${schoolB}'::uuid;`)
    const { error: disabledError } = await getServiceClient().from('profiles')
      .update({ is_disabled: true }).eq('id', uid)
    expect(disabledError).toBeNull()
    try {
      for (const schoolId of [schoolA, schoolB]) {
        const read = await client.from('students').select('id').eq('school_id', schoolId)
        expect(read.data ?? [], `${role} disclosed ${schoolId} while disabled`).toEqual([])
      }
      const write = await client.from('students').update({ student_number: 'SEC02C-FORBIDDEN' })
        .eq('profile_id', ownTarget)
      if (write.error) expect(write.error.code).toBeTruthy()
      expect(sql(`SELECT count(*)::text FROM public.students WHERE school_id='${schoolA}'::uuid;`)).toBe(beforeA)
      expect(sql(`SELECT count(*)::text FROM public.students WHERE school_id='${schoolB}'::uuid;`)).toBe(beforeB)
      const unchanged = sql(`SELECT student_number FROM public.students WHERE profile_id='${ownTarget}'::uuid;`)
      expect(unchanged).not.toBe('SEC02C-FORBIDDEN')
    } finally {
      const { error } = await getServiceClient().from('profiles')
        .update({ is_disabled: false }).eq('id', uid)
      expect(error).toBeNull()
    }
    const restored = await client.from('students').select('id').eq('profile_id', ownTarget)
    expect(restored.data?.length).toBeGreaterThan(0)
  })

  test('disabled platform-admin helper is false even with pre-existing JWT', async () => {
    const uid = resolveActorId('PLATFORM_ADMIN')
    const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
    const allowed = await client.rpc('is_platform_admin')
    expect(allowed.error).toBeNull()
    expect(allowed.data).toBe(true)
    const { error } = await getServiceClient().from('profiles')
      .update({ is_disabled: true }).eq('id', uid)
    expect(error).toBeNull()
    try {
      const blocked = await client.rpc('is_platform_admin')
      expect(blocked.error).toBeNull()
      expect(blocked.data).toBe(false)
    } finally {
      const restore = await getServiceClient().from('profiles')
        .update({ is_disabled: false }).eq('id', uid)
      expect(restore.error).toBeNull()
    }
  })
})
