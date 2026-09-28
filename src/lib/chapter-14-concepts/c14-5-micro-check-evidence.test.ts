import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter14PremiumContent } from '../chapter-14-premium'
import {
  buildChapter14MicroCheckEvidence,
  chapter14MicroChecks,
  mergeChapter14EvidenceWithoutContamination,
  validateChapter14MicroCheckPlacements,
} from './micro-checks'
import {
  buildChapter14MicroCheckDiagnostics,
  calculatePersistedChapter14MicroCheckPercent,
  chapter14MicroCheckRowsToEvidence,
  withPersistedChapter14MicroCheckGrade,
  type Chapter14MicroCheckAttemptRow,
} from './micro-check-persistence'
import { calculateChapter14ConceptMastery, type Chapter14EvidenceRecord } from './grading'
import { chapter14MicroCheckPlacements } from './mappings'
import { CHAPTER14_CONCEPT_FAMILY_IDS } from './concepts'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const ts = '2026-09-28T18:00:00.000Z'

describe('C14-5 Chapter 14 micro-check immutable evidence binding', () => {
  it('covers all seven canonical concepts with 14 unique non-recall questions', () => {
    expect(chapter14MicroChecks).toHaveLength(7)
    expect(chapter14MicroCheckPlacements).toHaveLength(7)
    expect(validateChapter14MicroCheckPlacements()).toBe(true)

    const questions = chapter14MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(14)
    expect(new Set(questions.map((question) => question.id)).size).toBe(14)
    expect(new Set(chapter14MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(CHAPTER14_CONCEPT_FAMILY_IDS),
    )
    expect(
      questions.every((question) =>
        ['understanding', 'application', 'scenario'].includes(question.difficulty),
      ),
    ).toBe(true)
  })

  it('places each check after a current Chapter 14 lesson section', () => {
    const sectionIds = new Set(chapter14PremiumContent.sections.map((section) => section.id))
    expect(chapter14MicroCheckPlacements.every((placement) => sectionIds.has(placement.afterSectionId))).toBe(true)
    expect(new Set(chapter14MicroCheckPlacements.map((placement) => placement.afterSectionId)).size).toBe(7)
  })

  it('binds every question to the same concept as its parent check', () => {
    for (const check of chapter14MicroChecks) {
      expect(check.questions).toHaveLength(2)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })

  it('captures only the first response for a question as initial academic evidence', () => {
    const records = buildChapter14MicroCheckEvidence(
      'student-c14',
      [
        { questionId: 'mcq-14-013', selectedAnswer: 'a' },
        { questionId: 'mcq-14-013', selectedAnswer: 'c' },
      ],
      ts,
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      studentId: 'student-c14',
      chapterId: 'ch-14',
      conceptFamilyId: 'ch14-service-safety-sanitation',
      source: 'micro_check',
      itemId: 'mcq-14-013',
      correct: false,
      attemptPhase: 'initial',
    })
  })

  it('does not let a later duplicate erase an original miss', () => {
    const original = buildChapter14MicroCheckEvidence(
      'student-c14',
      [{ questionId: 'mcq-14-001', selectedAnswer: 'a' }],
      ts,
    )
    expect(original[0].correct).toBe(false)

    const laterCorrect: Chapter14EvidenceRecord = {
      ...original[0],
      correct: true,
      timestamp: '2026-09-28T18:05:00.000Z',
    }

    const merged = mergeChapter14EvidenceWithoutContamination(original, [laterCorrect])
    expect(merged).toHaveLength(1)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].timestamp).toBe(ts)
  })

  it('keeps future reassessment evidence separate from the preserved first-attempt miss', () => {
    const initial = buildChapter14MicroCheckEvidence(
      'student-c14',
      [{ questionId: 'mcq-14-014', selectedAnswer: 'a' }],
      ts,
    )

    const reassessment: Chapter14EvidenceRecord = {
      studentId: 'student-c14',
      chapterId: 'ch-14',
      conceptFamilyId: 'ch14-service-safety-sanitation',
      source: 'remediation_reassessment',
      itemId: 'r14-safety-001',
      difficulty: 'scenario',
      correct: true,
      attemptPhase: 'reassessment',
      timestamp: '2026-09-28T18:10:00.000Z',
    }

    const merged = mergeChapter14EvidenceWithoutContamination(initial, [reassessment])
    const mastery = calculateChapter14ConceptMastery(merged, '2026-09-28T18:11:00.000Z')

    expect(merged).toHaveLength(2)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].attemptPhase).toBe('initial')
    expect(merged[1].attemptPhase).toBe('reassessment')
    expect(mastery.initialMissCount).toBe(1)
    expect(mastery.reassessmentCorrectCount).toBe(1)
  })

  it('converts persisted rows into shared micro-check evidence and seven concept diagnostics', () => {
    const rows: Chapter14MicroCheckAttemptRow[] = [
      {
        id: 'row-1', user_id: 'student-c14', chapter_id: 'ch-14', check_id: 'mc-14-01',
        question_id: 'mcq-14-001', concept_id: 'ch14-consultation-professional-design',
        difficulty: 'application', selected_answer: 'b', is_correct: true, answered_at: ts, created_at: ts,
      },
      {
        id: 'row-2', user_id: 'student-c14', chapter_id: 'ch-14', check_id: 'mc-14-07',
        question_id: 'mcq-14-013', concept_id: 'ch14-service-safety-sanitation',
        difficulty: 'scenario', selected_answer: 'a', is_correct: false, answered_at: ts, created_at: ts,
      },
    ]

    const evidence = chapter14MicroCheckRowsToEvidence(rows)
    expect(evidence).toHaveLength(2)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(evidence.every((record) => record.attemptPhase === 'initial')).toBe(true)

    const diagnostics = buildChapter14MicroCheckDiagnostics(rows, '2026-09-28T18:20:00.000Z')
    expect(diagnostics).toHaveLength(7)
    expect(new Set(diagnostics.map((item) => item.conceptFamilyId))).toEqual(
      new Set(CHAPTER14_CONCEPT_FAMILY_IDS),
    )
  })

  it('uses first-attempt correctness for the 20% micro-check grade component, not completion', () => {
    const rows: Chapter14MicroCheckAttemptRow[] = [
      {
        id: 'row-1', user_id: 'student-c14', chapter_id: 'ch-14', check_id: 'mc-14-03',
        question_id: 'mcq-14-005', concept_id: 'ch14-cutting-geometry-guides',
        difficulty: 'understanding', selected_answer: 'b', is_correct: true, answered_at: ts, created_at: ts,
      },
      {
        id: 'row-2', user_id: 'student-c14', chapter_id: 'ch-14', check_id: 'mc-14-03',
        question_id: 'mcq-14-006', concept_id: 'ch14-cutting-geometry-guides',
        difficulty: 'scenario', selected_answer: 'a', is_correct: false, answered_at: ts, created_at: ts,
      },
    ]

    expect(calculatePersistedChapter14MicroCheckPercent(rows)).toBe(50)

    const input = withPersistedChapter14MicroCheckGrade({
      microCheckPercent: null,
      flashcardPercent: 90,
      chapterAssessmentPercent: 80,
      scenarioApplicationPercent: 85,
      remediationReassessmentPercent: null,
    }, rows)

    expect(input.microCheckPercent).toBe(50)
    expect(SHARED_GRADE_WEIGHTS.micro_check).toBe(0.20)
  })

  it('reuses the existing immutable database contract without a Chapter 14 schema fork', () => {
    const migration = readFileSync(
      join(process.cwd(), 'supabase/migrations/20260926044500_create_chapter_micro_check_attempts.sql'),
      'utf8',
    )

    expect(migration).toContain('unique (user_id, chapter_id, question_id)')
    expect(migration).toContain('grant select, insert on table public.chapter_micro_check_attempts to authenticated')
    expect(migration).not.toContain('grant update')
    expect(migration).not.toContain('grant delete')
  })

  it('wires Chapter 14 micro-check load, render, restore, and persistence into ChapterContent', () => {
    const source = readFileSync(join(process.cwd(), 'src/components/chapter/ChapterContent.tsx'), 'utf8')

    expect(source).toContain("import Chapter14MicroCheckCard from './Chapter14MicroCheckCard'")
    expect(source).toContain('loadChapter14MicroCheckAttempts')
    expect(source).toContain("chapterId !== 'ch-14'")
    expect(source).toContain("const chapter14MicroCheck = chapterId === 'ch-14'")
    expect(source).toContain('<Chapter14MicroCheckCard')
    expect(source).toContain('onAttemptPersisted={handleChapter14MicroCheckPersisted}')
  })
})
