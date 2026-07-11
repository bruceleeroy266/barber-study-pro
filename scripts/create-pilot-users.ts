import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Create approved pilot student and instructor accounts.
 *
 * Credentials are read from environment variables only and are never printed.
 * Re-running the script is safe: existing users are updated rather than duplicated.
 *
 * Required environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ASCYN_STUDENT_EMAIL
 *   ASCYN_STUDENT_PASSWORD
 *   ASCYN_INSTRUCTOR_EMAIL
 *   ASCYN_INSTRUCTOR_PASSWORD
 *
 * Usage:
 *   npx tsx scripts/create-pilot-users.ts
 */

interface PilotUser {
  email: string
  password: string
  role: 'student' | 'instructor'
  fullName: string
}

async function getOrCreateUser(
  supabase: SupabaseClient,
  pilot: PilotUser
): Promise<string> {
  // Check for existing user by email.
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error(`Failed to list users for ${pilot.email}:`, listError.message)
    process.exit(1)
  }

  const existing = listData?.users?.find((u) => u.email === pilot.email)

  if (existing) {
    // Update password and confirm email on existing user.
    const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
      password: pilot.password,
      email_confirm: true,
      user_metadata: { full_name: pilot.fullName, role: pilot.role },
    })
    if (updateError) {
      console.error(`Failed to update user ${pilot.email}:`, updateError.message)
      process.exit(1)
    }
    console.log(`Updated existing ${pilot.role}: ${pilot.email} (${existing.id})`)
    return existing.id
  }

  // Create new user.
  const { data: createData, error: createError } = await supabase.auth.admin.createUser({
    email: pilot.email,
    password: pilot.password,
    email_confirm: true,
    user_metadata: { full_name: pilot.fullName, role: pilot.role },
  })

  if (createError) {
    console.error(`Failed to create user ${pilot.email}:`, createError.message)
    process.exit(1)
  }

  const userId = createData.user?.id
  if (!userId) {
    console.error(`User creation returned no ID for ${pilot.email}`)
    process.exit(1)
  }

  console.log(`Created ${pilot.role}: ${pilot.email} (${userId})`)
  return userId
}

async function upsertProfile(
  supabase: SupabaseClient,
  userId: string,
  pilot: PilotUser
): Promise<void> {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      email: pilot.email,
      full_name: pilot.fullName,
      role: pilot.role,
      approval_status: 'approved',
      is_disabled: false,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )

  if (error) {
    console.error(`Failed to upsert profile for ${pilot.email}:`, error.message)
    process.exit(1)
  }

  console.log(`  profile upserted: role=${pilot.role}, approval_status=approved, is_disabled=false`)
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing required environment variable: ${name}`)
    process.exit(1)
  }
  return value
}

async function main() {
  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY')

  const student: PilotUser = {
    email: requireEnv('ASCYN_STUDENT_EMAIL'),
    password: requireEnv('ASCYN_STUDENT_PASSWORD'),
    role: 'student',
    fullName: 'Pilot Student',
  }

  const instructor: PilotUser = {
    email: requireEnv('ASCYN_INSTRUCTOR_EMAIL'),
    password: requireEnv('ASCYN_INSTRUCTOR_PASSWORD'),
    role: 'instructor',
    fullName: 'Pilot Instructor',
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  for (const pilot of [student, instructor]) {
    const userId = await getOrCreateUser(supabase, pilot)
    await upsertProfile(supabase, userId, pilot)
  }

  console.log('\nPilot accounts ready. Passwords are not displayed.')
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
