/** Disposable persistence test for support audit true-actor provenance. */
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
// Next.js server-only sentinel is intended for bundlers, not Node integration tests.
vi.mock('server-only', () => ({}))
import { assertTestEnvironment } from '../setup/production-guard'
import { setupTestEnvironment, cleanupTestEnvironment, getServiceClient, resolveActorId } from '../setup/db-helpers'
import { TEST_SCHOOLS } from '../setup/test-actors'
import { logSupportAction, type SupportAccessContext } from '../../../src/lib/support-access'

const recorded: string[] = []
beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
})
afterAll(async () => {
  if (recorded.length) {
    await getServiceClient().from('security_logs').delete().in('id', recorded)
  }
  await cleanupTestEnvironment()
})
describe('persisted support-mode true-actor audit', () => {
  test('schedule and escalation actions retain real actor and selected instructor as distinct IDs', async () => {
    const actorId = resolveActorId('PLATFORM_ADMIN')
    const targetId = resolveActorId('INSTRUCTOR_A')
    const schoolId = TEST_SCHOOLS.SCHOOL_A.id
    const context = {
      actorUserId: actorId,
      actorEmail: 'operator@test.invalid',
      actorProfile: { id: actorId, role: 'admin', school_id: null },
      effectiveProfile: { id: targetId, role: 'instructor', school_id: schoolId },
      supportActive: true,
      targetProfile: { id: targetId, role: 'instructor', school_id: schoolId },
    } as SupportAccessContext
    const marker = `audit-fixture-${actorId}`
    for (const action of ['acknowledge_escalation', 'save_schedule_override']) {
      await logSupportAction(context, action, 'disposable_attribution_test', { marker, effectiveRole: 'instructor' })
    }
    const { data, error } = await getServiceClient().from('security_logs')
      .select('id,user_id,school_id,action,metadata')
      .eq('resource', 'disposable_attribution_test')
      .eq('user_id', actorId)
      .in('action', ['acknowledge_escalation', 'save_schedule_override'])
    expect(error).toBeNull()
    expect(data).toHaveLength(2)
    for (const row of data ?? []) {
      recorded.push(row.id)
      expect(row.user_id).toBe(actorId)
      expect(row.school_id).toBe(schoolId)
      expect(row.metadata.trueActorId).toBe(actorId)
      expect(row.metadata.targetProfileId).toBe(targetId)
      expect(row.metadata.targetProfileId).not.toBe(row.user_id)
    }
  })
})
