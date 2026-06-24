/**
 * ANALYTICS ENGINE
 * ASCYN PRO / Barber Study Pro V2
 *
 * Transforms quiz attempts, chapter progress, and missed questions into
 * weak/strong area analytics that power dashboards, recommendations, and
 * future AI coaching.
 */

import { MissedQuestion } from '@/types'
import { AnalyticsInputs, AnalyticsResult } from './types'
import { calculateChapterPerformance } from './chapter-performance'
import { calculateCategoryPerformance } from './category-performance'
import { calculateStudentMetrics } from './student-metrics'
import { quizIdToChapterId, getCategoryForChapter } from './utils'

export * from './types'
export * from './utils'
export * from './chapter-performance'
export * from './category-performance'
export * from './student-metrics'

export function buildMissedQuestions(
  inputs: AnalyticsInputs
): MissedQuestion[] {
  const { userId, attempts, chapters, questions } = inputs
  const missed: MissedQuestion[] = []

  const chapterMap = new Map(chapters.map((c) => [c.id, c]))
  const questionMap = new Map(questions.map((q) => [q.id, q]))
  const seen = new Map<string, MissedQuestion>()

  for (const attempt of attempts) {
    const chapterId = quizIdToChapterId(attempt.quiz_id)
    const chapter = chapterMap.get(chapterId)
    if (!chapter) continue

    for (const [questionId, studentAnswerKey] of Object.entries(attempt.answers_json)) {
      const question = questionMap.get(questionId)
      if (!question) continue

      if (studentAnswerKey !== question.correct_answer) {
        const existing = seen.get(questionId)
        if (existing) {
          existing.timesMissed += 1
          if (new Date(attempt.completed_at) > new Date(existing.missedAt)) {
            existing.missedAt = attempt.completed_at
          }
        } else {
          const correctText =
            question.correct_answer === 'a'
              ? question.answer_a
              : question.correct_answer === 'b'
              ? question.answer_b
              : question.correct_answer === 'c'
              ? question.answer_c
              : question.answer_d

          const studentText =
            studentAnswerKey === 'a'
              ? question.answer_a
              : studentAnswerKey === 'b'
              ? question.answer_b
              : studentAnswerKey === 'c'
              ? question.answer_c
              : question.answer_d

          const missedQuestion: MissedQuestion = {
            id: `missed-${userId}-${questionId}`,
            userId,
            questionId,
            question: question.question,
            correctAnswer: correctText,
            studentAnswer: studentText,
            explanation: question.explanation,
            chapterId,
            chapterNumber: chapter.chapter_number,
            category: getCategoryForChapter(chapter.chapter_number),
            quizId: attempt.quiz_id,
            missedAt: attempt.completed_at,
            retakenAt: null,
            timesMissed: 1,
          }
          seen.set(questionId, missedQuestion)
          missed.push(missedQuestion)
        }
      }
    }
  }

  return missed.sort(
    (a, b) => new Date(b.missedAt).getTime() - new Date(a.missedAt).getTime()
  )
}

function buildMissedQuestionTrend(missed: MissedQuestion[]): { date: string; count: number }[] {
  const now = new Date()
  const trendMap = new Map<string, number>()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    trendMap.set(d.toISOString().split('T')[0], 0)
  }
  for (const m of missed) {
    const date = m.missedAt.split('T')[0]
    if (trendMap.has(date)) {
      trendMap.set(date, (trendMap.get(date) || 0) + 1)
    }
  }
  return Array.from(trendMap.entries()).map(([date, count]) => ({ date, count }))
}

export function analyzePerformance(inputs: AnalyticsInputs): AnalyticsResult {
  const { attempts, progress, chapters } = inputs

  const chapterPerformance = calculateChapterPerformance(chapters, attempts, progress)
  const categoryPerformance = calculateCategoryPerformance(chapterPerformance)
  const metrics = calculateStudentMetrics(attempts, chapterPerformance)
  const missed = buildMissedQuestions(inputs)
  const missedQuestionTrend = buildMissedQuestionTrend(missed)

  return {
    categoryPerformance,
    chapterPerformance,
    weakAreas: metrics.weakAreas,
    strongAreas: metrics.strongAreas,
    missedQuestionTrend,
    totalQuestionsAnswered: metrics.totalQuestionsAnswered,
    totalCorrect: metrics.totalCorrect,
    totalIncorrect: metrics.totalIncorrect,
    averageScore: metrics.averageScore,
  }
}
