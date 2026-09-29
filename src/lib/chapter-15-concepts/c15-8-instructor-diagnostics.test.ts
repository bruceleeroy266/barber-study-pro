import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter15PremiumQuizQuestions } from '../chapter-15-premium-quiz'
import { chapter15QuizQuestionConceptMappings } from './mappings'
import { getChapter15ReassessmentReserve } from './reassessment-reserve'
import {
  buildChapter15InstructorDiagnostics,
  type Chapter15InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter15MicroCheckAttemptRow } from './micro-check-persistence'
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
const ts = '2026-09-29T12:30:00.000Z'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (['a','b','c','d'] as const).find((answer) => answer !== correct) ?? 'a'
}

describe('C15-8 instructor and school-admin diagnostics', () => {
  it('shows preserved initial misses and successful five-question recovery', () => {
    const target = 'ch15-system-selection-measurement-template'
    const initialQuestions = chapter15PremiumQuizQuestions.filter((question) =>
      chapter15QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === target,
      ),
    )
    const initialAttempt: Chapter15InstructorQuizAttempt = {
      quiz_id: 'quiz-15',
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

    const reserve = getChapter15ReassessmentReserve(target)
    expect(reserve).toHaveLength(5)
    const reassessmentAttempt: Chapter15InstructorQuizAttempt = {
      quiz_id: 'quiz-15',
      percentage: 100,
      answers_json: Object.fromEntries(reserve.map((question) => [question.id, question.correctAnswer])),
      completed_at: '2026-09-29T12:35:00.000Z',
      is_reassessment: true,
      target_concept_id: target,
      remediation_cycle_id: 'cycle-c15-selection',
    }

    const diagnostics = buildChapter15InstructorDiagnostics({
      studentId: 'student-c15-diagnostics',
      completionPercent: 100,
      microCheckRows: [],
      quizAttempts: [reassessmentAttempt, initialAttempt],
      referenceTime: '2026-09-29T12:36:00.000Z',
    })

    const concept = diagnostics.concepts.find((item) => item.conceptName.includes('System Selection'))
    expect(concept).toBeDefined()
    expect(concept!.initialMisses).toBe(2)
    expect(concept!.reassessmentCorrect).toBe(5)
    expect(diagnostics.latestReassessment).toContain('100%')
    expect(diagnostics.remediationReassessmentPercent).toBe(100)
  })

  it('surfaces urgent multi-hazard safety state without erasing first attempts', () => {
    const rows: Chapter15MicroCheckAttemptRow[] = [
      {
        id:'row-scope', user_id:'student-c15-safety', chapter_id:'ch-15', check_id:'mc-15-02',
        question_id:'mcq-15-003', concept_id:'ch15-alternatives-scope-referral',
        difficulty:'application', selected_answer:'a', is_correct:false, answered_at:ts, created_at:ts,
      },
      {
        id:'row-attach', user_id:'student-c15-safety', chapter_id:'ch-15', check_id:'mc-15-05',
        question_id:'mcq-15-009', concept_id:'ch15-attachment-methods-bonding',
        difficulty:'application', selected_answer:'a', is_correct:false,
        answered_at:'2026-09-29T12:31:00.000Z', created_at:'2026-09-29T12:31:00.000Z',
      },
    ]

    const diagnostics = buildChapter15InstructorDiagnostics({
      studentId:'student-c15-safety',
      completionPercent:0,
      microCheckRows:rows,
      quizAttempts:[],
      referenceTime:'2026-09-29T12:32:00.000Z',
    })

    expect(diagnostics.safetyIntervention.level).toBe('urgent')
    expect(diagnostics.safetyIntervention.requiresInstructorReview).toBe(true)
    expect(diagnostics.safetyIntervention.requiresFormalSafetyReassessment).toBe(true)
    expect(diagnostics.safetyIntervention.reassessmentQuestionCount).toBe(5)
    expect(diagnostics.safetyIntervention.reassessmentPassPercent).toBe(100)
    expect(diagnostics.concepts.reduce((sum, item) => sum + item.initialMisses, 0)).toBe(2)
  })

  it('builds the live 20/10/40/15/15 grade from durable Chapter 15 evidence', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      ...getFlashcardEvidenceInventory('ch-15').map((itemId) => ({
        chapter_id:'ch-15', source:'flashcard' as const, item_id:itemId, is_correct:true,
      })),
      ...getScenarioEvidenceInventory('ch-15').map((itemId) => ({
        chapter_id:'ch-15', source:'scenario_application' as const, item_id:itemId, is_correct:true,
      })),
    ]

    expect(getFlashcardEvidenceInventory('ch-15')).toHaveLength(90)
    expect(getScenarioEvidenceInventory('ch-15').length).toBeGreaterThan(0)

    const grade = buildLiveInstructorChapterGrade({
      chapterId:'ch-15',
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
    expect(grade.grade.finalGrade).toBe(100)
    expect(grade.evidenceComplete).toBe(true)
  })

  it('uses staff role authorization plus same-school lookup before exposing diagnostics', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(canAccessRoute('instructor','/instructor/student/student-c15')).toBe(true)
    expect(canAccessRoute('school_admin','/instructor/student/student-c15')).toBe(true)
    expect(canAccessRoute('student','/instructor/student/student-c15')).toBe(false)

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain("if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))")
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain("row.chapter_id === 'ch-15'")
    expect(page).toContain('buildChapter15InstructorDiagnostics({')
    expect(page).toContain("buildLiveGrade('ch-15', chapter15Diagnostics)")
    expect(page).toContain('Chapter 15 — Men’s Hair Replacement')
    expect(page).toContain('chapter15Diagnostics.safetyIntervention.requiresInstructorReview')
    expect(page).toContain('chapter15Diagnostics.remediationStatus')
    expect(page).toContain('chapter15Diagnostics.latestReassessment')
    expect(page).toContain('chapter15Diagnostics.weakestConcepts')
    expect(page).toContain('chapter15Diagnostics.concepts.map')
  })

  it('does not expose internal student IDs or raw answer payloads in the Chapter 15 diagnostic panel', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const marker = '{/* Chapter 15 mastery, safety, remediation & instructor visibility */}'
    const start = page.indexOf(marker)
    expect(start).toBeGreaterThanOrEqual(0)
    const section = page.slice(start, page.indexOf('</section>', start) + '</section>'.length)

    expect(section).toContain('without exposing internal IDs')
    expect(section).not.toContain('answers_json')
    expect(section).not.toContain('studentId')
    expect(section).not.toContain('question_id')
  })
})
