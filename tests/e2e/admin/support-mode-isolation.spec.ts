import { test, expect } from '@playwright/test'
import { TEST_ACTORS, TEST_SCHOOLS } from '../../integration/setup/test-actors'
import { setupTestEnvironment, cleanupTestEnvironment, getServiceClient, resolveActorId } from '../../integration/setup/db-helpers'
import { assertTestEnvironment } from '../../integration/setup/production-guard'

test.describe.configure({ retries: 0 })

test('authenticated platform support mode persists and enforces School A/B boundaries', async ({ page }) => {
  assertTestEnvironment()
  const service = getServiceClient()
  const seeded: string[] = []
  let quizId: string | null = null
  let progressId: string | null = null
  await setupTestEnvironment()
  try {
    // The shared RLS fixtures don't set the approval state required by browser login/support targets.
    for (const key of ['PLATFORM_ADMIN','INSTRUCTOR_A','INSTRUCTOR_B'] as const) {
      const { error } = await service.from('profiles').update({
        approval_status: 'approved', is_disabled: false, requires_password_change: false,
      }).eq('id',resolveActorId(key))
      if (error) throw new Error(`Approve fixture ${key}: ${error.message}`)
    }
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
    const learnerA = resolveActorId('STUDENT_A')
    const {data: quiz, error: quizError} = await service.from('quiz_attempts').insert({
      user_id: learnerA, quiz_id: 'quiz-4', score: 30, total_questions: 30,
      percentage: 100, completed_at: '2020-01-01T00:00:00.000Z'
    }).select('id').single()
    if (quizError || !quiz) throw new Error(`Readiness fixture quiz: ${quizError?.message}`)
    quizId = quiz.id
    const {data: progress, error: progressError} = await service.from('student_progress').insert({
      user_id: learnerA, chapter_id: 'ch-4', progress_percentage: 100,
      flashcards_completed: false, quiz_completed: true
    }).select('id').single()
    if (progressError || !progress) throw new Error(`Readiness fixture progress: ${progressError?.message}`)
    progressId = progress.id
    await page.goto('/login')
    await page.locator('input[type="email"]').fill(TEST_ACTORS.PLATFORM_ADMIN.email)
    await page.locator('input[type="password"]').fill(TEST_ACTORS.PLATFORM_ADMIN.password)
    await page.locator('button[type="submit"]').click()
    await expect(page).toHaveURL(/\/admin(?:\?|$)/, { timeout: 20000 })
    await page.goto('/admin/support-access')
    await expect(page.getByRole('heading', { name: 'Support Access' })).toBeVisible()
    const aCard = page.locator('div.rounded-xl').filter({hasText:TEST_ACTORS.INSTRUCTOR_A.email}).last()
    await expect(aCard.getByRole('button',{name:'Enter Support Mode'})).toBeVisible()
    await aCard.getByRole('button',{name:'Enter Support Mode'}).click()
    await expect(page).toHaveURL(/\/instructor(?:\?|$)/)
    const readinessRow = page.getByRole('table').filter({ has: page.getByRole('columnheader', { name: 'Readiness Score' }) }).getByRole('row').filter({ hasText: TEST_ACTORS.STUDENT_A.fullName })
    await expect(readinessRow).toContainText('57')
    await expect(readinessRow).toContainText('At Risk')
    await expect(page.getByRole('row').filter({hasText:TEST_ACTORS.STUDENT_B.fullName})).toHaveCount(0)
    await page.goto('/instructor/students')
    await expect(page).toHaveURL(/\/instructor\/students/)
    await expect(page.getByText(TEST_ACTORS.STUDENT_A.fullName)).toBeVisible()
    await expect(page.getByText(TEST_ACTORS.STUDENT_B.fullName)).toHaveCount(0)
    await page.reload()
    await expect(page.getByText(TEST_ACTORS.STUDENT_A.fullName)).toBeVisible()
    await expect(page.getByText(TEST_ACTORS.STUDENT_B.fullName)).toHaveCount(0)
  } finally {
    if (progressId) await service.from('student_progress').delete().eq('id',progressId)
    if (quizId) await service.from('quiz_attempts').delete().eq('id',quizId)
    if (seeded.length) await service.from('student_instructor_assignments').delete().in('id',seeded)
    await cleanupTestEnvironment()
  }
})
