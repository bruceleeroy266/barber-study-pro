import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter18PremiumQuizQuestions } from '../chapter-18-premium-quiz'
import { chapter18QuizQuestionConceptMappings } from './mappings'
import { getChapter18ReassessmentReserve } from './reassessment-reserve'
import {
  buildChapter18InstructorDiagnostics,
  type Chapter18InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter18MicroCheckAttemptRow } from './micro-check-persistence'
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
const ts = '2026-09-30T04:30:00.000Z'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (['a','b','c','d'] as const).find((answer) => answer !== correct) ?? 'a'
}

describe('C18-8 instructor and school-admin diagnostics', () => {
  it('shows preserved initial misses and successful five-question recovery', () => {
    const target = 'ch18-service-safety-chemical-handling'
    const initialQuestions = chapter18PremiumQuizQuestions.filter((question) =>
      chapter18QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === target,
      ),
    )
    expect(initialQuestions.length).toBeGreaterThanOrEqual(2)

    const initialAttempt: Chapter18InstructorQuizAttempt = {
      quiz_id: 'quiz-18',
      percentage: 75,
      answers_json: Object.fromEntries(
        initialQuestions.map((question, index) => [
          question.id,
          index < 2 ? wrongAnswer(question.correct_answer) : question.correct_answer,
        ]),
      ),
      completed_at: ts,
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const reserve = getChapter18ReassessmentReserve(target)
    expect(reserve).toHaveLength(5)
    const reassessmentAttempt: Chapter18InstructorQuizAttempt = {
      quiz_id: 'quiz-18',
      percentage: 100,
      answers_json: Object.fromEntries(reserve.map((question) => [question.id, question.correctAnswer])),
      completed_at: '2026-09-30T04:35:00.000Z',
      is_reassessment: true,
      target_concept_id: target,
      remediation_cycle_id: 'cycle-c18-safety',
    }

    const diagnostics = buildChapter18InstructorDiagnostics({
      studentId: 'student-c18-diagnostics',
      completionPercent: 100,
      microCheckRows: [],
      quizAttempts: [reassessmentAttempt, initialAttempt],
      activityRows: [],
      referenceTime: '2026-09-30T04:36:00.000Z',
    })

    const concept = diagnostics.concepts.find((item) => item.conceptName.includes('Safety'))
    expect(concept).toBeDefined()
    expect(concept!.initialMisses).toBe(2)
    expect(concept!.reassessmentCorrect).toBe(5)
    expect(diagnostics.latestReassessment).toContain('100%')
    expect(diagnostics.remediationReassessmentPercent).toBe(100)
  })

  it('includes durable flashcard evidence in Chapter 18 concept mastery', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      { chapter_id:'ch-18', source:'flashcard', item_id:'fc-ch18-001', is_correct:true },
      { chapter_id:'ch-18', source:'flashcard', item_id:'fc-ch18-002', is_correct:false },
    ]

    const diagnostics = buildChapter18InstructorDiagnostics({
      studentId:'student-c18-activity',
      completionPercent:0,
      microCheckRows:[],
      quizAttempts:[],
      activityRows,
      referenceTime:'2026-09-30T04:37:00.000Z',
    })

    expect(diagnostics.evidenceCount).toBe(2)
    expect(diagnostics.concepts.some((concept) => concept.observations > 0)).toBe(true)
    expect(diagnostics.concepts.reduce((sum, concept) => sum + concept.initialMisses, 0)).toBe(1)
  })

  it('surfaces urgent multi-hazard haircolor/lightener safety state while preserving first attempts', () => {
    const rows: Chapter18MicroCheckAttemptRow[] = [
      {
        id:'row-scalp', user_id:'student-c18-safety', chapter_id:'ch-18', check_id:'mc-18-07',
        question_id:'mcq-18-013', concept_id:'ch18-service-safety-chemical-handling',
        difficulty:'scenario', selected_answer:'a', is_correct:false, answered_at:ts, created_at:ts,
      },
      {
        id:'row-offscalp', user_id:'student-c18-safety', chapter_id:'ch-18', check_id:'mc-18-04',
        question_id:'mcq-18-008', concept_id:'ch18-developers-lighteners-toners',
        difficulty:'scenario', selected_answer:'a', is_correct:false,
        answered_at:'2026-09-30T04:31:00.000Z', created_at:'2026-09-30T04:31:00.000Z',
      },
    ]

    const diagnostics = buildChapter18InstructorDiagnostics({
      studentId:'student-c18-safety',
      completionPercent:0,
      microCheckRows:rows,
      quizAttempts:[],
      activityRows:[],
      referenceTime:'2026-09-30T04:32:00.000Z',
    })

    expect(diagnostics.safetyIntervention.level).toBe('urgent')
    expect(diagnostics.safetyIntervention.requiresInstructorReview).toBe(true)
    expect(diagnostics.safetyIntervention.requiresFormalSafetyReassessment).toBe(true)
    expect(diagnostics.safetyIntervention.reassessmentQuestionCount).toBe(5)
    expect(diagnostics.safetyIntervention.reassessmentPassPercent).toBe(100)
    expect(diagnostics.concepts.reduce((sum, item) => sum + item.initialMisses, 0)).toBe(2)
  })

  it('integrates Chapter 18 with the shared live grade without fabricating absent scenario evidence', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] = getFlashcardEvidenceInventory('ch-18').map((itemId) => ({
      chapter_id:'ch-18', source:'flashcard' as const, item_id:itemId, is_correct:true,
    }))

    expect(getFlashcardEvidenceInventory('ch-18')).toHaveLength(50)
    expect(getScenarioEvidenceInventory('ch-18')).toEqual([])

    const grade = buildLiveInstructorChapterGrade({
      chapterId:'ch-18',
      microCheckPercent:100,
      chapterAssessmentPercent:100,
      remediationReassessmentPercent:100,
      activityRows,
    })

    expect(grade.grade.componentWeights).toEqual({
      micro_check:0.20,
      flashcard:0.10,
      chapter_assessment:0.40,
      scenario_application:0.15,
      remediation_reassessment:0.15,
    })
    expect(grade.components.flashcardPercent).toBe(100)
    expect(grade.components.scenarioApplicationPercent).toBeNull()
    expect(grade.evidenceComplete).toBe(false)
  })

  it('uses staff role authorization plus same-school lookup before exposing Chapter 18 diagnostics', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(canAccessRoute('instructor','/instructor/student/student-c18')).toBe(true)
    expect(canAccessRoute('school_admin','/instructor/student/student-c18')).toBe(true)
    expect(canAccessRoute('student','/instructor/student/student-c18')).toBe(false)

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain("if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))")
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain("row.chapter_id === 'ch-18'")
    expect(page).toContain("buildChapter18InstructorDiagnostics({")
    expect(page).toContain("buildLiveGrade('ch-18', chapter18Diagnostics)")
    expect(page).toContain('Chapter 18 — Haircoloring and Lightening')
    expect(page).toContain('chapter18Diagnostics.safetyIntervention.requiresInstructorReview')
    expect(page).toContain('chapter18Diagnostics.remediationStatus')
    expect(page).toContain('chapter18Diagnostics.latestReassessment')
    expect(page).toContain('chapter18Diagnostics.weakestConcepts')
    expect(page).toContain('chapter18Diagnostics.concepts.map')
  })

  it('does not expose internal IDs or raw answer payloads in the Chapter 18 diagnostic panel', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const marker = '{/* Chapter 18 mastery, haircolor/lightener safety, remediation & instructor visibility */}'
    const start = page.indexOf(marker)
    expect(start).toBeGreaterThanOrEqual(0)
    const section = page.slice(start, page.indexOf('</section>', start) + '</section>'.length)

    expect(section).toContain('without exposing internal IDs or raw answer payloads')
    expect(section).not.toContain('answers_json')
    expect(section).not.toContain('studentId')
    expect(section).not.toContain('question_id')
    expect(section).not.toContain('item_id')
  })

  it('includes Chapter 18 in both shared durable-evidence reads', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const ch18Occurrences = page.match(/'ch-18'/g) ?? []
    expect(ch18Occurrences.length).toBeGreaterThanOrEqual(6)
    expect(page).toContain("'ch-17','ch-18','ch-19']")
  })
})
