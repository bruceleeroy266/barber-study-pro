import { describe, expect, it } from 'vitest'
import { CHAPTER9_CONCEPT_FAMILY_IDS } from './concepts'
import { chapter9ReassessmentReserve, getChapter9ReassessmentReserve } from './reassessment-reserve'
import type { Chapter9EvidenceRecord } from './grading'
import {
  CHAPTER9_REMEDIATION_RULES,
  appendChapter9ReassessmentEvidence,
  buildChapter9ReassessmentEvidence,
  buildChapter9TargetedRemediationPlan,
  calculateChapter9RecoveredMastery,
  scoreChapter9ReassessmentCycle,
  selectChapter9ReassessmentQuestions,
} from './targeted-remediation'
import { getChapter9ContentBlocksForConcept } from './mappings'

const evidence = (
  conceptFamilyId: Chapter9EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter9EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter9EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-27T01:00:00.000Z',
  attemptPhase: Chapter9EvidenceRecord['attemptPhase'] = 'initial',
): Chapter9EvidenceRecord => ({
  studentId: 'student-c9',
  chapterId: 'ch-9',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase,
  timestamp,
})

describe('C9-7 reassessment reserve integrity', () => {
  it('contains exactly 50 fresh questions: five for each canonical concept family', () => {
    expect(chapter9ReassessmentReserve).toHaveLength(50)
    expect(new Set(chapter9ReassessmentReserve.map((question) => question.id)).size).toBe(50)

    for (const conceptFamilyId of CHAPTER9_CONCEPT_FAMILY_IDS) {
      const questions = getChapter9ReassessmentReserve(conceptFamilyId)
      expect(questions).toHaveLength(5)
      expect(questions.every((question) => question.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(questions.every((question) => ['understanding', 'application', 'scenario'].includes(question.difficulty))).toBe(true)
    }
  })

  it('keeps reassessment IDs separate from initial assessment and micro-check namespaces', () => {
    for (const question of chapter9ReassessmentReserve) {
      expect(question.id.startsWith('r9-')).toBe(true)
      expect(question.id.startsWith('q9-')).toBe(false)
      expect(question.id.startsWith('mcq-9-')).toBe(false)
    }
  })
})

describe('C9-7 targeted remediation plan', () => {
  it('routes an ordinary detected gap to the canonical Chapter 9 content blocks and requires 80%', () => {
    const original = [
      evidence('ch9-primary-lesions', 'q9-013', false),
      evidence('ch9-primary-lesions', 'mcq-9-007', false, 'micro_check', 'scenario'),
      evidence('ch9-primary-lesions', 'q9-014', true),
    ] as const

    const plan = buildChapter9TargetedRemediationPlan(original, '2026-09-27T01:05:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch9-primary-lesions')

    expect(plan.preservedInitialEvidence).toBe(original)
    expect(target).toBeDefined()
    expect(target?.priority).toBe('standard')
    expect(target?.requiresFormalReassessment).toBe(true)
    expect(target?.reassessmentQuestionCount).toBe(5)
    expect(target?.reassessmentPassPercent).toBe(80)
    expect(target?.remediationContentBlockIds).toEqual(getChapter9ContentBlocksForConcept('ch9-primary-lesions'))
    expect(target?.remediationContentBlockIds).toContain('primary-lesions')
  })

  it('escalates concepts involved in an urgent multi-hazard safety pattern to 100%', () => {
    const records = [
      evidence('ch9-secondary-lesions', 'q9-018', false, 'chapter_assessment', 'scenario', '2026-09-27T01:00:00.000Z'),
      evidence('ch9-sebaceous-sudoriferous-disorders', 'q9-022', true, 'chapter_assessment', 'scenario', '2026-09-27T01:01:00.000Z'),
      evidence('ch9-inflammatory-infectious-conditions', 'q9-024', false, 'chapter_assessment', 'scenario', '2026-09-27T01:02:00.000Z'),
    ]

    const plan = buildChapter9TargetedRemediationPlan(records, '2026-09-27T01:03:00.000Z')
    const openSkin = plan.targets.find((item) => item.conceptFamilyId === 'ch9-secondary-lesions')
    const infectious = plan.targets.find((item) => item.conceptFamilyId === 'ch9-inflammatory-infectious-conditions')

    expect(openSkin?.priority).toBe('urgent')
    expect(openSkin?.reassessmentPassPercent).toBe(100)
    expect(openSkin?.requiresFormalReassessment).toBe(true)
    expect(infectious?.priority).toBe('urgent')
    expect(infectious?.reassessmentPassPercent).toBe(100)
  })

  it('keeps a single high-risk miss at priority review rather than forcing 100% urgent reassessment by itself', () => {
    const records = [
      evidence('ch9-service-safety-referral', 'q9-030', true, 'chapter_assessment', 'scenario', '2026-09-27T00:50:00.000Z'),
      evidence('ch9-service-safety-referral', 'mcq-9-021', true, 'micro_check', 'application', '2026-09-27T00:51:00.000Z'),
      evidence('ch9-service-safety-referral', 'q9-030', false, 'chapter_assessment', 'scenario', '2026-09-27T01:00:00.000Z'),
    ]

    const plan = buildChapter9TargetedRemediationPlan(records, '2026-09-27T01:01:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch9-service-safety-referral')

    expect(target?.priority).toBe('priority')
    expect(target?.safetyEscalation).toBe('review')
    expect(target?.reassessmentPassPercent).toBe(80)
  })
})

describe('C9-7 five-question reassessment and mastery recovery', () => {
  it('selects five deterministic questions for the same concept', () => {
    const first = selectChapter9ReassessmentQuestions('ch9-skin-cancer-recognition', chapter9ReassessmentReserve)
    const second = selectChapter9ReassessmentQuestions(
      'ch9-skin-cancer-recognition',
      [...chapter9ReassessmentReserve].reverse(),
    )

    expect(first).toEqual(second)
    expect(first).toHaveLength(5)
    expect(new Set(first).size).toBe(5)
  })

  it('passes an ordinary gap at 4/5 but fails an urgent safety gap at the same 4/5', () => {
    const selected = selectChapter9ReassessmentQuestions('ch9-service-safety-referral', chapter9ReassessmentReserve)
    const responses = selected.map((questionId, index) => ({ questionId, correct: index < 4 }))

    const ordinary = scoreChapter9ReassessmentCycle({
      cycleId: 'c9-ordinary-1',
      conceptFamilyId: 'ch9-service-safety-referral',
      selectedQuestionIds: selected,
      responses,
      passPercent: 80,
    })
    const urgent = scoreChapter9ReassessmentCycle({
      cycleId: 'c9-urgent-1',
      conceptFamilyId: 'ch9-service-safety-referral',
      selectedQuestionIds: selected,
      responses,
      passPercent: 100,
    })

    expect(ordinary.percent).toBe(80)
    expect(ordinary.passed).toBe(true)
    expect(urgent.percent).toBe(80)
    expect(urgent.passed).toBe(false)
  })

  it('requires exactly five unique responses and rejects incomplete cycles', () => {
    const selected = selectChapter9ReassessmentQuestions('ch9-primary-lesions', chapter9ReassessmentReserve)

    expect(() => scoreChapter9ReassessmentCycle({
      cycleId: 'bad-c9-cycle',
      conceptFamilyId: 'ch9-primary-lesions',
      selectedQuestionIds: selected.slice(0, 4),
      responses: selected.slice(0, 4).map((questionId) => ({ questionId, correct: true })),
      passPercent: 80,
    })).toThrow('exactly five unique questions')
  })

  it('builds reassessment evidence in the recovery stream and preserves first-attempt misses', () => {
    const original = [
      evidence('ch9-primary-lesions', 'q9-013', false),
      evidence('ch9-primary-lesions', 'mcq-9-007', false, 'micro_check', 'scenario'),
      evidence('ch9-primary-lesions', 'q9-014', true),
    ]
    const snapshot = JSON.stringify(original)
    const selected = getChapter9ReassessmentReserve('ch9-primary-lesions')
    const recovery = buildChapter9ReassessmentEvidence({
      studentId: 'student-c9',
      conceptFamilyId: 'ch9-primary-lesions',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-27T01:10:00.000Z',
    })

    expect(recovery).toHaveLength(5)
    expect(recovery.every((record) => record.source === 'remediation_reassessment')).toBe(true)
    expect(recovery.every((record) => record.attemptPhase === 'reassessment')).toBe(true)

    const combined = appendChapter9ReassessmentEvidence(original, recovery)
    expect(JSON.stringify(original)).toBe(snapshot)
    expect(combined.slice(0, original.length)).toEqual(original)
    expect(combined.filter((record) => record.attemptPhase === 'initial' && !record.correct)).toHaveLength(2)
  })

  it('successful reassessment raises mastery while retaining the original initialMissCount', () => {
    const original = [
      evidence('ch9-primary-lesions', 'q9-013', false),
      evidence('ch9-primary-lesions', 'mcq-9-007', false, 'micro_check', 'scenario'),
      evidence('ch9-primary-lesions', 'q9-014', true),
    ]
    const selected = getChapter9ReassessmentReserve('ch9-primary-lesions')
    const recovery = buildChapter9ReassessmentEvidence({
      studentId: 'student-c9',
      conceptFamilyId: 'ch9-primary-lesions',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-27T01:10:00.000Z',
    })

    const result = calculateChapter9RecoveredMastery(
      original,
      recovery,
      'ch9-primary-lesions',
      '2026-09-27T01:11:00.000Z',
    )

    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
    expect(result.before.initialMissCount).toBe(2)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
  })

  it('locks ordinary and urgent thresholds at 80% and 100%', () => {
    expect(CHAPTER9_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER9_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER9_REMEDIATION_RULES.safetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER9_REMEDIATION_RULES.safetyReassessmentPassPercent).toBe(100)
  })
})
