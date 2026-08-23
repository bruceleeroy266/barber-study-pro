/**
 * RLS Tenant Isolation Tests
 * 
 * Verifies that Row Level Security prevents cross-school data access.
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
import { TEST_ACTORS, TEST_SCHOOLS, TEST_PROGRAMS } from '../setup/test-actors'

// Verify production safety before running tests
beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
})

afterAll(async () => {
  await cleanupTestEnvironment()
})

describe('RLS Tenant Isolation', () => {
  describe('Cross-School Read Access', () => {
    test('Student A cannot read School B students', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      // Should return empty array (RLS filters out unauthorized rows)
      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    test('Instructor A cannot read School B students', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)

      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    test('School Admin A cannot read School B students', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    test('Student A cannot read School B instructors', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      const { data, error } = await client
        .from('instructors')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    test('School Admin A cannot read School B programs', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      const { data, error } = await client
        .from('programs')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    test('Student A cannot read School B profiles', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })
  })

  describe('Cross-School Write Access', () => {
    test('School Admin A cannot modify School B programs', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      const { error } = await client
        .from('programs')
        .update({ name: 'Hacked Program' })
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      // Should fail or affect 0 rows
      // RLS may return error or silently filter
      if (!error) {
        // Verify no rows were actually modified
        const serviceClient = getServiceClient()
        const { data } = await serviceClient
          .from('programs')
          .select('name')
          .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)
          .eq('name', 'Hacked Program')

        expect(data).toEqual([])
      }
    })

    test('Instructor A cannot create students in School B', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)
      const studentAId = resolveActorId('STUDENT_A')

      const { error } = await client
        .from('students')
        .insert({
          profile_id: studentAId,
          school_id: TEST_SCHOOLS.SCHOOL_B.id,
          student_number: 'HACKED-001',
        })

      // Should fail due to RLS
      expect(error).not.toBeNull()
    })

    test('School Admin A cannot delete School B programs', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      const { error } = await client
        .from('programs')
        .delete()
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      // Should fail or affect 0 rows
      if (!error) {
        // Verify programs still exist
        const serviceClient = getServiceClient()
        const { data } = await serviceClient
          .from('programs')
          .select('id')
          .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

        expect(data?.length).toBeGreaterThan(0)
      }
    })

    test('Student A cannot enroll in School B program', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const studentAId = resolveActorId('STUDENT_A')

      // First get student record
      const { data: studentData } = await client
        .from('students')
        .select('id')
        .eq('profile_id', studentAId)
        .single()

      if (studentData) {
        const { error } = await client
          .from('enrollments')
          .insert({
            student_id: studentData.id,
            program_id: TEST_PROGRAMS.PROGRAM_B.id,
          })

        // Should fail due to RLS or FK constraint
        expect(error).not.toBeNull()
      }
    })
  })

  describe('Same-School Access (Positive Tests)', () => {
    test('Student A can read own record', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      
      // Get the actual authenticated user ID (not the hardcoded fixture ID)
      const { data: { user } } = await client.auth.getUser()
      expect(user).toBeDefined()
      
      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('profile_id', user!.id)

      expect(error).toBeNull()
      expect(data?.length).toBe(1)
    })

    test('School Admin A can read School A students', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_A.id)

      // Positive control: school_admin must be able to read students in their own school.
      // Fixed by migration 20260822000002_phase_7a_slice7_school_admin_students_rls_fix.sql
      expect(error).toBeNull()
      expect(data?.length).toBeGreaterThan(0)
    })

    test('Instructor A can read School A programs', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)

      const { data, error } = await client
        .from('programs')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_A.id)

      expect(error).toBeNull()
      expect(data?.length).toBeGreaterThan(0)
    })
  })

  describe('Arbitrary school_id Mutation', () => {
    test('Student A cannot change own school_id', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const serviceClient = getServiceClient()
      
      // Get the actual authenticated user ID
      const { data: { user } } = await client.auth.getUser()
      expect(user).toBeDefined()

      // Get BEFORE state
      const { data: beforeProfile } = await serviceClient
        .from('profiles')
        .select('school_id')
        .eq('id', user!.id)
        .single()
      
      expect(beforeProfile?.school_id).toBe(TEST_SCHOOLS.SCHOOL_A.id)

      // Attempt to update own profile to School B
      const { error } = await client
        .from('profiles')
        .update({ school_id: TEST_SCHOOLS.SCHOOL_B.id })
        .eq('id', user!.id)

      // The mutation may succeed silently (no error) but be blocked by RLS/trigger
      // Verify school_id is STILL School A (persistence check)
      const { data: afterProfile } = await serviceClient
        .from('profiles')
        .select('school_id')
        .eq('id', user!.id)
        .single()

      // SECURITY INVARIANT: school_id must remain unchanged
      expect(afterProfile?.school_id).toBe(TEST_SCHOOLS.SCHOOL_A.id)
      expect(afterProfile?.school_id).toBe(beforeProfile?.school_id)
    })

    test('School Admin A cannot move student to School B', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
      const serviceClient = getServiceClient()
      
      // Get Student A's actual auth user ID
      const { data: users } = await serviceClient.auth.admin.listUsers()
      const studentAUser = users?.users?.find(u => u.email === TEST_ACTORS.STUDENT_A.email)
      expect(studentAUser).toBeDefined()

      // Get BEFORE state
      const { data: beforeStudent } = await serviceClient
        .from('students')
        .select('school_id')
        .eq('profile_id', studentAUser!.id)
        .single()
      
      expect(beforeStudent?.school_id).toBe(TEST_SCHOOLS.SCHOOL_A.id)

      // Attempt to update student's school_id
      const { error } = await client
        .from('students')
        .update({ school_id: TEST_SCHOOLS.SCHOOL_B.id })
        .eq('profile_id', studentAUser!.id)

      // The mutation may succeed silently (no error) but be blocked by RLS
      // Verify school_id is STILL School A (persistence check)
      const { data: afterStudent } = await serviceClient
        .from('students')
        .select('school_id')
        .eq('profile_id', studentAUser!.id)
        .single()

      // SECURITY INVARIANT: school_id must remain unchanged
      expect(afterStudent?.school_id).toBe(TEST_SCHOOLS.SCHOOL_A.id)
      expect(afterStudent?.school_id).toBe(beforeStudent?.school_id)
    })
  })

  describe('Unauthenticated Access', () => {
    test('Anonymous user cannot read students', async () => {
      const { createAnonClient } = await import('../setup/db-helpers')
      const client = createAnonClient()

      const { data, error } = await client
        .from('students')
        .select('*')

      // Anonymous users have NO SELECT grant on students table
      // This results in a permission denied error (PostgreSQL error 42501)
      // The security requirement is that NO protected data is returned
      expect(error).not.toBeNull()
      expect(error?.code).toBe('42501') // permission denied
      expect(data).toBeNull() // No data returned
    })

    test('Anonymous user cannot read profiles', async () => {
      const { createAnonClient } = await import('../setup/db-helpers')
      const client = createAnonClient()

      const { data, error } = await client
        .from('profiles')
        .select('*')

      // Anonymous users have NO SELECT grant on profiles table
      // This results in a permission denied error (PostgreSQL error 42501)
      // The security requirement is that NO protected data is returned
      expect(error).not.toBeNull()
      expect(error?.code).toBe('42501') // permission denied
      expect(data).toBeNull() // No data returned
    })

    test('Anonymous user cannot write to programs', async () => {
      const { createAnonClient } = await import('../setup/db-helpers')
      const client = createAnonClient()

      const { error } = await client
        .from('programs')
        .insert({
          school_id: TEST_SCHOOLS.SCHOOL_A.id,
          name: 'Hacked Program',
        })

      expect(error).not.toBeNull()
    })
  })
})
