/**
 * Chapter progress calculation.
 *
 * Progress is weighted across the two currently tracked learning activities:
 * - Flashcards completion: 50%
 * - Quiz passed at/above the configured passing score: 50%
 *
 * A failed quiz attempt does NOT contribute to chapter completion.
 * The quiz is only considered complete when the student PASSES.
 */
export function calculateChapterProgress(
  flashcardsCompleted: boolean,
  quizCompleted: boolean
): number {
  let progress = 0

  if (flashcardsCompleted) {
    progress += 50
  }

  if (quizCompleted) {
    progress += 50
  }

  return Math.min(100, progress)
}