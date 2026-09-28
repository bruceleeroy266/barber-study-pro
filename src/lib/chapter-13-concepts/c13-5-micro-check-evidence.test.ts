import { describe, expect, it } from 'vitest'
import {
  buildChapter13MicroCheckEvidence,
  chapter13MicroChecks,
  mergeChapter13EvidenceWithoutContamination,
  validateChapter13MicroCheckPlacements,
} from './micro-checks'
import {
  buildChapter13MicroCheckDiagnostics,
  calculatePersistedChapter13MicroCheckPercent,
  chapter13MicroCheckRowsToEvidence,
  withPersistedChapter13MicroCheckGrade,
  type Chapter13MicroCheckAttemptRow,
} from './micro-check-persistence'
import { calculateChapter13ConceptMastery, type Chapter13EvidenceRecord } from './grading'
import { chapter13ContentConceptMappings, chapter13MicroCheckPlacements } from './mappings'
import { CHAPTER13_CONCEPT_FAMILY_IDS } from './concepts'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const ts = '2026-09-28T13:00:00.000Z'

describe('C13-5 Chapter 13 micro-check immutable evidence binding', () => {
  it('covers all eight canonical concept families with 16 non-recall questions', () => {
    expect(chapter13MicroChecks).toHaveLength(8)
    expect(chapter13MicroCheckPlacements).toHaveLength(8)
    expect(validateChapter13MicroCheckPlacements()).toBe(true)

    const questions = chapter13MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(16)
    expect(new Set(questions.map((question) => question.id)).size).toBe(16)
    expect(new Set(chapter13MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(CHAPTER13_CONCEPT_FAMILY_IDS),
    )
    expect(
      questions.every((question) =>
        ['understanding', 'application', 'scenario'].includes(question.difficulty),
      ),
    ).toBe(true)
  })

  it('places every check after a current Chapter 13 lesson block', () => {
    const contentIds = new Set(chapter13ContentConceptMappings.map((mapping) => mapping.contentBlockId))
    expect(chapter13MicroCheckPlacements.every((placement) => contentIds.has(placement.afterSectionId))).toBe(true)
  })

  it('binds every question to exactly the same concept as its parent check', () => {
    for (const check of chapter13MicroChecks) {
      expect(check.questions).toHaveLength(2)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })

  it('captures only the first response for a question as initial micro-check evidence', () => {
    const records = buildChapter13MicroCheckEvidence(
      'student-c13',
      [
        { questionId: 'mcq-13-013', selectedAnswer: 'a' },
        { questionId: 'mcq-13-013', selectedAnswer: 'c' },
      ],
      ts,
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      studentId: 'student-c13',
      chapterId: 'ch-13',
      conceptFamilyId: 'ch13-infection-control-service-safety',
      source: 'micro_check',
      itemId: 'mcq-13-013',
      correct: false,
      attemptPhase: 'initial',
    })
  })

  it('does not allow a later duplicate to overwrite an initial miss', () => {
    const original = buildChapter13MicroCheckEvidence(
      'student-c13',
      [{ questionId: 'mcq-13-001', selectedAnswer: 'b' }],
      ts,
    )
    expect(original[0].correct).toBe(false)

    const laterCorrect: Chapter13EvidenceRecord = {
      ...original[0],
      correct: true,
      timestamp: '2026-09-28T13:05:00.000Z',
    }

    const merged = mergeChapter13EvidenceWithoutContamination(original, [laterCorrect])
    expect(merged).toHaveLength(1)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].timestamp).toBe(ts)
  })

  it('keeps initial misses separate from later reassessment recovery evidence', () => {
    const initial = buildChapter13MicroCheckEvidence(
      'student-c13',
      [{ questionId: 'mcq-13-013', selectedAnswer: 'a' }],
      ts,
    )

    const reassessment: Chapter13EvidenceRecord = {
      studentId: 'student-c13',
      chapterId: 'ch-13',
      conceptFamilyId: 'ch13-infection-control-service-safety',
      source: 'remediation_reassessment',
      itemId: 'r13-safety-001',
      difficulty: 'scenario',
      correct: true,
      attemptPhase: 'reassessment',
      timestamp: '2026-09-28T13:10:00.000Z',
    }

    const merged = mergeChapter13EvidenceWithoutContamination(initial, [reassessment])
    const mastery = calculateChapter13ConceptMastery(merged, '2026-09-28T13:11:00.000Z')

    expect(merged).toHaveLength(2)
    expect(merged[0].attemptPhase).toBe('initial')
    expect(merged[0].correct).toBe(false)
    expect(merged[1].attemptPhase).toBe('reassessment')
    expect(mastery.initialMissCount).toBe(1)
    expect(mastery.reassessmentCorrectCount).toBe(1)
  })

  it('converts persisted rows to the shared evidence contract and returns all eight concept diagnostics', () => {
    const rows: Chapter13MicroCheckAttemptRow[] = [
      {
        id: 'row-1',
        user_id: 'student-c13',
        chapter_id: 'ch-13',
        check_id: 'mc-13-01',
        question_id: 'mcq-13-001',
        concept_id: 'ch13-consultation-service-preparation',
        difficulty: 'application',
        selected_answer: 'a',
        is_correct: true,
        answered_at: ts,
        created_at: ts,
      },
      {
        id: 'row-2',
        user_id: 'student-c13',
        chapter_id: 'ch-13',
        check_id: 'mc-13-07',
        question_id: 'mcq-13-013',
        concept_id: 'ch13-infection-control-service-safety',
        difficulty: 'scenario',
        selected_answer: 'a',
        is_correct: false,
        answered_at: ts,
        created_at: ts,
      },
    ]

    const evidence = chapter13MicroCheckRowsToEvidence(rows)
    expect(evidence).toHaveLength(2)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(evidence.every((record) => record.attemptPhase === 'initial')).toBe(true)

    const diagnostics = buildChapter13MicroCheckDiagnostics(rows, '2026-09-28T13:15:00.000Z')
    expect(diagnostics).toHaveLength(8)
    expect(new Set(diagnostics.map((item) => item.conceptFamilyId))).toEqual(
      new Set(CHAPTER13_CONCEPT_FAMILY_IDS),
    )
  })

  it('feeds persisted micro-check accuracy into the unchanged shared grade contract', () => {
    const rows: Chapter13MicroCheckAttemptRow[] = [
      {
        id: 'row-1', user_id: 'student-c13', chapter_id: 'ch-13', check_id: 'mc-13-01',
        question_id: 'mcq-13-001', concept_id: 'ch13-consultation-service-preparation',
        difficulty: 'application', selected_answer: 'a', is_correct: true, answered_at: ts, created_at: ts,
      },
      {
        id: 'row-2', user_id: 'student-c13', chapter_id: 'ch-13', check_id: 'mc-13-01',
        question_id: 'mcq-13-002', concept_id: 'ch13-consultation-service-preparation',
        difficulty: 'scenario', selected_answer: 'a', is_correct: false, answered_at: ts, created_at: ts,
      },
    ]

    expect(calculatePersistedChapter13MicroCheckPercent(rows)).toBe(50)

    const input = withPersistedChapter13MicroCheckGrade({
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
