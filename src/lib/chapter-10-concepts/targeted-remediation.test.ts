import { describe, expect, it } from 'vitest'
import type { Chapter10EvidenceRecord } from './grading'
import {
  appendChapter10ReassessmentEvidence,
  buildChapter10ReassessmentEvidence,
  buildChapter10TargetedRemediationPlan,
  calculateChapter10RecoveredMastery,
  CHAPTER10_REMEDIATION_RULES,
  scoreChapter10ReassessmentCycle,
  selectChapter10ReassessmentQuestions,
} from './targeted-remediation'
import {
  chapter10ReassessmentReserve,
  getChapter10ReassessmentReserve,
} from './reassessment-reserve'
import { CHAPTER10_CONCEPT_FAMILY_IDS } from './concepts'

const evidence = (
  conceptFamilyId: Chapter10EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter10EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter10EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-27T23:50:00.000Z',
): Chapter10EvidenceRecord => ({
  studentId: 'student-c10',
  chapterId: 'ch-10',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C10-7 reassessment reserve', () => {
  it('provides exactly five fresh questions for every canonical Chapter 10 concept', () => {
    expect(chapter10ReassessmentReserve).toHaveLength(45)
    expect(new Set(chapter10ReassessmentReserve.map((question) => question.id)).size).toBe(45)

    for (const conceptFamilyId of CHAPTER10_CONCEPT_FAMILY_IDS) {
      const questions = getChapter10ReassessmentReserve(conceptFamilyId)
      expect(questions).toHaveLength(5)
      expect(questions.every((question) => question.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(questions.every((question) => ['understanding', 'application', 'scenario'].includes(question.difficulty))).toBe(true)
    }
  })

  it('keeps the reserve separate from the main assessment and micro-check namespaces', () => {
    expect(chapter10ReassessmentReserve.every((question) => question.id.startsWith('r10-'))).toBe(true)
  })
})

describe('C10-7 targeted remediation', () => {
  it('targets an ordinary weak concept to its mapped lesson content and five-question 80-percent reassessment', () => {
    const records = [
      evidence('ch10-hair-anatomy-structure', 'qq-10-001', false),
      evidence('ch10-hair-anatomy-structure', 'mcq-10-001', false, 'micro_check', 'scenario'),
      evidence('ch10-hair-anatomy-structure', 'qq-10-002', true),
    ]

    const plan = buildChapter10TargetedRemediationPlan(records, '2026-09-27T23:51:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch10-hair-anatomy-structure')!

    expect(target).toBeTruthy()
    expect(target.priority).toBe('standard')
    expect(target.remediationContentBlockIds.length).toBeGreaterThan(0)
    expect(target.requiresFormalReassessment).toBe(true)
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(80)
    expect(plan.preservedInitialEvidence).toBe(records)
  })

  it('keeps a single current safety miss as priority review unless the ordinary formal-reassessment rule is also met', () => {
    const records = [
      evidence('ch10-service-safety-referral', 'mcq-10-017', false, 'micro_check', 'scenario'),
      evidence('ch10-service-safety-referral', 'mcq-10-018', true, 'micro_check', 'scenario', '2026-09-27T23:51:00.000Z'),
      evidence('ch10-service-safety-referral', 'mcq-10-019', true, 'micro_check', 'scenario', '2026-09-27T23:52:00.000Z'),
    ]

    const plan = buildChapter10TargetedRemediationPlan(records, '2026-09-27T23:53:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch10-service-safety-referral')!

    expect(target).toBeTruthy()
    expect(target.priority).toBe('priority')
    expect(target.safetyEscalation).toBe('review')
  })

  it('turns an urgent distinct-hazard pattern into a perfect five-question formal safety reassessment', () => {
    const records = [
      evidence('ch10-service-safety-referral', 'qq-10-034', false, 'chapter_assessment', 'scenario', '2026-09-27T23:50:00.000Z'),
      evidence('ch10-service-safety-referral', 'qq-10-066', true, 'chapter_assessment', 'scenario', '2026-09-27T23:51:00.000Z'),
      evidence('ch10-service-safety-referral', 'qq-10-067', false, 'chapter_assessment', 'scenario', '2026-09-27T23:52:00.000Z'),
    ]

    const plan = buildChapter10TargetedRemediationPlan(records, '2026-09-27T23:53:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch10-service-safety-referral')!

    expect(target.priority).toBe('urgent')
    expect(target.requiresFormalReassessment).toBe(true)
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(100)
    expect(target.safetyEscalation).toBe('urgent')
  })
})

describe('C10-7 five-question reassessment and mastery recovery', () => {
  it('selects the same deterministic five questions regardless of reserve ordering', () => {
    const first = selectChapter10ReassessmentQuestions('ch10-service-safety-referral', chapter10ReassessmentReserve)
    const second = selectChapter10ReassessmentQuestions(
      'ch10-service-safety-referral',
      [...chapter10ReassessmentReserve].reverse(),
    )

    expect(first).toEqual(second)
    expect(first).toHaveLength(5)
    expect(new Set(first).size).toBe(5)
  })

  it('passes an ordinary gap at 4/5 but fails urgent safety at the same 4/5', () => {
    const selected = selectChapter10ReassessmentQuestions('ch10-service-safety-referral', chapter10ReassessmentReserve)
    const responses = selected.map((questionId, index) => ({ questionId, correct: index < 4 }))

    const ordinary = scoreChapter10ReassessmentCycle({
      cycleId: 'c10-ordinary-1',
      conceptFamilyId: 'ch10-service-safety-referral',
      selectedQuestionIds: selected,
      responses,
      passPercent: 80,
    })
    const urgent = scoreChapter10ReassessmentCycle({
      cycleId: 'c10-urgent-1',
      conceptFamilyId: 'ch10-service-safety-referral',
      selectedQuestionIds: selected,
      responses,
      passPercent: 100,
    })

    expect(ordinary.percent).toBe(80)
    expect(ordinary.passed).toBe(true)
    expect(urgent.percent).toBe(80)
    expect(urgent.passed).toBe(false)
  })

  it('requires exactly five unique responses', () => {
    const selected = selectChapter10ReassessmentQuestions('ch10-analysis-properties', chapter10ReassessmentReserve)

    expect(() => scoreChapter10ReassessmentCycle({
      cycleId: 'bad-c10-cycle',
      conceptFamilyId: 'ch10-analysis-properties',
      selectedQuestionIds: selected.slice(0, 4),
      responses: selected.slice(0, 4).map((questionId) => ({ questionId, correct: true })),
      passPercent: 80,
    })).toThrow('exactly five unique questions')
  })

  it('appends reassessment evidence without erasing initial misses', () => {
    const original = [
      evidence('ch10-analysis-properties', 'qq-10-019', false),
      evidence('ch10-analysis-properties', 'mcq-10-009', false, 'micro_check', 'scenario'),
      evidence('ch10-analysis-properties', 'qq-10-017', true),
    ]
    const snapshot = JSON.stringify(original)
    const selected = getChapter10ReassessmentReserve('ch10-analysis-properties')
    const recovery = buildChapter10ReassessmentEvidence({
      studentId: 'student-c10',
      conceptFamilyId: 'ch10-analysis-properties',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-28T00:00:00.000Z',
    })

    expect(recovery).toHaveLength(5)
    expect(recovery.every((record) => record.source === 'remediation_reassessment')).toBe(true)
    expect(recovery.every((record) => record.attemptPhase === 'reassessment')).toBe(true)

    const combined = appendChapter10ReassessmentEvidence(original, recovery)
    expect(JSON.stringify(original)).toBe(snapshot)
    expect(combined.slice(0, original.length)).toEqual(original)
    expect(combined.filter((record) => record.attemptPhase === 'initial' && !record.correct)).toHaveLength(2)
  })

  it('raises mastery after successful recovery while retaining the original miss count', () => {
    const original = [
      evidence('ch10-analysis-properties', 'qq-10-019', false),
      evidence('ch10-analysis-properties', 'mcq-10-009', false, 'micro_check', 'scenario'),
      evidence('ch10-analysis-properties', 'qq-10-017', true),
    ]
    const selected = getChapter10ReassessmentReserve('ch10-analysis-properties')
    const recovery = buildChapter10ReassessmentEvidence({
      studentId: 'student-c10',
      conceptFamilyId: 'ch10-analysis-properties',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-28T00:00:00.000Z',
    })

    const result = calculateChapter10RecoveredMastery(
      original,
      recovery,
      'ch10-analysis-properties',
      '2026-09-28T00:01:00.000Z',
    )

    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
    expect(result.before.initialMissCount).toBe(2)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
  })

  it('locks ordinary and urgent reassessment policy to 5 questions at 80/100 percent', () => {
    expect(CHAPTER10_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER10_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER10_REMEDIATION_RULES.safetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER10_REMEDIATION_RULES.safetyReassessmentPassPercent).toBe(100)
  })
})
