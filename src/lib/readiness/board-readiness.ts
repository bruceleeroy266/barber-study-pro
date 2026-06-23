/**
 * BOARD READINESS ENGINE
 * ASCYN PRO / Barber Study Pro V2
 *
 * Calculates a composite board readiness score for each student based on
 * quiz performance, chapter completion, flashcard engagement, consistency,
 * and recent improvement trends.
 */

import { BoardReadiness, ReadinessLevel, QuizAttempt, StudentProgress } from '@/types'

export interface ReadinessInputs {
  userId: string
  attempts: QuizAttempt[]
  progress: StudentProgress[]
  totalChapters: number
  flashcardDecksCompleted?: number
  streakDays?: number
}

const PASSING_SCORE = 75

function getLevel(score: number): ReadinessLevel {
  if (score >= 90) return 'Ready'
  if (score >= 80) return 'Nearly Ready'
  if (score >= 70) return 'Needs Review'
  return 'At Risk'
}

function getLevelColor(level: ReadinessLevel): string {
  switch (level) {
    case 'Ready': return 'green'
    case 'Nearly Ready': return 'yellow'
    case 'Needs Review': return 'orange'
    case 'At Risk': return 'red'
    default: return 'gray'
  }
}

function averageAttemptScore(attempts: QuizAttempt[]): number {
  if (attempts.length === 0) return 0
  return Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
}

function quizCompletionRate(attempts: QuizAttempt[], totalChapters: number): number {
  if (totalChapters === 0) return 0
  const uniqueQuizzes = new Set(attempts.map((a) => a.quiz_id)).size
  return Math.round((uniqueQuizzes / totalChapters) * 100)
}

function chapterCompletionRate(progress: StudentProgress[], totalChapters: number): number {
  if (totalChapters === 0) return 0
  const completed = progress.filter((p) => p.progress_percentage === 100).length
  return Math.round((completed / totalChapters) * 100)
}

function flashcardEngagementRate(progress: StudentProgress[], totalChapters: number): number {
  if (totalChapters === 0) return 0
  const completed = progress.filter((p) => p.flashcards_completed).length
  return Math.round((completed / totalChapters) * 100)
}

function consistencyScore(attempts: QuizAttempt[], streakDays: number): number {
  const now = Date.now()
  const oneWeek = 7 * 24 * 60 * 60 * 1000
  const recentAttempts = attempts.filter(
    (a) => now - new Date(a.completed_at).getTime() <= oneWeek
  )
  const recentScore = Math.min(100, recentAttempts.length * 20)
  const streakScore = Math.min(100, streakDays * 14)
  return Math.round(recentScore * 0.6 + streakScore * 0.4)
}

function improvementTrend(attempts: QuizAttempt[]): 'improving' | 'stable' | 'declining' {
  if (attempts.length < 2) return 'stable'

  const sorted = [...attempts].sort(
    (a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
  )

  const mid = Math.ceil(sorted.length / 2)
  const firstHalf = sorted.slice(0, mid)
  const secondHalf = sorted.slice(mid)

  const firstAvg = firstHalf.reduce((sum, a) => sum + a.percentage, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, a) => sum + a.percentage, 0) / secondHalf.length

  const diff = secondAvg - firstAvg
  if (diff >= 5) return 'improving'
  if (diff <= -5) return 'declining'
  return 'stable'
}

function totalQuestionsAnswered(attempts: QuizAttempt[]): number {
  return attempts.reduce((sum, a) => sum + a.total_questions, 0)
}

function recommendedStudyMinutes(readiness: number, weakAreaCount: number): number {
  let base = 0
  if (readiness >= 90) base = 15
  else if (readiness >= 80) base = 25
  else if (readiness >= 70) base = 40
  else base = 60

  const weaknessBonus = Math.min(30, weakAreaCount * 5)
  return base + weaknessBonus
}

export function calculateBoardReadiness(inputs: ReadinessInputs): BoardReadiness {
  const {
    userId,
    attempts,
    progress,
    totalChapters,
    flashcardDecksCompleted,
    streakDays = 0,
  } = inputs

  const quizAverage = averageAttemptScore(attempts)
  const quizRate = quizCompletionRate(attempts, totalChapters)
  const chapterRate = chapterCompletionRate(progress, totalChapters)
  const flashcardRate =
    flashcardDecksCompleted !== undefined
      ? Math.round((flashcardDecksCompleted / totalChapters) * 100)
      : flashcardEngagementRate(progress, totalChapters)

  const consistency = consistencyScore(attempts, streakDays)
  const trend = improvementTrend(attempts)

  // Quiz performance is the strongest predictor of board success.
  // Coverage metrics provide signal without over-penalizing students
  // who are still progressing through the 21-chapter program.
  const score = Math.round(
    quizAverage * 0.85 +
    quizRate * 0.04 +
    chapterRate * 0.04 +
    flashcardRate * 0.04 +
    consistency * 0.03 +
    (trend === 'improving' ? 5 : trend === 'declining' ? -5 : 0)
  )

  const clampedScore = Math.max(0, Math.min(100, score))
  const level = getLevel(clampedScore)

  return {
    userId,
    score: clampedScore,
    level,
    quizAverage,
    quizCompletionRate: quizRate,
    chapterCompletionRate: chapterRate,
    flashcardEngagementRate: flashcardRate,
    consistencyScore: consistency,
    improvementTrend: trend,
    totalQuestionsAnswered: totalQuestionsAnswered(attempts),
    chaptersCompleted: progress.filter((p) => p.progress_percentage === 100).length,
    totalChapters,
    recommendedStudyMinutes: recommendedStudyMinutes(clampedScore, 0),
    updatedAt: new Date().toISOString(),
  }
}

export function getReadinessColorClass(score: number): string {
  const level = getLevel(score)
  switch (level) {
    case 'Ready': return 'text-green-400'
    case 'Nearly Ready': return 'text-yellow-400'
    case 'Needs Review': return 'text-orange-400'
    case 'At Risk': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

export function getReadinessBgClass(score: number): string {
  const level = getLevel(score)
  switch (level) {
    case 'Ready': return 'bg-green-500'
    case 'Nearly Ready': return 'bg-yellow-500'
    case 'Needs Review': return 'bg-orange-500'
    case 'At Risk': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

export { getLevel, getLevelColor }
