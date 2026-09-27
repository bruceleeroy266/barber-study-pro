import { describe, expect, it } from 'vitest'
import {
  buildChapter10MicroCheckEvidence,
  chapter10MicroChecks,
  mergeChapter10EvidenceWithoutContamination,
  validateChapter10MicroCheckPlacements,
} from './micro-checks'
import { calculateChapter10ConceptMastery, type Chapter10EvidenceRecord } from './grading'
import { chapter10MicroCheckPlacements } from './mappings'
import { CHAPTER10_CONCEPT_FAMILY_IDS } from './concepts'

const ts = '2026-09-27T23:30:00.000Z'

describe('C10-5 Chapter 10 micro-check first-attempt evidence', () => {
  it('covers all nine canonical concept families with 19 non-recall questions', () => {
    expect(chapter10MicroChecks).toHaveLength(9)
    expect(chapter10MicroCheckPlacements).toHaveLength(9)
    expect(validateChapter10MicroCheckPlacements()).toBe(true)

    const questions = chapter10MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(19)
    expect(new Set(questions.map((question) => question.id)).size).toBe(19)
    expect(new Set(chapter10MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(CHAPTER10_CONCEPT_FAMILY_IDS),
    )
    expect(
      questions.every((question) =>
        ['understanding', 'application', 'scenario'].includes(question.difficulty),
      ),
    ).toBe(true)
  })

  it('captures only the first response for a question and binds it to one canonical concept', () => {
    const records = buildChapter10MicroCheckEvidence(
      'student-c10',
      [
        { questionId: 'mcq-10-017', selectedAnswer: 'a' },
        { questionId: 'mcq-10-017', selectedAnswer: 'b' },
      ],
      ts,
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      studentId: 'student-c10',
      chapterId: 'ch-10',
      conceptFamilyId: 'ch10-service-safety-referral',
      source: 'micro_check',
      itemId: 'mcq-10-017',
      correct: false,
      attemptPhase: 'initial',
    })
  })

  it('keeps initial misses distinct from later reassessment recovery evidence', () => {
    const initial = buildChapter10MicroCheckEvidence(
      'student-c10',
      [{ questionId: 'mcq-10-017', selectedAnswer: 'a' }],
      '2026-09-27T23:30:00.000Z',
    )

    const reassessment: Chapter10EvidenceRecord = {
      studentId: 'student-c10',
      chapterId: 'ch-10',
      conceptFamilyId: 'ch10-service-safety-referral',
      source: 'remediation_reassessment',
      itemId: 'r10-service-safety-001',
      difficulty: 'scenario',
      correct: true,
      attemptPhase: 'reassessment',
      timestamp: '2026-09-27T23:45:00.000Z',
    }

    const merged = mergeChapter10EvidenceWithoutContamination(initial, [reassessment])

    expect(merged).toHaveLength(2)
    expect(merged[0]).toEqual(initial[0])
    expect(merged[0].correct).toBe(false)
    expect(merged[0].attemptPhase).toBe('initial')
    expect(merged[1]).toEqual(reassessment)

    const mastery = calculateChapter10ConceptMastery(merged, '2026-09-27T23:46:00.000Z')
    expect(mastery.initialMissCount).toBe(1)
    expect(mastery.reassessmentCorrectCount).toBe(1)
  })

  it('does not let a duplicate incoming initial record overwrite the preserved first attempt', () => {
    const original = buildChapter10MicroCheckEvidence(
      'student-c10',
      [{ questionId: 'mcq-10-001', selectedAnswer: 'a' }],
      ts,
    )
    expect(original[0].correct).toBe(false)

    const duplicateWithDifferentOutcome: Chapter10EvidenceRecord = {
      ...original[0],
      correct: true,
      timestamp: '2026-09-27T23:40:00.000Z',
    }

    const merged = mergeChapter10EvidenceWithoutContamination(original, [duplicateWithDifferentOutcome])
    expect(merged).toHaveLength(1)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].timestamp).toBe(ts)
  })

  it('rejects placement drift between a check and its questions', () => {
    for (const check of chapter10MicroChecks) {
      expect(check.questions.length).toBeGreaterThanOrEqual(2)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })
})
