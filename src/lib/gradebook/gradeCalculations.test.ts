import { describe, expect, it } from 'vitest'
import type { Grade, GradeCategory } from '@/types'
import { calculateClassGradeSummary } from './gradeCalculations'

const categories: GradeCategory[] = [
  { id: 'quiz', name: 'Quizzes', type: 'QUIZ', weight: 0.4, isActive: true },
  { id: 'practical', name: 'Practical', type: 'PRACTICAL_EXAM', weight: 0.6, isActive: true },
]

function grade(
  id: string,
  studentId: string,
  categoryId: string,
  percentage: number,
  isExcused = false
): Grade {
  return {
    id,
    studentId,
    categoryId,
    categoryType: categoryId === 'quiz' ? 'QUIZ' : 'PRACTICAL_EXAM',
    score: percentage,
    maxScore: 100,
    percentage,
    weight: categoryId === 'quiz' ? 0.4 : 0.6,
    dateEntered: '2026-08-23T00:00:00.000Z',
    instructorId: 'instructor-1',
    instructorName: 'Instructor',
    isExcused,
  }
}

describe('calculateClassGradeSummary', () => {
  it('excludes ungraded students from the class average and top performers', () => {
    const summary = calculateClassGradeSummary(
      ['graded', 'ungraded'],
      [grade('g1', 'graded', 'quiz', 90)],
      categories,
      []
    )

    expect(summary.classAverage).toBe(90)
    expect(summary.gradedPerformances.map((performance) => performance.studentId)).toEqual(['graded'])
    expect(summary.topStudentIds).toEqual(['graded'])
  })

  it('returns no class average when no student has a non-excused grade', () => {
    const summary = calculateClassGradeSummary(
      ['student-1'],
      [grade('g1', 'student-1', 'quiz', 90, true)],
      categories,
      []
    )

    expect(summary.classAverage).toBeNull()
    expect(summary.gradedPerformances).toEqual([])
    expect(summary.topStudentIds).toEqual([])
  })

  it('preserves weighted-category renormalization for represented categories', () => {
    const summary = calculateClassGradeSummary(
      ['student-1'],
      [grade('g1', 'student-1', 'practical', 80)],
      categories,
      []
    )

    expect(summary.classAverage).toBe(80)
  })
})
