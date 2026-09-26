import { describe, expect, it } from 'vitest'
import { buildChapter7InstructorDiagnostics } from './instructor-diagnostics'

describe('Chapter 7 instructor diagnostics presentation adapter', () => {
  it('produces human-readable concept diagnostics without internal IDs', () => {
    const result = buildChapter7InstructorDiagnostics({
      studentId: 'student-1',
      completionPercent: 90,
      referenceTime: '2026-09-26T12:00:00.000Z',
      microCheckRows: [
        {
          id: 'internal-row',
          user_id: 'student-1',
          chapter_id: 'ch-7',
          check_id: 'mc-7-06',
          question_id: 'mcq-7-012',
          concept_id: 'ch7-water-ph',
          difficulty: 'understanding',
          selected_answer: 'b',
          is_correct: false,
          answered_at: '2026-09-25T12:00:00.000Z',
          created_at: '2026-09-25T12:00:00.000Z',
        },
      ],
      quizAttempts: [],
      remediationCycles: [],
    })

    expect(result.concepts).toHaveLength(10)
    expect(result.concepts.some((concept) => concept.conceptName === 'Water, pH, Acids, Alkalis & Neutralization')).toBe(true)
    expect(JSON.stringify(result)).not.toContain('internal-row')
    expect(JSON.stringify(result)).not.toContain('mc-7-06')
    expect(JSON.stringify(result)).not.toContain('mcq-7-012')
  })

  it('reconstructs chapter-assessment evidence from answers_json', () => {
    const result = buildChapter7InstructorDiagnostics({
      studentId: 'student-1',
      completionPercent: 100,
      referenceTime: '2026-09-26T12:00:00.000Z',
      microCheckRows: [],
      quizAttempts: [{
        quiz_id: 'quiz-7',
        percentage: 50,
        answers_json: {
          'qq-7-001': 'a',
          'qq-7-002': 'd',
          'qq-7-003': 'c',
        },
        completed_at: '2026-09-25T12:00:00.000Z',
        is_reassessment: false,
        target_concept_id: null,
      }],
      remediationCycles: [],
    })

    const organic = result.concepts.find((concept) => concept.conceptName === 'Organic & Inorganic Chemistry')
    expect(organic?.observations).toBe(3)
    expect(result.chapterAssessmentPercent).toBe(50)
  })

  it('keeps chapter grade based on available graded evidence only', () => {
    const result = buildChapter7InstructorDiagnostics({
      studentId: 'student-1',
      completionPercent: 100,
      referenceTime: '2026-09-26T12:00:00.000Z',
      microCheckRows: [],
      quizAttempts: [{
        quiz_id: 'quiz-7',
        percentage: 80,
        answers_json: {},
        completed_at: '2026-09-25T12:00:00.000Z',
        is_reassessment: false,
        target_concept_id: null,
      }],
      remediationCycles: [],
    })

    expect(result.chapterGrade.finalGrade).toBe(80)
    expect(result.chapterGrade.componentWeights.micro_check).toBe(0.20)
    expect(result.chapterGrade.componentWeights.chapter_assessment).toBe(0.40)
  })

  it('returns intervention reasons with human-readable names and no concept IDs', () => {
    const rows = Array.from({ length: 3 }, (_, index) => ({
      id: `row-${index}`,
      user_id: 'student-1',
      chapter_id: 'ch-7' as const,
      check_id: 'mc-7-10',
      question_id: `mcq-safety-${index}`,
      concept_id: 'ch7-chemical-safety' as const,
      difficulty: index === 0 ? 'application' as const : 'scenario' as const,
      selected_answer: index === 1 ? 'a' as const : 'b' as const,
      is_correct: index === 1,
      answered_at: `2026-09-2${index + 2}T12:00:00.000Z`,
      created_at: `2026-09-2${index + 2}T12:00:00.000Z`,
    }))

    const result = buildChapter7InstructorDiagnostics({
      studentId: 'student-1',
      completionPercent: 50,
      referenceTime: '2026-09-26T12:00:00.000Z',
      microCheckRows: rows,
      quizAttempts: [],
      remediationCycles: [],
    })

    const flag = result.interventionFlags.find((item) => item.type === 'repeated_safety_misses')
    expect(flag?.reason).toBeTruthy()
    expect(flag?.reason).not.toContain('ch7-')
    expect(flag?.reason).not.toContain('mcq-')
  })
})
