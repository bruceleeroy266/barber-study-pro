/**
 * Reset Verification Account Passwords
 * 
 * Run with: npx tsx --env-file=.env.production scripts/reset-verification-passwords.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const TEMP_PASSWORD = 'AscynTest2026!'

const accounts = [
  'verify-admin@ascynpro.test',
  'verify-instructor@ascynpro.test',
  'verify-student@ascynpro.test',
]

async function resetPasswords() {
  console.log('🔧 Resetting Verification Account Passwords\n')

  for (const email of accounts) {
    console.log(`Processing: ${email}`)
    
    // Find user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error(`  ❌ Error listing users: ${listError.message}`)
      continue
    }

    const user = users.users.find(u => u.email === email)
    
    if (!user) {
      console.log(`  ⚠️  User not found, creating...`)
      
      // Create user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: TEMP_PASSWORD,
        email_confirm: true,
      })

      if (createError) {
        console.error(`  ❌ Failed to create user: ${createError.message}`)
        continue
      }

      console.log(`  ✅ Created user: ${newUser.user.id}`)
    } else {
      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
        password: TEMP_PASSWORD,
      })

      if (updateError) {
        console.error(`  ❌ Failed to update password: ${updateError.message}`)
        continue
      }

      console.log(`  ✅ Password reset: ${user.id}`)
    }
  }

  console.log('\n✅ All passwords reset')
  console.log(`Temporary password: ${TEMP_PASSWORD}`)
}

resetPasswords().catch(console.error)
