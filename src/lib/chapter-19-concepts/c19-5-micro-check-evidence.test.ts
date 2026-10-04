import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter19PremiumContent } from '../chapter-19-premium-content'
import { chapter19PremiumFlashcards } from '../chapter-19-premium-flashcards'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import {
  buildChapter19MicroCheckEvidence,
  chapter19MicroChecks,
  mergeChapter19EvidenceWithoutContamination,
  validateChapter19MicroCheckPlacements,
} from './micro-checks'
import {
  buildChapter19MicroCheckDiagnostics,
  calculatePersistedChapter19MicroCheckPercent,
  chapter19MicroCheckRowsToEvidence,
  withPersistedChapter19MicroCheckGrade,
  type Chapter19MicroCheckAttemptRow,
} from './micro-check-persistence'
import {
  calculateChapter19ConceptMastery,
  CHAPTER19_GRADE_WEIGHTS,
  type Chapter19EvidenceRecord,
} from './grading'
import { chapter19MicroCheckPlacements } from './mappings'
import {
  CHAPTER19_CONCEPT_FAMILY_IDS,
  CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const ts = '2026-09-30T15:30:00.000Z'

describe('C19-5 Chapter 19 micro-check immutable evidence integration', () => {
  it('preserves the certified 1-shell / 60-card / 15-assessment inventories', () => {
    expect(chapter19PremiumContent.sections).toHaveLength(1)
    expect(chapter19PremiumContent.sections[0]?.id).toBe('chapter-19-lesson')
    expect(chapter19PremiumFlashcards).toHaveLength(60)
    expect(chapter19PremiumQuizQuestions).toHaveLength(15)
  })

  it('creates exactly 14 unique fresh non-recall questions: two per canonical concept', () => {
    expect(chapter19MicroChecks).toHaveLength(7)
    expect(chapter19MicroCheckPlacements).toHaveLength(7)
    expect(validateChapter19MicroCheckPlacements()).toBe(true)

    const questions = chapter19MicroChecks.flatMap((check) => check.questions)
    expect(questions).toHaveLength(14)
    expect(new Set(questions.map((question) => question.id)).size).toBe(14)
    expect(questions.map((question) => question.id)).toEqual(
      Array.from({ length: 14 }, (_, index) =>
        `mcq-19-${String(index + 1).padStart(3, '0')}`,
      ),
    )
    expect(
      new Set(chapter19MicroChecks.map((check) => check.conceptFamilyId)),
    ).toEqual(new Set(CHAPTER19_CONCEPT_FAMILY_IDS))
    expect(
      questions.every((question) =>
        ['understanding', 'application', 'scenario'].includes(question.difficulty),
      ),
    ).toBe(true)

    const assessmentPrompts = new Set(
      chapter19PremiumQuizQuestions.map((question) => question.question),
    )
    expect(
      questions.every((question) => !assessmentPrompts.has(question.question)),
    ).toBe(true)
    expect(
      questions.every((question) => !question.id.startsWith('qq-19-')),
    ).toBe(true)
  })

  it('binds exactly two questions and canonical LO metadata to each concept family', () => {
    const expectedLoByConcept = {
      'ch19-licensing-requirements-verification': 'LO-19-01',
      'ch19-exam-preparation-test-reasoning': 'LO-19-02',
      'ch19-practical-exam-safety-readiness': 'LO-19-03',
      'ch19-employment-readiness-professionalism': 'LO-19-04',
      'ch19-resume-portfolio-application-materials': 'LO-19-05',
      'ch19-job-search-shop-research-interview': 'LO-19-06',
      'ch19-employment-law-contracts-compliance': 'LO-19-07',
    } as const

    for (const check of chapter19MicroChecks) {
      expect(check.questions).toHaveLength(2)
      expect(check.learningObjectiveId).toBe(
        expectedLoByConcept[check.conceptFamilyId],
      )
      expect(
        check.questions.every(
          (question) =>
            question.conceptFamilyId === check.conceptFamilyId &&
            question.learningObjectiveId === check.learningObjectiveId,
        ),
      ).toBe(true)
    }
  })

  it('uses the real Chapter 19 lesson shell as the placement anchor', () => {
    expect(
      chapter19MicroCheckPlacements.every(
        (placement) => placement.afterSectionId === 'chapter-19-lesson',
      ),
    ).toBe(true)
    expect(chapter19PremiumContent.sections.map((section) => section.id)).toEqual([
      'chapter-19-lesson',
    ])
  })

  it('captures only the first response for a question as initial evidence', () => {
    const records = buildChapter19MicroCheckEvidence(
      'student-c19',
      [
        { questionId: 'mcq-19-006', selectedAnswer: 'a' },
        { questionId: 'mcq-19-006', selectedAnswer: 'c' },
      ],
      ts,
    )

    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      studentId: 'student-c19',
      chapterId: 'ch-19',
      conceptFamilyId: 'ch19-practical-exam-safety-readiness',
      source: 'micro_check',
      itemId: 'mcq-19-006',
      correct: false,
      attemptPhase: 'initial',
    })
  })

  it('does not let later duplicate evidence erase an original miss', () => {
    const original = buildChapter19MicroCheckEvidence(
      'student-c19',
      [{ questionId: 'mcq-19-001', selectedAnswer: 'a' }],
      ts,
    )
    expect(original[0].correct).toBe(false)

    const laterCorrect: Chapter19EvidenceRecord = {
      ...original[0],
      correct: true,
      timestamp: '2026-09-30T15:35:00.000Z',
    }

    const merged = mergeChapter19EvidenceWithoutContamination(original, [
      laterCorrect,
    ])
    expect(merged).toHaveLength(1)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].timestamp).toBe(ts)
  })

  it('keeps future reassessment evidence separate from preserved initial misses', () => {
    const initial = buildChapter19MicroCheckEvidence(
      'student-c19',
      [{ questionId: 'mcq-19-014', selectedAnswer: 'a' }],
      ts,
    )

    const reassessment: Chapter19EvidenceRecord = {
      studentId: 'student-c19',
      chapterId: 'ch-19',
      conceptFamilyId: 'ch19-employment-law-contracts-compliance',
      source: 'remediation_reassessment',
      itemId: 'r19-law-001',
      difficulty: 'scenario',
      correct: true,
      attemptPhase: 'reassessment',
      timestamp: '2026-09-30T15:40:00.000Z',
    }

    const merged = mergeChapter19EvidenceWithoutContamination(initial, [
      reassessment,
    ])
    const mastery = calculateChapter19ConceptMastery(
      merged,
      '2026-09-30T15:41:00.000Z',
    )

    expect(merged).toHaveLength(2)
    expect(merged[0].correct).toBe(false)
    expect(merged[0].attemptPhase).toBe('initial')
    expect(merged[1].attemptPhase).toBe('reassessment')
    expect(mastery.initialMissCount).toBe(1)
    expect(mastery.reassessmentCorrectCount).toBe(1)
  })

  it('converts persisted rows into shared evidence and seven concept diagnostics', () => {
    const rows: Chapter19MicroCheckAttemptRow[] = [
      {
        id: 'row-1',
        user_id: 'student-c19',
        chapter_id: 'ch-19',
        check_id: 'mc-19-01',
        question_id: 'mcq-19-001',
        concept_id: 'ch19-licensing-requirements-verification',
        difficulty: 'application',
        selected_answer: 'b',
        is_correct: true,
        answered_at: ts,
        created_at: ts,
      },
      {
        id: 'row-2',
        user_id: 'student-c19',
        chapter_id: 'ch-19',
        check_id: 'mc-19-03',
        question_id: 'mcq-19-006',
        concept_id: 'ch19-practical-exam-safety-readiness',
        difficulty: 'application',
        selected_answer: 'a',
        is_correct: false,
        answered_at: ts,
        created_at: ts,
      },
    ]

    const evidence = chapter19MicroCheckRowsToEvidence(rows)
    expect(evidence).toHaveLength(2)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(
      evidence.every((record) => record.attemptPhase === 'initial'),
    ).toBe(true)

    const diagnostics = buildChapter19MicroCheckDiagnostics(
      rows,
      '2026-09-30T15:45:00.000Z',
    )
    expect(diagnostics).toHaveLength(7)
    expect(new Set(diagnostics.map((item) => item.conceptFamilyId))).toEqual(
      new Set(CHAPTER19_CONCEPT_FAMILY_IDS),
    )
  })

  it('proves every concept can generate durable initial evidence', () => {
    const responses = chapter19MicroChecks.map((check) => ({
      questionId: check.questions[0].id,
      selectedAnswer: check.questions[0].correctAnswer,
    }))
    const evidence = buildChapter19MicroCheckEvidence(
      'student-c19-all',
      responses,
      ts,
    )

    expect(evidence).toHaveLength(7)
    expect(new Set(evidence.map((record) => record.conceptFamilyId))).toEqual(
      new Set(CHAPTER19_CONCEPT_FAMILY_IDS),
    )
    expect(evidence.every((record) => record.chapterId === 'ch-19')).toBe(true)
    expect(evidence.every((record) => record.source === 'micro_check')).toBe(true)
    expect(
      evidence.every((record) => record.attemptPhase === 'initial'),
    ).toBe(true)
  })

  it('feeds first-attempt correctness into the unchanged shared 20 percent micro-check component', () => {
    const rows: Chapter19MicroCheckAttemptRow[] = [
      {
        id: 'row-1',
        user_id: 'student-c19',
        chapter_id: 'ch-19',
        check_id: 'mc-19-02',
        question_id: 'mcq-19-003',
        concept_id: 'ch19-exam-preparation-test-reasoning',
        difficulty: 'application',
        selected_answer: 'b',
        is_correct: true,
        answered_at: ts,
        created_at: ts,
      },
      {
        id: 'row-2',
        user_id: 'student-c19',
        chapter_id: 'ch-19',
        check_id: 'mc-19-02',
        question_id: 'mcq-19-004',
        concept_id: 'ch19-exam-preparation-test-reasoning',
        difficulty: 'understanding',
        selected_answer: 'a',
        is_correct: false,
        answered_at: ts,
        created_at: ts,
      },
    ]

    expect(calculatePersistedChapter19MicroCheckPercent(rows)).toBe(50)

    const input = withPersistedChapter19MicroCheckGrade(
      {
        microCheckPercent: null,
        flashcardPercent: 90,
        chapterAssessmentPercent: 80,
        scenarioApplicationPercent: null,
        remediationReassessmentPercent: null,
      },
      rows,
    )

    expect(input.microCheckPercent).toBe(50)
    expect(CHAPTER19_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('reuses the append-only shared database contract without a Chapter 19 schema fork', () => {
    const migration = readFileSync(
      join(
        process.cwd(),
        'supabase/migrations/20260926044500_create_chapter_micro_check_attempts.sql',
      ),
      'utf8',
    )

    expect(migration).toContain('unique (user_id, chapter_id, question_id)')
    expect(migration).toContain(
      'grant select, insert on table public.chapter_micro_check_attempts to authenticated',
    )
    expect(migration).not.toContain('grant update')
    expect(migration).not.toContain('grant delete')
  })

  it('wires Chapter 19 micro-check load, render, restore, and persistence into ChapterContent', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/components/chapter/ChapterContent.tsx'),
      'utf8',
    )

    expect(source).toContain(
      "import Chapter19MicroCheckCard from './Chapter19MicroCheckCard'",
    )
    expect(source).toContain(
      "import { chapter19MicroChecks } from '@/lib/chapter-19-concepts/micro-checks'",
    )
    expect(source).toContain('loadChapter19MicroCheckAttempts')
    expect(source).toContain("chapterId !== 'ch-19'")
    expect(source).toContain("chapterId === 'ch-19'")
    expect(source).toContain('<Chapter19MicroCheckCard')
    expect(source).toContain('handleChapter19MicroCheckPersisted')
  })

  it('keeps the live Chapter 19 card locked after a persisted first attempt', () => {
    const source = readFileSync(
      join(process.cwd(), 'src/components/chapter/Chapter19MicroCheckCard.tsx'),
      'utf8',
    )

    expect(source).toContain('attemptMap.has(questionId)')
    expect(source).toContain('Lock First Attempt')
    expect(source).toContain('locked={!!attempt}')
    expect(source).toContain('disabled={saving === question.id}')
    expect(source).toContain("import RandomizedMicroCheckChoices from './RandomizedMicroCheckChoices'")
    expect(source).not.toContain('.update(')
    expect(source).not.toContain('.delete(')
  })

  it('preserves the certified safety/compliance boundary', () => {
    expect(CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-practical-exam-safety-readiness',
    ])
    expect(CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-licensing-requirements-verification',
      'ch19-employment-law-contracts-compliance',
    ])
  })
})
