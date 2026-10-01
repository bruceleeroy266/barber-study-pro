import { describe, expect, it } from 'vitest'
import { chapter21PremiumQuizQuestions } from '../chapter-21-premium-quiz'
import { chapter21MicroChecks } from './micro-checks'
import {
  CHAPTER21_CONCEPT_FAMILY_IDS,
  CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter21ReassessmentReserve,
  getChapter21ReassessmentReserve,
} from './reassessment-reserve'
import {
  CHAPTER21_REMEDIATION_RULES,
  appendChapter21ReassessmentEvidence,
  buildChapter21ReassessmentEvidence,
  calculateChapter21RecoveredMastery,
  scoreChapter21ReassessmentCycle,
  selectChapter21ReassessmentQuestions,
} from './targeted-remediation'
import type { Chapter21EvidenceRecord } from './grading'
import {
  getCanonicalMappingProvider,
  hasCanonicalMappingProvider,
  initializeChapter21DetectionProvider,
  resetDetectionProviderRegistry,
} from '../reassessment/provider-registry'
import { getChapterContentProvider } from '../remediation/content-provider-registry'

const initialPrompts = new Set(
  chapter21PremiumQuizQuestions.map((question) =>
    question.question.trim().toLowerCase(),
  ),
)
const microPrompts = new Set(
  chapter21MicroChecks
    .flatMap((check) => check.questions)
    .map((question) => question.question.trim().toLowerCase()),
)

const referenceTime = '2026-10-01T02:00:00.000Z'

describe('C21-7 fresh reassessment reserve and mastery recovery', () => {
  it('creates exactly 40 fresh reassessment questions with five per canonical family', () => {
    expect(chapter21ReassessmentReserve).toHaveLength(40)
    expect(
      new Set(chapter21ReassessmentReserve.map((question) => question.id)).size,
    ).toBe(40)

    for (const conceptFamilyId of CHAPTER21_CONCEPT_FAMILY_IDS) {
      const rows = getChapter21ReassessmentReserve(conceptFamilyId)
      expect(rows, conceptFamilyId).toHaveLength(5)
      expect(
        rows.every(
          (question) => question.conceptFamilyId === conceptFamilyId,
        ),
      ).toBe(true)
    }
  })

  it('keeps reassessment IDs and prompts fresh from both initial assessment and micro-check banks', () => {
    const initialIds = new Set(
      chapter21PremiumQuizQuestions.map((question) => question.id),
    )
    const microIds = new Set(
      chapter21MicroChecks.flatMap((check) =>
        check.questions.map((question) => question.id),
      ),
    )

    for (const question of chapter21ReassessmentReserve) {
      const prompt = question.question.trim().toLowerCase()
      expect(question.id.startsWith('r21-')).toBe(true)
      expect(initialIds.has(question.id)).toBe(false)
      expect(microIds.has(question.id)).toBe(false)
      expect(initialPrompts.has(prompt), question.id).toBe(false)
      expect(microPrompts.has(prompt), question.id).toBe(false)
      expect(['understanding', 'application', 'scenario']).toContain(
        question.difficulty,
      )
    }
  })

  it('selects exactly five concept-filtered questions and fails closed when freshness is exhausted', () => {
    const concept = 'ch21-recordkeeping-financial-compliance'
    const selected = selectChapter21ReassessmentQuestions(
      concept,
      chapter21ReassessmentReserve,
    )

    expect(selected).toHaveLength(5)
    expect(new Set(selected).size).toBe(5)
    expect(
      selected.every((id) =>
        getChapter21ReassessmentReserve(concept).some(
          (question) => question.id === id,
        ),
      ),
    ).toBe(true)

    expect(() =>
      selectChapter21ReassessmentQuestions(
        concept,
        chapter21ReassessmentReserve,
        5,
        new Set([selected[0]]),
      ),
    ).toThrow(/requires at least 5 fresh non-excluded questions/)
  })

  it('locks both ordinary and compliance recovery to five questions at 80 percent', () => {
    expect(CHAPTER21_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(
      5,
    )
    expect(CHAPTER21_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(
      80,
    )
    expect(
      CHAPTER21_REMEDIATION_RULES.complianceReassessmentQuestionCount,
    ).toBe(5)
    expect(
      CHAPTER21_REMEDIATION_RULES.complianceReassessmentPassPercent,
    ).toBe(80)

    const selected = getChapter21ReassessmentReserve(
      'ch21-booth-rental-independent-business-responsibilities',
    ).map((question) => question.id)

    const pass = scoreChapter21ReassessmentCycle({
      cycleId: 'cycle-pass',
      conceptFamilyId:
        'ch21-booth-rental-independent-business-responsibilities',
      selectedQuestionIds: selected,
      responses: selected.map((questionId, index) => ({
        questionId,
        correct: index < 4,
      })),
    })
    expect(pass.correctCount).toBe(4)
    expect(pass.percent).toBe(80)
    expect(pass.passed).toBe(true)

    const fail = scoreChapter21ReassessmentCycle({
      cycleId: 'cycle-fail',
      conceptFamilyId:
        'ch21-booth-rental-independent-business-responsibilities',
      selectedQuestionIds: selected,
      responses: selected.map((questionId, index) => ({
        questionId,
        correct: index < 3,
      })),
    })
    expect(fail.percent).toBe(60)
    expect(fail.passed).toBe(false)
  })

  it('builds reassessment evidence using reassessment semantics only', () => {
    const selected = getChapter21ReassessmentReserve(
      'ch21-business-plan-financial-planning',
    )

    const rows = buildChapter21ReassessmentEvidence({
      studentId: 'student-c21',
      conceptFamilyId: 'ch21-business-plan-financial-planning',
      selectedQuestions: selected,
      responses: selected.map((question) => ({
        questionId: question.id,
        correct: true,
      })),
      timestamp: referenceTime,
    })

    expect(rows).toHaveLength(5)
    expect(
      rows.every(
        (row) =>
          row.chapterId === 'ch-21' &&
          row.source === 'remediation_reassessment' &&
          row.attemptPhase === 'reassessment',
      ),
    ).toBe(true)
  })

  it('appends recovery evidence without erasing or rewriting original misses', () => {
    const original: Chapter21EvidenceRecord[] = [
      {
        studentId: 'student-c21',
        chapterId: 'ch-21',
        conceptFamilyId: 'ch21-recordkeeping-financial-compliance',
        source: 'chapter_assessment',
        itemId: 'qq-21-09',
        difficulty: 'application',
        correct: false,
        attemptPhase: 'initial',
        timestamp: '2026-10-01T01:00:00.000Z',
      },
      {
        studentId: 'student-c21',
        chapterId: 'ch-21',
        conceptFamilyId: 'ch21-recordkeeping-financial-compliance',
        source: 'micro_check',
        itemId: 'mcq-21-009',
        difficulty: 'application',
        correct: false,
        attemptPhase: 'initial',
        timestamp: '2026-10-01T01:05:00.000Z',
      },
    ]

    const selected = getChapter21ReassessmentReserve(
      'ch21-recordkeeping-financial-compliance',
    )
    const recovery = buildChapter21ReassessmentEvidence({
      studentId: 'student-c21',
      conceptFamilyId: 'ch21-recordkeeping-financial-compliance',
      selectedQuestions: selected,
      responses: selected.map((question) => ({
        questionId: question.id,
        correct: true,
      })),
      timestamp: referenceTime,
    })

    const combined = appendChapter21ReassessmentEvidence(
      original,
      recovery,
    )
    expect(combined).toHaveLength(7)
    expect(combined.slice(0, original.length)).toEqual(original)
    expect(combined[0].correct).toBe(false)
    expect(combined[1].correct).toBe(false)
  })

  it('allows successful reassessment to raise mastery while preserving diagnostic history', () => {
    const original: Chapter21EvidenceRecord[] = [
      {
        studentId: 'student-c21',
        chapterId: 'ch-21',
        conceptFamilyId: 'ch21-advertising-marketing-client-consent',
        source: 'chapter_assessment',
        itemId: 'qq-21-14',
        difficulty: 'application',
        correct: false,
        attemptPhase: 'initial',
        timestamp: '2026-10-01T00:30:00.000Z',
      },
      {
        studentId: 'student-c21',
        chapterId: 'ch-21',
        conceptFamilyId: 'ch21-advertising-marketing-client-consent',
        source: 'micro_check',
        itemId: 'mcq-21-015',
        difficulty: 'application',
        correct: false,
        attemptPhase: 'initial',
        timestamp: '2026-10-01T00:40:00.000Z',
      },
    ]

    const selected = getChapter21ReassessmentReserve(
      'ch21-advertising-marketing-client-consent',
    )
    const recovery = buildChapter21ReassessmentEvidence({
      studentId: 'student-c21',
      conceptFamilyId: 'ch21-advertising-marketing-client-consent',
      selectedQuestions: selected,
      responses: selected.map((question) => ({
        questionId: question.id,
        correct: true,
      })),
      timestamp: referenceTime,
    })

    const result = calculateChapter21RecoveredMastery(
      original,
      recovery,
      'ch21-advertising-marketing-client-consent',
      referenceTime,
    )

    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.combinedEvidence.slice(0, 2)).toEqual(original)
    expect(result.combinedEvidence).toHaveLength(7)
  })

  it('registers the canonical shared reassessment mapping provider with exactly five reserve questions per concept', () => {
    expect(hasCanonicalMappingProvider('ch-21')).toBe(true)

    const provider = getCanonicalMappingProvider('ch-21')
    expect(provider.chapterId).toBe('ch-21')
    expect(provider.getAllConceptIds()).toHaveLength(8)
    expect(provider.getAllQuestionIds()).toHaveLength(57)

    for (const conceptFamilyId of CHAPTER21_CONCEPT_FAMILY_IDS) {
      expect(provider.getQuestionsForConcept(conceptFamilyId)).toHaveLength(5)
    }
  })

  it('registers a Chapter 21 reassessment detection provider through the shared runtime', async () => {
    resetDetectionProviderRegistry()

    const provider = initializeChapter21DetectionProvider({
      fetchQuizAttempts: async () => [],
    })

    expect(provider.chapterId).toBe('ch-21')
    expect(
      provider.isValidConcept('ch21-business-entry-paths'),
    ).toBe(true)
    expect(provider.isValidConcept('unknown-concept')).toBe(false)
  })

  it('exposes reserve questions through the shared remediation content provider', () => {
    const provider = getChapterContentProvider('ch-21')
    expect(provider?.chapterId).toBe('ch-21')

    const reserveQuestion = chapter21ReassessmentReserve[0]
    expect(provider?.getQuizQuestionById(reserveQuestion.id)?.id).toBe(
      reserveQuestion.id,
    )
    expect(
      provider?.getConceptQuestionCount(
        reserveQuestion.conceptFamilyId,
      ),
    ).toBeGreaterThanOrEqual(5)
  })

  it('keeps Chapter 21 outside bodily-safety 100 percent recovery rules', () => {
    expect(CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
    expect(
      chapter21ReassessmentReserve.every(
        (question) => !question.id.startsWith('safety-'),
      ),
    ).toBe(true)
  })
})
