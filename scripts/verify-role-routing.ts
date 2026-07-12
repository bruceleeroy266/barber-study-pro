import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { stringToBase64URL } from '@supabase/ssr/dist/main/utils/base64url'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'

interface Env {
  url: string
  anonKey: string
  studentEmail: string
  studentPassword: string
  instructorEmail: string
  instructorPassword: string
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

function loadEnv(): Env {
  const envPath = join(process.cwd(), '.env.local')
  const env = loadEnvFile(envPath)

  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const studentEmail = env.ASCYN_STUDENT_EMAIL
  const studentPassword = env.ASCYN_STUDENT_PASSWORD
  const instructorEmail = env.ASCYN_INSTRUCTOR_EMAIL
  const instructorPassword = env.ASCYN_INSTRUCTOR_PASSWORD

  if (!url || !anonKey || !studentEmail || !studentPassword || !instructorEmail || !instructorPassword) {
    throw new Error('Missing required environment variables')
  }

  return { url, anonKey, studentEmail, studentPassword, instructorEmail, instructorPassword }
}

function getProjectRef(url: string): string {
  const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/)
  if (!match) {
    throw new Error(`Could not extract project ref from URL: ${url}`)
  }
  return match[1]
}

function buildAuthCookie(url: string, session: { access_token: string; refresh_token: string }): string {
  const projectRef = getProjectRef(url)
  const cookieName = `sb-${projectRef}-auth-token`
  const payload = JSON.stringify(session)
  const encoded = `base64-${stringToBase64URL(payload)}`
  return `${cookieName}=${encoded}`
}

async function fetchWithCookie(path: string, cookie: string): Promise<{ status: number; location: string | null }> {
  const response = await fetch(`http://localhost:3000${path}`, {
    method: 'GET',
    headers: cookie ? { Cookie: cookie } : {},
    redirect: 'manual',
  })

  return {
    status: response.status,
    location: response.headers.get('location'),
  }
}

function resolveLocation(location: string): string {
  if (location.startsWith('http')) return location
  return `http://localhost:3000${location.startsWith('/') ? '' : '/'}${location}`
}

function assertLocation(name: string, actual: string | null, expected: string | RegExp, status?: number): void {
  // For allowed routes, a 200 OK (no redirect) is also a success.
  if (status === 200 && actual === null) {
    console.log(`[PASS] ${name}: 200 OK`)
    return
  }

  if (actual === null) {
    throw new Error(`[FAIL] ${name}: expected redirect to ${expected.toString()} but got no redirect`)
  }

  const resolved = resolveLocation(actual)
  const matches = typeof expected === 'string' ? resolved === expected : expected.test(resolved)
  if (!matches) {
    throw new Error(`[FAIL] ${name}: expected ${expected.toString()} but got ${resolved}`)
  }

  console.log(`[PASS] ${name}: ${resolved}`)
}

async function signIn(supabase: SupabaseClient, email: string, password: string): Promise<{ access_token: string; refresh_token: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.session) {
    throw new Error(`Sign in failed for ${email}: ${error?.message ?? 'no session'}`)
  }
  return data.session
}

function generatePassword(): string {
  return 'Ascyn!' + randomBytes(16).toString('base64url')
}

function updateEnvPassword(key: string, value: string): void {
  const envPath = join(process.cwd(), '.env.local')
  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/)
  const updated = lines.map((line) => {
    if (line.startsWith(`${key}=`)) {
      return `${key}=${value}`
    }
    return line
  })
  writeFileSync(envPath, updated.join('\n') + '\n')
}

async function ensurePasswordChangeAndBeta(
  env: Env,
  email: string,
  password: string,
  passwordEnvKey: string
): Promise<string> {
  const supabase = createClient(env.url, env.anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Step 1: sign in and inspect the first redirect.
  let session = await signIn(supabase, email, password)
  let cookie = buildAuthCookie(env.url, session)
  const firstRedirect = await fetchWithCookie('/dashboard', cookie)

  const serviceClient = createClient(env.url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Step 2: if password change is required, complete it.
  if (firstRedirect.location && /update-password\?reason=required/.test(firstRedirect.location)) {
    const newPassword = generatePassword()

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    if (updateError) {
      throw new Error(`Password update failed for ${email}: ${updateError.message}`)
    }

    const { error: profileError } = await serviceClient
      .from('profiles')
      .update({ requires_password_change: false })
      .eq('id', session.user?.id as string)
    if (profileError) {
      throw new Error(`Profile update failed for ${email}: ${profileError.message}`)
    }

    session = await signIn(supabase, email, newPassword)
    cookie = buildAuthCookie(env.url, session)
    updateEnvPassword(passwordEnvKey, newPassword)

    console.log(`[PASS] ${email} password-change flow completed`)
  } else {
    console.log(`[INFO] ${email} password-change not required`)
  }

  // Step 3: ensure beta agreement exists.
  const { error: betaError } = await serviceClient
    .from('beta_agreements')
    .upsert(
      {
        user_id: session.user?.id as string,
        tester_email: email,
        tester_name: email.split('@')[0].replace(/\+/g, ' '),
        agreement_version: 'v1.0',
        accepted_at: new Date().toISOString(),
      },
      { onConflict: 'user_id, agreement_version' }
    )
  if (betaError) {
    throw new Error(`Beta agreement insert failed for ${email}: ${betaError.message}`)
  }

  return cookie
}

async function run() {
  const env = loadEnv()
  process.env.SUPABASE_SERVICE_ROLE_KEY = loadEnvFile(join(process.cwd(), '.env.local')).SUPABASE_SERVICE_ROLE_KEY

  console.log('Verifying password-change flow and role routing...\n')

  const studentCookie = await ensurePasswordChangeAndBeta(env, env.studentEmail, env.studentPassword, 'ASCYN_STUDENT_PASSWORD')
  const instructorCookie = await ensurePasswordChangeAndBeta(env, env.instructorEmail, env.instructorPassword, 'ASCYN_INSTRUCTOR_PASSWORD')

  console.log('=== Authenticated Role Routing ===\n')

  const cases = [
    { name: 'Student /dashboard', path: '/dashboard', cookie: studentCookie, expected: /^http:\/\/localhost:3000\/dashboard/ },
    { name: 'Student /instructor (blocked)', path: '/instructor', cookie: studentCookie, expected: 'http://localhost:3000/dashboard' },
    { name: 'Student /admin (blocked)', path: '/admin', cookie: studentCookie, expected: 'http://localhost:3000/dashboard' },
    { name: 'Student /school (blocked)', path: '/school', cookie: studentCookie, expected: 'http://localhost:3000/dashboard' },
    { name: 'Instructor /instructor', path: '/instructor', cookie: instructorCookie, expected: /^http:\/\/localhost:3000\/instructor/ },
    { name: 'Instructor /admin (blocked)', path: '/admin', cookie: instructorCookie, expected: 'http://localhost:3000/instructor' },
    { name: 'Instructor /school (blocked)', path: '/school', cookie: instructorCookie, expected: 'http://localhost:3000/instructor' },
  ]

  for (const c of cases) {
    const result = await fetchWithCookie(c.path, c.cookie)
    assertLocation(c.name, result.location, c.expected, result.status)
  }

  console.log('\n=== Logged-Out Redirects ===\n')

  const loggedOutPaths = ['/dashboard', '/instructor', '/admin', '/school']
  for (const path of loggedOutPaths) {
    const result = await fetchWithCookie(path, '')
    const expected = `http://localhost:3000/login?redirect=${encodeURIComponent(path)}`
    assertLocation(`Logged-out ${path}`, result.location, expected)
  }

  console.log('\n=== All role routing checks passed ===')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
