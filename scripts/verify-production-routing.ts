import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { stringToBase64URL } from '@supabase/ssr/dist/main/utils/base64url'
import { readFileSync } from 'fs'
import { join } from 'path'

interface Env {
  url: string
  anonKey: string
  baseUrl: string
  studentEmail: string
  studentPassword: string
  instructorEmail: string
  instructorPassword: string
  adminEmail: string
  adminPassword: string
}

function loadEnvFile(path: string): Record<string, string> {
  const content = readFileSync(path, 'utf8')
  const vars: Record<string, string> = {}
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    vars[key] = value
  }
  return vars
}

function loadEnv(): Env & { serviceRoleKey: string } {
  const envPath = join(process.cwd(), '.env.local')
  const env = loadEnvFile(envPath)

  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
  const baseUrl = process.env.VERIFY_BASE_URL || 'https://barber-study-pro.vercel.app'
  const studentEmail = env.ASCYN_STUDENT_EMAIL
  const studentPassword = env.ASCYN_STUDENT_PASSWORD
  const instructorEmail = env.ASCYN_INSTRUCTOR_EMAIL
  const instructorPassword = env.ASCYN_INSTRUCTOR_PASSWORD

  const adminEmail = env.ASCYN_ADMIN_EMAIL ?? process.env.ASCYN_ADMIN_EMAIL
  const adminPassword = env.ASCYN_ADMIN_PASSWORD ?? process.env.ASCYN_ADMIN_PASSWORD

  if (!url || !anonKey || !serviceRoleKey || !studentEmail || !studentPassword || !instructorEmail || !instructorPassword) {
    throw new Error('Missing required environment variables')
  }
  if (!adminEmail || !adminPassword) {
    throw new Error('Missing ASCYN_ADMIN_EMAIL and ASCYN_ADMIN_PASSWORD for live verification')
  }

  return { url, anonKey, serviceRoleKey, baseUrl, studentEmail, studentPassword, instructorEmail, instructorPassword, adminEmail, adminPassword }
}

async function ensureBetaAgreement(
  env: Env & { serviceRoleKey: string },
  email: string,
  userId: string
): Promise<void> {
  const serviceClient = createClient(env.url, env.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { error } = await serviceClient
    .from('beta_agreements')
    .upsert(
      {
        user_id: userId,
        tester_email: email,
        tester_name: email.split('@')[0].replace(/\+/g, ' '),
        agreement_version: 'v1.0',
        accepted_at: new Date().toISOString(),
      },
      { onConflict: 'user_id, agreement_version' }
    )

  if (error) {
    throw new Error(`Beta agreement insert failed for ${email}: ${error.message}`)
  }

  console.log(`[PASS] Beta agreement ensured for ${email}`)
}

function getProjectRef(url: string): string {
  const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/)
  if (!match) throw new Error(`Could not extract project ref from URL: ${url}`)
  return match[1]
}

function buildAuthCookie(url: string, session: { access_token: string; refresh_token: string }): string {
  const projectRef = getProjectRef(url)
  const cookieName = `sb-${projectRef}-auth-token`
  const payload = JSON.stringify(session)
  const encoded = `base64-${stringToBase64URL(payload)}`
  return `${cookieName}=${encoded}`
}

async function fetchWithCookie(baseUrl: string, path: string, cookie: string): Promise<{ status: number; location: string | null }> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'GET',
    headers: cookie ? { Cookie: cookie } : {},
    redirect: 'manual',
  })

  return {
    status: response.status,
    location: response.headers.get('location'),
  }
}

function resolveLocation(baseUrl: string, location: string): string {
  if (location.startsWith('http')) return location
  return `${baseUrl}${location.startsWith('/') ? '' : '/'}${location}`
}

function assertLocation(baseUrl: string, name: string, actual: string | null, expected: string | RegExp, status?: number): void {
  if (status === 200 && actual === null) {
    console.log(`[PASS] ${name}: 200 OK`)
    return
  }

  if (actual === null) {
    throw new Error(`[FAIL] ${name}: expected redirect to ${expected.toString()} but got no redirect`)
  }

  const resolved = resolveLocation(baseUrl, actual)
  const matches = typeof expected === 'string' ? resolved === expected : expected.test(resolved)
  if (!matches) {
    throw new Error(`[FAIL] ${name}: expected ${expected.toString()} but got ${resolved}`)
  }

  console.log(`[PASS] ${name}: ${resolved}`)
}

async function signIn(supabase: SupabaseClient, email: string, password: string): Promise<{ access_token: string; refresh_token: string; user: { id: string } }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.session || !data.user) {
    throw new Error(`Sign in failed for ${email}: ${error?.message ?? 'no session'}`)
  }
  return { ...data.session, user: { id: data.user.id } }
}

async function run() {
  const env = loadEnv()
  const supabase = createClient(env.url, env.anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  console.log(`Verifying production role routing at ${env.baseUrl}\n`)

  const studentSession = await signIn(supabase, env.studentEmail, env.studentPassword)
  const instructorSession = await signIn(supabase, env.instructorEmail, env.instructorPassword)
  const adminSession = await signIn(supabase, env.adminEmail, env.adminPassword)

  await ensureBetaAgreement(env, env.studentEmail, studentSession.user.id)
  await ensureBetaAgreement(env, env.instructorEmail, instructorSession.user.id)
  await ensureBetaAgreement(env, env.adminEmail, adminSession.user.id)

  const studentCookie = buildAuthCookie(env.url, studentSession)
  const instructorCookie = buildAuthCookie(env.url, instructorSession)
  const adminCookie = buildAuthCookie(env.url, adminSession)

  console.log('=== Authenticated Role Routing ===\n')

  const cases = [
    { name: 'Student /dashboard', path: '/dashboard', cookie: studentCookie, expected: new RegExp(`${env.baseUrl}/dashboard($|\\?)`), status: 200 },
    { name: 'Student /instructor (blocked)', path: '/instructor', cookie: studentCookie, expected: `${env.baseUrl}/dashboard` },
    { name: 'Student /admin (blocked)', path: '/admin', cookie: studentCookie, expected: `${env.baseUrl}/dashboard` },
    { name: 'Student /school (blocked)', path: '/school', cookie: studentCookie, expected: `${env.baseUrl}/dashboard` },
    { name: 'Instructor /instructor', path: '/instructor', cookie: instructorCookie, expected: new RegExp(`${env.baseUrl}/instructor($|\\?)`), status: 200 },
    { name: 'Instructor /admin (blocked)', path: '/admin', cookie: instructorCookie, expected: `${env.baseUrl}/instructor` },
    { name: 'Instructor /school (blocked)', path: '/school', cookie: instructorCookie, expected: `${env.baseUrl}/instructor` },
    { name: 'Admin /admin', path: '/admin', cookie: adminCookie, expected: new RegExp(`${env.baseUrl}/admin($|\\?)`), status: 200 },
    { name: 'Admin /instructor', path: '/instructor', cookie: adminCookie, expected: new RegExp(`${env.baseUrl}/instructor($|\\?)`), status: 200 },
    { name: 'Admin /dashboard (redirected to admin portal)', path: '/dashboard', cookie: adminCookie, expected: `${env.baseUrl}/admin` },
  ]

  for (const c of cases) {
    const result = await fetchWithCookie(env.baseUrl, c.path, c.cookie)
    assertLocation(env.baseUrl, c.name, result.location, c.expected, c.status ?? result.status)
  }

  console.log('\n=== Logged-Out Redirects ===\n')

  const loggedOutPaths = ['/dashboard', '/instructor', '/admin', '/school']
  for (const path of loggedOutPaths) {
    const result = await fetchWithCookie(env.baseUrl, path, '')
    const expected = `${env.baseUrl}/login?redirect=${encodeURIComponent(path)}`
    assertLocation(env.baseUrl, `Logged-out ${path}`, result.location, expected)
  }

  console.log('\n=== All production role routing checks passed ===')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
