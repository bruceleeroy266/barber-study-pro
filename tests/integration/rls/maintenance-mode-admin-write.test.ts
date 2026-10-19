/**
 * RLS maintenance_mode_admin_write Tests (ASCYN-SECURITY-1D)
 *
 * Verifies migration 20261017120000_restrict_maintenance_mode_admin_write:
 *
 *   The global maintenance_mode write policy must require platform-level
 *   administrators: profiles.role='admin' AND school_id IS NULL
 *   (is_platform_admin()), or role='platform_super_admin'
 *   (is_platform_super_admin()).
 *
 *   Before the migration the policy used a bare profiles.role='admin' check:
 *   any school-attached admin could modify the platform-global maintenance
 *   mode (defect), while platform_super_admin was denied (narrowness).
 *
 *   NEGATIVE: school-attached admin (role='admin', school_id set), instructor,
 *   student, and anonymous clients cannot INSERT/UPDATE/DELETE maintenance_mode.
 *   POSITIVE: platform admin (role='admin', school_id IS NULL) and
 *   platform_super_admin CAN write. Read paths are unchanged for every role.
 *
 * Requires a real test Supabase (see tests/integration/setup) with migration
 * 20261017120000_restrict_maintenance_mode_admin_write applied (standard
 * integration setup applies repo migrations). These tests share test actors
 * and MUST run sequentially (vitest.integration.config.ts).
 *
 * SQL-level twins of T1-T11 also PASSED (18/18) in an isolated PostgreSQL
 * 15.19 harness on 2026-10-17 (ASCYN-SECURITY-1C report).
 */

import { describe, test, expect, beforeAll, afterAll } from 'vitest'
import { assertTestEnvironment } from '../setup/production-guard'
import {
  setupTestEnvironment,
  cleanupTestEnvironment,
  createAuthenticatedClient,
  createAnonClient,
  getServiceClient,
} from '../setup/db-helpers'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'
import type { SupabaseClient } from '@supabase/supabase-js'

// Custom fixture actors required by this suite (not part of TEST_ACTORS):
// the defect actor needs role='admin' WITH a school (bare-role defect path),
// and the access-fix actor needs role='platform_super_admin'.
const SCHOOL_ATTACHED_ADMIN = {
  email: 'sec1-school-attached-admin@ascyn-test.local',
  password: 'Test1234!',
  fullName: 'SEC1 School Attached Admin',
  role: 'admin' as const,
  schoolId: TEST_SCHOOLS.SCHOOL_A.id as string | null,
}

const PLATFORM_SUPER_ADMIN = {
  email: 'sec1-platform-super-admin@ascyn-test.local',
  password: 'Test1234!',
  fullName: 'SEC1 Platform Super Admin',
  role: 'platform_super_admin' as const,
  schoolId: null as string | null,
}

let maintenanceRowId: string
const customUserIds: string[] = []

async function ensureActor(actor: typeof SCHOOL_ATTACHED_ADMIN | typeof PLATFORM_SUPER_ADMIN) {
  const service = getServiceClient()
  const { data: users } = await service.auth.admin.listUsers()
  let user = users?.users?.find((u) => u.email === actor.email)

  if (!user) {
    const { data, error } = await service.auth.admin.createUser({
      email: actor.email,
      password: actor.password,
      email_confirm: true,
      user_metadata: { full_name: actor.fullName, role: actor.role },
      app_metadata: { role: actor.role, school_id: actor.schoolId },
    })
    if (error) throw new Error(`Failed to create fixture user ${actor.email}: ${error.message}`)
    user = data.user
  } else {
    await service.auth.admin.updateUserById(user.id, { password: actor.password, email_confirm: true })
  }

  // Enforce exact contract fields on the profile (id = auth user id).
  const { error: profileError } = await service
    .from('profiles')
    .upsert({ id: user.id, role: actor.role, school_id: actor.schoolId }, { onConflict: 'id' })
  if (profileError) throw new Error(`Failed to upsert profile for ${actor.email}: ${profileError.message}`)

  customUserIds.push(user.id)
  return user.id
}

beforeAll(async () => {
  assertTestEnvironment()
  await setupTestEnvironment()
  await ensureActor(SCHOOL_ATTACHED_ADMIN)
  await ensureActor(PLATFORM_SUPER_ADMIN)

  const service = getServiceClient()
  const { data, error } = await service.from('maintenance_mode').select('id').limit(1).single()
  if (error || !data) throw new Error(`maintenance_mode seed row not found: ${error?.message}`)
  maintenanceRowId = data.id
})

afterAll(async () => {
  const service = getServiceClient()
  for (const id of customUserIds) {
    await service.auth.admin.deleteUser(id)
  }
  await cleanupTestEnvironment()
})

/** UPDATE returns zero affected rows when RLS denies (silent filter), one row when allowed. */
async function updateAs(client: SupabaseClient) {
  return client
    .from('maintenance_mode')
    .update({ message: 'sec1-rls-test write' })
    .eq('id', maintenanceRowId)
    .select('id')
}

describe('maintenance_mode_admin_write RLS (migration 20261017120000)', () => {
  describe('NEGATIVE: school-attached admin (role=admin, school_id set) cannot write', () => {
    test('T1: UPDATE affects zero rows', async () => {
      const client = await createAuthenticatedClient({
        ...SCHOOL_ATTACHED_ADMIN,
        id: '',
        profileId: '',
      } as never)
      const { data, error } = await updateAs(client)
      expect(error).toBeNull()
      expect(data).toHaveLength(0)
    })

    test('T2: INSERT is denied by RLS with_check', async () => {
      const client = await createAuthenticatedClient({
        ...SCHOOL_ATTACHED_ADMIN,
        id: '',
        profileId: '',
      } as never)
      const { error } = await client
        .from('maintenance_mode')
        .insert({ enabled: false, message: 'sec1-rls-test insert' })
      expect(error).not.toBeNull()
    })

    test('T3: DELETE is denied (grant layer)', async () => {
      const client = await createAuthenticatedClient({
        ...SCHOOL_ATTACHED_ADMIN,
        id: '',
        profileId: '',
      } as never)
      const { error } = await client.from('maintenance_mode').delete().eq('id', maintenanceRowId)
      expect(error).not.toBeNull()
    })

    test('T4: SELECT still works (read path unchanged)', async () => {
      const client = await createAuthenticatedClient({
        ...SCHOOL_ATTACHED_ADMIN,
        id: '',
        profileId: '',
      } as never)
      const { data, error } = await client.from('maintenance_mode').select('id')
      expect(error).toBeNull()
      expect((data ?? []).length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('NEGATIVE: instructor, student, anonymous cannot write', () => {
    test('T5: instructor UPDATE affects zero rows', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.INSTRUCTOR_A)
      const { data, error } = await updateAs(client)
      expect(error).toBeNull()
      expect(data).toHaveLength(0)
    })

    test('T6: student UPDATE affects zero rows', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
      const { data, error } = await updateAs(client)
      expect(error).toBeNull()
      expect(data).toHaveLength(0)
    })

    test('T7: anonymous UPDATE is denied (grant layer)', async () => {
      const client = createAnonClient()
      const { error } = await updateAs(client)
      expect(error).not.toBeNull()
    })

    test('T11: anonymous SELECT still works', async () => {
      const client = createAnonClient()
      const { data, error } = await client.from('maintenance_mode').select('id')
      expect(error).toBeNull()
      expect((data ?? []).length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('POSITIVE: intended platform writers retain access', () => {
    test('T8: platform admin (role=admin, school_id IS NULL) CAN UPDATE', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
      const { data, error } = await updateAs(client)
      expect(error).toBeNull()
      expect(data).toHaveLength(1)
    })

    test('T9: platform admin CAN SELECT', async () => {
      const client = await createAuthenticatedClient(TEST_ACTORS.PLATFORM_ADMIN)
      const { data, error } = await client.from('maintenance_mode').select('id')
      expect(error).toBeNull()
      expect((data ?? []).length).toBeGreaterThanOrEqual(1)
    })

    test('T10: platform_super_admin CAN UPDATE (access fix — previously denied under the bare role check)', async () => {
      const client = await createAuthenticatedClient({
        ...PLATFORM_SUPER_ADMIN,
        id: '',
        profileId: '',
      } as never)
      const { data, error } = await updateAs(client)
      expect(error).toBeNull()
      expect(data).toHaveLength(1)
    })
  })
})
