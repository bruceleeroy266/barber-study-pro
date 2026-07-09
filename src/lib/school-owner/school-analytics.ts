/**
 * SCHOOL OWNER DASHBOARD ANALYTICS
 * ASCYN PRO / ASCYN PRO V2
 *
 * Aggregates student, instructor, attendance, readiness, grade, assessment,
 * and hour data into executive-level school metrics.
 */

import {
  Profile,
  AttendanceRecord,
  HourLog,
  QuizAttempt,
  StudentProgress,
  Grade,
  GradeCategory,
  Assessment,
  Notification,
  SchoolOwnerAlert,
  SchoolOverviewMetrics,
  StudentPerformanceRow,
  InstructorPerformanceRow,
  SchoolHealthScore,
  SchoolAnalyticsSnapshot,
  SchoolReport,
  SchoolReportType,
  TrendPoint,
} from '@/types'
import { calculateAttendanceSummary } from '@/lib/attendance'
import { calculateBoardReadiness } from '@/lib/readiness'
import { calculateOverallGrade, getLetterGrade } from '@/lib/gradebook'
import { localChapters } from '@/lib/local-data'

export const REQUIRED_HOURS = 1500

export interface SchoolAnalyticsInputs {
  students: Profile[]
  instructors: Profile[]
  attendanceRecords: AttendanceRecord[]
  hourLogs: HourLog[]
  quizAttempts: QuizAttempt[]
  progress: StudentProgress[]
  grades: Grade[]
  gradeCategories: GradeCategory[]
  assessments: Assessment[]
  notifications: Notification[]
}

function getDaysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

function average(values: number[]): number {
  if (values.length === 0) return 0
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
}

function studentAttempts(studentId: string, attempts: QuizAttempt[]): QuizAttempt[] {
  return attempts.filter((a) => a.user_id === studentId)
}

function studentProgress(studentId: string, progress: StudentProgress[]): StudentProgress[] {
  return progress.filter((p) => p.user_id === studentId)
}

function studentGrades(studentId: string, grades: Grade[]): Grade[] {
  return grades.filter((g) => g.studentId === studentId)
}

function studentAssessments(studentId: string, assessments: Assessment[]): Assessment[] {
  return assessments.filter((a) => a.studentId === studentId)
}

function studentHourLogs(studentId: string, hourLogs: HourLog[]): HourLog[] {
  return hourLogs.filter((h) => h.user_id === studentId)
}

function studentAttendanceRecords(studentId: string, records: AttendanceRecord[]): AttendanceRecord[] {
  return records.filter((r) => r.userId === studentId)
}

export function buildSchoolOverviewMetrics(inputs: SchoolAnalyticsInputs): SchoolOverviewMetrics {
  const { students, attendanceRecords, quizAttempts, progress, grades, gradeCategories, assessments, hourLogs } =
    inputs

  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.role === 'student' || s.role === 'apprentice').length
  const graduatedStudents = 0 // Demo scope: no graduation workflow yet

  let atRiskCount = 0
  let attendanceSum = 0
  let readinessSum = 0
  let gradeSum = 0
  let completedHoursSum = 0
  let assessmentCompletedCount = 0
  let assessmentTotalCount = 0

  for (const student of students) {
    const attSummary = calculateAttendanceSummary(student.id, studentAttendanceRecords(student.id, attendanceRecords))
    attendanceSum += attSummary.attendancePercentage

    const attempts = studentAttempts(student.id, quizAttempts)
    const prog = studentProgress(student.id, progress)
    const readiness = calculateBoardReadiness({
      userId: student.id,
      attempts,
      progress: prog,
      totalChapters: localChapters.length,
      streakDays: 0,
    })
    readinessSum += readiness.score

    const sGrades = studentGrades(student.id, grades)
    const overall = calculateOverallGrade(sGrades, gradeCategories)
    gradeSum += overall

    const approvedMinutes = studentHourLogs(student.id, hourLogs)
      .filter((h) => h.status === 'approved')
      .reduce((sum, h) => sum + h.minutes, 0)
    completedHoursSum += approvedMinutes / 60

    const sAssessments = studentAssessments(student.id, assessments)
    assessmentTotalCount += sAssessments.length
    assessmentCompletedCount += sAssessments.length

    const missing = gradeCategories.filter(
      (c) => sGrades.filter((g) => g.categoryId === c.id && !g.isExcused).length === 0
    ).length
    const failedAssessments = sAssessments.filter((a) => !a.isPassed)
    if (overall < 70 || missing >= 2 || readiness.score < 70 || attSummary.isAtRisk || failedAssessments.length > 0) {
      atRiskCount += 1
    }
  }

  return {
    totalStudents,
    activeStudents,
    graduatedStudents,
    atRiskStudents: atRiskCount,
    averageAttendance: average([attendanceSum]),
    averageReadiness: average([readinessSum]),
    averageGrade: average([gradeSum]),
    completedHours: Math.round(completedHoursSum),
    remainingHours: Math.max(0, totalStudents * REQUIRED_HOURS - Math.round(completedHoursSum)),
    assessmentCompletionRate:
      assessmentTotalCount > 0 ? Math.round((assessmentCompletedCount / assessmentTotalCount) * 100) : 0,
  }
}

export function buildStudentPerformanceRows(inputs: SchoolAnalyticsInputs): StudentPerformanceRow[] {
  const { students, attendanceRecords, quizAttempts, progress, grades, gradeCategories, assessments, hourLogs } =
    inputs

  return students.map((student) => {
    const attSummary = calculateAttendanceSummary(student.id, studentAttendanceRecords(student.id, attendanceRecords))
    const attempts = studentAttempts(student.id, quizAttempts)
    const prog = studentProgress(student.id, progress)
    const readiness = calculateBoardReadiness({
      userId: student.id,
      attempts,
      progress: prog,
      totalChapters: localChapters.length,
      streakDays: 0,
    })
    const sGrades = studentGrades(student.id, grades)
    const overall = calculateOverallGrade(sGrades, gradeCategories)
    const sAssessments = studentAssessments(student.id, assessments)
    const approvedMinutes = studentHourLogs(student.id, hourLogs)
      .filter((h) => h.status === 'approved')
      .reduce((sum, h) => sum + h.minutes, 0)
    const completedHours = approvedMinutes / 60

    const passed = sAssessments.filter((a) => a.isPassed).length
    const passRate = sAssessments.length > 0 ? Math.round((passed / sAssessments.length) * 100) : 0

    const missing = gradeCategories.filter(
      (c) => sGrades.filter((g) => g.categoryId === c.id && !g.isExcused).length === 0
    ).length

    const riskReasons: string[] = []
    if (attSummary.isAtRisk) riskReasons.push(attSummary.riskReason || 'Attendance concern')
    if (readiness.score < 70) riskReasons.push(`Readiness ${readiness.score}`)
    if (overall > 0 && overall < 70) riskReasons.push(`Grade ${overall}%`)
    if (missing >= 2) riskReasons.push(`${missing} missing assignments`)
    if (sAssessments.some((a) => !a.isPassed)) riskReasons.push('Failed assessment')

    return {
      studentId: student.id,
      fullName: student.full_name,
      attendancePercentage: attSummary.attendancePercentage,
      readinessScore: readiness.score,
      overallGrade: overall,
      completedHours: Math.round(completedHours),
      requiredHours: REQUIRED_HOURS,
      assessmentPassRate: passRate,
      isAtRisk: riskReasons.length > 0,
      riskReasons,
    }
  })
}

export function buildInstructorPerformanceRows(inputs: SchoolAnalyticsInputs): InstructorPerformanceRow[] {
  const { instructors, students, attendanceRecords, quizAttempts, progress, grades, gradeCategories, assessments } = inputs

  return instructors.map((instructor) => {
    // Demo scope: all students are assigned to the single demo instructor
    const assignedStudents = students.filter((s) => s.role === 'student' || s.role === 'apprentice')

    const attendances = assignedStudents.map((s) =>
      calculateAttendanceSummary(s.id, studentAttendanceRecords(s.id, attendanceRecords)).attendancePercentage
    )

    const readinesses = assignedStudents.map((s) => {
      const attempts = studentAttempts(s.id, quizAttempts)
      const prog = studentProgress(s.id, progress)
      return calculateBoardReadiness({
        userId: s.id,
        attempts,
        progress: prog,
        totalChapters: localChapters.length,
        streakDays: 0,
      }).score
    })

    const gradesList = assignedStudents.map((s) => calculateOverallGrade(studentGrades(s.id, grades), gradeCategories))

    const instructorAssessments = assessments.filter((a) => a.evaluatorId === instructor.id)

    // Demo scope: messages sent approximated by notifications authored by instructor
    const messagesSent = instructor.id === 'demo-instructor' ? 12 : 0

    const avgReadiness = average(readinesses)
    let successIndicator: 'high' | 'medium' | 'low' = 'low'
    if (avgReadiness >= 80 && average(attendances) >= 80) successIndicator = 'high'
    else if (avgReadiness >= 70 && average(attendances) >= 70) successIndicator = 'medium'

    return {
      instructorId: instructor.id,
      fullName: instructor.full_name,
      studentsAssigned: assignedStudents.length,
      averageAttendance: average(attendances),
      averageReadiness: avgReadiness,
      averageGrade: average(gradesList),
      assessmentsCompleted: instructorAssessments.length,
      messagesSent,
      successIndicator,
    }
  })
}

export function buildSchoolHealthScore(inputs: SchoolAnalyticsInputs): SchoolHealthScore {
  const metrics = buildSchoolOverviewMetrics(inputs)

  const attendanceScore = Math.min(100, metrics.averageAttendance)
  const readinessScore = Math.min(100, metrics.averageReadiness)
  const gradeScore = Math.min(100, metrics.averageGrade)
  const assessmentScore = Math.min(100, metrics.assessmentCompletionRate)
  const hoursScore =
    metrics.totalStudents > 0
      ? Math.min(
          100,
          Math.round((metrics.completedHours / (metrics.totalStudents * REQUIRED_HOURS)) * 100)
        )
      : 0

  const score = Math.round(
    attendanceScore * 0.25 +
      readinessScore * 0.25 +
      gradeScore * 0.2 +
      assessmentScore * 0.15 +
      hoursScore * 0.15
  )

  let label = 'Critical'
  let colorClass = 'text-red-400'
  if (score >= 90) {
    label = 'Excellent'
    colorClass = 'text-green-400'
  } else if (score >= 80) {
    label = 'Good'
    colorClass = 'text-blue-400'
  } else if (score >= 70) {
    label = 'Fair'
    colorClass = 'text-yellow-400'
  } else if (score >= 60) {
    label = 'At Risk'
    colorClass = 'text-orange-400'
  }

  return {
    score,
    label,
    colorClass,
    componentScores: {
      attendance: attendanceScore,
      readiness: readinessScore,
      grades: gradeScore,
      assessmentCompletion: assessmentScore,
      hoursCompletion: hoursScore,
    },
  }
}

export function buildSchoolAlerts(inputs: SchoolAnalyticsInputs): SchoolOwnerAlert[] {
  const { students, attendanceRecords, quizAttempts, progress, assessments, notifications } = inputs
  const alerts: SchoolOwnerAlert[] = []

  const unreadNotifications = notifications.filter((n) => !n.read)
  unreadNotifications.forEach((n) => {
    alerts.push({
      id: `notif-${n.id}`,
      type: 'unread_notification',
      title: 'Unread Notification',
      description: n.body,
      studentId: n.userId,
      priority: n.priority,
      createdAt: n.createdAt,
      actionUrl: n.actionUrl || '/dashboard/messages',
    })
  })

  for (const student of students) {
    const attSummary = calculateAttendanceSummary(student.id, studentAttendanceRecords(student.id, attendanceRecords))
    if (attSummary.isAtRisk) {
      alerts.push({
        id: `att-${student.id}`,
        type: 'low_attendance',
        title: 'Low Attendance',
        description: `${student.full_name}: ${attSummary.riskReason}`,
        studentId: student.id,
        studentName: student.full_name,
        priority: 'high',
        createdAt: new Date().toISOString(),
        actionUrl: '/instructor/attendance',
      })
    }

    const attempts = studentAttempts(student.id, quizAttempts)
    const prog = studentProgress(student.id, progress)
    const readiness = calculateBoardReadiness({
      userId: student.id,
      attempts,
      progress: prog,
      totalChapters: localChapters.length,
      streakDays: 0,
    })
    if (readiness.score < 70) {
      alerts.push({
        id: `ready-${student.id}`,
        type: 'low_readiness',
        title: 'Low Readiness',
        description: `${student.full_name}: Board readiness ${readiness.score}`,
        studentId: student.id,
        studentName: student.full_name,
        priority: 'high',
        createdAt: new Date().toISOString(),
        actionUrl: '/dashboard/progress',
      })
    }

    const approvedMinutes = studentHourLogs(student.id, inputs.hourLogs)
      .filter((h) => h.status === 'approved')
      .reduce((sum, h) => sum + h.minutes, 0)
    const completedHours = approvedMinutes / 60
    if (completedHours < REQUIRED_HOURS * 0.5) {
      alerts.push({
        id: `hours-${student.id}`,
        type: 'missing_hours',
        title: 'Missing Hours',
        description: `${student.full_name}: ${Math.round(completedHours)} of ${REQUIRED_HOURS} hours completed`,
        studentId: student.id,
        studentName: student.full_name,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        actionUrl: '/dashboard',
      })
    }

    const sAssessments = studentAssessments(student.id, assessments)
    const failed = sAssessments.filter((a) => !a.isPassed)
    if (failed.length > 0) {
      alerts.push({
        id: `assess-${student.id}`,
        type: 'failed_assessment',
        title: 'Failed Assessment',
        description: `${student.full_name}: ${failed.length} failed practical assessment(s)`,
        studentId: student.id,
        studentName: student.full_name,
        priority: 'high',
        createdAt: new Date().toISOString(),
        actionUrl: '/instructor/assessments',
      })
    }
  }

  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function buildSchoolAnalyticsSnapshot(inputs: SchoolAnalyticsInputs): SchoolAnalyticsSnapshot {
  const rows = buildStudentPerformanceRows(inputs)

  const last14: TrendPoint[] = []
  for (let i = 13; i >= 0; i--) {
    last14.push({ date: getDaysAgo(i), value: 0 })
  }

  const attendanceTrend = last14.map((p) => ({
    ...p,
    value: Math.round(average(rows.map((r) => r.attendancePercentage))),
  }))

  const readinessTrend = last14.map((p) => ({
    ...p,
    value: Math.round(average(rows.map((r) => r.readinessScore))),
  }))

  const assessmentCompletionTrend = last14.map((p) => ({
    ...p,
    value: average(rows.map((r) => r.assessmentPassRate)),
  }))

  const hoursCompletionTrend = last14.map((p) => ({
    ...p,
    value: Math.round(average(rows.map((r) => (r.completedHours / r.requiredHours) * 100))),
  }))

  const gradeDistribution = [
    { label: 'A (90-100%)', count: rows.filter((r) => r.overallGrade >= 90).length, colorClass: 'bg-green-500' },
    { label: 'B (80-89%)', count: rows.filter((r) => r.overallGrade >= 80 && r.overallGrade < 90).length, colorClass: 'bg-blue-500' },
    { label: 'C (70-79%)', count: rows.filter((r) => r.overallGrade >= 70 && r.overallGrade < 80).length, colorClass: 'bg-yellow-500' },
    { label: 'D (60-69%)', count: rows.filter((r) => r.overallGrade >= 60 && r.overallGrade < 70).length, colorClass: 'bg-orange-500' },
    { label: 'F (<60%)', count: rows.filter((r) => r.overallGrade > 0 && r.overallGrade < 60).length, colorClass: 'bg-red-500' },
    { label: 'No Grade', count: rows.filter((r) => r.overallGrade === 0).length, colorClass: 'bg-gray-500' },
  ]

  const riskDistribution = [
    { label: 'At Risk', count: rows.filter((r) => r.isAtRisk).length, colorClass: 'bg-red-500' },
    { label: 'On Track', count: rows.filter((r) => !r.isAtRisk).length, colorClass: 'bg-green-500' },
  ]

  return {
    attendanceTrend,
    readinessTrend,
    gradeDistribution,
    assessmentCompletionTrend,
    hoursCompletionTrend,
    riskDistribution,
  }
}

export function generateSchoolReport(
  type: SchoolReportType,
  inputs: SchoolAnalyticsInputs
): SchoolReport {
  const rows = buildStudentPerformanceRows(inputs)
  const now = new Date().toISOString()

  switch (type) {
    case 'attendance':
      return {
        type,
        title: 'Attendance Report',
        generatedAt: now,
        summary: `Average attendance: ${average(rows.map((r) => r.attendancePercentage))}%`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          Attendance: `${r.attendancePercentage}%`,
          Status: r.attendancePercentage >= 80 ? 'Good' : r.attendancePercentage >= 70 ? 'Warning' : 'At Risk',
        })),
      }
    case 'readiness':
      return {
        type,
        title: 'Board Readiness Report',
        generatedAt: now,
        summary: `Average readiness: ${average(rows.map((r) => r.readinessScore))}`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          Readiness: r.readinessScore,
          Status: r.readinessScore >= 80 ? 'Ready' : r.readinessScore >= 70 ? 'Review' : 'At Risk',
        })),
      }
    case 'grade':
      return {
        type,
        title: 'Grade Report',
        generatedAt: now,
        summary: `Average grade: ${average(rows.map((r) => r.overallGrade))}%`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          Grade: `${r.overallGrade}%`,
          Letter: getLetterGrade(r.overallGrade),
        })),
      }
    case 'hours':
      return {
        type,
        title: 'Hours Completion Report',
        generatedAt: now,
        summary: `Total completed hours: ${rows.reduce((sum, r) => sum + r.completedHours, 0)}`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          Completed: r.completedHours,
          Required: r.requiredHours,
          Remaining: Math.max(0, r.requiredHours - r.completedHours),
        })),
      }
    case 'assessment':
      return {
        type,
        title: 'Assessment Report',
        generatedAt: now,
        summary: `Average pass rate: ${average(rows.map((r) => r.assessmentPassRate))}%`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          'Pass Rate': `${r.assessmentPassRate}%`,
          Status: r.assessmentPassRate >= 80 ? 'Passing' : 'Needs Practice',
        })),
      }
    case 'school_summary':
    default: {
      const metrics = buildSchoolOverviewMetrics(inputs)
      return {
        type,
        title: 'School Summary Report',
        generatedAt: now,
        summary: `School health: ${buildSchoolHealthScore(inputs).score}/100`,
        rows: [
          { Metric: 'Total Students', Value: metrics.totalStudents },
          { Metric: 'Active Students', Value: metrics.activeStudents },
          { Metric: 'At-Risk Students', Value: metrics.atRiskStudents },
          { Metric: 'Average Attendance', Value: `${metrics.averageAttendance}%` },
          { Metric: 'Average Readiness', Value: metrics.averageReadiness },
          { Metric: 'Average Grade', Value: `${metrics.averageGrade}%` },
          { Metric: 'Completed Hours', Value: metrics.completedHours },
          { Metric: 'Assessment Completion', Value: `${metrics.assessmentCompletionRate}%` },
        ],
      }
    }
  }
}
