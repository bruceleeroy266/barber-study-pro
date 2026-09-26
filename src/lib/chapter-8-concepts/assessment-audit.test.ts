import { describe, expect, it } from 'vitest'
import { chapter8PremiumQuizQuestions } from '../chapter-8-premium-quiz'
import { chapter8QuizQuestionConceptMappings } from './mappings'
import {
  chapter8AssessmentAudit,
  chapter8AssessmentAuditCounts,
} from './assessment-audit'

describe('C8-5 Chapter 8 assessment audit baseline', () => {
  it('audits all 30 existing questions exactly once', () => {
    const ids = chapter8PremiumQuizQuestions.map((question) => question.id)
    const audited = chapter8AssessmentAudit.map((entry) => entry.questionId)

    expect(ids).toHaveLength(30)
    expect(chapter8AssessmentAudit).toHaveLength(30)
    expect(new Set(ids).size).toBe(30)
    expect(new Set(audited).size).toBe(30)
    expect(new Set(audited)).toEqual(new Set(ids))
  })

  it('keeps every audited question canonically mapped', () => {
    const mapped = new Set(chapter8QuizQuestionConceptMappings.map((mapping) => mapping.questionId))
    expect(chapter8AssessmentAudit.every((entry) => mapped.has(entry.questionId))).toBe(true)
  })

  it('locks the exact KEEP / REWRITE / REPLACE totals', () => {
    expect(chapter8AssessmentAuditCounts).toEqual({
      KEEP: 3,
      REWRITE: 14,
      REPLACE: 13,
    })
  })

  it('forces replacement of the known unsafe legacy items', () => {
    const byId = new Map<string, string>(chapter8AssessmentAudit.map((entry) => [entry.questionId, entry.action]))
    for (const id of [
      'qq-8-006','qq-8-007','qq-8-008','qq-8-010','qq-8-013','qq-8-019',
      'qq-8-020','qq-8-021','qq-8-022','qq-8-024','qq-8-025','qq-8-028','qq-8-030',
    ]) {
      expect(byId.get(id)).toBe('REPLACE')
    }
  })
})
