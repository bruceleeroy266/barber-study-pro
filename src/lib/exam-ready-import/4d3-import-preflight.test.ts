import { describe, expect, it } from 'vitest'
import { prepareImportPreflight } from './4d3-import-preflight'

describe('4D-3 import preflight (pure and fail closed)', () => {
  it('prepares exactly 573 source questions and draft config without DB access', () => {
    const plan = prepareImportPreflight([{source_question_id:'unrelated-existing',content_version:'legacy-v1'}],true)
    expect(plan.expectedNewQuestions).toBe(573)
    expect(plan.inventory).toHaveLength(573)
    expect(plan.questions).toHaveLength(573)
    expect(plan.config.status).toBe('draft')
    expect(new Set(plan.inventory.map(row => row.source_question_id)).size).toBe(573)
  })
  it('rejects incomplete snapshots and collisions', () => {
    expect(() => prepareImportPreflight([],false)).toThrow(/complete/)
    const plan=prepareImportPreflight([],true)
    expect(() => prepareImportPreflight([{source_question_id:plan.inventory[0].source_question_id,content_version:'old'}],true)).toThrow(/collision/)
    expect(() => prepareImportPreflight([{source_question_id:'dup',content_version:'v1'},{source_question_id:'dup',content_version:'v1'}],true)).toThrow(/duplicate/)
  })
})
