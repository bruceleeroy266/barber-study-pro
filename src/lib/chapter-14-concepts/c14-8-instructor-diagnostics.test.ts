import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter14PremiumQuizQuestions } from '../chapter-14-premium-quiz'
import { chapter14QuizQuestionConceptMappings } from './mappings'
import { getChapter14ReassessmentReserve } from './reassessment-reserve'
import {
  buildChapter14InstructorDiagnostics,
  type Chapter14InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter14MicroCheckAttemptRow } from './micro-check-persistence'
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
const ts = '2026-09-28T21:30:00.000Z'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (['a','b','c','d'] as const).find((answer) => answer !== correct) ?? 'a'
}

describe('C14-8 instructor/school-admin diagnostics and live five-component grade', () => {
  it('shows preserved initial misses and five-question reassessment recovery', () => {
    const target = 'ch14-cutting-geometry-guides'
    const initialQuestions = chapter14PremiumQuizQuestions.filter((question) =>
      chapter14QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === target,
      ),
    )
    expect(initialQuestions.length).toBeGreaterThanOrEqual(3)

    const initialAnswers = Object.fromEntries(
      initialQuestions.map((question, index) => [
        question.id,
        index < 2 ? wrongAnswer(question.correct_answer) : question.correct_answer,
      ]),
    )
    const initialAttempt: Chapter14InstructorQuizAttempt = {
      quiz_id: 'quiz-14',
      percentage: 80,
      answers_json: initialAnswers,
      completed_at: ts,
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const reserve = getChapter14ReassessmentReserve(target)
    expect(reserve).toHaveLength(5)
    const reassessmentAttempt: Chapter14InstructorQuizAttempt = {
      quiz_id: 'quiz-14',
      percentage: 100,
      answers_json: Object.fromEntries(reserve.map((question) => [question.id, question.correctAnswer])),
      completed_at: '2026-09-28T21:35:00.000Z',
      is_reassessment: true,
      target_concept_id: target,
      remediation_cycle_id: 'cycle-c14-geometry',
    }

    const diagnostics = buildChapter14InstructorDiagnostics({
      studentId: 'student-c14-diagnostics',
      completionPercent: 100,
      microCheckRows: [],
      quizAttempts: [reassessmentAttempt, initialAttempt],
      referenceTime: '2026-09-28T21:36:00.000Z',
    })

    const concept = diagnostics.concepts.find((item) => item.conceptName.includes('Geometry'))
    expect(concept).toBeDefined()
    expect(concept!.initialMisses).toBe(2)
    expect(concept!.reassessmentCorrect).toBe(5)
    expect(diagnostics.latestReassessment).toContain('100%')
    expect(diagnostics.latestReassessment).toContain('Geometry')
    expect(diagnostics.remediationReassessmentPercent).toBe(100)
  })

  it('surfaces an urgent Chapter 14 safety state to staff without overwriting first attempts', () => {
    const rows: Chapter14MicroCheckAttemptRow[] = [
      {
        id:'row-13', user_id:'student-c14-safety', chapter_id:'ch-14', check_id:'mc-14-07',
        question_id:'mcq-14-013', concept_id:'ch14-service-safety-sanitation',
        difficulty:'scenario', selected_answer:'a', is_correct:false, answered_at:ts, created_at:ts,
      },
      {
        id:'row-14', user_id:'student-c14-safety', chapter_id:'ch-14', check_id:'mc-14-07',
        question_id:'mcq-14-014', concept_id:'ch14-service-safety-sanitation',
        difficulty:'application', selected_answer:'a', is_correct:false,
        answered_at:'2026-09-28T21:31:00.000Z', created_at:'2026-09-28T21:31:00.000Z',
      },
    ]

    const diagnostics = buildChapter14InstructorDiagnostics({
      studentId:'student-c14-safety',
      completionPercent:0,
      microCheckRows:rows,
      quizAttempts:[],
      referenceTime:'2026-09-28T21:32:00.000Z',
    })

    expect(diagnostics.safetyIntervention.level).toBe('urgent')
    expect(diagnostics.safetyIntervention.requiresInstructorReview).toBe(true)
    expect(diagnostics.safetyIntervention.requiresFormalSafetyReassessment).toBe(true)
    expect(diagnostics.safetyIntervention.reassessmentQuestionCount).toBe(5)
    expect(diagnostics.safetyIntervention.reassessmentPassPercent).toBe(100)

    const safety = diagnostics.concepts.find((item) => item.conceptName.includes('Safety'))
    expect(safety?.initialMisses).toBe(2)
  })

  it('builds the live 20/10/40/15/15 grade from durable Chapter 14 evidence', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      ...getFlashcardEvidenceInventory('ch-14').map((itemId) => ({
        chapter_id:'ch-14',
        source:'flashcard' as const,
        item_id:itemId,
        is_correct:true,
      })),
      ...getScenarioEvidenceInventory('ch-14').map((itemId) => ({
        chapter_id:'ch-14',
        source:'scenario_application' as const,
        item_id:itemId,
        is_correct:true,
      })),
    ]

    expect(getFlashcardEvidenceInventory('ch-14').length).toBe(112)
    expect(getScenarioEvidenceInventory('ch-14').length).toBeGreaterThan(0)

    const grade = buildLiveInstructorChapterGrade({
      chapterId:'ch-14',
      microCheckPercent:100,
      chapterAssessmentPercent:100,
      remediationReassessmentPercent:null,
      activityRows,
    })

    expect(grade.components.microCheckPercent).toBe(100)
    expect(grade.components.flashcardPercent).toBe(100)
    expect(grade.components.chapterAssessmentPercent).toBe(100)
    expect(grade.components.scenarioApplicationPercent).toBe(100)
    expect(grade.components.remediationReassessmentPercent).toBeNull()
    expect(grade.grade.componentWeights).toEqual({
      micro_check:0.20,
      flashcard:0.10,
      chapter_assessment:0.40,
      scenario_application:0.15,
      remediation_reassessment:0.15,
    })
    expect(grade.evidenceComplete).toBe(true)
    expect(grade.grade.finalGrade).toBe(100)
  })

  it('keeps completion separate from the live academic grade', () => {
    const grade = buildLiveInstructorChapterGrade({
      chapterId:'ch-14',
      microCheckPercent:0,
      chapterAssessmentPercent:0,
      remediationReassessmentPercent:null,
      activityRows:[],
    })
    expect(grade.grade.finalGrade).toBe(0)

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain("const chapter14Progress = progressRecords.find((record) => record.chapter_id === 'ch-14')")
    expect(page).toContain('chapter14Progress?.progress_percentage ?? 0')
    expect(page).toContain('chapter14LiveGrade.grade.finalGrade')
  })

  it('uses the same same-school authorized route for instructor and school-admin visibility', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(canAccessRoute('instructor','/instructor/student/student-c14')).toBe(true)
    expect(canAccessRoute('school_admin','/instructor/student/student-c14')).toBe(true)
    expect(canAccessRoute('student','/instructor/student/student-c14')).toBe(false)

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const schoolPanel = read('src/components/school-owner/StudentPerformancePanel.tsx')

    expect(page).toContain("row.chapter_id === 'ch-14'")
    expect(page).toContain('buildChapter14InstructorDiagnostics({')
    expect(page).toContain("buildLiveGrade('ch-14', chapter14Diagnostics)")
    expect(page).toContain('Chapter 14 — Men’s Haircutting and Styling')
    expect(page).toContain('chapter14Diagnostics.safetyIntervention.requiresInstructorReview')
    expect(page).toContain('chapter14Diagnostics.remediationStatus')
    expect(page).toContain('chapter14Diagnostics.latestReassessment')
    expect(page).toContain('chapter14Diagnostics.weakestConcepts')
    expect(page).toContain('chapter14Diagnostics.concepts.map')
    expect(schoolPanel).toContain('/instructor/student/')
    expect(schoolPanel).toContain('View the same mastery diagnostics used by instructors')
  })
})
