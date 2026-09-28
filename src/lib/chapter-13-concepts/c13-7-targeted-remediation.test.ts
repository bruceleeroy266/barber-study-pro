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
