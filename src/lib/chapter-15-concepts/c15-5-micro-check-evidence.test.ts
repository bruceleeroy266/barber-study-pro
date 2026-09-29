import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter15PremiumContent } from '../chapter-15-premium'
import { chapter15PremiumFlashcards } from '../chapter-15-premium-flashcards'
import { chapter15PremiumQuizQuestions } from '../chapter-15-premium-quiz'
import {
  buildChapter15MicroCheckEvidence,
  chapter15MicroChecks,
  mergeChapter15EvidenceWithoutContamination,
  validateChapter15MicroCheckPlacements,
} from './micro-checks'
import {
  buildChapter15MicroCheckDiagnostics,
  calculatePersistedChapter15MicroCheckPercent,
  chapter15MicroCheckRowsToEvidence,
  withPersistedChapter15MicroCheckGrade,
  type Chapter15MicroCheckAttemptRow,
} from './micro-check-persistence'
import { calculateChapter15ConceptMastery, type Chapter15EvidenceRecord } from './grading'
import { chapter15MicroCheckPlacements } from './mappings'
import { CHAPTER15_CONCEPT_FAMILY_IDS } from './concepts'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const ts = '2026-09-29T05:30:00.000Z'

describe('C15-5 Chapter 15 micro-check immutable evidence integration', () => {
  it('preserves the certified 54/90/72 inventories', () => {
    expect(chapter15PremiumContent.sections).toHaveLength(54)
    expect(chapter15PremiumFlashcards).toHaveLength(90)
    expect(chapter15PremiumQuizQuestions).toHaveLength(72)
  })

  it('covers all seven canonical concepts with 14 unique non-recall questions', () => {
    expect(chapter15MicroChecks).toHaveLength(7)
    expect(chapter15MicroCheckPlacements).toHaveLength(7)
    expect(validateChapter15MicroCheckPlacements()).toBe(true)

    const questions = chapter15MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(14)
    expect(new Set(questions.map((question) => question.id)).size).toBe(14)
    expect(new Set(chapter15MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(CHAPTER15_CONCEPT_FAMILY_IDS),
    )
    expect(
      questions.every((question) =>
        ['understanding', 'application', 'scenario'].includes(question.difficulty),
      ),
    ).toBe(true)
  })

  it('places each two-question check after its certified current lesson section', () => {
    const sectionIds = new Set(chapter15PremiumContent.sections.map((section) => section.id))
    expect(chapter15MicroCheckPlacements.every((placement) => sectionIds.has(placement.afterSectionId))).toBe(true)
    expect(new Set(chapter15MicroCheckPlacements.map((placement) => placement.afterSectionId)).size).toBe(7)

    for (const check of chapter15MicroChecks) {
      expect(check.questions).toHaveLength(2)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })

  it('captures only the first response for a question as initial academic evidence', () => {
    const records = buildChapter15MicroCheckEvidence(
      'student-c15',
      [
        { questionId: 'mcq-15-009', selectedAnswer: 'a' },
        { questionId: 'mcq-15-009', selectedAnswer: 'c' },
      ],
      ts,
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      studentId: 'student-c15',
      chapterId: 'ch-15',
      conceptFamilyId: 'ch15-attachment-methods-bonding',
      source: 'micro_check',
      itemId: 'mcq-15-009',
      correct: false,
      attemptPhase: 'initial',
    })
  })

  it('does not let a later duplicate erase an original miss', () => {
    const original = buildChapter15MicroCheckEvidence(
      'student-c15',
      [{ questionId: 'mcq-15-001', selectedAnswer: 'a' }],
      ts,
    )
    expect(original[0].correct).toBe(false)

    const laterCorrect: Chapter15EvidenceRecord = {
      ...original[0],
      correct: true,
      timestamp: '2026-09-29T05:35:00.000Z',
    }

    const merged = mergeChapter15EvidenceWithoutContamination(original, [laterCorrect])
    expect(merged).toHaveLength(1)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].timestamp).toBe(ts)
  })

  it('keeps future reassessment evidence separate from the preserved first-attempt miss', () => {
    const initial = buildChapter15MicroCheckEvidence(
      'student-c15',
      [{ questionId: 'mcq-15-012', selectedAnswer: 'a' }],
      ts,
    )

    const reassessment: Chapter15EvidenceRecord = {
      studentId: 'student-c15',
      chapterId: 'ch-15',
      conceptFamilyId: 'ch15-cleaning-maintenance-chemical-care',
      source: 'remediation_reassessment',
      itemId: 'r15-care-001',
      difficulty: 'scenario',
      correct: true,
      attemptPhase: 'reassessment',
      timestamp: '2026-09-29T05:40:00.000Z',
    }

    const merged = mergeChapter15EvidenceWithoutContamination(initial, [reassessment])
    const mastery = calculateChapter15ConceptMastery(merged, '2026-09-29T05:41:00.000Z')

    expect(merged).toHaveLength(2)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].attemptPhase).toBe('initial')
    expect(merged[1].attemptPhase).toBe('reassessment')
    expect(mastery.initialMissCount).toBe(1)
    expect(mastery.reassessmentCorrectCount).toBe(1)
  })

  it('converts persisted rows into shared micro-check evidence and seven concept diagnostics', () => {
    const rows: Chapter15MicroCheckAttemptRow[] = [
      {
        id: 'row-1', user_id: 'student-c15', chapter_id: 'ch-15', check_id: 'mc-15-01',
        question_id: 'mcq-15-001', concept_id: 'ch15-client-consultation-ethics-marketing',
        difficulty: 'application', selected_answer: 'b', is_correct: true, answered_at: ts, created_at: ts,
      },
      {
        id: 'row-2', user_id: 'student-c15', chapter_id: 'ch-15', check_id: 'mc-15-06',
        question_id: 'mcq-15-011', concept_id: 'ch15-cleaning-maintenance-chemical-care',
        difficulty: 'application', selected_answer: 'a', is_correct: false, answered_at: ts, created_at: ts,
      },
    ]

    const evidence = chapter15MicroCheckRowsToEvidence(rows)
    expect(evidence).toHaveLength(2)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(evidence.every((record) => record.attemptPhase === 'initial')).toBe(true)

    const diagnostics = buildChapter15MicroCheckDiagnostics(rows, '2026-09-29T05:45:00.000Z')
    expect(diagnostics).toHaveLength(7)
    expect(new Set(diagnostics.map((item) => item.conceptFamilyId))).toEqual(
      new Set(CHAPTER15_CONCEPT_FAMILY_IDS),
    )
  })

  it('uses first-attempt correctness for the 20% micro-check grade component', () => {
    const rows: Chapter15MicroCheckAttemptRow[] = [
      {
        id: 'row-1', user_id: 'student-c15', chapter_id: 'ch-15', check_id: 'mc-15-03',
        question_id: 'mcq-15-005', concept_id: 'ch15-hair-materials-base-construction',
        difficulty: 'understanding', selected_answer: 'b', is_correct: true, answered_at: ts, created_at: ts,
      },
      {
        id: 'row-2', user_id: 'student-c15', chapter_id: 'ch-15', check_id: 'mc-15-03',
        question_id: 'mcq-15-006', concept_id: 'ch15-hair-materials-base-construction',
        difficulty: 'application', selected_answer: 'a', is_correct: false, answered_at: ts, created_at: ts,
      },
    ]

    expect(calculatePersistedChapter15MicroCheckPercent(rows)).toBe(50)

    const input = withPersistedChapter15MicroCheckGrade({
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

  it('reuses the existing immutable database contract without a Chapter 15 schema fork', () => {
    const migration = readFileSync(
      join(process.cwd(), 'supabase/migrations/20260926044500_create_chapter_micro_check_attempts.sql'),
      'utf8',
    )

    expect(migration).toContain('unique (user_id, chapter_id, question_id)')
    expect(migration).toContain('grant select, insert on table public.chapter_micro_check_attempts to authenticated')
    expect(migration).not.toContain('grant update')
    expect(migration).not.toContain('grant delete')
  })

  it('wires Chapter 15 micro-check load, render, restore, and persistence into ChapterContent', () => {
    const source = readFileSync(join(process.cwd(), 'src/components/chapter/ChapterContent.tsx'), 'utf8')

    expect(source).toContain("import Chapter15MicroCheckCard from './Chapter15MicroCheckCard'")
    expect(source).toContain("import { chapter15MicroChecks } from '@/lib/chapter-15-concepts/micro-checks'")
    expect(source).toContain('loadChapter15MicroCheckAttempts')
    expect(source).toContain("chapterId !== 'ch-15'")
    expect(source).toContain("chapterId === 'ch-15'")
    expect(source).toContain('<Chapter15MicroCheckCard')
    expect(source).toContain('handleChapter15MicroCheckPersisted')
  })
})
