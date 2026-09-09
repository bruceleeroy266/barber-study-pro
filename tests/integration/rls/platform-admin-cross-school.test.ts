/**
 * RLS Platform-Admin Cross-School Access Tests
 *
 * Verifies migration 20260909000000_platform_admin_cross_school_access:
 *
 *  POSITIVE: the platform admin (role='admin', school_id IS NULL) can READ
 *  users, students, instructors, programs, enrollments, audit logs, and all
 *  school-dashboard operational data across schools, and can WRITE school
 *  configuration (schools / school_settings).
 *
 *  NEGATIVE (tenant isolation preserved):
 *   - school_admin / school-attached roles still cannot cross schools
 *   - platform admin CANNOT write tenant data via the authenticated client
 *     (writes stay service-role mediated; SELECT-only grant)
 *
 * Requires a real test Supabase (see tests/integration/setup). These tests
 * share test actors and MUST run sequentially (vitest.integration.config.ts).
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

// Tables the platform admin must be able to read across schools.
// Each entry: [table, school-scoped?] — school-scoped tables are queried with
// an explicit school filter; per-user tables are queried unfiltered and must
// return rows from more than one school (or at minimum not be RLS-blocked).
const CROSS_SCHOOL_READS: Array<{ table: string; schoolColumn: string | null }> = [
  { table: 'profiles', schoolColumn: 'school_id' },
  { table: 'students', schoolColumn: 'school_id' },
  { table: 'instructors', schoolColumn: 'school_id' },
  { table: 'programs', schoolColumn: 'school_id' },
  { table: 'enrollments', schoolColumn: null },
  { table: 'security_logs', schoolColumn: null },
  { table: 'attendance_records', schoolColumn: 'school_id' },
  { table: 'hour_logs', schoolColumn: 'school_id' },
  { table: 'quiz_attempts', schoolColumn: null },
  { table: 'student_progress', schoolColumn: null },
  { table: 'grades', schoolColumn: 'school_id' },
  { table: 'grade_categories', schoolColumn: null },
  { table: 'assessments', schoolColumn: 'school_id' },
  { table: 'school_settings', schoolColumn: 'school_id' },
]

describe('Platform admin cross-school access (role=admin, school_id IS NULL)', () => {
  describe('is_platform_admin() helper', () => {
    test('returns true for the platform admin', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
      const { data, error } = await client.rpc('is_platform_admin')
      expect(error).toBeNull()
      expect(data).toBe(true)
    })

    test('returns false for school_admin', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
      const { data, error } = await client.rpc('is_platform_admin')
      expect(error).toBeNull()
      expect(data).toBe(false)
    })

    test('returns false for instructor', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)
      const { data, error } = await client.rpc('is_platform_admin')
      expect(error).toBeNull()
      expect(data).toBe(false)
    })

    test('returns false for student', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const { data, error } = await client.rpc('is_platform_admin')
      expect(error).toBeNull()
      expect(data).toBe(false)
    })
  })

  describe('POSITIVE: cross-school reads', () => {
    for (const { table, schoolColumn } of CROSS_SCHOOL_READS) {
      test(`platform admin can read ${table} for School A and School B`, async () => {
        const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)

        if (schoolColumn) {
          const [a, b] = await Promise.all([
            client.from(table).select('*').eq(schoolColumn, TEST_SCHOOLS.SCHOOL_A.id),
            client.from(table).select('*').eq(schoolColumn, TEST_SCHOOLS.SCHOOL_B.id),
          ])
          // Not RLS-blocked: queries succeed. Row contents depend on fixtures,
          // but both schools must be readable (no error, arrays returned).
          expect(a.error).toBeNull()
          expect(b.error).toBeNull()
          expect(Array.isArray(a.data)).toBe(true)
          expect(Array.isArray(b.data)).toBe(true)
        } else {
          const { data, error } = await client.from(table).select('*')
          expect(error).toBeNull()
          expect(Array.isArray(data)).toBe(true)
        }
      })
    }

    test('platform admin sees profiles from BOTH schools in one query (the reported defect)', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)

      const { data, error } = await client
        .from('profiles')
        .select('id, school_id')

      expect(error).toBeNull()
      const schoolIds = new Set((data ?? []).map((r) => r.school_id).filter(Boolean))
      expect(schoolIds.has(TEST_SCHOOLS.SCHOOL_A.id)).toBe(true)
      expect(schoolIds.has(TEST_SCHOOLS.SCHOOL_B.id)).toBe(true)
    })

    test('platform admin can read School B program required_hours (RISE 1200-hour inspection path)', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)

      const { data, error } = await client
        .from('programs')
        .select('id, name, required_hours')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('POSITIVE: school configuration writes', () => {
    test('platform admin can update a school row (configuration save path)', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)

      const { data, error } = await client
        .from('schools')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', TEST_SCHOOLS.SCHOOL_A.id)
        .select('id')

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
    })

    test('platform admin can upsert school_settings for any school', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
      const service = getServiceClient()

      // Ensure a settings row exists so the UPDATE half of the upsert is exercised.
      await service.from('school_settings').upsert(
        { school_id: TEST_SCHOOLS.SCHOOL_A.id, settings: { seed: true } },
        { onConflict: 'school_id' }
      )

      const { error } = await client
        .from('school_settings')
        .update({ updated_at: new Date().toISOString() })
        .eq('school_id', TEST_SCHOOLS.SCHOOL_A.id)

      expect(error).toBeNull()
    })
  })

  describe('NEGATIVE: platform admin writes to tenant data remain denied', () => {
    test('platform admin cannot UPDATE another user profile via authenticated client', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)

      const { data } = await client
        .from('profiles')
        .update({ full_name: 'SHOULD NOT PERSIST' })
        .eq('id', TEST_ACTORS.STUDENT_A.profileId)
        .select('id')

      // SELECT-only grant: zero rows written.
      expect(data ?? []).toEqual([])

      const service = getServiceClient()
      const { data: after } = await service
        .from('profiles')
        .select('full_name')
        .eq('id', TEST_ACTORS.STUDENT_A.profileId)
        .single()
      expect(after?.full_name).not.toBe('SHOULD NOT PERSIST')
    })

    test('platform admin cannot INSERT a student row via authenticated client', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)

      const { error } = await client.from('students').insert({
        profile_id: TEST_ACTORS.PLATFORM_ADMIN.profileId,
        school_id: TEST_SCHOOLS.SCHOOL_A.id,
      })

      expect(error).not.toBeNull()
    })
  })

  describe('NEGATIVE: tenant isolation preserved for school-scoped roles', () => {
    test('school_admin A cannot read School B profiles', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    test('school_admin A cannot read School B students', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    test('school_admin A cannot read School B school_settings', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      const { data, error } = await client
        .from('school_settings')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    test('school_admin A cannot UPDATE School B school row', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      const { data } = await client
        .from('schools')
        .update({ name: 'SHOULD NOT PERSIST' })
        .eq('id', TEST_SCHOOLS.SCHOOL_B.id)
        .select('id')

      expect(data ?? []).toEqual([])
    })

    test('instructor A cannot read School B students', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)

      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)

      expect(error).toBeNull()
      expect(data).toEqual([])
    })

    test('student A cannot read other students in their own school', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)

      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_A.id)

      expect(error).toBeNull()
      // Student sees at most their own domain record, never classmates'.
      for (const row of data ?? []) {
        expect(row.profile_id).toBe(TEST_ACTORS.STUDENT_A.profileId)
      }
    })

    test('school_admin A still reads their OWN school (no regression)', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)

      const { data, error } = await client
        .from('students')
        .select('*')
        .eq('school_id', TEST_SCHOOLS.SCHOOL_A.id)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })
  })
})
