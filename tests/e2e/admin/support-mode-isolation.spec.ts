import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { TEST_ACTORS, TEST_SCHOOLS } from '../../integration/setup/test-actors'
import { setupTestEnvironment, cleanupTestEnvironment, getServiceClient, resolveActorId } from '../../integration/setup/db-helpers'
import { assertTestEnvironment } from '../../integration/setup/production-guard'

test('authenticated platform support mode persists and enforces School A/B boundaries', async ({ page }) => {
  assertTestEnvironment()
  const service = getServiceClient()
  const seeded: string[] = []
  await setupTestEnvironment()
  try {
    // Local fixtures only. Seed real canonical assignment relationships.
    for (const side of ['A', 'B'] as const) {
      const { data, error } = await service.from('student_instructor_assignments').insert({
        school_id: TEST_SCHOOLS[`SCHOOL_${side}`].id,
        student_id: resolveActorId(`STUDENT_${side}`),
        instructor_id: resolveActorId(`INSTRUCTOR_${side}`),
        is_active: true,
      }).select('id').single()
      if (error || !data) throw new Error(`Fixture assignment ${side}: ${error?.message}`)
      seeded.push(data.id)
    }
    await page.goto('/login')
    await page.locator('input[type="email"]').fill(TEST_ACTORS.PLATFORM_ADMIN.email)
    await page.locator('input[type="password"]').fill(TEST_ACTORS.PLATFORM_ADMIN.password)
    await page.locator('button[type="submit"]').click()
    await page.goto('/admin/support-access')
    await expect(page.getByRole('heading', { name: 'Support Access' })).toBeVisible()
    const aCard = page.locator('div.rounded-xl').filter({hasText:TEST_ACTORS.INSTRUCTOR_A.email}).last()
    await expect(aCard.getByRole('button',{name:'Enter Support Mode'})).toBeVisible()
    await aCard.getByRole('button',{name:'Enter Support Mode'}).click()
    await expect(page).toHaveURL(/\/instructor(?:\?|$)/)
    await page.goto('/instructor/students')
    await expect(page).toHaveURL(/\/instructor\/students/)
    await expect(page.getByText(TEST_ACTORS.STUDENT_A.fullName)).toBeVisible()
    await expect(page.getByText(TEST_ACTORS.STUDENT_B.fullName)).toHaveCount(0)
    await page.reload()
    await expect(page.getByText(TEST_ACTORS.STUDENT_A.fullName)).toBeVisible()
    await expect(page.getByText(TEST_ACTORS.STUDENT_B.fullName)).toHaveCount(0)
  } finally {
    if (seeded.length) await service.from('student_instructor_assignments').delete().in('id',seeded)
    await cleanupTestEnvironment()
  }
})
