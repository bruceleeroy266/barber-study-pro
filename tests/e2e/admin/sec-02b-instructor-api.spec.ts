/**
 * SEC-02B direct HTTP role-boundary test with real local auth cookies.
 * All users and escalations belong to disposable loopback Supabase only.
 */
import { test, expect, type Browser, type Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { assertTestEnvironment } from '../../integration/setup/production-guard'

const PASSWORD = 'LocalOnly02B!'
const people = [
  { key: 'instructorA', email: 'sec-02b-instructor-a@ascyn-test.local', role: 'instructor', school: 'A' },
  { key: 'instructorB', email: 'sec-02b-instructor-b@ascyn-test.local', role: 'instructor', school: 'B' },
  { key: 'adminA', email: 'sec-02b-school-admin-a@ascyn-test.local', role: 'school_admin', school: 'A' },
  { key: 'studentA', email: 'sec-02b-student-a@ascyn-test.local', role: 'student', school: 'A' },
  { key: 'studentB', email: 'sec-02b-student-b@ascyn-test.local', role: 'student', school: 'B' },
] as const

async function login(browser: Browser, email: string): Promise<{ page: Page; close: () => Promise<void> }> {
  const context = await browser.newContext()
  const page = await context.newPage()
  await page.goto('/login')
  await page.locator('input[type="email"]').fill(email)
  await page.locator('input[type="password"]').fill(PASSWORD)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 25_000 })
  return { page, close: () => context.close() }
}

async function readEscalations(page: Page) {
  return page.evaluate(async () => {
    const response = await fetch('/api/instructor/escalations', { credentials: 'same-origin' })
    return { status: response.status, body: await response.json() }
  })
}

test.describe('SEC-RELEASE-02B instructor escalation HTTP access', () => {
  test.describe.configure({ retries: 0 })
  test('school-scoped reads, student denial and disabled existing-session denial', async ({ browser }) => {
    test.setTimeout(145_000)
    assertTestEnvironment()
    const webUrl = new URL(process.env.PLAYWRIGHT_BASE_URL!)
    if (webUrl.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(webUrl.hostname) || !webUrl.port) {
      throw new Error('02B requires a loopback web app')
    }
    const service = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    )
    const schools = {} as Record<'A' | 'B', string>
    for (const side of ['A', 'B'] as const) {
      const { data, error } = await service.from('schools').insert({
        name: `02B API disposable school ${side}`, is_active: true,
      }).select('id').single()
      expect(error).toBeNull()
      schools[side] = data!.id
    }

    const users = {} as Record<(typeof people)[number]['key'], string>
    for (const person of people) {
      const { data: created, error: authError } = await service.auth.admin.createUser({
        email: person.email, password: PASSWORD, email_confirm: true,
        user_metadata: { full_name: '02B Local Actor', role: person.role },
      })
      expect(authError).toBeNull()
      users[person.key] = created.user!.id
      const { error: profileError } = await service.from('profiles').update({
        role: person.role, school_id: schools[person.school],
        approval_status: 'approved', is_disabled: false, requires_password_change: false,
      }).eq('id', created.user!.id)
      expect(profileError).toBeNull()
    }

    const escalations = {} as Record<'A' | 'B', string>
    for (const side of ['A', 'B'] as const) {
      const { data, error } = await service.from('instructor_escalations').insert({
        user_id: users[side === 'A' ? 'studentA' : 'studentB'],
        concept_id: `SEC-02B-${side}`, chapter_id: 'ch-2', school_id: schools[side],
        triggering_cycle_ids: [], unsuccessful_cycle_count: 2, detection_evidence: {},
        status: 'pending',
      }).select('id').single()
      expect(error).toBeNull()
      escalations[side] = data!.id
    }

    const instructor = await login(browser, people[0].email)
    try {
      const local = await readEscalations(instructor.page)
      expect(local.status, JSON.stringify(local.body)).toBe(200)
      const localIds = (local.body.escalations ?? []).map((row: { id: string }) => row.id)
      expect(localIds).toContain(escalations.A)
      expect(localIds).not.toContain(escalations.B)

      const { error: disabledError } = await service.from('profiles')
        .update({ is_disabled: true }).eq('id', users.instructorA)
      expect(disabledError).toBeNull()
      const disabled = await readEscalations(instructor.page)
      expect(disabled.status, JSON.stringify(disabled.body)).toBe(403)
      // The list API has no mutations. This condition checks authorization at
      // the HTTP boundary while the original valid session cookie remains set.
    } finally {
      await instructor.close()
    }

    const student = await login(browser, people[3].email)
    try {
      const forbidden = await readEscalations(student.page)
      expect(forbidden.status).toBe(403)
    } finally {
      await student.close()
    }

    const admin = await login(browser, people[2].email)
    try {
      const allowed = await readEscalations(admin.page)
      expect(allowed.status, JSON.stringify(allowed.body)).toBe(200)
      const ids = (allowed.body.escalations ?? []).map((row: { id: string }) => row.id)
      expect(ids).toContain(escalations.A)
      expect(ids).not.toContain(escalations.B)
    } finally {
      await admin.close()
    }
  })
})
