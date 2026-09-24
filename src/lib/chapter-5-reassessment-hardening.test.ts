import { describe, expect, it } from 'vitest'
import { chapter5PremiumQuizQuestions } from './chapter-5-premium-quiz'
import { chapter5ReassessmentQuestions } from './chapter-5-reassessment-questions'
import {
  chapter5ReassessmentQuestionConceptMappings,
  chapter5QuizQuestionConceptMappings,
} from './chapter-5-concepts/mappings'
import { getChapterContentProvider } from './remediation/content-provider-registry'
import { getCanonicalMappingProvider } from './reassessment/provider-registry'
import { createReassessmentService } from './reassessment/reassessment-service'
import type { IExclusionDatabaseClient } from './reassessment/types'

describe('C5 unseen remediation/reassessment reserve', () => {
  it('locks a 90-question reserve that is disjoint from the 50-question initial bank', () => {
    expect(chapter5PremiumQuizQuestions).toHaveLength(50)
    expect(chapter5ReassessmentQuestions).toHaveLength(90)
    const initial = new Set(chapter5PremiumQuizQuestions.map((q) => q.id))
    const reserve = new Set(chapter5ReassessmentQuestions.map((q) => q.id))
    expect(reserve.size).toBe(90)
    for (const id of reserve) expect(initial.has(id), `${id} leaked into initial bank`).toBe(false)
    expect(chapter5ReassessmentQuestions[0].id).toBe('qq-5-051')
    expect(chapter5ReassessmentQuestions[89].id).toBe('qq-5-140')
  })

  it('maps exactly 15 reserve questions to each of the six Chapter 5 families', () => {
    expect(chapter5ReassessmentQuestionConceptMappings).toHaveLength(90)
    const families = [
      'ch5-combs-brushes','ch5-shears-cutting','ch5-clippers-trimmers',
      'ch5-razors','ch5-thermal-electrical','ch5-equipment-safety',
    ]
    for (const family of families) {
      expect(chapter5ReassessmentQuestionConceptMappings.filter((m) => m.conceptFamilyId === family)).toHaveLength(15)
    }
  })

  it('serves both initial and reserve questions while reporting the full mapped pool', () => {
    const provider = getChapterContentProvider('ch-5')
    expect(provider).toBeDefined()
    expect(provider?.getQuizQuestionById('qq-5-001')?.id).toBe('qq-5-001')
    expect(provider?.getQuizQuestionById('qq-5-051')?.id).toBe('qq-5-051')
    expect(provider?.getConceptQuestionCount('ch5-combs-brushes')).toBe(
      chapter5QuizQuestionConceptMappings.filter((m)=>m.conceptFamilyId==='ch5-combs-brushes').length + 15
    )
  })

  it('registers a canonical Chapter 5 pool containing initial + reserve mappings', () => {
    const provider = getCanonicalMappingProvider('ch-5')
    expect(provider.getAllQuestionIds()).toHaveLength(140)
    expect(provider.getQuestionsForConcept('ch5-combs-brushes')).toContain('qq-5-051')
    expect(provider.isQuestionMappedToConcept('qq-5-051','ch5-combs-brushes')).toBe(true)
  })

  it('selects a fresh reserve question after the initial quiz questions for that concept are historically excluded', async () => {
    const initialIds = chapter5QuizQuestionConceptMappings
      .filter((m)=>m.conceptFamilyId==='ch5-combs-brushes')
      .map((m)=>m.questionId)
    const answersJson = Object.fromEntries(initialIds.map((id)=>[id,'a']))

    const db:IExclusionDatabaseClient = {
      async getHistoricalQuizAttempts(){
        return [{id:'attempt-1',userId:'user-1',quizId:'quiz-5',answersJson,completedAt:new Date()}]
      },
      async getReassessmentQuestionHistory(){ return [] },
      async recordQuestionAttempt(){ return 'reservation-1' },
      async checkAndRecordPoolExhaustion(){ return 'exhaustion-1' },
    }

    const service = createReassessmentService(db,'ch-5')
    const result = await service.selectAndReserveQuestion('user-1','ch5-combs-brushes','cycle-1','attempt-2')
    expect(result.success).toBe(true)
    expect(result.questionId).toBe('qq-5-051')
    expect(initialIds).not.toContain(result.questionId)
  })

  it('keeps every reserve question hard, single-answer, and five-step explained', () => {
    for (const q of chapter5ReassessmentQuestions) {
      expect(q.difficulty).toBe('hard')
      expect(new Set([q.answer_a,q.answer_b,q.answer_c,q.answer_d].map((x)=>x.toLowerCase())).size).toBe(4)
      expect(['a','b','c','d']).toContain(q.correct_answer)
      expect(q.explanation).toContain('Read carefully.')
      expect(q.explanation).toContain('Identify the keyword')
      expect(q.explanation).toContain('Eliminate choices')
      expect(q.explanation).toContain('Apply safety/procedure logic')
      expect(q.explanation).toContain('Make the best remaining choice')
    }
  })
})
