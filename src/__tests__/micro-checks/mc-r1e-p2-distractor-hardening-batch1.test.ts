import { describe, expect, it } from 'vitest'
import { chapter2MicroChecks } from '@/lib/chapter-2-concepts/micro-checks'
import { chapter6MicroChecks } from '@/lib/chapter-6-concepts/micro-checks'
import { chapter12MicroChecks } from '@/lib/chapter-12-concepts/micro-checks'

type AnswerKey = 'a' | 'b' | 'c' | 'd'
type TestQuestion = {
  id: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: AnswerKey
}

const hardened: Record<string, AnswerKey> = {
  'mcq-2-001': 'a',
  'mcq-2-002': 'a',
  'mcq-2-004': 'a',
  'mcq-2-006': 'a',
  'mcq-2-007': 'a',
  'mcq-2-008': 'a',
  'mcq-2-009': 'a',
  'mcq-2-010': 'a',
  'mcq-2-011': 'a',
  'mcq-2-018': 'a',
  'mcq-2-019': 'a',
  'mcq-6-002': 'a',
  'mcq-6-003': 'a',
  'mcq-6-004': 'a',
  'mcq-6-008': 'a',
  'mcq-6-009': 'a',
  'mcq-6-011': 'a',
  'mcq-6-012': 'a',
  'mcq-6-013': 'a',
  'mcq-6-014': 'a',
  'mcq-6-016': 'a',
  'mcq-6-018': 'a',
  'mcq-6-020': 'a',
  'mcq-12-004': 'd',
  'mcq-12-005': 'b',
  'mcq-12-006': 'c',
  'mcq-12-007': 'a',
  'mcq-12-008': 'd',
  'mcq-12-009': 'b',
  'mcq-12-010': 'c',
  'mcq-12-011': 'a',
  'mcq-12-012': 'd',
  'mcq-12-013': 'b',
  'mcq-12-014': 'c',
  'mcq-12-015': 'c',
  'mcq-12-016': 'a',
}

const questions: TestQuestion[] = [
  ...chapter2MicroChecks.flatMap((check) => check.questions),
  ...chapter6MicroChecks.flatMap((check) => check.questions),
  ...chapter12MicroChecks.flatMap((check) => check.questions),
]

const byId = new Map<string, TestQuestion>(
  questions.map((question) => [question.id, question]),
)

const cuePattern =
  /\b(always|never|automatically|completely|guarantee(?:d|s)?|every time|exactly|only)\b/i

describe('MC-R1E P2 distractor hardening batch 1', () => {
  it('accounts for exactly 36 P2 items', () => {
    expect(Object.keys(hardened)).toHaveLength(36)
  })

  it('preserves canonical correct-answer identity', () => {
    for (const [id, correctAnswer] of Object.entries(hardened)) {
      const question = byId.get(id)
      expect(question, id).toBeDefined()
      expect(question?.correctAnswer, id).toBe(correctAnswer)
    }
  })

  it('keeps all four choices unique and non-empty', () => {
    for (const id of Object.keys(hardened)) {
      const question = byId.get(id)!
      const choices = [
        question.answer_a,
        question.answer_b,
        question.answer_c,
        question.answer_d,
      ]
      expect(choices.every((choice) => choice.trim().length > 0), id).toBe(true)
      expect(new Set(choices).size, id).toBe(4)
    }
  })

  it('removes locked absolute wording cues from incorrect choices', () => {
    for (const [id, correctAnswer] of Object.entries(hardened)) {
      const question = byId.get(id)!
      const wrongChoices = (['a', 'b', 'c', 'd'] as const)
        .filter((key) => key !== correctAnswer)
        .map((key) => question[`answer_${key}`])

      expect(wrongChoices.some((choice) => cuePattern.test(choice)), id).toBe(false)
    }
  })

  it('keeps correct-answer length in the same neighborhood as distractors', () => {
    for (const [id, correctAnswer] of Object.entries(hardened)) {
      const question = byId.get(id)!
      const correctText = question[`answer_${correctAnswer}`]
      const wrongChoices = (['a', 'b', 'c', 'd'] as const)
        .filter((key) => key !== correctAnswer)
        .map((key) => question[`answer_${key}`])

      const wrongAverage =
        wrongChoices.reduce((sum, choice) => sum + choice.length, 0) /
        wrongChoices.length
      const ratio = correctText.length / wrongAverage

      expect(ratio, id).toBeGreaterThanOrEqual(0.6)
      expect(ratio, id).toBeLessThanOrEqual(1.6)
    }
  })
})
