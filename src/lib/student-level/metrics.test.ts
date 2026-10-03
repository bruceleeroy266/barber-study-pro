import { describe, expect, it } from 'vitest'
import type { QuizAttempt, StudentProgress } from '@/types'
import { calculateCanonicalStudentLearningMetrics } from './metrics'

function progress(
  chapterId: string,
  percentage: number,
  flashcardsCompleted = false,
  quizCompleted = false
): StudentProgress {
  return {
    id: `progress-${chapterId}`,
    user_id: 'student-1',
    chapter_id: chapterId,
    progress_percentage: percentage,
    flashcards_completed: flashcardsCompleted,
    quiz_completed: quizCompleted,
    best_quiz_score: null,
    last_studied_at: null,
    created_at: '2026-10-03T00:00:00.000Z',
    updated_at: '2026-10-03T00:00:00.000Z',
  } as StudentProgress
}

function attempt(id: string, percentage: number): QuizAttempt {
  return {
    id,
    user_id: 'student-1',
    quiz_id: `quiz-${id}`,
    score: percentage,
    total_questions: 100,
    percentage,
    answers: {},
    completed_at: '2026-10-03T00:00:00.000Z',
  } as QuizAttempt
}

describe('ADM-1D canonical student learning metrics', () => {
  it('uses average chapter progress across the full curriculum denominator', () => {
    const metrics = calculateCanonicalStudentLearningMetrics({
      userId: 'student-1',
      progress: [
        progress('ch-1', 100, true, true),
        progress('ch-2', 50),
      ],
      attempts: [],
      totalChapters: 4,
    })

    expect(metrics.overallProgress).toBe(38)
    expect(metrics.completedChapters).toBe(1)
    expect(metrics.flashcardsCompleted).toBe(1)
    expect(metrics.quizzesPassed).toBe(1)
  })

  it('does not collapse partial work into completed-chapters-only progress', () => {
    const metrics = calculateCanonicalStudentLearningMetrics({
      userId: 'student-1',
      progress: [progress('ch-1', 99)],
      attempts: [],
      totalChapters: 1,
    })

    expect(metrics.overallProgress).toBe(99)
    expect(metrics.completedChapters).toBe(0)
  })

  it('uses the same arithmetic quiz average for every parity surface', () => {
    const metrics = calculateCanonicalStudentLearningMetrics({
      userId: 'student-1',
      progress: [],
      attempts: [attempt('1', 70), attempt('2', 90)],
      totalChapters: 21,
    })

    expect(metrics.averageQuizScore).toBe(80)
    expect(metrics.hasQuizEvidence).toBe(true)
  })

  it('uses the canonical board-readiness engine without surface-only bonuses', () => {
    const inputs = {
      userId: 'student-1',
      progress: [progress('ch-1', 100, true, true)],
      attempts: [attempt('1', 90)],
      totalChapters: 21,
    }

    const first = calculateCanonicalStudentLearningMetrics(inputs)
    const second = calculateCanonicalStudentLearningMetrics(inputs)

    expect(first.readiness.score).toBe(second.readiness.score)
    expect(first.readiness.level).toBe(second.readiness.level)
  })

  it('clamps malformed progress percentages before aggregation', () => {
    const metrics = calculateCanonicalStudentLearningMetrics({
      userId: 'student-1',
      progress: [progress('ch-1', 140), progress('ch-2', -20)],
      attempts: [],
      totalChapters: 2,
    })

    expect(metrics.overallProgress).toBe(50)
  })
})
