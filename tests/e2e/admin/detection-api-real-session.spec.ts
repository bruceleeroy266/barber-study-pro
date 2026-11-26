/**
 * ASCYN-SECURITY-RELEASE-01N: authenticated HTTP API authorization certification.
 * All fixture mutation is disposable, against loopback Supabase only.
 * Unlike route unit tests, requests are made with actual browser session cookies.
 */
import { test, expect, type Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { execFileSync } from 'node:child_process'
import { assertTestEnvironment } from '../../integration/setup/production-guard'

const EMAIL = 'sec-01n-student@ascyn-test.local'
const PASSWORD = 'LocalOnly01N!'
const getEnvironment = () => {
  assertTestEnvironment()
  const api = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const database = process.env.TEST_DATABASE_URL!
  const base = new URL(process.env.PLAYWRIGHT_BASE_URL || '')
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname) || !base.port || base.protocol !== 'http:') {
    throw new Error('01N requires a loopback web application with explicit port')
  }
  return { api, key, database }
}

function sqlCount(database: string, userId: string): string {
  assertTestEnvironment()
  const query = `SELECT
    (SELECT count(*) FROM public.remediation_cycles WHERE user_id = '${userId}'::uuid)::text || ':' ||
    (SELECT count(*) FROM public.sustained_performance_tracking WHERE user_id = '${userId}'::uuid)::text || ':' ||
    (SELECT count(*) FROM public.follow_up_evidence WHERE user_id = '${userId}'::uuid)::text || ':' ||
    (SELECT count(*) FROM public.sustained_performance_resets WHERE user_id = '${userId}'::uuid)::text;`
  return execFileSync('psql', [database, '-X', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-c', query], {
    encoding: 'utf8',
  }).trim()
}

async function invokeApi(page: Page, attemptId: string) {
  return page.evaluate(async (id) => {
    const response = await fetch('/api/remediation/detect', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId: 'ch-2', quizAttemptId: id }),
    })
    return { status: response.status, body: await response.json() }
  }, attemptId)
}

test.describe('01N real-session API permission gate', () => {
  test.describe.configure({ retries: 0 })
  test('approved student succeeds; revoked states fail with zero academic side effects', async ({ page }) => {
    test.setTimeout(110_000)
    const { api, key, database } = getEnvironment()
    const service = createClient(api, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: schoolA, error: errorA } = await service.from('schools')
      .insert({ name: '01N Disposable School A', is_active: true }).select('id').single()
    expect(errorA).toBeNull()
    const { data: schoolB, error: errorB } = await service.from('schools')
      .insert({ name: '01N Disposable School B', is_active: true }).select('id').single()
    expect(errorB).toBeNull()
    const schoolAId = schoolA!.id
    const schoolBId = schoolB!.id

    const { data: auth, error: authError } = await service.auth.admin.createUser({
      email: EMAIL, password: PASSWORD, email_confirm: true,
      user_metadata: { full_name: '01N Local Test Student', role: 'student' },
    })
    expect(authError).toBeNull()
    const userId = auth.user!.id

    const updateProfile = async (values: Record<string, unknown>) => {
      const { error } = await service.from('profiles').update(values).eq('id', userId)
      expect(error).toBeNull()
    }
    const updateStudent = async (values: Record<string, unknown>) => {
      const { error } = await service.from('students').update(values).eq('profile_id', userId)
      expect(error).toBeNull()
    }
    await updateProfile({
      role: 'student', approval_status: 'approved', is_disabled: false,
      requires_password_change: false, school_id: schoolAId,
    })
    const { error: studentError } = await service.from('students')
      .insert({ profile_id: userId, school_id: schoolAId, is_active: true })
    expect(studentError).toBeNull()
    const { data: attempt, error: attemptError } = await service.from('quiz_attempts')
      .insert({
        user_id: userId, quiz_id: 'quiz-2', score: 0, total_questions: 0,
        percentage: 0, answers_json: {}, completed_at: new Date().toISOString(),
      }).select('id').single()
    expect(attemptError).toBeNull()
    const attemptId = attempt!.id

    await page.goto('/login')
    await page.locator('input[type="email"]').fill(EMAIL)
    await page.locator('input[type="password"]').fill(PASSWORD)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 25_000 })
    const sessionCookies = await page.context().cookies()
    expect(sessionCookies.some(cookie => cookie.name.includes('auth-token'))).toBe(true)

    const allowed = await invokeApi(page, attemptId)
    expect(allowed.status, JSON.stringify(allowed.body)).toBe(200)
    expect(allowed.body.success).toBe(true)

    const assertDenied = async (label: string, expected: number) => {
      const before = sqlCount(database, userId)
      const result = await invokeApi(page, attemptId)
      expect(result.status, `${label}: ${JSON.stringify(result.body)}`).toBe(expected)
      expect(sqlCount(database, userId), `${label} changed privileged academic state`).toBe(before)
    }
    await updateProfile({ is_disabled: true })
    await assertDenied('disabled student', 403)
    await updateProfile({ is_disabled: false, approval_status: 'pending' })
    await assertDenied('unapproved student', 403)
    await updateProfile({ approval_status: 'approved', school_id: schoolBId })
    await assertDenied('wrong school', 403)
    await updateProfile({ school_id: schoolAId })
    await updateStudent({ is_active: false })
    await assertDenied('inactive student', 403)

    // Direct API session is not reauthenticated after each change: the existing
    // valid session must be denied on every request based on live database state.
    await updateStudent({ is_active: true })
    const recovered = await invokeApi(page, attemptId)
    expect(recovered.status, JSON.stringify(recovered.body)).toBe(200)
    expect(recovered.body.success).toBe(true)
  })
})
