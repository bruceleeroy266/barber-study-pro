import type { QuizAttempt, StudentProgress } from '@/types'

export interface TrustedStudyActivityRow {
  last_active_at: string | null
}

/**
 * ADM-1D canonical last-learning-activity resolver.
 *
 * A learning event can be represented by trusted active-study telemetry,
 * persisted chapter progress, or a completed quiz. The newest valid timestamp
 * wins so roster, detail, and report surfaces cannot disagree because they
 * happened to query only one evidence source.
 */
export function resolveLastLearningActivityAt(args: {
  progress: StudentProgress[]
  attempts: QuizAttempt[]
  trustedActivity?: TrustedStudyActivityRow[]
}): string | null {
  const candidates = [
    ...(args.trustedActivity ?? []).map((row) => row.last_active_at),
    ...args.progress.map((row) => row.last_studied_at),
    ...args.attempts.map((row) => row.completed_at),
  ]
    .filter((value): value is string => Boolean(value))
    .filter((value) => !Number.isNaN(new Date(value).getTime()))

  if (candidates.length === 0) return null

  return candidates.reduce((latest, value) =>
    new Date(value).getTime() > new Date(latest).getTime() ? value : latest
  )
}
