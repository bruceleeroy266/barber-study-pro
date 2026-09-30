import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter17PremiumQuizQuestions } from '../chapter-17-premium-quiz'
import { chapter17QuizQuestionConceptMappings } from './mappings'
import { getChapter17ReassessmentReserve } from './reassessment-reserve'
import {
  buildChapter17InstructorDiagnostics,
  type Chapter17InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter17MicroCheckAttemptRow } from './micro-check-persistence'
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
const ts = '2026-09-29T23:50:00.000Z'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (['a','b','c','d'] as const).find((answer) => answer !== correct) ?? 'a'
}

describe('C17-8 instructor and school-admin diagnostics', () => {
  it('shows preserved initial misses and successful five-question recovery', () => {
    const target = 'ch17-chemical-relaxing-procedures'
    const initialQuestions = chapter17PremiumQuizQuestions.filter((question) =>
      chapter17QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === target,
      ),
    )
    const initialAttempt: Chapter17InstructorQuizAttempt = {
      quiz_id: 'quiz-17',
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

    const reserve = getChapter17ReassessmentReserve(target)
    expect(reserve).toHaveLength(5)
    const reassessmentAttempt: Chapter17InstructorQuizAttempt = {
      quiz_id: 'quiz-17',
      percentage: 100,
      answers_json: Object.fromEntries(reserve.map((question) => [question.id, question.correctAnswer])),
      completed_at: '2026-09-29T23:55:00.000Z',
      is_reassessment: true,
      target_concept_id: target,
      remediation_cycle_id: 'cycle-c17-relaxing',
    }

    const diagnostics = buildChapter17InstructorDiagnostics({
      studentId: 'student-c17-diagnostics',
      completionPercent: 100,
      microCheckRows: [],
      quizAttempts: [reassessmentAttempt, initialAttempt],
      activityRows: [],
      referenceTime: '2026-09-29T23:56:00.000Z',
    })

    const concept = diagnostics.concepts.find((item) => item.conceptName.includes('Chemical Relaxing'))
    expect(concept).toBeDefined()
    expect(concept!.initialMisses).toBe(2)
    expect(concept!.reassessmentCorrect).toBe(5)
    expect(diagnostics.latestReassessment).toContain('100%')
    expect(diagnostics.remediationReassessmentPercent).toBe(100)
  })

  it('includes durable scenario and flashcard evidence in concept mastery', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      { chapter_id:'ch-17', source:'scenario_application', item_id:'scenario-1:0', is_correct:false },
      { chapter_id:'ch-17', source:'flashcard', item_id:'fc-ch17-001', is_correct:true },
    ]

    const diagnostics = buildChapter17InstructorDiagnostics({
      studentId:'student-c17-activity',
      completionPercent:0,
      microCheckRows:[],
      quizAttempts:[],
      activityRows,
      referenceTime:'2026-09-29T23:57:00.000Z',
    })

    expect(diagnostics.evidenceCount).toBe(2)
    expect(diagnostics.concepts.some((concept) => concept.observations > 0)).toBe(true)
    expect(diagnostics.concepts.reduce((sum, concept) => sum + concept.initialMisses, 0)).toBe(1)
  })

  it('surfaces urgent multi-hazard chemical-safety state without erasing first attempts', () => {
    const rows: Chapter17MicroCheckAttemptRow[] = [
      {
        id:'row-incompat', user_id:'student-c17-safety', chapter_id:'ch-17', check_id:'mc-17-06',
        question_id:'mcq-17-011', concept_id:'ch17-safety-strand-tests-compatibility',
        difficulty:'scenario', selected_answer:'a', is_correct:false, answered_at:ts, created_at:ts,
      },
      {
        id:'row-burning', user_id:'student-c17-safety', chapter_id:'ch-17', check_id:'mc-17-04',
        question_id:'mcq-17-008', concept_id:'ch17-chemical-relaxing-procedures',
        difficulty:'scenario', selected_answer:'a', is_correct:false,
        answered_at:'2026-09-29T23:51:00.000Z', created_at:'2026-09-29T23:51:00.000Z',
      },
    ]

    const diagnostics = buildChapter17InstructorDiagnostics({
      studentId:'student-c17-safety',
      completionPercent:0,
      microCheckRows:rows,
      quizAttempts:[],
      activityRows:[],
      referenceTime:'2026-09-29T23:52:00.000Z',
    })

    expect(diagnostics.safetyIntervention.level).toBe('urgent')
    expect(diagnostics.safetyIntervention.requiresInstructorReview).toBe(true)
    expect(diagnostics.safetyIntervention.requiresFormalSafetyReassessment).toBe(true)
    expect(diagnostics.safetyIntervention.reassessmentQuestionCount).toBe(5)
    expect(diagnostics.safetyIntervention.reassessmentPassPercent).toBe(100)
    expect(diagnostics.concepts.reduce((sum, item) => sum + item.initialMisses, 0)).toBe(2)
  })

  it('builds the live 20/10/40/15/15 grade from durable Chapter 17 evidence', () => {
    const activityRows: LiveInstructorActivityEvidenceRow[] = [
      ...getFlashcardEvidenceInventory('ch-17').map((itemId) => ({
        chapter_id:'ch-17', source:'flashcard' as const, item_id:itemId, is_correct:true,
      })),
      ...getScenarioEvidenceInventory('ch-17').map((itemId) => ({
        chapter_id:'ch-17', source:'scenario_application' as const, item_id:itemId, is_correct:true,
      })),
    ]

    expect(getFlashcardEvidenceInventory('ch-17')).toHaveLength(60)
    expect(getScenarioEvidenceInventory('ch-17')).toEqual(['scenario-1:0'])

    const grade = buildLiveInstructorChapterGrade({
      chapterId:'ch-17',
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
    expect(canAccessRoute('instructor','/instructor/student/student-c17')).toBe(true)
    expect(canAccessRoute('school_admin','/instructor/student/student-c17')).toBe(true)
    expect(canAccessRoute('student','/instructor/student/student-c17')).toBe(false)

    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    expect(page).toContain("if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role))")
    expect(page).toContain(".eq('school_id', instructorProfile.school_id)")
    expect(page).toContain(".in('role', ['student', 'apprentice'])")
    expect(page).toContain("row.chapter_id === 'ch-17'")
    expect(page).toContain('buildChapter17InstructorDiagnostics({')
    expect(page).toContain("buildLiveGrade('ch-17', chapter17Diagnostics)")
    expect(page).toContain('Chapter 17 — Chemical Texture Services')
    expect(page).toContain('chapter17Diagnostics.safetyIntervention.requiresInstructorReview')
    expect(page).toContain('chapter17Diagnostics.remediationStatus')
    expect(page).toContain('chapter17Diagnostics.latestReassessment')
    expect(page).toContain('chapter17Diagnostics.weakestConcepts')
    expect(page).toContain('chapter17Diagnostics.concepts.map')
  })

  it('does not expose internal IDs or raw answer payloads in the Chapter 17 diagnostic panel', () => {
    const page = read('src/app/instructor/student/[studentId]/page.tsx')
    const marker = '{/* Chapter 17 mastery, chemical safety, remediation & instructor visibility */}'
    const start = page.indexOf(marker)
    expect(start).toBeGreaterThanOrEqual(0)
    const section = page.slice(start, page.indexOf('</section>', start) + '</section>'.length)

    expect(section).toContain('without exposing internal IDs or raw answer payloads')
    expect(section).not.toContain('answers_json')
    expect(section).not.toContain('studentId')
    expect(section).not.toContain('question_id')
    expect(section).not.toContain('item_id')
  })
})
