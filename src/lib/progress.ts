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


export function areKnowledgeCheckSectionsComplete(
  requiredSectionIds: readonly string[],
  completedSectionIds: ReadonlySet<string>
): boolean {
  return requiredSectionIds.length > 0 &&
    requiredSectionIds.every((sectionId) => completedSectionIds.has(sectionId))
}
