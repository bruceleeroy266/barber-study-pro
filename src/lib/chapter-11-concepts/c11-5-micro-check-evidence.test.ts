import { describe, expect, it } from 'vitest'
import {
  buildChapter11MicroCheckEvidence,
  chapter11MicroChecks,
  mergeChapter11EvidenceWithoutContamination,
  validateChapter11MicroCheckPlacements,
} from './micro-checks'
import {
  buildChapter11MicroCheckDiagnostics,
  calculatePersistedChapter11MicroCheckPercent,
  chapter11MicroCheckRowsToEvidence,
  withPersistedChapter11MicroCheckGrade,
  type Chapter11MicroCheckAttemptRow,
} from './micro-check-persistence'
import { calculateChapter11ConceptMastery, type Chapter11EvidenceRecord } from './grading'
import { chapter11ContentConceptMappings, chapter11MicroCheckPlacements } from './mappings'
import { CHAPTER11_CONCEPT_FAMILY_IDS } from './concepts'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const ts = '2026-09-28T02:50:00.000Z'

describe('C11-5 Chapter 11 micro-check immutable evidence binding', () => {
  it('covers all eight canonical concept families with 17 non-recall questions', () => {
    expect(chapter11MicroChecks).toHaveLength(8)
    expect(chapter11MicroCheckPlacements).toHaveLength(8)
    expect(validateChapter11MicroCheckPlacements()).toBe(true)

    const questions = chapter11MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(17)
    expect(new Set(questions.map((question) => question.id)).size).toBe(17)
    expect(new Set(chapter11MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(CHAPTER11_CONCEPT_FAMILY_IDS),
    )
    expect(
      questions.every((question) =>
        ['understanding', 'application', 'scenario'].includes(question.difficulty),
      ),
    ).toBe(true)
  })

  it('places every check after a current Chapter 11 lesson block', () => {
    const contentIds = new Set(chapter11ContentConceptMappings.map((mapping) => mapping.contentBlockId))
    expect(chapter11MicroCheckPlacements.every((placement) => contentIds.has(placement.afterSectionId))).toBe(true)
  })

  it('binds every question to exactly the same concept as its parent check', () => {
    for (const check of chapter11MicroChecks) {
      expect(check.questions.length).toBeGreaterThanOrEqual(2)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })

  it('captures only the first response for a question as initial micro-check evidence', () => {
    const records = buildChapter11MicroCheckEvidence(
      'student-c11',
      [
        { questionId: 'mcq-11-013', selectedAnswer: 'a' },
        { questionId: 'mcq-11-013', selectedAnswer: 'c' },
      ],
      ts,
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      studentId: 'student-c11',
      chapterId: 'ch-11',
      conceptFamilyId: 'ch11-service-safety-referral',
      source: 'micro_check',
      itemId: 'mcq-11-013',
      correct: false,
      attemptPhase: 'initial',
    })
  })

  it('does not allow a later duplicate to overwrite an initial miss', () => {
    const original = buildChapter11MicroCheckEvidence(
      'student-c11',
      [{ questionId: 'mcq-11-001', selectedAnswer: 'a' }],
      ts,
    )
    expect(original[0].correct).toBe(false)

    const laterCorrect: Chapter11EvidenceRecord = {
      ...original[0],
      correct: true,
      timestamp: '2026-09-28T03:00:00.000Z',
    }

    const merged = mergeChapter11EvidenceWithoutContamination(original, [laterCorrect])
    expect(merged).toHaveLength(1)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].timestamp).toBe(ts)
  })

  it('keeps initial misses separate from later reassessment recovery evidence', () => {
    const initial = buildChapter11MicroCheckEvidence(
      'student-c11',
      [{ questionId: 'mcq-11-013', selectedAnswer: 'a' }],
      ts,
    )

    const reassessment: Chapter11EvidenceRecord = {
      studentId: 'student-c11',
      chapterId: 'ch-11',
      conceptFamilyId: 'ch11-service-safety-referral',
      source: 'remediation_reassessment',
      itemId: 'r11-service-safety-001',
      difficulty: 'scenario',
      correct: true,
      attemptPhase: 'reassessment',
      timestamp: '2026-09-28T03:10:00.000Z',
    }

    const merged = mergeChapter11EvidenceWithoutContamination(initial, [reassessment])
    const mastery = calculateChapter11ConceptMastery(merged, '2026-09-28T03:11:00.000Z')

    expect(merged).toHaveLength(2)
    expect(merged[0].attemptPhase).toBe('initial')
    expect(merged[0].correct).toBe(false)
    expect(merged[1].attemptPhase).toBe('reassessment')
    expect(mastery.initialMissCount).toBe(1)
    expect(mastery.reassessmentCorrectCount).toBe(1)
  })

  it('converts persisted rows to the same shared evidence contract and produces all concept diagnostics', () => {
    const rows: Chapter11MicroCheckAttemptRow[] = [
      {
        id: 'row-1',
        user_id: 'student-c11',
        chapter_id: 'ch-11',
        check_id: 'mc-11-01',
        question_id: 'mcq-11-001',
        concept_id: 'ch11-shampoo-draping-service',
        difficulty: 'application',
        selected_answer: 'b',
        is_correct: true,
        answered_at: ts,
        created_at: ts,
      },
      {
        id: 'row-2',
        user_id: 'student-c11',
        chapter_id: 'ch-11',
        check_id: 'mc-11-07',
        question_id: 'mcq-11-013',
        concept_id: 'ch11-service-safety-referral',
        difficulty: 'scenario',
        selected_answer: 'a',
        is_correct: false,
        answered_at: ts,
        created_at: ts,
      },
    ]

    const evidence = chapter11MicroCheckRowsToEvidence(rows)
    expect(evidence).toHaveLength(2)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(evidence.every((record) => record.attemptPhase === 'initial')).toBe(true)

    const diagnostics = buildChapter11MicroCheckDiagnostics(rows, '2026-09-28T03:00:00.000Z')
    expect(diagnostics).toHaveLength(8)
    expect(new Set(diagnostics.map((item) => item.conceptFamilyId))).toEqual(
      new Set(CHAPTER11_CONCEPT_FAMILY_IDS),
    )
  })

  it('feeds persisted micro-check accuracy into the existing shared grade contract without changing weights', () => {
    const rows: Chapter11MicroCheckAttemptRow[] = [
      {
        id: 'row-1', user_id: 'student-c11', chapter_id: 'ch-11', check_id: 'mc-11-01',
        question_id: 'mcq-11-001', concept_id: 'ch11-shampoo-draping-service',
        difficulty: 'application', selected_answer: 'b', is_correct: true, answered_at: ts, created_at: ts,
      },
      {
        id: 'row-2', user_id: 'student-c11', chapter_id: 'ch-11', check_id: 'mc-11-01',
        question_id: 'mcq-11-002', concept_id: 'ch11-shampoo-draping-service',
        difficulty: 'scenario', selected_answer: 'a', is_correct: false, answered_at: ts, created_at: ts,
      },
    ]

    expect(calculatePersistedChapter11MicroCheckPercent(rows)).toBe(50)

    const input = withPersistedChapter11MicroCheckGrade({
      microCheckPercent: null,
      flashcardPercent: 90,
      chapterAssessmentPercent: 80,
      scenarioApplicationPercent: 85,
      remediationReassessmentPercent: null,
    }, rows)

    expect(input.microCheckPercent).toBe(50)
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })
})
