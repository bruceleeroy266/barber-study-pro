/**
 * Instructor Activity Signals (pure derivation)
 *
 * Instructors see TWO distinct recency signals that must never be conflated:
 *
 *   - Last Learning Activity — derived from student_progress.last_studied_at.
 *     Meaningful study work only: flashcards, quizzes, remediation/reassessment.
 *     "Active This Week" is built on this signal.
 *
 *   - Last Login — derived from auth.users.last_sign_in_at, fetched
 *     server-side only (see ./last-login). Account access, NOT study work.
 *
 * This module is the single derivation seam for both, kept pure so the
 * distinctness of the two signals is unit-testable.
 */

/**
 * Whole days elapsed since an ISO timestamp, or null when there is no signal.
 * Mirrors the derivation the instructor roster has always used.
 */
export function daysSinceTimestamp(
  isoTimestamp: string | null | undefined,
  now: Date = new Date()
): number | null {
  if (!isoTimestamp) return null
  const time = new Date(isoTimestamp).getTime()
  if (Number.isNaN(time)) return null
  return Math.floor((now.getTime() - time) / (1000 * 60 * 60 * 24))
}

export interface LearningVsLoginSignals {
  /** Most recent meaningful study activity (student_progress.last_studied_at). */
  lastLearningActivityAt: string | null
  /** Most recent account sign-in (auth.users.last_sign_in_at), server-fetched. */
  lastLoginAt: string | null
  /** Days since meaningful study activity. Null = never studied. */
  daysSinceLearning: number | null
  /** Days since account sign-in. Null = no login signal available. */
  daysSinceLogin: number | null
}

/**
 * Derive the instructor-facing activity signals for one student.
 *
 * The two inputs come from independent sources and are derived independently:
 * a recent login can NEVER masquerade as learning activity, and recent
 * learning activity NEVER requires a recent login (a session can stay alive
 * across many study days).
 */
export function deriveLearningVsLoginSignals(args: {
  lastStudiedAt: string | null
  lastSignInAt?: string | null
  now?: Date
}): LearningVsLoginSignals {
  const { lastStudiedAt, lastSignInAt = null, now = new Date() } = args

  return {
    lastLearningActivityAt: lastStudiedAt,
    lastLoginAt: lastSignInAt,
    daysSinceLearning: daysSinceTimestamp(lastStudiedAt, now),
    daysSinceLogin: daysSinceTimestamp(lastSignInAt, now),
  }
}
