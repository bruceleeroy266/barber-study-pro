import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter18PremiumContent } from '../chapter-18-premium'
import { chapter18PremiumFlashcards } from '../chapter-18-premium-flashcards'
import { chapter18PremiumQuizQuestions } from '../chapter-18-premium-quiz'
import {
  buildChapter18MicroCheckEvidence,
  chapter18MicroChecks,
  mergeChapter18EvidenceWithoutContamination,
  validateChapter18MicroCheckPlacements,
} from './micro-checks'
import {
  buildChapter18MicroCheckDiagnostics,
  calculatePersistedChapter18MicroCheckPercent,
  chapter18MicroCheckRowsToEvidence,
  withPersistedChapter18MicroCheckGrade,
  type Chapter18MicroCheckAttemptRow,
} from './micro-check-persistence'
import { calculateChapter18ConceptMastery, type Chapter18EvidenceRecord } from './grading'
import { chapter18MicroCheckPlacements } from './mappings'
import { CHAPTER18_CONCEPT_FAMILY_IDS } from './concepts'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const ts = '2026-09-30T02:30:00.000Z'

describe('C18-5 Chapter 18 micro-check immutable evidence integration', () => {
  it('preserves the certified 1-shell / 50-card / 15-assessment inventories', () => {
    expect(chapter18PremiumContent.sections).toHaveLength(1)
    expect(chapter18PremiumContent.sections[0]?.id).toBe('chapter-18-lesson')
    expect(chapter18PremiumFlashcards).toHaveLength(50)
    expect(chapter18PremiumQuizQuestions).toHaveLength(15)
  })

  it('creates exactly 14 unique fresh non-recall questions: two per canonical concept', () => {
    expect(chapter18MicroChecks).toHaveLength(7)
    expect(chapter18MicroCheckPlacements).toHaveLength(7)
    expect(validateChapter18MicroCheckPlacements()).toBe(true)

    const questions = chapter18MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(14)
    expect(new Set(questions.map((question) => question.id)).size).toBe(14)
    expect(questions.map((question) => question.id)).toEqual(
      Array.from({ length: 14 }, (_, index) => `mcq-18-${String(index + 1).padStart(3, '0')}`),
    )
    expect(new Set(chapter18MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(CHAPTER18_CONCEPT_FAMILY_IDS),
    )
    expect(questions.every((question) => ['understanding', 'application', 'scenario'].includes(question.difficulty))).toBe(true)

    const assessmentPrompts = new Set(chapter18PremiumQuizQuestions.map((question) => question.question))
    expect(questions.every((question) => !assessmentPrompts.has(question.question))).toBe(true)
  })

  it('binds exactly two questions to each of the seven concept families', () => {
    for (const check of chapter18MicroChecks) {
      expect(check.questions).toHaveLength(2)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }

    for (const conceptFamilyId of CHAPTER18_CONCEPT_FAMILY_IDS) {
      const questions = chapter18MicroChecks
        .flatMap((check) => check.questions)
        .filter((question) => question.conceptFamilyId === conceptFamilyId)
      expect(questions, conceptFamilyId).toHaveLength(2)
    }
  })

  it('uses the real legacy runtime shell as the placement anchor without inventing section IDs', () => {
    expect(chapter18MicroCheckPlacements.every((placement) => placement.afterSectionId === 'chapter-18-lesson')).toBe(true)
    expect(chapter18PremiumContent.sections.map((section) => section.id)).toEqual(['chapter-18-lesson'])
  })

  it('captures only the first response for a question as initial academic evidence', () => {
    const records = buildChapter18MicroCheckEvidence(
      'student-c18',
      [
        { questionId: 'mcq-18-013', selectedAnswer: 'a' },
        { questionId: 'mcq-18-013', selectedAnswer: 'c' },
      ],
      ts,
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      studentId: 'student-c18',
      chapterId: 'ch-18',
      conceptFamilyId: 'ch18-service-safety-chemical-handling',
      source: 'micro_check',
      itemId: 'mcq-18-013',
      correct: false,
      attemptPhase: 'initial',
    })
  })

  it('does not let a later duplicate erase an original miss', () => {
    const original = buildChapter18MicroCheckEvidence(
      'student-c18',
      [{ questionId: 'mcq-18-001', selectedAnswer: 'a' }],
      ts,
    )
    expect(original[0].correct).toBe(false)

    const laterCorrect: Chapter18EvidenceRecord = {
      ...original[0],
      correct: true,
      timestamp: '2026-09-30T02:35:00.000Z',
    }

    const merged = mergeChapter18EvidenceWithoutContamination(original, [laterCorrect])
    expect(merged).toHaveLength(1)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].timestamp).toBe(ts)
  })

  it('keeps future reassessment evidence separate from preserved initial misses', () => {
    const initial = buildChapter18MicroCheckEvidence(
      'student-c18',
      [{ questionId: 'mcq-18-008', selectedAnswer: 'a' }],
      ts,
    )

    const reassessment: Chapter18EvidenceRecord = {
      studentId: 'student-c18',
      chapterId: 'ch-18',
      conceptFamilyId: 'ch18-developers-lighteners-toners',
      source: 'remediation_reassessment',
      itemId: 'r18-dev-001',
      difficulty: 'scenario',
      correct: true,
      attemptPhase: 'reassessment',
      timestamp: '2026-09-30T02:40:00.000Z',
    }

    const merged = mergeChapter18EvidenceWithoutContamination(initial, [reassessment])
    const mastery = calculateChapter18ConceptMastery(merged, '2026-09-30T02:41:00.000Z')

    expect(merged).toHaveLength(2)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].attemptPhase).toBe('initial')
    expect(merged[1].attemptPhase).toBe('reassessment')
    expect(mastery.initialMissCount).toBe(1)
    expect(mastery.reassessmentCorrectCount).toBe(1)
  })

  it('converts persisted rows into shared evidence and seven concept diagnostics', () => {
    const rows: Chapter18MicroCheckAttemptRow[] = [
      {
        id: 'row-1', user_id: 'student-c18', chapter_id: 'ch-18', check_id: 'mc-18-01',
        question_id: 'mcq-18-001', concept_id: 'ch18-analysis-structure',
        difficulty: 'application', selected_answer: 'b', is_correct: true, answered_at: ts, created_at: ts,
      },
      {
        id: 'row-2', user_id: 'student-c18', chapter_id: 'ch-18', check_id: 'mc-18-07',
        question_id: 'mcq-18-013', concept_id: 'ch18-service-safety-chemical-handling',
        difficulty: 'scenario', selected_answer: 'a', is_correct: false, answered_at: ts, created_at: ts,
      },
    ]

    const evidence = chapter18MicroCheckRowsToEvidence(rows)
    expect(evidence).toHaveLength(2)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(evidence.every((record) => record.attemptPhase === 'initial')).toBe(true)

    const diagnostics = buildChapter18MicroCheckDiagnostics(rows, '2026-09-30T02:45:00.000Z')
    expect(diagnostics).toHaveLength(7)
    expect(new Set(diagnostics.map((item) => item.conceptFamilyId))).toEqual(
      new Set(CHAPTER18_CONCEPT_FAMILY_IDS),
    )
  })

  it('proves every concept family can generate durable initial evidence', () => {
    const responses = chapter18MicroChecks.map((check) => ({
      questionId: check.questions[0].id,
      selectedAnswer: check.questions[0].correctAnswer,
    }))
    const evidence = buildChapter18MicroCheckEvidence('student-c18-all', responses, ts)

    expect(evidence).toHaveLength(7)
    expect(new Set(evidence.map((record) => record.conceptFamilyId))).toEqual(
      new Set(CHAPTER18_CONCEPT_FAMILY_IDS),
    )
    expect(evidence.every((record) => record.chapterId === 'ch-18')).toBe(true)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(evidence.every((record) => record.attemptPhase === 'initial')).toBe(true)
  })

  it('feeds first-attempt correctness into the unchanged 20% shared micro-check grade component', () => {
    const rows: Chapter18MicroCheckAttemptRow[] = [
      {
        id: 'row-1', user_id: 'student-c18', chapter_id: 'ch-18', check_id: 'mc-18-02',
        question_id: 'mcq-18-003', concept_id: 'ch18-color-theory',
        difficulty: 'application', selected_answer: 'b', is_correct: true, answered_at: ts, created_at: ts,
      },
      {
        id: 'row-2', user_id: 'student-c18', chapter_id: 'ch-18', check_id: 'mc-18-02',
        question_id: 'mcq-18-004', concept_id: 'ch18-color-theory',
        difficulty: 'understanding', selected_answer: 'a', is_correct: false, answered_at: ts, created_at: ts,
      },
    ]

    expect(calculatePersistedChapter18MicroCheckPercent(rows)).toBe(50)

    const input = withPersistedChapter18MicroCheckGrade({
      microCheckPercent: null,
      flashcardPercent: 90,
      chapterAssessmentPercent: 80,
      scenarioApplicationPercent: null,
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

  it('reuses the immutable shared database contract without a Chapter 18 schema fork', () => {
    const migration = readFileSync(
      join(process.cwd(), 'supabase/migrations/20260926044500_create_chapter_micro_check_attempts.sql'),
      'utf8',
    )

    expect(migration).toContain('unique (user_id, chapter_id, question_id)')
    expect(migration).toContain('grant select, insert on table public.chapter_micro_check_attempts to authenticated')
    expect(migration).not.toContain('grant update')
    expect(migration).not.toContain('grant delete')
  })

  it('wires Chapter 18 micro-check load, render, restore, and persistence into ChapterContent', () => {
    const source = readFileSync(join(process.cwd(), 'src/components/chapter/ChapterContent.tsx'), 'utf8')

    expect(source).toContain("import Chapter18MicroCheckCard from './Chapter18MicroCheckCard'")
    expect(source).toContain("import { chapter18MicroChecks } from '@/lib/chapter-18-concepts/micro-checks'")
    expect(source).toContain('loadChapter18MicroCheckAttempts')
    expect(source).toContain("chapterId !== 'ch-18'")
    expect(source).toContain("chapterId === 'ch-18'")
    expect(source).toContain('<Chapter18MicroCheckCard')
    expect(source).toContain('handleChapter18MicroCheckPersisted')
  })

  it('keeps the live Chapter 18 card locked after a persisted first attempt', () => {
    const source = readFileSync(join(process.cwd(), 'src/components/chapter/Chapter18MicroCheckCard.tsx'), 'utf8')

    expect(source).toContain('attemptMap.has(questionId)')
    expect(source).toContain('Lock First Attempt')
    expect(source).toContain('disabled={locked || saving === question.id}')
    expect(source).not.toContain('update(')
    expect(source).not.toContain('delete(')
  })
})
