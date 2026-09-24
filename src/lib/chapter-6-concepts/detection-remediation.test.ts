import { describe, expect, it } from 'vitest'
import { chapter6PremiumQuizQuestions } from '@/lib/chapter-6-premium-quiz'
import { chapter6ReassessmentQuestions } from '@/lib/chapter-6-reassessment-questions'
import { chapter6ConceptFamilies, ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS } from './concepts'
import {
  chapter6ContentConceptMappings,
  chapter6FlashcardConceptMappings,
  chapter6QuizQuestionConceptMappings,
  chapter6ReassessmentQuestionConceptMappings,
} from './mappings'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { isConceptDetectionSupported, DetectionOrchestratorService, type IDetectionOrchestratorDbClient } from '@/lib/remediation'
import { createChapter6DetectionProvider } from '@/lib/reassessment/adapters/chapter-6-detection-provider'
import { createHistoricalExclusionEngine } from '@/lib/reassessment/exclusion-engine'
import type { QuizAttempt } from '@/types'
import type { ChapterId, ConceptId, IExclusionDatabaseClient, HistoricalQuizAttempt, ReassessmentQuestionHistoryRecord } from '@/lib/reassessment/types'
import type { ConceptEvidence, DetectionConfidence, DetectionState } from '@/lib/concept-detection/engine'

function wrongAnswer(correct: string): string {
  return ['a','b','c','d'].find((x) => x !== correct) ?? 'a'
}

function weakInitialAttempt(): QuizAttempt {
  return {
    id:'attempt-ch6-weak',
    user_id:'student-ch6',
    quiz_id:'quiz-6',
    score:0,
    total_questions:50,
    percentage:0,
    answers_json:Object.fromEntries(chapter6PremiumQuizQuestions.map((q)=>[q.id,wrongAnswer(q.correct_answer)])),
    completed_at:'2026-09-24T03:00:00.000Z',
  }
}

interface CreatedCycle {
  id:string
  conceptId:ConceptId
  chapterId:ChapterId
  assignments:Array<{assignmentType:'content_block'|'flashcard';assetId:string;priority:number;isPrimary:boolean}>
  detectionState:DetectionState
  detectionConfidence:DetectionConfidence
}

class HandoffDb implements IDetectionOrchestratorDbClient {
  readonly created:CreatedCycle[]=[]
  private active=new Map<string,{id:string}>()
  constructor(private attempts:QuizAttempt[]){}
  async getQuizAttemptsForUser(){ return this.attempts }
  async getActiveCycleForConcept(userId:string,conceptId:ConceptId){ return this.active.get(`${userId}:${conceptId}`) ?? null }
  async createRemediationCycleWithAssignments(data:{
    userId:string;conceptId:ConceptId;chapterId:ChapterId;cycleNumber:number;
    detectionState:DetectionState;detectionConfidence:DetectionConfidence;detectionEvidence:ConceptEvidence;
    status:'targeted';assignments:CreatedCycle['assignments']
  }){
    const id=`c6-cycle-${this.created.length+1}`
    this.created.push({id,conceptId:data.conceptId,chapterId:data.chapterId,assignments:data.assignments,detectionState:data.detectionState,detectionConfidence:data.detectionConfidence})
    this.active.set(`${data.userId}:${data.conceptId}`,{id})
    return id
  }
  async getNextCycleNumber(){ return 1 }
}

class ExclusionDb implements IExclusionDatabaseClient {
  constructor(private attempts:HistoricalQuizAttempt[]){}
  async getHistoricalQuizAttempts(){ return this.attempts }
  async getReassessmentQuestionHistory():Promise<ReassessmentQuestionHistoryRecord[]>{ return [] }
  async recordQuestionAttempt(){ return 'history-1' }
  async checkAndRecordPoolExhaustion(){ return 'exhaustion-1' }
}

describe('Chapter 6 detection/remediation integration (C6-5)',()=>{
  it('locks initial + reserve banks and one primary concept per question',()=>{
    expect(chapter6PremiumQuizQuestions).toHaveLength(50)
    expect(chapter6ReassessmentQuestions).toHaveLength(150)
    expect(chapter6QuizQuestionConceptMappings).toHaveLength(50)
    expect(chapter6ReassessmentQuestionConceptMappings).toHaveLength(150)
    expect(new Set(chapter6ReassessmentQuestionConceptMappings.map((m)=>m.questionId)).size).toBe(150)
    for(const id of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS){
      expect(chapter6ReassessmentQuestionConceptMappings.filter((m)=>m.conceptFamilyId===id)).toHaveLength(15)
    }
  })

  it('registers Chapter 6 for quiz-completion detection and targeted content',()=>{
    expect(isConceptDetectionSupported('ch-6')).toBe(true)
    const provider=getChapterContentProvider('ch-6')
    expect(provider).toBeDefined()
    for(const family of chapter6ConceptFamilies){
      const bundle=provider!.buildRemediationContentBundle(family.id)
      expect(bundle.conceptId).toBe(family.id)
      expect(bundle.contentBlockCount).toBeGreaterThanOrEqual(1)
      expect(bundle.flashcardCount).toBeGreaterThanOrEqual(7)
      expect(provider!.filterFlashcardsByConcept(family.id).every((c)=>c.is_active)).toBe(true)
    }
  })

  it('turns a fully missed hardened assessment into ten concept-specific cycles',async()=>{
    const db=new HandoffDb([weakInitialAttempt()])
    const service=new DetectionOrchestratorService(db)
    const result=await service.orchestrateAfterQuizCompletion('student-ch6','ch-6','attempt-ch6-weak')
    expect(result.success).toBe(true)
    expect(result.cyclesCreated).toBe(10)
    expect(result.conceptsDetected.sort()).toEqual([...ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS].sort())
    expect(db.created).toHaveLength(10)
    for(const cycle of db.created){
      expect(cycle.chapterId).toBe('ch-6')
      expect(cycle.detectionState).toBe('repeated_weakness')
      const expectedContent=chapter6ContentConceptMappings.filter((m)=>m.conceptFamilyId===cycle.conceptId).map((m)=>m.contentBlockId)
      const expectedCards=chapter6FlashcardConceptMappings.filter((m)=>m.conceptFamilyId===cycle.conceptId).map((m)=>m.flashcardId)
      expect(cycle.assignments.map((a)=>a.assetId)).toEqual([...expectedContent,...expectedCards])
    }
  })

  it('keeps concept evidence isolated to the requested family',async()=>{
    const target='ch6-endocrine'
    const mapped=chapter6QuizQuestionConceptMappings.filter((m)=>m.conceptFamilyId===target)
    const attempt:QuizAttempt={...weakInitialAttempt(),id:'endocrine-only',answers_json:Object.fromEntries(mapped.map((m)=>{
      const q=chapter6PremiumQuizQuestions.find((x)=>x.id===m.questionId)!
      return [q.id,q.correct_answer]
    }))}
    const provider=createChapter6DetectionProvider({fetchQuizAttempts:async()=>[attempt]})
    const result=await provider.detectConceptState(target,[attempt.id])
    expect(result).not.toBeNull()
    expect(result!.conceptId).toBe(target)
    expect(result!.evidence.totalObservations).toBe(mapped.length)
    expect(result!.evidence.correct).toBe(mapped.length)
  })

  it('excludes all initial questions and selects unseen reserve evidence for reassessment',async()=>{
    const target='ch6-cells-tissues'
    const initialIds=chapter6QuizQuestionConceptMappings.filter((m)=>m.conceptFamilyId===target).map((m)=>m.questionId)
    const attempt:HistoricalQuizAttempt={
      id:'hist-1',userId:'student-ch6',quizId:'quiz-6',
      answersJson:Object.fromEntries(initialIds.map((id)=>[id,'a'])),
      completedAt:new Date('2026-09-24T03:00:00.000Z'),
    }
    const engine=createHistoricalExclusionEngine(new ExclusionDb([attempt]),'ch-6')
    const selected=await engine.selectReassessmentQuestion('student-ch6',target,'cycle-1')
    expect(selected.success).toBe(true)
    expect(selected.selectedQuestionId).toBe('qq-6-051')
    expect(initialIds.every((id)=>selected.exclusionSet.combinedExclusionSet.has(id))).toBe(true)
  })
})
