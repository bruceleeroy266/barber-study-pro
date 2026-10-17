import { describe, expect, it } from 'vitest'
import { buildDraftExamPlan, selectDraftExam, EXAM_READY_DRAFT_CONFIG, EXPERIMENTAL_QUOTAS } from './draft-exam-plan'
import { EXAM_READY_SCORED_DOMAIN_QUOTAS } from './registry-adapter'

function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state / 4294967296
  }
}

describe('Exam Ready 4C offline configuration and selection', () => {
  it('produces only a draft manifest and 573 eligible links', () => {
    const plan = buildDraftExamPlan()
    expect(plan.config).toEqual(EXAM_READY_DRAFT_CONFIG)
    expect(plan.config.status).toBe('draft')
    expect(plan.config.time_limit_seconds).toBe(5400)
    expect(plan.inventory).toHaveLength(573)
    expect(plan.questions).toHaveLength(573)
    expect(plan.questions.every(link => link.scored_eligible && link.unscored_eligible && link.is_active)).toBe(true)
    expect(plan.domains.reduce((sum, row) => sum + row.scored_question_count, 0)).toBe(100)
  })

  it('generates 1,000 reproducible unique 110-item exams with exact scored and experimental quotas', () => {
    const plan = buildDraftExamPlan()
    for (let seed = 1; seed <= 1000; seed++) {
      const selected = selectDraftExam(plan, seededRandom(seed))
      expect(selected).toHaveLength(110)
      expect(new Set(selected.map(row => row.source_question_id)).size).toBe(110)
      expect(selected.filter(row => row.is_scored)).toHaveLength(100)
      expect(selected.filter(row => !row.is_scored)).toHaveLength(10)
      for (const domain of Object.keys(EXAM_READY_SCORED_DOMAIN_QUOTAS) as (keyof typeof EXAM_READY_SCORED_DOMAIN_QUOTAS)[]) {
        expect(selected.filter(row => row.domain === domain && row.is_scored)).toHaveLength(EXAM_READY_SCORED_DOMAIN_QUOTAS[domain])
        expect(selected.filter(row => row.domain === domain && !row.is_scored)).toHaveLength(EXPERIMENTAL_QUOTAS[domain])
      }
      if (seed === 1) expect(selectDraftExam(plan, seededRandom(seed))).toEqual(selected)
    }
  })

  it('fails closed for tampered quotas, eligibility and insufficient inventory', () => {
    const plan = buildDraftExamPlan()
    expect(() => selectDraftExam({ ...plan, domains: plan.domains.map(row => row.domain === 'scientific_concepts' ? { ...row, scored_question_count: 34 } : row) }, seededRandom(1))).toThrow(/blueprint/)
    expect(() => selectDraftExam({ ...plan, questions: plan.questions.map(link => ({ ...link, scored_eligible: false as true })) }, seededRandom(1))).toThrow(/Insufficient scored/)
    expect(() => selectDraftExam({ ...plan, questions: plan.questions.map(link => ({ ...link, unscored_eligible: false as true })) }, seededRandom(1))).toThrow(/Insufficient experimental/)
    expect(() => selectDraftExam({ ...plan, inventory: plan.inventory.slice(0, 572) }, seededRandom(1))).toThrow(/inventory/)
    expect(() => selectDraftExam(plan, () => 1)).toThrow(/random source/)
  })

  it('rejects existing registry ID collisions before creating the manifest', () => {
    const plan = buildDraftExamPlan()
    expect(() => buildDraftExamPlan([plan.questions[0].source_question_id])).toThrow(/collision/)
  })
})
