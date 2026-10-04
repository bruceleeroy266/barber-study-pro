import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter17PremiumContent } from '../chapter-17-premium'
import { chapter17PremiumFlashcards } from '../chapter-17-premium-flashcards'
import { chapter17PremiumQuizQuestions, chapter17LearningQuestions } from '../chapter-17-premium-quiz'
import {
  buildChapter17MicroCheckEvidence,
  chapter17MicroChecks,
  mergeChapter17EvidenceWithoutContamination,
  validateChapter17MicroCheckPlacements,
} from './micro-checks'
import {
  buildChapter17MicroCheckDiagnostics,
  calculatePersistedChapter17MicroCheckPercent,
  chapter17MicroCheckRowsToEvidence,
  withPersistedChapter17MicroCheckGrade,
  type Chapter17MicroCheckAttemptRow,
} from './micro-check-persistence'
import { calculateChapter17ConceptMastery, type Chapter17EvidenceRecord } from './grading'
import { chapter17MicroCheckPlacements } from './mappings'
import { CHAPTER17_CONCEPT_FAMILY_IDS } from './concepts'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const ts = '2026-09-29T21:30:00.000Z'

describe('C17-5 Chapter 17 micro-check immutable evidence integration', () => {
  it('preserves the certified 24/60/30/16 inventories', () => {
    expect(chapter17PremiumContent.sections).toHaveLength(24)
    expect(chapter17PremiumFlashcards).toHaveLength(60)
    expect(chapter17PremiumQuizQuestions).toHaveLength(30)
    expect(chapter17LearningQuestions).toHaveLength(16)
  })

  it('covers all seven canonical concepts with 14 unique non-recall questions', () => {
    expect(chapter17MicroChecks).toHaveLength(7)
    expect(chapter17MicroCheckPlacements).toHaveLength(7)
    expect(validateChapter17MicroCheckPlacements()).toBe(true)

    const questions = chapter17MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(14)
    expect(new Set(questions.map((question) => question.id)).size).toBe(14)
    expect(new Set(chapter17MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(CHAPTER17_CONCEPT_FAMILY_IDS),
    )
    expect(
      questions.every((question) =>
        ['understanding', 'application', 'scenario'].includes(question.difficulty),
      ),
    ).toBe(true)
  })

  it('places each two-question check after its certified lesson section', () => {
    const sectionIds = new Set(chapter17PremiumContent.sections.map((section) => section.id))
    expect(chapter17MicroCheckPlacements.every((placement) => sectionIds.has(placement.afterSectionId))).toBe(true)
    expect(new Set(chapter17MicroCheckPlacements.map((placement) => placement.afterSectionId)).size).toBe(7)

    for (const check of chapter17MicroChecks) {
      expect(check.questions).toHaveLength(2)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })

  it('captures only the first response for a question as initial academic evidence', () => {
    const records = buildChapter17MicroCheckEvidence(
      'student-c17',
      [
        { questionId: 'mcq-17-011', selectedAnswer: 'a' },
        { questionId: 'mcq-17-011', selectedAnswer: 'c' },
      ],
      ts,
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      studentId: 'student-c17',
      chapterId: 'ch-17',
      conceptFamilyId: 'ch17-safety-strand-tests-compatibility',
      source: 'micro_check',
      itemId: 'mcq-17-011',
      correct: false,
      attemptPhase: 'initial',
    })
  })

  it('does not let a later duplicate erase an original miss', () => {
    const original = buildChapter17MicroCheckEvidence(
      'student-c17',
      [{ questionId: 'mcq-17-001', selectedAnswer: 'a' }],
      ts,
    )
    expect(original[0].correct).toBe(false)

    const laterCorrect: Chapter17EvidenceRecord = {
      ...original[0],
      correct: true,
      timestamp: '2026-09-29T21:35:00.000Z',
    }

    const merged = mergeChapter17EvidenceWithoutContamination(original, [laterCorrect])
    expect(merged).toHaveLength(1)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].timestamp).toBe(ts)
  })

  it('keeps future reassessment evidence separate from the preserved first-attempt miss', () => {
    const initial = buildChapter17MicroCheckEvidence(
      'student-c17',
      [{ questionId: 'mcq-17-008', selectedAnswer: 'a' }],
      ts,
    )

    const reassessment: Chapter17EvidenceRecord = {
      studentId: 'student-c17',
      chapterId: 'ch-17',
      conceptFamilyId: 'ch17-chemical-relaxing-procedures',
      source: 'remediation_reassessment',
      itemId: 'r17-relax-001',
      difficulty: 'scenario',
      correct: true,
      attemptPhase: 'reassessment',
      timestamp: '2026-09-29T21:40:00.000Z',
    }

    const merged = mergeChapter17EvidenceWithoutContamination(initial, [reassessment])
    const mastery = calculateChapter17ConceptMastery(merged, '2026-09-29T21:41:00.000Z')

    expect(merged).toHaveLength(2)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].attemptPhase).toBe('initial')
    expect(merged[1].attemptPhase).toBe('reassessment')
    expect(mastery.initialMissCount).toBe(1)
    expect(mastery.reassessmentCorrectCount).toBe(1)
  })

  it('converts persisted rows into shared micro-check evidence and seven concept diagnostics', () => {
    const rows: Chapter17MicroCheckAttemptRow[] = [
      {
        id: 'row-1', user_id: 'student-c17', chapter_id: 'ch-17', check_id: 'mc-17-01',
        question_id: 'mcq-17-001', concept_id: 'ch17-consultation-hair-analysis',
        difficulty: 'application', selected_answer: 'b', is_correct: true, answered_at: ts, created_at: ts,
      },
      {
        id: 'row-2', user_id: 'student-c17', chapter_id: 'ch-17', check_id: 'mc-17-06',
        question_id: 'mcq-17-011', concept_id: 'ch17-safety-strand-tests-compatibility',
        difficulty: 'scenario', selected_answer: 'a', is_correct: false, answered_at: ts, created_at: ts,
      },
    ]

    const evidence = chapter17MicroCheckRowsToEvidence(rows)
    expect(evidence).toHaveLength(2)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(evidence.every((record) => record.attemptPhase === 'initial')).toBe(true)

    const diagnostics = buildChapter17MicroCheckDiagnostics(rows, '2026-09-29T21:45:00.000Z')
    expect(diagnostics).toHaveLength(7)
    expect(new Set(diagnostics.map((item) => item.conceptFamilyId))).toEqual(
      new Set(CHAPTER17_CONCEPT_FAMILY_IDS),
    )
  })

  it('proves every concept family can generate durable student evidence', () => {
    const responses = chapter17MicroChecks.map((check) => ({
      questionId: check.questions[0].id,
      selectedAnswer: check.questions[0].correctAnswer,
    }))
    const evidence = buildChapter17MicroCheckEvidence('student-c17-all', responses, ts)

    expect(evidence).toHaveLength(7)
    expect(new Set(evidence.map((record) => record.conceptFamilyId))).toEqual(
      new Set(CHAPTER17_CONCEPT_FAMILY_IDS),
    )
    expect(evidence.every((record) => record.chapterId === 'ch-17')).toBe(true)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(evidence.every((record) => record.attemptPhase === 'initial')).toBe(true)
  })

  it('uses first-attempt correctness for the unchanged 20% micro-check grade component', () => {
    const rows: Chapter17MicroCheckAttemptRow[] = [
      {
        id: 'row-1', user_id: 'student-c17', chapter_id: 'ch-17', check_id: 'mc-17-02',
        question_id: 'mcq-17-003', concept_id: 'ch17-chemistry-bond-transformation',
        difficulty: 'understanding', selected_answer: 'b', is_correct: true, answered_at: ts, created_at: ts,
      },
      {
        id: 'row-2', user_id: 'student-c17', chapter_id: 'ch-17', check_id: 'mc-17-02',
        question_id: 'mcq-17-004', concept_id: 'ch17-chemistry-bond-transformation',
        difficulty: 'application', selected_answer: 'a', is_correct: false, answered_at: ts, created_at: ts,
      },
    ]

    expect(calculatePersistedChapter17MicroCheckPercent(rows)).toBe(50)

    const input = withPersistedChapter17MicroCheckGrade({
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

  it('reuses the immutable shared database contract without a Chapter 17 schema fork', () => {
    const migration = readFileSync(
      join(process.cwd(), 'supabase/migrations/20260926044500_create_chapter_micro_check_attempts.sql'),
      'utf8',
    )

    expect(migration).toContain('unique (user_id, chapter_id, question_id)')
    expect(migration).toContain('grant select, insert on table public.chapter_micro_check_attempts to authenticated')
    expect(migration).not.toContain('grant update')
    expect(migration).not.toContain('grant delete')
  })

  it('wires Chapter 17 micro-check load, render, restore, and persistence into ChapterContent', () => {
    const source = readFileSync(join(process.cwd(), 'src/components/chapter/ChapterContent.tsx'), 'utf8')

    expect(source).toContain("import Chapter17MicroCheckCard from './Chapter17MicroCheckCard'")
    expect(source).toContain("import { chapter17MicroChecks } from '@/lib/chapter-17-concepts/micro-checks'")
    expect(source).toContain('loadChapter17MicroCheckAttempts')
    expect(source).toContain("chapterId !== 'ch-17'")
    expect(source).toContain("chapterId === 'ch-17'")
    expect(source).toContain('<Chapter17MicroCheckCard')
    expect(source).toContain('handleChapter17MicroCheckPersisted')
  })

  it('keeps the live card locked after a persisted first attempt', () => {
    const source = readFileSync(join(process.cwd(), 'src/components/chapter/Chapter17MicroCheckCard.tsx'), 'utf8')
    expect(source).toContain('attemptMap.has(questionId)')
    expect(source).toContain('Lock First Attempt')
    expect(source).toContain('locked={!!attempt}')
    expect(source).toContain('disabled={saving === question.id}')
    expect(source).toContain("import RandomizedMicroCheckChoices from './RandomizedMicroCheckChoices'")
    expect(source).not.toContain('update(')
    expect(source).not.toContain('delete(')
  })
})
