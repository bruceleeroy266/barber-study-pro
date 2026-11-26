/**
 * SEC-RELEASE-02A: disposable local tenant-isolation and RLS matrix.
 * No hosted DB, no external user accounts; guarded before all mutations.
 */
import { beforeAll, afterAll, describe, expect, test } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import {
  setupTestEnvironment, cleanupTestEnvironment, createAuthenticatedClient,
  getServiceClient, resolveActorId,
} from '../setup/db-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
})
afterAll(async () => { await cleanupTestEnvironment() })

describe('SEC-RELEASE-02A cross-school tenant isolation', () => {
  const scenarios = [
    { actor: 'STUDENT_A', target: 'STUDENT_B', targetSchool: 'SCHOOL_B' },
    { actor: 'STUDENT_B', target: 'STUDENT_A', targetSchool: 'SCHOOL_A' },
    { actor: 'INSTRUCTOR_A', target: 'STUDENT_B', targetSchool: 'SCHOOL_B' },
    { actor: 'INSTRUCTOR_B', target: 'STUDENT_A', targetSchool: 'SCHOOL_A' },
    { actor: 'SCHOOL_ADMIN_A', target: 'STUDENT_B', targetSchool: 'SCHOOL_B' },
    { actor: 'SCHOOL_ADMIN_B', target: 'STUDENT_A', targetSchool: 'SCHOOL_A' },
  ] as const

  test.each(scenarios)('$actor cannot read or modify $target school records', async ({ actor, target, targetSchool }) => {
    const client = await createAuthenticatedClient(TEST_ACTORS[actor])
    const targetId = resolveActorId(target)
    const targetSchoolId = TEST_SCHOOLS[targetSchool].id
    const targetDomainId = TEST_ACTORS[target].domainId!
    const service = getServiceClient()

    const { data: original, error: originalError } = await service
      .from('students').select('student_number,is_active,school_id').eq('id', targetDomainId).single()
    expect(originalError).toBeNull()
    expect(original?.school_id).toBe(targetSchoolId)

    for (const [table, field, value] of [
      ['students', 'id', targetDomainId],
      ['quiz_attempts', 'user_id', targetId],
    ] as const) {
      const { data, error } = await client.from(table).select('*').eq(field, value)
      // A lack of table privilege is also a safe denial; a returned row is not.
      expect(data ?? [], `${actor} disclosed ${table} rows of ${target}`).toEqual([])
      if (error) expect(error.code).toBeTruthy()
    }

    const { error: updateError } = await client.from('students')
      .update({ student_number: 'SEC-02A-INTRUSION' }).eq('id', targetDomainId)
    if (updateError) expect(updateError.code).toBeTruthy()
    const { data: after, error: afterError } = await service.from('students')
      .select('student_number,is_active,school_id').eq('id', targetDomainId).single()
    expect(afterError).toBeNull()
    expect(after).toEqual(original)
  })

  test('disabled student retains no cross-school read/write access', async () => {
    const service = getServiceClient()
    const actorId = resolveActorId('STUDENT_A')
    const otherId = TEST_ACTORS.STUDENT_B.domainId!
    const { error: disabledError } = await service.from('profiles')
      .update({ is_disabled: true }).eq('id', actorId)
    expect(disabledError).toBeNull()
    try {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const { data, error } = await client.from('students').select('*').eq('id', otherId)
      expect(data ?? []).toEqual([])
      if (error) expect(error.code).toBeTruthy()
      const { data: before } = await service.from('students').select('student_number').eq('id', otherId).single()
      await client.from('students').update({ student_number: 'SEC-02A-DISABLED' }).eq('id', otherId)
      const { data: after } = await service.from('students').select('student_number').eq('id', otherId).single()
      expect(after).toEqual(before)
    } finally {
      const { error: restored } = await service.from('profiles')
        .update({ is_disabled: false }).eq('id', actorId)
      expect(restored).toBeNull()
    }
  })
})
