import { describe, expect, it } from 'vitest'
import { chapter17PremiumContent } from '../chapter-17-premium'
import { chapter17PremiumFlashcards } from '../chapter-17-premium-flashcards'
import { chapter17PremiumQuizQuestions, chapter17LearningQuestions } from '../chapter-17-premium-quiz'
import { chapter17MicroChecks } from './micro-checks'
import type { Chapter17EvidenceRecord } from './grading'
import { CHAPTER17_CONCEPT_FAMILY_IDS } from './concepts'
import {
  chapter17ReassessmentReserve,
  getChapter17ReassessmentReserve,
} from './reassessment-reserve'
import {
  appendChapter17ReassessmentEvidence,
  buildChapter17ReassessmentEvidence,
  calculateChapter17RecoveredMastery,
  CHAPTER17_REMEDIATION_RULES,
  scoreChapter17ReassessmentCycle,
  selectChapter17ReassessmentQuestions,
} from './targeted-remediation'
import {
  evaluateChapter17SafetyIntervention,
  getChapter17RequiredReassessmentPassPercent,
} from './safety-intervention'
import {
  getCanonicalMappingProvider,
  hasCanonicalMappingProvider,
  initializeChapter17DetectionProvider,
  resetDetectionProviderRegistry,
} from '@/lib/reassessment/provider-registry'
import {
  getChapterContentProvider,
  hasChapterContentProvider,
} from '@/lib/remediation/content-provider-registry'
import { SHARED_GRADE_WEIGHTS } from '@/lib/concept-mastery/shared-grading'

const evidence = (
  conceptFamilyId: Chapter17EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter17EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter17EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-29T23:00:00.000Z',
): Chapter17EvidenceRecord => ({
  studentId: 'student-c17',
  chapterId: 'ch-17',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C17-7 fresh reassessment reserve', () => {
  it('preserves the certified 24/60/30/16 + 14 inventories', () => {
    expect(chapter17PremiumContent.sections).toHaveLength(24)
    expect(chapter17PremiumFlashcards).toHaveLength(60)
    expect(chapter17PremiumQuizQuestions).toHaveLength(30)
    expect(chapter17LearningQuestions).toHaveLength(16)
    expect(chapter17MicroChecks.flatMap((check) => check.questions)).toHaveLength(14)
  })

  it('provides exactly 35 fresh questions, five per canonical concept family', () => {
    expect(chapter17ReassessmentReserve).toHaveLength(35)
    expect(new Set(chapter17ReassessmentReserve.map((question) => question.id)).size).toBe(35)

    for (const conceptFamilyId of CHAPTER17_CONCEPT_FAMILY_IDS) {
      const questions = getChapter17ReassessmentReserve(conceptFamilyId)
      expect(questions, conceptFamilyId).toHaveLength(5)
      expect(questions.every((question) => question.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(
        questions.every((question) => ['understanding', 'application', 'scenario'].includes(question.difficulty)),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('keeps reassessment IDs separate from assessment, learning-question, and micro-check namespaces', () => {
    const assessmentIds = new Set(chapter17PremiumQuizQuestions.map((question) => question.id))
    const learningIds = new Set(chapter17LearningQuestions.map((question) => question.id))
    const microIds = new Set(chapter17MicroChecks.flatMap((check) => check.questions.map((question) => question.id)))
    const reserveIds = chapter17ReassessmentReserve.map((question) => question.id)

    expect(reserveIds.every((id) => id.startsWith('r17-'))).toBe(true)
    expect(reserveIds.some((id) => assessmentIds.has(id as never))).toBe(false)
    expect(reserveIds.some((id) => learningIds.has(id as never))).toBe(false)
    expect(reserveIds.some((id) => microIds.has(id as never))).toBe(false)
  })

  it('keeps every reassessment question structurally valid and application-oriented', () => {
    for (const question of chapter17ReassessmentReserve) {
      const choices = [question.answer_a, question.answer_b, question.answer_c, question.answer_d]
      expect(choices.every((choice) => choice.trim().length > 0), question.id).toBe(true)
      expect(new Set(choices).size, question.id).toBe(4)
      expect(['a','b','c','d'], question.id).toContain(question.correctAnswer)
      expect(question.explanation.trim().length, question.id).toBeGreaterThan(0)
      expect(question.difficulty, question.id).not.toBe('recall')
    }
  })

  it('selects exactly five fresh questions for each concept', () => {
    for (const conceptFamilyId of CHAPTER17_CONCEPT_FAMILY_IDS) {
      const selected = selectChapter17ReassessmentQuestions(
        conceptFamilyId,
        chapter17ReassessmentReserve,
      )
      expect(selected).toHaveLength(5)
      expect(new Set(selected).size).toBe(5)
      expect(selected.every((id) => id.startsWith('r17-'))).toBe(true)
    }
  })
})

describe('C17-7 ordinary and urgent recovery policy', () => {
  it('passes ordinary recovery at 4/5 = 80 percent', () => {
    const conceptFamilyId = 'ch17-chemistry-bond-transformation'
    const selected = getChapter17ReassessmentReserve(conceptFamilyId)
    const cycle = scoreChapter17ReassessmentCycle({
      cycleId: 'c17-ordinary',
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
      evidence('ch17-safety-strand-tests-compatibility','mcq-17-011',false,'micro_check','scenario','2026-09-29T23:01:00.000Z'),
      evidence('ch17-chemical-relaxing-procedures','mcq-17-008',false,'micro_check','scenario','2026-09-29T23:02:00.000Z'),
    ]
    const intervention = evaluateChapter17SafetyIntervention(urgentEvidence)
    expect(intervention.level).toBe('urgent')
    expect(intervention.reassessmentQuestionCount).toBe(5)
    expect(intervention.reassessmentPassPercent).toBe(100)

    const conceptFamilyId = 'ch17-chemical-relaxing-procedures'
    expect(getChapter17RequiredReassessmentPassPercent(urgentEvidence, conceptFamilyId)).toBe(100)

    const selected = getChapter17ReassessmentReserve(conceptFamilyId)
    const four = scoreChapter17ReassessmentCycle({
      cycleId: 'c17-urgent-4',
      conceptFamilyId,
      selectedQuestionIds: selected.map((question) => question.id),
      responses: selected.map((question, index) => ({ questionId: question.id, correct: index < 4 })),
      passPercent: 100,
    })
    const five = scoreChapter17ReassessmentCycle({
      cycleId: 'c17-urgent-5',
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

  it('locks the policy to ordinary 80 and urgent 100 with five questions', () => {
    expect(CHAPTER17_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER17_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER17_REMEDIATION_RULES.urgentSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER17_REMEDIATION_RULES.urgentSafetyReassessmentPassPercent).toBe(100)
  })
})

describe('C17-7 mastery recovery and diagnostic-history preservation', () => {
  it('builds reassessment evidence with remediation_reassessment / reassessment semantics', () => {
    const conceptFamilyId = 'ch17-permanent-waving-procedures'
    const selected = getChapter17ReassessmentReserve(conceptFamilyId)
    const records = buildChapter17ReassessmentEvidence({
      studentId: 'student-c17',
      conceptFamilyId,
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-29T23:10:00.000Z',
    })

    expect(records).toHaveLength(5)
    expect(records.every((record) => record.chapterId === 'ch-17')).toBe(true)
    expect(records.every((record) => record.source === 'remediation_reassessment')).toBe(true)
    expect(records.every((record) => record.attemptPhase === 'reassessment')).toBe(true)
  })

  it('raises mastery after successful reassessment while preserving original misses exactly', () => {
    const conceptFamilyId = 'ch17-chemical-relaxing-procedures'
    const original = [
      evidence(conceptFamilyId,'mcq-17-008',false,'micro_check','scenario','2026-09-29T23:20:00.000Z'),
      evidence(conceptFamilyId,'qq-17-023',false,'chapter_assessment','scenario','2026-09-29T23:21:00.000Z'),
      evidence(conceptFamilyId,'fc-ch17-037',true,'flashcard','understanding','2026-09-29T23:22:00.000Z'),
    ]
    const selected = getChapter17ReassessmentReserve(conceptFamilyId)
    const reassessment = buildChapter17ReassessmentEvidence({
      studentId: 'student-c17',
      conceptFamilyId,
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-29T23:30:00.000Z',
    })

    const recovered = calculateChapter17RecoveredMastery(
      original,
      reassessment,
      conceptFamilyId,
      '2026-09-29T23:31:00.000Z',
    )

    expect(recovered.originalEvidencePreserved).toBe(true)
    expect(recovered.after.mastery).toBeGreaterThan(recovered.before.mastery)
    expect(recovered.after.initialMissCount).toBe(recovered.before.initialMissCount)
    expect(recovered.after.initialMissCount).toBe(2)
    expect(recovered.after.reassessmentCorrectCount).toBe(5)
    expect(recovered.combinedEvidence.slice(0, original.length)).toEqual(original)
  })

  it('does not duplicate the same reassessment evidence when appended twice', () => {
    const conceptFamilyId = 'ch17-texturizers-chemical-blowouts'
    const original = [evidence(conceptFamilyId,'qq-17-027',false)]
    const selected = getChapter17ReassessmentReserve(conceptFamilyId)
    const reassessment = buildChapter17ReassessmentEvidence({
      studentId: 'student-c17',
      conceptFamilyId,
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-29T23:40:00.000Z',
    })

    const once = appendChapter17ReassessmentEvidence(original, reassessment)
    const twice = appendChapter17ReassessmentEvidence(once, reassessment)

    expect(once).toHaveLength(6)
    expect(twice).toHaveLength(6)
    expect(twice[0]).toEqual(original[0])
  })
})

describe('C17-7 shared runtime providers', () => {
  it('registers a canonical mapping provider that serves exactly five fresh questions per concept', () => {
    expect(hasCanonicalMappingProvider('ch-17')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-17')

    for (const conceptFamilyId of CHAPTER17_CONCEPT_FAMILY_IDS) {
      const ids = provider.getQuestionsForConcept(conceptFamilyId)
      expect(ids, conceptFamilyId).toHaveLength(5)
      expect(ids.every((id) => id.startsWith('r17-')), conceptFamilyId).toBe(true)
      expect(ids.every((id) => provider.isQuestionMappedToConcept(id, conceptFamilyId)), conceptFamilyId).toBe(true)
    }
  })

  it('registers a content provider that serves canonical remediation plus fresh reassessment items', () => {
    expect(hasChapterContentProvider('ch-17')).toBe(true)
    const provider = getChapterContentProvider('ch-17')!

    for (const conceptFamilyId of CHAPTER17_CONCEPT_FAMILY_IDS) {
      expect(provider.getContentBlockIdsForConcept(conceptFamilyId).length, conceptFamilyId).toBeGreaterThan(0)
      expect(provider.getFlashcardIdsForConcept(conceptFamilyId).length, conceptFamilyId).toBeGreaterThan(0)
      const reserve = getChapter17ReassessmentReserve(conceptFamilyId)
      for (const question of reserve) {
        expect(provider.getQuizQuestionById(question.id), question.id).toBeTruthy()
      }
    }
  })

  it('can initialize Chapter 17 reassessment-aware detection with initial and reserve mappings', async () => {
    resetDetectionProviderRegistry()
    const provider = initializeChapter17DetectionProvider({
      fetchQuizAttempts: async () => [],
    })
    expect(provider.chapterId).toBe('ch-17')
    expect(provider.isValidConcept('ch17-safety-strand-tests-compatibility')).toBe(true)
    expect(provider.isValidConcept('not-a-c17-concept')).toBe(false)
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
