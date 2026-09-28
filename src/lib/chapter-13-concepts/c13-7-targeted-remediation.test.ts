import { describe, expect, it } from 'vitest'
import type { Chapter13EvidenceRecord } from './grading'
import {
  appendChapter13ReassessmentEvidence,
  buildChapter13ReassessmentEvidence,
  buildChapter13TargetedRemediationPlan,
  calculateChapter13RecoveredMastery,
  CHAPTER13_REMEDIATION_RULES,
  scoreChapter13ReassessmentCycle,
  selectChapter13ReassessmentQuestions,
} from './targeted-remediation'
import {
  chapter13ReassessmentReserve,
  getChapter13ReassessmentReserve,
} from './reassessment-reserve'
import { CHAPTER13_CONCEPT_FAMILY_IDS } from './concepts'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { getChapterContentProvider, hasChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getCanonicalMappingProvider, hasCanonicalMappingProvider } from '@/lib/reassessment/provider-registry'

const evidence = (
  conceptFamilyId: Chapter13EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter13EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter13EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-28T16:00:00.000Z',
): Chapter13EvidenceRecord => ({
  studentId: 'student-c13',
  chapterId: 'ch-13',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C13-7 reassessment reserve', () => {
  it('provides exactly five fresh questions for each canonical concept', () => {
    expect(chapter13ReassessmentReserve).toHaveLength(40)
    expect(new Set(chapter13ReassessmentReserve.map((question) => question.id)).size).toBe(40)

    for (const conceptFamilyId of CHAPTER13_CONCEPT_FAMILY_IDS) {
      const questions = getChapter13ReassessmentReserve(conceptFamilyId)
      expect(questions).toHaveLength(5)
      expect(questions.every((question) => question.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(questions.every((question) => ['understanding','application','scenario'].includes(question.difficulty))).toBe(true)
    }
  })

  it('keeps the reserve separate from initial and micro-check namespaces', () => {
    expect(chapter13ReassessmentReserve.every((question) => question.id.startsWith('r13-'))).toBe(true)
    expect(chapter13ReassessmentReserve.some((question) => question.id.startsWith('qq-13-'))).toBe(false)
    expect(chapter13ReassessmentReserve.some((question) => question.id.startsWith('mcq-13-'))).toBe(false)
  })
})

describe('C13-7 targeted remediation and recovery', () => {
  it('targets an ordinary weak concept with five questions at 80 percent', () => {
    const records = [
      evidence('ch13-facial-hair-design','qq-13-043',false),
      evidence('ch13-facial-hair-design','mcq-13-011',false,'micro_check','application'),
      evidence('ch13-facial-hair-design','qq-13-044',true),
    ]
    const plan = buildChapter13TargetedRemediationPlan(records,'2026-09-28T16:01:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch13-facial-hair-design')!
    expect(target).toBeTruthy()
    expect(target.priority).toBe('standard')
    expect(target.remediationContentBlockIds.length).toBeGreaterThan(0)
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(80)
    expect(plan.preservedInitialEvidence).toBe(records)
  })

  it('escalates a distinct-hazard urgent safety pattern to five questions at 100 percent', () => {
    const records = [
      evidence('ch13-infection-control-service-safety','qq-13-006',false,'chapter_assessment','scenario'),
      evidence('ch13-infection-control-service-safety','qq-13-007',true,'chapter_assessment','scenario','2026-09-28T16:01:00.000Z'),
      evidence('ch13-infection-control-service-safety','qq-13-010',false,'chapter_assessment','scenario','2026-09-28T16:02:00.000Z'),
    ]
    const plan = buildChapter13TargetedRemediationPlan(records,'2026-09-28T16:03:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch13-infection-control-service-safety')!
    expect(target.priority).toBe('urgent')
    expect(target.requiresFormalReassessment).toBe(true)
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(100)
  })

  it('passes ordinary 4/5 but fails urgent safety 4/5', () => {
    const selected = selectChapter13ReassessmentQuestions('ch13-infection-control-service-safety',chapter13ReassessmentReserve)
    const responses = selected.map((questionId,index) => ({questionId,correct:index<4}))

    const ordinary = scoreChapter13ReassessmentCycle({
      cycleId:'c13-ordinary',
      conceptFamilyId:'ch13-infection-control-service-safety',
      selectedQuestionIds:selected,
      responses,
      passPercent:80,
    })
    const urgent = scoreChapter13ReassessmentCycle({
      cycleId:'c13-urgent',
      conceptFamilyId:'ch13-infection-control-service-safety',
      selectedQuestionIds:selected,
      responses,
      passPercent:100,
    })

    expect(ordinary.percent).toBe(80)
    expect(ordinary.passed).toBe(true)
    expect(urgent.passed).toBe(false)
  })

  it('preserves initial misses while appending reassessment evidence', () => {
    const original = [
      evidence('ch13-facial-hair-design','qq-13-043',false),
      evidence('ch13-facial-hair-design','mcq-13-011',false,'micro_check'),
      evidence('ch13-facial-hair-design','qq-13-044',true),
    ]
    const snapshot = JSON.stringify(original)
    const selected = getChapter13ReassessmentReserve('ch13-facial-hair-design')
    const recovery = buildChapter13ReassessmentEvidence({
      studentId:'student-c13',
      conceptFamilyId:'ch13-facial-hair-design',
      selectedQuestions:selected,
      responses:selected.map((question)=>({questionId:question.id,correct:true})),
      timestamp:'2026-09-28T16:10:00.000Z',
    })
    const combined = appendChapter13ReassessmentEvidence(original,recovery)

    expect(JSON.stringify(original)).toBe(snapshot)
    expect(combined.slice(0,original.length)).toEqual(original)
    expect(combined.filter((record)=>record.attemptPhase==='initial'&&!record.correct)).toHaveLength(2)
    expect(recovery.every((record)=>record.source==='remediation_reassessment')).toBe(true)
  })

  it('raises mastery after successful recovery without erasing original miss count', () => {
    const original = [
      evidence('ch13-facial-hair-design','qq-13-043',false),
      evidence('ch13-facial-hair-design','mcq-13-011',false,'micro_check'),
      evidence('ch13-facial-hair-design','qq-13-044',true),
    ]
    const selected = getChapter13ReassessmentReserve('ch13-facial-hair-design')
    const recovery = buildChapter13ReassessmentEvidence({
      studentId:'student-c13',
      conceptFamilyId:'ch13-facial-hair-design',
      selectedQuestions:selected,
      responses:selected.map((question)=>({questionId:question.id,correct:true})),
      timestamp:'2026-09-28T16:10:00.000Z',
    })
    const result = calculateChapter13RecoveredMastery(
      original,recovery,'ch13-facial-hair-design','2026-09-28T16:11:00.000Z',
    )

    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
    expect(result.before.initialMissCount).toBe(2)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
  })

  it('locks the policy to 5 questions at 80/100 percent', () => {
    expect(CHAPTER13_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER13_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER13_REMEDIATION_RULES.safetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER13_REMEDIATION_RULES.safetyReassessmentPassPercent).toBe(100)
  })
})


describe('C13-7 live remediation/reassessment provider wiring', () => {
  it('registers Chapter 13 for detected-gap targeted remediation assignments', () => {
    expect(isConceptDetectionSupported('ch-13')).toBe(true)
    const provider = getChapterDetectionProvider('ch-13')
    expect(provider).toBeDefined()

    for (const conceptId of CHAPTER13_CONCEPT_FAMILY_IDS) {
      const assignments = provider!.buildAssignmentsForConcept(conceptId)
      expect(assignments.some((item) => item.assignmentType === 'content_block'), conceptId).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard'), conceptId).toBe(true)
    }
  })

  it('registers Chapter 13 content serving and can resolve every fresh reassessment question', () => {
    expect(hasChapterContentProvider('ch-13')).toBe(true)
    const provider = getChapterContentProvider('ch-13')!

    for (const conceptId of CHAPTER13_CONCEPT_FAMILY_IDS) {
      expect(provider.getContentBlockIdsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)
      expect(provider.getFlashcardIdsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)

      const fresh = getChapter13ReassessmentReserve(conceptId)
      expect(fresh).toHaveLength(5)
      for (const question of fresh) {
        const served = provider.getQuizQuestionById(question.id)
        expect(served, question.id).toBeTruthy()
        expect(served!.id).toBe(question.id)
        expect(served!.correct_answer).toBe(question.correctAnswer)
      }
    }
  })

  it('registers Chapter 13 canonical reassessment mapping with exactly five fresh items per concept', () => {
    expect(hasCanonicalMappingProvider('ch-13')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-13')
    expect(provider.getAllConceptIds()).toEqual(expect.arrayContaining([...CHAPTER13_CONCEPT_FAMILY_IDS]))

    for (const conceptId of CHAPTER13_CONCEPT_FAMILY_IDS) {
      const ids = provider.getQuestionsForConcept(conceptId)
      expect(ids, conceptId).toHaveLength(5)
      expect(ids.every((id) => id.startsWith('r13-')), conceptId).toBe(true)
      expect(new Set(ids).size, conceptId).toBe(5)

      for (const id of ids) {
        expect(provider.getConceptForQuestion(id), id).toBe(conceptId)
        expect(provider.isQuestionMappedToConcept(id, conceptId), id).toBe(true)
      }
    }
  })

  it('proves the live weak-concept chain resolves targeted material plus the correct five-question pool', () => {
    const detection = getChapterDetectionProvider('ch-13')!
    const content = getChapterContentProvider('ch-13')!
    const reassessment = getCanonicalMappingProvider('ch-13')

    for (const conceptId of CHAPTER13_CONCEPT_FAMILY_IDS) {
      const assignments = detection.buildAssignmentsForConcept(conceptId)
      const questionIds = reassessment.getQuestionsForConcept(conceptId)

      expect(assignments.length, conceptId).toBeGreaterThan(0)
      expect(questionIds, conceptId).toHaveLength(5)
      expect(
        questionIds.every((questionId) => content.getQuizQuestionById(questionId)?.id === questionId),
        conceptId,
      ).toBe(true)
    }
  })
})
