const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const PROTECTED_EMAILS = new Set([
  'ascynproofficial@gmail.com',
  'patty.pineda.drl@gmail.com',
  'malennysaenz@gmail.com',
  'tessamyers2911@gmail.com',
  'smoke-student@ascynpro.test',
  'smoke-instructor@ascynpro.test',
  'smoke-admin@ascynpro.test',
  'smoke-school-admin@ascynpro.test',
])

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

  const { data: users, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (error) throw error

  const candidates = users.users
    .filter((user) => user.email?.endsWith('@ascyn-smoke.test'))
    .map((user) => ({
      id: user.id,
      email: user.email,
      role: user.user_metadata?.role ?? null,
      schoolId: user.user_metadata?.school_id ?? null,
      isDesignated: PROTECTED_EMAILS.has((user.email || '').toLowerCase()),
    }))

  const protectedAccounts = candidates.filter((account) => account.isDesignated)
  const deletableAccounts = candidates.filter((account) => !account.isDesignated)

  console.log(JSON.stringify({
    dryRun: true,
    totalMatched: candidates.length,
    protectedCount: protectedAccounts.length,
    deletableCount: deletableAccounts.length,
    protectedAccounts,
    deletableAccounts,
    confirmationRequired: true,
    rollback: 'Restore from Supabase backups or recreate accounts through invite-based provisioning.',
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
