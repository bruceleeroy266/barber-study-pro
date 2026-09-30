import { describe, expect, it } from 'vitest'
import { chapter19PremiumContent } from '../chapter-19-premium-content'
import { chapter19PremiumFlashcards } from '../chapter-19-premium-flashcards'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import { chapter19MicroChecks } from './micro-checks'
import type { Chapter19EvidenceRecord } from './grading'
import { CHAPTER19_CONCEPT_FAMILY_IDS } from './concepts'
import {
  chapter19ReassessmentReserve,
  getChapter19ReassessmentReserve,
} from './reassessment-reserve'
import {
  appendChapter19ReassessmentEvidence,
  buildChapter19ReassessmentEvidence,
  calculateChapter19RecoveredMastery,
  CHAPTER19_REMEDIATION_RULES,
  scoreChapter19ReassessmentCycle,
  selectChapter19ReassessmentQuestions,
} from './targeted-remediation'
import {
  evaluateChapter19ComplianceIntervention,
  evaluateChapter19SafetyIntervention,
  getChapter19RequiredReassessmentPassPercent,
} from './escalation'
import {
  getCanonicalMappingProvider,
  hasCanonicalMappingProvider,
  initializeChapter19DetectionProvider,
  resetDetectionProviderRegistry,
} from '@/lib/reassessment/provider-registry'
import {
  getChapterContentProvider,
  hasChapterContentProvider,
} from '@/lib/remediation/content-provider-registry'
import { createHistoricalExclusionEngine } from '@/lib/reassessment/exclusion-engine'
import type {
  HistoricalQuizAttempt,
  IExclusionDatabaseClient,
  ReassessmentQuestionHistoryRecord,
} from '@/lib/reassessment/types'
import { SHARED_GRADE_WEIGHTS } from '@/lib/concept-mastery/shared-grading'

const evidence = (
  conceptFamilyId: Chapter19EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter19EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter19EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-30T16:30:00.000Z',
): Chapter19EvidenceRecord => ({
  studentId: 'student-c19',
  chapterId: 'ch-19',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C19-7 fresh reassessment reserve', () => {
  it('preserves the certified 1-shell / 60 / 15 / 14 inventories', () => {
    expect(chapter19PremiumContent.sections).toHaveLength(1)
    expect(chapter19PremiumFlashcards).toHaveLength(60)
    expect(chapter19PremiumQuizQuestions).toHaveLength(15)
    expect(
      chapter19MicroChecks.flatMap((check) => check.questions),
    ).toHaveLength(14)
  })

  it('provides exactly 35 fresh questions, five per canonical concept family', () => {
    expect(chapter19ReassessmentReserve).toHaveLength(35)
    expect(
      new Set(chapter19ReassessmentReserve.map((question) => question.id)).size,
    ).toBe(35)

    for (const conceptFamilyId of CHAPTER19_CONCEPT_FAMILY_IDS) {
      const questions = getChapter19ReassessmentReserve(conceptFamilyId)
      expect(questions, conceptFamilyId).toHaveLength(5)
      expect(
        questions.every(
          (question) => question.conceptFamilyId === conceptFamilyId,
        ),
        conceptFamilyId,
      ).toBe(true)
      expect(
        questions.every((question) =>
          ['understanding', 'application', 'scenario'].includes(
            question.difficulty,
          ),
        ),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('keeps reassessment IDs and prompts separate from assessment and micro-check namespaces', () => {
    const assessmentIds = new Set(
      chapter19PremiumQuizQuestions.map((question) => question.id),
    )
    const microIds = new Set(
      chapter19MicroChecks.flatMap((check) =>
        check.questions.map((question) => question.id),
      ),
    )
    const assessmentPrompts = new Set(
      chapter19PremiumQuizQuestions.map((question) => question.question),
    )
    const microPrompts = new Set(
      chapter19MicroChecks.flatMap((check) =>
        check.questions.map((question) => question.question),
      ),
    )

    for (const question of chapter19ReassessmentReserve) {
      expect(question.id.startsWith('r19-'), question.id).toBe(true)
      expect(assessmentIds.has(question.id as never), question.id).toBe(false)
      expect(microIds.has(question.id as never), question.id).toBe(false)
      expect(assessmentPrompts.has(question.question), question.id).toBe(false)
      expect(microPrompts.has(question.question), question.id).toBe(false)
    }
  })

  it('keeps every reassessment item structurally valid, non-recall, and canonically tagged', () => {
    const expectedLoByConcept = {
      'ch19-licensing-requirements-verification': 'LO-19-01',
      'ch19-exam-preparation-test-reasoning': 'LO-19-02',
      'ch19-practical-exam-safety-readiness': 'LO-19-03',
      'ch19-employment-readiness-professionalism': 'LO-19-04',
      'ch19-resume-portfolio-application-materials': 'LO-19-05',
      'ch19-job-search-shop-research-interview': 'LO-19-06',
      'ch19-employment-law-contracts-compliance': 'LO-19-07',
    } as const

    for (const question of chapter19ReassessmentReserve) {
      const choices = [
        question.answer_a,
        question.answer_b,
        question.answer_c,
        question.answer_d,
      ]
      expect(choices.every((choice) => choice.trim().length > 0), question.id).toBe(true)
      expect(new Set(choices).size, question.id).toBe(4)
      expect(['a', 'b', 'c', 'd'], question.id).toContain(question.correctAnswer)
      expect(question.explanation.trim().length, question.id).toBeGreaterThan(0)
      expect(question.difficulty, question.id).not.toBe('recall')
      expect(question.learningObjectiveId, question.id).toBe(
        expectedLoByConcept[question.conceptFamilyId],
      )
    }
  })

  it('selects exactly five unique reserve questions per concept when none are excluded', () => {
    for (const conceptFamilyId of CHAPTER19_CONCEPT_FAMILY_IDS) {
      const selected = selectChapter19ReassessmentQuestions(
        conceptFamilyId,
        chapter19ReassessmentReserve,
      )
      expect(selected).toHaveLength(5)
      expect(new Set(selected).size).toBe(5)
      expect(selected.every((id) => id.startsWith('r19-'))).toBe(true)
    }
  })
})

describe('C19-7 ordinary/compliance versus urgent-safety recovery', () => {
  it('passes ordinary recovery at 4/5 = 80 percent', () => {
    const conceptFamilyId = 'ch19-exam-preparation-test-reasoning'
    const selected = getChapter19ReassessmentReserve(conceptFamilyId)
    const cycle = scoreChapter19ReassessmentCycle({
      cycleId: 'c19-ordinary',
      conceptFamilyId,
      selectedQuestionIds: selected.map((question) => question.id),
      responses: selected.map((question, index) => ({
        questionId: question.id,
        correct: index < 4,
      })),
      passPercent: 80,
    })

    expect(cycle.correctCount).toBe(4)
    expect(cycle.percent).toBe(80)
    expect(cycle.passed).toBe(true)
  })

  it('keeps elevated compliance recovery at 4/5 = 80 percent', () => {
    const complianceEvidence = [
      evidence(
        'ch19-licensing-requirements-verification',
        'mcq-19-001',
        false,
        'micro_check',
        'application',
        '2026-09-30T16:31:00.000Z',
      ),
      evidence(
        'ch19-licensing-requirements-verification',
        'qq-19-01',
        false,
        'chapter_assessment',
        'application',
        '2026-09-30T16:32:00.000Z',
      ),
    ]
    const intervention =
      evaluateChapter19ComplianceIntervention(complianceEvidence)
    expect(intervention.level).toBe('elevated')
    expect(intervention.reassessmentPassPercent).toBe(80)
    expect(
      getChapter19RequiredReassessmentPassPercent(
        complianceEvidence,
        'ch19-licensing-requirements-verification',
      ),
    ).toBe(80)

    const selected = getChapter19ReassessmentReserve(
      'ch19-licensing-requirements-verification',
    )
    const cycle = scoreChapter19ReassessmentCycle({
      cycleId: 'c19-compliance',
      conceptFamilyId: 'ch19-licensing-requirements-verification',
      selectedQuestionIds: selected.map((question) => question.id),
      responses: selected.map((question, index) => ({
        questionId: question.id,
        correct: index < 4,
      })),
      passPercent: 80,
    })
    expect(cycle.passed).toBe(true)
  })

  it('requires 5/5 for urgent practical-safety recovery', () => {
    const urgentEvidence = [
      evidence(
        'ch19-practical-exam-safety-readiness',
        'mcq-19-006',
        false,
        'micro_check',
        'application',
        '2026-09-30T16:33:00.000Z',
      ),
      evidence(
        'ch19-practical-exam-safety-readiness',
        'qq-19-03',
        false,
        'chapter_assessment',
        'application',
        '2026-09-30T16:34:00.000Z',
      ),
    ]
    const intervention = evaluateChapter19SafetyIntervention(urgentEvidence)
    expect(intervention.level).toBe('urgent')
    expect(intervention.reassessmentQuestionCount).toBe(5)
    expect(intervention.reassessmentPassPercent).toBe(100)

    const conceptFamilyId = 'ch19-practical-exam-safety-readiness'
    expect(
      getChapter19RequiredReassessmentPassPercent(
        urgentEvidence,
        conceptFamilyId,
      ),
    ).toBe(100)

    const selected = getChapter19ReassessmentReserve(conceptFamilyId)
    const four = scoreChapter19ReassessmentCycle({
      cycleId: 'c19-urgent-4',
      conceptFamilyId,
      selectedQuestionIds: selected.map((question) => question.id),
      responses: selected.map((question, index) => ({
        questionId: question.id,
        correct: index < 4,
      })),
      passPercent: 100,
    })
    const five = scoreChapter19ReassessmentCycle({
      cycleId: 'c19-urgent-5',
      conceptFamilyId,
      selectedQuestionIds: selected.map((question) => question.id),
      responses: selected.map((question) => ({
        questionId: question.id,
        correct: true,
      })),
      passPercent: 100,
    })

    expect(four.percent).toBe(80)
    expect(four.passed).toBe(false)
    expect(five.percent).toBe(100)
    expect(five.passed).toBe(true)
  })

  it('locks ordinary/compliance to 80 and urgent safety to 100 with five questions', () => {
    expect(CHAPTER19_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER19_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER19_REMEDIATION_RULES.complianceReassessmentQuestionCount).toBe(5)
    expect(CHAPTER19_REMEDIATION_RULES.complianceReassessmentPassPercent).toBe(80)
    expect(CHAPTER19_REMEDIATION_RULES.urgentSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER19_REMEDIATION_RULES.urgentSafetyReassessmentPassPercent).toBe(100)
  })
})

describe('C19-7 immutable mastery recovery', () => {
  it('builds reassessment evidence with remediation_reassessment / reassessment semantics', () => {
    const conceptFamilyId = 'ch19-resume-portfolio-application-materials'
    const selected = getChapter19ReassessmentReserve(conceptFamilyId)
    const records = buildChapter19ReassessmentEvidence({
      studentId: 'student-c19',
      conceptFamilyId,
      selectedQuestions: selected,
      responses: selected.map((question) => ({
        questionId: question.id,
        correct: true,
      })),
      timestamp: '2026-09-30T16:40:00.000Z',
    })

    expect(records).toHaveLength(5)
    expect(records.every((record) => record.chapterId === 'ch-19')).toBe(true)
    expect(
      records.every((record) => record.source === 'remediation_reassessment'),
    ).toBe(true)
    expect(
      records.every((record) => record.attemptPhase === 'reassessment'),
    ).toBe(true)
  })

  it('raises mastery after successful reassessment without erasing original misses', () => {
    const conceptFamilyId = 'ch19-employment-law-contracts-compliance'
    const original = [
      evidence(
        conceptFamilyId,
        'mcq-19-013',
        false,
        'micro_check',
        'application',
        '2026-09-30T16:41:00.000Z',
      ),
      evidence(
        conceptFamilyId,
        'qq-19-14',
        false,
        'chapter_assessment',
        'application',
        '2026-09-30T16:42:00.000Z',
      ),
      evidence(
        conceptFamilyId,
        'fc-ch19-058',
        true,
        'flashcard',
        'understanding',
        '2026-09-30T16:43:00.000Z',
      ),
    ]
    const selected = getChapter19ReassessmentReserve(conceptFamilyId)
    const reassessment = buildChapter19ReassessmentEvidence({
      studentId: 'student-c19',
      conceptFamilyId,
      selectedQuestions: selected,
      responses: selected.map((question) => ({
        questionId: question.id,
        correct: true,
      })),
      timestamp: '2026-09-30T16:50:00.000Z',
    })

    const recovered = calculateChapter19RecoveredMastery(
      original,
      reassessment,
      conceptFamilyId,
      '2026-09-30T16:51:00.000Z',
    )

    expect(recovered.originalEvidencePreserved).toBe(true)
    expect(recovered.after.mastery).toBeGreaterThan(recovered.before.mastery)
    expect(recovered.after.initialMissCount).toBe(recovered.before.initialMissCount)
    expect(recovered.after.initialMissCount).toBe(2)
    expect(recovered.after.reassessmentCorrectCount).toBe(5)
    expect(recovered.combinedEvidence.slice(0, original.length)).toEqual(original)
  })

  it('deduplicates replayed reassessment evidence instead of rewriting history', () => {
    const conceptFamilyId = 'ch19-job-search-shop-research-interview'
    const original = [evidence(conceptFamilyId, 'qq-19-11', false)]
    const selected = getChapter19ReassessmentReserve(conceptFamilyId)
    const reassessment = buildChapter19ReassessmentEvidence({
      studentId: 'student-c19',
      conceptFamilyId,
      selectedQuestions: selected,
      responses: selected.map((question) => ({
        questionId: question.id,
        correct: true,
      })),
      timestamp: '2026-09-30T16:55:00.000Z',
    })

    const once = appendChapter19ReassessmentEvidence(original, reassessment)
    const twice = appendChapter19ReassessmentEvidence(once, reassessment)

    expect(once).toHaveLength(6)
    expect(twice).toHaveLength(6)
    expect(twice[0]).toEqual(original[0])
  })
})

describe('C19-7 exclusion and replay protection', () => {
  it('excludes already-attempted reserve questions during direct cycle selection', () => {
    const conceptFamilyId = 'ch19-job-search-shop-research-interview'
    const reserve = getChapter19ReassessmentReserve(conceptFamilyId)
    const excluded = new Set([reserve[0].id])

    expect(() =>
      selectChapter19ReassessmentQuestions(
        conceptFamilyId,
        chapter19ReassessmentReserve,
        5,
        excluded,
      ),
    ).toThrow(/requires at least 5 fresh non-excluded questions/)
  })

  it('shared historical exclusion engine blocks replayed reserve questions', async () => {
    const conceptId = 'ch19-licensing-requirements-verification'
    const reserve = getChapter19ReassessmentReserve(conceptId)

    const historicalAttempts: HistoricalQuizAttempt[] = [
      {
        id: 'attempt-1',
        userId: 'student-c19',
        quizId: 'quiz-19',
        answersJson: { 'qq-19-01': 'b' },
        completedAt: new Date('2026-09-30T16:00:00.000Z'),
      },
    ]
    const reassessmentHistory: ReassessmentQuestionHistoryRecord[] = [
      {
        id: 'hist-1',
        userId: 'student-c19',
        conceptId,
        questionId: reserve[0].id,
        quizAttemptId: 'attempt-r1',
        cycleId: 'cycle-old',
        isCorrect: true,
        attemptedAt: new Date('2026-09-30T16:10:00.000Z'),
      },
    ]

    const db: IExclusionDatabaseClient = {
      async getHistoricalQuizAttempts() {
        return historicalAttempts
      },
      async getReassessmentQuestionHistory() {
        return reassessmentHistory
      },
      async recordQuestionAttempt() {
        return 'record-1'
      },
      async checkAndRecordPoolExhaustion() {
        return 'exhaust-1'
      },
    }

    const engine = createHistoricalExclusionEngine(db, 'ch-19')
    const exclusion = await engine.computeExclusionSet(
      'student-c19',
      conceptId,
    )

    expect(exclusion.historicalQuestionIds.has('qq-19-01')).toBe(true)
    expect(
      exclusion.reassessmentHistoryQuestionIds.has(reserve[0].id),
    ).toBe(true)
    expect(exclusion.combinedExclusionSet.has(reserve[0].id)).toBe(true)
    expect(
      await engine.isQuestionEligible(
        'student-c19',
        conceptId,
        reserve[0].id,
      ),
    ).toBe(false)

    const selected = await engine.selectReassessmentQuestion(
      'student-c19',
      conceptId,
      'cycle-new',
    )
    expect(selected.success).toBe(true)
    expect(selected.selectedQuestionId).not.toBe(reserve[0].id)
  })
})

describe('C19-7 shared reassessment/remediation providers', () => {
  it('registers a canonical mapping provider serving exactly five reserve questions per concept', () => {
    expect(hasCanonicalMappingProvider('ch-19')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-19')

    for (const conceptFamilyId of CHAPTER19_CONCEPT_FAMILY_IDS) {
      const ids = provider.getQuestionsForConcept(conceptFamilyId)
      expect(ids, conceptFamilyId).toHaveLength(5)
      expect(
        ids.every((id) => id.startsWith('r19-')),
        conceptFamilyId,
      ).toBe(true)
      expect(
        ids.every((id) =>
          provider.isQuestionMappedToConcept(id, conceptFamilyId),
        ),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('serves fresh reassessment items through the shared remediation content provider', () => {
    expect(hasChapterContentProvider('ch-19')).toBe(true)
    const provider = getChapterContentProvider('ch-19')!

    for (const conceptFamilyId of CHAPTER19_CONCEPT_FAMILY_IDS) {
      expect(
        provider.getContentBlockIdsForConcept(conceptFamilyId),
        conceptFamilyId,
      ).toEqual(['chapter-19-lesson'])
      expect(
        provider.getFlashcardIdsForConcept(conceptFamilyId).length,
        conceptFamilyId,
      ).toBeGreaterThan(0)

      for (const question of getChapter19ReassessmentReserve(conceptFamilyId)) {
        const served = provider.getQuizQuestionById(question.id)
        expect(served, question.id).toBeTruthy()
        expect(served?.id, question.id).toBe(question.id)
      }
    }
  })

  it('initializes Chapter 19 reassessment-aware detection with initial and reserve mappings', () => {
    resetDetectionProviderRegistry()
    const provider = initializeChapter19DetectionProvider({
      fetchQuizAttempts: async () => [],
    })

    expect(provider.chapterId).toBe('ch-19')
    expect(
      provider.isValidConcept('ch19-practical-exam-safety-readiness'),
    ).toBe(true)
    expect(provider.isValidConcept('not-a-c19-concept')).toBe(false)
  })

  it('keeps the shared 20/10/40/15/15 grade contract unchanged', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })
})
