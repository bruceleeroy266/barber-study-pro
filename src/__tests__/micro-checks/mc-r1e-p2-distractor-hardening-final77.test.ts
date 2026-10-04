import { describe, expect, it } from 'vitest'
import { chapter1MicroChecks } from '@/lib/chapter-1-concepts/micro-checks'
import { chapter3MicroChecks } from '@/lib/chapter-3-concepts/micro-checks'
import { chapter4MicroChecks } from '@/lib/chapter-4-concepts/micro-checks'
import { chapter5MicroChecks } from '@/lib/chapter-5-concepts/micro-checks'
import { chapter8MicroChecks } from '@/lib/chapter-8-concepts/micro-checks'
import { chapter10MicroChecks } from '@/lib/chapter-10-concepts/micro-checks'
import { chapter11MicroChecks } from '@/lib/chapter-11-concepts/micro-checks'
import { chapter13MicroChecks } from '@/lib/chapter-13-concepts/micro-checks'
import { chapter14MicroChecks } from '@/lib/chapter-14-concepts/micro-checks'
import { chapter16MicroChecks } from '@/lib/chapter-16-concepts/micro-checks'
import { chapter17MicroChecks } from '@/lib/chapter-17-concepts/micro-checks'
import { chapter18MicroChecks } from '@/lib/chapter-18-concepts/micro-checks'
import { chapter20MicroChecks } from '@/lib/chapter-20-concepts/micro-checks'
import { chapter21MicroChecks } from '@/lib/chapter-21-concepts/micro-checks'

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
  'mcq-1-002':'a','mcq-1-008':'a',
  'mcq-3-002':'b','mcq-3-005':'a','mcq-3-006':'b','mcq-3-008':'b',
  'mcq-4-004':'b','mcq-4-005':'a','mcq-4-007':'a','mcq-4-008':'b','mcq-4-012':'b',
  'mcq-5-002':'b','mcq-5-005':'a','mcq-5-010':'b','mcq-5-012':'b',
  'mcq-8-001':'a','mcq-8-003':'a','mcq-8-008':'a','mcq-8-012':'a','mcq-8-013':'a','mcq-8-014':'a','mcq-8-019':'a','mcq-8-022':'a',
  'mcq-10-005':'b','mcq-10-006':'c','mcq-10-007':'a','mcq-10-008':'d','mcq-10-015':'c','mcq-10-018':'d','mcq-10-019':'a',
  'mcq-11-001':'b','mcq-11-002':'c','mcq-11-006':'a','mcq-11-008':'b','mcq-11-013':'c','mcq-11-015':'d','mcq-11-016':'a',
  'mcq-13-003':'b','mcq-13-004':'d','mcq-13-010':'b','mcq-13-013':'c','mcq-13-014':'a','mcq-13-015':'a','mcq-13-016':'b',
  'mcq-14-002':'c','mcq-14-004':'c','mcq-14-005':'b','mcq-14-006':'b','mcq-14-011':'b',
  'mcq-16-005':'a','mcq-16-006':'b','mcq-16-008':'c','mcq-16-009':'a','mcq-16-013':'c',
  'mcq-17-001':'b','mcq-17-002':'c','mcq-17-008':'c','mcq-17-010':'c',
  'mcq-18-001':'b','mcq-18-004':'b','mcq-18-008':'c','mcq-18-010':'b','mcq-18-012':'c','mcq-18-013':'c','mcq-18-014':'c',
  'mcq-20-001':'b','mcq-20-002':'b','mcq-20-003':'b','mcq-20-005':'b','mcq-20-010':'b','mcq-20-011':'b','mcq-20-012':'b',
  'mcq-21-002':'b','mcq-21-007':'b','mcq-21-011':'b','mcq-21-013':'b','mcq-21-015':'b',
}

const questions: TestQuestion[] = [
  ...chapter1MicroChecks.flatMap((check) => check.questions),
  ...chapter3MicroChecks.flatMap((check) => check.questions),
  ...chapter4MicroChecks.flatMap((check) => check.questions),
  ...chapter5MicroChecks.flatMap((check) => check.questions),
  ...chapter8MicroChecks.flatMap((check) => check.questions),
  ...chapter10MicroChecks.flatMap((check) => check.questions),
  ...chapter11MicroChecks.flatMap((check) => check.questions),
  ...chapter13MicroChecks.flatMap((check) => check.questions),
  ...chapter14MicroChecks.flatMap((check) => check.questions),
  ...chapter16MicroChecks.flatMap((check) => check.questions),
  ...chapter17MicroChecks.flatMap((check) => check.questions),
  ...chapter18MicroChecks.flatMap((check) => check.questions),
  ...chapter20MicroChecks.flatMap((check) => check.questions),
  ...chapter21MicroChecks.flatMap((check) => check.questions),
]

const byId = new Map<string, TestQuestion>(questions.map((question) => [question.id, question]))
const cuePattern = /\b(always|never|automatically|completely|guarantee(?:d|s)?|every time|exactly|only)\b/i

describe('MC-R1E final 77 P2 distractor hardening', () => {
  it('accounts for exactly 77 P2 items', () => {
    expect(Object.keys(hardened)).toHaveLength(77)
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
      const choices = [question.answer_a, question.answer_b, question.answer_c, question.answer_d]
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
      const wrongAverage = wrongChoices.reduce((sum, choice) => sum + choice.length, 0) / wrongChoices.length
      const ratio = correctText.length / wrongAverage
      expect(ratio, id).toBeGreaterThanOrEqual(0.6)
      expect(ratio, id).toBeLessThanOrEqual(1.6)
    }
  })
})
