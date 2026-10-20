/** Disposable persistence test for support audit true-actor provenance. */
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { execFileSync } from 'node:child_process'
// Next.js server-only sentinel is intended for bundlers, not Node integration tests.
vi.mock('server-only', () => ({}))
import { assertTestEnvironment } from '../setup/production-guard'
import { setupTestEnvironment, cleanupTestEnvironment, getServiceClient, resolveActorId } from '../setup/db-helpers'
import { TEST_SCHOOLS } from '../setup/test-actors'
import { logSupportAction, type SupportAccessContext } from '../../../src/lib/support-access'

const recorded: string[] = []
function testSql(statement: string): string {
  assertTestEnvironment()
  const url = process.env.TEST_DATABASE_URL
  if (!url || !/127\\.0\\.0\\.1|localhost/.test(url)) throw new Error('Disposable local test database required')
  return execFileSync('psql', [url, '-X', '-q', '-t', '-A', '-v', 'ON_ERROR_STOP=1', '-c', statement], { encoding: 'utf8' }).trim()
}
beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
})
afterAll(async () => {
  if (recorded.length) {
    testSql(`delete from public.security_logs where id in (${recorded.map(id => `'${id}'`).join(',')})`)
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
    // security_logs intentionally denies SELECT to PostgREST service_role.
    // Read only through disposable local PostgreSQL owner connection instead.
    const json = testSql(`select coalesce(json_agg(t), '[]'::json) from (
      select id,user_id,school_id,action,metadata from public.security_logs
      where resource='disposable_attribution_test' and user_id='${actorId}'
      and action in ('acknowledge_escalation','save_schedule_override')
    ) t`)
    const data = JSON.parse(json) as Array<{id:string,user_id:string,school_id:string,metadata:{trueActorId:string,targetProfileId:string}}>
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
