import { describe, expect, it } from 'vitest'
import { ACTIVE_CONCEPT_IDS } from './concepts'
import { chapter2MicroChecks } from './micro-checks'
import { chapter2ReassessmentQuestions } from '../chapter-2-reassessment-questions'
import { chapter2QuizQuestionMappings } from './mappings'
import {
  buildChapter2InstructorDiagnostics,
  type Chapter2InstructorQuizAttempt,
} from './instructor-diagnostics'
import type { Chapter2MicroCheckAttemptRow } from './micro-check-persistence'

describe('G5 Chapter 2 shared grading baseline', () => {
  it('uses first-attempt micro-check evidence without overwriting it', () => {
    expect(chapter2MicroChecks).toHaveLength(10)
    expect(chapter2MicroChecks.flatMap((check) => check.questions)).toHaveLength(20)
    expect(new Set(chapter2MicroChecks.flatMap((check) => check.questions.map((q) => q.id))).size).toBe(20)
  })

  it('exposes all 25 active concepts in instructor diagnostics', () => {
    const result = buildChapter2InstructorDiagnostics({
      studentId: 'student-2',
      completionPercent: 0,
      microCheckRows: [],
      quizAttempts: [],
      referenceTime: '2026-09-27T17:00:00.000Z',
    })
    expect(result.concepts).toHaveLength(ACTIVE_CONCEPT_IDS.length)
    expect(result.concepts).toHaveLength(25)
    expect(result.overallConfidence).toBe('insufficient_evidence')
  })

  it('combines micro-check and assessment evidence for the same concept', () => {
    const micro: Chapter2MicroCheckAttemptRow[] = [{
      id: 'row-1',
      user_id: 'student-2',
      chapter_id: 'ch-2',
      check_id: 'mc-2-01',
      question_id: 'mcq-2-001',
      concept_id: 'C-2-01',
      difficulty: 'understanding',
      selected_answer: 'a',
      is_correct: true,
      answered_at: '2026-09-27T15:00:00.000Z',
      created_at: '2026-09-27T15:00:00.000Z',
    }]

    const attempt: Chapter2InstructorQuizAttempt = {
      quiz_id: 'quiz-2',
      percentage: 50,
      answers_json: { 'qq-2-001': 'd', 'qq-2-021': 'd' },
      completed_at: '2026-09-27T16:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
      remediation_cycle_id: null,
    }

    const result = buildChapter2InstructorDiagnostics({
      studentId: 'student-2',
      completionPercent: 50,
      microCheckRows: micro,
      quizAttempts: [attempt],
      referenceTime: '2026-09-27T17:00:00.000Z',
    })

    const concept = result.concepts.find((item) => item.conceptId === 'C-2-01')!
    expect(concept.observations).toBe(3)
    expect(concept.initialMisses).toBe(2)
    expect(result.microCheckPercent).toBe(100)
    expect(result.chapterAssessmentPercent).toBe(50)
  })

  it('does not grant formal recovery from the legacy one-question reserve', () => {
    const reserve = chapter2ReassessmentQuestions.find((q) => q.id === 'qq-2-060')!
    const attempt: Chapter2InstructorQuizAttempt = {
      quiz_id: 'quiz-2',
      percentage: 100,
      answers_json: { [reserve.id]: reserve.correct_answer },
      completed_at: '2026-09-27T16:00:00.000Z',
      is_reassessment: true,
      target_concept_id: 'C-2-01',
      remediation_cycle_id: 'cycle-c2-1',
    }

    const result = buildChapter2InstructorDiagnostics({
      studentId: 'student-2',
      completionPercent: 50,
      microCheckRows: [],
      quizAttempts: [attempt],
      referenceTime: '2026-09-27T17:00:00.000Z',
    })

    expect(result.remediationReassessmentPercent).toBeNull()
    expect(result.latestReassessment).toContain('1/5 in progress')
    expect(result.chapterGrade.recoveryApplied).toBe(false)
  })

  it('documents the remaining five-question reserve gap for every active concept', () => {
    const counts = new Map<string, number>()
    for (const question of chapter2ReassessmentQuestions) {
      const mapping = chapter2QuizQuestionMappings.find((item) => item.questionId === question.id)
      if (!mapping) continue
      counts.set(mapping.conceptId, (counts.get(mapping.conceptId) ?? 0) + 1)
    }

    expect(ACTIVE_CONCEPT_IDS.every((conceptId) => counts.get(conceptId) === 1)).toBe(true)
  })
})
