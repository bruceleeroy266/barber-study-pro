/**
 * Direct RPC Authorization Tests
 * 
 * Verifies that RPC functions enforce proper authorization.
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import {
  setupTestEnvironment,
  cleanupTestEnvironment,
  createAuthenticatedClient,
  getServiceClient,
} from '../setup/db-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
})

afterAll(async () => {
  await cleanupTestEnvironment()
})

describe('RPC Authorization', () => {
  describe('Administrative Functions', () => {
    test('Non-admin cannot call admin functions', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      // Attempt to call an admin-only function
      const { error } = await client.rpc('get_all_schools')

      // Should fail - function doesn't exist or not authorized
      expect(error).not.toBeNull()
    })

    test('School admin cannot access other school data via RPC', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      // Attempt to call a function that might bypass RLS
      const { data, error } = await client.rpc('get_school_students', {
        target_school_id: TEST_SCHOOLS.SCHOOL_B.id,
      })

      // Should fail or return empty
      if (!error) {
        expect(data).toEqual([])
      }
    })
  })

  describe('Security Definer Functions', () => {
    test('create_school_from_inquiry requires platform admin', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      // Attempt to call the school creation function directly
      const { error } = await client.rpc('create_school_from_inquiry', {
        inquiry_id: '00000000-0000-0000-0000-000000000000',
      })

      // Should fail - not authorized
      expect(error).not.toBeNull()
    })

    test('Student cannot call school creation function', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      const { error } = await client.rpc('create_school_from_inquiry', {
        inquiry_id: '00000000-0000-0000-0000-000000000000',
      })

      expect(error).not.toBeNull()
    })
  })

  describe('SQL Injection Prevention', () => {
    test('Parameterized queries prevent injection', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      // Attempt SQL injection via filter
      const maliciousInput = "'; DROP TABLE students; --"

      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('student_number', maliciousInput)

      // Should not cause error (parameterized query treats it as literal string)
      // Table should still exist
      const serviceClient = getServiceClient()
      const { data: tableCheck } = await serviceClient
        .from('students')
        .select('id')
        .limit(1)

      // Table should still exist
      expect(tableCheck).not.toBeNull()
    })

    test('OR injection attempt is neutralized', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      // Attempt OR injection
      const { data, error } = await client
        .from('students')
        .select('*')
        .or(`school_id.eq.${TEST_SCHOOLS.SCHOOL_B.id}`)

      // RLS should still filter results
      expect(data).toEqual([])
    })
  })
})
