import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  buildSchoolAlerts,
  buildSchoolAnalyticsSnapshot,
  buildStudentPerformanceRows,
  type SchoolAnalyticsInputs,
} from '@/lib/school-owner/school-analytics'
import { calculateStudentGradePerformance } from '@/lib/gradebook'
import type {
  Grade,
  GradeCategory,
  Profile,
  QuizAttempt,
  StudentProgress,
} from '@/types'

function student(id: string): Profile {
  return {
    id,
    email: `${id}@example.com`,
    full_name: `Student ${id}`,
    role: 'student',
    school_id: 'school-1',
    barber_shop_name: null,
    mentor_name: null,
    avatar_url: null,
    approval_status: 'approved',
    is_disabled: false,
    approved_by: null,
    approved_at: null,
    requires_password_change: false,
    created_at: '2026-10-03T00:00:00Z',
    updated_at: '2026-10-03T00:00:00Z',
  }
}

const category: GradeCategory = {
  id: 'cat-1',
  name: 'Written',
  type: 'WRITTEN_EXAM',
  weight: 1,
  schoolId: 'school-1',
  courseId: null,
  isActive: true,
}

function grade(studentId: string, percentage: number): Grade {
  return {
    id: `grade-${studentId}`,
    studentId,
    categoryId: category.id,
    categoryType: category.type,
    score: percentage,
    maxScore: 100,
    percentage,
    weight: 1,
    dateEntered: '2026-10-03T00:00:00Z',
    instructorId: 'instructor-1',
    instructorName: 'Instructor',
    notes: null,
    isExcused: false,
  }
}

function inputs(overrides: Partial<SchoolAnalyticsInputs> = {}): SchoolAnalyticsInputs {
  return {
    students: [],
    instructors: [],
    attendanceRecords: [],
    hourLogs: [],
    quizAttempts: [],
    progress: [],
    grades: [],
    gradeCategories: [category],
    assessments: [],
    notifications: [],
    ...overrides,
  }
}

describe('ADM-1F readiness/progress/grade/assessment parity', () => {
  it('treats a real 0% grade as failing evidence, not as no grade', () => {
    const performance = calculateStudentGradePerformance(
      's1',
      [grade('s1', 0)],
      [category],
      [],
      0,
    )

    expect(performance.hasGradeEvidence).toBe(true)
    expect(performance.overallGrade).toBe(0)
    expect(performance.isAtRisk).toBe(true)
  })

  it('keeps a student with no grade evidence distinct from a real zero', () => {
    const performance = calculateStudentGradePerformance('s1', [], [category], [], 4)

    expect(performance.hasGradeEvidence).toBe(false)
    expect(performance.overallGrade).toBe(0)
    expect(performance.missingAssignments).toBe(0)
    expect(performance.isAtRisk).toBe(false)
  })

  it('does not create a low-readiness alert when the student has no learning evidence', () => {
    const data = inputs({ students: [student('s1')] })
    expect(buildSchoolAlerts(data).filter((alert) => alert.type === 'low_readiness')).toHaveLength(0)
  })

  it('keeps valid 0% grades in the failing distribution while no-grade students stay separate', () => {
    const data = inputs({
      students: [student('zero'), student('none')],
      grades: [grade('zero', 0)],
    })

    const distribution = buildSchoolAnalyticsSnapshot(data).gradeDistribution
    const byLabel = Object.fromEntries(distribution.map((entry) => [entry.label, entry.count]))

    expect(byLabel['Below 60%']).toBe(1)
    expect(byLabel['No Grade']).toBe(1)
  })

  it('does not average no-evidence students into readiness or assessment rates', () => {
    const attempts: QuizAttempt[] = [{
      id: 'attempt-1',
      user_id: 'with-readiness',
      quiz_id: 'quiz-1',
      score: 90,
      total_questions: 100,
      percentage: 90,
      answers_json: {},
      completed_at: '2026-10-03T00:00:00Z',
    }]
    const progress: StudentProgress[] = [{
      id: 'progress-1',
      user_id: 'with-readiness',
      chapter_id: 'chapter-1',
      lesson_completed: true,
      flashcards_completed: true,
      knowledge_checks_completed: true,
      quiz_completed: true,
      best_quiz_score: 90,
      last_studied_at: '2026-10-03T00:00:00Z',
      progress_percentage: 100,
    }]

    const data = inputs({
      students: [student('with-readiness'), student('no-evidence')],
      quizAttempts: attempts,
      progress,
      assessments: [{
        id: 'assessment-1',
        studentId: 'with-readiness',
        assessmentType: 'HAIRCUT',
        score: 90,
        scoringType: 'NUMERIC',
        qualitativeResult: 'PASS',
        feedback: '',
        assessmentDate: '2026-10-03T00:00:00Z',
        evaluatorId: 'instructor-1',
        evaluatorName: 'Instructor',
        rubricId: 'rubric-1',
        isPassed: true,
      }],
    })

    const snapshot = buildSchoolAnalyticsSnapshot(data)
    expect(snapshot.readinessTrend[0]?.value).toBeGreaterThan(0)
    expect(snapshot.assessmentCompletionTrend[0]?.value).toBe(100)
  })

  it('school performance rows preserve no-data evidence separately from real zero values', () => {
    const rows = buildStudentPerformanceRows(
      inputs({
        students: [student('zero'), student('none')],
        grades: [grade('zero', 0)],
        assessments: [{
          id: 'assessment-zero',
          studentId: 'zero',
          assessmentType: 'HAIRCUT',
          score: 0,
          scoringType: 'NUMERIC',
          qualitativeResult: 'FAIL',
          feedback: '',
          assessmentDate: '2026-10-03T00:00:00Z',
          evaluatorId: 'instructor-1',
          evaluatorName: 'Instructor',
          rubricId: 'rubric-1',
          isPassed: false,
        }],
      })
    )

    const zero = rows.find((row) => row.studentId === 'zero')!
    const none = rows.find((row) => row.studentId === 'none')!

    expect(zero.hasGradeEvidence).toBe(true)
    expect(zero.overallGrade).toBe(0)
    expect(zero.hasAssessmentEvidence).toBe(true)
    expect(zero.assessmentPassRate).toBe(0)

    expect(none.hasGradeEvidence).toBe(false)
    expect(none.hasAssessmentEvidence).toBe(false)
  })

  it('student assessment UI shows no-data rather than a false 0% pass rate', () => {
    const page = fs.readFileSync(
      path.join(process.cwd(), 'src/app/(dashboard)/dashboard/assessments/page.tsx'),
      'utf8',
    )
    expect(page).toContain("assessments.length > 0 ? `${passRate}%` : '—'")
  })

  it('school performance panel does not classify missing evidence as failed performance', () => {
    const panel = fs.readFileSync(
      path.join(process.cwd(), 'src/components/school-owner/StudentPerformancePanel.tsx'),
      'utf8',
    )
    expect(panel).toContain('r.hasReadinessEvidence && r.readinessScore < 70')
    expect(panel).toContain('r.hasAssessmentEvidence && r.assessmentPassRate < 80')
    expect(panel).toContain("row.hasGradeEvidence ? `${row.overallGrade}%` : '—'")
    expect(panel).toContain("row.hasAssessmentEvidence ? `${row.assessmentPassRate}%` : '—'")
  })

  it('instructor class metrics keep real zero evidence separate from no data', () => {
    const page = fs.readFileSync(
      path.join(process.cwd(), 'src/app/instructor/page.tsx'),
      'utf8',
    )
    expect(page).toContain('studentStats.filter((s) => s.hasReadinessEvidence)')
    expect(page).toContain("studentsWithQuizzes.length > 0 ? `${classAvgQuiz}%` : '—'")
    expect(page).toContain("studentsWithReadiness.length > 0 ? classAvgReadiness : '—'")
    expect(page).toContain('const failedAssessments = assessmentRecords.filter((a) => !a.isPassed)')
    expect(page).toContain('{failedAssessments.length}')
    expect(page).toContain('Failed Assessments')
  })
})
