import { describe, expect, it } from 'vitest'
import { buildMissedQuestions } from '@/lib/analytics'
import type { AnalyticsInputs } from '@/lib/analytics'
import type { QuizAttempt } from '@/types'

const userId = 'student-1'
const questionId = 'question-1'

const baseInputs: Omit<AnalyticsInputs, 'attempts'> = {
  userId,
  progress: [],
  chapters: [{ id: 'ch-2', chapter_number: 2, title: 'Life Skills' }],
  questions: [{
    id: questionId,
    quiz_id: 'quiz-2',
    question: 'Which answer is correct?',
    answer_a: 'Correct',
    answer_b: 'Wrong',
    answer_c: 'Also wrong',
    answer_d: 'Still wrong',
    correct_answer: 'a',
    explanation: 'A is correct.',
    difficulty: 'easy',
    order_index: 1,
  }],
}

function attempt(id: string, completedAt: string, answer: string): QuizAttempt {
  return {
    id,
    user_id: userId,
    quiz_id: 'quiz-2',
    score: answer === 'a' ? 1 : 0,
    total_questions: 1,
    percentage: answer === 'a' ? 100 : 0,
    answers_json: { [questionId]: answer },
    completed_at: completedAt,
  }
}

function build(attempts: QuizAttempt[]) {
  return buildMissedQuestions({ ...baseInputs, attempts })
}

describe('buildMissedQuestions current unresolved semantics', () => {
  it('keeps a question unresolved after repeated incorrect answers', () => {
    const result = build([
      attempt('a1', '2026-09-01T10:00:00.000Z', 'b'),
      attempt('a2', '2026-09-02T10:00:00.000Z', 'c'),
    ])

    expect(result).toHaveLength(1)
    expect(result[0].timesMissed).toBe(2)
    expect(result[0].studentAnswer).toBe('Also wrong')
    expect(result[0].missedAt).toBe('2026-09-02T10:00:00.000Z')
  })

  it('resolves a historical miss when the latest answer is correct', () => {
    const result = build([
      attempt('a1', '2026-09-01T10:00:00.000Z', 'b'),
      attempt('a2', '2026-09-02T10:00:00.000Z', 'a'),
    ])

    expect(result).toEqual([])
  })

  it('returns a question to the current list when it is missed again later', () => {
    const result = build([
      attempt('a1', '2026-09-01T10:00:00.000Z', 'b'),
      attempt('a2', '2026-09-02T10:00:00.000Z', 'a'),
      attempt('a3', '2026-09-03T10:00:00.000Z', 'd'),
    ])

    expect(result).toHaveLength(1)
    expect(result[0].timesMissed).toBe(2)
    expect(result[0].studentAnswer).toBe('Still wrong')
  })

  it('uses timestamps rather than caller array order to determine the latest answer', () => {
    const result = build([
      attempt('newer', '2026-09-03T10:00:00.000Z', 'a'),
      attempt('older', '2026-09-01T10:00:00.000Z', 'b'),
    ])

    expect(result).toEqual([])
  })
})
