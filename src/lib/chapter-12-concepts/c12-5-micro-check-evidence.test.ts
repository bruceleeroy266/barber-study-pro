import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter12PremiumContent } from '../chapter-12-premium'
import {
  buildChapter12MicroCheckEvidence,
  chapter12MicroChecks,
  mergeChapter12EvidenceWithoutContamination,
  validateChapter12MicroCheckPlacements,
} from './micro-checks'
import {
  buildChapter12MicroCheckDiagnostics,
  calculatePersistedChapter12MicroCheckPercent,
  chapter12MicroCheckRowsToEvidence,
  withPersistedChapter12MicroCheckGrade,
  type Chapter12MicroCheckAttemptRow,
} from './micro-check-persistence'
import { calculateChapter12ConceptMastery, type Chapter12EvidenceRecord } from './grading'
import { chapter12MicroCheckPlacements } from './mappings'
import { CHAPTER12_CONCEPT_FAMILY_IDS } from './concepts'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const ts = '2026-09-28T07:00:00.000Z'

describe('C12-5 Chapter 12 micro-check immutable evidence binding', () => {
  it('covers all eight canonical concepts with 16 unique non-recall questions', () => {
    expect(chapter12MicroChecks).toHaveLength(8)
    expect(chapter12MicroCheckPlacements).toHaveLength(8)
    expect(validateChapter12MicroCheckPlacements()).toBe(true)

    const questions = chapter12MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(16)
    expect(new Set(questions.map((question) => question.id)).size).toBe(16)
    expect(new Set(chapter12MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(CHAPTER12_CONCEPT_FAMILY_IDS),
    )
    expect(
      questions.every((question) =>
        ['understanding', 'application', 'scenario'].includes(question.difficulty),
      ),
    ).toBe(true)
  })

  it('places each check after a current Chapter 12 lesson section', () => {
    const sectionIds = new Set(chapter12PremiumContent.sections.map((section) => section.id))
    expect(chapter12MicroCheckPlacements.every((placement) => sectionIds.has(placement.afterSectionId))).toBe(true)
    expect(new Set(chapter12MicroCheckPlacements.map((placement) => placement.afterSectionId)).size).toBe(8)
  })

  it('binds every question to the same concept as its parent check', () => {
    for (const check of chapter12MicroChecks) {
      expect(check.questions).toHaveLength(2)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })

  it('captures only the first response for a question as initial academic evidence', () => {
    const records = buildChapter12MicroCheckEvidence(
      'student-c12',
      [
        { questionId: 'mcq-12-013', selectedAnswer: 'a' },
        { questionId: 'mcq-12-013', selectedAnswer: 'b' },
      ],
      ts,
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      studentId: 'student-c12',
      chapterId: 'ch-12',
      conceptFamilyId: 'ch12-contraindications-service-safety',
      source: 'micro_check',
      itemId: 'mcq-12-013',
      correct: false,
      attemptPhase: 'initial',
    })
  })

  it('does not let a later duplicate erase an original miss', () => {
    const original = buildChapter12MicroCheckEvidence(
      'student-c12',
      [{ questionId: 'mcq-12-001', selectedAnswer: 'a' }],
      ts,
    )
    expect(original[0].correct).toBe(false)

    const laterCorrect: Chapter12EvidenceRecord = {
      ...original[0],
      correct: true,
      timestamp: '2026-09-28T07:05:00.000Z',
    }

    const merged = mergeChapter12EvidenceWithoutContamination(original, [laterCorrect])
    expect(merged).toHaveLength(1)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].timestamp).toBe(ts)
  })

  it('keeps a future reassessment record separate from the preserved first-attempt miss', () => {
    const initial = buildChapter12MicroCheckEvidence(
      'student-c12',
      [{ questionId: 'mcq-12-014', selectedAnswer: 'a' }],
      ts,
    )

    const reassessment: Chapter12EvidenceRecord = {
      studentId: 'student-c12',
      chapterId: 'ch-12',
      conceptFamilyId: 'ch12-contraindications-service-safety',
      source: 'remediation_reassessment',
      itemId: 'r12-safety-001',
      difficulty: 'scenario',
      correct: true,
      attemptPhase: 'reassessment',
      timestamp: '2026-09-28T07:10:00.000Z',
    }

    const merged = mergeChapter12EvidenceWithoutContamination(initial, [reassessment])
    const mastery = calculateChapter12ConceptMastery(merged, '2026-09-28T07:11:00.000Z')

    expect(merged).toHaveLength(2)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].attemptPhase).toBe('initial')
    expect(merged[1].attemptPhase).toBe('reassessment')
    expect(mastery.initialMissCount).toBe(1)
    expect(mastery.reassessmentCorrectCount).toBe(1)
  })

  it('converts persisted rows into shared micro-check evidence and eight concept diagnostics', () => {
    const rows: Chapter12MicroCheckAttemptRow[] = [
      {
        id: 'row-1',
        user_id: 'student-c12',
        chapter_id: 'ch-12',
        check_id: 'mc-12-01',
        question_id: 'mcq-12-001',
        concept_id: 'ch12-facial-anatomy-neurovascular',
        difficulty: 'understanding',
        selected_answer: 'b',
        is_correct: true,
        answered_at: ts,
        created_at: ts,
      },
      {
        id: 'row-2',
        user_id: 'student-c12',
        chapter_id: 'ch-12',
        check_id: 'mc-12-07',
        question_id: 'mcq-12-013',
        concept_id: 'ch12-contraindications-service-safety',
        difficulty: 'scenario',
        selected_answer: 'a',
        is_correct: false,
        answered_at: ts,
        created_at: ts,
      },
    ]

    const evidence = chapter12MicroCheckRowsToEvidence(rows)
    expect(evidence).toHaveLength(2)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(evidence.every((record) => record.attemptPhase === 'initial')).toBe(true)

    const diagnostics = buildChapter12MicroCheckDiagnostics(rows, '2026-09-28T07:20:00.000Z')
    expect(diagnostics).toHaveLength(8)
    expect(new Set(diagnostics.map((item) => item.conceptFamilyId))).toEqual(
      new Set(CHAPTER12_CONCEPT_FAMILY_IDS),
    )
  })

  it('uses first-attempt correctness for the 20% micro-check grade component, not completion', () => {
    const rows: Chapter12MicroCheckAttemptRow[] = [
      {
        id: 'row-1', user_id: 'student-c12', chapter_id: 'ch-12', check_id: 'mc-12-01',
        question_id: 'mcq-12-001', concept_id: 'ch12-facial-anatomy-neurovascular',
        difficulty: 'understanding', selected_answer: 'b', is_correct: true, answered_at: ts, created_at: ts,
      },
      {
        id: 'row-2', user_id: 'student-c12', chapter_id: 'ch-12', check_id: 'mc-12-01',
        question_id: 'mcq-12-002', concept_id: 'ch12-facial-anatomy-neurovascular',
        difficulty: 'application', selected_answer: 'a', is_correct: false, answered_at: ts, created_at: ts,
      },
    ]

    expect(calculatePersistedChapter12MicroCheckPercent(rows)).toBe(50)

    const input = withPersistedChapter12MicroCheckGrade({
      microCheckPercent: null,
      flashcardPercent: 90,
      chapterAssessmentPercent: 80,
      scenarioApplicationPercent: 85,
      remediationReassessmentPercent: null,
    }, rows)

    expect(input.microCheckPercent).toBe(50)
    expect(SHARED_GRADE_WEIGHTS.micro_check).toBe(0.20)
  })

  it('reuses the existing immutable database contract without a Chapter 12 schema fork', () => {
    const migration = readFileSync(
      join(process.cwd(), 'supabase/migrations/20260926044500_create_chapter_micro_check_attempts.sql'),
      'utf8',
    )

    expect(migration).toContain('unique (user_id, chapter_id, question_id)')
    expect(migration).toContain('grant select, insert on table public.chapter_micro_check_attempts to authenticated')
    expect(migration).not.toContain('grant update')
    expect(migration).not.toContain('grant delete')
  })

  it('wires Chapter 12 micro-check load, render, restore, and persistence into ChapterContent', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/components/chapter/ChapterContent.tsx'),
      'utf8',
    )

    expect(source).toContain("import Chapter12MicroCheckCard from './Chapter12MicroCheckCard'")
    expect(source).toContain('loadChapter12MicroCheckAttempts')
    expect(source).toContain("chapterId !== 'ch-12'")
    expect(source).toContain("const chapter12MicroCheck = chapterId === 'ch-12'")
    expect(source).toContain('<Chapter12MicroCheckCard')
    expect(source).toContain('onAttemptPersisted={handleChapter12MicroCheckPersisted}')
  })
})
