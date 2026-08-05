/**
 * Create Test Admin User
 * 
 * Run with: npx tsx --env-file=.env.local scripts/create-test-admin.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function createTestAdmin() {
  console.log('Creating test admin user...')
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const testEmail = 'test-admin@ascynpro.test'
  const testPassword = 'TestAdmin123!'

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find(u => u.email === testEmail)
  
  if (existingUser) {
    console.log('Test admin already exists:', existingUser.id)
    
    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { password: testPassword }
    )
    
    if (updateError) {
      console.error('Error updating password:', updateError.message)
    } else {
      console.log('Updated password for test admin')
    }
    
    return
  }

  // Create new user
  const { data, error } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { role: 'admin' }
  })

  if (error) {
    console.error('Error creating user:', error.message)
    return
  }

  console.log('Created auth user:', data.user?.id)

  // Create profile
  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user!.id,
    email: testEmail,
    full_name: 'Test Admin',
    role: 'admin',
    approval_status: 'approved',
    is_disabled: false,
    requires_password_change: false
  })

  if (profileError) {
    console.error('Error creating profile:', profileError.message)
  } else {
    console.log('Created profile for test admin')
  }

  console.log('\nTest credentials:')
  console.log('  Email:', testEmail)
  console.log('  Password:', testPassword)
}

createTestAdmin().catch(console.error)
