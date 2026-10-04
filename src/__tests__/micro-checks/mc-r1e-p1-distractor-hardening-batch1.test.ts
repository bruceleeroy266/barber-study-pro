import { describe, expect, it } from 'vitest'
import { chapter2MicroChecks } from '@/lib/chapter-2-concepts/micro-checks'
import { chapter8MicroChecks } from '@/lib/chapter-8-concepts/micro-checks'
import { chapter17MicroChecks } from '@/lib/chapter-17-concepts/micro-checks'
import { chapter19MicroChecks } from '@/lib/chapter-19-concepts/micro-checks'
import { chapter21MicroChecks } from '@/lib/chapter-21-concepts/micro-checks'

type AnswerKey = 'a' | 'b' | 'c' | 'd'

const hardened: Record<string, AnswerKey> = {
  'mcq-2-020': 'a',
  'mcq-8-004': 'a',
  'mcq-8-006': 'a',
  'mcq-8-007': 'a',
  'mcq-8-009': 'a',
  'mcq-8-010': 'a',
  'mcq-8-011': 'a',
  'mcq-8-015': 'a',
  'mcq-8-017': 'a',
  'mcq-8-018': 'a',
  'mcq-8-020': 'a',
  'mcq-17-003': 'b',
  'mcq-17-004': 'c',
  'mcq-17-005': 'c',
  'mcq-17-006': 'b',
  'mcq-17-007': 'b',
  'mcq-17-009': 'b',
  'mcq-17-011': 'c',
  'mcq-17-012': 'b',
  'mcq-17-013': 'b',
  'mcq-17-014': 'c',
  'mcq-19-002': 'c',
  'mcq-21-001': 'b',
  'mcq-21-003': 'b',
  'mcq-21-004': 'c',
  'mcq-21-005': 'c',
  'mcq-21-006': 'b',
  'mcq-21-008': 'b',
  'mcq-21-009': 'b',
  'mcq-21-010': 'b',
  'mcq-21-012': 'c',
  'mcq-21-014': 'b',
  'mcq-21-016': 'b',
}

const banks = [
  ...chapter2MicroChecks,
  ...chapter8MicroChecks,
  ...chapter17MicroChecks,
  ...chapter19MicroChecks,
  ...chapter21MicroChecks,
]

const questions = banks.flatMap((check) => check.questions)
const byId = new Map(questions.map((question) => [question.id, question]))

const cuePattern = /\b(always|never|automatically|completely|guarantee(?:d|s)?|every time|exactly)\b/i

describe('MC-R1E P1 distractor hardening batch 1', () => {
  it('preserves canonical correct-answer identity for every hardened item', () => {
    expect(Object.keys(hardened)).toHaveLength(33)

    for (const [id, correctAnswer] of Object.entries(hardened)) {
      const question = byId.get(id)
      expect(question, id).toBeDefined()
      expect(question?.correctAnswer, id).toBe(correctAnswer)
    }
  })

  it('keeps all four answer choices unique and non-empty', () => {
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

  it('removes obvious absolute wording cues from incorrect choices', () => {
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
