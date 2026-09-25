import { describe, expect, it } from 'vitest'
import { allQuizQuestions } from './quiz-data'

const EXPECTED_COUNTS: Record<number, number> = {
  1: 30,
  2: 48,
  3: 30,
  4: 30,
  5: 50,
  6: 50,
  7: 50,
  8: 30,
  9: 30,
  10: 75,
  11: 50,
  12: 45,
  13: 45,
  14: 70,
  15: 72,
  16: 30,
  17: 30,
  18: 15,
  19: 15,
  20: 17,
  21: 17,
}

const HARDENED_CHAPTERS = [7, 9, 10, 11, 12, 13, 14, 16, 17]

function normalizeQuestion(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

describe('canonical 21-chapter quiz bank integrity', () => {
  it('registers all 21 chapter banks at the expected sizes', () => {
    expect(Object.keys(allQuizQuestions)).toHaveLength(21)

    for (let chapter = 1; chapter <= 21; chapter += 1) {
      const questions = allQuizQuestions[`quiz-${chapter}`]
      expect(questions, `quiz-${chapter} should be registered`).toBeDefined()
      expect(questions, `quiz-${chapter} count drifted`).toHaveLength(EXPECTED_COUNTS[chapter])
    }

    const totalQuestions = Object.values(allQuizQuestions).reduce(
      (sum, questions) => sum + questions.length,
      0,
    )
    expect(totalQuestions).toBe(829)
  })

  it('keeps IDs unique and every answer key internally valid', () => {
    const globalIds = new Set<string>()

    for (let chapter = 1; chapter <= 21; chapter += 1) {
      const quizId = `quiz-${chapter}`
      const questions = allQuizQuestions[quizId]

      for (const question of questions) {
        expect(globalIds.has(question.id), `duplicate question id: ${question.id}`).toBe(false)
        globalIds.add(question.id)

        expect(question.quiz_id).toBe(quizId)
        expect(question.question.trim().length, `${question.id} question text is too short`).toBeGreaterThan(12)

        const answers = [
          question.answer_a,
          question.answer_b,
          question.answer_c,
          question.answer_d,
        ].map((answer) => answer.trim())

        expect(answers.every(Boolean), `${question.id} has a blank answer choice`).toBe(true)
        expect(new Set(answers.map((answer) => answer.toLowerCase())).size, `${question.id} has duplicate answer choices`).toBe(4)

        expect(['a', 'b', 'c', 'd']).toContain(question.correct_answer)
        const correctText = question[`answer_${question.correct_answer}`]
        expect(correctText.trim().length, `${question.id} has an empty keyed answer`).toBeGreaterThan(0)

        expect(question.explanation?.trim().length ?? 0, `${question.id} explanation is too short`).toBeGreaterThanOrEqual(25)
        expect(['easy', 'medium', 'hard']).toContain(question.difficulty)

        const serialized = [
          question.question,
          ...answers,
          question.explanation ?? '',
        ].join(' ').toLowerCase()

        expect(serialized).not.toMatch(/\b(todo|tbd|placeholder|lorem|undefined|unknown answer)\b/)
      }
    }
  })

  it('does not contain exact duplicate question stems within a chapter bank', () => {
    for (let chapter = 1; chapter <= 21; chapter += 1) {
      const questions = allQuizQuestions[`quiz-${chapter}`]
      const normalized = questions.map((question) => normalizeQuestion(question.question))
      expect(new Set(normalized).size, `quiz-${chapter} contains duplicate question stems`).toBe(normalized.length)
    }
  })

  it('keeps the first hardening wave from regressing to recall-heavy difficulty metadata', () => {
    for (const chapter of HARDENED_CHAPTERS) {
      const questions = allQuizQuestions[`quiz-${chapter}`]
      const hard = questions.filter((question) => question.difficulty === 'hard').length
      const easy = questions.filter((question) => question.difficulty === 'easy').length

      expect(
        hard / questions.length,
        `quiz-${chapter} should keep at least 10% application/safety questions marked hard`,
      ).toBeGreaterThanOrEqual(0.1)

      expect(
        easy / questions.length,
        `quiz-${chapter} should not regress above 70% easy questions`,
      ).toBeLessThanOrEqual(0.7)
    }
  })
})
