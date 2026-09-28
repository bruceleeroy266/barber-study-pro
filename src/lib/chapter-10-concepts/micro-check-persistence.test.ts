import { describe, expect, it } from 'vitest'
import {
  buildChapter10MicroCheckDiagnostics,
  calculatePersistedChapter10MicroCheckPercent,
  chapter10MicroCheckRowsToEvidence,
  withPersistedChapter10MicroCheckGrade,
  type Chapter10MicroCheckAttemptRow,
} from './micro-check-persistence'
import { CHAPTER10_GRADE_WEIGHTS } from './grading'

const row = (
  questionId: string,
  conceptId: Chapter10MicroCheckAttemptRow['concept_id'],
  correct: boolean,
): Chapter10MicroCheckAttemptRow => ({
  id: `row-${questionId}`,
  user_id: 'student-c10',
  chapter_id: 'ch-10',
  check_id: 'mc-10-test',
  question_id: questionId,
  concept_id: conceptId,
  difficulty: 'application',
  selected_answer: correct ? 'a' : 'b',
  is_correct: correct,
  answered_at: '2026-09-27T23:30:00.000Z',
  created_at: '2026-09-27T23:30:00.000Z',
})

describe('C10-5 persisted micro-check evidence adapter', () => {
  it('converts persisted rows into immutable initial concept evidence', () => {
    const records = chapter10MicroCheckRowsToEvidence([
      row('mcq-10-017', 'ch10-service-safety-referral', false),
    ])

    expect(records).toEqual([
      expect.objectContaining({
        chapterId: 'ch-10',
        conceptFamilyId: 'ch10-service-safety-referral',
        source: 'micro_check',
        itemId: 'mcq-10-017',
        correct: false,
        attemptPhase: 'initial',
      }),
    ])
  })

  it('feeds first-attempt accuracy into the existing shared grade input without changing weights', () => {
    const rows = [
      row('mcq-10-001', 'ch10-hair-anatomy-structure', true),
      row('mcq-10-002', 'ch10-hair-anatomy-structure', false),
    ]

    expect(calculatePersistedChapter10MicroCheckPercent(rows)).toBe(50)
    expect(withPersistedChapter10MicroCheckGrade({ chapterAssessmentPercent: 80 }, rows)).toEqual({
      chapterAssessmentPercent: 80,
      microCheckPercent: 50,
    })
    expect(CHAPTER10_GRADE_WEIGHTS.micro_check).toBe(0.2)
  })

  it('derives per-concept diagnostics from the same shared mastery engine', () => {
    const rows = [
      row('mcq-10-017', 'ch10-service-safety-referral', false),
      row('mcq-10-018', 'ch10-service-safety-referral', true),
    ]

    const diagnostics = buildChapter10MicroCheckDiagnostics(
      rows,
      '2026-09-27T23:31:00.000Z',
    )
    const safety = diagnostics.find(
      (item) => item.conceptFamilyId === 'ch10-service-safety-referral',
    )

    expect(diagnostics).toHaveLength(9)
    expect(safety).toMatchObject({
      answered: 2,
      correct: 1,
      percent: 50,
    })
  })
})
