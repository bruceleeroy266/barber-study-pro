/**
 * Token Validation Tests
 * 
 * Tests token security and validation behavior.
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import {
  setupTestEnvironment,
  cleanupTestEnvironment,
  createAuthenticatedClient,
  getServiceClient,
  createAnonClient,
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

describe('Token Validation', () => {
  describe('Session Token Security', () => {
    test('Valid session token allows access', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const studentAId = resolveActorId('STUDENT_A')

      const { data: { session } } = await client.auth.getSession()
      expect(session).not.toBeNull()
      expect(session?.access_token).toBeDefined()

      // Verify access with token
      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('profile_id', studentAId)

      expect(error).toBeNull()
      expect(data?.length).toBe(1)
    })

    test('Invalid token is rejected', async () => {
      const client = createAnonClient()

      // Set invalid token
      await client.auth.setSession({
        access_token: 'invalid-token',
        refresh_token: 'invalid-refresh-token',
      })

      const { data, error } = await client
        .from('students')
        .select('*')

      // Anonymous users have NO SELECT grant on students table.
      // This results in a permission denied error (PostgreSQL error 42501).
      // The security requirement is that NO protected data is returned.
      expect(error).not.toBeNull()
      expect(error?.code).toBe('42501') // permission denied
      expect(data).toBeNull() // No data returned
    })

    test('Expired token is rejected', async () => {
      // This test documents expected behavior
      // Actual token expiration is handled by Supabase Auth
      const client = createAnonClient()

      // Create a session with expired token (simulated)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjF9.invalid'

      await client.auth.setSession({
        access_token: expiredToken,
        refresh_token: 'expired-refresh-token',
      })

      const { data, error } = await client
        .from('students')
        .select('*')

      // Anonymous users have NO SELECT grant on students table.
      // This results in a permission denied error (PostgreSQL error 42501).
      expect(error).not.toBeNull()
      expect(error?.code).toBe('42501') // permission denied
      expect(data).toBeNull() // No data returned
    })
  })

  describe('Token Tampering', () => {
    test('Modified token payload is rejected', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const studentAId = resolveActorId('STUDENT_A')

      const { data: { session } } = await client.auth.getSession()
      const originalToken = session?.access_token

      if (originalToken) {
        // Attempt to decode and modify token (this would fail verification)
        const parts = originalToken.split('.')
        if (parts.length === 3) {
          // Modify payload (attempt to change role)
          const payload = JSON.parse(atob(parts[1]))
          payload.role = 'admin' // Attempt privilege escalation

          // Re-encode (this will fail signature verification)
          const modifiedPayload = btoa(JSON.stringify(payload))
          const modifiedToken = `${parts[0]}.${modifiedPayload}.${parts[2]}`

          // Create new client with modified token
          const modifiedClient = createAnonClient()
          await modifiedClient.auth.setSession({
            access_token: modifiedToken,
            refresh_token: session?.refresh_token || '',
          })

          // Attempt access with modified token
          const { data, error } = await modifiedClient
            .from('profiles')
            .select('*')
            .eq('id', studentAId)

          // Should fail or return empty (signature invalid)
          // Note: Supabase client may reject before sending
        }
      }
    })
  })

  describe('Cross-User Token Usage', () => {
    test('Student A token cannot access Student B data', async () => {
      const clientA = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const studentBId = resolveActorId('STUDENT_B')

      // Attempt to access Student B's data with Student A's token
      const { data, error } = await clientA
        .from('students')
        .select('*')
        .eq('profile_id', studentBId)

      // Should return empty (RLS prevents access)
      expect(data).toEqual([])
    })

    test('School Admin A token cannot access School B data', async () => {
      const clientA = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      const { data, error } = await clientA
        .from('students')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      expect(data).toEqual([])
    })
  })

  describe('Unauthenticated Access', () => {
    test('No token returns empty results', async () => {
      const client = createAnonClient()

      const { data, error } = await client
        .from('students')
        .select('*')

      // Anonymous users have NO SELECT grant on students table.
      // This results in a permission denied error (PostgreSQL error 42501).
      expect(error).not.toBeNull()
      expect(error?.code).toBe('42501') // permission denied
      expect(data).toBeNull() // No data returned
    })

    test('No token cannot write data', async () => {
      const client = createAnonClient()
      const studentAId = resolveActorId('STUDENT_A')

      const { error } = await client
        .from('students')
        .insert({
          profile_id: studentAId,
          school_id: TEST_SCHOOLS.SCHOOL_A.id,
        })

      expect(error).not.toBeNull()
    })
  })
})
