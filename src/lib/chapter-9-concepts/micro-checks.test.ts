import { describe, expect, it } from 'vitest'
import {
  buildChapter9MicroCheckEvidence,
  chapter9MicroChecks,
  mergeChapter9EvidenceWithoutContamination,
  validateChapter9MicroCheckPlacements,
} from './micro-checks'
import {
  calculateChapter9ConceptMastery,
  type Chapter9EvidenceRecord,
} from './grading'
import { chapter9MicroCheckPlacements } from './mappings'

const ts = '2026-09-27T00:15:00.000Z'

describe('C9-5 Chapter 9 micro-check first-attempt evidence', () => {
  it('covers all ten canonical concept families with 21 application-oriented questions', () => {
    expect(chapter9MicroChecks).toHaveLength(10)
    expect(chapter9MicroCheckPlacements).toHaveLength(10)
    expect(validateChapter9MicroCheckPlacements()).toBe(true)

    const questions = chapter9MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(21)
    expect(new Set(questions.map((question) => question.id)).size).toBe(21)
    expect(new Set(chapter9MicroChecks.map((check) => check.conceptFamilyId)).size).toBe(10)
    expect(questions.some((question) => question.difficulty === 'recall')).toBe(false)
  })

  it('captures only the first response for a micro-check question and attributes the miss to its canonical concept', () => {
    const records = buildChapter9MicroCheckEvidence(
      'student-c9',
      [
        { questionId: 'mcq-9-020', selectedAnswer: 'a' },
        { questionId: 'mcq-9-020', selectedAnswer: 'b' },
      ],
      ts,
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      studentId: 'student-c9',
      chapterId: 'ch-9',
      conceptFamilyId: 'ch9-service-safety-referral',
      source: 'micro_check',
      itemId: 'mcq-9-020',
      correct: false,
      attemptPhase: 'initial',
    })
  })

  it('keeps initial misses distinct from later reassessment recovery evidence', () => {
    const initial = buildChapter9MicroCheckEvidence(
      'student-c9',
      [{ questionId: 'mcq-9-020', selectedAnswer: 'a' }],
      '2026-09-27T00:15:00.000Z',
    )

    const reassessment: Chapter9EvidenceRecord = {
      studentId: 'student-c9',
      chapterId: 'ch-9',
      conceptFamilyId: 'ch9-service-safety-referral',
      source: 'remediation_reassessment',
      itemId: 'r9-service-safety-001',
      difficulty: 'scenario',
      correct: true,
      attemptPhase: 'reassessment',
      timestamp: '2026-09-27T00:30:00.000Z',
    }

    const merged = mergeChapter9EvidenceWithoutContamination(initial, [reassessment])

    expect(merged).toHaveLength(2)
    expect(merged[0]).toEqual(initial[0])
    expect(merged[0].correct).toBe(false)
    expect(merged[0].attemptPhase).toBe('initial')
    expect(merged[1]).toEqual(reassessment)

    const mastery = calculateChapter9ConceptMastery(merged, '2026-09-27T00:31:00.000Z')
    expect(mastery.initialMissCount).toBe(1)
    expect(mastery.reassessmentCorrectCount).toBe(1)
  })

  it('does not let a duplicate incoming initial record overwrite the preserved first attempt', () => {
    const original = buildChapter9MicroCheckEvidence(
      'student-c9',
      [{ questionId: 'mcq-9-001', selectedAnswer: 'b' }],
      '2026-09-27T00:15:00.000Z',
    )
    expect(original[0].correct).toBe(false)

    const duplicateWithDifferentOutcome: Chapter9EvidenceRecord = {
      ...original[0],
      correct: true,
      timestamp: '2026-09-27T00:20:00.000Z',
    }

    const merged = mergeChapter9EvidenceWithoutContamination(original, [duplicateWithDifferentOutcome])
    expect(merged).toHaveLength(1)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].timestamp).toBe('2026-09-27T00:15:00.000Z')
  })

  it('rejects cross-concept placement drift by validating check-to-question concept consistency', () => {
    for (const check of chapter9MicroChecks) {
      expect(check.questions.length).toBeGreaterThanOrEqual(2)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })
})
