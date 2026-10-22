import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

test('QA-11: authenticated School A/B quiz score and dashboard parity (LOCAL ONLY)', async ({ browser }) => {
  test.setTimeout(120_000)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  if (process.env.ASCYN_TEST_ENVIRONMENT !== 'true' || !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(url)) {
    throw new Error('QA-11 MUST use disposable localhost Supabase; production is prohibited')
  }
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!anon || !serviceKey) throw new Error('Missing disposable Supabase keys')

  const root = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const actors = [
    { email: 'qa11-a-student@ascynpro.test', role: 'student', school: 0 },
    { email: 'qa11-a-instructor@ascynpro.test', role: 'instructor', school: 0 },
    { email: 'qa11-b-student@ascynpro.test', role: 'student', school: 1 },
  ] as const
  const ids: string[] = []
  const schools: string[] = []
  const password = 'QA11LocalOnly2026!'
  try {
    for (const name of ['QA11 Disposable School A', 'QA11 Disposable School B']) {
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
        id, email: actor.email, full_name: 'QA11 disposable',
        role: actor.role, school_id: schools[actor.school], approval_status: 'approved',
        is_disabled: false, requires_password_change: false,
      }, { onConflict: 'id' })
      expect(profileError).toBeNull()
    }
    const studentA = ids[0]
    const { data: attempt, error: attemptError } = await root.from('quiz_attempts')
      .insert({ user_id: studentA, quiz_id: 'quiz-1', score: 12, total_questions: 20, percentage: 60,
        answers_json: {}, completed_at: new Date().toISOString() }).select('id,percentage,score,total_questions').single()
    expect(attemptError).toBeNull()
    expect(attempt).toMatchObject({ percentage: 60, score: 12, total_questions: 20 })
    const { error: progressError } = await root.from('student_progress').upsert({
      user_id: studentA, chapter_id: 'ch-1', progress_percentage: 100,
      best_quiz_score: 60, quiz_completed: true,
    }, { onConflict: 'user_id,chapter_id' })
    expect(progressError).toBeNull()

    const clientA = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
    const clientB = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
    expect((await clientA.auth.signInWithPassword({ email: actors[0].email, password })).error).toBeNull()
    expect((await clientB.auth.signInWithPassword({ email: actors[2].email, password })).error).toBeNull()
    const own = await clientA.from('quiz_attempts').select('percentage').eq('id', attempt!.id).single()
    expect(own.error).toBeNull()
    expect(own.data?.percentage).toBe(60)
    const foreign = await clientB.from('quiz_attempts').select('percentage').eq('id', attempt!.id)
    expect(foreign.error).toBeNull()
    expect(foreign.data).toHaveLength(0)

    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto('/login')
    await page.locator('input[type="email"]').fill(actors[0].email)
    await page.locator('input[type="password"]').fill(password)
    await page.locator('button[type="submit"]').click()
    await page.waitForURL(/\/dashboard(?:\/|$)/)
    await page.goto('/dashboard/progress')
    await expect(page.getByText('60%', { exact: true }).first()).toBeVisible()
    await context.close()

    const instructorContext = await browser.newContext()
    const instructorPage = await instructorContext.newPage()
    await instructorPage.goto('/login')
    await instructorPage.locator('input[type="email"]').fill(actors[1].email)
    await instructorPage.locator('input[type="password"]').fill(password)
    await instructorPage.locator('button[type="submit"]').click()
    await instructorPage.waitForURL(/\/instructor(?:\/|$)/)
    await instructorPage.goto(`/instructor/student/${studentA}`)
    await expect(instructorPage.getByText('60%', { exact: true }).first()).toBeVisible()
    await instructorContext.close()
  } finally {
    // This entire test runs against a disposable local database only.
    for (const id of ids.reverse()) await root.auth.admin.deleteUser(id)
    for (const id of schools.reverse()) await root.from('schools').delete().eq('id', id)
  }
})
