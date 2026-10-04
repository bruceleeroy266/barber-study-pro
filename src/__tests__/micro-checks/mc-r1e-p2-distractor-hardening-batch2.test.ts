import { describe, expect, it } from 'vitest'
import { chapter7MicroChecks } from '@/lib/chapter-7-concepts/micro-checks'
import { chapter9MicroChecks } from '@/lib/chapter-9-concepts/micro-checks'
import { chapter15MicroChecks } from '@/lib/chapter-15-concepts/micro-checks'
import { chapter19MicroChecks } from '@/lib/chapter-19-concepts/micro-checks'

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
  'mcq-7-001':'a','mcq-7-006':'a','mcq-7-007':'a','mcq-7-009':'a',
  'mcq-7-012':'a','mcq-7-013':'a','mcq-7-015':'a','mcq-7-016':'a',
  'mcq-7-018':'a','mcq-7-021':'a','mcq-7-023':'a',
  'mcq-9-001':'a','mcq-9-003':'b','mcq-9-009':'a','mcq-9-010':'c',
  'mcq-9-013':'a','mcq-9-014':'c','mcq-9-018':'b','mcq-9-019':'c','mcq-9-020':'b',
  'mcq-15-001':'b','mcq-15-003':'c','mcq-15-004':'c','mcq-15-006':'b',
  'mcq-15-007':'a','mcq-15-008':'c','mcq-15-009':'c','mcq-15-011':'b','mcq-15-014':'a',
  'mcq-19-001':'b','mcq-19-003':'b','mcq-19-004':'b','mcq-19-005':'b',
  'mcq-19-006':'c','mcq-19-007':'b','mcq-19-010':'b','mcq-19-011':'b',
  'mcq-19-012':'b','mcq-19-013':'b','mcq-19-014':'c',
}

const questions: TestQuestion[] = [
  ...chapter7MicroChecks.flatMap((check) => check.questions),
  ...chapter9MicroChecks.flatMap((check) => check.questions),
  ...chapter15MicroChecks.flatMap((check) => check.questions),
  ...chapter19MicroChecks.flatMap((check) => check.questions),
]

const byId = new Map<string, TestQuestion>(
  questions.map((question) => [question.id, question]),
)

const cuePattern =
  /\b(always|never|automatically|completely|guarantee(?:d|s)?|every time|exactly|only)\b/i

describe('MC-R1E P2 distractor hardening batch 2', () => {
  it('accounts for exactly 40 P2 items', () => {
    expect(Object.keys(hardened)).toHaveLength(40)
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
      const wrongChoices = (['a','b','c','d'] as const)
        .filter((key) => key !== correctAnswer)
        .map((key) => question[`answer_${key}`])
      expect(wrongChoices.some((choice) => cuePattern.test(choice)), id).toBe(false)
    }
  })

  it('keeps correct-answer length in the same neighborhood as distractors', () => {
    for (const [id, correctAnswer] of Object.entries(hardened)) {
      const question = byId.get(id)!
      const correctText = question[`answer_${correctAnswer}`]
      const wrongChoices = (['a','b','c','d'] as const)
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
