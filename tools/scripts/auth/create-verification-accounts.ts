/**
 * Create Fresh Verification Accounts
 * 
 * Creates three test accounts with known passwords for authentication verification.
 * Run with: npx tsx --env-file=.env.local scripts/create-verification-accounts.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const TEMP_PASSWORD = 'AscynTest2026!'
const TEST_SCHOOL_NAME = 'ASCYN Verification Test School'

interface TestAccount {
  email: string
  password: string
  fullName: string
  role: 'admin' | 'instructor' | 'student'
  schoolId?: string
}

async function createVerificationAccounts() {
  console.log('🔧 Creating Fresh Verification Accounts\n')

  // Step 1: Create or get test school
  console.log('Step 1: Setting up test school...')
  let schoolId: string

  const { data: existingSchool } = await supabase
    .from('schools')
    .select('id')
    .eq('name', TEST_SCHOOL_NAME)
    .single()

  if (existingSchool) {
    schoolId = existingSchool.id
    console.log(`✅ Using existing school: ${schoolId}`)
  } else {
    const { data: newSchool, error: schoolError } = await supabase
      .from('schools')
      .insert({
        name: TEST_SCHOOL_NAME,
        is_active: true,
      })
      .select('id')
      .single()

    if (schoolError) {
      console.error(`❌ Failed to create school: ${schoolError.message}`)
      process.exit(1)
    }
    schoolId = newSchool.id
    console.log(`✅ Created new school: ${schoolId}`)
  }

  // Step 2: Create test accounts
  const accounts: TestAccount[] = [
    {
      email: 'verify-admin@ascynpro.test',
      password: TEMP_PASSWORD,
      fullName: 'Verification Admin',
      role: 'admin',
    },
    {
      email: 'verify-instructor@ascynpro.test',
      password: TEMP_PASSWORD,
      fullName: 'Verification Instructor',
      role: 'instructor',
      schoolId,
    },
    {
      email: 'verify-student@ascynpro.test',
      password: TEMP_PASSWORD,
      fullName: 'Verification Student',
      role: 'student',
      schoolId,
    },
  ]

  const createdUsers: Array<{ email: string; id: string; role: string }> = []

  for (const account of accounts) {
    console.log(`\nStep 2: Creating ${account.role} account...`)
    console.log(`   Email: ${account.email}`)

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const userExists = existingUser?.users.find(u => u.email === account.email)

    let userId: string

    if (userExists) {
      console.log(`   User exists, updating...`)
      userId = userExists.id

      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: account.password,
        user_metadata: {
          role: account.role,
          full_name: account.fullName,
        },
      })

      if (updateError) {
        console.error(`   ❌ Failed to update user: ${updateError.message}`)
        continue
      }
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          role: account.role,
          full_name: account.fullName,
        },
      })

      if (createError) {
        console.error(`   ❌ Failed to create user: ${createError.message}`)
        continue
      }

      userId = newUser.user.id
      console.log(`   ✅ Created user: ${userId}`)
    }

    // Step 3: Create or update profile
    console.log(`   Setting up profile...`)

    const profileData = {
      id: userId,
      email: account.email,
      full_name: account.fullName,
      role: account.role,
      school_id: account.schoolId || null,
      approval_status: 'approved',
      is_disabled: false,
      requires_password_change: false,
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })

    if (profileError) {
      console.error(`   ❌ Failed to create profile: ${profileError.message}`)
      continue
    }

    console.log(`   ✅ Profile configured`)
    createdUsers.push({ email: account.email, id: userId, role: account.role })
  }

  // Step 4: Verify accounts
  console.log('\n' + '='.repeat(50))
  console.log('📋 Verification Accounts Created')
  console.log('='.repeat(50))
  console.log(`\nTemporary Password: ${TEMP_PASSWORD}\n`)

  for (const user of createdUsers) {
    console.log(`${user.role.toUpperCase()}:`)
    console.log(`  Email: ${user.email}`)
    console.log(`  ID: ${user.id}`)
    
    // Verify profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, approval_status, is_disabled, school_id')
      .eq('id', user.id)
      .single()

    if (profile) {
      console.log(`  Role: ${profile.role}`)
      console.log(`  Approved: ${profile.approval_status === 'approved' ? '✅' : '❌'}`)
      console.log(`  Disabled: ${profile.is_disabled ? '❌' : '✅'}`)
      console.log(`  School ID: ${profile.school_id || 'N/A'}`)
    }
    console.log('')
  }

  console.log('✅ All verification accounts ready\n')
  console.log('Next step: Run authentication verification with:')
  console.log('  npx tsx --env-file=.env.local scripts/verify-auth-complete.ts')
}

createVerificationAccounts().catch(console.error)
