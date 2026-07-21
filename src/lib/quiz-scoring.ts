export interface ScorableQuestion {
  id: string
  correctKey: string
}

export interface QuizScoreResult {
  score: number
  total: number
  percentage: number
  missedCount: number
}

/**
 * Calculate a quiz score from the recorded answers.
 *
 * The current question's answer is merged with the existing answer record as a
 * safeguard against state timing edge cases, and the current answer overwrites
 * any stale entry so each question is counted exactly once. The final
 * percentage is rounded to the nearest whole number and can never exceed 100%.
 */
export function calculateQuizScore(
  questions: ScorableQuestion[],
  answers: Record<string, string | null | undefined>,
  currentQuestionId: string,
  currentAnswer: string | null
): QuizScoreResult {
  const mergedAnswers = { ...answers, [currentQuestionId]: currentAnswer }
  let score = 0
  for (const q of questions) {
    if (mergedAnswers[q.id] === q.correctKey) {
      score++
    }
  }
  const total = questions.length
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  return {
    score,
    total,
    percentage,
    missedCount: total - score,
  }
}
