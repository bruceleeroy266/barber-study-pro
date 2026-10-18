/**
 * 4D-5 browser-cookie checkpoint report isolation.
 * Run ONLY against a disposable locally seeded application + Supabase project.
 * This test is intentionally opt-in; do not interpret absence from default CI as PASS.
 * Fixtures must contain finalized baseline reports for BOTH schools with distinct
 * non-sensitive report markers, and two REAL Supabase Auth accounts (school admins).
 */
import { test, expect } from '@playwright/test'

const env = process.env
const required = (key: string) => {
  const value = env[key]
  if (!value) throw new Error('Missing mandatory disposable fixture: ' + key)
  return value
}

test.describe('4D-5 live A/B cookie-auth pilot report isolation', () => {
  test('school A cookie session cannot read school B checkpoint report', async ({ browser }) => {
    const base = required('EXAM_ISOLATION_REPORT_URL')
    const u = new URL(base)
    if (!['localhost', '127.0.0.1'].includes(u.hostname))
      throw new Error('Refusing non-local test target')
    const email = required('EXAM_ISOLATION_A_EMAIL')
    const password = required('EXAM_ISOLATION_A_PASSWORD')
    const aSchool = required('EXAM_ISOLATION_A_SCHOOL_ID')
    const bSchool = required('EXAM_ISOLATION_B_SCHOOL_ID')
    const bMarker = required('EXAM_ISOLATION_B_REPORT_MARKER')
    if (aSchool === bSchool || bMarker.length < 8) throw new Error('Invalid two-school fixture')

    const context = await browser.newContext({ baseURL: base })
    const page = await context.newPage()
    await page.goto('/login')
    await page.getByLabel(/email/i).fill(email)
    await page.getByLabel(/password/i).fill(password)
    await page.getByRole('button', { name: /sign in|log in/i }).click()
    await expect(page).not.toHaveURL(/\/login(?:\?|$)/)

    // School report derives school ID from the session; injected B must be ignored.
    await page.goto('/school/pilot-measurement/report/baseline?school=' + encodeURIComponent(bSchool))
    await expect(page.locator('body')).not.toContainText(bMarker)
    // The admin report route must also ignore a B override by school staff.
    await page.goto('/admin/school/pilot-measurement/report/baseline?school=' + encodeURIComponent(bSchool))
    await expect(page.locator('body')).not.toContainText(bMarker)
    await context.close()
  })
})
