import { describe, expect, it } from 'vitest'
import type { Chapter12EvidenceRecord } from './grading'
import {
  appendChapter12ReassessmentEvidence,
  buildChapter12ReassessmentEvidence,
  buildChapter12TargetedRemediationPlan,
  calculateChapter12RecoveredMastery,
  CHAPTER12_REMEDIATION_RULES,
  scoreChapter12ReassessmentCycle,
  selectChapter12ReassessmentQuestions,
} from './targeted-remediation'
import {
  chapter12ReassessmentReserve,
  getChapter12ReassessmentReserve,
} from './reassessment-reserve'
import {
  calculateChapter12Grade,
  calculateChapter12ConceptMastery,
} from './grading'
import { CHAPTER12_CONCEPT_FAMILY_IDS } from './concepts'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { getChapterContentProvider, hasChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getCanonicalMappingProvider, hasCanonicalMappingProvider } from '@/lib/reassessment/provider-registry'

const evidence = (
  conceptFamilyId: Chapter12EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter12EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter12EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-28T09:00:00.000Z',
): Chapter12EvidenceRecord => ({
  studentId: 'student-c12',
  chapterId: 'ch-12',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C12-7 reassessment reserve', () => {
  it('provides exactly five fresh questions for every canonical Chapter 12 concept', () => {
    expect(chapter12ReassessmentReserve).toHaveLength(40)
    expect(new Set(chapter12ReassessmentReserve.map((question) => question.id)).size).toBe(40)

    for (const conceptFamilyId of CHAPTER12_CONCEPT_FAMILY_IDS) {
      const questions = getChapter12ReassessmentReserve(conceptFamilyId)
      expect(questions).toHaveLength(5)
      expect(questions.every((question) => question.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(questions.every((question) => ['understanding', 'application', 'scenario'].includes(question.difficulty))).toBe(true)
    }
  })

  it('keeps reassessment questions in a fresh namespace separate from initial and micro-check banks', () => {
    expect(chapter12ReassessmentReserve.every((question) => question.id.startsWith('r12-'))).toBe(true)
    expect(chapter12ReassessmentReserve.some((question) => question.id.startsWith('qq-12-'))).toBe(false)
    expect(chapter12ReassessmentReserve.some((question) => question.id.startsWith('mcq-12-'))).toBe(false)
  })

  it('uses four unique options and a valid key for every fresh question', () => {
    for (const question of chapter12ReassessmentReserve) {
      const options = [question.answer_a, question.answer_b, question.answer_c, question.answer_d]
      expect(new Set(options.map((option) => option.trim().toLowerCase())).size, question.id).toBe(4)
      expect(['a','b','c','d']).toContain(question.correctAnswer)
      expect(question.explanation.trim().length, question.id).toBeGreaterThan(20)
    }
  })
})

describe('C12-7 targeted remediation', () => {
  it('targets an ordinary weak concept to mapped content and a five-question 80-percent reassessment', () => {
    const records = [
      evidence('ch12-skin-analysis-product-selection', 'qq-12-031', false),
      evidence('ch12-skin-analysis-product-selection', 'mcq-12-008', false, 'micro_check', 'scenario'),
      evidence('ch12-skin-analysis-product-selection', 'qq-12-032', true),
    ]

    const plan = buildChapter12TargetedRemediationPlan(records, '2026-09-28T09:01:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch12-skin-analysis-product-selection')!

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
      evidence('ch12-contraindications-service-safety', 'mcq-12-013', false, 'micro_check', 'scenario'),
      evidence('ch12-contraindications-service-safety', 'qq-12-043', true, 'chapter_assessment', 'scenario', '2026-09-28T09:01:00.000Z'),
      evidence('ch12-contraindications-service-safety', 'qq-12-044', true, 'chapter_assessment', 'scenario', '2026-09-28T09:02:00.000Z'),
    ]

    const plan = buildChapter12TargetedRemediationPlan(records, '2026-09-28T09:03:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch12-contraindications-service-safety')!

    expect(target).toBeTruthy()
    expect(target.priority).toBe('priority')
    expect(target.safetyEscalation).toBe('review')
  })

  it('turns an urgent distinct-hazard pattern into five-question 100-percent safety reassessment', () => {
    const records = [
      evidence('ch12-contraindications-service-safety', 'qq-12-043', false, 'chapter_assessment', 'scenario'),
      evidence('ch12-sanitation-infection-control', 'qq-12-041', true, 'chapter_assessment', 'application', '2026-09-28T09:01:00.000Z'),
      evidence('ch12-contraindications-service-safety', 'qq-12-045', false, 'chapter_assessment', 'scenario', '2026-09-28T09:02:00.000Z'),
    ]

    const plan = buildChapter12TargetedRemediationPlan(records, '2026-09-28T09:03:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch12-contraindications-service-safety')!

    expect(target.priority).toBe('urgent')
    expect(target.requiresFormalReassessment).toBe(true)
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(100)
    expect(target.safetyEscalation).toBe('urgent')
  })
})

describe('C12-7 five-question recovery', () => {
  it('passes ordinary recovery at 4/5 but fails urgent safety at the same 4/5', () => {
    const selected = selectChapter12ReassessmentQuestions('ch12-contraindications-service-safety', chapter12ReassessmentReserve)
    const responses = selected.map((questionId, index) => ({ questionId, correct: index < 4 }))

    const ordinary = scoreChapter12ReassessmentCycle({
      cycleId: 'c12-ordinary-1',
      conceptFamilyId: 'ch12-contraindications-service-safety',
      selectedQuestionIds: selected,
      responses,
      passPercent: 80,
    })
    const urgent = scoreChapter12ReassessmentCycle({
      cycleId: 'c12-urgent-1',
      conceptFamilyId: 'ch12-contraindications-service-safety',
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
    const selected = selectChapter12ReassessmentQuestions('ch12-facial-anatomy-neurovascular', chapter12ReassessmentReserve)

    expect(() => scoreChapter12ReassessmentCycle({
      cycleId: 'bad-c12-cycle',
      conceptFamilyId: 'ch12-facial-anatomy-neurovascular',
      selectedQuestionIds: selected.slice(0, 4),
      responses: selected.slice(0, 4).map((questionId) => ({ questionId, correct: true })),
      passPercent: 80,
    })).toThrow('exactly five unique questions')
  })

  it('appends recovery evidence without erasing initial misses', () => {
    const original = [
      evidence('ch12-skin-analysis-product-selection', 'qq-12-031', false),
      evidence('ch12-skin-analysis-product-selection', 'mcq-12-008', false, 'micro_check'),
      evidence('ch12-skin-analysis-product-selection', 'qq-12-032', true),
    ]
    const snapshot = JSON.stringify(original)
    const selected = getChapter12ReassessmentReserve('ch12-skin-analysis-product-selection')
    const recovery = buildChapter12ReassessmentEvidence({
      studentId: 'student-c12',
      conceptFamilyId: 'ch12-skin-analysis-product-selection',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-28T09:10:00.000Z',
    })

    expect(recovery).toHaveLength(5)
    expect(recovery.every((record) => record.source === 'remediation_reassessment')).toBe(true)
    expect(recovery.every((record) => record.attemptPhase === 'reassessment')).toBe(true)

    const combined = appendChapter12ReassessmentEvidence(original, recovery)
    expect(JSON.stringify(original)).toBe(snapshot)
    expect(combined.slice(0, original.length)).toEqual(original)
    expect(combined.filter((record) => record.attemptPhase === 'initial' && !record.correct)).toHaveLength(2)
  })

  it('raises mastery after successful recovery while retaining original miss count', () => {
    const original = [
      evidence('ch12-skin-analysis-product-selection', 'qq-12-031', false),
      evidence('ch12-skin-analysis-product-selection', 'mcq-12-008', false, 'micro_check'),
      evidence('ch12-skin-analysis-product-selection', 'qq-12-032', true),
    ]
    const selected = getChapter12ReassessmentReserve('ch12-skin-analysis-product-selection')
    const recovery = buildChapter12ReassessmentEvidence({
      studentId: 'student-c12',
      conceptFamilyId: 'ch12-skin-analysis-product-selection',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-28T09:10:00.000Z',
    })

    const result = calculateChapter12RecoveredMastery(
      original,
      recovery,
      'ch12-skin-analysis-product-selection',
      '2026-09-28T09:11:00.000Z',
    )

    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
    expect(result.before.initialMissCount).toBe(2)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
  })

  it('feeds successful reassessment into the existing 15-percent recovery grade bucket without lowering grade', () => {
    const base = calculateChapter12Grade({
      microCheckPercent: 60,
      flashcardPercent: 80,
      chapterAssessmentPercent: 70,
      scenarioApplicationPercent: 75,
      remediationReassessmentPercent: null,
    })
    const recovered = calculateChapter12Grade({
      microCheckPercent: 60,
      flashcardPercent: 80,
      chapterAssessmentPercent: 70,
      scenarioApplicationPercent: 75,
      remediationReassessmentPercent: 100,
    })

    expect(recovered.finalGrade).toBeGreaterThanOrEqual(base.finalGrade)
    expect(recovered.recoveryApplied).toBe(true)
  })

  it('locks ordinary and urgent policy to 5 questions at 80/100 percent', () => {
    expect(CHAPTER12_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER12_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER12_REMEDIATION_RULES.safetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER12_REMEDIATION_RULES.safetyReassessmentPassPercent).toBe(100)
  })

  it('proves reassessment evidence uses the same mastery engine, not a Chapter 12 fork', () => {
    const original = [evidence('ch12-client-care-professional-practice', 'qq-12-001', false)]
    const selected = getChapter12ReassessmentReserve('ch12-client-care-professional-practice')
    const recovery = buildChapter12ReassessmentEvidence({
      studentId: 'student-c12',
      conceptFamilyId: 'ch12-client-care-professional-practice',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-28T09:20:00.000Z',
    })
    const combined = appendChapter12ReassessmentEvidence(original, recovery)

    expect(calculateChapter12ConceptMastery(combined, '2026-09-28T09:21:00.000Z').reassessmentCorrectCount).toBe(5)
  })
})

describe('C12-7 live remediation/reassessment provider wiring', () => {
  it('registers Chapter 12 for concept detection and targeted remediation assignments', () => {
    expect(isConceptDetectionSupported('ch-12')).toBe(true)
    const provider = getChapterDetectionProvider('ch-12')
    expect(provider).toBeDefined()

    for (const conceptId of CHAPTER12_CONCEPT_FAMILY_IDS) {
      const assignments = provider!.buildAssignmentsForConcept(conceptId)
      expect(assignments.some((item) => item.assignmentType === 'content_block'), conceptId).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard'), conceptId).toBe(true)
    }
  })

  it('registers Chapter 12 content serving and the 40-question fresh reserve', () => {
    expect(hasChapterContentProvider('ch-12')).toBe(true)
    const provider = getChapterContentProvider('ch-12')!

    for (const conceptId of CHAPTER12_CONCEPT_FAMILY_IDS) {
      expect(provider.getContentBlockIdsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)
      expect(provider.getFlashcardIdsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)
      expect(provider.getConceptQuestionCount(conceptId), conceptId).toBeGreaterThanOrEqual(8)
    }

    expect(provider.getQuizQuestionById('r12-safety-001')?.correct_answer).toBe('c')
  })

  it('registers Chapter 12 canonical reassessment mapping provider with exactly five reserve items per concept', () => {
    expect(hasCanonicalMappingProvider('ch-12')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-12')
    expect(provider.getAllConceptIds()).toEqual(expect.arrayContaining([...CHAPTER12_CONCEPT_FAMILY_IDS]))

    for (const conceptId of CHAPTER12_CONCEPT_FAMILY_IDS) {
      expect(provider.getQuestionsForConcept(conceptId)).toHaveLength(5)
      expect(provider.getQuestionsForConcept(conceptId).every((id) => id.startsWith('r12-'))).toBe(true)
    }
  })
})
