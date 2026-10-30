import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { chapter6PremiumQuizQuestions } from '../../src/lib/chapter-6-premium-quiz'

// QA-only opt-in test. No accounts, tokens or session files committed.
// Required environment: ASCYN_QA_BASE_URL, ASCYN_QA_STUDENT_EMAIL,
// ASCYN_QA_STUDENT_PASSWORD, ASCYN_QA_SUPABASE_URL, ASCYN_QA_SUPABASE_ANON_KEY.
// Run with: npx playwright test tests/e2e/ascyn-analytics-cert-12-ch6.spec.ts --workers=1
const base = process.env.ASCYN_QA_BASE_URL
const email = process.env.ASCYN_QA_STUDENT_EMAIL
const password = process.env.ASCYN_QA_STUDENT_PASSWORD
const dbUrl = process.env.ASCYN_QA_SUPABASE_URL
const anonKey = process.env.ASCYN_QA_SUPABASE_ANON_KEY
const enabled = Boolean(base && email && password && dbUrl && anonKey)

test('Chapter 6 UI submission matches persisted score and every recorded answer', async ({ page }) => {
  test.skip(!enabled, 'QA student credentials and isolated QA target must be provided explicitly')
  const url = new URL(base!)
  expect(url.protocol).toBe('https:')
  expect(url.hostname).toBe('barber-study-eup3ozznd-gabebot24-5010s-projects.vercel.app')
  expect(new URL(dbUrl!).hostname).toBe('ssbtzoukmvafcfympayd.supabase.co')

  const supabase = createClient(dbUrl!, anonKey!, { auth: { persistSession: false } })
  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({ email: email!, password: password! })
  expect(authError).toBeNull()
  expect(auth.user).not.toBeNull()
  const studentId = auth.user!.id
  const { data: existing, error: beforeError } = await supabase.from('quiz_attempts')
    .select('id').eq('user_id', studentId).eq('quiz_id', 'quiz-6')
  expect(beforeError).toBeNull()
  const existingIds = new Set((existing ?? []).map(a => a.id))

  await page.goto(url.origin + '/login?redirect=%2Fdashboard%2Fchapters%2F6')
  await page.getByLabel(/email/i).fill(email!)
  await page.getByLabel(/password/i).fill(password!)
  await page.getByRole('button', { name: /sign in/i }).click()
  await page.goto(url.origin + '/dashboard/chapters/6')
  await expect(page.getByRole('button', { name: 'Start Quiz' })).toBeVisible()
  await page.getByRole('button', { name: 'Start Quiz' }).click()

  const bank = new Map(chapter6PremiumQuizQuestions.map(q => [q.question.trim(), q]))
  const answers: Record<string,string> = {}
  let expectedCorrect = 0
  for (let n = 1; n <= 50; n++) {
    await expect(page.getByText(new RegExp('Question ' + n + ' of 50'))).toBeVisible()
    const questionText = (await page.getByTestId('active-quiz-question').innerText()).trim()
    const question = bank.get(questionText)
    expect(question, 'Missing bank question: ' + questionText).toBeDefined()
    const options = page.getByTestId('active-quiz-options').locator('button')
    await expect(options).toHaveCount(4)
    const chosenText = (await options.first().innerText()).replace(/^A\\.\\s*/, '').trim()
    const matchingKey = (['a','b','c','d'] as const).find(key => question!['answer_' + key] === chosenText)
    expect(matchingKey, 'Option text mismatch on ' + question!.id).toBeDefined()
    answers[question!.id] = matchingKey!
    if (matchingKey === question!.correct_answer) expectedCorrect++
    await options.first().click()
    await page.getByRole('button', { name: n === 50 ? 'Submit & Finish Quiz' : 'Submit Answer' }).click()
  }
  await expect(page.getByText(/quiz complete|quiz results|your score/i).first()).toBeVisible({ timeout: 30000 })
  const { data: attempts, error } = await supabase.from('quiz_attempts').select('id,score,total_questions,percentage,answers_json')
    .eq('user_id', studentId).eq('quiz_id','quiz-6').order('completed_at',{ascending:false}).limit(5)
  expect(error).toBeNull()
  const attempt = attempts?.find(a => !existingIds.has(a.id))
  expect(attempt, 'No newly persisted attempt for QA Student').toBeDefined()
  expect(attempt!.score).toBe(expectedCorrect)
  expect(attempt!.total_questions).toBe(50)
  expect(attempt!.percentage).toBe(Math.round(expectedCorrect / 50 * 100))
  expect(attempt!.answers_json).toEqual(answers)
  const missedIds = Object.keys(answers).filter(id => {
    const q = chapter6PremiumQuizQuestions.find(x => x.id === id)!
    return answers[id] !== q.correct_answer
  })
  expect(missedIds).toHaveLength(50 - expectedCorrect)
  test.info().annotations.push({type:'qa-attempt',description:attempt!.id})
  test.info().annotations.push({type:'missed-question-ids',description:missedIds.join(',')})
})
