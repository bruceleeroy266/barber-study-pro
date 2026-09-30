import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter20PremiumFlashcards } from '../chapter-20-premium-flashcards'
import { chapter20PremiumQuizQuestions } from '../chapter-20-premium-quiz'
import { chapter20MicroChecks, buildChapter20MicroCheckEvidence, mergeChapter20EvidenceWithoutContamination, validateChapter20MicroCheckPlacements } from './micro-checks'
import { chapter20MicroCheckPlacements } from './mappings'
import { CHAPTER20_CONCEPT_FAMILY_IDS } from './concepts'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

describe('C20-5 micro-check immutable evidence integration', () => {
  it('preserves the 60-card and 17-question certified inventories', () => {
    expect(chapter20PremiumFlashcards).toHaveLength(60)
    expect(chapter20PremiumQuizQuestions).toHaveLength(17)
  })

  it('creates exactly 12 fresh questions: two per canonical family', () => {
    expect(chapter20MicroChecks).toHaveLength(6)
    expect(chapter20MicroCheckPlacements).toHaveLength(6)
    expect(validateChapter20MicroCheckPlacements()).toBe(true)

    const questions = chapter20MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(12)
    expect(new Set(questions.map((question) => question.id)).size).toBe(12)
    expect(questions.map((question) => question.id)).toEqual(
      Array.from({ length: 12 }, (_, index) =>
        `mcq-20-${String(index + 1).padStart(3, '0')}`,
      ),
    )
    expect(new Set(chapter20MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(CHAPTER20_CONCEPT_FAMILY_IDS),
    )
    expect(chapter20MicroChecks.every((check) => check.questions.length === 2)).toBe(true)
  })

  it('keeps micro-check prompts and IDs separate from the 17-question assessment', () => {
    const assessmentPrompts = new Set(chapter20PremiumQuizQuestions.map((question) => question.question))
    const questions = chapter20MicroChecks.flatMap((check) => check.questions)

    expect(questions.every((question) => !question.id.startsWith('qq-20-'))).toBe(true)
    expect(questions.every((question) => !assessmentPrompts.has(question.question))).toBe(true)
  })

  it('builds only initial micro-check evidence and ignores duplicate first-attempt responses', () => {
    const rows = buildChapter20MicroCheckEvidence(
      'student-20',
      [
        { questionId: 'mcq-20-001', selectedAnswer: 'a' },
        { questionId: 'mcq-20-001', selectedAnswer: 'b' },
        { questionId: 'mcq-20-002', selectedAnswer: 'b' },
      ],
      '2026-09-30T21:00:00.000Z',
    )

    expect(rows).toHaveLength(2)
    expect(rows.every((row) => row.chapterId === 'ch-20')).toBe(true)
    expect(rows.every((row) => row.source === 'micro_check')).toBe(true)
    expect(rows.every((row) => row.attemptPhase === 'initial')).toBe(true)
    expect(rows[0]?.correct).toBe(false)
  })

  it('does not overwrite existing first-attempt evidence during merge', () => {
    const existing = buildChapter20MicroCheckEvidence(
      'student-20',
      [{ questionId: 'mcq-20-001', selectedAnswer: 'a' }],
      '2026-09-30T21:00:00.000Z',
    )
    const incoming = buildChapter20MicroCheckEvidence(
      'student-20',
      [{ questionId: 'mcq-20-001', selectedAnswer: 'b' }, { questionId: 'mcq-20-002', selectedAnswer: 'b' }],
      '2026-09-30T21:01:00.000Z',
    )

    const merged = mergeChapter20EvidenceWithoutContamination(existing, incoming)
    expect(merged).toHaveLength(2)
    expect(merged.find((row) => row.itemId === 'mcq-20-001')?.correct).toBe(false)
  })

  it('uses authenticated server-authoritative persistence and derives correctness server-side', () => {
    const route = read('src/app/api/chapter-20/micro-check/route.ts')
    const client = read('src/lib/chapter-20-concepts/micro-check-persistence.ts')

    expect(route).toContain('createServiceRoleClient')
    expect(route).toContain('is_correct: selectedAnswer === question.correctAnswer')
    expect(route).toContain('concept_id: question.conceptFamilyId')
    expect(route).not.toContain('body.userId')
    expect(route).toContain("error?.code === '23505'")
    expect(client).toContain("fetch('/api/chapter-20/micro-check'")
  })

  it('renders each check after the matching lesson section and requires all 12 before completion', () => {
    const source = read('src/components/chapter/ChapterContent.tsx')
    expect(source).toContain("import Chapter20MicroCheckCard from './Chapter20MicroCheckCard'")
    expect(source).toContain("import { chapter20MicroChecks } from '@/lib/chapter-20-concepts/micro-checks'")
    expect(source).toContain("chapterId === 'ch-20'")
    expect(source).toContain('chapter20MicroChecksForSection')
    expect(source).toContain('const requiredQuestionIds = chapter20MicroChecks.flatMap')
    expect(source).toContain('chapter20MicroCheckAttempts.map((attempt) => attempt.question_id)')
  })

  it('does not let scenario completion bypass the 12 persisted micro-checks', () => {
    const source = read('src/components/chapter/ChapterContent.tsx')
    expect(source).toContain("if (chapterId === 'ch-20')")
    expect(source).toContain('!requiredQuestionIds.every((questionId) => recordedQuestionIds.has(questionId))')
  })

  it('preserves shared grading weights', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })
})
