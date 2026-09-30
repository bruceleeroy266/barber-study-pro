import { describe, expect, it } from 'vitest'
import type { Chapter16EvidenceRecord } from './grading'
import { CHAPTER16_CONCEPT_FAMILY_IDS } from './concepts'
import { chapter16PremiumQuizQuestions } from '../chapter-16-premium-quiz'
import { chapter16MicroChecks } from './micro-checks'
import {
  chapter16ReassessmentReserve,
  getChapter16ReassessmentReserve,
} from './reassessment-reserve'
import {
  appendChapter16ReassessmentEvidence,
  buildChapter16ReassessmentEvidence,
  calculateChapter16RecoveredMastery,
  CHAPTER16_REMEDIATION_RULES,
  scoreChapter16ReassessmentCycle,
  selectChapter16ReassessmentQuestions,
} from './targeted-remediation'
import {
  evaluateChapter16SafetyIntervention,
  getChapter16RequiredReassessmentPassPercent,
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
  conceptFamilyId: Chapter16EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter16EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter16EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-29T23:50:00.000Z',
): Chapter16EvidenceRecord => ({
  studentId: 'student-c16',
  chapterId: 'ch-16',
  conceptFamilyId,
  source,
  itemId,
  difficulty,
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C16-8 fresh reassessment reserve', () => {
  it('provides exactly 40 fresh questions, five per canonical concept family', () => {
    expect(chapter16ReassessmentReserve).toHaveLength(40)
    expect(new Set(chapter16ReassessmentReserve.map((question) => question.id)).size).toBe(40)

    for (const conceptFamilyId of CHAPTER16_CONCEPT_FAMILY_IDS) {
      const questions = getChapter16ReassessmentReserve(conceptFamilyId)
      expect(questions, conceptFamilyId).toHaveLength(5)
      expect(questions.every((question) => question.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(
        questions.every((question) => ['understanding', 'application', 'scenario'].includes(question.difficulty)),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('keeps reassessment IDs separate from assessment and micro-check namespaces', () => {
    const initialIds = new Set(chapter16PremiumQuizQuestions.map((question) => question.id))
    const microIds = new Set(chapter16MicroChecks.flatMap((check) => check.questions.map((question) => question.id)))

    expect(chapter16PremiumQuizQuestions).toHaveLength(30)
    expect(chapter16MicroChecks.flatMap((check) => check.questions)).toHaveLength(16)
    expect(chapter16ReassessmentReserve.every((question) => question.id.startsWith('r16-'))).toBe(true)

    for (const question of chapter16ReassessmentReserve) {
      expect(initialIds.has(question.id as never), question.id).toBe(false)
      expect(microIds.has(question.id as never), question.id).toBe(false)
    }
  })

  it('gives every reassessment item four distinct choices and a valid key', () => {
    for (const question of chapter16ReassessmentReserve) {
      const choices = {
        a: question.answer_a,
        b: question.answer_b,
        c: question.answer_c,
        d: question.answer_d,
      }
      expect(new Set(Object.values(choices)).size, question.id).toBe(4)
      expect(Object.values(choices).every((value) => value.trim().length > 0), question.id).toBe(true)
      expect(['a','b','c','d'], question.id).toContain(question.correctAnswer)
      expect(question.explanation.trim().length, question.id).toBeGreaterThan(0)
    }
  })
})

describe('C16-8 mastery recovery policy', () => {
  it('passes ordinary recovery at 4/5 and fails the same score under urgent safety policy', () => {
    const selected = selectChapter16ReassessmentQuestions(
      'ch16-advanced-techniques-texturizing',
      chapter16ReassessmentReserve,
    )
    const responses = selected.map((questionId, index) => ({ questionId, correct: index < 4 }))

    const ordinary = scoreChapter16ReassessmentCycle({
      cycleId: 'c16-ordinary',
      conceptFamilyId: 'ch16-advanced-techniques-texturizing',
      selectedQuestionIds: selected,
      responses,
      passPercent: 80,
    })
    const urgent = scoreChapter16ReassessmentCycle({
      cycleId: 'c16-urgent',
      conceptFamilyId: 'ch16-advanced-techniques-texturizing',
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
    const selected = selectChapter16ReassessmentQuestions(
      'ch16-styling-finishing-safety',
      chapter16ReassessmentReserve,
    )

    const urgent = scoreChapter16ReassessmentCycle({
      cycleId: 'c16-urgent-pass',
      conceptFamilyId: 'ch16-styling-finishing-safety',
      selectedQuestionIds: selected,
      responses: selected.map((questionId) => ({ questionId, correct: true })),
      passPercent: 100,
    })

    expect(urgent.percent).toBe(100)
    expect(urgent.passed).toBe(true)
  })

  it('derives 100-percent recovery only when both safety hazards are active', () => {
    const records = [
      evidence('ch16-advanced-techniques-texturizing','mcq-16-013',false,'micro_check','application','2026-09-29T23:50:00.000Z'),
      evidence('ch16-styling-finishing-safety','mcq-16-015',false,'micro_check','application','2026-09-29T23:51:00.000Z'),
    ]

    const intervention = evaluateChapter16SafetyIntervention(records)
    expect(intervention.level).toBe('urgent')
    expect(getChapter16RequiredReassessmentPassPercent(records,'ch16-advanced-techniques-texturizing')).toBe(100)
    expect(getChapter16RequiredReassessmentPassPercent(records,'ch16-styling-finishing-safety')).toBe(100)
    expect(getChapter16RequiredReassessmentPassPercent(records,'ch16-blunt-cut')).toBe(80)
  })

  it('preserves original misses while appending fresh reassessment evidence', () => {
    const original = [
      evidence('ch16-blunt-cut','qq-16-007',false),
      evidence('ch16-blunt-cut','mcq-16-003',false,'micro_check'),
      evidence('ch16-blunt-cut','qq-16-008',true),
    ]
    const snapshot = JSON.stringify(original)
    const selected = getChapter16ReassessmentReserve('ch16-blunt-cut')
    const recovery = buildChapter16ReassessmentEvidence({
      studentId: 'student-c16',
      conceptFamilyId: 'ch16-blunt-cut',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-29T23:55:00.000Z',
    })

    const combined = appendChapter16ReassessmentEvidence(original, recovery)

    expect(JSON.stringify(original)).toBe(snapshot)
    expect(combined.slice(0, original.length)).toEqual(original)
    expect(combined.filter((record) => record.attemptPhase === 'initial' && !record.correct)).toHaveLength(2)
    expect(recovery).toHaveLength(5)
    expect(recovery.every((record) => record.source === 'remediation_reassessment')).toBe(true)
    expect(recovery.every((record) => record.attemptPhase === 'reassessment')).toBe(true)
    expect(recovery.every((record) => record.itemId.startsWith('r16-'))).toBe(true)
  })

  it('raises mastery after successful reassessment without erasing diagnostic history', () => {
    const original = [
      evidence('ch16-blunt-cut','qq-16-007',false),
      evidence('ch16-blunt-cut','mcq-16-003',false,'micro_check'),
      evidence('ch16-blunt-cut','qq-16-008',true),
    ]
    const selected = getChapter16ReassessmentReserve('ch16-blunt-cut')
    const recovery = buildChapter16ReassessmentEvidence({
      studentId: 'student-c16',
      conceptFamilyId: 'ch16-blunt-cut',
      selectedQuestions: selected,
      responses: selected.map((question) => ({ questionId: question.id, correct: true })),
      timestamp: '2026-09-29T23:55:00.000Z',
    })

    const result = calculateChapter16RecoveredMastery(
      original,
      recovery,
      'ch16-blunt-cut',
      '2026-09-29T23:56:00.000Z',
    )

    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
    expect(result.before.initialMissCount).toBe(2)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
  })

  it('locks ordinary recovery to 80% and urgent safety recovery to 100%', () => {
    expect(CHAPTER16_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER16_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER16_REMEDIATION_RULES.urgentSafetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER16_REMEDIATION_RULES.urgentSafetyReassessmentPassPercent).toBe(100)
  })
})

describe('C16-8 live reassessment provider wiring', () => {
  it('registers canonical mapping with exactly five fresh r16 items per concept', () => {
    expect(hasCanonicalMappingProvider('ch-16')).toBe(true)
    const provider = getCanonicalMappingProvider('ch-16')
    expect(provider.getAllConceptIds()).toEqual(expect.arrayContaining([...CHAPTER16_CONCEPT_FAMILY_IDS]))

    for (const conceptId of CHAPTER16_CONCEPT_FAMILY_IDS) {
      const ids = provider.getQuestionsForConcept(conceptId)
      expect(ids, conceptId).toHaveLength(5)
      expect(ids.every((id) => id.startsWith('r16-')), conceptId).toBe(true)
      expect(new Set(ids).size, conceptId).toBe(5)
      for (const id of ids) {
        expect(provider.getConceptForQuestion(id), id).toBe(conceptId)
        expect(provider.isQuestionMappedToConcept(id, conceptId), id).toBe(true)
      }
    }
  })

  it('serves every fresh reassessment question through the Chapter 16 content provider', () => {
    expect(hasChapterContentProvider('ch-16')).toBe(true)
    const provider = getChapterContentProvider('ch-16')!

    for (const conceptId of CHAPTER16_CONCEPT_FAMILY_IDS) {
      expect(provider.getContentBlockIdsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)
      expect(provider.getFlashcardIdsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)

      for (const question of getChapter16ReassessmentReserve(conceptId)) {
        const served = provider.getQuizQuestionById(question.id)
        expect(served, question.id).toBeTruthy()
        expect(served!.id).toBe(question.id)
        expect(served!.correct_answer).toBe(question.correctAnswer)
      }
    }
  })
})
