import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter21PremiumQuizQuestions } from '../chapter-21-premium-quiz'
import { chapter21QuizQuestionConceptMappings } from './mappings'
import { getChapter21ReassessmentReserve } from './reassessment-reserve'
import {
  buildChapter21InstructorDiagnostics,
  type Chapter21InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter21MicroCheckAttemptRow } from './micro-check-persistence'
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
const ts = '2026-10-01T02:30:00.000Z'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (
    (['a', 'b', 'c', 'd'] as const).find(
      (answer) => answer !== correct,
    ) ?? 'a'
  )
}

describe('C21-8 instructor and school-admin diagnostics', () => {
  it('shows preserved initial misses and successful five-question recovery', () => {
    const target = 'ch21-recordkeeping-financial-compliance'
    const initialQuestions = chapter21PremiumQuizQuestions.filter(
      (question) =>
        chapter21QuizQuestionConceptMappings.some(
          (mapping) =>
            mapping.questionId === question.id &&
            mapping.conceptFamilyId === target,
        ),
    )
    expect(initialQuestions).toHaveLength(2)

    const initialAttempt: Chapter21InstructorQuizAttempt = {
      quiz_id: 'quiz-21',
      percentage: 80,
      answers_json: Object.fromEntries(
        initialQuestions.map((question) => [
          question.id,
          wrongAnswer(question.correct_answer),
        ]),
      ),
      completed_at: ts,
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const reserve = getChapter21ReassessmentReserve(target)
    expect(reserve).toHaveLength(5)
    const reassessmentAttempt: Chapter21InstructorQuizAttempt = {
      quiz_id: 'quiz-21',
      percentage: 100,
      answers_json: Object.fromEntries(
        reserve.map((question) => [
          question.id,
          question.correctAnswer,
        ]),
      ),
      completed_at: '2026-10-01T02:35:00.000Z',
      is_reassessment: true,
      target_concept_id: target,
      remediation_cycle_id: 'cycle-c21-records',
    }

    const diagnostics = buildChapter21InstructorDiagnostics({
      studentId: 'student-c21-diagnostics',
      completionPercent: 100,
      microCheckRows: [],
      quizAttempts: [reassessmentAttempt, initialAttempt],
      activityRows: [],
      referenceTime: '2026-10-01T02:36:00.000Z',
    })

    const concept = diagnostics.concepts.find((item) =>
      item.conceptName.includes('Recordkeeping'),
    )
    expect(concept).toBeDefined()
    expect(concept!.initialMisses).toBe(2)
    expect(concept!.reassessmentCorrect).toBe(5)
    expect(diagnostics.preservedInitialMissCount).toBe(2)
    expect(diagnostics.latestReassessment).toContain('100%')
    expect(diagnostics.remediationReassessmentPercent).toBe(100)
  })

  it('includes durable flashcard and scenario/application evidence in mastery', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      {
        chapter_id: 'ch-21',
        source: 'flashcard',
        item_id: 'fc-ch21-001',
        is_correct: true,
        answered_at: ts,
      },
      {
        chapter_id: 'ch-21',
        source: 'scenario_application',
        item_id: 'ch21-kc1:0',
        is_correct: false,
        answered_at: '2026-10-01T02:31:00.000Z',
      },
    ]

    const diagnostics = buildChapter21InstructorDiagnostics({
      studentId: 'student-c21-activity',
      completionPercent: 0,
      microCheckRows: [],
      quizAttempts: [],
      activityRows,
      referenceTime: '2026-10-01T02:32:00.000Z',
    })

    expect(diagnostics.evidenceCount).toBe(2)
    expect(diagnostics.concepts.some((concept) => concept.observations > 0)).toBe(true)
    expect(diagnostics.preservedInitialMissCount).toBe(1)
  })

  it('surfaces business/legal compliance without bodily-safety escalation', () => {
    const rows: Chapter21MicroCheckAttemptRow[] = [
      {
        id: 'row-c21-1',
        user_id: 'student-c21-compliance',
        chapter_id: 'ch-21',
        check_id: 'mc-21-06',
        question_id: 'mcq-21-011',
        concept_id: 'ch21-booth-rental-independent-business-responsibilities',
        difficulty: 'application',
        selected_answer: 'a',
        is_correct: false,
        answered_at: ts,
        created_at: ts,
      },
      {
        id: 'row-c21-2',
        user_id: 'student-c21-compliance',
        chapter_id: 'ch-21',
        check_id: 'mc-21-06',
        question_id: 'mcq-21-012',
        concept_id: 'ch21-booth-rental-independent-business-responsibilities',
        difficulty: 'scenario',
        selected_answer: 'a',
        is_correct: false,
        answered_at: '2026-10-01T02:31:00.000Z',
        created_at: '2026-10-01T02:31:00.000Z',
      },
    ]

    const diagnostics = buildChapter21InstructorDiagnostics({
      studentId: 'student-c21-compliance',
      completionPercent: 0,
      microCheckRows: rows,
      quizAttempts: [],
      activityRows: [],
      referenceTime: '2026-10-01T02:32:00.000Z',
    })

    expect(diagnostics.complianceIntervention.level).toBe('elevated')
    expect(diagnostics.complianceIntervention.requiresInstructorReview).toBe(true)
    expect(diagnostics.complianceIntervention.requiresFormalReassessment).toBe(true)
    expect(diagnostics.complianceIntervention.reassessmentPassPercent).toBe(80)
    expect(diagnostics.remediationStatus).toContain('Compliance review')
    expect(diagnostics.remediationStatus.toLowerCase()).not.toContain('safety')
  })

  it('integrates Chapter 21 with the live 20/10/40/15/15 grade', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      ...getFlashcardEvidenceInventory('ch-21').map((itemId) => ({
        chapter_id: 'ch-21',
        source: 'flashcard' as const,
        item_id: itemId,
        is_correct: true,
      })),
      ...getScenarioEvidenceInventory('ch-21').map((itemId) => ({
        chapter_id: 'ch-21',
        source: 'scenario_application' as const,
        item_id: itemId,
        is_correct: true,
      })),
    ]

    expect(getFlashcardEvidenceInventory('ch-21')).toHaveLength(60)
    expect(getScenarioEvidenceInventory('ch-21')).toHaveLength(13)

    const grade = buildLiveInstructorChapterGrade({
      chapterId: 'ch-21',
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

  it('uses staff authorization and same-school lookup before exposing Chapter 21 diagnostics', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(canAccessRoute('instructor', '/instructor/student/student-c21')).toBe(true)
    expect(canAccessRoute('school_admin', '/instructor/student/student-c21')).toBe(true)
    expect(canAccessRoute('student', '/instructor/student/student-c21')).toBe(false)

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain(
      'if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))',
    )
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain("row.chapter_id === 'ch-21'")
    expect(page).toContain('buildChapter21InstructorDiagnostics({')
    expect(page).toContain("buildLiveGrade('ch-21', chapter21Diagnostics)")
    expect(page).toContain('Chapter 21 — The Business of Barbering')
    expect(page).toContain(
      'chapter21Diagnostics.complianceIntervention.requiresInstructorReview',
    )
    expect(page).toContain('chapter21Diagnostics.remediationStatus')
    expect(page).toContain('chapter21Diagnostics.latestReassessment')
    expect(page).toContain('chapter21Diagnostics.weakestConcepts')
    expect(page).toContain('chapter21Diagnostics.concepts.map')
    expect(page).toContain('chapter21Diagnostics.preservedInitialMissCount')
  })

  it('does not expose raw answers or internal identifiers in the Chapter 21 panel', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const marker =
      '{/* Chapter 21 mastery, business/legal compliance, remediation & instructor visibility */}'
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

  it('includes Chapter 21 in both shared durable-evidence reads', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const ch21Occurrences = page.match(/'ch-21'/g) ?? []
    expect(ch21Occurrences.length).toBeGreaterThanOrEqual(6)
    expect(page).toContain("'ch-19','ch-20','ch-21']")
  })
})
