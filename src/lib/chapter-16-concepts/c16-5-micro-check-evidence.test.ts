import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter16PremiumContent } from '../chapter-16-premium'
import {
  buildChapter16MicroCheckEvidence,
  chapter16MicroChecks,
  mergeChapter16EvidenceWithoutContamination,
  validateChapter16MicroCheckPlacements,
} from './micro-checks'
import {
  buildChapter16MicroCheckDiagnostics,
  calculatePersistedChapter16MicroCheckPercent,
  chapter16MicroCheckRowsToEvidence,
  withPersistedChapter16MicroCheckGrade,
  type Chapter16MicroCheckAttemptRow,
} from './micro-check-persistence'
import { chapter16MicroCheckPlacements } from './mappings'
import { CHAPTER16_CONCEPT_FAMILY_IDS } from './concepts'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const ts = '2026-09-29T19:00:00.000Z'

describe('C16-5 Chapter 16 micro-check immutable evidence binding', () => {
  it('covers all eight canonical concepts with 16 unique non-recall questions', () => {
    expect(chapter16MicroChecks).toHaveLength(8)
    expect(chapter16MicroCheckPlacements).toHaveLength(8)
    expect(validateChapter16MicroCheckPlacements()).toBe(true)

    const questions = chapter16MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(16)
    expect(new Set(questions.map((question) => question.id)).size).toBe(16)
    expect(new Set(chapter16MicroChecks.map((check) => check.conceptFamilyId))).toEqual(
      new Set(CHAPTER16_CONCEPT_FAMILY_IDS),
    )
    expect(questions.every((question) =>
      ['understanding', 'application', 'scenario'].includes(question.difficulty),
    )).toBe(true)
  })

  it('places every check after a current Chapter 16 lesson block', () => {
    const ids = new Set(chapter16PremiumContent.sections.map((section) => section.id))
    expect(chapter16MicroCheckPlacements.every((placement) => ids.has(placement.afterSectionId))).toBe(true)
    expect(new Set(chapter16MicroCheckPlacements.map((placement) => placement.afterSectionId)).size).toBe(8)
  })

  it('binds exactly two questions to each parent concept', () => {
    for (const check of chapter16MicroChecks) {
      expect(check.questions).toHaveLength(2)
      expect(check.questions.every((question) => question.conceptFamilyId === check.conceptFamilyId)).toBe(true)
    }
  })

  it('captures only the first response for each question as initial evidence', () => {
    const records = buildChapter16MicroCheckEvidence(
      'student-c16',
      [
        { questionId: 'mcq-16-015', selectedAnswer: 'a' },
        { questionId: 'mcq-16-015', selectedAnswer: 'b' },
      ],
      ts,
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      chapterId: 'ch-16',
      source: 'micro_check',
      itemId: 'mcq-16-015',
      attemptPhase: 'initial',
      correct: false,
    })
  })

  it('merges micro-check evidence without overwriting an existing first attempt', () => {
    const first = buildChapter16MicroCheckEvidence(
      'student-c16',
      [{ questionId: 'mcq-16-013', selectedAnswer: 'a' }],
      ts,
    )
    const retry = buildChapter16MicroCheckEvidence(
      'student-c16',
      [{ questionId: 'mcq-16-013', selectedAnswer: 'c' }],
      '2026-09-29T19:05:00.000Z',
    )
    const merged = mergeChapter16EvidenceWithoutContamination(first, retry)

    expect(merged).toHaveLength(1)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].timestamp).toBe(ts)
  })

  it('converts persisted rows into immutable shared mastery evidence and diagnostics', () => {
    const rows: Chapter16MicroCheckAttemptRow[] = [
      {
        id: 'row-1',
        user_id: 'student-c16',
        chapter_id: 'ch-16',
        check_id: 'mc-16-01',
        question_id: 'mcq-16-001',
        concept_id: 'ch16-design-foundations',
        difficulty: 'understanding',
        selected_answer: 'c',
        is_correct: true,
        answered_at: ts,
        created_at: ts,
      },
      {
        id: 'row-2',
        user_id: 'student-c16',
        chapter_id: 'ch-16',
        check_id: 'mc-16-01',
        question_id: 'mcq-16-002',
        concept_id: 'ch16-design-foundations',
        difficulty: 'application',
        selected_answer: 'a',
        is_correct: false,
        answered_at: '2026-09-29T19:01:00.000Z',
        created_at: '2026-09-29T19:01:00.000Z',
      },
    ]

    const evidence = chapter16MicroCheckRowsToEvidence(rows)
    expect(evidence).toHaveLength(2)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(evidence.every((record) => record.attemptPhase === 'initial')).toBe(true)
    expect(calculatePersistedChapter16MicroCheckPercent(rows)).toBe(50)

    const diagnostics = buildChapter16MicroCheckDiagnostics(rows, '2026-09-29T19:10:00.000Z')
    const design = diagnostics.find((item) => item.conceptFamilyId === 'ch16-design-foundations')
    expect(design).toMatchObject({ answered: 2, correct: 1, percent: 50 })
    expect(design?.masteryFromMicroChecks).toBeGreaterThan(0)
  })

  it('feeds persisted micro-check percent into the shared 20% grading component only', () => {
    const rows: Chapter16MicroCheckAttemptRow[] = [
      {
        id: 'row-1',
        user_id: 'student-c16',
        chapter_id: 'ch-16',
        check_id: 'mc-16-08',
        question_id: 'mcq-16-015',
        concept_id: 'ch16-styling-finishing-safety',
        difficulty: 'application',
        selected_answer: 'b',
        is_correct: true,
        answered_at: ts,
        created_at: ts,
      },
    ]

    const input = withPersistedChapter16MicroCheckGrade(
      {
        microCheckPercent: null,
        flashcardPercent: 90,
        chapterAssessmentPercent: 80,
        scenarioApplicationPercent: 85,
        remediationReassessmentPercent: null,
      },
      rows,
    )

    expect(input.microCheckPercent).toBe(100)
    expect(SHARED_GRADE_WEIGHTS.micro_check).toBe(0.20)
    expect(SHARED_GRADE_WEIGHTS.flashcard).toBe(0.10)
    expect(SHARED_GRADE_WEIGHTS.chapter_assessment).toBe(0.40)
    expect(SHARED_GRADE_WEIGHTS.scenario_application).toBe(0.15)
    expect(SHARED_GRADE_WEIGHTS.remediation_reassessment).toBe(0.15)
  })

  it('renders Chapter 16 micro-checks in the shared lesson surface', () => {
    const source = readFileSync(join(process.cwd(), 'src/components/chapter/ChapterContent.tsx'), 'utf8')
    expect(source).toContain("import Chapter16MicroCheckCard from './Chapter16MicroCheckCard'")
    expect(source).toContain("import { chapter16MicroChecks } from '@/lib/chapter-16-concepts/micro-checks'")
    expect(source).toContain("if (chapterId !== 'ch-16' || !userId) return")
    expect(source).toContain("const chapter16MicroCheck = chapterId === 'ch-16'")
    expect(source).toContain('<Chapter16MicroCheckCard')
  })
})
