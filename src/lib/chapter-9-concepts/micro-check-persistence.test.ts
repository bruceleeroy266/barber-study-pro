import { describe, expect, it } from 'vitest'
import {
  calculatePersistedChapter9MicroCheckPercent,
  chapter9MicroCheckRowsToEvidence,
  withPersistedChapter9MicroCheckGrade,
  type Chapter9MicroCheckAttemptRow,
} from './micro-check-persistence'

const row = (
  questionId: string,
  conceptId: Chapter9MicroCheckAttemptRow['concept_id'],
  correct: boolean,
): Chapter9MicroCheckAttemptRow => ({
  id: `row-${questionId}`,
  user_id: 'student-c9',
  chapter_id: 'ch-9',
  check_id: 'mc-9-test',
  question_id: questionId,
  concept_id: conceptId,
  difficulty: 'application',
  selected_answer: correct ? 'a' : 'b',
  is_correct: correct,
  answered_at: '2026-09-27T00:15:00.000Z',
  created_at: '2026-09-27T00:15:00.000Z',
})

describe('C9-5 persisted micro-check evidence adapter', () => {
  it('converts persisted rows into immutable initial micro-check evidence', () => {
    const records = chapter9MicroCheckRowsToEvidence([
      row('mcq-9-001', 'ch9-epidermis-skin-barrier', false),
    ])

    expect(records).toEqual([
      expect.objectContaining({
        chapterId: 'ch-9',
        conceptFamilyId: 'ch9-epidermis-skin-barrier',
        source: 'micro_check',
        itemId: 'mcq-9-001',
        correct: false,
        attemptPhase: 'initial',
      }),
    ])
  })

  it('feeds persisted first-attempt accuracy into the shared Chapter 9 grade input', () => {
    const rows = [
      row('mcq-9-001', 'ch9-epidermis-skin-barrier', true),
      row('mcq-9-002', 'ch9-epidermis-skin-barrier', false),
    ]

    expect(calculatePersistedChapter9MicroCheckPercent(rows)).toBe(50)
    expect(withPersistedChapter9MicroCheckGrade({ chapterAssessmentPercent: 80 }, rows)).toEqual({
      chapterAssessmentPercent: 80,
      microCheckPercent: 50,
    })
  })
})
