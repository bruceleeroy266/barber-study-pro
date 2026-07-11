import { createClient } from '@supabase/supabase-js'

/**
 * Create the initial ASCYN PRO admin user.
 *
 * This script is intended to be run once by a trusted operator in a secure
 * environment. Credentials are read from environment variables only and are
 * never committed to source control.
 *
 * Required environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ASCYN_ADMIN_EMAIL
 *   ASCYN_ADMIN_PASSWORD
 *   ASCYN_ADMIN_FULL_NAME (optional)
 *
 * Usage:
 *   npx tsx scripts/create-admin-user.ts
 */

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const email = process.env.ASCYN_ADMIN_EMAIL
  const password = process.env.ASCYN_ADMIN_PASSWORD
  const fullName = process.env.ASCYN_ADMIN_FULL_NAME || 'ASCYN PRO Administrator'

  if (!url) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL')
    process.exit(1)
  }
  if (!serviceRoleKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  if (!email) {
    console.error('Missing ASCYN_ADMIN_EMAIL')
    process.exit(1)
  }
  if (!password) {
    console.error('Missing ASCYN_ADMIN_PASSWORD')
    process.exit(1)
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  // Create or update the admin auth user.
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: 'admin' },
  })

  if (userError) {
    // If the user already exists, fetch them instead of failing.
    if (userError.message?.includes('already been registered')) {
      const { data: existing } = await supabase.auth.admin.listUsers()
      const found = existing?.users?.find((u) => u.email === email)
      if (found) {
        console.log(`Admin user already exists: ${found.id}`)
        // Ensure profile is admin + approved.
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert(
            {
              id: found.id,
              email,
              full_name: fullName,
              role: 'admin',
              approval_status: 'approved',
              is_disabled: false,
              approved_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          )
        if (profileError) {
          console.error('Failed to update admin profile:', profileError)
          process.exit(1)
        }
        console.log('Admin profile updated: approved, admin role, enabled.')
        process.exit(0)
      }
    }
    console.error('Failed to create admin user:', userError)
    process.exit(1)
  }

  const userId = userData.user?.id
  if (!userId) {
    console.error('Admin user creation returned no user ID')
    process.exit(1)
  }

  // Upsert the admin profile with approved status.
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        email,
        full_name: fullName,
        role: 'admin',
        approval_status: 'approved',
        is_disabled: false,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    console.error('Failed to create admin profile:', profileError)
    process.exit(1)
  }

  console.log(`Admin user created successfully: ${userId}`)
  console.log(`Email: ${email}`)
  console.log('Role: admin')
  console.log('Approval status: approved')
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
