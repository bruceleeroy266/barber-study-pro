import { describe, expect, it } from 'vitest'
import { chapter20PremiumQuizQuestions } from '../chapter-20-premium-quiz'
import { chapter20MicroChecks } from './micro-checks'
import {
  CHAPTER20_CONCEPT_FAMILY_IDS,
  CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter20ReassessmentReserve,
  getChapter20ReassessmentReserve,
} from './reassessment-reserve'
import {
  CHAPTER20_REMEDIATION_RULES,
  appendChapter20ReassessmentEvidence,
  buildChapter20ReassessmentEvidence,
  calculateChapter20RecoveredMastery,
  scoreChapter20ReassessmentCycle,
  selectChapter20ReassessmentQuestions,
} from './targeted-remediation'
import type { Chapter20EvidenceRecord } from './grading'
import {
  getCanonicalMappingProvider,
  hasCanonicalMappingProvider,
  initializeChapter20DetectionProvider,
  resetDetectionProviderRegistry,
} from '../reassessment/provider-registry'
import { getChapterContentProvider } from '../remediation/content-provider-registry'

const initialPrompts = new Set(
  chapter20PremiumQuizQuestions.map((question) => question.question.trim().toLowerCase()),
)
const microPrompts = new Set(
  chapter20MicroChecks
    .flatMap((check) => check.questions)
    .map((question) => question.question.trim().toLowerCase()),
)

const referenceTime = '2026-09-30T22:00:00.000Z'

describe('C20-7 fresh reassessment reserve and mastery recovery', () => {
  it('creates exactly 30 fresh reassessment questions with five per canonical family', () => {
    expect(chapter20ReassessmentReserve).toHaveLength(30)
    expect(new Set(chapter20ReassessmentReserve.map((question) => question.id)).size).toBe(30)

    for (const conceptFamilyId of CHAPTER20_CONCEPT_FAMILY_IDS) {
      expect(getChapter20ReassessmentReserve(conceptFamilyId)).toHaveLength(5)
    }
  })

  it('keeps reassessment IDs and prompts isolated from assessment and micro-check namespaces', () => {
    const initialIds = new Set(chapter20PremiumQuizQuestions.map((question) => question.id))
    const microIds = new Set(
      chapter20MicroChecks.flatMap((check) => check.questions.map((question) => question.id)),
    )

    for (const question of chapter20ReassessmentReserve) {
      expect(question.id.startsWith('r20-')).toBe(true)
      expect(initialIds.has(question.id as never)).toBe(false)
      expect(microIds.has(question.id as never)).toBe(false)
      expect(initialPrompts.has(question.question.trim().toLowerCase())).toBe(false)
      expect(microPrompts.has(question.question.trim().toLowerCase())).toBe(false)
    }
  })

  it('uses non-recall questions and canonical learning objectives throughout the reserve', () => {
    expect(
      chapter20ReassessmentReserve.every((question) =>
        ['understanding', 'application', 'scenario'].includes(question.difficulty),
      ),
    ).toBe(true)
    expect(
      chapter20ReassessmentReserve.every((question) =>
        /^LO-20-0[1-6]$/.test(question.learningObjectiveId),
      ),
    ).toBe(true)
  })

  it('selects exactly five fresh questions and fails closed when exclusions leave too few', () => {
    const concept = 'ch20-employment-classification-compensation'
    const selected = selectChapter20ReassessmentQuestions(
      concept,
      chapter20ReassessmentReserve,
    )
    expect(selected).toHaveLength(5)
    expect(new Set(selected).size).toBe(5)
    expect(selected.every((id) => id.startsWith('r20-classification-'))).toBe(true)

    const excluded = new Set(selected.slice(0, 1))
    expect(() =>
      selectChapter20ReassessmentQuestions(
        concept,
        chapter20ReassessmentReserve,
        5,
        excluded,
      ),
    ).toThrow(/requires at least 5 fresh non-excluded questions/)
  })

  it('requires four of five for both ordinary and compliance recovery', () => {
    const ids = selectChapter20ReassessmentQuestions(
      'ch20-teamwork-workplace-relationships',
      chapter20ReassessmentReserve,
    )

    const passed = scoreChapter20ReassessmentCycle({
      cycleId: 'cycle-ordinary',
      conceptFamilyId: 'ch20-teamwork-workplace-relationships',
      selectedQuestionIds: ids,
      responses: ids.map((questionId, index) => ({
        questionId,
        correct: index < 4,
      })),
    })
    expect(passed.percent).toBe(80)
    expect(passed.passPercent).toBe(80)
    expect(passed.passed).toBe(true)

    const complianceIds = selectChapter20ReassessmentQuestions(
      'ch20-financial-responsibility-income-reporting',
      chapter20ReassessmentReserve,
    )
    const compliancePassed = scoreChapter20ReassessmentCycle({
      cycleId: 'cycle-compliance',
      conceptFamilyId: 'ch20-financial-responsibility-income-reporting',
      selectedQuestionIds: complianceIds,
      responses: complianceIds.map((questionId, index) => ({
        questionId,
        correct: index < 4,
      })),
    })
    expect(compliancePassed.percent).toBe(80)
    expect(compliancePassed.passPercent).toBe(80)
    expect(compliancePassed.passed).toBe(true)

    expect(CHAPTER20_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER20_REMEDIATION_RULES.complianceReassessmentPassPercent).toBe(80)
    expect(CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
  })

  it('preserves every original miss while successful reassessment raises mastery', () => {
    const conceptFamilyId = 'ch20-financial-responsibility-income-reporting'
    const originalEvidence: Chapter20EvidenceRecord[] = [
      {
        studentId: 'student-20',
        chapterId: 'ch-20',
        conceptFamilyId,
        source: 'chapter_assessment',
        itemId: 'qq-20-10',
        difficulty: 'application',
        correct: false,
        attemptPhase: 'initial',
        timestamp: '2026-09-30T20:00:00.000Z',
      },
      {
        studentId: 'student-20',
        chapterId: 'ch-20',
        conceptFamilyId,
        source: 'micro_check',
        itemId: 'mcq-20-007',
        difficulty: 'application',
        correct: false,
        attemptPhase: 'initial',
        timestamp: '2026-09-30T20:01:00.000Z',
      },
    ]

    const selectedQuestions = getChapter20ReassessmentReserve(conceptFamilyId)
    const reassessmentEvidence = buildChapter20ReassessmentEvidence({
      studentId: 'student-20',
      conceptFamilyId,
      selectedQuestions,
      responses: selectedQuestions.map((question) => ({
        questionId: question.id,
        correct: true,
      })),
      timestamp: '2026-09-30T21:00:00.000Z',
    })

    const recovery = calculateChapter20RecoveredMastery(
      originalEvidence,
      reassessmentEvidence,
      conceptFamilyId,
      referenceTime,
    )

    expect(recovery.originalEvidencePreserved).toBe(true)
    expect(recovery.combinedEvidence.slice(0, originalEvidence.length)).toEqual(
      originalEvidence,
    )
    expect(recovery.combinedEvidence).toHaveLength(7)
    expect(recovery.after.mastery).toBeGreaterThan(recovery.before.mastery)
    expect(recovery.after.initialMissCount).toBe(
      recovery.before.initialMissCount,
    )
  })

  it('ignores duplicate reassessment evidence instead of overwriting history', () => {
    const conceptFamilyId = 'ch20-ethical-selling-retailing'
    const question = getChapter20ReassessmentReserve(conceptFamilyId)[0]
    const original: Chapter20EvidenceRecord[] = [
      {
        studentId: 'student-20',
        chapterId: 'ch-20',
        conceptFamilyId,
        source: 'remediation_reassessment',
        itemId: question.id,
        difficulty: question.difficulty,
        correct: false,
        attemptPhase: 'reassessment',
        timestamp: '2026-09-30T20:30:00.000Z',
      },
    ]
    const duplicate: Chapter20EvidenceRecord[] = [
      {
        ...original[0],
        correct: true,
        timestamp: '2026-09-30T21:30:00.000Z',
      },
    ]

    expect(appendChapter20ReassessmentEvidence(original, duplicate)).toEqual(
      original,
    )
  })

  it('registers the Chapter 20 canonical reassessment mapping provider', () => {
    expect(hasCanonicalMappingProvider('ch-20')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-20')
    expect(provider.chapterId).toBe('ch-20')
    expect(provider.getAllConceptIds()).toHaveLength(6)

    const reserveIds = provider.getQuestionsForConcept(
      'ch20-client-retention-marketing-consent',
    )
    expect(reserveIds).toHaveLength(5)
    expect(reserveIds.every((id) => id.startsWith('r20-retention-'))).toBe(true)

    expect(provider.getConceptForQuestion('qq-20-17')).toBe(
      'ch20-client-retention-marketing-consent',
    )
    expect(provider.getConceptForQuestion('r20-retention-001')).toBe(
      'ch20-client-retention-marketing-consent',
    )
  })

  it('registers a Chapter 20 reassessment detection provider on demand', () => {
    resetDetectionProviderRegistry()
    const provider = initializeChapter20DetectionProvider({
      fetchQuizAttempts: async () => [],
    })
    expect(provider.chapterId).toBe('ch-20')
    expect(
      provider.isValidConcept(
        'ch20-employment-classification-compensation',
      ),
    ).toBe(true)
    expect(provider.isValidConcept('not-a-ch20-concept')).toBe(false)
  })

  it('serves reserve questions from the shared remediation content provider', () => {
    const provider = getChapterContentProvider('ch-20')
    expect(provider).toBeDefined()
    expect(provider!.getQuizQuestionById('r20-transition-001')?.id).toBe(
      'r20-transition-001',
    )
    expect(
      provider!.getConceptQuestionCount(
        'ch20-professional-transition-workplace-expectations',
      ),
    ).toBe(8)
  })
})
