/**
 * BOARD READINESS ENGINE
 * ASCYN PRO / ASCYN PRO V2
 *
 * Calculates a composite board readiness score for each student based on
 * quiz performance, curriculum coverage, flashcard engagement, consistency,
 * and recent improvement trends.
 */

import { BoardReadiness, ReadinessLevel, QuizAttempt, StudentProgress, Grade } from '@/types'

export interface ReadinessInputs {
  userId: string
  attempts: QuizAttempt[]
  progress: StudentProgress[]
  totalChapters: number
  flashcardDecksCompleted?: number
  streakDays?: number
  grades?: Grade[]
}

type ReadinessQuizAttempt = QuizAttempt & {
  is_reassessment?: boolean | null
}

/** Reassessment evidence is intentionally excluded from board-readiness coverage. */
function getReadinessEligibleAttempts(attempts: QuizAttempt[]): QuizAttempt[] {
  return attempts.filter(
    (attempt) => (attempt as ReadinessQuizAttempt).is_reassessment !== true
  )
}

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
  return Math.min(100, Math.round((uniqueQuizzes / totalChapters) * 100))
}

function chapterCompletionRate(progress: StudentProgress[], totalChapters: number): number {
  if (totalChapters === 0) return 0
  const completed = progress.filter((p) => p.progress_percentage === 100).length
  return Math.min(100, Math.round((completed / totalChapters) * 100))
}

function flashcardEngagementRate(progress: StudentProgress[], totalChapters: number): number {
  if (totalChapters === 0) return 0
  const completed = progress.filter((p) => p.flashcards_completed).length
  return Math.min(100, Math.round((completed / totalChapters) * 100))
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
  if (secondHalf.length === 0) return 'stable'

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

function gradeTrendAdjustment(grades: Grade[] | undefined): number {
  if (!grades || grades.length < 3) return 0
  const nonExcused = grades.filter((g) => !g.isExcused)
  if (nonExcused.length < 3) return 0

  const sorted = [...nonExcused].sort(
    (a, b) => new Date(a.dateEntered).getTime() - new Date(b.dateEntered).getTime()
  )
  const mid = Math.ceil(sorted.length / 2)
  const firstHalf = sorted.slice(0, mid)
  const secondHalf = sorted.slice(mid)
  if (secondHalf.length === 0) return 0

  const firstAvg = firstHalf.reduce((sum, g) => sum + g.percentage, 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, g) => sum + g.percentage, 0) / secondHalf.length

  const diff = secondAvg - firstAvg
  if (diff >= 5) return 2
  if (diff <= -5) return -2
  return 0
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
    grades,
  } = inputs

  const readinessAttempts = getReadinessEligibleAttempts(attempts)
  const quizAverage = averageAttemptScore(readinessAttempts)
  const quizRate = quizCompletionRate(readinessAttempts, totalChapters)
  const chapterRate = chapterCompletionRate(progress, totalChapters)
  const flashcardRate =
    flashcardDecksCompleted !== undefined
      ? Math.min(100, Math.round((flashcardDecksCompleted / Math.max(1, totalChapters)) * 100))
      : flashcardEngagementRate(progress, totalChapters)

  const consistency = consistencyScore(readinessAttempts, streakDays)
  const trend = improvementTrend(readinessAttempts)

  // C3-4: Board readiness must represent both demonstrated performance and
  // breadth of curriculum evidence. A high score on only the first few chapter
  // quizzes is useful evidence, but it is not equivalent to whole-board
  // readiness. Coverage therefore carries meaningful weight instead of the
  // legacy 4%/4%/4% contribution.
  const score = Math.round(
    quizAverage * 0.55 +
    quizRate * 0.15 +
    chapterRate * 0.15 +
    flashcardRate * 0.10 +
    consistency * 0.05 +
    (trend === 'improving' ? 3 : trend === 'declining' ? -3 : 0) +
    gradeTrendAdjustment(grades)
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
    totalQuestionsAnswered: totalQuestionsAnswered(readinessAttempts),
    chaptersCompleted: progress.filter((p) => p.progress_percentage === 100).length,
    totalChapters,
    recommendedStudyMinutes: recommendedStudyMinutes(clampedScore, 0),
    updatedAt: new Date().toISOString(),
  }
}

export function getReadinessColorClass(score: number): string {
  const level = getLevel(score)
  switch (level) {
    case 'Ready': return 'text-gold'
    case 'Nearly Ready': return 'text-warm-bronze'
    case 'Needs Review': return 'text-warm-bronze'
    case 'At Risk': return 'text-silver'
    default: return 'text-silver'
  }
}

export function getReadinessBgClass(score: number): string {
  const level = getLevel(score)
  switch (level) {
    case 'Ready': return 'bg-gold'
    case 'Nearly Ready': return 'bg-warm-bronze'
    case 'Needs Review': return 'bg-warm-bronze'
    case 'At Risk': return 'bg-silver'
    default: return 'bg-silver-gray'
  }
}

export { getLevel, getLevelColor }
