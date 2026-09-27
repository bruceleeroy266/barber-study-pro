import { describe, expect, it } from 'vitest'
import { chapter8PremiumQuizQuestions } from '../chapter-8-premium-quiz'
import { chapter8ReassessmentReserve } from './reassessment-reserve'
import { chapter8QuizQuestionConceptMappings } from './mappings'
import {
  buildChapter8InstructorDiagnostics,
  type Chapter8InstructorQuizAttempt,
} from './instructor-diagnostics'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (['a', 'b', 'c', 'd'].find((answer) => answer !== correct) ?? 'a') as 'a' | 'b' | 'c' | 'd'
}

describe('Chapter 8 instructor diagnostics', () => {
  it('presents all ten canonical concepts with human-readable names', () => {
    const result = buildChapter8InstructorDiagnostics({
      studentId: 'student-8',
      completionPercent: 0,
      microCheckRows: [],
      quizAttempts: [],
      referenceTime: '2026-09-27T17:00:00.000Z',
    })

    expect(result.concepts).toHaveLength(10)
    expect(result.concepts.every((concept) => !concept.conceptName.startsWith('ch8-'))).toBe(true)
    expect(result.evidenceCount).toBe(0)
    expect(result.overallConfidence).toBe('insufficient_evidence')
  })

  it('reconstructs initial assessment misses into concept-level weakness', () => {
    const target = 'ch8-electrical-measurements'
    const questions = chapter8PremiumQuizQuestions.filter((question) =>
      chapter8QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === target,
      ),
    )

    const attempt: Chapter8InstructorQuizAttempt = {
      quiz_id: 'quiz-8',
      percentage: 70,
      answers_json: Object.fromEntries(
        questions.map((question) => [question.id, wrongAnswer(question.correct_answer)]),
      ),
      completed_at: '2026-09-27T15:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const result = buildChapter8InstructorDiagnostics({
      studentId: 'student-8',
      completionPercent: 75,
      microCheckRows: [],
      quizAttempts: [attempt],
      referenceTime: '2026-09-27T17:00:00.000Z',
    })

    const diagnostic = result.concepts.find(
      (concept) => concept.conceptFamilyId === target,
    )!
    expect(diagnostic.initialMisses).toBe(questions.length)
    expect(diagnostic.mastery).toBe(0)
    expect(result.remediationStatus).toContain('review')
  })

  it('raises instructor-visible urgent safety status after repeated hard equipment-safety misses', () => {
    const ids = ['qq-8-011', 'qq-8-012']
    const questions = ids.map(
      (id) => chapter8PremiumQuizQuestions.find((question) => question.id === id)!,
    )
    const attempt: Chapter8InstructorQuizAttempt = {
      quiz_id: 'quiz-8',
      percentage: 0,
      answers_json: Object.fromEntries(
        questions.map((question) => [question.id, wrongAnswer(question.correct_answer)]),
      ),
      completed_at: '2026-09-27T15:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const result = buildChapter8InstructorDiagnostics({
      studentId: 'student-8',
      completionPercent: 75,
      microCheckRows: [],
      quizAttempts: [attempt],
      referenceTime: '2026-09-27T17:00:00.000Z',
    })

    expect(result.highestSafetyLevel).toBe('urgent')
    const equipmentSafety = result.safetyEscalations.find(
      (item) => item.conceptFamilyId === 'ch8-equipment-safety',
    )!
    expect(equipmentSafety.requiresInstructorReview).toBe(true)
    expect(equipmentSafety.requiresFormalReassessment).toBe(true)
    expect(result.remediationStatus).toContain('Urgent')
  })

  it('aggregates five persisted one-question reassessment rows and preserves initial misses', () => {
    const target = 'ch8-electricity-circuits'
    const initialQuestions = chapter8PremiumQuizQuestions.filter((question) =>
      chapter8QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === target,
      ),
    )
    const initial: Chapter8InstructorQuizAttempt = {
      quiz_id: 'quiz-8',
      percentage: 0,
      answers_json: Object.fromEntries(
        initialQuestions.map((question) => [question.id, wrongAnswer(question.correct_answer)]),
      ),
      completed_at: '2026-09-27T15:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const reserve = chapter8ReassessmentReserve
      .filter((question) => question.conceptFamilyId === target)
      .slice(0, 5)
    expect(reserve).toHaveLength(5)

    const reassessment: Chapter8InstructorQuizAttempt[] = reserve.map((question, index) => ({
      quiz_id: 'quiz-8',
      percentage: 100,
      answers_json: { [question.id]: question.correctAnswer },
      completed_at: `2026-09-27T16:0${index}:00.000Z`,
      is_reassessment: true,
      target_concept_id: target,
      remediation_cycle_id: 'cycle-8-electricity-1',
    }))

    const result = buildChapter8InstructorDiagnostics({
      studentId: 'student-8',
      completionPercent: 75,
      microCheckRows: [],
      quizAttempts: [initial, ...reassessment],
      referenceTime: '2026-09-27T17:00:00.000Z',
    })

    const diagnostic = result.concepts.find(
      (concept) => concept.conceptFamilyId === target,
    )!
    expect(diagnostic.initialMisses).toBe(initialQuestions.length)
    expect(diagnostic.reassessmentCorrect).toBe(5)
    expect(result.remediationReassessmentPercent).toBe(100)
    expect(result.latestReassessment).toContain('100%')
    expect(result.chapterGrade.finalGrade).toBeGreaterThanOrEqual(result.chapterGrade.baseGrade)
  })

  it('does not apply formal grade recovery while a five-question reassessment is incomplete', () => {
    const question = chapter8ReassessmentReserve.find(
      (item) => item.conceptFamilyId === 'ch8-light-modalities',
    )!
    const partial: Chapter8InstructorQuizAttempt = {
      quiz_id: 'quiz-8',
      percentage: 100,
      answers_json: { [question.id]: question.correctAnswer },
      completed_at: '2026-09-27T16:00:00.000Z',
      is_reassessment: true,
      target_concept_id: 'ch8-light-modalities',
      remediation_cycle_id: 'cycle-partial',
    }

    const result = buildChapter8InstructorDiagnostics({
      studentId: 'student-8',
      completionPercent: 75,
      microCheckRows: [],
      quizAttempts: [partial],
      referenceTime: '2026-09-27T17:00:00.000Z',
    })

    expect(result.remediationReassessmentPercent).toBeNull()
    expect(result.latestReassessment).toContain('1/5 in progress')
    expect(result.chapterGrade.recoveryApplied).toBe(false)
  })
})
