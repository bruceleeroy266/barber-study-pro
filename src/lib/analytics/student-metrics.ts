/**
 * STUDENT METRICS ANALYTICS
 * ASCYN PRO / ASCYN PRO V2
 */

import { AreaPerformance, QuizAttempt, ScoredAreaPerformance } from '@/types'

export interface StudentMetrics {
  totalQuestionsAnswered: number
  totalCorrect: number
  totalIncorrect: number
  averageScore: number
  weakAreas: ScoredAreaPerformance[]
  strongAreas: ScoredAreaPerformance[]
}

export function calculateStudentMetrics(
  attempts: QuizAttempt[],
  chapterPerformance: AreaPerformance[]
): StudentMetrics {
  const totalQuestionsAnswered = attempts.reduce((sum, a) => sum + a.total_questions, 0)
  const totalCorrect = attempts.reduce((sum, a) => sum + a.score, 0)
  const totalIncorrect = totalQuestionsAnswered - totalCorrect
  const averageScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
    : 0

  // Only chapters with a real assessment score count as evidence; a null score
  // (never attempted) is excluded — never treated as 0 or as progress percentage.
  const scoredChapters = chapterPerformance.filter(
    (c): c is ScoredAreaPerformance => c.score !== null
  )
  const sortedAsc = [...scoredChapters].sort((a, b) => a.score - b.score)
  const sortedDesc = [...scoredChapters].sort((a, b) => b.score - a.score)

  const weakAreas = sortedAsc.slice(0, 5)
  const strongAreas = sortedDesc.filter((a) => a.score >= 80).slice(0, 5)

  return {
    totalQuestionsAnswered,
    totalCorrect,
    totalIncorrect,
    averageScore,
    weakAreas,
    strongAreas,
  }
}
