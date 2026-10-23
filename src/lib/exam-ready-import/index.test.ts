import { describe, expect, it } from 'vitest'
import {
  examReadyQuestions,
  EXAM_READY_EXPECTED_COUNT,
  findExamReadyIdCollisions,
  assertExamReadyBankIntegrity,
} from './index'
import { validateExamReadyBank } from './source-bank'

describe('Exam Ready imported question bank', () => {
  it('contains exactly 573 unique valid source questions', () => {
    expect(examReadyQuestions).toHaveLength(EXAM_READY_EXPECTED_COUNT)
    expect(new Set(examReadyQuestions.map(q => q.id)).size).toBe(EXAM_READY_EXPECTED_COUNT)
    expect(validateExamReadyBank(examReadyQuestions)).toEqual([])
    expect(() => assertExamReadyBankIntegrity()).not.toThrow()
  })

  it('detects cross-namespace collisions when existing IDs are provided', () => {
    const id = examReadyQuestions[0].id
    expect(findExamReadyIdCollisions([id])).toEqual([id])
    expect(() => assertExamReadyBankIntegrity([id])).toThrow(/collisions/)
  })

  it('rejects missing answers and duplicate IDs in the imported schema', () => {
    const original = examReadyQuestions[0]
    expect(validateExamReadyBank([{ ...original, correctOptionId: 'missing' }]).map(x => x.issue))
      .toContain('correct option does not resolve exactly once')
    expect(validateExamReadyBank([original, original]).map(x => x.issue))
      .toContain('duplicate question id')
  })
})
