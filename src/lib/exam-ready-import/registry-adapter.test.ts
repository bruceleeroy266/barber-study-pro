import { describe, expect, it } from 'vitest'
import { examReadyQuestions } from './index'
import { mapExamReadyQuestion, prepareExamReadyRegistryRows, EXAM_READY_CONTENT_VERSION } from './registry-adapter'

describe('Exam Ready registry mapping — read-only', () => {
  it('maps all 573 questions to valid private registry rows and preserves keys', () => {
    const result = prepareExamReadyRegistryRows()
    expect(result.rows).toHaveLength(573)
    expect(result.scoredQuotaEligible).toBe(true)
    expect(Object.values(result.counts).reduce((a, b) => a + b, 0)).toBe(573)
    expect(result.counts).toEqual({
      scientific_concepts: 274,
      implements_equipment: 56,
      hair_care_services: 173,
      facial_hair_skin_care_services: 70,
    })
    for (let i = 0; i < result.rows.length; i++) {
      const row = result.rows[i]
      const original = examReadyQuestions[i]
      expect(row.source_question_id).toBe(`exam-ready:${original.id}`)
      expect(row.content_version).toBe(EXAM_READY_CONTENT_VERSION)
      expect(row.provenance.originalQuestionId).toBe(original.id)
      expect(row.provenance.sourceBasis).toEqual(original.sourceBasis)
      expect(row.correct_option).toBe(original.correctOptionId)
      for (const option of original.options) {
        expect(row[`option_${option.id}` as 'option_a']).toBe(option.text)
      }
    }
  })

  it('fails closed on existing registry source-ID collisions', () => {
    expect(() => prepareExamReadyRegistryRows(examReadyQuestions, ['exam-ready:' + examReadyQuestions[0].id])).toThrow(/collision/)
  })

  it('rejects unmapped domains, invalid option ids and bad keys', () => {
    const original = examReadyQuestions[0]
    expect(() => mapExamReadyQuestion({ ...original, domain: 'Unmapped' })).toThrow(/Unmapped/)
    expect(() => mapExamReadyQuestion({ ...original, options: original.options.map((o, i) => i === 0 ? { ...o, id: 'z' } : o) })).toThrow()
    expect(() => mapExamReadyQuestion({ ...original, correctOptionId: 'z' })).toThrow()
  })

  it('rejects partial inventories without generating rows', () => {
    expect(() => prepareExamReadyRegistryRows(examReadyQuestions.slice(0, 572))).toThrow(/Expected 573/)
  })
})
