import { describe, expect, it } from 'vitest'
import {
  chapter8SafetyReassessmentReserve,
  getChapter8ReassessmentReserve,
} from './reassessment-reserve'

describe('C8-7 safety reassessment reserve', () => {
  it('provides exactly five fresh questions for each critical Chapter 8 safety concept', () => {
    expect(getChapter8ReassessmentReserve('ch8-equipment-safety')).toHaveLength(5)
    expect(getChapter8ReassessmentReserve('ch8-light-therapy-safety')).toHaveLength(5)
  })

  it('keeps reserve IDs unique and separate from initial assessment/micro-check IDs', () => {
    const ids = chapter8SafetyReassessmentReserve.map((question) => question.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(id.startsWith('r8-')).toBe(true)
      expect(id.startsWith('qq-8-')).toBe(false)
      expect(id.startsWith('mcq-8-')).toBe(false)
    }
  })

  it('uses only application or scenario difficulty for the stricter safety reassessment', () => {
    expect(
      chapter8SafetyReassessmentReserve.every(
        (question) => question.difficulty === 'application' || question.difficulty === 'scenario',
      ),
    ).toBe(true)
  })

  it('keeps all answer keys valid and complete', () => {
    for (const question of chapter8SafetyReassessmentReserve) {
      expect(['a', 'b', 'c', 'd']).toContain(question.correctAnswer)
      expect(question.answer_a.trim()).not.toBe('')
      expect(question.answer_b.trim()).not.toBe('')
      expect(question.answer_c.trim()).not.toBe('')
      expect(question.answer_d.trim()).not.toBe('')
      expect(question.explanation.trim()).not.toBe('')
    }
  })
})
