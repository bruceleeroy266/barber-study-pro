import { describe, expect, it } from 'vitest'
import { chapter13PremiumQuizQuestions } from '../chapter-13-premium-quiz'
import { chapter13QuizQuestionConceptMappings } from './mappings'

const serialized = JSON.stringify(chapter13PremiumQuizQuestions)

function optionLength(question: (typeof chapter13PremiumQuizQuestions)[number], key: 'a' | 'b' | 'c' | 'd'): number {
  return String(question[`answer_${key}` as keyof typeof question] ?? '').length
}

describe('C13-4 45-question assessment audit + repair', () => {
  it('preserves all 45 stable IDs and order indexes', () => {
    expect(chapter13PremiumQuizQuestions).toHaveLength(45)
    expect(chapter13PremiumQuizQuestions.map((question) => question.id)).toEqual(
      Array.from({ length: 45 }, (_, index) => `qq-13-${String(index + 1).padStart(3, '0')}`),
    )
    expect(chapter13PremiumQuizQuestions.map((question) => question.order_index)).toEqual(
      Array.from({ length: 45 }, (_, index) => index + 1),
    )
  })

  it('preserves one canonical concept mapping per assessment item', () => {
    expect(chapter13QuizQuestionConceptMappings).toHaveLength(45)
    expect(new Set(chapter13QuizQuestionConceptMappings.map((mapping) => mapping.questionId)).size).toBe(45)
    expect(new Set(chapter13QuizQuestionConceptMappings.map((mapping) => mapping.questionId))).toEqual(
      new Set(chapter13PremiumQuizQuestions.map((question) => question.id)),
    )
  })

  it('removes the 45-A defect with reviewed answer positions', () => {
    const counts = chapter13PremiumQuizQuestions.reduce<Record<string, number>>((acc, question) => {
      acc[question.correct_answer] = (acc[question.correct_answer] ?? 0) + 1
      return acc
    }, {})
    expect(counts).toEqual({ a: 12, b: 11, c: 11, d: 11 })
  })

  it('contains no duplicate question stems', () => {
    expect(new Set(chapter13PremiumQuizQuestions.map((question) => question.question)).size).toBe(45)
  })

  it('uses a deliberate easy/medium/hard mix', () => {
    const counts = chapter13PremiumQuizQuestions.reduce<Record<string, number>>((acc, question) => {
      const key = question.difficulty ?? 'unknown'
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {})
    expect(counts).toEqual({ easy: 15, medium: 20, hard: 10 })
  })

  it('does not replace the answer-position shortcut with an answer-length shortcut', () => {
    let correctLongest = 0
    let moderateBias = 0
    let strongBias = 0

    for (const question of chapter13PremiumQuizQuestions) {
      const key = question.correct_answer as 'a' | 'b' | 'c' | 'd'
      const correctLength = optionLength(question, key)
      const distractorLengths = (['a', 'b', 'c', 'd'] as const)
        .filter((letter) => letter !== key)
        .map((letter) => optionLength(question, letter))
      const longestDistractor = Math.max(...distractorLengths)

      if (correctLength >= longestDistractor) correctLongest += 1
      if (correctLength - longestDistractor >= 15) moderateBias += 1
      if (correctLength - longestDistractor >= 25) strongBias += 1
    }

    expect(correctLongest).toBeLessThanOrEqual(15)
    expect(moderateBias).toBe(0)
    expect(strongBias).toBe(0)
  })

  it('removes the high-risk medical and close-shave overclaims from the old bank', () => {
    const forbidden = [
      'if left untreated',
      'initiate a keloid condition',
      'lead to infection or ingrown hairs',
      'barbers do not traditionally employ close-shaving methods',
      'required for state board licensing',
    ]
    for (const phrase of forbidden) {
      expect(serialized.toLowerCase()).not.toContain(phrase.toLowerCase())
    }
  })

  it('keeps barbering scope and client-specific safety reasoning explicit', () => {
    expect(serialized).toContain('outside barbering scope')
    expect(serialized).toContain('blood-exposure procedure')
    expect(serialized).toContain('client\'s actual grain')
    expect(serialized).toContain('ingrown-hair risk')
    expect(serialized).toContain('local rules')
  })

  it('replaces rigid face-shape recall with design-principle application', () => {
    expect(serialized).not.toContain('A semisquare mustache')
    expect(serialized).toContain('Client preference, proportions, growth, texture, and maintenance needs')
    expect(serialized).toContain('proportion guides must be adapted individually')
  })
})
