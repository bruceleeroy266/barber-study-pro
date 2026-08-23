/**
 * Role Escalation Tests
 * 
 * Verifies that users cannot escalate their privileges.
 * Tests actual runtime behavior with real authenticated clients.
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import {
  setupTestEnvironment,
  cleanupTestEnvironment,
  createAuthenticatedClient,
  getServiceClient,
  resolveActorId,
} from '../setup/db-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
})

afterAll(async () => {
  await cleanupTestEnvironment()
})

describe('Role Escalation Prevention', () => {
  describe('Student Role Escalation', () => {
    test('Student cannot become instructor', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const studentAId = resolveActorId('STUDENT_A')

      // Attempt to update own role to instructor
      const { error } = await client
        .from('profiles')
        .update({ role: 'instructor' })
        .eq('id', studentAId)

      // Verify role is still student
      const serviceClient = getServiceClient()
      const { data } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', studentAId)
        .single()

      expect(data?.role).toBe('student')
    })

    test('Student cannot become school_admin', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const studentAId = resolveActorId('STUDENT_A')

      const { error } = await client
        .from('profiles')
        .update({ role: 'school_admin' })
        .eq('id', studentAId)

      const serviceClient = getServiceClient()
      const { data } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', studentAId)
        .single()

      expect(data?.role).toBe('student')
    })

    test('Student cannot become admin', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const studentAId = resolveActorId('STUDENT_A')

      const { error } = await client
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', studentAId)

      const serviceClient = getServiceClient()
      const { data } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', studentAId)
        .single()

      expect(data?.role).toBe('student')
    })
  })

  describe('Instructor Role Escalation', () => {
    test('Instructor cannot become school_admin', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)
      const instructorAId = resolveActorId('INSTRUCTOR_A')

      const { error } = await client
        .from('profiles')
        .update({ role: 'school_admin' })
        .eq('id', instructorAId)

      const serviceClient = getServiceClient()
      const { data } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', instructorAId)
        .single()

      expect(data?.role).toBe('instructor')
    })

    test('Instructor cannot become admin', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)
      const instructorAId = resolveActorId('INSTRUCTOR_A')

      const { error } = await client
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', instructorAId)

      const serviceClient = getServiceClient()
      const { data } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', instructorAId)
        .single()

      expect(data?.role).toBe('instructor')
    })
  })

  describe('School Admin Role Escalation', () => {
    test('School Admin cannot become platform admin', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
      const schoolAdminAId = resolveActorId('SCHOOL_ADMIN_A')

      const { error } = await client
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', schoolAdminAId)

      const serviceClient = getServiceClient()
      const { data } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', schoolAdminAId)
        .single()

      expect(data?.role).toBe('school_admin')
    })

    test('School Admin cannot remove school association', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
      const schoolAdminAId = resolveActorId('SCHOOL_ADMIN_A')

      // Attempt to set school_id to null (becoming platform-level)
      const { error } = await client
        .from('profiles')
        .update({ school_id: null })
        .eq('id', schoolAdminAId)

      const serviceClient = getServiceClient()
      const { data } = await serviceClient
        .from('profiles')
        .select('school_id')
        .eq('id', schoolAdminAId)
        .single()

      expect(data?.school_id).toBe(TEST_SCHOOLS.SCHOOL_A.id)
    })
  })

  describe('Client-Supplied Role Manipulation', () => {
    test('Signup with admin role is sanitized', async () => {
      const { createAnonClient } = await import('../setup/db-helpers')
      const client = createAnonClient()

      // Attempt to sign up with admin role in metadata
      const { data, error } = await client.auth.signUp({
        email: 'hacker@ascyn-test.local',
        password: 'Test1234!',
        options: {
          data: {
            full_name: 'Hacker',
            role: 'admin', // Attempt to inject admin role
          },
        },
      })

      // Even if signup succeeds, role should be sanitized to student
      if (data.user) {
        const serviceClient = getServiceClient()
        const { data: profile } = await serviceClient
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        // Role should NOT be admin
        expect(profile?.role).not.toBe('admin')
        expect(profile?.role).toBe('student')

        // Cleanup
        await serviceClient.auth.admin.deleteUser(data.user.id)
      }
    })

    test('Metadata role injection is ignored', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const studentAId = resolveActorId('STUDENT_A')

      // Attempt to update user metadata
      const { error } = await client.auth.updateUser({
        data: { role: 'admin' },
      })

      // Metadata update may succeed, but profile role should be unchanged
      const serviceClient = getServiceClient()
      const { data } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', studentAId)
        .single()

      expect(data?.role).toBe('student')
    })
  })

  describe('Cross-School Privilege Escalation', () => {
    test('School Admin A cannot grant themselves access to School B', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      // Attempt to create a profile in School B with admin privileges
      const { error } = await client
        .from('profiles')
        .insert({
          id: '99999999-9999-9999-9999-999999999999',
          email: 'cross-school-admin@ascyn-test.local',
          full_name: 'Cross School Admin',
          role: 'school_admin',
          school_id: TEST_SCHOOLS.SCHOOL_B.id,
        })

      // Should fail due to RLS
      expect(error).not.toBeNull()
    })

    test('Instructor A cannot create instructor in School B', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)
      const instructorAId = resolveActorId('INSTRUCTOR_A')

      const { error } = await client
        .from('instructors')
        .insert({
          profile_id: instructorAId,
          school_id: TEST_SCHOOLS.SCHOOL_B.id,
          license_number: 'HACKED-001',
        })

      expect(error).not.toBeNull()
    })
  })

  describe('Unauthenticated Protected Operations', () => {
    test('Anonymous cannot create admin user', async () => {
      const { createAnonClient } = await import('../setup/db-helpers')
      const client = createAnonClient()

      const { error } = await client
        .from('profiles')
        .insert({
          id: '88888888-8888-8888-8888-888888888888',
          email: 'anon-admin@ascyn-test.local',
          full_name: 'Anonymous Admin',
          role: 'admin',
          school_id: null,
        })

      expect(error).not.toBeNull()
    })

    test('Anonymous cannot modify roles', async () => {
      const { createAnonClient } = await import('../setup/db-helpers')
      const client = createAnonClient()
      const studentAId = resolveActorId('STUDENT_A')

      const { error } = await client
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', studentAId)

      expect(error).not.toBeNull()
    })
  })
})
