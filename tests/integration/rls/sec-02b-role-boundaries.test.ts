/**
 * SEC-RELEASE-02B: school role boundaries under real authenticated RLS.
 * Explicitly confined to disposable local Supabase. Every negative query is
 * backed by a real target row and its after-state is checked by service role.
 */
import { beforeAll, afterAll, describe, expect, test } from 'vitest'
import { execFileSync } from 'node:child_process'
import { assertTestEnvironment } from '../setup/production-guard'
import {
  setupTestEnvironment, cleanupTestEnvironment, createAuthenticatedClient,
  getServiceClient, resolveActorId,
} from '../setup/db-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'
import { getTestEnvironment } from '../setup/test-environment'

function localSql(query: string): string {
  assertTestEnvironment()
  return execFileSync('psql', [
    getTestEnvironment().databaseUrl, '-X', '-q', '-A', '-t',
    '-v', 'ON_ERROR_STOP=1', '-c', query,
  ], { encoding: 'utf8' }).trim()
}

const school = (side: 'A' | 'B') => TEST_SCHOOLS[side === 'A' ? 'SCHOOL_A' : 'SCHOOL_B'].id
const student = (side: 'A' | 'B') => resolveActorId(side === 'A' ? 'STUDENT_A' : 'STUDENT_B')

let categories: Record<'A' | 'B', string>
let grades: Record<'A' | 'B', string>
let assessments: Record<'A' | 'B', string>
let progress: Record<'A' | 'B', string>

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
  // Auth admin creation can succeed even when the legacy signup trigger did not
  // materialize a profile. Explicitly seed and verify the six local role profiles
  // before creating FK-constrained grades and assessment fixtures.
  for (const roleKey of [
    'STUDENT_A', 'STUDENT_B', 'INSTRUCTOR_A', 'INSTRUCTOR_B',
    'SCHOOL_ADMIN_A', 'SCHOOL_ADMIN_B',
  ] as const) {
    const actor = TEST_ACTORS[roleKey]
    const uid = resolveActorId(roleKey)
    const escapedEmail = actor.email.replaceAll("'", "''")
    const escapedName = actor.fullName.replaceAll("'", "''")
    const profileId = localSql(`
      INSERT INTO public.profiles
        (id,email,full_name,role,school_id,approval_status,is_disabled,requires_password_change)
      VALUES ('${uid}'::uuid,'${escapedEmail}','${escapedName}',
        '${actor.role}','${actor.schoolId}'::uuid,'approved',false,false)
      ON CONFLICT (id) DO UPDATE SET
        role = EXCLUDED.role, school_id = EXCLUDED.school_id,
        approval_status = 'approved', is_disabled = false, requires_password_change = false
      RETURNING id::text;
    `)
    expect(profileId, `${roleKey} profile must exist before academic fixtures`).toBe(uid)
  }
  categories = {} as typeof categories
  grades = {} as typeof grades
  assessments = {} as typeof assessments
  progress = {} as typeof progress
  for (const side of ['A', 'B'] as const) {
    const uid = student(side)
    const sid = school(side)
    const instructorId = resolveActorId(side === 'A' ? 'INSTRUCTOR_A' : 'INSTRUCTOR_B')
    // grade_categories has no service_role INSERT grant by design.
    // Local postgres is used only for fixture creation after the loopback guard.
    const ids = localSql(`
      WITH cat AS (
        INSERT INTO public.grade_categories (school_id,name,type,weight)
        VALUES ('${sid}'::uuid,'02B local grade category','QUIZ',0.1) RETURNING id
      ),
      grd AS (
        INSERT INTO public.grades
          (school_id,student_id,category_id,category_type,score,max_score,
           percentage,weight,instructor_id,instructor_name)
        SELECT '${sid}'::uuid,'${uid}'::uuid,cat.id,'QUIZ',80,100,80,0.1,
               '${instructorId}'::uuid,'02B local instructor' FROM cat RETURNING id
      ),
      ass AS (
        INSERT INTO public.assessments
          (school_id,student_id,assessment_type,scoring_type,qualitative_result,evaluator_id,evaluator_name)
        VALUES ('${sid}'::uuid,'${uid}'::uuid,'HAIRCUT','QUALITATIVE','PASS',
                '${instructorId}'::uuid,'02B local instructor') RETURNING id
      ),
      prog AS (
        INSERT INTO public.student_progress (user_id,chapter_id,progress_percentage)
        VALUES ('${uid}'::uuid,'ch-02b-role-boundaries',70) RETURNING id
      )
      SELECT cat.id::text || '|' || grd.id::text || '|' || ass.id::text || '|' || prog.id::text
        FROM cat,grd,ass,prog;
    `).split('|')
    expect(ids).toHaveLength(4)
    categories[side] = ids[0]
    grades[side] = ids[1]
    assessments[side] = ids[2]
    progress[side] = ids[3]
  }
})
afterAll(async () => {
  await cleanupTestEnvironment()
})

describe('SEC-RELEASE-02B operational RLS', () => {
  const staffCases = [
    { role: 'INSTRUCTOR_A', own: 'A', foreign: 'B' },
    { role: 'INSTRUCTOR_B', own: 'B', foreign: 'A' },
    { role: 'SCHOOL_ADMIN_A', own: 'A', foreign: 'B' },
    { role: 'SCHOOL_ADMIN_B', own: 'B', foreign: 'A' },
  ] as const

  test.each(staffCases)('$role reads same-school diagnostics but no foreign student records', async ({ role, own, foreign }) => {
    const client = await createAuthenticatedClient(TEST_ACTORS[role])
    for (const [table, ownId, foreignId] of [
      ['student_progress', progress[own], progress[foreign]],
      ['grades', grades[own], grades[foreign]],
      ['assessments', assessments[own], assessments[foreign]],
    ] as const) {
      const { data: localRows, error: localError } = await client.from(table).select('id').eq('id', ownId)
      expect(localError, `${role} ${table} own-school query`).toBeNull()
      expect(localRows?.map(row => row.id)).toEqual([ownId])
      const { data: forbiddenRows, error: forbiddenError } = await client.from(table).select('id').eq('id', foreignId)
      // Missing table privilege is safe but not proof of authorized parity.
      if (forbiddenError) expect(forbiddenError.code).toBeTruthy()
      expect(forbiddenRows ?? [], `${role} disclosed foreign ${table}`).toEqual([])
    }
  })

  test.each(['STUDENT_A', 'STUDENT_B'] as const)('%s sees own progress, grade and assessment but not foreign data', async role => {
    const client = await createAuthenticatedClient(TEST_ACTORS[role])
    const own = role === 'STUDENT_A' ? 'A' : 'B'
    const foreign = own === 'A' ? 'B' : 'A'
    for (const [table, ownId, foreignId] of [
      ['student_progress', progress[own], progress[foreign]],
      ['grades', grades[own], grades[foreign]],
      ['assessments', assessments[own], assessments[foreign]],
    ] as const) {
      const { data: ownRows, error: ownError } = await client.from(table).select('id').eq('id', ownId)
      expect(ownError).toBeNull()
      expect(ownRows?.map(row => row.id)).toEqual([ownId])
      const { data: foreignRows, error: foreignError } = await client.from(table).select('id').eq('id', foreignId)
      if (foreignError) expect(foreignError.code).toBeTruthy()
      expect(foreignRows ?? []).toEqual([])
    }
  })

  test('student cannot forge grade or assessment; foreign staff cannot mutate grade', async () => {
    const studentClient = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
    const foreignClient = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)
    const service = getServiceClient()
    const gradeAttempt = await studentClient.from('grades').insert({
      school_id: school('A'), student_id: student('A'), category_id: categories.A,
      category_type: 'QUIZ', score: 100, max_score: 100, percentage: 100,
      instructor_id: student('A'), instructor_name: 'forged',
    })
    expect(gradeAttempt.error, 'Student must not be able to author grades').not.toBeNull()
    const assessmentAttempt = await studentClient.from('assessments').insert({
      school_id: school('A'), student_id: student('A'), assessment_type: 'HAIRCUT',
      scoring_type: 'QUALITATIVE', qualitative_result: 'PASS',
      evaluator_id: student('A'), evaluator_name: 'forged',
    })
    expect(assessmentAttempt.error, 'Student must not be able to author assessments').not.toBeNull()

    const before = localSql(`SELECT row_to_json(g)::text FROM
      (SELECT score,student_id,school_id FROM public.grades WHERE id = '${grades.B}'::uuid) g;`)
    const changed = await foreignClient.from('grades').update({ score: 99 }).eq('id', grades.B)
    if (changed.error) expect(changed.error.code).toBeTruthy()
    const after = localSql(`SELECT row_to_json(g)::text FROM
      (SELECT score,student_id,school_id FROM public.grades WHERE id = '${grades.B}'::uuid) g;`)
    expect(after).toEqual(before)
  })

  test('student cannot promote own role or reassign school through direct profile update', async () => {
    const service = getServiceClient()
    const userId = student('A')
    const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
    const { data: before, error: readError } = await service.from('profiles')
      .select('role,school_id,approval_status,is_disabled').eq('id', userId).single()
    expect(readError).toBeNull()
    try {
      const attempted = await client.from('profiles').update({
        role: 'school_admin',
        school_id: school('B'),
        approval_status: 'approved',
        is_disabled: false,
      }).eq('id', userId)
      if (attempted.error) expect(attempted.error.code).toBeTruthy()
      const { data: after, error: verifyError } = await service.from('profiles')
        .select('role,school_id,approval_status,is_disabled').eq('id', userId).single()
      expect(verifyError).toBeNull()
      expect(after, 'Untrusted client changed privileged profile fields').toEqual(before)
    } finally {
      // Restore disposable fixture even when regression detects a vulnerable write.
      const { error } = await service.from('profiles').update(before!).eq('id', userId)
      expect(error).toBeNull()
    }
  })

  test('school administration can update own settings, not the other school; staff and students cannot escalate', async () => {
    const service = getServiceClient()
    for (const side of ['A', 'B'] as const) {
      localSql(`INSERT INTO public.school_settings (school_id,settings)
        VALUES ('${school(side)}'::uuid,'{"sec02b":"${side}"}'::jsonb)
        ON CONFLICT (school_id) DO UPDATE SET settings = excluded.settings;`)
    }
    const snapshot = async (side: 'A' | 'B') => JSON.parse(localSql(
      `SELECT settings::text FROM public.school_settings WHERE school_id = '${school(side)}'::uuid;`,
    )) as Record<string, unknown>

    const foreignBefore = await snapshot('B')
    const ownBefore = await snapshot('A')
    const admin = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
    const sameSchoolWrite = await admin.from('school_settings')
      .update({ settings: { sec02b: 'authorized-school-admin' } }).eq('school_id', school('A'))
    expect(sameSchoolWrite.error, 'School administrator should manage own school').toBeNull()
    expect(await snapshot('A')).toEqual({ sec02b: 'authorized-school-admin' })

    const foreignWrite = await admin.from('school_settings')
      .update({ settings: { sec02b: 'illicit-cross-school-write' } }).eq('school_id', school('B'))
    if (foreignWrite.error) expect(foreignWrite.error.code).toBeTruthy()
    expect(await snapshot('B')).toEqual(foreignBefore)

    for (const actor of [TEST_ACTORS.INSTRUCTOR_A, TEST_ACTORS.STUDENT_A]) {
      const client = await createAuthenticatedClient(actor)
      const attempt = await client.from('school_settings')
        .update({ settings: { sec02b: 'unauthorized-edit' } }).eq('school_id', school('A'))
      if (attempt.error) expect(attempt.error.code).toBeTruthy()
      expect(await snapshot('A')).toEqual({ sec02b: 'authorized-school-admin' })
    }

    const adminId = resolveActorId('SCHOOL_ADMIN_A')
    const { error: disableError } = await service.from('profiles')
      .update({ is_disabled: true }).eq('id', adminId)
    expect(disableError).toBeNull()
    try {
      const denied = await admin.from('school_settings')
        .update({ settings: { sec02b: 'disabled-admin-edit' } }).eq('school_id', school('A'))
      if (denied.error) expect(denied.error.code).toBeTruthy()
      expect(await snapshot('A'), 'Disabled admin modified settings with live session')
        .toEqual({ sec02b: 'authorized-school-admin' })
    } finally {
      const { error: restoreError } = await service.from('profiles')
        .update({ is_disabled: false }).eq('id', adminId)
      expect(restoreError).toBeNull()
      localSql(`UPDATE public.school_settings
        SET settings = '${JSON.stringify(ownBefore)}'::jsonb
        WHERE school_id = '${school('A')}'::uuid;`)
    }
  })

  test('disabled instructor session cannot read same-school academic diagnostics', async () => {
    const service = getServiceClient()
    const uid = resolveActorId('INSTRUCTOR_A')
    const client = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)
    const { error: disabledError } = await service.from('profiles').update({ is_disabled: true }).eq('id', uid)
    expect(disabledError).toBeNull()
    try {
      for (const [table, id] of [
        ['student_progress', progress.A], ['grades', grades.A], ['assessments', assessments.A],
      ] as const) {
        const { data, error } = await client.from(table).select('id').eq('id', id)
        if (error) expect(error.code).toBeTruthy()
        expect(data ?? [], `Disabled instructor still reads ${table}`).toEqual([])
      }
    } finally {
      const { error: restoreError } = await service.from('profiles').update({ is_disabled: false }).eq('id', uid)
      expect(restoreError).toBeNull()
    }
  })
})
