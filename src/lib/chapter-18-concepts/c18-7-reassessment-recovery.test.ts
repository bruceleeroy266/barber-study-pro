import { describe, expect, it } from 'vitest'
import { chapter18PremiumContent } from '../chapter-18-premium'
import { chapter18PremiumFlashcards } from '../chapter-18-premium-flashcards'
import { chapter18PremiumQuizQuestions } from '../chapter-18-premium-quiz'
import { chapter18MicroChecks } from './micro-checks'
import type { Chapter18EvidenceRecord } from './grading'
import { CHAPTER18_CONCEPT_FAMILY_IDS } from './concepts'
import {
  chapter18ReassessmentReserve,
  getChapter18ReassessmentReserve,
} from './reassessment-reserve'
import {
  appendChapter18ReassessmentEvidence,
  buildChapter18ReassessmentEvidence,
  calculateChapter18RecoveredMastery,
  CHAPTER18_REMEDIATION_RULES,
  scoreChapter18ReassessmentCycle,
  selectChapter18ReassessmentQuestions,
} from './targeted-remediation'
import {
  evaluateChapter18SafetyIntervention,
  getChapter18RequiredReassessmentPassPercent,
} from './safety-intervention'
import {
  getCanonicalMappingProvider,
  hasCanonicalMappingProvider,
  initializeChapter18DetectionProvider,
  resetDetectionProviderRegistry,
} from '@/lib/reassessment/provider-registry'
import {
  getChapterContentProvider,
  hasChapterContentProvider,
} from '@/lib/remediation/content-provider-registry'
import { SHARED_GRADE_WEIGHTS } from '@/lib/concept-mastery/shared-grading'

const evidence = (
  conceptFamilyId: Chapter18EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter18EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter18EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-30T03:30:00.000Z',
): Chapter18EvidenceRecord => ({
  studentId: 'student-c18',
  chapterId: 'ch-18',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C18-7 fresh reassessment reserve', () => {
  it('preserves the certified 1-shell / 50 / 15 / 14 inventories', () => {
    expect(chapter18PremiumContent.sections).toHaveLength(1)
    expect(chapter18PremiumFlashcards).toHaveLength(50)
    expect(chapter18PremiumQuizQuestions).toHaveLength(15)
    expect(chapter18MicroChecks.flatMap((check) => check.questions)).toHaveLength(14)
  })

  it('provides exactly 35 fresh questions, five per canonical concept family', () => {
    expect(chapter18ReassessmentReserve).toHaveLength(35)
    expect(new Set(chapter18ReassessmentReserve.map((question) => question.id)).size).toBe(35)

    for (const conceptFamilyId of CHAPTER18_CONCEPT_FAMILY_IDS) {
      const questions = getChapter18ReassessmentReserve(conceptFamilyId)
      expect(questions, conceptFamilyId).toHaveLength(5)
      expect(questions.every((question) => question.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(
        questions.every((question) => ['understanding', 'application', 'scenario'].includes(question.difficulty)),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('keeps reassessment IDs and prompts separate from assessment and micro-check namespaces', () => {
    const assessmentIds = new Set(chapter18PremiumQuizQuestions.map((question) => question.id))
    const microIds = new Set(chapter18MicroChecks.flatMap((check) => check.questions.map((question) => question.id)))
    const assessmentPrompts = new Set(chapter18PremiumQuizQuestions.map((question) => question.question))
    const microPrompts = new Set(chapter18MicroChecks.flatMap((check) => check.questions.map((question) => question.question)))
    const reserveIds = chapter18ReassessmentReserve.map((question) => question.id)

    expect(reserveIds.every((id) => id.startsWith('r18-'))).toBe(true)
    expect(reserveIds.some((id) => assessmentIds.has(id as never))).toBe(false)
    expect(reserveIds.some((id) => microIds.has(id as never))).toBe(false)
    expect(chapter18ReassessmentReserve.some((question) => assessmentPrompts.has(question.question))).toBe(false)
    expect(chapter18ReassessmentReserve.some((question) => microPrompts.has(question.question))).toBe(false)
  })

  it('keeps every reassessment question structurally valid and non-recall', () => {
    for (const question of chapter18ReassessmentReserve) {
      const choices = [question.answer_a, question.answer_b, question.answer_c, question.answer_d]
      expect(choices.every((choice) => choice.trim().length > 0), question.id).toBe(true)
      expect(new Set(choices).size, question.id).toBe(4)
      expect(['a','b','c','d'], question.id).toContain(question.correctAnswer)
      expect(question.explanation.trim().length, question.id).toBeGreaterThan(0)
      expect(question.difficulty, question.id).not.toBe('recall')
    }
  })

  it('selects exactly five fresh questions for every concept', () => {
    for (const conceptFamilyId of CHAPTER18_CONCEPT_FAMILY_IDS) {
      const selected = selectChapter18ReassessmentQuestions(
        conceptFamilyId,
        chapter18ReassessmentReserve,
      )
      expect(selected).toHaveLength(5)
      expect(new Set(selected).size).toBe(5)
      expect(selected.every((id) => id.startsWith('r18-'))).toBe(true)
    }
  })
})

describe('C18-7 ordinary and urgent recovery policy', () => {
  it('passes ordinary recovery at 4/5 = 80 percent', () => {
    const conceptFamilyId = 'ch18-color-theory'
    const selected = getChapter18ReassessmentReserve(conceptFamilyId)
    const cycle = scoreChapter18ReassessmentCycle({
      cycleId: 'c18-ordinary',
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

  it('requires 5/5 for urgent multi-hazard safety recovery', () => {
    const urgentEvidence = [
      evidence('ch18-service-safety-chemical-handling','mcq-18-013',false,'micro_check','scenario','2026-09-30T03:31:00.000Z'),
      evidence('ch18-developers-lighteners-toners','mcq-18-008',false,'micro_check','scenario','2026-09-30T03:32:00.000Z'),
    ]
    const intervention = evaluateChapter18SafetyIntervention(urgentEvidence)
    expect(intervention.level).toBe('urgent')
    expect(intervention.reassessmentQuestionCount).toBe(5)
    expect(intervention.reassessmentPassPercent).toBe(100)

    const conceptFamilyId = 'ch18-developers-lighteners-toners'
    expect(getChapter18RequiredReassessmentPassPercent(urgentEvidence, conceptFamilyId)).toBe(100)

    const selected = getChapter18ReassessmentReserve(conceptFamilyId)
    const four = scoreChapter18ReassessmentCycle({
      cycleId: 'c18-urgent-4',
      conceptFamilyId,
      selectedQuestionIds: selected.map((question) => question.id),
      responses: selected.map((question, index) => ({ questionId: question.id, correct: index < 4 })),
      passPercent: 100,
    })
    const five = scoreChapter18ReassessmentCycle({
      cycleId: 'c18-urgent-5',
      conceptFamilyId,
      selectedQuestionIds: selected.map((question) => question.id),
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      passPercent: 100,
    })

    expect(four.percent).toBe(80)
    expect(four.passed).toBe(false)
    expect(five.percent).toBe(100)
    expect(five.passed).toBe(true)
  })

  it('locks policy to ordinary 80 and urgent 100 with five questions', () => {
    expect(CHAPTER18_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER18_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER18_REMEDIATION_RULES.urgentSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER18_REMEDIATION_RULES.urgentSafetyReassessmentPassPercent).toBe(100)
  })
})

describe('C18-7 mastery recovery and immutable diagnostic history', () => {
  it('builds reassessment evidence with remediation_reassessment / reassessment semantics', () => {
    const conceptFamilyId = 'ch18-color-products'
    const selected = getChapter18ReassessmentReserve(conceptFamilyId)
    const records = buildChapter18ReassessmentEvidence({
      studentId: 'student-c18',
      conceptFamilyId,
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-30T03:40:00.000Z',
    })

    expect(records).toHaveLength(5)
    expect(records.every((record) => record.chapterId === 'ch-18')).toBe(true)
    expect(records.every((record) => record.source === 'remediation_reassessment')).toBe(true)
    expect(records.every((record) => record.attemptPhase === 'reassessment')).toBe(true)
  })

  it('raises mastery after successful reassessment while preserving every original miss exactly', () => {
    const conceptFamilyId = 'ch18-developers-lighteners-toners'
    const original = [
      evidence(conceptFamilyId,'mcq-18-008',false,'micro_check','scenario','2026-09-30T03:50:00.000Z'),
      evidence(conceptFamilyId,'qq-18-05',false,'chapter_assessment','application','2026-09-30T03:51:00.000Z'),
      evidence(conceptFamilyId,'fc-ch18-023',true,'flashcard','understanding','2026-09-30T03:52:00.000Z'),
    ]
    const selected = getChapter18ReassessmentReserve(conceptFamilyId)
    const reassessment = buildChapter18ReassessmentEvidence({
      studentId: 'student-c18',
      conceptFamilyId,
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-30T04:00:00.000Z',
    })

    const recovered = calculateChapter18RecoveredMastery(
      original,
      reassessment,
      conceptFamilyId,
      '2026-09-30T04:01:00.000Z',
    )

    expect(recovered.originalEvidencePreserved).toBe(true)
    expect(recovered.after.mastery).toBeGreaterThan(recovered.before.mastery)
    expect(recovered.after.initialMissCount).toBe(recovered.before.initialMissCount)
    expect(recovered.after.initialMissCount).toBe(2)
    expect(recovered.after.reassessmentCorrectCount).toBe(5)
    expect(recovered.combinedEvidence.slice(0, original.length)).toEqual(original)
  })

  it('does not duplicate identical reassessment evidence when appended twice', () => {
    const conceptFamilyId = 'ch18-correction-gray-porosity'
    const original = [evidence(conceptFamilyId,'qq-18-15',false)]
    const selected = getChapter18ReassessmentReserve(conceptFamilyId)
    const reassessment = buildChapter18ReassessmentEvidence({
      studentId: 'student-c18',
      conceptFamilyId,
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-30T04:10:00.000Z',
    })

    const once = appendChapter18ReassessmentEvidence(original, reassessment)
    const twice = appendChapter18ReassessmentEvidence(once, reassessment)

    expect(once).toHaveLength(6)
    expect(twice).toHaveLength(6)
    expect(twice[0]).toEqual(original[0])
  })
})

describe('C18-7 shared reassessment/remediation providers', () => {
  it('registers a canonical mapping provider serving exactly five reserve questions per concept', () => {
    expect(hasCanonicalMappingProvider('ch-18')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-18')

    for (const conceptFamilyId of CHAPTER18_CONCEPT_FAMILY_IDS) {
      const ids = provider.getQuestionsForConcept(conceptFamilyId)
      expect(ids, conceptFamilyId).toHaveLength(5)
      expect(ids.every((id) => id.startsWith('r18-')), conceptFamilyId).toBe(true)
      expect(ids.every((id) => provider.isQuestionMappedToConcept(id, conceptFamilyId)), conceptFamilyId).toBe(true)
    }
  })

  it('serves fresh reassessment items through the shared remediation content provider', () => {
    expect(hasChapterContentProvider('ch-18')).toBe(true)
    const provider = getChapterContentProvider('ch-18')!

    for (const conceptFamilyId of CHAPTER18_CONCEPT_FAMILY_IDS) {
      expect(provider.getContentBlockIdsForConcept(conceptFamilyId), conceptFamilyId).toEqual(['chapter-18-lesson'])
      expect(provider.getFlashcardIdsForConcept(conceptFamilyId).length, conceptFamilyId).toBeGreaterThan(0)
      const reserve = getChapter18ReassessmentReserve(conceptFamilyId)
      for (const question of reserve) {
        expect(provider.getQuizQuestionById(question.id), question.id).toBeTruthy()
      }
    }
  })

  it('initializes Chapter 18 reassessment-aware detection with initial and reserve mappings', () => {
    resetDetectionProviderRegistry()
    const provider = initializeChapter18DetectionProvider({
      fetchQuizAttempts: async () => [],
    })
    expect(provider.chapterId).toBe('ch-18')
    expect(provider.isValidConcept('ch18-service-safety-chemical-handling')).toBe(true)
    expect(provider.isValidConcept('not-a-c18-concept')).toBe(false)
  })

  it('keeps the shared 20/10/40/15/15 grade contract unchanged', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })
})
