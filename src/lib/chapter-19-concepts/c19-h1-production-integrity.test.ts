import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter19PremiumFlashcards } from '../chapter-19-premium-flashcards'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import { chapter19MicroChecks } from './micro-checks'
import { chapter19ReassessmentReserve } from './reassessment-reserve'
import { detectAllChapter19CombinedConceptGaps } from './detection'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import type { QuizAttempt } from '@/types'

const root = process.cwd()
const read = (path: string) => readFileSync(join(root, path), 'utf8')

describe('C19-H1 production integrity hardening', () => {
  it('preserves the certified Chapter 19 inventories and grading contract', () => {
    expect(chapter19PremiumFlashcards).toHaveLength(60)
    expect(chapter19PremiumQuizQuestions).toHaveLength(15)
    expect(
      chapter19MicroChecks.flatMap((check) => check.questions),
    ).toHaveLength(14)
    expect(chapter19ReassessmentReserve).toHaveLength(35)
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('makes all 14 micro-checks satisfy the Chapter 19 knowledge-check completion signal', () => {
    const source = read('src/components/chapter/ChapterContent.tsx')
    expect(source).toContain("chapterId !== 'ch-19'")
    expect(source).toContain('const requiredQuestionIds = chapter19MicroChecks.flatMap')
    expect(source).toContain(
      "void saveSignal('knowledge_checks_completed').then((saved) =>",
    )
    expect(source).toContain(
      "(hasKnowledgeChecks || hasChapter19MicroChecks || hasChapter20MicroChecks || hasChapter21MicroChecks) && knowledgeChecksSaved",
    )
  })

  it('moves Chapter 19 micro-check and flashcard evidence to authenticated server-authoritative writes', () => {
    const microRoute = read('src/app/api/chapter-19/micro-check/route.ts')
    const activityRoute = read(
      'src/app/api/chapter-19/activity-evidence/route.ts',
    )
    const microClient = read(
      'src/lib/chapter-19-concepts/micro-check-persistence.ts',
    )
    const activityClient = read(
      'src/lib/concept-mastery/activity-evidence.ts',
    )

    expect(microRoute).toContain('createServiceRoleClient')
    expect(microRoute).toContain(
      'is_correct: selectedAnswer === question.correctAnswer',
    )
    expect(microRoute).toContain('concept_id: question.conceptFamilyId')
    expect(microRoute).not.toContain('body.userId')

    expect(activityRoute).toContain('createServiceRoleClient')
    expect(activityRoute).toContain(
      "const conceptId = getFlashcardEvidenceConcept('ch-19', body.itemId)",
    )
    expect(activityRoute).toContain(
      "is_correct: selectedAnswer === 'got_it'",
    )
    expect(activityRoute).toContain(
      "body.source !== 'flashcard'",
    )

    expect(microClient).toContain(
      "fetch('/api/chapter-19/micro-check'",
    )
    expect(activityClient).toContain("input.chapterId === 'ch-19'")
    expect(activityClient).toContain("input.chapterId === 'ch-20'")
    expect(activityClient).toContain("input.chapterId === 'ch-21'")
    expect(activityClient).toContain("'chapter-19'")
    expect(activityClient).toContain("'chapter-20'")
    expect(activityClient).toContain("'chapter-21'")
  })

  it('denies direct Chapter 19 evidence inserts and student mutation of quiz-19 attempts', () => {
    const migration = read(
      'supabase/migrations/20260930193000_ch19_h1_production_integrity.sql',
    )
    expect(migration).toContain("chapter_id <> 'ch-19'")
    expect(migration).toContain("quiz_id <> 'quiz-19'")
    expect(migration).toContain(
      'drop policy if exists "quiz_attempts_update"',
    )
    expect(migration).toContain(
      'drop policy if exists "quiz_attempts_delete"',
    )
  })

  it('uses real persisted activity timestamps in Chapter 19 instructor diagnostics', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const diagnostics = read(
      'src/lib/chapter-19-concepts/instructor-diagnostics.ts',
    )
    expect(page).toContain(
      ".select('chapter_id,source,item_id,is_correct,answered_at')",
    )
    expect(diagnostics).toContain(
      'timestamp: row.answered_at ?? input.referenceTime',
    )
  })

  it('feeds combined assessment, micro-check, and flashcard evidence into actual Chapter 19 gap detection', () => {
    const attempt: QuizAttempt = {
      id: 'attempt-h1',
      user_id: 'student-h1',
      quiz_id: 'quiz-19',
      score: 1,
      total_questions: 1,
      percentage: 100,
      answers_json: { 'qq-19-01': 'b' },
      completed_at: '2026-09-30T18:00:00.000Z',
      is_reassessment: false,
      remediation_cycle_id: null,
      target_concept_id: null,
    }

    const result = detectAllChapter19CombinedConceptGaps(
      [attempt],
      [
        {
          question_id: 'mcq-19-001',
          selected_answer: 'a',
          answered_at: '2026-09-30T18:01:00.000Z',
        },
        {
          question_id: 'mcq-19-002',
          selected_answer: 'a',
          answered_at: '2026-09-30T18:02:00.000Z',
        },
      ],
      [
        {
          source: 'flashcard',
          item_id: 'fc-ch19-001',
          is_correct: false,
          answered_at: '2026-09-30T18:03:00.000Z',
        },
      ],
    )

    const licensing = result.get(
      'ch19-licensing-requirements-verification',
    )
    expect(licensing).toBeDefined()
    expect(licensing!.evidence.totalObservations).toBe(4)
    expect(licensing!.evidence.misses).toBe(3)
    expect(['emerging_weakness', 'repeated_weakness']).toContain(
      licensing!.state,
    )

    const orchestrator = read(
      'src/lib/remediation/detection-orchestrator.ts',
    )
    expect(orchestrator).toContain(
      'detectAllChapter19CombinedConceptGaps',
    )
    expect(orchestrator).toContain(
      'getChapter19MicroCheckEvidence',
    )
    expect(orchestrator).toContain(
      'getChapter19ActivityEvidence',
    )
  })
})
