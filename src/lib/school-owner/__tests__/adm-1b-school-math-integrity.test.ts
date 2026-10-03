import { describe, expect, it } from 'vitest'
import {
  buildSchoolHealthScore,
  buildSchoolOverviewMetrics,
  buildStudentPerformanceRows,
  generateSchoolReport,
  SchoolAnalyticsInputs,
} from '@/lib/school-owner/school-analytics'
import {
  Assessment,
  AttendanceRecord,
  Grade,
  GradeCategory,
  HourLog,
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
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z',
  }
}

function attendance(userId: string, date = '2026-10-01'): AttendanceRecord {
  return {
    id: `att-${userId}-${date}`,
    userId,
    schoolId: 'school-1',
    date,
    status: 'Present',
    clockedInAt: null,
    clockedOutAt: null,
    minutesPresent: 480,
    note: null,
    verifiedBy: null,
    createdAt: `${date}T08:00:00Z`,
    updatedAt: `${date}T16:00:00Z`,
  }
}

function attempt(userId: string, percentage: number): QuizAttempt {
  return {
    id: `attempt-${userId}-${percentage}`,
    user_id: userId,
    quiz_id: `quiz-${userId}`,
    score: percentage,
    total_questions: 100,
    percentage,
    answers_json: {},
    completed_at: '2026-10-01T12:00:00Z',
  }
}

function progress(userId: string, percentage: number): StudentProgress {
  return {
    id: `progress-${userId}`,
    user_id: userId,
    chapter_id: 'chapter-1',
    lesson_completed: percentage > 0,
    flashcards_completed: percentage > 0,
    knowledge_checks_completed: percentage > 0,
    quiz_completed: percentage > 0,
    best_quiz_score: percentage > 0 ? percentage : null,
    last_studied_at: percentage > 0 ? '2026-10-01T12:00:00Z' : null,
    progress_percentage: percentage,
  }
}

const category: GradeCategory = {
  id: 'cat-1',
  name: 'Written',
  type: 'WRITTEN_EXAM',
  weight: 100,
  schoolId: 'school-1',
  courseId: null,
  isActive: true,
}

function grade(userId: string, percentage: number): Grade {
  return {
    id: `grade-${userId}`,
    studentId: userId,
    categoryId: category.id,
    categoryType: category.type,
    score: percentage,
    maxScore: 100,
    percentage,
    weight: 100,
    dateEntered: '2026-10-01T12:00:00Z',
    instructorId: 'instructor-1',
    instructorName: 'Instructor One',
    notes: null,
    isExcused: false,
  }
}

function assessment(userId: string, index: number, isPassed = true): Assessment {
  return {
    id: `assessment-${userId}-${index}`,
    studentId: userId,
    assessmentType: 'HAIRCUT',
    score: isPassed ? 90 : 50,
    scoringType: 'NUMERIC',
    qualitativeResult: isPassed ? 'PASS' : 'FAIL',
    feedback: '',
    assessmentDate: '2026-10-01T12:00:00Z',
    evaluatorId: 'instructor-1',
    evaluatorName: 'Instructor One',
    rubricId: 'rubric-1',
    isPassed,
  }
}

function hourLog(userId: string, hours: number): HourLog {
  return {
    id: `hours-${userId}`,
    user_id: userId,
    date: '2026-10-01',
    category: 'Clinic',
    minutes: hours * 60,
    status: 'approved',
    notes: null,
    created_at: '2026-10-01T00:00:00Z',
    updated_at: '2026-10-01T00:00:00Z',
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

describe('ADM-1B school-level mathematics integrity', () => {
  it('averages student percentages instead of summing them and never exceeds 100', () => {
    const students = [student('s1'), student('s2'), student('s3'), student('s4')]
    const data = inputs({
      students,
      attendanceRecords: students.map((s) => attendance(s.id)),
      quizAttempts: students.map((s) => attempt(s.id, 100)),
      progress: students.map((s) => progress(s.id, 100)),
      grades: students.map((s) => grade(s.id, 100)),
    })

    const metrics = buildSchoolOverviewMetrics(data)

    expect(metrics.averageAttendance).toBe(100)
    expect(metrics.averageReadiness).toBeLessThanOrEqual(100)
    expect(metrics.averageGrade).toBe(100)
    expect(metrics.averageAttendance).toBeLessThanOrEqual(100)
    expect(metrics.assessmentCompletionRate).toBeLessThanOrEqual(100)
  })

  it('school aggregates equal the average of the underlying student rows', () => {
    const students = [student('s1'), student('s2')]
    const data = inputs({
      students,
      attendanceRecords: [attendance('s1'), attendance('s2')],
      quizAttempts: [attempt('s1', 90), attempt('s2', 70)],
      progress: [progress('s1', 100), progress('s2', 50)],
      grades: [grade('s1', 100), grade('s2', 80)],
    })

    const rows = buildStudentPerformanceRows(data)
    const metrics = buildSchoolOverviewMetrics(data)

    expect(metrics.averageAttendance).toBe(
      (rows[0].attendancePercentage + rows[1].attendancePercentage) / 2
    )
    expect(metrics.averageReadiness).toBe(
      Math.round(((rows[0].readinessScore + rows[1].readinessScore) / 2) * 10) / 10
    )
    expect(metrics.averageGrade).toBe(90)
  })

  it('does not turn missing evidence into a failing grade or at-risk classification', () => {
    const newStudent = student('new-student')
    const data = inputs({ students: [newStudent] })

    const metrics = buildSchoolOverviewMetrics(data)
    const row = buildStudentPerformanceRows(data)[0]

    expect(metrics.averageAttendance).toBe(0)
    expect(metrics.averageReadiness).toBe(0)
    expect(metrics.averageGrade).toBe(0)
    expect(metrics.atRiskStudents).toBe(0)
    expect(row.isAtRisk).toBe(false)
    expect(row.riskReasons).toEqual([])
  })

  it('counts genuine negative evidence as at-risk', () => {
    const atRisk = student('risk')
    const data = inputs({
      students: [atRisk],
      grades: [grade('risk', 60)],
      assessments: [assessment('risk', 1, false)],
    })

    const metrics = buildSchoolOverviewMetrics(data)
    const row = buildStudentPerformanceRows(data)[0]

    expect(metrics.atRiskStudents).toBe(1)
    expect(row.isAtRisk).toBe(true)
    expect(row.riskReasons).toContain('Grade 60%')
    expect(row.riskReasons).toContain('Failed assessment')
  })

  it('computes assessment completion against program requirements and caps it at 100', () => {
    const students = [student('s1'), student('s2')]
    const assessments = [
      ...Array.from({ length: 3 }, (_, i) => assessment('s1', i + 1)),
      ...Array.from({ length: 7 }, (_, i) => assessment('s2', i + 1)),
    ]
    const data = inputs({
      students,
      assessments,
      requiredAssessmentsByStudentId: { s1: 5, s2: 5 },
    })

    // s1 = 3/5, s2 is capped at 5/5 => 8 completed requirements / 10 required = 80%.
    expect(buildSchoolOverviewMetrics(data).assessmentCompletionRate).toBe(80)
  })

  it('sums official hours, uses per-student requirements, and never produces negative remaining hours', () => {
    const students = [student('s1'), student('s2')]
    const data = inputs({
      students,
      hourLogs: [hourLog('s1', 1200), hourLog('s2', 1100)],
      requiredHoursByStudentId: { s1: 1200, s2: 1000 },
    })

    const metrics = buildSchoolOverviewMetrics(data)
    expect(metrics.completedHours).toBe(2300)
    expect(metrics.remainingHours).toBe(0)

    const health = buildSchoolHealthScore(data)
    expect(health.componentScores.hoursCompletion).toBe(100)
  })

  it('keeps every school-health component and the final score within 0-100', () => {
    const students = [student('s1'), student('s2'), student('s3'), student('s4')]
    const data = inputs({
      students,
      attendanceRecords: students.map((s) => attendance(s.id)),
      quizAttempts: students.map((s) => attempt(s.id, 100)),
      progress: students.map((s) => progress(s.id, 100)),
      grades: students.map((s) => grade(s.id, 100)),
      assessments: students.flatMap((s) =>
        Array.from({ length: 10 }, (_, i) => assessment(s.id, i + 1))
      ),
      hourLogs: students.map((s) => hourLog(s.id, 1500)),
      requiredHoursByStudentId: Object.fromEntries(students.map((s) => [s.id, 1200])),
      requiredAssessmentsByStudentId: Object.fromEntries(students.map((s) => [s.id, 5])),
    })

    const health = buildSchoolHealthScore(data)
    expect(health.score).toBeGreaterThanOrEqual(0)
    expect(health.score).toBeLessThanOrEqual(100)
    for (const component of Object.values(health.componentScores)) {
      expect(component).toBeGreaterThanOrEqual(0)
      expect(component).toBeLessThanOrEqual(100)
    }
  })

  it('school summary report uses the same corrected overview metrics', () => {
    const students = [student('s1'), student('s2')]
    const data = inputs({
      students,
      attendanceRecords: [attendance('s1'), attendance('s2')],
      grades: [grade('s1', 80), grade('s2', 100)],
    })

    const metrics = buildSchoolOverviewMetrics(data)
    const report = generateSchoolReport('school_summary', data)
    const byMetric = Object.fromEntries(report.rows.map((row) => [row.Metric, row.Value]))

    expect(byMetric['Average Attendance']).toBe(`${metrics.averageAttendance}%`)
    expect(byMetric['Average Grade']).toBe(`${metrics.averageGrade}%`)
    expect(byMetric['At-Risk Students']).toBe(metrics.atRiskStudents)
  })
})
