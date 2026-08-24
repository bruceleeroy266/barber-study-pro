/**
 * Security Logging Integration Tests
 *
 * Verifies the real persistence and RLS boundary used by the application
 * security logger. Raw database denials do not automatically invoke
 * application logging, so each positive control writes through the trusted
 * service-role boundary and reads through the affected user's session.
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import {
  setupTestEnvironment,
  cleanupTestEnvironment,
  createAuthenticatedClient,
  createAnonClient,
  getServiceClient,
  resolveActorId,
} from '../setup/db-helpers'
import { TEST_ACTORS, type TestActor } from '../setup/test-actors'

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
})

afterAll(async () => {
  await cleanupTestEnvironment()
})

type SecurityEventType =
  | 'failed_login'
  | 'permission_denied'
  | 'role_change'
  | 'school_isolation_violation'
  | 'sensitive_config_change'

type SecurityEventResult = 'denied' | 'success' | 'failure'

function marker(label: string): string {
  return `integration-${label}-${Date.now()}-${crypto.randomUUID()}`
}

async function persistSecurityEvent(
  actorKey: keyof typeof TEST_ACTORS,
  type: SecurityEventType,
  result: SecurityEventResult,
  resourceId: string
): Promise<string> {
  const actor = TEST_ACTORS[actorKey]
  const userId = resolveActorId(actorKey)
  const { error } = await getServiceClient().from('security_logs').insert({
    type,
    user_id: userId,
    email: actor.email,
    role: actor.role,
    school_id: actor.schoolId,
    resource: 'integration-security-control',
    resource_id: resourceId,
    action: 'verify',
    result,
    reason: `Positive control for ${type}`,
    metadata: { source: 'integration-test' },
  })

  expect(error).toBeNull()
  return userId
}

async function readOwnEvent(actor: TestActor, resourceId: string) {
  const client = await createAuthenticatedClient(actor)
  const { data, error } = await client
    .from('security_logs')
    .select('*')
    .eq('resource_id', resourceId)
    .single()

  expect(error).toBeNull()
  expect(data).toBeDefined()
  return data
}

describe('Security Logging Persistence and Access Controls', () => {
  test('Trusted server logging persists a complete security event', async () => {
    const resourceId = marker('complete-event')
    const userId = await persistSecurityEvent('STUDENT_A', 'permission_denied', 'denied', resourceId)
    const log = await readOwnEvent(TEST_ACTORS.STUDENT_A, resourceId)

    expect(log).toMatchObject({
      type: 'permission_denied',
      user_id: userId,
      email: TEST_ACTORS.STUDENT_A.email,
      role: 'student',
      school_id: TEST_ACTORS.STUDENT_A.schoolId,
      resource: 'integration-security-control',
      resource_id: resourceId,
      action: 'verify',
      result: 'denied',
    })
    expect(log.id).toBeDefined()
    expect(log.reason).toBeDefined()
    expect(log.metadata).toEqual({ source: 'integration-test' })
    expect(log.created_at).toBeDefined()
  })

  test('Event owner can read their own security log', async () => {
    const resourceId = marker('owner-read')
    await persistSecurityEvent('STUDENT_A', 'failed_login', 'failure', resourceId)

    const log = await readOwnEvent(TEST_ACTORS.STUDENT_A, resourceId)
    expect(log.resource_id).toBe(resourceId)
  })

  test('Another user cannot read the event owner security log', async () => {
    const resourceId = marker('cross-user-read')
    await persistSecurityEvent('STUDENT_A', 'permission_denied', 'denied', resourceId)

    const otherUser = await createAuthenticatedClient(TEST_ACTORS.STUDENT_B)
    const { data, error } = await otherUser
      .from('security_logs')
      .select('*')
      .eq('resource_id', resourceId)

    expect(error).toBeNull()
    expect(data).toEqual([])
  })

  test('Anonymous clients cannot read security logs', async () => {
    const resourceId = marker('anonymous-read')
    await persistSecurityEvent('STUDENT_A', 'permission_denied', 'denied', resourceId)

    const { data, error } = await createAnonClient()
      .from('security_logs')
      .select('*')
      .eq('resource_id', resourceId)

    expect(error).not.toBeNull()
    expect(data).toBeNull()
  })

  test('Authenticated users cannot forge security log entries', async () => {
    const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
    const { error } = await client.from('security_logs').insert({
      type: 'role_change',
      user_id: resolveActorId('STUDENT_A'),
      result: 'success',
      resource_id: marker('forged-event'),
    })

    expect(error).not.toBeNull()
  })

  test('Security logs are immutable to their owner', async () => {
    const resourceId = marker('immutable-event')
    await persistSecurityEvent('STUDENT_A', 'role_change', 'success', resourceId)
    const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

    const { error: updateError } = await client
      .from('security_logs')
      .update({ type: 'failed_login' })
      .eq('resource_id', resourceId)
    const { error: deleteError } = await client
      .from('security_logs')
      .delete()
      .eq('resource_id', resourceId)

    expect(updateError).not.toBeNull()
    expect(deleteError).not.toBeNull()

    const log = await readOwnEvent(TEST_ACTORS.STUDENT_A, resourceId)
    expect(log.type).toBe('role_change')
  })

  test.each([
    ['failed_login', 'failure'],
    ['permission_denied', 'denied'],
    ['role_change', 'success'],
    ['school_isolation_violation', 'denied'],
    ['sensitive_config_change', 'success'],
  ] as const)('%s events persist and are readable by the owner', async (type, result) => {
    const resourceId = marker(type)
    await persistSecurityEvent('STUDENT_A', type, result, resourceId)

    const log = await readOwnEvent(TEST_ACTORS.STUDENT_A, resourceId)
    expect(log).toMatchObject({ type, result, resource_id: resourceId })
  })
})
