/** SEC-RELEASE-02D-1D: real, already-issued JWT revocation on local Supabase. */
import { beforeAll, afterAll, describe, test, expect } from 'vitest'
import { execFileSync } from 'node:child_process'
import { getTestEnvironment } from '../setup/test-environment'
import { assertTestEnvironment } from '../setup/production-guard'
import { setupTestEnvironment, cleanupTestEnvironment, createAuthenticatedClient, getServiceClient, resolveActorId } from '../setup/db-helpers'
import { TEST_ACTORS } from '../setup/test-actors'

function examSnapshot(): string {
  assertTestEnvironment()
  return execFileSync('psql', [getTestEnvironment().databaseUrl, '-X', '-q', '-A', '-t',
    '-v', 'ON_ERROR_STOP=1', '-c',
    `SELECT jsonb_build_object(
      'attempts', (SELECT count(*) FROM public.comprehensive_exam_attempts),
      'items', (SELECT count(*) FROM public.comprehensive_exam_attempt_items),
      'events', (SELECT count(*) FROM public.comprehensive_exam_attempt_events)
    )::text;`], { encoding: 'utf8' }).trim()
}

const calls = [
  ['get_comprehensive_exam_attempt', { p_attempt_id: '00000000-0000-0000-0000-000000000001' }],
  ['save_comprehensive_exam_answer', { p_attempt_id: '00000000-0000-0000-0000-000000000001', p_position: 1, p_selected_option: 'a' }],
  ['submit_comprehensive_exam_attempt', { p_attempt_id: '00000000-0000-0000-0000-000000000001' }],
  ['get_my_comprehensive_exam_history', {}],
] as const

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
  const actor = TEST_ACTORS.STUDENT_A
  const id = resolveActorId('STUDENT_A')
  const { error } = await getServiceClient().from('profiles').upsert({
    id, email: actor.email, full_name: '02D local student', role: 'student',
    school_id: actor.schoolId, approval_status: 'approved',
    is_disabled: false, requires_password_change: false,
  })
  expect(error).toBeNull()
})
afterAll(async () => { await cleanupTestEnvironment() })

describe('02D comprehensive exam direct RPC existing-session revocation', () => {
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
        const { data, error } = await client.rpc(rpc, params)
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
