import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import { chapter19QuizQuestionConceptMappings } from './mappings'
import { getChapter19ReassessmentReserve } from './reassessment-reserve'
import {
  buildChapter19InstructorDiagnostics,
  type Chapter19InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter19MicroCheckAttemptRow } from './micro-check-persistence'
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
const ts = '2026-09-30T16:55:00.000Z'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (
    (['a', 'b', 'c', 'd'] as const).find(
      (answer) => answer !== correct,
    ) ?? 'a'
  )
}

describe('C19-8 instructor and school-admin diagnostics', () => {
  it('shows preserved initial misses and successful five-question recovery', () => {
    const target = 'ch19-employment-law-contracts-compliance'
    const initialQuestions = chapter19PremiumQuizQuestions.filter(
      (question) =>
        chapter19QuizQuestionConceptMappings.some(
          (mapping) =>
            mapping.questionId === question.id &&
            mapping.conceptFamilyId === target,
        ),
    )
    expect(initialQuestions).toHaveLength(2)

    const initialAttempt: Chapter19InstructorQuizAttempt = {
      quiz_id: 'quiz-19',
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

    const reserve = getChapter19ReassessmentReserve(target)
    expect(reserve).toHaveLength(5)
    const reassessmentAttempt: Chapter19InstructorQuizAttempt = {
      quiz_id: 'quiz-19',
      percentage: 100,
      answers_json: Object.fromEntries(
        reserve.map((question) => [
          question.id,
          question.correctAnswer,
        ]),
      ),
      completed_at: '2026-09-30T17:00:00.000Z',
      is_reassessment: true,
      target_concept_id: target,
      remediation_cycle_id: 'cycle-c19-law',
    }

    const diagnostics = buildChapter19InstructorDiagnostics({
      studentId: 'student-c19-diagnostics',
      completionPercent: 100,
      microCheckRows: [],
      quizAttempts: [reassessmentAttempt, initialAttempt],
      activityRows: [],
      referenceTime: '2026-09-30T17:01:00.000Z',
    })

    const concept = diagnostics.concepts.find((item) =>
      item.conceptName.includes('Employment Law'),
    )
    expect(concept).toBeDefined()
    expect(concept!.initialMisses).toBe(2)
    expect(concept!.reassessmentCorrect).toBe(5)
    expect(diagnostics.latestReassessment).toContain('100%')
    expect(diagnostics.remediationReassessmentPercent).toBe(100)
  })

  it('includes durable flashcard evidence in Chapter 19 concept mastery', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      {
        chapter_id: 'ch-19',
        source: 'flashcard',
        item_id: 'fc-ch19-001',
        is_correct: true,
      },
      {
        chapter_id: 'ch-19',
        source: 'flashcard',
        item_id: 'fc-ch19-006',
        is_correct: false,
      },
    ]

    const diagnostics = buildChapter19InstructorDiagnostics({
      studentId: 'student-c19-activity',
      completionPercent: 0,
      microCheckRows: [],
      quizAttempts: [],
      activityRows,
      referenceTime: '2026-09-30T17:02:00.000Z',
    })

    expect(diagnostics.evidenceCount).toBe(2)
    expect(
      diagnostics.concepts.some((concept) => concept.observations > 0),
    ).toBe(true)
    expect(
      diagnostics.concepts.reduce(
        (sum, concept) => sum + concept.initialMisses,
        0,
      ),
    ).toBe(1)
  })

  it('surfaces urgent practical safety state while preserving first attempts', () => {
    const rows: Chapter19MicroCheckAttemptRow[] = [
      {
        id: 'row-infection',
        user_id: 'student-c19-safety',
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

    const initialAttempt: Chapter19InstructorQuizAttempt = {
      quiz_id: 'quiz-19',
      percentage: 90,
      answers_json: {
        'qq-19-03': wrongAnswer(
          chapter19PremiumQuizQuestions.find(
            (question) => question.id === 'qq-19-03',
          )!.correct_answer,
        ),
      },
      completed_at: '2026-09-30T16:56:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const diagnostics = buildChapter19InstructorDiagnostics({
      studentId: 'student-c19-safety',
      completionPercent: 0,
      microCheckRows: rows,
      quizAttempts: [initialAttempt],
      activityRows: [],
      referenceTime: '2026-09-30T16:57:00.000Z',
    })

    expect(diagnostics.safetyIntervention.level).toBe('urgent')
    expect(
      diagnostics.safetyIntervention.requiresInstructorReview,
    ).toBe(true)
    expect(
      diagnostics.safetyIntervention.requiresFormalSafetyReassessment,
    ).toBe(true)
    expect(diagnostics.safetyIntervention.reassessmentQuestionCount).toBe(5)
    expect(diagnostics.safetyIntervention.reassessmentPassPercent).toBe(100)
    expect(diagnostics.complianceIntervention.level).toBe('none')
    expect(
      diagnostics.concepts.reduce(
        (sum, item) => sum + item.initialMisses,
        0,
      ),
    ).toBe(2)
  })

  it('surfaces licensing and employment-law compliance separately from bodily safety', () => {
    const rows: Chapter19MicroCheckAttemptRow[] = [
      {
        id: 'row-license-1',
        user_id: 'student-c19-compliance',
        chapter_id: 'ch-19',
        check_id: 'mc-19-01',
        question_id: 'mcq-19-001',
        concept_id: 'ch19-licensing-requirements-verification',
        difficulty: 'application',
        selected_answer: 'a',
        is_correct: false,
        answered_at: ts,
        created_at: ts,
      },
      {
        id: 'row-license-2',
        user_id: 'student-c19-compliance',
        chapter_id: 'ch-19',
        check_id: 'mc-19-01',
        question_id: 'mcq-19-002',
        concept_id: 'ch19-licensing-requirements-verification',
        difficulty: 'scenario',
        selected_answer: 'a',
        is_correct: false,
        answered_at: '2026-09-30T16:56:00.000Z',
        created_at: '2026-09-30T16:56:00.000Z',
      },
    ]

    const diagnostics = buildChapter19InstructorDiagnostics({
      studentId: 'student-c19-compliance',
      completionPercent: 0,
      microCheckRows: rows,
      quizAttempts: [],
      activityRows: [],
      referenceTime: '2026-09-30T16:57:00.000Z',
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
    expect(diagnostics.safetyIntervention.level).toBe('none')
    expect(diagnostics.remediationStatus).toContain('Compliance review')
  })

  it('integrates Chapter 19 with the shared live grade without fabricating absent scenario evidence', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] =
      getFlashcardEvidenceInventory('ch-19').map((itemId) => ({
        chapter_id: 'ch-19',
        source: 'flashcard' as const,
        item_id: itemId,
        is_correct: true,
      }))

    expect(getFlashcardEvidenceInventory('ch-19')).toHaveLength(60)
    expect(getScenarioEvidenceInventory('ch-19')).toEqual([])

    const grade = buildLiveInstructorChapterGrade({
      chapterId: 'ch-19',
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
    expect(grade.components.scenarioApplicationPercent).toBeNull()
    expect(grade.evidenceComplete).toBe(false)
  })

  it('uses staff role authorization plus same-school lookup before exposing Chapter 19 diagnostics', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(
      canAccessRoute(
        'instructor',
        '/instructor/student/student-c19',
      ),
    ).toBe(true)
    expect(
      canAccessRoute(
        'school_admin',
        '/instructor/student/student-c19',
      ),
    ).toBe(true)
    expect(
      canAccessRoute(
        'student',
        '/instructor/student/student-c19',
      ),
    ).toBe(false)

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain(
      'if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))',
    )
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain("row.chapter_id === 'ch-19'")
    expect(page).toContain('buildChapter19InstructorDiagnostics({')
    expect(page).toContain("buildLiveGrade('ch-19', chapter19Diagnostics)")
    expect(page).toContain(
      'Chapter 19 — Preparing for Licensure and Employment',
    )
    expect(page).toContain(
      'chapter19Diagnostics.safetyIntervention.requiresInstructorReview',
    )
    expect(page).toContain(
      'chapter19Diagnostics.complianceIntervention.requiresInstructorReview',
    )
    expect(page).toContain('chapter19Diagnostics.remediationStatus')
    expect(page).toContain('chapter19Diagnostics.latestReassessment')
    expect(page).toContain('chapter19Diagnostics.weakestConcepts')
    expect(page).toContain('chapter19Diagnostics.concepts.map')
  })

  it('does not expose internal IDs or raw answer payloads in the Chapter 19 diagnostic panel', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const marker =
      '{/* Chapter 19 mastery, licensing/compliance, safety, remediation & instructor visibility */}'
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

  it('includes Chapter 19 in both shared durable-evidence reads', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const ch19Occurrences = page.match(/'ch-19'/g) ?? []
    expect(ch19Occurrences.length).toBeGreaterThanOrEqual(6)
    expect(page).toContain("'ch-18','ch-19','ch-20','ch-21']")
  })
})
