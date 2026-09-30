import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter20PremiumQuizQuestions } from '../chapter-20-premium-quiz'
import { chapter20QuizQuestionConceptMappings } from './mappings'
import { getChapter20ReassessmentReserve } from './reassessment-reserve'
import {
  buildChapter20InstructorDiagnostics,
  type Chapter20InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter20MicroCheckAttemptRow } from './micro-check-persistence'
import {
  buildLiveInstructorChapterGrade,
  type LiveInstructorActivityEvidenceRow,
} from '../concept-mastery/live-instructor-grade'
import {
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
} from '../concept-mastery/activity-evidence-registry'
import { canAccessRoute, isInstructorOrAdmin } from '../security/permissions'

const root = process.cwd()
const read = (path: string) => readFileSync(join(root, path), 'utf8')
const ts = '2026-09-30T22:30:00.000Z'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (
    (['a', 'b', 'c', 'd'] as const).find(
      (answer) => answer !== correct,
    ) ?? 'a'
  )
}

describe('C20-8 instructor and school-admin diagnostics', () => {
  it('shows preserved initial misses and successful five-question recovery', () => {
    const target = 'ch20-financial-responsibility-income-reporting'
    const initialQuestions = chapter20PremiumQuizQuestions.filter(
      (question) =>
        chapter20QuizQuestionConceptMappings.some(
          (mapping) =>
            mapping.questionId === question.id &&
            mapping.conceptFamilyId === target,
        ),
    )
    expect(initialQuestions).toHaveLength(3)

    const initialAttempt: Chapter20InstructorQuizAttempt = {
      quiz_id: 'quiz-20',
      percentage: 80,
      answers_json: Object.fromEntries(
        initialQuestions.slice(0, 2).map((question) => [
          question.id,
          wrongAnswer(question.correct_answer),
        ]),
      ),
      completed_at: ts,
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const reserve = getChapter20ReassessmentReserve(target)
    expect(reserve).toHaveLength(5)
    const reassessmentAttempt: Chapter20InstructorQuizAttempt = {
      quiz_id: 'quiz-20',
      percentage: 100,
      answers_json: Object.fromEntries(
        reserve.map((question) => [
          question.id,
          question.correctAnswer,
        ]),
      ),
      completed_at: '2026-09-30T22:35:00.000Z',
      is_reassessment: true,
      target_concept_id: target,
      remediation_cycle_id: 'cycle-c20-finance',
    }

    const diagnostics = buildChapter20InstructorDiagnostics({
      studentId: 'student-c20-diagnostics',
      completionPercent: 100,
      microCheckRows: [],
      quizAttempts: [reassessmentAttempt, initialAttempt],
      activityRows: [],
      referenceTime: '2026-09-30T22:36:00.000Z',
    })

    const concept = diagnostics.concepts.find((item) =>
      item.conceptName.includes('Financial Responsibility'),
    )
    expect(concept).toBeDefined()
    expect(concept!.initialMisses).toBe(2)
    expect(concept!.reassessmentCorrect).toBe(5)
    expect(diagnostics.preservedInitialMissCount).toBe(2)
    expect(diagnostics.latestReassessment).toContain('100%')
    expect(diagnostics.remediationReassessmentPercent).toBe(100)
  })

  it('includes durable flashcard and scenario/application evidence in concept mastery', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      {
        chapter_id: 'ch-20',
        source: 'flashcard',
        item_id: 'fc-ch20-001',
        is_correct: true,
        answered_at: ts,
      },
      {
        chapter_id: 'ch-20',
        source: 'scenario_application',
        item_id: 'ch20-kc1:0',
        is_correct: false,
        answered_at: '2026-09-30T22:31:00.000Z',
      },
    ]

    const diagnostics = buildChapter20InstructorDiagnostics({
      studentId: 'student-c20-activity',
      completionPercent: 0,
      microCheckRows: [],
      quizAttempts: [],
      activityRows,
      referenceTime: '2026-09-30T22:32:00.000Z',
    })

    expect(diagnostics.evidenceCount).toBe(2)
    expect(
      diagnostics.concepts.some((concept) => concept.observations > 0),
    ).toBe(true)
    expect(diagnostics.preservedInitialMissCount).toBe(1)
  })

  it('surfaces classification/tax/privacy compliance without bodily-safety escalation', () => {
    const rows: Chapter20MicroCheckAttemptRow[] = [
      {
        id: 'row-tax-1',
        user_id: 'student-c20-compliance',
        chapter_id: 'ch-20',
        check_id: 'mc-20-04',
        question_id: 'mcq-20-007',
        concept_id: 'ch20-financial-responsibility-income-reporting',
        difficulty: 'application',
        selected_answer: 'a',
        is_correct: false,
        answered_at: ts,
        created_at: ts,
      },
      {
        id: 'row-tax-2',
        user_id: 'student-c20-compliance',
        chapter_id: 'ch-20',
        check_id: 'mc-20-04',
        question_id: 'mcq-20-008',
        concept_id: 'ch20-financial-responsibility-income-reporting',
        difficulty: 'scenario',
        selected_answer: 'a',
        is_correct: false,
        answered_at: '2026-09-30T22:31:00.000Z',
        created_at: '2026-09-30T22:31:00.000Z',
      },
    ]

    const diagnostics = buildChapter20InstructorDiagnostics({
      studentId: 'student-c20-compliance',
      completionPercent: 0,
      microCheckRows: rows,
      quizAttempts: [],
      activityRows: [],
      referenceTime: '2026-09-30T22:32:00.000Z',
    })

    expect(diagnostics.complianceIntervention.level).toBe('elevated')
    expect(
      diagnostics.complianceIntervention.requiresInstructorReview,
    ).toBe(true)
    expect(
      diagnostics.complianceIntervention.requiresFormalReassessment,
    ).toBe(true)
    expect(
      diagnostics.complianceIntervention.reassessmentPassPercent,
    ).toBe(80)
    expect(diagnostics.remediationStatus).toContain('Compliance review')
    expect(diagnostics.remediationStatus).not.toContain('safety')
  })

  it('integrates Chapter 20 with live 20/10/40/15/15 grade using real activity inventories', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      ...getFlashcardEvidenceInventory('ch-20').map((itemId) => ({
        chapter_id: 'ch-20',
        source: 'flashcard' as const,
        item_id: itemId,
        is_correct: true,
      })),
      ...getScenarioEvidenceInventory('ch-20').map((itemId) => ({
        chapter_id: 'ch-20',
        source: 'scenario_application' as const,
        item_id: itemId,
        is_correct: true,
      })),
    ]

    expect(getFlashcardEvidenceInventory('ch-20')).toHaveLength(60)
    expect(getScenarioEvidenceInventory('ch-20')).toHaveLength(13)

    const grade = buildLiveInstructorChapterGrade({
      chapterId: 'ch-20',
      microCheckPercent: 100,
      chapterAssessmentPercent: 100,
      remediationReassessmentPercent: 100,
      activityRows,
    })

    expect(grade.grade.componentWeights).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
    expect(grade.components.flashcardPercent).toBe(100)
    expect(grade.components.scenarioApplicationPercent).toBe(100)
    expect(grade.evidenceComplete).toBe(true)
  })

  it('uses staff authorization and same-school student lookup before exposing Chapter 20 diagnostics', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(canAccessRoute('instructor', '/instructor/student/student-c20')).toBe(true)
    expect(canAccessRoute('school_admin', '/instructor/student/student-c20')).toBe(true)
    expect(canAccessRoute('student', '/instructor/student/student-c20')).toBe(false)

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain(
      'if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))',
    )
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain("row.chapter_id === 'ch-20'")
    expect(page).toContain('buildChapter20InstructorDiagnostics({')
    expect(page).toContain("buildLiveGrade('ch-20', chapter20Diagnostics)")
    expect(page).toContain('Chapter 20 — Working Behind the Chair')
    expect(page).toContain(
      'chapter20Diagnostics.complianceIntervention.requiresInstructorReview',
    )
    expect(page).toContain('chapter20Diagnostics.remediationStatus')
    expect(page).toContain('chapter20Diagnostics.latestReassessment')
    expect(page).toContain('chapter20Diagnostics.weakestConcepts')
    expect(page).toContain('chapter20Diagnostics.concepts.map')
    expect(page).toContain('chapter20Diagnostics.preservedInitialMissCount')
  })

  it('does not expose raw answers, internal evidence IDs, or remediation cycle IDs in the Chapter 20 panel', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const marker =
      '{/* Chapter 20 mastery, compliance, remediation & instructor visibility */}'
    const start = page.indexOf(marker)
    expect(start).toBeGreaterThanOrEqual(0)
    const section = page.slice(
      start,
      page.indexOf('</section>', start) + '</section>'.length,
    )

    expect(section).toContain(
      'without exposing internal IDs or raw answer payloads',
    )
    expect(section).not.toContain('answers_json')
    expect(section).not.toContain('studentId')
    expect(section).not.toContain('question_id')
    expect(section).not.toContain('item_id')
    expect(section).not.toContain('remediation_cycle_id')
  })

  it('includes Chapter 20 in both shared durable-evidence reads', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain("'ch-19','ch-20']")
    const ch20Occurrences = page.match(/'ch-20'/g) ?? []
    expect(ch20Occurrences.length).toBeGreaterThanOrEqual(6)
  })
})
