import { describe, expect, it } from 'vitest'
import { buildChapter9InstructorDiagnostics } from './instructor-diagnostics'

describe('Chapter 9 instructor diagnostics presentation adapter', () => {
  it('surfaces Chapter 9 concept evidence with human-readable names', () => {
    const result = buildChapter9InstructorDiagnostics({
      studentId: 'student-9',
      completionPercent: 70,
      referenceTime: '2026-09-27T03:00:00.000Z',
      microCheckRows: [{
        id: 'internal-row',
        user_id: 'student-9',
        chapter_id: 'ch-9',
        check_id: 'mc-9-04',
        question_id: 'mcq-9-010',
        concept_id: 'ch9-secondary-lesions',
        difficulty: 'scenario',
        selected_answer: 'a',
        is_correct: false,
        answered_at: '2026-09-27T02:00:00.000Z',
        created_at: '2026-09-27T02:00:00.000Z',
      }],
      quizAttempts: [],
    })

    expect(result.concepts).toHaveLength(10)
    expect(result.concepts.some((concept) => concept.conceptName === 'Secondary Skin Lesions')).toBe(true)
    expect(result.safetyIntervention.requiresInstructorReview).toBe(true)
    expect(JSON.stringify(result)).not.toContain('internal-row')
    expect(JSON.stringify(result)).not.toContain('mc-9-04')
  })

  it('reconstructs Chapter 9 assessment evidence from answers_json', () => {
    const result = buildChapter9InstructorDiagnostics({
      studentId: 'student-9',
      completionPercent: 100,
      referenceTime: '2026-09-27T03:00:00.000Z',
      microCheckRows: [],
      quizAttempts: [{
        quiz_id: 'quiz-9',
        percentage: 67,
        answers_json: {
          'q9-013': 'c',
          'q9-014': 'a',
          'q9-015': 'a',
        },
        completed_at: '2026-09-27T02:00:00.000Z',
        is_reassessment: false,
        target_concept_id: null,
      }],
    })

    const primary = result.concepts.find((concept) => concept.conceptName === 'Primary Skin Lesions')
    expect(primary?.observations).toBe(3)
    expect(primary?.initialMisses).toBe(2)
    expect(result.chapterAssessmentPercent).toBe(67)
    expect(result.remediationStatus).toContain('Primary Skin Lesions')
  })

  it('shows urgent safety intervention for distinct high-risk misses', () => {
    const result = buildChapter9InstructorDiagnostics({
      studentId: 'student-9',
      completionPercent: 80,
      referenceTime: '2026-09-27T03:00:00.000Z',
      microCheckRows: [],
      quizAttempts: [{
        quiz_id: 'quiz-9',
        percentage: 60,
        answers_json: {
          'q9-018': 'a',
          'q9-024': 'a',
        },
        completed_at: '2026-09-27T02:00:00.000Z',
        is_reassessment: false,
        target_concept_id: null,
      }],
    })

    expect(result.safetyIntervention.level).toBe('urgent')
    expect(result.safetyIntervention.requiresFormalSafetyReassessment).toBe(true)
    expect(result.safetyIntervention.reassessmentQuestionCount).toBe(5)
    expect(result.safetyIntervention.reassessmentPassPercent).toBe(100)
  })

  it('preserves initial misses while showing successful reassessment recovery', () => {
    const result = buildChapter9InstructorDiagnostics({
      studentId: 'student-9',
      completionPercent: 100,
      referenceTime: '2026-09-27T04:00:00.000Z',
      microCheckRows: [{
        id: 'row-primary-miss',
        user_id: 'student-9',
        chapter_id: 'ch-9',
        check_id: 'mc-9-07',
        question_id: 'mcq-9-007',
        concept_id: 'ch9-primary-lesions',
        difficulty: 'application',
        selected_answer: 'a',
        is_correct: false,
        answered_at: '2026-09-27T02:00:00.000Z',
        created_at: '2026-09-27T02:00:00.000Z',
      }],
      quizAttempts: [
        {
          quiz_id: 'quiz-9',
          percentage: 80,
          answers_json: {
            'q9-013': 'a',
            'q9-014': 'a',
            'q9-015': 'a',
          },
          completed_at: '2026-09-27T02:10:00.000Z',
          is_reassessment: false,
          target_concept_id: null,
        },
        {
          quiz_id: 'quiz-9-remediation',
          percentage: 100,
          answers_json: {
            'r9-primary-001': 'a',
            'r9-primary-002': 'a',
            'r9-primary-003': 'b',
            'r9-primary-004': 'a',
            'r9-primary-005': 'a',
          },
          completed_at: '2026-09-27T03:00:00.000Z',
          is_reassessment: true,
          target_concept_id: 'ch9-primary-lesions',
        },
      ],
    })

    const primary = result.concepts.find((concept) => concept.conceptName === 'Primary Skin Lesions')
    expect(primary?.initialMisses).toBeGreaterThan(0)
    expect(primary?.reassessmentCorrect).toBe(5)
    expect(result.latestReassessment).toBe('100% — Primary Skin Lesions')
    expect(result.chapterGrade.recoveryApplied).toBe(true)
    expect(result.remediationReassessmentPercent).toBe(100)
  })
})
