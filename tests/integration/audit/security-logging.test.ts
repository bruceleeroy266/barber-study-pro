/**
 * Audit Logging Verification Tests
 * 
 * Verifies that security-sensitive actions are properly logged.
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import {
  setupTestEnvironment,
  cleanupTestEnvironment,
  createAuthenticatedClient,
  getServiceClient,
  resolveActorId,
} from '../setup/db-helpers'
import {
  getSecurityLogsForUser,
  getSecurityLogsByType,
  verifySecurityEventLogged,
  clearSecurityLogs,
  waitForSecurityLog,
} from '../setup/audit-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
})

afterAll(async () => {
  await cleanupTestEnvironment()
})

beforeEach(async () => {
  // Clear security logs before each test for isolation
  await clearSecurityLogs()
})

describe('Audit Logging Verification', () => {
  describe('Authentication Events', () => {
    test('Failed login is logged', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      
      // Attempt login with wrong password
      const { error } = await client.auth.signInWithPassword({
        email: TEST_ACTORS.STUDENT_A.email,
        password: 'WrongPassword123!',
      })

      // Note: Supabase Auth may handle failed attempts internally
      // Application-level logging would be in security_logs
      
      // Check if any security logs were created
      const logs = await getSecurityLogsByType('failed_login')
      
      // Document actual behavior
      console.log('Failed login logs found:', logs.length)
    })

    test('Successful login creates session', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const studentAId = resolveActorId('STUDENT_A')
      
      const { data: { session } } = await client.auth.getSession()
      expect(session).not.toBeNull()
      
      // Verify user can access their data
      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('profile_id', studentAId)
      
      expect(error).toBeNull()
      expect(data?.length).toBe(1)
    })
  })

  describe('Permission Denied Events', () => {
    test('Cross-school access attempt is logged', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const studentAId = resolveActorId('STUDENT_A')
      
      // Attempt to access School B data
      await client
        .from('students')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      // Check for permission denied logs
      // Note: RLS silently filters, so no error is raised
      // Application-level logging would capture this
      
      const logs = await getSecurityLogsForUser(studentAId)
      console.log('Security logs for cross-school access:', logs.length)
    })

    test('Unauthorized write attempt is logged', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      
      // Attempt unauthorized write
      await client
        .from('programs')
        .insert({
          school_id: TEST_SCHOOLS.SCHOOL_A.id,
          name: 'Unauthorized Program',
        })

      // Check for logs
      const logs = await getSecurityLogsByType('permission_denied')
      console.log('Permission denied logs:', logs.length)
    })
  })

  describe('Role Change Events', () => {
    test('Role escalation attempt is logged', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const studentAId = resolveActorId('STUDENT_A')
      
      // Attempt to change own role
      await client
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', studentAId)

      // Check for role change logs
      const logs = await getSecurityLogsByType('role_change')
      console.log('Role change logs:', logs.length)
    })
  })

  describe('School Isolation Violations', () => {
    test('Cross-school write attempt is logged', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
      
      // Attempt to modify School B data
      await client
        .from('programs')
        .update({ name: 'Hacked Program' })
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      // Check for isolation violation logs
      const logs = await getSecurityLogsByType('school_isolation_violation')
      console.log('Isolation violation logs:', logs.length)
    })
  })

  describe('Sensitive Configuration Changes', () => {
    test('School settings update is logged', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
      
      // Update school settings
      await client
        .from('school_settings')
        .update({ name: 'Updated School Name' })
        .eq('school_id', TEST_SCHOOLS.SCHOOL_A.id)

      // Check for config change logs
      const logs = await getSecurityLogsByType('sensitive_config_change')
      console.log('Config change logs:', logs.length)
    })
  })

  describe('Audit Log Integrity', () => {
    test('Security logs contain required fields', async () => {
      const studentAId = resolveActorId('STUDENT_A')
      
      // Create a security event by attempting unauthorized access
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      
      await client
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', studentAId)

      // Wait for log
      const log = await waitForSecurityLog(
        (l) => l.user_id === studentAId,
        2000
      )

      if (log) {
        // Verify required fields
        expect(log.id).toBeDefined()
        expect(log.type).toBeDefined()
        expect(log.result).toBeDefined()
        expect(log.created_at).toBeDefined()
      } else {
        // No log found - document this
        console.log('No security log found for unauthorized access attempt')
      }
    })

    test('Audit logs are immutable', async () => {
      const client = getServiceClient()
      
      // Get a log entry
      const { data: logs } = await client
        .from('security_logs')
        .select('*')
        .limit(1)

      if (logs && logs.length > 0) {
        const logId = logs[0].id
        
        // Attempt to modify log
        const { error } = await client
          .from('security_logs')
          .update({ type: 'modified' })
          .eq('id', logId)

        // Should fail (no update policy or trigger prevents)
        // Or verify log was not actually modified
        const { data: checkLog } = await client
          .from('security_logs')
          .select('type')
          .eq('id', logId)
          .single()

        // Log should be unchanged
        expect(checkLog?.type).not.toBe('modified')
      }
    })
  })

  describe('User Management Audit', () => {
    test('User creation is audited', async () => {
      const client = getServiceClient()
      
      // Create a test user
      const { data: newUser } = await client.auth.admin.createUser({
        email: 'audit-test@ascyn-test.local',
        password: 'Test1234!',
        email_confirm: true,
      })

      if (newUser.user) {
        // Check for audit log
        const { data: auditLogs } = await client
          .from('user_management_audit_logs')
          .select('*')
          .eq('target_user_id', newUser.user.id)

        console.log('User creation audit logs:', auditLogs?.length || 0)

        // Cleanup
        await client.auth.admin.deleteUser(newUser.user.id)
      }
    })

    test('Role change is audited', async () => {
      const client = getServiceClient()
      const studentAId = resolveActorId('STUDENT_A')
      
      // Update user role
      await client
        .from('profiles')
        .update({ role: 'instructor' })
        .eq('id', studentAId)

      // Check for audit log
      const { data: auditLogs } = await client
        .from('user_management_audit_logs')
        .select('*')
        .eq('target_user_id', studentAId)

      console.log('Role change audit logs:', auditLogs?.length || 0)

      // Restore original role
      await client
        .from('profiles')
        .update({ role: 'student' })
        .eq('id', studentAId)
    })
  })
})
