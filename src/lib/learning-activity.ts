/**
 * Shared Server-Side Learning-Activity Mechanism
 *
 * NOTE: intentionally no `import 'server-only'` marker — the Phase 6C route
 * test suites import the real route modules (which import this file) without
 * a server-only mock, and the marker would break them. This module is still
 * server-side by design: it performs writes only through a caller-supplied
 * Supabase client and is imported exclusively by route handlers.
 *
 * Shared Server-Side Learning-Activity Mechanism
 *
 * `student_progress.last_studied_at` is the platform's single learning-activity
 * signal. It answers: "when did this student last do meaningful study work on
 * this chapter?" It is NOT a login signal and must never be updated by auth
 * events.
 *
 * Historically only the browser quiz/flashcard clients updated this column,
 * which meant Chapter 2 remediation/reassessment work (Phase 6C, fully
 * server-side) never advanced a student's learning-activity timestamp. This
 * helper is the shared server-side mechanism those routes use so ALL meaningful
 * learning activity lands on the same column through one code path.
 *
 * Design rules:
 *   - Upsert keyed on (user_id, chapter_id): existing rows only get their
 *     timestamps touched (PostgREST updates just the submitted columns);
 *     a missing row is created with schema defaults, which is semantically
 *     honest — the student did study that chapter.
 *   - Call with the user-context server client (RLS-scoped to the acting
 *     student). Do not elevate to the service role for this write.
 *   - Never throws and never blocks the caller's primary flow: failures are
 *     logged loudly and returned, so activity tracking cannot silently fail
 *     but also cannot break remediation/quiz submission.
 */

export interface LearningActivityWriteResult {
  ok: boolean
  error?: string
}

/**
 * Minimal structural client — satisfied by the user-context server Supabase
 * client. Kept structural so the mechanism stays unit-testable.
 */
export interface LearningActivityClient {
  from(table: 'student_progress'): {
    upsert(
      values: Record<string, unknown>,
      options: { onConflict: string }
    ): PromiseLike<{ error: { message: string } | null }>
  }
}

/**
 * Record meaningful learning activity for (userId, chapterId) by advancing
 * student_progress.last_studied_at to `now`.
 *
 * @returns { ok: true } on success; { ok: false, error } on failure (logged).
 */
export async function recordLearningActivity(
  supabase: LearningActivityClient,
  userId: string,
  chapterId: string,
  now: Date = new Date()
): Promise<LearningActivityWriteResult> {
  try {
    const timestamp = now.toISOString()
    const { error } = await supabase
      .from('student_progress')
      .upsert(
        {
          user_id: userId,
          chapter_id: chapterId,
          last_studied_at: timestamp,
          updated_at: timestamp,
        },
        { onConflict: 'user_id,chapter_id' }
      )

    if (error) {
      console.error(
        `[learning-activity] Failed to record learning activity for chapter ${chapterId}: ${error.message}`
      )
      return { ok: false, error: error.message }
    }

    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error(
      `[learning-activity] Unexpected failure recording learning activity for chapter ${chapterId}: ${message}`
    )
    return { ok: false, error: message }
  }
}
