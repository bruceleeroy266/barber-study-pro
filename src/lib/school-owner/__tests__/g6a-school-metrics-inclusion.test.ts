import { describe, expect, it } from 'vitest'
import {
  buildSchoolAnalyticsSnapshot,
  buildSchoolOverviewMetrics,
  buildStudentPerformanceRows,
  generateSchoolReport,
  type SchoolAnalyticsInputs,
} from '@/lib/school-owner/school-analytics'
import type {
  Assessment,
  Grade,
  GradeCategory,
  HourLog,
  Profile,
  QuizAttempt,
  StudentProgress,
} from '@/types'

function learner(id: string, include: boolean): Profile {
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
    include_in_school_metrics: include,
    approved_by: null,
    approved_at: null,
    requires_password_change: false,
    created_at: '2026-10-05T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
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

function attempt(userId: string, percentage: number): QuizAttempt {
  return {
    id: `attempt-${userId}`,
    user_id: userId,
    quiz_id: `quiz-${userId}`,
    score: percentage,
    total_questions: 100,
    percentage,
    answers_json: {},
    completed_at: '2026-10-05T12:00:00Z',
  }
}

function progress(userId: string, percentage: number): StudentProgress {
  return {
    id: `progress-${userId}`,
    user_id: userId,
    chapter_id: 'chapter-1',
    lesson_completed: true,
    flashcards_completed: true,
    knowledge_checks_completed: true,
    quiz_completed: true,
    best_quiz_score: percentage,
    last_studied_at: '2026-10-05T12:00:00Z',
    progress_percentage: percentage,
  }
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
    dateEntered: '2026-10-05T12:00:00Z',
    instructorId: 'instructor-1',
    instructorName: 'Instructor One',
    notes: null,
    isExcused: false,
  }
}

function hour(userId: string, hours: number): HourLog {
  return {
    id: `hour-${userId}`,
    user_id: userId,
    date: '2026-10-05',
    category: 'Clinic',
    minutes: hours * 60,
    status: 'approved',
    notes: null,
    created_at: '2026-10-05T00:00:00Z',
    updated_at: '2026-10-05T00:00:00Z',
  }
}

function assessment(userId: string, passed: boolean): Assessment {
  return {
    id: `assessment-${userId}`,
    studentId: userId,
    assessmentType: 'HAIRCUT',
    score: passed ? 100 : 20,
    scoringType: 'NUMERIC',
    qualitativeResult: passed ? 'PASS' : 'FAIL',
    feedback: '',
    assessmentDate: '2026-10-05T12:00:00Z',
    evaluatorId: 'instructor-1',
    evaluatorName: 'Instructor One',
    rubricId: 'rubric-1',
    isPassed: passed,
  }
}

describe('G6-A school metrics inclusion boundary', () => {
  it('keeps opted-out learner data visible while excluding it from aggregate school metrics', () => {
    const included = learner('included', true)
    const supplemental = learner('supplemental', false)

    const inputs: SchoolAnalyticsInputs = {
      students: [included, supplemental],
      instructors: [],
      attendanceRecords: [],
      hourLogs: [hour(included.id, 10), hour(supplemental.id, 100)],
      quizAttempts: [attempt(included.id, 100), attempt(supplemental.id, 20)],
      progress: [progress(included.id, 100), progress(supplemental.id, 20)],
      grades: [grade(included.id, 100), grade(supplemental.id, 20)],
      gradeCategories: [category],
      assessments: [assessment(included.id, true), assessment(supplemental.id, false)],
      notifications: [],
      requiredHours: 100,
      requiredAssessments: 1,
    }

    const metrics = buildSchoolOverviewMetrics(inputs)
    const includedOnlyMetrics = buildSchoolOverviewMetrics({
      ...inputs,
      students: [included],
      hourLogs: [hour(included.id, 10)],
      quizAttempts: [attempt(included.id, 100)],
      progress: [progress(included.id, 100)],
      grades: [grade(included.id, 100)],
      assessments: [assessment(included.id, true)],
    })
    const rows = buildStudentPerformanceRows(inputs)
    const snapshot = buildSchoolAnalyticsSnapshot(inputs)
    const report = generateSchoolReport('school_summary', inputs)

    expect(metrics.totalStudents).toBe(1)
    expect(metrics.activeStudents).toBe(1)
    expect(metrics.averageGrade).toBe(100)
    expect(metrics.completedHours).toBe(10)
    expect(metrics.assessmentCompletionRate).toBe(100)
    expect(metrics.atRiskStudents).toBe(includedOnlyMetrics.atRiskStudents)

    // Individual evidence is intentionally preserved for both learners.
    expect(rows).toHaveLength(2)
    expect(rows.find((row) => row.studentId === supplemental.id)?.overallGrade).toBe(20)

    // Aggregate distributions and reports use only the included cohort.
    expect(snapshot.gradeDistribution.reduce((sum, bucket) => sum + bucket.count, 0)).toBe(1)
    expect(snapshot.riskDistribution.reduce((sum, bucket) => sum + bucket.count, 0)).toBe(1)
    expect(report.rows.find((row) => row.Metric === 'Total Students')?.Value).toBe(1)
  })

  it('treats legacy profiles without the flag as included', () => {
    const legacy = learner('legacy', true)
    delete legacy.include_in_school_metrics

    const inputs: SchoolAnalyticsInputs = {
      students: [legacy],
      instructors: [],
      attendanceRecords: [],
      hourLogs: [],
      quizAttempts: [attempt(legacy.id, 90)],
      progress: [progress(legacy.id, 90)],
      grades: [grade(legacy.id, 90)],
      gradeCategories: [category],
      assessments: [],
      notifications: [],
    }

    expect(buildSchoolOverviewMetrics(inputs).totalStudents).toBe(1)
  })
})
