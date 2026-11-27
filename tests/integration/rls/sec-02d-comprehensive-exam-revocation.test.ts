/** SEC-RELEASE-02D-1D: real, already-issued JWT revocation on local Supabase. */
import { beforeAll, afterAll, describe, test, expect } from 'vitest'
import { execFileSync } from 'node:child_process'
import { getTestEnvironment } from '../setup/test-environment'
import { assertTestEnvironment } from '../setup/production-guard'
import { setupTestEnvironment, cleanupTestEnvironment, createAuthenticatedClient, getServiceClient, resolveActorId } from '../setup/db-helpers'
import { TEST_ACTORS } from '../setup/test-actors'

function sql(query: string): string {
  assertTestEnvironment()
  return execFileSync('psql', [getTestEnvironment().databaseUrl, '-X', '-q', '-A', '-t',
    '-v', 'ON_ERROR_STOP=1', '-c', query], { encoding: 'utf8' }).trim()
}

function examSnapshot(): string {
  assertTestEnvironment()
  return execFileSync('psql', [getTestEnvironment().databaseUrl, '-X', '-q', '-A', '-t',
    '-v', 'ON_ERROR_STOP=1', '-c',
    `SELECT jsonb_build_object(
      'attempts', (SELECT coalesce(jsonb_agg(to_jsonb(a) ORDER BY a.id), '[]'::jsonb) FROM public.comprehensive_exam_attempts a),
      'items', (SELECT coalesce(jsonb_agg(to_jsonb(i) ORDER BY i.id), '[]'::jsonb) FROM public.comprehensive_exam_attempt_items i),
      'events', (SELECT coalesce(jsonb_agg(to_jsonb(e) ORDER BY e.id), '[]'::jsonb) FROM public.comprehensive_exam_attempt_events e)
    )::text;`], { encoding: 'utf8' }).trim()
}

let attemptA: string
let attemptB: string

const calls = [
  ['get_comprehensive_exam_attempt', { p_attempt_id: '00000000-0000-0000-0000-000000000001' }],
  ['save_comprehensive_exam_answer', { p_attempt_id: '00000000-0000-0000-0000-000000000001', p_position: 1, p_selected_option: 'a' }],
  ['submit_comprehensive_exam_attempt', { p_attempt_id: '00000000-0000-0000-0000-000000000001' }],
  ['get_my_comprehensive_exam_history', {}],
] as const

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
  for (const key of ['STUDENT_A', 'STUDENT_B'] as const) {
    const actor = TEST_ACTORS[key]
    const id = resolveActorId(key)
    const { error } = await getServiceClient().from('profiles').upsert({
      id, email: actor.email, full_name: '02D local student', role: 'student',
      school_id: actor.schoolId, approval_status: 'approved',
      is_disabled: false, requires_password_change: false,
    })
    expect(error).toBeNull()
  }
  // Genuine persisted attempts in both tenants, with real session/config FKs.
  // The unique draft config avoids needing a 110-question active exam bank.
  const configId = sql(`INSERT INTO public.comprehensive_exam_configs
    (slug, version, title, status, blueprint_version, question_bank_version, scoring_policy_version)
    VALUES ('sec-02d-local-' || gen_random_uuid()::text, 1, '02D local', 'draft', 'test', 'test', 'test')
    RETURNING id::text;`)
  for (const key of ['STUDENT_A', 'STUDENT_B'] as const) {
    const id = resolveActorId(key)
    const school = TEST_ACTORS[key].schoolId
    const sessionId = sql(`INSERT INTO public.study_sessions (user_id,school_id,surface_type,surface_id)
      VALUES ('${id}'::uuid,'${school}'::uuid,'comprehensive_exam','02D-local') RETURNING id::text;`)
    const attemptId = sql(`INSERT INTO public.comprehensive_exam_attempts
      (user_id,school_id,config_id,config_version,blueprint_version,question_bank_version,
       scoring_policy_version,status,started_at,expires_at,attempt_number,study_session_id,
       time_limit_seconds_snapshot,passing_percentage_snapshot)
      VALUES ('${id}'::uuid,'${school}'::uuid,'${configId}'::uuid,1,'test','test','test',
       'active',clock_timestamp(),clock_timestamp()+interval '2 hours',1,'${sessionId}'::uuid,7200,75)
      RETURNING id::text;`)
    if (key === 'STUDENT_A') attemptA = attemptId
    else attemptB = attemptId
  }
  expect(attemptA).toBeTruthy()
  expect(attemptB).toBeTruthy()
})
afterAll(async () => { await cleanupTestEnvironment() })

describe('02D comprehensive exam direct RPC existing-session revocation', () => {
  test('real attempts are owner-scoped across school A and school B', async () => {
    const a = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
    const b = await createAuthenticatedClient(TEST_ACTORS.STUDENT_B)
    for (const [client, own, other] of [[a, attemptA, attemptB], [b, attemptB, attemptA]] as const) {
      const allowed = await client.rpc('get_comprehensive_exam_attempt', { p_attempt_id: own })
      expect(allowed.error).toBeNull()
      expect(allowed.data?.attemptId).toBe(own)
      const before = examSnapshot()
      for (const [rpc, args] of [
        ['get_comprehensive_exam_attempt', { p_attempt_id: other }],
        ['save_comprehensive_exam_answer', { p_attempt_id: other, p_position: 1, p_selected_option: 'a' }],
        ['submit_comprehensive_exam_attempt', { p_attempt_id: other }],
      ] as const) {
        const denied = await client.rpc(rpc, args)
        expect(denied.error, rpc + ' cross-school call succeeded').not.toBeNull()
        expect(denied.error?.message).toContain('Comprehensive exam attempt not found')
        expect(examSnapshot(), rpc + ' mutated cross-school exam records').toBe(before)
      }
    }
  })

  test('approved student has access to own empty history, then disabled JWT is denied across all four RPCs', async () => {
    const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
    const { data: initial, error: initialError } = await client.rpc('get_my_comprehensive_exam_history')
    expect(initialError).toBeNull()
    expect(Array.isArray(initial)).toBe(true)
    const id = resolveActorId('STUDENT_A')
    const { error: disableError } = await getServiceClient().from('profiles').update({ is_disabled: true }).eq('id', id)
    expect(disableError).toBeNull()
    const before = examSnapshot()
    try {
      for (const [rpc, params] of calls) {
        const actualParams = 'p_attempt_id' in params ? { ...params, p_attempt_id: attemptA } : params
        const { data, error } = await client.rpc(rpc, actualParams)
        expect(error, rpc + ' unexpectedly succeeded').not.toBeNull()
        expect(error?.message).toContain('Active approved learner account required')
        expect(data).toBeNull()
        expect(examSnapshot(), rpc + ' mutated exam database while disabled').toBe(before)
      }
    } finally {
      const { error } = await getServiceClient().from('profiles').update({ is_disabled: false }).eq('id', id)
      expect(error).toBeNull()
    }
    const restored = await client.rpc('get_my_comprehensive_exam_history')
    expect(restored.error).toBeNull()
  })
})
