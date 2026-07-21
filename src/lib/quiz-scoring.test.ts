import { describe, it, expect } from 'vitest'
import { calculateQuizScore, ScorableQuestion } from './quiz-scoring'

function makeQuestions(count: number): ScorableQuestion[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `q-${i + 1}`,
    correctKey: 'b',
  }))
}

function buildAnswers(count: number, correctCount: number): Record<string, string> {
  const answers: Record<string, string> = {}
  for (let i = 0; i < count; i++) {
    answers[`q-${i + 1}`] = i < correctCount ? 'b' : 'a'
  }
  return answers
}

describe('calculateQuizScore', () => {
  it('returns 0% when no answers are correct', () => {
    const questions = makeQuestions(30)
    const answers = buildAnswers(30, 0)
    const result = calculateQuizScore(questions, answers, 'q-30', 'a')
    expect(result.score).toBe(0)
    expect(result.percentage).toBe(0)
    expect(result.missedCount).toBe(30)
  })

  it('returns 80% when 24 of 30 are correct', () => {
    const questions = makeQuestions(30)
    const answers = buildAnswers(30, 24)
    // Keep q-25 incorrect so the total stays 24/30 (80%).
    const result = calculateQuizScore(questions, answers, 'q-25', 'a')
    expect(result.score).toBe(24)
    expect(result.percentage).toBe(80)
    expect(result.missedCount).toBe(6)
  })

  it('returns 83% when 25 of 30 are correct', () => {
    const questions = makeQuestions(30)
    const answers = buildAnswers(30, 25)
    // Keep q-26 incorrect so the total stays 25/30 (83%).
    const result = calculateQuizScore(questions, answers, 'q-26', 'a')
    expect(result.score).toBe(25)
    expect(result.percentage).toBe(83)
    expect(result.missedCount).toBe(5)
  })

  it('returns 100% when all answers are correct', () => {
    const questions = makeQuestions(30)
    const answers = buildAnswers(30, 30)
    const result = calculateQuizScore(questions, answers, 'q-30', 'b')
    expect(result.score).toBe(30)
    expect(result.percentage).toBe(100)
    expect(result.missedCount).toBe(0)
  })

  it('counts the final answer exactly once when it is correct', () => {
    const questions = makeQuestions(5)
    // First 4 questions answered correctly in the answers record.
    const answers: Record<string, string> = {
      'q-1': 'b',
      'q-2': 'b',
      'q-3': 'b',
      'q-4': 'b',
    }
    // Final question is passed as the current answer.
    const result = calculateQuizScore(questions, answers, 'q-5', 'b')
    expect(result.score).toBe(5)
    expect(result.percentage).toBe(100)
  })

  it('counts the final answer exactly once when it is incorrect', () => {
    const questions = makeQuestions(5)
    const answers: Record<string, string> = {
      'q-1': 'b',
      'q-2': 'b',
      'q-3': 'b',
      'q-4': 'b',
    }
    const result = calculateQuizScore(questions, answers, 'q-5', 'a')
    expect(result.score).toBe(4)
    expect(result.percentage).toBe(80)
  })

  it('never returns a percentage greater than 100%', () => {
    const questions = makeQuestions(2)
    const answers: Record<string, string> = {
      'q-1': 'b',
      'q-2': 'b',
    }
    const result = calculateQuizScore(questions, answers, 'q-2', 'b')
    expect(result.score).toBeLessThanOrEqual(result.total)
    expect(result.percentage).toBeLessThanOrEqual(100)
  })

  it('reports missed-question count equal to total minus correct', () => {
    const questions = makeQuestions(10)
    const answers = buildAnswers(10, 7)
    // Keep q-8 incorrect so the missed count is 10 - 7 = 3.
    const result = calculateQuizScore(questions, answers, 'q-8', 'a')
    expect(result.missedCount).toBe(result.total - result.score)
    expect(result.missedCount).toBe(3)
  })

  it('handles a null current answer as incorrect', () => {
    const questions = makeQuestions(5)
    const answers: Record<string, string> = {
      'q-1': 'b',
      'q-2': 'b',
      'q-3': 'b',
      'q-4': 'b',
    }
    const result = calculateQuizScore(questions, answers, 'q-5', null)
    expect(result.score).toBe(4)
    expect(result.missedCount).toBe(1)
  })
})
