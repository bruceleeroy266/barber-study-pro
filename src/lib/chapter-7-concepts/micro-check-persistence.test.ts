import { describe, expect, it } from 'vitest'
import { CHAPTER7_GRADE_WEIGHTS, calculateChapter7Grade } from './grading'
import {
  buildChapter7MicroCheckDiagnostics,
  calculatePersistedChapter7MicroCheckPercent,
  chapter7MicroCheckRowsToEvidence,
  type Chapter7MicroCheckAttemptRow,
  withPersistedChapter7MicroCheckGrade,
} from './micro-check-persistence'

const rows: Chapter7MicroCheckAttemptRow[] = [
  {
    id: '1',
    user_id: 'student-1',
    chapter_id: 'ch-7',
    check_id: 'mc-7-01',
    question_id: 'mcq-7-001',
    concept_id: 'ch7-organic-inorganic',
    difficulty: 'understanding',
    selected_answer: 'a',
    is_correct: true,
    answered_at: '2026-09-25T12:00:00.000Z',
    created_at: '2026-09-25T12:00:00.000Z',
  },
  {
    id: '2',
    user_id: 'student-1',
    chapter_id: 'ch-7',
    check_id: 'mc-7-01',
    question_id: 'mcq-7-002',
    concept_id: 'ch7-organic-inorganic',
    difficulty: 'application',
    selected_answer: 'b',
    is_correct: false,
    answered_at: '2026-09-25T12:01:00.000Z',
    created_at: '2026-09-25T12:01:00.000Z',
  },
]

describe('Chapter 7 persisted micro-check evidence', () => {
  it('calculates the persisted micro-check percentage from immutable rows', () => {
    expect(calculatePersistedChapter7MicroCheckPercent(rows)).toBe(50)
    expect(calculatePersistedChapter7MicroCheckPercent([])).toBeNull()
  })

  it('converts rows into initial micro_check mastery evidence', () => {
    const evidence = chapter7MicroCheckRowsToEvidence(rows)
    expect(evidence).toHaveLength(2)
    expect(evidence[0]).toMatchObject({
      source: 'micro_check',
      attemptPhase: 'initial',
      conceptFamilyId: 'ch7-organic-inorganic',
      itemId: 'mcq-7-001',
      correct: true,
    })
  })

  it('keeps all ten concepts visible to instructor diagnostics', () => {
    const diagnostics = buildChapter7MicroCheckDiagnostics(rows, '2026-09-26T12:00:00.000Z')
    expect(diagnostics).toHaveLength(10)

    const organic = diagnostics.find((item) => item.conceptFamilyId === 'ch7-organic-inorganic')
    expect(organic).toMatchObject({ answered: 2, correct: 1, percent: 50 })

    const safety = diagnostics.find((item) => item.conceptFamilyId === 'ch7-chemical-safety')
    expect(safety).toMatchObject({
      answered: 0,
      correct: 0,
      percent: 0,
      confidenceFromMicroChecks: 'insufficient_evidence',
    })
  })

  it('feeds the persisted score into grading without changing the locked hierarchy', () => {
    const gradeInput = withPersistedChapter7MicroCheckGrade(
      {
        flashcardPercent: 100,
        chapterAssessmentPercent: 80,
        scenarioApplicationPercent: 90,
      },
      rows,
    )

    expect(gradeInput.microCheckPercent).toBe(50)
    expect(CHAPTER7_GRADE_WEIGHTS.micro_check).toBe(0.20)
    expect(CHAPTER7_GRADE_WEIGHTS.chapter_assessment).toBe(0.40)
    expect(CHAPTER7_GRADE_WEIGHTS.micro_check).toBeLessThan(CHAPTER7_GRADE_WEIGHTS.chapter_assessment)

    const grade = calculateChapter7Grade(gradeInput)
    expect(grade.componentWeights.micro_check).toBe(0.20)
    expect(grade.componentWeights.chapter_assessment).toBe(0.40)
  })
})
