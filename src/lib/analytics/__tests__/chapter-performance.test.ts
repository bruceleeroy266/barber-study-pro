import { describe, expect, it } from 'vitest'
import { calculateChapterPerformance } from '@/lib/analytics'
import type { QuizAttempt, StudentProgress } from '@/types'

const chapters = [{ id: 'ch-6', chapter_number: 6, title: 'Anatomy & Physiology' }]

function makeAttempt(id: string, percentage: number): QuizAttempt {
  return {
    id,
    user_id: 'student-1',
    quiz_id: 'quiz-6',
    score: Math.round((percentage / 100) * 50),
    total_questions: 50,
    percentage,
    answers_json: {},
    completed_at: '2026-10-30T12:00:00Z',
  }
}

function makeProgress(progressPercentage: number): StudentProgress {
  return {
    id: 'prog-1',
    user_id: 'student-1',
    chapter_id: 'ch-6',
    flashcards_completed: false,
    quiz_completed: false,
    best_quiz_score: null,
    last_studied_at: null,
    progress_percentage: progressPercentage,
  }
}

describe('calculateChapterPerformance — assessment score must never fall back to progress percentage', () => {
  it('completed/passed: shows the best assessment score', () => {
    const result = calculateChapterPerformance(chapters, [makeAttempt('a1', 72), makeAttempt('a2', 92)], [makeProgress(100)])
    expect(result[0].score).toBe(92)
    expect(result[0].attempts).toBe(2)
  })

  it('completed/failed: shows the actual failing score, not the progress percentage', () => {
    const result = calculateChapterPerformance(chapters, [makeAttempt('a1', 60)], [makeProgress(100)])
    expect(result[0].score).toBe(60)
  })

  it('never-attempted: score is null even when chapter learning progress exists', () => {
    const result = calculateChapterPerformance(chapters, [], [makeProgress(40)])
    expect(result[0].score).toBeNull()
    expect(result[0].attempts).toBe(0)
  })

  it('never displays progress_percentage as a quiz score under any mix', () => {
    const result = calculateChapterPerformance(chapters, [], [makeProgress(100)])
    expect(result[0].score).toBeNull()
  })
})
