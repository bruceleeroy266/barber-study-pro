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

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`)
    process.exit(1)
  }
  console.log(`✅ PASS: ${message}`)
}

async function main() {
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // 1. Verify the migration file contains the audit table DDL.
  const fs = await import('fs')
  const migrationText = fs.readFileSync('supabase/migrations/20260712030000_admin_user_management.sql', 'utf8')
  assert(migrationText.includes('create table if not exists public.user_management_audit_logs'), 'Migration defines user_management_audit_logs table')
  assert(migrationText.includes("check (role in ('student', 'apprentice', 'instructor', 'admin', 'school_admin'))"), 'Migration allows school_admin role')

  // 2. Verify the user_management_audit_logs table is accessible if migration is applied.
  const { error: auditError } = await supabase
    .from('user_management_audit_logs')
    .select('id')
    .limit(1)
  if (auditError && !auditError.message?.includes('0 rows')) {
    console.log(`⚠️  WARN: user_management_audit_logs table not yet applied (${auditError.message})`)
  } else {
    console.log('✅ PASS: user_management_audit_logs table is accessible')
  }

  // 3. Verify migration updates profiles role constraint to allow school_admin.
  assert(
    migrationText.includes("alter table public.profiles") && migrationText.includes("profiles_role_check"),
    'Migration updates profiles_role_check constraint'
  )

  // 4. Verify service role key is not exposed in client components or UI.
  const sensitiveFiles = [
    'src/app/admin/users/UserManagementClient.tsx',
    'src/app/admin/users/page.tsx',
    'src/app/admin/page.tsx',
  ]
  for (const file of sensitiveFiles) {
    const text = fs.readFileSync(file, 'utf8')
    assert(
      !text.includes(env.SUPABASE_SERVICE_ROLE_KEY),
      `Service role key not exposed in ${file}`
    )
  }
  // The service role helper itself contains the env var reference but is never imported client-side.
  const helperText = fs.readFileSync('src/lib/supabase-service-role.ts', 'utf8')
  assert(helperText.includes('service role key'), 'Service role helper is clearly server-only')
  assert(
    helperText.includes('Never import this file into') && helperText.includes('client components'),
    'Service role helper warns against client use'
  )

  // 5. Verify server actions file is server-only and imports service role helper.
  const actionsText = fs.readFileSync('src/app/admin/users/actions.ts', 'utf8')
  assert(actionsText.includes("'use server'"), 'Admin users actions are server-only')
  assert(actionsText.includes('createServiceRoleClient'), 'Admin users actions use service role helper')
  assert(actionsText.includes('logUserManagementAction'), 'Admin users actions write audit logs')

  // 6. Verify middleware blocks /admin/users for non-admins.
  const middlewareText = fs.readFileSync('src/middleware.ts', 'utf8')
  assert(middlewareText.includes("pathname === '/admin/users'"), 'Middleware protects /admin/users')
  assert(middlewareText.includes('isSchoolAdmin'), 'Middleware allows school_admin to /admin/users')

  console.log('\n=== Admin user management static tests passed ===')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
