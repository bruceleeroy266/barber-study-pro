const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  const envContent = fs.readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    env[trimmed.slice(0, eq).trim()] = value
  }
  return env
}

async function main() {
  const env = loadEnv()
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const expectations = [
    { key: 'gabriel', email: 'ascynproofficial@gmail.com', expectedRole: 'admin', expectedSchoolId: null },
    { key: 'patty', email: 'patty.pineda.drl@gmail.com', expectedRole: 'student', expectedSchoolId: '12b09747-7391-4811-bc22-db7eebbb12c1' },
    { key: 'malenny', email: 'malennysaenz@gmail.com', expectedRole: 'student', expectedSchoolId: '12b09747-7391-4811-bc22-db7eebbb12c1' },
    { key: 'tessa', email: 'tessamyers2911@gmail.com', expectedRole: 'instructor', expectedSchoolId: '12b09747-7391-4811-bc22-db7eebbb12c1' },
  ]

  const { data: users, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (listError) throw listError

  const results = []
  let failed = false

  for (const expectation of expectations) {
    const authUser = users.users.find((user) => user.email?.toLowerCase() === expectation.email.toLowerCase())
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id,email,role,school_id,approval_status,is_disabled')
      .eq('email', expectation.email)
      .maybeSingle()

    if (profileError) throw profileError

    const failures = []
    if (!authUser) failures.push('missing_auth_user')
    if (!profile) failures.push('missing_profile')
    const invitePending = Boolean(authUser && !authUser.email_confirmed_at)
    if (authUser && !authUser.email_confirmed_at && !invitePending) failures.push('email_not_confirmed')
    if (authUser && authUser.banned_until) failures.push('auth_banned')
    if (profile && profile.is_disabled) failures.push('profile_disabled')
    if (profile && profile.role !== expectation.expectedRole) failures.push(`role_mismatch:${profile.role}`)
    if (profile && profile.approval_status !== 'approved') failures.push(`approval_mismatch:${profile.approval_status}`)
    if (profile && String(profile.school_id ?? null) !== String(expectation.expectedSchoolId ?? null)) {
      failures.push(`school_mismatch:${profile.school_id ?? 'null'}`)
    }

    if (failures.length > 0) failed = true

    results.push({
      key: expectation.key,
      email: expectation.email,
      pass: failures.length === 0,
      failures,
      auth: authUser
        ? {
            id: authUser.id,
            email_confirmed_at: authUser.email_confirmed_at ?? null,
            invite_pending: invitePending,
            banned_until: authUser.banned_until ?? null,
          }
        : null,
      profile: profile ?? null,
    })
  }

  console.log(JSON.stringify({ failed, results }, null, 2))
  if (failed) process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
