import type { QuizAttempt, StudentProgress } from '@/types'
import { calculateBoardReadiness } from '@/lib/readiness'

export interface StudentLearningMetricInputs {
  userId: string
  progress: StudentProgress[]
  attempts: QuizAttempt[]
  totalChapters: number
}

export interface CanonicalStudentLearningMetrics {
  totalChapters: number
  completedChapters: number
  overallProgress: number
  flashcardsCompleted: number
  quizzesPassed: number
  averageQuizScore: number
  hasQuizEvidence: boolean
  hasProgressEvidence: boolean
  hasReadinessEvidence: boolean
  readiness: ReturnType<typeof calculateBoardReadiness>
}

/**
 * ADM-1D canonical student-level learning metrics.
 *
 * Every student, instructor, school-admin, and report surface must derive these
 * values from the same evidence and formulas. Missing chapter rows count as 0%
 * curriculum progress because totalChapters is the curriculum denominator.
 *
 * Board readiness deliberately receives only evidence that every parity surface
 * can resolve consistently. Surface-only extras (for example a dashboard-only
 * study streak) must not change the same student's readiness number.
 */
export function calculateCanonicalStudentLearningMetrics(
  inputs: StudentLearningMetricInputs
): CanonicalStudentLearningMetrics {
  const { userId, progress, attempts, totalChapters } = inputs
  const safeTotalChapters = Math.max(0, totalChapters)

  const completedChapters = progress.filter(
    (record) => record.progress_percentage === 100
  ).length

  const overallProgress = safeTotalChapters > 0
    ? Math.round(
        progress.reduce(
          (sum, record) => sum + Math.max(0, Math.min(100, record.progress_percentage)),
          0
        ) / safeTotalChapters
      )
    : 0

  const flashcardsCompleted = progress.filter(
    (record) => record.flashcards_completed
  ).length

  const quizzesPassed = progress.filter(
    (record) => record.quiz_completed
  ).length

  const averageQuizScore = attempts.length > 0
    ? Math.round(
        attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) /
          attempts.length
      )
    : 0

  const hasProgressEvidence = progress.length > 0
  const hasQuizEvidence = attempts.length > 0
  const hasReadinessEvidence =
    hasQuizEvidence ||
    progress.some((record) =>
      record.progress_percentage > 0 ||
      record.lesson_completed === true ||
      record.flashcards_completed === true ||
      record.knowledge_checks_completed === true ||
      record.quiz_completed === true
    )

  return {
    totalChapters: safeTotalChapters,
    completedChapters,
    overallProgress,
    flashcardsCompleted,
    quizzesPassed,
    averageQuizScore,
    hasQuizEvidence,
    hasProgressEvidence,
    hasReadinessEvidence,
    readiness: calculateBoardReadiness({
      userId,
      attempts,
      progress,
      totalChapters: safeTotalChapters,
    }),
  }
}
