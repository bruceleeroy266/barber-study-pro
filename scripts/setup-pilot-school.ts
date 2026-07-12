import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const content = readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
for (const line of content.split(/\r?\n/)) {
  const idx = line.indexOf('=')
  if (idx > 0) {
    const key = line.slice(0, idx).trim()
    let val = line.slice(idx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    env[key] = val
  }
}

async function main() {
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // 1. Create the pilot school if it doesn't exist.
  const { data: existing } = await supabase
    .from('schools')
    .select('id')
    .eq('name', 'ASCYN PRO Pilot School')
    .maybeSingle()

  let schoolId: string
  if (existing?.id) {
    schoolId = existing.id
    console.log('Using existing pilot school:', schoolId)
  } else {
    const { data: school, error } = await supabase
      .from('schools')
      .insert({ name: 'ASCYN PRO Pilot School' })
      .select('id')
      .single()

    if (error || !school) {
      console.error('Failed to create school:', error?.message ?? 'no data')
      process.exit(1)
    }

    schoolId = school.id
    console.log('Created pilot school:', schoolId)
  }

  // 2. Find the pilot users by email.
  const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
  if (usersError) {
    console.error('Failed to list users:', usersError.message)
    process.exit(1)
  }

  const studentUser = users.users.find((u) => u.email === env.ASCYN_STUDENT_EMAIL)
  const instructorUser = users.users.find((u) => u.email === env.ASCYN_INSTRUCTOR_EMAIL)

  if (!studentUser || !instructorUser) {
    console.error('Could not find one or both pilot users')
    process.exit(1)
  }

  // 3. Assign school_id to both profiles.
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ school_id: schoolId })
    .in('id', [studentUser.id, instructorUser.id])

  if (updateError) {
    console.error('Failed to assign school_id:', updateError.message)
    process.exit(1)
  }

  console.log('Assigned school_id to student and instructor profiles')

  // 4. Verify assignments.
  const { data: profiles, error: verifyError } = await supabase
    .from('profiles')
    .select('id, role, school_id')
    .in('id', [studentUser.id, instructorUser.id])

  if (verifyError) {
    console.error('Failed to verify profiles:', verifyError.message)
    process.exit(1)
  }

  for (const profile of profiles || []) {
    const email = profile.id === studentUser.id ? env.ASCYN_STUDENT_EMAIL : env.ASCYN_INSTRUCTOR_EMAIL
    console.log(`Verified ${email}: role=${profile.role}, school_id=${profile.school_id}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
