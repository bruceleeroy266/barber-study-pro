import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { getLocalQuizQuestions } from '../../../src/lib/local-data'

test('QA-120: authenticated Chapter 5 School A/B score and dashboard parity (LOCAL ONLY)', async ({ browser }) => {
  test.setTimeout(420_000)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  if (process.env.ASCYN_TEST_ENVIRONMENT !== 'true' || !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(url)) {
    throw new Error('QA-120 MUST use disposable localhost Supabase; production is prohibited')
  }
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!anon || !serviceKey) throw new Error('Missing disposable Supabase keys')

  const root = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const fixtureId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`
  const actors = [
    { email: `qa120-a-student-${fixtureId}@ascynpro.test`, role: 'student', school: 0 },
    { email: `qa120-a-instructor-${fixtureId}@ascynpro.test`, role: 'instructor', school: 0 },
    { email: `qa120-b-student-${fixtureId}@ascynpro.test`, role: 'student', school: 1 },
  ] as const
  const ids: string[] = []
  const schools: string[] = []
  const password = 'QA120LocalOnly2026!'
  try {
    for (const name of ['QA120 Disposable School A', 'QA120 Disposable School B']) {
      const { data, error } = await root.from('schools').insert({ name, is_active: true }).select('id').single()
      expect(error).toBeNull()
      schools.push(data!.id)
    }
    for (const actor of actors) {
      const { data, error } = await root.auth.admin.createUser({ email: actor.email, password, email_confirm: true })
      expect(error).toBeNull()
      const id = data.user!.id
      ids.push(id)
      const { error: profileError } = await root.from('profiles').upsert({
        id, email: actor.email, full_name: 'QA120 disposable',
        role: actor.role, school_id: schools[actor.school], approval_status: 'approved',
        is_disabled: false, requires_password_change: false,
      }, { onConflict: 'id' })
      expect(profileError).toBeNull()
    }
    const studentA = ids[0]
    // Instructor detail access requires an active canonical student assignment.
    const { error: assignmentError } = await root.from('student_instructor_assignments').insert({
      school_id: schools[0], student_id: studentA, instructor_id: ids[1], assigned_by: ids[1],
    })
    expect(assignmentError).toBeNull()
    const { data: attempt, error: attemptError } = await root.from('quiz_attempts')
      .insert({ user_id: studentA, quiz_id: 'quiz-5', score: 15, total_questions: 20, percentage: 50,
        answers_json: {}, completed_at: new Date().toISOString() }).select('id,percentage,score,total_questions').single()
    expect(attemptError).toBeNull()
    expect(attempt).toMatchObject({ percentage: 50, score: 15, total_questions: 20 })
    const { error: progressError } = await root.from('student_progress').upsert({
      user_id: studentA, chapter_id: 'ch-5', progress_percentage: 100,
      best_quiz_score: 50, quiz_completed: true,
    }, { onConflict: 'user_id,chapter_id' })
    expect(progressError).toBeNull()

    const clientA = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
    const clientB = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
    expect((await clientA.auth.signInWithPassword({ email: actors[0].email, password })).error).toBeNull()
    expect((await clientB.auth.signInWithPassword({ email: actors[2].email, password })).error).toBeNull()
    const own = await clientA.from('quiz_attempts').select('percentage').eq('id', attempt!.id).single()
    expect(own.error).toBeNull()
    expect(own.data?.percentage).toBe(50)
    const foreign = await clientB.from('quiz_attempts').select('percentage').eq('id', attempt!.id)
    expect(foreign.error).toBeNull()
    expect(foreign.data).toHaveLength(0)

    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('/login')
    await page.locator('input[type="email"]').fill(actors[0].email)
    await page.locator('input[type="password"]').fill(password)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL(/\/(?:beta-agreement|dashboard)(?:\/|\?|$)/)
    if (page.url().includes('/beta-agreement')) {
      await expect(page.getByText('Loading agreement status…')).toBeHidden()
      await page.locator('#tester-name').fill('QA120 test student')
      await page.locator('#tester-email').fill(actors[0].email)
      await page.locator('#agree-checkbox').scrollIntoViewIfNeeded()
      await expect(page.locator('#agree-checkbox')).toBeEnabled()
      await page.locator('#agree-checkbox').click()
      await expect(page.getByText('Agreement accepted. You may continue to the checklist.')).toBeVisible()
      await page.getByRole('button', { name: 'Continue' }).click()
    }
    await page.goto('/dashboard/progress')
    await expect(page.getByText('50%', { exact: true }).first()).toBeVisible()
    // QA-20: score must originate from real browser answers, not only a seeded row.
    const questions = getLocalQuizQuestions('quiz-5')
    expect(questions).toHaveLength(50)
    // QA-128: textbook-aligned Chapter 5 content must survive rendering/grading.
    for (const [id, expectedText] of [
      ['qq-5-002', '7-8 inches'],
      ['qq-5-003', 'Gradual blending in tight areas, around ears, and at necklines'],
      ['qq-5-023', 'Smoothing and aligning the cutting edge and polishing the blade with a strop'],
      ['qq-5-026', 'Concave grind has hollowed blade sides; wedge grind is not hollowed and forms an angle at the edge'],
      ['qq-5-030', 'Clamp the heated iron on tissue or toweling for five seconds; scorching indicates excessive heat'],
    ]) {
      const item = questions.find(q => q.id === id)
      expect(item, id).toBeDefined()
      const choice = item![`answer_${item!.correct_answer}` as 'answer_a' | 'answer_b' | 'answer_c' | 'answer_d']
      expect(choice).toBe(expectedText)
    }

    // A chapter navigation can paint the quiz button before client hydration.
    // Confirm the click actually activated the quiz; retry only while idle.
    const startChapterQuiz = async () => {
      await page.goto('/dashboard/chapters/5')
      const start = page.getByRole('button', { name: /^(Start Quiz|Retake Quiz)$/ })
      const active = page.getByTestId('active-quiz-question')
      for (let attempt = 0; attempt < 3; attempt++) {
        if (await active.count() === 1) return
        await expect(start).toBeVisible()
        await start.click()
        try {
          await expect(active).toHaveCount(1, { timeout: 4000 })
          return
        } catch {
          if (attempt === 2 || !(await start.isVisible())) throw new Error('Chapter 5 quiz did not activate after Retake Quiz click')
        }
      }
    }
    await startChapterQuiz()
    const used = new Set<string>()
    for (let index = 0; index < questions.length; index++) {
      // Only the active quiz question counts. The chapter page can contain
      // other visible question text (e.g. previews), so global text searches
      // incorrectly identify more than one question.
      const activeQuestion = page.getByTestId('active-quiz-question')
      await expect(activeQuestion).toHaveCount(1)
      const activeText = (await activeQuestion.textContent())?.trim()
      const visible = questions.filter(item => !used.has(item.id) && item.question.trim() === activeText)
      expect(visible).toHaveLength(1)
      const current = visible[0]
      used.add(current.id)
      const intendedKey = index < 25 ? current.correct_answer : (['a', 'b', 'c', 'd'].find(key => key !== current.correct_answer)!)
      const answerText = current[`answer_${intendedKey}` as 'answer_a' | 'answer_b' | 'answer_c' | 'answer_d']
      const answerButton = page.getByTestId('active-quiz-options').getByRole('button').filter({ hasText: answerText })
      await expect(answerButton).toHaveCount(1)
      await answerButton.click()
      await page.getByRole('button', { name: index === questions.length - 1 ? 'Submit & Finish Quiz' : 'Submit Answer' }).click()
    }
    await expect(page.getByText('You got 25 out of 50 questions correct')).toBeVisible()
    await expect(page.getByText('50%', { exact: true }).first()).toBeVisible()
    const { data: submitted, error: submittedError } = await root.from('quiz_attempts')
      .select('id,score,total_questions,percentage,answers_json')
      .eq('user_id', studentA).eq('quiz_id', 'quiz-5').order('completed_at', { ascending: false }).limit(1).single()
    expect(submittedError).toBeNull()
    expect(submitted?.id).not.toBe(attempt!.id)
    expect(submitted).toMatchObject({ score: 25, total_questions: 50, percentage: 50 })
    expect(Object.keys(submitted?.answers_json ?? {})).toHaveLength(50)
    const { data: persistedProgress, error: persistedProgressError } = await root.from('student_progress')
      .select('best_quiz_score').eq('user_id', studentA).eq('chapter_id', 'ch-5').single()
    expect(persistedProgressError).toBeNull()
    expect(persistedProgress?.best_quiz_score).toBe(50)
    // QA-93: actual browser-based boundary retakes in disposable infrastructure.
    for (const target of [0, 50]) {
      await startChapterQuiz()
      const seen = new Set<string>()
      for (let index = 0; index < questions.length; index++) {
        const activeQuestion = page.getByTestId('active-quiz-question')
        await expect(activeQuestion).toHaveCount(1)
        const activeText = (await activeQuestion.textContent())?.trim()
        const matches = questions.filter(item => !seen.has(item.id) && item.question.trim() === activeText)
        expect(matches).toHaveLength(1)
        const current = matches[0]
        seen.add(current.id)
        const key = index < target ? current.correct_answer
          : (['a', 'b', 'c', 'd'].find(letter => letter !== current.correct_answer)!)
        const choice = current[`answer_${key}` as 'answer_a' | 'answer_b' | 'answer_c' | 'answer_d']
        await page.getByTestId('active-quiz-options').getByRole('button').filter({ hasText: choice }).click()
        await page.getByRole('button', { name: index === questions.length - 1 ? 'Submit & Finish Quiz' : 'Submit Answer' }).click()
      }
      await expect(page.getByText(`You got ${target} out of 50 questions correct`)).toBeVisible()
      const { data: latest, error: latestError } = await root.from('quiz_attempts')
        .select('score,total_questions,percentage,answers_json').eq('user_id', studentA)
        .eq('quiz_id', 'quiz-5').order('completed_at', { ascending: false }).limit(1).single()
      expect(latestError).toBeNull()
      expect(latest).toMatchObject({ score: target, total_questions: 50, percentage: target === 0 ? 0 : 100 })
      expect(Object.keys(latest?.answers_json ?? {})).toHaveLength(50)
      const { data: best, error: bestError } = await root.from('student_progress')
        .select('best_quiz_score').eq('user_id', studentA).eq('chapter_id', 'ch-5').single()
      expect(bestError).toBeNull()
      expect(best?.best_quiz_score).toBe(target === 0 ? 50 : 100)
    }
    await context.close()

    const instructorContext = await browser.newContext()
    const instructorPage = await instructorContext.newPage()
    await instructorPage.goto('/login')
    await instructorPage.locator('input[type="email"]').fill(actors[1].email)
    await instructorPage.locator('input[type="password"]').fill(password)
    await instructorPage.locator('button[type="submit"]').click()
    await instructorPage.waitForURL(/\/instructor(?:\/|$)/)
    await instructorPage.goto(`/instructor/student/${studentA}`)
    await expect(instructorPage.getByText('100%', { exact: true }).filter({ visible: true }).first()).toBeVisible()
    // QA-174 acceptance: after a fully incorrect, saved Chapter 5 retake, the
    // assigned instructor must see concept-specific weak areas and missed evidence.
    const chapter5Details = instructorPage.locator('details[data-chapter-accordion]').filter({ hasText: 'Chapter 5 —' }).first()
    await expect(chapter5Details).toHaveCount(1)
    await chapter5Details.locator('summary').click()
    await expect(chapter5Details.getByText('Weakest Concepts', { exact: true })).toBeVisible()
    await expect(chapter5Details.getByText(/initial misses/).first()).toBeVisible()
    await expect(chapter5Details.getByText(/Targeted review/).first()).toBeVisible()
    await instructorContext.close()
  } finally {
    // This entire test runs against a disposable local database only.
    for (const id of ids.reverse()) await root.auth.admin.deleteUser(id)
    for (const id of schools.reverse()) await root.from('schools').delete().eq('id', id)
  }
})
