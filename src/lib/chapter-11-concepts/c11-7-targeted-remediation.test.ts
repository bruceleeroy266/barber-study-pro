import { describe, expect, it } from 'vitest'
import type { Chapter11EvidenceRecord } from './grading'
import {
  appendChapter11ReassessmentEvidence,
  buildChapter11ReassessmentEvidence,
  buildChapter11TargetedRemediationPlan,
  calculateChapter11RecoveredMastery,
  CHAPTER11_REMEDIATION_RULES,
  scoreChapter11ReassessmentCycle,
  selectChapter11ReassessmentQuestions,
} from './targeted-remediation'
import {
  chapter11ReassessmentReserve,
  getChapter11ReassessmentReserve,
} from './reassessment-reserve'
import { CHAPTER11_CONCEPT_FAMILY_IDS } from './concepts'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { getChapterContentProvider, hasChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getCanonicalMappingProvider, hasCanonicalMappingProvider } from '@/lib/reassessment/provider-registry'

const evidence = (
  conceptFamilyId: Chapter11EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter11EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter11EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-28T03:25:00.000Z',
): Chapter11EvidenceRecord => ({
  studentId: 'student-c11',
  chapterId: 'ch-11',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C11-7 reassessment reserve', () => {
  it('provides exactly five fresh questions for every canonical Chapter 11 concept', () => {
    expect(chapter11ReassessmentReserve).toHaveLength(40)
    expect(new Set(chapter11ReassessmentReserve.map((question) => question.id)).size).toBe(40)

    for (const conceptFamilyId of CHAPTER11_CONCEPT_FAMILY_IDS) {
      const questions = getChapter11ReassessmentReserve(conceptFamilyId)
      expect(questions).toHaveLength(5)
      expect(questions.every((question) => question.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(questions.every((question) => ['understanding', 'application', 'scenario'].includes(question.difficulty))).toBe(true)
    }
  })

  it('keeps reassessment questions in a fresh namespace separate from initial and micro-check banks', () => {
    expect(chapter11ReassessmentReserve.every((question) => question.id.startsWith('r11-'))).toBe(true)
    expect(chapter11ReassessmentReserve.some((question) => question.id.startsWith('qq-11-'))).toBe(false)
    expect(chapter11ReassessmentReserve.some((question) => question.id.startsWith('mcq-11-'))).toBe(false)
  })
})

describe('C11-7 targeted remediation', () => {
  it('targets an ordinary weak concept to mapped lesson content and a five-question 80-percent reassessment', () => {
    const records = [
      evidence('ch11-analysis-product-selection', 'qq-11-013', false),
      evidence('ch11-analysis-product-selection', 'mcq-11-003', false, 'micro_check', 'application'),
      evidence('ch11-analysis-product-selection', 'qq-11-014', true),
    ]

    const plan = buildChapter11TargetedRemediationPlan(records, '2026-09-28T03:26:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch11-analysis-product-selection')!

    expect(target).toBeTruthy()
    expect(target.priority).toBe('standard')
    expect(target.remediationContentBlockIds.length).toBeGreaterThan(0)
    expect(target.requiresFormalReassessment).toBe(true)
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(80)
    expect(plan.preservedInitialEvidence).toBe(records)
  })

  it('keeps one tagged safety miss as priority review unless ordinary reassessment is also required', () => {
    const records = [
      evidence('ch11-service-safety-referral', 'mcq-11-013', false, 'micro_check', 'scenario'),
      evidence('ch11-service-safety-referral', 'mcq-11-014', true, 'micro_check', 'scenario', '2026-09-28T03:26:00.000Z'),
      evidence('ch11-service-safety-referral', 'mcq-11-015', true, 'micro_check', 'application', '2026-09-28T03:27:00.000Z'),
    ]

    const plan = buildChapter11TargetedRemediationPlan(records, '2026-09-28T03:28:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch11-service-safety-referral')!

    expect(target).toBeTruthy()
    expect(target.priority).toBe('priority')
    expect(target.safetyEscalation).toBe('review')
  })

  it('turns an urgent distinct-hazard pattern into a five-question 100-percent safety reassessment', () => {
    const records = [
      evidence('ch11-service-safety-referral', 'qq-11-039', false, 'chapter_assessment', 'scenario'),
      evidence('ch11-service-safety-referral', 'qq-11-038', true, 'chapter_assessment', 'application', '2026-09-28T03:26:00.000Z'),
      evidence('ch11-service-safety-referral', 'qq-11-043', false, 'chapter_assessment', 'scenario', '2026-09-28T03:27:00.000Z'),
    ]

    const plan = buildChapter11TargetedRemediationPlan(records, '2026-09-28T03:28:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch11-service-safety-referral')!

    expect(target.priority).toBe('urgent')
    expect(target.requiresFormalReassessment).toBe(true)
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(100)
    expect(target.safetyEscalation).toBe('urgent')
  })
})

describe('C11-7 five-question recovery', () => {
  it('passes ordinary recovery at 4/5 but fails urgent safety at the same 4/5', () => {
    const selected = selectChapter11ReassessmentQuestions('ch11-service-safety-referral', chapter11ReassessmentReserve)
    const responses = selected.map((questionId, index) => ({ questionId, correct: index < 4 }))

    const ordinary = scoreChapter11ReassessmentCycle({
      cycleId: 'c11-ordinary-1',
      conceptFamilyId: 'ch11-service-safety-referral',
      selectedQuestionIds: selected,
      responses,
      passPercent: 80,
    })
    const urgent = scoreChapter11ReassessmentCycle({
      cycleId: 'c11-urgent-1',
      conceptFamilyId: 'ch11-service-safety-referral',
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
    const selected = selectChapter11ReassessmentQuestions('ch11-scalp-massage', chapter11ReassessmentReserve)

    expect(() => scoreChapter11ReassessmentCycle({
      cycleId: 'bad-c11-cycle',
      conceptFamilyId: 'ch11-scalp-massage',
      selectedQuestionIds: selected.slice(0, 4),
      responses: selected.slice(0, 4).map((questionId) => ({ questionId, correct: true })),
      passPercent: 80,
    })).toThrow('exactly five unique questions')
  })

  it('appends recovery evidence without erasing initial misses', () => {
    const original = [
      evidence('ch11-analysis-product-selection', 'qq-11-013', false),
      evidence('ch11-analysis-product-selection', 'mcq-11-003', false, 'micro_check'),
      evidence('ch11-analysis-product-selection', 'qq-11-014', true),
    ]
    const snapshot = JSON.stringify(original)
    const selected = getChapter11ReassessmentReserve('ch11-analysis-product-selection')
    const recovery = buildChapter11ReassessmentEvidence({
      studentId: 'student-c11',
      conceptFamilyId: 'ch11-analysis-product-selection',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-28T03:30:00.000Z',
    })

    expect(recovery).toHaveLength(5)
    expect(recovery.every((record) => record.source === 'remediation_reassessment')).toBe(true)
    expect(recovery.every((record) => record.attemptPhase === 'reassessment')).toBe(true)

    const combined = appendChapter11ReassessmentEvidence(original, recovery)
    expect(JSON.stringify(original)).toBe(snapshot)
    expect(combined.slice(0, original.length)).toEqual(original)
    expect(combined.filter((record) => record.attemptPhase === 'initial' && !record.correct)).toHaveLength(2)
  })

  it('raises mastery after successful recovery while retaining the initial miss count', () => {
    const original = [
      evidence('ch11-analysis-product-selection', 'qq-11-013', false),
      evidence('ch11-analysis-product-selection', 'mcq-11-003', false, 'micro_check'),
      evidence('ch11-analysis-product-selection', 'qq-11-014', true),
    ]
    const selected = getChapter11ReassessmentReserve('ch11-analysis-product-selection')
    const recovery = buildChapter11ReassessmentEvidence({
      studentId: 'student-c11',
      conceptFamilyId: 'ch11-analysis-product-selection',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-28T03:30:00.000Z',
    })

    const result = calculateChapter11RecoveredMastery(
      original,
      recovery,
      'ch11-analysis-product-selection',
      '2026-09-28T03:31:00.000Z',
    )

    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
    expect(result.before.initialMissCount).toBe(2)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
  })

  it('locks ordinary and urgent policy to 5 questions at 80/100 percent', () => {
    expect(CHAPTER11_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER11_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER11_REMEDIATION_RULES.safetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER11_REMEDIATION_RULES.safetyReassessmentPassPercent).toBe(100)
  })
})

describe('C11-7 live remediation/reassessment provider wiring', () => {
  it('registers Chapter 11 for concept detection and targeted remediation assignments', () => {
    expect(isConceptDetectionSupported('ch-11')).toBe(true)
    const provider = getChapterDetectionProvider('ch-11')
    expect(provider).toBeDefined()

    for (const conceptId of CHAPTER11_CONCEPT_FAMILY_IDS) {
      const assignments = provider!.buildAssignmentsForConcept(conceptId)
      expect(assignments.some((item) => item.assignmentType === 'content_block')).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard')).toBe(true)
    }
  })

  it('registers Chapter 11 content serving and the 40-question fresh reserve', () => {
    expect(hasChapterContentProvider('ch-11')).toBe(true)
    const provider = getChapterContentProvider('ch-11')!

    for (const conceptId of CHAPTER11_CONCEPT_FAMILY_IDS) {
      expect(provider.getContentBlockIdsForConcept(conceptId).length).toBeGreaterThan(0)
      expect(provider.getFlashcardIdsForConcept(conceptId).length).toBeGreaterThan(0)
      expect(provider.getConceptQuestionCount(conceptId)).toBeGreaterThanOrEqual(6)
    }

    expect(provider.getQuizQuestionById('r11-safety-001')?.correct_answer).toBe('c')
  })

  it('registers Chapter 11 canonical reassessment mapping provider with exactly five reserve items per concept', () => {
    expect(hasCanonicalMappingProvider('ch-11')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-11')
    expect(provider.getAllConceptIds()).toEqual(expect.arrayContaining([...CHAPTER11_CONCEPT_FAMILY_IDS]))

    for (const conceptId of CHAPTER11_CONCEPT_FAMILY_IDS) {
      expect(provider.getQuestionsForConcept(conceptId)).toHaveLength(5)
      expect(provider.getQuestionsForConcept(conceptId).every((id) => id.startsWith('r11-'))).toBe(true)
    }
  })
})
