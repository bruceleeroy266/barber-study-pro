import { describe, expect, it } from 'vitest'
import type { Chapter15EvidenceRecord } from './grading'
import { CHAPTER15_CONCEPT_FAMILY_IDS } from './concepts'
import { chapter15PremiumQuizQuestions } from '../chapter-15-premium-quiz'
import { chapter15MicroChecks } from './micro-checks'
import {
  chapter15ReassessmentReserve,
  getChapter15ReassessmentReserve,
} from './reassessment-reserve'
import {
  appendChapter15ReassessmentEvidence,
  buildChapter15ReassessmentEvidence,
  calculateChapter15RecoveredMastery,
  CHAPTER15_REMEDIATION_RULES,
  scoreChapter15ReassessmentCycle,
  selectChapter15ReassessmentQuestions,
} from './targeted-remediation'
import {
  evaluateChapter15SafetyIntervention,
  getChapter15RequiredReassessmentPassPercent,
} from './safety-intervention'
import {
  getCanonicalMappingProvider,
  hasCanonicalMappingProvider,
} from '@/lib/reassessment/provider-registry'
import {
  getChapterContentProvider,
  hasChapterContentProvider,
} from '@/lib/remediation/content-provider-registry'

const evidence = (
  conceptFamilyId: Chapter15EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter15EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter15EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-29T06:20:00.000Z',
): Chapter15EvidenceRecord => ({
  studentId: 'student-c15',
  chapterId: 'ch-15',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C15-7 fresh reassessment reserve', () => {
  it('provides exactly 35 fresh questions, five per canonical concept family', () => {
    expect(chapter15ReassessmentReserve).toHaveLength(35)
    expect(new Set(chapter15ReassessmentReserve.map((question) => question.id)).size).toBe(35)

    for (const conceptFamilyId of CHAPTER15_CONCEPT_FAMILY_IDS) {
      const questions = getChapter15ReassessmentReserve(conceptFamilyId)
      expect(questions, conceptFamilyId).toHaveLength(5)
      expect(questions.every((question) => question.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(
        questions.every((question) => ['understanding', 'application', 'scenario'].includes(question.difficulty)),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('keeps reassessment IDs separate from the 72 assessment and 14 micro-check namespaces', () => {
    const initialIds = new Set(chapter15PremiumQuizQuestions.map((question) => question.id))
    const microIds = new Set(chapter15MicroChecks.flatMap((check) => check.questions.map((question) => question.id)))

    expect(chapter15PremiumQuizQuestions).toHaveLength(72)
    expect(chapter15MicroChecks.flatMap((check) => check.questions)).toHaveLength(14)
    expect(chapter15ReassessmentReserve.every((question) => question.id.startsWith('r15-'))).toBe(true)

    for (const question of chapter15ReassessmentReserve) {
      expect(initialIds.has(question.id as never), question.id).toBe(false)
      expect(microIds.has(question.id as never), question.id).toBe(false)
    }
  })

  it('gives every reassessment question four distinct non-empty choices and a valid key', () => {
    for (const question of chapter15ReassessmentReserve) {
      const choices = {
        a: question.answer_a,
        b: question.answer_b,
        c: question.answer_c,
        d: question.answer_d,
      }
      expect(new Set(Object.values(choices)).size, question.id).toBe(4)
      expect(Object.values(choices).every((value) => value.trim().length > 0), question.id).toBe(true)
      expect(['a','b','c','d'], question.id).toContain(question.correctAnswer)
      expect(choices[question.correctAnswer].trim().length, question.id).toBeGreaterThan(0)
      expect(question.explanation.trim().length, question.id).toBeGreaterThan(0)
    }
  })
})

describe('C15-7 mastery recovery policy', () => {
  it('passes ordinary remediation at 4/5 but fails the same score under urgent safety policy', () => {
    const selected = selectChapter15ReassessmentQuestions(
      'ch15-alternatives-scope-referral',
      chapter15ReassessmentReserve,
    )
    const responses = selected.map((questionId, index) => ({ questionId, correct: index < 4 }))

    const ordinary = scoreChapter15ReassessmentCycle({
      cycleId: 'c15-ordinary',
      conceptFamilyId: 'ch15-alternatives-scope-referral',
      selectedQuestionIds: selected,
      responses,
      passPercent: 80,
    })
    const urgent = scoreChapter15ReassessmentCycle({
      cycleId: 'c15-urgent',
      conceptFamilyId: 'ch15-alternatives-scope-referral',
      selectedQuestionIds: selected,
      responses,
      passPercent: 100,
    })

    expect(ordinary.percent).toBe(80)
    expect(ordinary.passed).toBe(true)
    expect(urgent.percent).toBe(80)
    expect(urgent.passed).toBe(false)
  })

  it('passes urgent safety recovery only at 5/5', () => {
    const selected = selectChapter15ReassessmentQuestions(
      'ch15-alternatives-scope-referral',
      chapter15ReassessmentReserve,
    )

    const urgent = scoreChapter15ReassessmentCycle({
      cycleId: 'c15-urgent-pass',
      conceptFamilyId: 'ch15-alternatives-scope-referral',
      selectedQuestionIds: selected,
      responses: selected.map((questionId) => ({ questionId, correct: true })),
      passPercent: 100,
    })

    expect(urgent.percent).toBe(100)
    expect(urgent.passed).toBe(true)
  })

  it('derives 100-percent recovery from distinct medication + surgical misses in the same scope concept', () => {
    const records = [
      evidence('ch15-alternatives-scope-referral','mcq-15-003',false,'micro_check','scenario','2026-09-29T06:20:00.000Z'),
      evidence('ch15-alternatives-scope-referral','mcq-15-004',false,'micro_check','scenario','2026-09-29T06:21:00.000Z'),
    ]

    const intervention = evaluateChapter15SafetyIntervention(records)
    expect(intervention.level).toBe('urgent')
    expect(getChapter15RequiredReassessmentPassPercent(records,'ch15-alternatives-scope-referral')).toBe(100)
  })

  it('preserves original misses while appending fresh reassessment evidence', () => {
    const original = [
      evidence('ch15-system-selection-measurement-template','qq-15-031',false),
      evidence('ch15-system-selection-measurement-template','mcq-15-007',false,'micro_check'),
      evidence('ch15-system-selection-measurement-template','qq-15-032',true),
    ]
    const snapshot = JSON.stringify(original)
    const selected = getChapter15ReassessmentReserve('ch15-system-selection-measurement-template')
    const recovery = buildChapter15ReassessmentEvidence({
      studentId: 'student-c15',
      conceptFamilyId: 'ch15-system-selection-measurement-template',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-29T06:25:00.000Z',
    })

    const combined = appendChapter15ReassessmentEvidence(original, recovery)

    expect(JSON.stringify(original)).toBe(snapshot)
    expect(combined.slice(0, original.length)).toEqual(original)
    expect(combined.filter((record) => record.attemptPhase === 'initial' && !record.correct)).toHaveLength(2)
    expect(recovery).toHaveLength(5)
    expect(recovery.every((record) => record.source === 'remediation_reassessment')).toBe(true)
    expect(recovery.every((record) => record.attemptPhase === 'reassessment')).toBe(true)
    expect(recovery.every((record) => record.itemId.startsWith('r15-'))).toBe(true)
  })

  it('raises mastery after successful reassessment without erasing diagnostic history', () => {
    const original = [
      evidence('ch15-system-selection-measurement-template','qq-15-031',false),
      evidence('ch15-system-selection-measurement-template','mcq-15-007',false,'micro_check'),
      evidence('ch15-system-selection-measurement-template','qq-15-032',true),
    ]
    const selected = getChapter15ReassessmentReserve('ch15-system-selection-measurement-template')
    const recovery = buildChapter15ReassessmentEvidence({
      studentId: 'student-c15',
      conceptFamilyId: 'ch15-system-selection-measurement-template',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-29T06:25:00.000Z',
    })

    const result = calculateChapter15RecoveredMastery(
      original,
      recovery,
      'ch15-system-selection-measurement-template',
      '2026-09-29T06:26:00.000Z',
    )

    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
    expect(result.before.initialMissCount).toBe(2)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
  })

  it('locks ordinary recovery to 80% and urgent safety recovery to 100%', () => {
    expect(CHAPTER15_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER15_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER15_REMEDIATION_RULES.urgentSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER15_REMEDIATION_RULES.urgentSafetyReassessmentPassPercent).toBe(100)
  })
})

describe('C15-7 live reassessment provider wiring', () => {
  it('registers canonical mapping with exactly five fresh r15 items per concept', () => {
    expect(hasCanonicalMappingProvider('ch-15')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-15')
    expect(provider.getAllConceptIds()).toEqual(expect.arrayContaining([...CHAPTER15_CONCEPT_FAMILY_IDS]))

    for (const conceptId of CHAPTER15_CONCEPT_FAMILY_IDS) {
      const ids = provider.getQuestionsForConcept(conceptId)
      expect(ids, conceptId).toHaveLength(5)
      expect(ids.every((id) => id.startsWith('r15-')), conceptId).toBe(true)
      expect(new Set(ids).size, conceptId).toBe(5)
      for (const id of ids) {
        expect(provider.getConceptForQuestion(id), id).toBe(conceptId)
        expect(provider.isQuestionMappedToConcept(id, conceptId), id).toBe(true)
      }
    }
  })

  it('serves every fresh reassessment question through the Chapter 15 content provider', () => {
    expect(hasChapterContentProvider('ch-15')).toBe(true)
    const provider = getChapterContentProvider('ch-15')!

    for (const conceptId of CHAPTER15_CONCEPT_FAMILY_IDS) {
      expect(provider.getContentBlockIdsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)
      expect(provider.getFlashcardIdsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)

      for (const question of getChapter15ReassessmentReserve(conceptId)) {
        const served = provider.getQuizQuestionById(question.id)
        expect(served, question.id).toBeTruthy()
        expect(served!.id).toBe(question.id)
        expect(served!.correct_answer).toBe(question.correctAnswer)
      }
    }
  })
})
