/**
 * Fix Test Admin User
 * 
 * Run with: npx tsx --env-file=.env.local scripts/fix-test-admin.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function fixTestAdmin() {
  console.log('Fixing test admin user...')
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const testEmail = 'test-admin@ascynpro.test'

  // Get the user
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error listing users:', listError.message)
    return
  }

  const user = usersData?.users?.find(u => u.email === testEmail)
  
  if (!user) {
    console.error('Test admin user not found')
    return
  }

  console.log('Found user:', user.id)

  // Check current profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError.message)
  } else {
    console.log('Current profile:', JSON.stringify(profile, null, 2))
  }

  // Update profile to ensure it's correct
  const { data: updated, error: updateError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: testEmail,
      full_name: 'Test Admin',
      role: 'admin',
      approval_status: 'approved',
      is_disabled: false,
      requires_password_change: false
    })
    .select()

  if (updateError) {
    console.error('Error updating profile:', updateError.message)
  } else {
    console.log('Updated profile:', JSON.stringify(updated, null, 2))
  }
}

fixTestAdmin().catch(console.error)
