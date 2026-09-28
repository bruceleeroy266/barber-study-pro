import { describe, expect, it } from 'vitest'
import type { Chapter14EvidenceRecord } from './grading'
import { CHAPTER14_CONCEPT_FAMILY_IDS } from './concepts'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { getChapterContentProvider, hasChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getCanonicalMappingProvider, hasCanonicalMappingProvider } from '@/lib/reassessment/provider-registry'
import {
  chapter14ReassessmentReserve,
  getChapter14ReassessmentReserve,
} from './reassessment-reserve'
import {
  appendChapter14ReassessmentEvidence,
  buildChapter14ReassessmentEvidence,
  buildChapter14TargetedRemediationPlan,
  calculateChapter14RecoveredMastery,
  CHAPTER14_REMEDIATION_RULES,
  scoreChapter14ReassessmentCycle,
  selectChapter14ReassessmentQuestions,
} from './targeted-remediation'

const evidence = (
  conceptFamilyId: Chapter14EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter14EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter14EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-28T19:15:00.000Z',
): Chapter14EvidenceRecord => ({
  studentId: 'student-c14',
  chapterId: 'ch-14',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C14-7 reassessment reserve', () => {
  it('provides exactly five fresh questions for each canonical concept', () => {
    expect(chapter14ReassessmentReserve).toHaveLength(35)
    expect(new Set(chapter14ReassessmentReserve.map((question) => question.id)).size).toBe(35)

    for (const conceptFamilyId of CHAPTER14_CONCEPT_FAMILY_IDS) {
      const questions = getChapter14ReassessmentReserve(conceptFamilyId)
      expect(questions).toHaveLength(5)
      expect(questions.every((question) => question.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(questions.every((question) => ['understanding','application','scenario'].includes(question.difficulty))).toBe(true)
    }
  })

  it('keeps the reserve separate from the 70-question assessment and micro-check namespaces', () => {
    expect(chapter14ReassessmentReserve.every((question) => question.id.startsWith('r14-'))).toBe(true)
    expect(chapter14ReassessmentReserve.some((question) => question.id.startsWith('qq-14-'))).toBe(false)
    expect(chapter14ReassessmentReserve.some((question) => question.id.startsWith('mcq-14-'))).toBe(false)
  })
})

describe('C14-7 targeted remediation and recovery', () => {
  it('targets an ordinary weak concept with five questions at 80 percent', () => {
    const records = [
      evidence('ch14-cutting-geometry-guides','qq-14-023',false),
      evidence('ch14-cutting-geometry-guides','mcq-14-005',false,'micro_check'),
      evidence('ch14-cutting-geometry-guides','qq-14-024',true),
    ]

    const plan = buildChapter14TargetedRemediationPlan(records,'2026-09-28T19:16:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch14-cutting-geometry-guides')!

    expect(target).toBeTruthy()
    expect(target.priority).toBe('standard')
    expect(target.remediationContentBlockIds.length).toBeGreaterThan(0)
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(80)
    expect(plan.preservedInitialEvidence).toBe(records)
  })

  it('escalates distinct recent safety hazards to five questions at 100 percent', () => {
    const records = [
      evidence('ch14-service-safety-sanitation','mcq-14-013',false,'micro_check','scenario'),
      evidence('ch14-service-safety-sanitation','qq-14-070',true,'chapter_assessment','scenario','2026-09-28T19:16:00.000Z'),
      evidence('ch14-service-safety-sanitation','mcq-14-014',false,'micro_check','scenario','2026-09-28T19:17:00.000Z'),
    ]

    const plan = buildChapter14TargetedRemediationPlan(records,'2026-09-28T19:18:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch14-service-safety-sanitation')!

    expect(target.priority).toBe('urgent')
    expect(target.requiresFormalReassessment).toBe(true)
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(100)
  })

  it('passes ordinary 4/5 but blocks urgent safety 4/5', () => {
    const selected = selectChapter14ReassessmentQuestions(
      'ch14-service-safety-sanitation',
      chapter14ReassessmentReserve,
    )
    const responses = selected.map((questionId,index) => ({ questionId, correct:index < 4 }))

    const ordinary = scoreChapter14ReassessmentCycle({
      cycleId:'c14-ordinary',
      conceptFamilyId:'ch14-service-safety-sanitation',
      selectedQuestionIds:selected,
      responses,
      passPercent:80,
    })
    const urgent = scoreChapter14ReassessmentCycle({
      cycleId:'c14-urgent',
      conceptFamilyId:'ch14-service-safety-sanitation',
      selectedQuestionIds:selected,
      responses,
      passPercent:100,
    })

    expect(ordinary.percent).toBe(80)
    expect(ordinary.passed).toBe(true)
    expect(urgent.percent).toBe(80)
    expect(urgent.passed).toBe(false)
  })

  it('passes urgent safety only at 5/5', () => {
    const selected = selectChapter14ReassessmentQuestions(
      'ch14-service-safety-sanitation',
      chapter14ReassessmentReserve,
    )
    const responses = selected.map((questionId) => ({ questionId, correct:true }))

    const urgent = scoreChapter14ReassessmentCycle({
      cycleId:'c14-urgent-pass',
      conceptFamilyId:'ch14-service-safety-sanitation',
      selectedQuestionIds:selected,
      responses,
      passPercent:100,
    })

    expect(urgent.percent).toBe(100)
    expect(urgent.passed).toBe(true)
  })

  it('preserves initial misses while appending reassessment evidence', () => {
    const original = [
      evidence('ch14-cutting-geometry-guides','qq-14-023',false),
      evidence('ch14-cutting-geometry-guides','mcq-14-005',false,'micro_check'),
      evidence('ch14-cutting-geometry-guides','qq-14-024',true),
    ]
    const snapshot = JSON.stringify(original)
    const selected = getChapter14ReassessmentReserve('ch14-cutting-geometry-guides')
    const recovery = buildChapter14ReassessmentEvidence({
      studentId:'student-c14',
      conceptFamilyId:'ch14-cutting-geometry-guides',
      selectedQuestions:selected,
      responses:selected.map((question)=>({questionId:question.id,correct:true})),
      timestamp:'2026-09-28T19:20:00.000Z',
    })
    const combined = appendChapter14ReassessmentEvidence(original,recovery)

    expect(JSON.stringify(original)).toBe(snapshot)
    expect(combined.slice(0,original.length)).toEqual(original)
    expect(combined.filter((record)=>record.attemptPhase==='initial'&&!record.correct)).toHaveLength(2)
    expect(recovery.every((record)=>record.source==='remediation_reassessment')).toBe(true)
    expect(recovery.every((record)=>record.attemptPhase==='reassessment')).toBe(true)
  })

  it('raises mastery after successful recovery without erasing original miss count', () => {
    const original = [
      evidence('ch14-cutting-geometry-guides','qq-14-023',false),
      evidence('ch14-cutting-geometry-guides','mcq-14-005',false,'micro_check'),
      evidence('ch14-cutting-geometry-guides','qq-14-024',true),
    ]
    const selected = getChapter14ReassessmentReserve('ch14-cutting-geometry-guides')
    const recovery = buildChapter14ReassessmentEvidence({
      studentId:'student-c14',
      conceptFamilyId:'ch14-cutting-geometry-guides',
      selectedQuestions:selected,
      responses:selected.map((question)=>({questionId:question.id,correct:true})),
      timestamp:'2026-09-28T19:20:00.000Z',
    })

    const result = calculateChapter14RecoveredMastery(
      original,recovery,'ch14-cutting-geometry-guides','2026-09-28T19:21:00.000Z',
    )

    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
    expect(result.before.initialMissCount).toBe(2)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
  })

  it('locks C14-7 policy to 5 questions at 80/100 percent', () => {
    expect(CHAPTER14_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER14_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER14_REMEDIATION_RULES.safetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER14_REMEDIATION_RULES.safetyReassessmentPassPercent).toBe(100)
  })
})


describe('C14-7 live remediation/reassessment provider wiring', () => {
  it('registers Chapter 14 for detected-gap targeted remediation assignments', () => {
    expect(isConceptDetectionSupported('ch-14')).toBe(true)
    const provider = getChapterDetectionProvider('ch-14')
    expect(provider).toBeDefined()

    for (const conceptId of CHAPTER14_CONCEPT_FAMILY_IDS) {
      const assignments = provider!.buildAssignmentsForConcept(conceptId)
      expect(assignments.some((item) => item.assignmentType === 'content_block'), conceptId).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard'), conceptId).toBe(true)
    }
  })

  it('registers Chapter 14 content serving and resolves all five fresh questions for every concept', () => {
    expect(hasChapterContentProvider('ch-14')).toBe(true)
    const provider = getChapterContentProvider('ch-14')!

    for (const conceptId of CHAPTER14_CONCEPT_FAMILY_IDS) {
      expect(provider.getContentBlockIdsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)
      expect(provider.getFlashcardIdsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)

      const fresh = getChapter14ReassessmentReserve(conceptId)
      expect(fresh, conceptId).toHaveLength(5)

      for (const question of fresh) {
        const served = provider.getQuizQuestionById(question.id)
        expect(served, question.id).toBeTruthy()
        expect(served!.id).toBe(question.id)
        expect(served!.correct_answer).toBe(question.correctAnswer)
      }
    }
  })

  it('registers canonical reassessment mapping with exactly five fresh r14 items per concept', () => {
    expect(hasCanonicalMappingProvider('ch-14')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-14')
    expect(provider.getAllConceptIds()).toEqual(expect.arrayContaining([...CHAPTER14_CONCEPT_FAMILY_IDS]))

    for (const conceptId of CHAPTER14_CONCEPT_FAMILY_IDS) {
      const ids = provider.getQuestionsForConcept(conceptId)
      expect(ids, conceptId).toHaveLength(5)
      expect(ids.every((id) => id.startsWith('r14-')), conceptId).toBe(true)
      expect(new Set(ids).size, conceptId).toBe(5)

      for (const id of ids) {
        expect(provider.getConceptForQuestion(id), id).toBe(conceptId)
        expect(provider.isQuestionMappedToConcept(id, conceptId), id).toBe(true)
      }
    }
  })

  it('proves the live weak-concept chain serves targeted material plus the correct five-question pool', () => {
    const detection = getChapterDetectionProvider('ch-14')!
    const content = getChapterContentProvider('ch-14')!
    const reassessment = getCanonicalMappingProvider('ch-14')

    for (const conceptId of CHAPTER14_CONCEPT_FAMILY_IDS) {
      const assignments = detection.buildAssignmentsForConcept(conceptId)
      const questionIds = reassessment.getQuestionsForConcept(conceptId)

      expect(assignments.length, conceptId).toBeGreaterThan(0)
      expect(assignments.some((item) => item.assignmentType === 'content_block'), conceptId).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard'), conceptId).toBe(true)
      expect(questionIds, conceptId).toHaveLength(5)
      expect(
        questionIds.every((questionId) => content.getQuizQuestionById(questionId)?.id === questionId),
        conceptId,
      ).toBe(true)
    }
  })
})
