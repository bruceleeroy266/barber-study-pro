import { describe, expect, it } from 'vitest'
import {
  buildInstructorPerformanceRows,
  type SchoolAnalyticsInputs,
} from '@/lib/school-owner/school-analytics'
import {
  type ActiveStudentInstructorAssignment,
  buildInstructorAssignmentMap,
} from '@/lib/instructor/assignments'
import type {
  Assessment,
  AttendanceRecord,
  Grade,
  GradeCategory,
  Profile,
  QuizAttempt,
  StudentProgress,
} from '@/types'

function profile(id: string, role: Profile['role']): Profile {
  return {
    id,
    email: `${id}@example.com`,
    full_name: id,
    role,
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

const category: GradeCategory = {
  id: 'cat',
  name: 'Quiz',
  type: 'QUIZ',
  weight: 100,
  schoolId: 'school-1',
  courseId: null,
  isActive: true,
}

function attendance(studentId: string): AttendanceRecord {
  return {
    id: `att-${studentId}`,
    userId: studentId,
    schoolId: 'school-1',
    date: '2026-10-01',
    status: 'Present',
    clockedInAt: null,
    clockedOutAt: null,
    minutesPresent: 480,
    note: null,
    verifiedBy: null,
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T16:00:00Z',
  }
}

function attempt(studentId: string, score: number): QuizAttempt {
  return {
    id: `attempt-${studentId}`,
    user_id: studentId,
    quiz_id: `quiz-${studentId}`,
    score,
    total_questions: 100,
    percentage: score,
    answers_json: {},
    completed_at: '2026-10-01T12:00:00Z',
  }
}

function progress(studentId: string): StudentProgress {
  return {
    id: `progress-${studentId}`,
    user_id: studentId,
    chapter_id: 'ch-1',
    lesson_completed: true,
    flashcards_completed: true,
    knowledge_checks_completed: true,
    quiz_completed: true,
    best_quiz_score: 90,
    last_studied_at: '2026-10-01T12:00:00Z',
    progress_percentage: 100,
  }
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
    weight: 100,
    dateEntered: '2026-10-01T12:00:00Z',
    instructorId: 'i1',
    instructorName: 'i1',
    notes: null,
    isExcused: false,
  }
}

function assessment(studentId: string, evaluatorId: string): Assessment {
  return {
    id: `assessment-${studentId}-${evaluatorId}`,
    studentId,
    assessmentType: 'HAIRCUT',
    score: 90,
    scoringType: 'NUMERIC',
    qualitativeResult: 'PASS',
    feedback: '',
    assessmentDate: '2026-10-01T12:00:00Z',
    evaluatorId,
    evaluatorName: evaluatorId,
    rubricId: 'rubric',
    isPassed: true,
  }
}

function assignment(studentId: string, instructorId: string): ActiveStudentInstructorAssignment {
  return { school_id: 'school-1', student_id: studentId, instructor_id: instructorId }
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
    instructorAssignments: [],
    ...overrides,
  }
}

describe('ADM-1C canonical student↔instructor integrity', () => {
  it('deduplicates active assignment rows per instructor/student', () => {
    const map = buildInstructorAssignmentMap([
      assignment('s1', 'i1'),
      assignment('s1', 'i1'),
      assignment('s2', 'i1'),
    ])

    expect([...map.get('i1') ?? []].sort()).toEqual(['s1', 's2'])
  })

  it('computes instructor analytics only from each assigned roster', () => {
    const data = inputs({
      instructors: [profile('i1', 'instructor'), profile('i2', 'instructor')],
      students: [
        profile('s1', 'student'),
        profile('s2', 'student'),
        profile('s3', 'student'),
      ],
      instructorAssignments: [
        assignment('s1', 'i1'),
        assignment('s2', 'i2'),
      ],
      attendanceRecords: [attendance('s1'), attendance('s2'), attendance('s3')],
      quizAttempts: [attempt('s1', 90), attempt('s2', 70), attempt('s3', 10)],
      progress: [progress('s1'), progress('s2'), progress('s3')],
      grades: [grade('s1', 95), grade('s2', 75), grade('s3', 10)],
      assessments: [
        assessment('s1', 'i1'),
        assessment('s2', 'i2'),
        assessment('s3', 'i1'),
      ],
    })

    const rows = buildInstructorPerformanceRows(data)
    const i1 = rows.find((row) => row.instructorId === 'i1')
    const i2 = rows.find((row) => row.instructorId === 'i2')

    expect(i1?.studentsAssigned).toBe(1)
    expect(i2?.studentsAssigned).toBe(1)
    expect(i1?.averageGrade).toBe(95)
    expect(i2?.averageGrade).toBe(75)
    expect(i1?.assessmentsCompleted).toBe(1)
    expect(i2?.assessmentsCompleted).toBe(1)
  })

  it('does not silently attach unassigned students to every instructor', () => {
    const data = inputs({
      instructors: [profile('i1', 'instructor'), profile('i2', 'instructor')],
      students: [profile('unassigned', 'student')],
      grades: [grade('unassigned', 100)],
    })

    const rows = buildInstructorPerformanceRows(data)

    expect(rows).toHaveLength(2)
    expect(rows.every((row) => row.studentsAssigned === 0)).toBe(true)
    expect(rows.every((row) => row.averageGrade === 0)).toBe(true)
  })

  it('keeps unrelated evaluator activity out of instructor performance', () => {
    const data = inputs({
      instructors: [profile('i1', 'instructor')],
      students: [profile('s1', 'student'), profile('s2', 'student')],
      instructorAssignments: [assignment('s1', 'i1')],
      assessments: [
        assessment('s1', 'i1'),
        assessment('s2', 'i1'),
      ],
    })

    expect(buildInstructorPerformanceRows(data)[0]?.assessmentsCompleted).toBe(1)
  })
})
