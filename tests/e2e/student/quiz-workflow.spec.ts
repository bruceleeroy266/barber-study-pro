import { test, expect } from '@playwright/test'
import { loginAsStudent } from '../../utilities/auth'

/**
 * QA-19: fail-closed, browser-driven quiz submission smoke test.
 * This is not the deterministic 12/20 authenticated School A/B certification:
 * a disposable known-answer question fixture and CI wiring are still required.
 */
test('student completes an actual chapter quiz and sees internally consistent results', async ({ page }) => {
  test.setTimeout(180_000)
  await loginAsStudent(page)
  await page.goto('/dashboard/chapters/1')
  const start = page.getByRole('button', { name: /^(Start Quiz|Retake Quiz)$/ })
  await expect(start).toBeVisible()
  await start.click()

  // Do not treat the absence of a quiz as a passing test.
  const progress = page.getByLabel(/Quiz progress: question \d+ of \d+/)
  await expect(progress).toBeVisible()
  const heading = page.getByText(/\d+ questions.*Multiple choice/)
  await expect(heading).toBeHidden()
  let questionCount = 0

  for (let index = 0; index < 200; index++) {
    const finish = page.getByRole('button', { name: 'Submit & Finish Quiz' })
    const advance = page.getByRole('button', { name: 'Submit Answer' })
    const finalQuestion = await finish.isVisible()
    const activeButton = finalQuestion ? finish : advance
    await expect(activeButton).toBeDisabled()

    // Real quiz answers are buttons labelled A., B., C. and D. The first
    // answer is intentionally not assumed correct because choices shuffle.
    const choice = page.getByRole('button', { name: /^A\.\s/ })
    await expect(choice).toBeVisible()
    await choice.click()
    await expect(activeButton).toBeEnabled()
    await activeButton.click()
    questionCount++

    if (finalQuestion) break
    await expect(page.getByLabel(new RegExp(`Quiz progress: question ${questionCount + 1} of \\d+`))).toBeVisible()
  }

  expect(questionCount).toBeGreaterThan(0)
  expect(questionCount).toBeLessThan(200)
  await expect(page.getByRole('heading', { name: /Quiz (Passed|Completed)/ })).toBeVisible()
  await expect(page.getByText(new RegExp(`Answer Review \\(${questionCount} questions\\)`))).toBeVisible()
  const correct = await page.getByText('Correct', { exact: true }).count()
  const missed = await page.getByText('Missed', { exact: true }).count()
  expect(correct + missed).toBe(questionCount)
  const expectedPercentage = Math.round((correct / questionCount) * 100)
  await expect(page.getByText(`${expectedPercentage}%`, { exact: true })).toBeVisible()
  await expect(page.getByText(`You got ${correct} out of ${questionCount} questions correct`)).toBeVisible()
  await expect(page.getByText(/could not save your quiz results/i)).toHaveCount(0)
})
