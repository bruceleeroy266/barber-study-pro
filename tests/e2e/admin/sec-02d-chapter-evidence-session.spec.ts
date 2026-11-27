/**
 * 02D actual browser session and disposable local Supabase.
 * Proof: enabled learners persist evidence; disabling an already-logged-in
 * learner denies privileged evidence writes without DB side effects.
 * School A/B are separate live accounts and evidence owners.
 */
import { test, expect, type Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { execFileSync } from 'node:child_process'
import { assertTestEnvironment } from '../../integration/setup/production-guard'
import { chapter19MicroChecks } from '../../../src/lib/chapter-19-concepts/micro-checks'

const PASSWORD = 'OnlyLocal02D!'
const questionId = chapter19MicroChecks[0].questions[0].id

function countEvidence(userId: string): string {
  assertTestEnvironment()
  const sql = `SELECT count(*)::text FROM public.chapter_micro_check_attempts
    WHERE user_id = '${userId}'::uuid AND chapter_id = 'ch-19';`
  return execFileSync('psql', [
    process.env.TEST_DATABASE_URL!, '-X', '-q', '-A', '-t',
    '-v', 'ON_ERROR_STOP=1', '-c', sql,
  ], { encoding: 'utf8' }).trim()
}

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill(PASSWORD)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 25_000 })
}

async function record(page: Page) {
  return page.evaluate(async questionId => {
    const response = await fetch('/api/chapter-19/micro-check', {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, selectedAnswer: 'a' }),
    })
    return { status: response.status, body: await response.json() }
  }, questionId)
}

test('SEC-02D service-role chapter evidence denies existing disabled sessions with zero DB side effects', async ({ browser }) => {
  test.setTimeout(125_000)
  assertTestEnvironment()
  const base = new URL(process.env.PLAYWRIGHT_BASE_URL!)
  if (base.protocol !== 'http:' || !base.port || !['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) {
    throw new Error('02D requires a loopback browser target')
  }
  const service = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const ids: string[] = []
  for (const side of ['a', 'b'] as const) {
    const { data: school, error: schoolError } = await service.from('schools').insert({
      name: `02D disposable school ${side}`, is_active: true,
    }).select('id').single()
    expect(schoolError).toBeNull()
    const email = `sec-02d-evidence-${side}@ascyn-test.local`
    const { data: created, error: userError } = await service.auth.admin.createUser({
      email, password: PASSWORD, email_confirm: true,
      user_metadata: { full_name: `02D student ${side}`, role: 'student' },
    })
    expect(userError).toBeNull()
    const id = created.user!.id
    ids.push(id)
    const { error: profileError } = await service.from('profiles').update({
      role: 'student', school_id: school!.id,
      approval_status: 'approved', is_disabled: false, requires_password_change: false,
    }).eq('id', id)
    expect(profileError).toBeNull()
    const { error: domainError } = await service.from('students').insert({
      profile_id: id, school_id: school!.id, is_active: true,
    })
    expect(domainError).toBeNull()
    const context = await browser.newContext()
    const page = await context.newPage()
    try {
      await login(page, email)
      expect(countEvidence(id)).toBe('0')
      const positive = await record(page)
      expect(positive.status, JSON.stringify(positive.body)).toBe(200)
      expect(positive.body.row?.user_id).toBe(id)
      expect(countEvidence(id)).toBe('1')

      const { error: disabledError } = await service.from('profiles')
        .update({ is_disabled: true }).eq('id', id)
      expect(disabledError).toBeNull()
      const before = countEvidence(id)
      const negative = await record(page)
      expect(negative.status, JSON.stringify(negative.body)).toBe(403)
      expect(countEvidence(id)).toBe(before)
    } finally {
      await context.close()
    }
  }
  expect(ids[0]).not.toBe(ids[1])
})
