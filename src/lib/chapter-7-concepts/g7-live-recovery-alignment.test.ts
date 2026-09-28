import { describe, expect, it } from 'vitest'
import { buildChapter7InstructorDiagnostics } from './instructor-diagnostics'
import { getChapter7ReassessmentQuestionsForConcept } from './mappings'
import { chapter7ReassessmentQuestions } from '../chapter-7-reassessment-questions'

const reserveById = new Map(chapter7ReassessmentQuestions.map((question) => [question.id, question]))

function reassessmentAnswers(count: number) {
  return Object.fromEntries(
    getChapter7ReassessmentQuestionsForConcept('ch7-water-ph')
      .slice(0, count)
      .map((id) => {
        const question = reserveById.get(id)
        if (!question) throw new Error(`Missing Chapter 7 reassessment question ${id}`)
        return [id, question.correct_answer]
      }),
  )
}

describe('G7 Chapter 7 live recovery alignment', () => {
  it('feeds a complete five-question reassessment into the shared recovery grade', () => {
    const withoutRecovery = buildChapter7InstructorDiagnostics({
      studentId: 'student-7',
      completionPercent: 50,
      microCheckRows: [],
      quizAttempts: [{
        quiz_id: 'quiz-7',
        percentage: 50,
        answers_json: null,
        completed_at: '2026-09-27T20:00:00.000Z',
        is_reassessment: false,
        target_concept_id: null,
      }],
      remediationCycles: [],
      referenceTime: '2026-09-27T22:00:00.000Z',
    })

    const withRecovery = buildChapter7InstructorDiagnostics({
      studentId: 'student-7',
      completionPercent: 50,
      microCheckRows: [],
      quizAttempts: [
        {
          quiz_id: 'quiz-7',
          percentage: 50,
          answers_json: null,
          completed_at: '2026-09-27T20:00:00.000Z',
          is_reassessment: false,
          target_concept_id: null,
        },
        {
          quiz_id: 'quiz-7',
          percentage: 100,
          answers_json: reassessmentAnswers(5),
          completed_at: '2026-09-27T21:00:00.000Z',
          is_reassessment: true,
          target_concept_id: 'ch7-water-ph',
          remediation_cycle_id: 'cycle-g7-water',
        },
      ],
      remediationCycles: [],
      referenceTime: '2026-09-27T22:00:00.000Z',
    })

    expect(withRecovery.remediationReassessmentPercent).toBe(100)
    expect(withRecovery.chapterGrade.finalGrade).toBeGreaterThan(withoutRecovery.chapterGrade.finalGrade)
    expect(withRecovery.latestReassessment).toContain('100%')
  })

  it('does not apply recovery before five unique reassessment questions are complete', () => {
    const result = buildChapter7InstructorDiagnostics({
      studentId: 'student-7',
      completionPercent: 50,
      microCheckRows: [],
      quizAttempts: [{
        quiz_id: 'quiz-7',
        percentage: 100,
        answers_json: reassessmentAnswers(4),
        completed_at: '2026-09-27T21:00:00.000Z',
        is_reassessment: true,
        target_concept_id: 'ch7-water-ph',
        remediation_cycle_id: 'cycle-g7-water',
      }],
      remediationCycles: [],
      referenceTime: '2026-09-27T22:00:00.000Z',
    })

    expect(result.remediationReassessmentPercent).toBeNull()
    expect(result.latestReassessment).toContain('4/5 in progress')
    expect(result.chapterGrade.recoveryApplied).toBe(false)
  })
})
