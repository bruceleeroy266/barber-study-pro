/**
 * Chapter progress calculation.
 *
 * Current persisted chapter-level signals:
 * - Flashcards completion: 15%
 * - Chapter quiz passed: 50%
 *
 * The remaining 35% is intentionally reserved for lesson/content and
 * knowledge-check/scenario completion once those activities have durable
 * chapter-level completion signals. Do not award that credit implicitly.
 *
 * A failed quiz attempt does NOT contribute quiz completion credit.
 */
export const CHAPTER_PROGRESS_WEIGHTS = {
  lesson: 15,
  flashcards: 15,
  knowledgeChecks: 20,
  quiz: 50,
} as const

export interface ChapterProgressSignals {
  lessonCompleted?: boolean
  flashcardsCompleted?: boolean
  knowledgeChecksCompleted?: boolean
  quizCompleted?: boolean
}

export function calculateChapterProgress(
  flashcardsCompleted: boolean,
  quizCompleted: boolean,
  additionalSignals: Pick<ChapterProgressSignals, 'lessonCompleted' | 'knowledgeChecksCompleted'> = {}
): number {
  let progress = 0

  if (additionalSignals.lessonCompleted) progress += CHAPTER_PROGRESS_WEIGHTS.lesson
  if (flashcardsCompleted) progress += CHAPTER_PROGRESS_WEIGHTS.flashcards
  if (additionalSignals.knowledgeChecksCompleted) progress += CHAPTER_PROGRESS_WEIGHTS.knowledgeChecks
  if (quizCompleted) progress += CHAPTER_PROGRESS_WEIGHTS.quiz

  return Math.min(100, progress)
}


/**
 * Existing 100% rows were completed before lesson/knowledge-check signals existed.
 * Preserve that historical completion without inventing activity flags.
 */
export function preserveLegacyFullCompletion(
  calculatedProgress: number,
  existingProgressPercentage?: number | null
): number {
  return existingProgressPercentage === 100 ? 100 : calculatedProgress
}

/**
 * Canonical chapter-quiz pass threshold. All chapter quizzes use
 * passing_score = 80 (see demo-data demoQuizzes). Passing is a score-derived
 * status and stays independent from quiz completion.
 */
export const QUIZ_PASSING_SCORE_PERCENT = 80

/** True when a best quiz score meets the passing threshold. */
export function isQuizPassed(bestScore: number | null | undefined): boolean {
  return (bestScore ?? 0) >= QUIZ_PASSING_SCORE_PERCENT
}

export interface QuizOutcomeSignals {
  /** Score of the attempt that just finished. */
  percentage: number
  /** Passing threshold of this quiz (quiz.passing_score). */
  passingScore: number
  /** Persisted best_quiz_score before this attempt (null/undefined when none). */
  existingBestScore: number | null | undefined
  /** Best attempt known to the page before this attempt (null when none). */
  bestAttemptPercentage: number | null | undefined
}

export interface QuizOutcome {
  /** Finishing the quiz marks completion, regardless of score. */
  quizCompleted: true
  /** True when this attempt or any prior best crossed the pass threshold. */
  quizPassed: boolean
  /** Max of this attempt and all known prior scores. */
  bestQuizScore: number
}

/**
 * Derives quiz completion / passing / best score for a finished attempt.
 * Completion and passing are deliberately independent:
 * - quizCompleted is always true once the student finishes the quiz.
 * - quizPassed feeds chapter learning progress (the 50% quiz weight stays
 *   pass-gated) and any pass/fail display.
 */
export function deriveQuizOutcome(signals: QuizOutcomeSignals): QuizOutcome {
  const quizPassed =
    signals.percentage >= signals.passingScore ||
    isQuizPassed(signals.existingBestScore) ||
    isQuizPassed(signals.bestAttemptPercentage)
  const bestQuizScore = Math.max(
    signals.percentage,
    signals.existingBestScore ?? 0,
    signals.bestAttemptPercentage ?? 0
  )
  return { quizCompleted: true, quizPassed, bestQuizScore }
}


export function areKnowledgeCheckSectionsComplete(
  requiredSectionIds: readonly string[],
  completedSectionIds: ReadonlySet<string>
): boolean {
  return requiredSectionIds.length > 0 &&
    requiredSectionIds.every((sectionId) => completedSectionIds.has(sectionId))
}
