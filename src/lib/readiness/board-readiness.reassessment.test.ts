import { describe, expect, it } from 'vitest'
import { calculateBoardReadiness } from './board-readiness'
import type { QuizAttempt, StudentProgress } from '@/types'

type AttemptWithReassessment = QuizAttempt & { is_reassessment?: boolean }

const progress: StudentProgress[] = [
  {
    id: 'progress-2',
    user_id: 'student-1',
    chapter_id: 'ch-2',
    flashcards_completed: true,
    quiz_completed: true,
    best_quiz_score: 80,
    last_studied_at: '2026-09-13T20:00:00Z',
    progress_percentage: 100,
  },
]

function attempt(overrides: Partial<AttemptWithReassessment>): AttemptWithReassessment {
  return {
    id: 'attempt-base',
    user_id: 'student-1',
    quiz_id: 'quiz-2',
    score: 40,
    total_questions: 48,
    percentage: 83,
    answers_json: {},
    completed_at: '2026-09-13T20:00:00Z',
    ...overrides,
  }
}

describe('board readiness and remediation reassessments', () => {
  it('excludes one-question remediation attempts from readiness metrics', () => {
    const chapterAttempt = attempt({
      id: 'chapter-quiz',
      percentage: 83,
      score: 40,
      total_questions: 48,
    })
    const successfulReassessment = attempt({
      id: 'reassessment-success',
      percentage: 100,
      score: 1,
      total_questions: 1,
      completed_at: '2026-09-13T20:10:00Z',
      is_reassessment: true,
    })
    const unsuccessfulReassessment = attempt({
      id: 'reassessment-miss',
      percentage: 0,
      score: 0,
      total_questions: 1,
      completed_at: '2026-09-13T20:20:00Z',
      is_reassessment: true,
    })

    const baseline = calculateBoardReadiness({
      userId: 'student-1',
      attempts: [chapterAttempt],
      progress,
      totalChapters: 21,
      streakDays: 0,
    })

    const withRemediationEvidence = calculateBoardReadiness({
      userId: 'student-1',
      attempts: [chapterAttempt, successfulReassessment, unsuccessfulReassessment],
      progress,
      totalChapters: 21,
      streakDays: 0,
    })

    expect(withRemediationEvidence.quizAverage).toBe(83)
    expect(withRemediationEvidence.totalQuestionsAnswered).toBe(48)
    expect(withRemediationEvidence.quizCompletionRate).toBe(baseline.quizCompletionRate)
    expect(withRemediationEvidence.improvementTrend).toBe(baseline.improvementTrend)
    expect(withRemediationEvidence.score).toBe(baseline.score)
  })

  it('keeps legacy chapter attempts eligible when the reassessment flag is absent', () => {
    const legacyAttempt = attempt({ id: 'legacy-chapter-quiz', percentage: 88 })

    const result = calculateBoardReadiness({
      userId: 'student-1',
      attempts: [legacyAttempt],
      progress,
      totalChapters: 21,
    })

    expect(result.quizAverage).toBe(88)
    expect(result.totalQuestionsAnswered).toBe(48)
  })
})
