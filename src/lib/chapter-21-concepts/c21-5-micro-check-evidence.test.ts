import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter21PremiumFlashcards } from '../chapter-21-premium-flashcards'
import { chapter21PremiumQuizQuestions } from '../chapter-21-premium-quiz'
import {
  chapter21MicroChecks,
  buildChapter21MicroCheckEvidence,
  mergeChapter21EvidenceWithoutContamination,
  validateChapter21MicroCheckPlacements,
} from './micro-checks'
import { chapter21MicroCheckPlacements } from './mappings'
import { CHAPTER21_CONCEPT_FAMILY_IDS } from './concepts'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8')

describe('C21-5 micro-check immutable evidence integration', () => {
  it('preserves the certified 60-card and 17-question inventories', () => {
    expect(chapter21PremiumFlashcards).toHaveLength(60)
    expect(chapter21PremiumQuizQuestions).toHaveLength(17)
  })

  it('creates exactly 16 fresh questions: two per canonical family', () => {
    expect(chapter21MicroChecks).toHaveLength(8)
    expect(chapter21MicroCheckPlacements).toHaveLength(8)
    expect(validateChapter21MicroCheckPlacements()).toBe(true)

    const questions = chapter21MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(16)
    expect(new Set(questions.map((question) => question.id)).size).toBe(16)
    expect(questions.map((question) => question.id)).toEqual(
      Array.from({ length: 16 }, (_, index) =>
        `mcq-21-${String(index + 1).padStart(3, '0')}`,
      ),
    )
    expect(
      new Set(chapter21MicroChecks.map((check) => check.conceptFamilyId)),
    ).toEqual(new Set(CHAPTER21_CONCEPT_FAMILY_IDS))
    expect(
      chapter21MicroChecks.every((check) => check.questions.length === 2),
    ).toBe(true)
  })

  it('uses only understanding/application/scenario difficulty and canonical LO mapping', () => {
    const questions = chapter21MicroChecks.flatMap((check) => check.questions)
    expect(
      questions.every((question) =>
        ['understanding', 'application', 'scenario'].includes(
          question.difficulty,
        ),
      ),
    ).toBe(true)

    expect(
      chapter21MicroChecks.map((check) => check.learningObjectiveId),
    ).toEqual([
      'LO-21-01',
      'LO-21-02',
      'LO-21-03',
      'LO-21-04',
      'LO-21-05',
      'LO-21-06',
      'LO-21-07',
      'LO-21-08',
    ])
  })

  it('keeps micro-check IDs and prompts separate from the 17-question assessment', () => {
    const assessmentIds = new Set(
      chapter21PremiumQuizQuestions.map((question) => question.id),
    )
    const assessmentPrompts = new Set(
      chapter21PremiumQuizQuestions.map((question) => question.question),
    )
    const questions = chapter21MicroChecks.flatMap((check) => check.questions)

    expect(
      questions.every((question) => question.id.startsWith('mcq-21-')),
    ).toBe(true)
    expect(
      questions.every((question) => !assessmentIds.has(question.id)),
    ).toBe(true)
    expect(
      questions.every((question) => !assessmentPrompts.has(question.question)),
    ).toBe(true)
  })

  it('builds only initial micro-check evidence and ignores duplicate first-attempt responses', () => {
    const rows = buildChapter21MicroCheckEvidence(
      'student-21',
      [
        { questionId: 'mcq-21-001', selectedAnswer: 'a' },
        { questionId: 'mcq-21-001', selectedAnswer: 'b' },
        { questionId: 'mcq-21-002', selectedAnswer: 'b' },
      ],
      '2026-10-01T01:10:00.000Z',
    )

    expect(rows).toHaveLength(2)
    expect(rows.every((row) => row.chapterId === 'ch-21')).toBe(true)
    expect(rows.every((row) => row.source === 'micro_check')).toBe(true)
    expect(rows.every((row) => row.attemptPhase === 'initial')).toBe(true)
    expect(rows[0]?.correct).toBe(false)
  })

  it('does not overwrite preserved first-attempt evidence during merge', () => {
    const existing = buildChapter21MicroCheckEvidence(
      'student-21',
      [{ questionId: 'mcq-21-001', selectedAnswer: 'a' }],
      '2026-10-01T01:10:00.000Z',
    )
    const incoming = buildChapter21MicroCheckEvidence(
      'student-21',
      [
        { questionId: 'mcq-21-001', selectedAnswer: 'b' },
        { questionId: 'mcq-21-002', selectedAnswer: 'b' },
      ],
      '2026-10-01T01:11:00.000Z',
    )

    const merged = mergeChapter21EvidenceWithoutContamination(
      existing,
      incoming,
    )

    expect(merged).toHaveLength(2)
    expect(
      merged.find((row) => row.itemId === 'mcq-21-001')?.correct,
    ).toBe(false)
  })

  it('uses authenticated server-authoritative persistence and derives protected fields server-side', () => {
    const route = read('src/app/api/chapter-21/micro-check/route.ts')
    const client = read(
      'src/lib/chapter-21-concepts/micro-check-persistence.ts',
    )

    expect(route).toContain('createServiceRoleClient')
    expect(route).toContain('user_id: user.id')
    expect(route).toContain("chapter_id: 'ch-21'")
    expect(route).toContain('concept_id: question.conceptFamilyId')
    expect(route).toContain('difficulty: question.difficulty')
    expect(route).toContain(
      'is_correct: selectedAnswer === question.correctAnswer',
    )
    expect(route).toContain('answered_at: new Date().toISOString()')
    expect(route).not.toContain('body.userId')
    expect(route).not.toContain('body.conceptId')
    expect(route).not.toContain('body.isCorrect')
    expect(route).not.toContain('body.answeredAt')
    expect(route).toContain("error?.code === '23505'")
    expect(client).toContain("fetch('/api/chapter-21/micro-check'")
  })

  it('recovers the already-preserved row on a duplicate insert instead of replacing it', () => {
    const route = read('src/app/api/chapter-21/micro-check/route.ts')

    expect(route).toContain(".from('chapter_micro_check_attempts')")
    expect(route).toContain(".eq('user_id', user.id)")
    expect(route).toContain(".eq('chapter_id', 'ch-21')")
    expect(route).toContain(".eq('question_id', question.id)")
    expect(route).toContain('alreadyRecorded: true')
    expect(route).not.toContain('.update(')
    expect(route).not.toContain('.upsert(')
    expect(route).not.toContain('.delete(')
  })

  it('renders each micro-check immediately after its matching lesson section', () => {
    const source = read('src/components/chapter/ChapterContent.tsx')

    expect(source).toContain(
      "import Chapter21MicroCheckCard from './Chapter21MicroCheckCard'",
    )
    expect(source).toContain(
      "import { chapter21MicroChecks } from '@/lib/chapter-21-concepts/micro-checks'",
    )
    expect(source).toContain("chapterId === 'ch-21'")
    expect(source).toContain('chapter21MicroChecksForSection')
    expect(source).toContain(
      'chapter21MicroChecks.filter((check) => check.afterSectionId === section.id)',
    )
    expect(source).toContain('<Chapter21MicroCheckCard')
  })

  it('requires all 16 persisted micro-checks before Chapter 21 knowledge-check completion', () => {
    const source = read('src/components/chapter/ChapterContent.tsx')

    expect(source).toContain(
      'const requiredQuestionIds = chapter21MicroChecks.flatMap',
    )
    expect(source).toContain(
      'chapter21MicroCheckAttempts.map((attempt) => attempt.question_id)',
    )
    expect(source).toContain(
      '!requiredQuestionIds.every((questionId) => recordedQuestionIds.has(questionId))',
    )
  })

  it('does not let scenario completion bypass the 16 persisted micro-checks', () => {
    const source = read('src/components/chapter/ChapterContent.tsx')

    expect(source).toContain("if (chapterId === 'ch-21')")
    expect(source).toContain(
      'areKnowledgeCheckSectionsComplete(',
    )
    expect(source).toContain(
      'chapter21MicroCheckAttempts',
    )
  })

  it('preserves the shared 20/10/40/15/15 grading contract', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })
})
