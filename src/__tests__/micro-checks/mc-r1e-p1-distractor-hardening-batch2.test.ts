import { describe, expect, it } from 'vitest'
import { chapter1MicroChecks } from '@/lib/chapter-1-concepts/micro-checks'
import { chapter2MicroChecks } from '@/lib/chapter-2-concepts/micro-checks'
import { chapter3MicroChecks } from '@/lib/chapter-3-concepts/micro-checks'
import { chapter4MicroChecks } from '@/lib/chapter-4-concepts/micro-checks'
import { chapter5MicroChecks } from '@/lib/chapter-5-concepts/micro-checks'
import { chapter6MicroChecks } from '@/lib/chapter-6-concepts/micro-checks'
import { chapter7MicroChecks } from '@/lib/chapter-7-concepts/micro-checks'
import { chapter9MicroChecks } from '@/lib/chapter-9-concepts/micro-checks'
import { chapter10MicroChecks } from '@/lib/chapter-10-concepts/micro-checks'
import { chapter11MicroChecks } from '@/lib/chapter-11-concepts/micro-checks'
import { chapter13MicroChecks } from '@/lib/chapter-13-concepts/micro-checks'
import { chapter14MicroChecks } from '@/lib/chapter-14-concepts/micro-checks'
import { chapter15MicroChecks } from '@/lib/chapter-15-concepts/micro-checks'
import { chapter16MicroChecks } from '@/lib/chapter-16-concepts/micro-checks'
import { chapter18MicroChecks } from '@/lib/chapter-18-concepts/micro-checks'
import { chapter20MicroChecks } from '@/lib/chapter-20-concepts/micro-checks'

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
  'mcq-1-009': 'a',
  'mcq-1-010': 'a',
  'mcq-2-003': 'a',
  'mcq-2-005': 'a',
  'mcq-2-014': 'a',
  'mcq-3-004': 'b',
  'mcq-4-002': 'b',
  'mcq-4-003': 'a',
  'mcq-4-006': 'b',
  'mcq-4-011': 'a',
  'mcq-5-003': 'a',
  'mcq-5-004': 'b',
  'mcq-5-007': 'a',
  'mcq-6-006': 'a',
  'mcq-6-007': 'a',
  'mcq-6-010': 'a',
  'mcq-6-015': 'a',
  'mcq-6-017': 'a',
  'mcq-7-008': 'a',
  'mcq-7-014': 'a',
  'mcq-7-020': 'a',
  'mcq-9-012': 'c',
  'mcq-9-016': 'a',
  'mcq-9-021': 'd',
  'mcq-10-017': 'b',
  'mcq-11-003': 'a',
  'mcq-11-004': 'd',
  'mcq-11-009': 'a',
  'mcq-11-014': 'a',
  'mcq-13-001': 'a',
  'mcq-13-008': 'b',
  'mcq-13-011': 'c',
  'mcq-14-007': 'c',
  'mcq-14-008': 'b',
  'mcq-14-009': 'b',
  'mcq-14-010': 'b',
  'mcq-14-012': 'c',
  'mcq-15-002': 'c',
  'mcq-15-005': 'b',
  'mcq-15-010': 'c',
  'mcq-15-012': 'b',
  'mcq-16-011': 'b',
  'mcq-16-012': 'c',
  'mcq-16-014': 'a',
  'mcq-16-016': 'b',
  'mcq-18-005': 'b',
  'mcq-18-006': 'b',
  'mcq-18-009': 'b',
  'mcq-18-011': 'c',
  'mcq-20-007': 'b',
  'mcq-20-008': 'b',
  'mcq-20-009': 'b',
}

const questions: TestQuestion[] = [
  ...chapter1MicroChecks.flatMap((check) => check.questions),
  ...chapter2MicroChecks.flatMap((check) => check.questions),
  ...chapter3MicroChecks.flatMap((check) => check.questions),
  ...chapter4MicroChecks.flatMap((check) => check.questions),
  ...chapter5MicroChecks.flatMap((check) => check.questions),
  ...chapter6MicroChecks.flatMap((check) => check.questions),
  ...chapter7MicroChecks.flatMap((check) => check.questions),
  ...chapter9MicroChecks.flatMap((check) => check.questions),
  ...chapter10MicroChecks.flatMap((check) => check.questions),
  ...chapter11MicroChecks.flatMap((check) => check.questions),
  ...chapter13MicroChecks.flatMap((check) => check.questions),
  ...chapter14MicroChecks.flatMap((check) => check.questions),
  ...chapter15MicroChecks.flatMap((check) => check.questions),
  ...chapter16MicroChecks.flatMap((check) => check.questions),
  ...chapter18MicroChecks.flatMap((check) => check.questions),
  ...chapter20MicroChecks.flatMap((check) => check.questions),
]

const byId = new Map<string, TestQuestion>(
  questions.map((question) => [question.id, question]),
)

const cuePattern =
  /\b(always|never|automatically|completely|guarantee(?:d|s)?|every time|exactly|only)\b/i

describe('MC-R1E remaining P1 distractor hardening', () => {
  it('accounts for exactly 52 remaining P1 items', () => {
    expect(Object.keys(hardened)).toHaveLength(52)
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
