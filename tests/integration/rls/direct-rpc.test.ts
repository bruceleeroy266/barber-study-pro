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
  createAnonClient,
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
  describe('SEC-RELEASE-01E academic RPC service-only contract', () => {
    const calls = [
      { name: 'check_sustained_performance_reset_eligibility', args: { p_user_id: TEST_ACTORS.STUDENT_B.id, p_concept_id: 'test-concept' } },
      { name: 'execute_sustained_performance_reset', args: { p_user_id: TEST_ACTORS.STUDENT_B.id, p_concept_id: 'test-concept', p_executed_by: TEST_ACTORS.STUDENT_A.id } },
      { name: 'record_detection_state_transition', args: { p_user_id: TEST_ACTORS.STUDENT_B.id, p_concept_id: 'test-concept', p_chapter_id: 'ch-2', p_new_state: 'currently_performing_well', p_evidence: {} } },
      { name: 'record_follow_up_evidence', args: { p_user_id: TEST_ACTORS.STUDENT_B.id, p_concept_id: 'test-concept', p_chapter_id: 'ch-2', p_quiz_attempt_id: '00000000-0000-0000-0000-000000000001', p_canonical_mapping_verified: true, p_mapped_question_count: 1 } },
    ] as const

    for (const call of calls) {
      test(`anonymous caller cannot execute ${call.name}`, async () => {
        const { error } = await createAnonClient().rpc(call.name, call.args)
        expect(error, 'Expected an authorization failure, not an empty success result').not.toBeNull()
        // PostgREST may conceal the function entirely or return a permission error.
        expect(['42501', 'PGRST202', 'PGRST301']).toContain(error!.code)
      })

      test(`student cannot execute ${call.name} for another school`, async () => {
        const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
        const { error } = await client.rpc(call.name, call.args)
        expect(error).not.toBeNull()
        expect(['42501', 'PGRST202', 'PGRST301']).toContain(error!.code)
      })

      test(`school administrator cannot execute ${call.name} directly`, async () => {
        const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
        const { error } = await client.rpc(call.name, call.args)
        expect(error).not.toBeNull()
        expect(['42501', 'PGRST202', 'PGRST301']).toContain(error!.code)
      })
    }

    test('trusted service role retains read-only eligibility RPC access', async () => {
      const { error } = await getServiceClient().rpc(
        'check_sustained_performance_reset_eligibility',
        { p_user_id: '00000000-0000-0000-0000-000000000001', p_concept_id: 'nonexistent-concept' },
      )
      expect(error).toBeNull()
    })
  })

})
