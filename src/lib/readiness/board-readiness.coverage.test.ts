import { describe, expect, it } from 'vitest'
import { calculateBoardReadiness } from './board-readiness'
import type { QuizAttempt, StudentProgress } from '@/types'

function attempt(chapter: number, percentage = 90): QuizAttempt {
  return {
    id: `attempt-${chapter}`,
    user_id: 'student-1',
    quiz_id: `quiz-${chapter}`,
    score: 27,
    total_questions: 30,
    percentage,
    answers_json: {},
    completed_at: '2026-09-16T20:00:00Z',
  }
}

function progress(chapter: number): StudentProgress {
  return {
    id: `progress-${chapter}`,
    user_id: 'student-1',
    chapter_id: `ch-${chapter}`,
    flashcards_completed: true,
    quiz_completed: true,
    best_quiz_score: 90,
    last_studied_at: '2026-09-16T20:00:00Z',
    progress_percentage: 100,
  }
}

describe('coverage-aware board readiness', () => {
  it('does not present strong early-chapter performance as near full-board readiness', () => {
    const result = calculateBoardReadiness({
      userId: 'student-1',
      attempts: [attempt(1), attempt(2), attempt(3)],
      progress: [progress(1), progress(2), progress(3)],
      totalChapters: 21,
      streakDays: 5,
    })

    expect(result.quizAverage).toBe(90)
    expect(result.quizCompletionRate).toBe(14)
    expect(result.chaptersCompleted).toBe(3)
    expect(result.score).toBeLessThan(70)
  })

  it('allows strong performance to become readiness only when curriculum coverage is broad', () => {
    const attempts = Array.from({ length: 21 }, (_, index) => attempt(index + 1, 95))
    const progressRows = Array.from({ length: 21 }, (_, index) => progress(index + 1))

    const result = calculateBoardReadiness({
      userId: 'student-1',
      attempts,
      progress: progressRows,
      totalChapters: 21,
      streakDays: 7,
    })

    expect(result.quizCompletionRate).toBe(100)
    expect(result.chapterCompletionRate).toBe(100)
    expect(result.flashcardEngagementRate).toBe(100)
    expect(result.score).toBeGreaterThanOrEqual(90)
  })
})
