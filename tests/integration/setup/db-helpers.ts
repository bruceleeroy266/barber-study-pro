/**
 * Database Helpers for Integration Tests
 * 
 * Provides utilities for database setup, reset, and cleanup.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getTestEnvironment } from './test-environment'
import { TEST_ACTORS, TEST_SCHOOLS, TEST_PROGRAMS, TestActor } from './test-actors'

let serviceClient: SupabaseClient | null = null

// ============================================================================
// RUNTIME ACTOR ID RESOLUTION
// ============================================================================
// Supabase Auth generates its own UUIDs when creating users. The hardcoded
// TEST_ACTORS.*.id values are deterministic fixture identifiers used for
// domain records (students.id, instructors.id), NOT the actual auth.users.id.
//
// This map caches the actual auth user IDs resolved at runtime by email.
// Populated during createTestActors() and available via resolveActorId().
// ============================================================================

const resolvedActorIds: Map<string, string> = new Map()

/**
 * Returns the actual Supabase Auth user ID for a test actor, resolved at runtime.
 * Must be called after createTestActors() has run.
 *
 * @param actorKey - Key from TEST_ACTORS (e.g., 'STUDENT_A')
 * @returns The actual auth.users.id UUID
 * @throws If the actor has not been resolved yet
 */
export function resolveActorId(actorKey: keyof typeof TEST_ACTORS): string {
  const id = resolvedActorIds.get(actorKey)
  if (!id) {
    throw new Error(
      `Actor ID for ${actorKey} has not been resolved. ` +
      `Ensure createTestActors() has completed before calling resolveActorId().`
    )
  }
  return id
}

/**
 * Returns the actual Supabase Auth user ID for a test actor by email.
 * Uses the service client to look up the user.
 *
 * @param email - The actor's email address
 * @returns The actual auth.users.id UUID, or null if not found
 */
export async function resolveActorIdByEmail(email: string): Promise<string | null> {
  const client = getServiceClient()
  const { data: users } = await client.auth.admin.listUsers()
  const user = users?.users?.find(u => u.email === email)
  return user?.id ?? null
}

/**
 * Returns the resolved actor ID map (for debugging).
 */
export function getResolvedActorIds(): ReadonlyMap<string, string> {
  return resolvedActorIds
}

/**
 * Gets a service role client for administrative operations.
 * This client bypasses RLS and should only be used for setup/teardown.
 */
export function getServiceClient(): SupabaseClient {
  if (serviceClient) {
    return serviceClient
  }

  const env = getTestEnvironment()
  serviceClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return serviceClient
}

/**
 * Creates an authenticated client for a specific test actor.
 */
export async function createAuthenticatedClient(actor: TestActor): Promise<SupabaseClient> {
  const env = getTestEnvironment()
  const client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { error } = await client.auth.signInWithPassword({
    email: actor.email,
    password: actor.password,
  })

  if (error) {
    throw new Error(`Failed to authenticate as ${actor.email}: ${error.message}`)
  }

  return client
}

/**
 * Creates an unauthenticated client (anon key only).
 */
export function createAnonClient(): SupabaseClient {
  const env = getTestEnvironment()
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Creates all test actors in the database.
 * This includes auth users, profiles, and domain records.
 */
export async function createTestActors(): Promise<void> {
  const client = getServiceClient()

  console.log('[TestSetup] Creating test actors...')

  for (const [actorKey, actor] of Object.entries(TEST_ACTORS)) {
    let actualUserId: string
    
    // Check if user already exists by email
    const { data: existingUsers } = await client.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === actor.email)
    
    if (existingUser) {
      console.log(`[TestSetup] Actor ${actor.email} already exists, using existing ID...`)
      actualUserId = existingUser.id
      
      // Update password to ensure it's correct
      const { error: updateError } = await client.auth.admin.updateUserById(actualUserId, {
        password: actor.password,
        email_confirm: true,
      })
      if (updateError) {
        console.warn(`[TestSetup] Failed to update user ${actor.email}:`, updateError)
      }
    } else {
      // Create auth user
      const { data: authData, error: authError } = await client.auth.admin.createUser({
        email: actor.email,
        password: actor.password,
        email_confirm: true,
        user_metadata: {
          full_name: actor.fullName,
          role: actor.role,
        },
        app_metadata: {
          role: actor.role,
          school_id: actor.schoolId,
        },
      })

      if (authError) {
        throw new Error(`Failed to create auth user ${actor.email}: ${authError.message}`)
      }
      
      actualUserId = authData.user.id
    }

    // Cache the resolved ID for runtime lookups
    resolvedActorIds.set(actorKey, actualUserId)

    // Profile is created automatically by the on_auth_user_created trigger
    // We just need to update it with the correct role and school_id
    const { error: profileError } = await client
      .from('profiles')
      .update({
        role: actor.role,
        school_id: actor.schoolId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', actualUserId)

    if (profileError) {
      throw new Error(`Failed to update profile for ${actor.email}: ${profileError.message}`)
    }

    // Create domain records (students/instructors)
    // Use the actual auth user ID
    
    if (actor.role === 'student' && actor.domainId && actor.schoolId) {
      const { error: studentError } = await client
        .from('students')
        .upsert({
          id: actor.domainId,
          profile_id: actualUserId,
          school_id: actor.schoolId,
          student_number: `STU-${actualUserId.slice(0, 8)}`,
          enrollment_date: new Date().toISOString().split('T')[0],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        })

      if (studentError) {
        throw new Error(`Failed to create student record for ${actor.email}: ${studentError.message}`)
      }
    }

    if (actor.role === 'instructor' && actor.domainId && actor.schoolId) {
      const { error: instructorError } = await client
        .from('instructors')
        .upsert({
          id: actor.domainId,
          profile_id: actualUserId,
          school_id: actor.schoolId,
          license_number: `LIC-${actualUserId.slice(0, 8)}`,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id',
        })

      if (instructorError) {
        throw new Error(`Failed to create instructor record for ${actor.email}: ${instructorError.message}`)
      }
    }

    console.log(`[TestSetup] Created actor: ${actor.email} (${actor.role})`)
  }

  console.log('[TestSetup] All test actors created successfully')
}

/**
 * Deletes all test actors from the database.
 */
export async function deleteTestActors(): Promise<void> {
  const client = getServiceClient()

  console.log('[TestSetup] Deleting test actors...')

  for (const actor of Object.values(TEST_ACTORS)) {
    // Look up the actual auth user ID by email
    const { data: userData } = await client.auth.admin.listUsers()
    const actualUser = userData?.users?.find(u => u.email === actor.email)
    const actualUserId = actualUser?.id

    if (!actualUserId) {
      console.log(`[TestSetup] Actor ${actor.email} not found, skipping...`)
      continue
    }

    // Delete domain records first (due to FK constraints)
    if (actor.role === 'student') {
      await client.from('students').delete().eq('profile_id', actualUserId)
    }
    if (actor.role === 'instructor') {
      await client.from('instructors').delete().eq('profile_id', actualUserId)
    }

    // Delete profile
    await client.from('profiles').delete().eq('id', actualUserId)

    // Delete auth user
    await client.auth.admin.deleteUser(actualUserId)

    console.log(`[TestSetup] Deleted actor: ${actor.email}`)
  }

  // Clear the resolved ID cache
  resolvedActorIds.clear()

  console.log('[TestSetup] All test actors deleted')
}

/**
 * Resets the database to a clean state.
 * WARNING: This deletes ALL data in the database.
 */
export async function resetDatabase(): Promise<void> {
  const client = getServiceClient()

  console.log('[TestSetup] Resetting database...')

  // Delete in reverse order of dependencies
  const tables = [
    'enrollments',
    'students',
    'instructors',
    'programs',
    'school_settings',
    'school_onboarding_invitations',
    'pilot_inquiries',
    'security_logs',
    'user_management_audit_logs',
    'profiles',
  ]

  for (const table of tables) {
    const { error } = await client.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
    if (error && !error.message.includes('does not exist')) {
      console.warn(`[TestSetup] Warning deleting from ${table}:`, error.message)
    }
  }

  // Delete auth users (except service role)
  const { data: users } = await client.auth.admin.listUsers()
  for (const user of users?.users || []) {
    if (!user.email?.includes('@supabase.io')) {
      await client.auth.admin.deleteUser(user.id)
    }
  }

  console.log('[TestSetup] Database reset complete')
}

/**
 * Verifies that test schools exist in the database.
 */
export async function verifyTestSchools(): Promise<boolean> {
  const client = getServiceClient()

  console.log('[TestSetup] Verifying test schools...')
  console.log('[TestSetup] Looking for schools:', TEST_SCHOOLS.SCHOOL_A.id, TEST_SCHOOLS.SCHOOL_B.id)

  const { data: schools, error } = await client
    .from('schools')
    .select('id, name, slug')
    .in('id', [TEST_SCHOOLS.SCHOOL_A.id, TEST_SCHOOLS.SCHOOL_B.id])

  if (error) {
    console.error('[TestSetup] Error verifying schools:', error)
    return false
  }

  console.log('[TestSetup] Found schools:', schools)

  const schoolIds = schools?.map(s => s.id) || []
  const hasSchoolA = schoolIds.includes(TEST_SCHOOLS.SCHOOL_A.id)
  const hasSchoolB = schoolIds.includes(TEST_SCHOOLS.SCHOOL_B.id)

  if (!hasSchoolA || !hasSchoolB) {
    console.error('[TestSetup] Missing test schools:', { hasSchoolA, hasSchoolB })
    return false
  }

  console.log('[TestSetup] Test schools verified')
  return true
}

/**
 * Verifies that test programs exist in the database.
 */
export async function verifyTestPrograms(): Promise<boolean> {
  const client = getServiceClient()

  const { data: programs, error } = await client
    .from('programs')
    .select('id, name, school_id')
    .in('id', [TEST_PROGRAMS.PROGRAM_A.id, TEST_PROGRAMS.PROGRAM_B.id])

  if (error) {
    console.error('[TestSetup] Error verifying programs:', error)
    return false
  }

  const programIds = programs?.map(p => p.id) || []
  const hasProgramA = programIds.includes(TEST_PROGRAMS.PROGRAM_A.id)
  const hasProgramB = programIds.includes(TEST_PROGRAMS.PROGRAM_B.id)

  if (!hasProgramA || !hasProgramB) {
    console.error('[TestSetup] Missing test programs:', { hasProgramA, hasProgramB })
    return false
  }

  console.log('[TestSetup] Test programs verified')
  return true
}

/**
 * Sets up the complete test environment.
 * Creates actors, verifies schools/programs.
 */
export async function setupTestEnvironment(): Promise<void> {
  console.log('[TestSetup] Setting up test environment...')

  // Verify schools exist (from seed)
  const schoolsOk = await verifyTestSchools()
  if (!schoolsOk) {
    throw new Error('Test schools not found. Run `supabase db reset` to apply seeds.')
  }

  // Verify programs exist (from seed)
  const programsOk = await verifyTestPrograms()
  if (!programsOk) {
    throw new Error('Test programs not found. Run `supabase db reset` to apply seeds.')
  }

  // Create test actors
  await createTestActors()

  console.log('[TestSetup] Test environment setup complete')
}

/**
 * Cleans up the test environment.
 */
export async function cleanupTestEnvironment(): Promise<void> {
  console.log('[TestSetup] Cleaning up test environment...')
  await deleteTestActors()
  console.log('[TestSetup] Test environment cleanup complete')
}
