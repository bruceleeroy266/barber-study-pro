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
import { calculateCanonicalStudentLearningMetrics } from '@/lib/student-level/metrics'
import { calculateOverallGrade } from '@/lib/gradebook'
import { localChapters } from '@/lib/local-data'
import { DEFAULT_REQUIRED_HOURS } from '@/lib/programs/requirements'
import { DEFAULT_COMPLIANCE_THRESHOLDS } from '@/lib/compliance/compliance-rules'
import { calculateAdaptiveStudentHours } from '@/lib/hours/adaptive-student-hours'
import {
  ActiveStudentInstructorAssignment,
  buildInstructorAssignmentMap,
} from '@/lib/instructor/assignments'

/**
 * Resolve the applicable program's required hours for school analytics.
 * Callers pass the school's configured programs.required_hours (resolved via
 * src/lib/programs/requirements.ts); missing/invalid values fall back to the
 * programs table schema default so legacy/demo behavior is preserved.
 */
function resolveRequiredHours(requiredHours?: number | null): number {
  return typeof requiredHours === 'number' && Number.isFinite(requiredHours) && requiredHours > 0
    ? requiredHours
    : DEFAULT_REQUIRED_HOURS
}

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
  /** School-level fallback when a student-specific program requirement is unavailable. */
  requiredHours?: number | null
  /** Per-student program hour requirements keyed by profile id. */
  requiredHoursByStudentId?: Readonly<Record<string, number>>
  /** Per-student accepted prior/transfer credit keyed by profile id. */
  priorCreditMinutesByStudentId?: Readonly<Record<string, number>>
  /** Per-student total requirement override keyed by profile id. */
  requirementOverrideMinutesByStudentId?: Readonly<Record<string, number | null>>
  /** School-level fallback for required assessments when a student-specific program value is unavailable. */
  requiredAssessments?: number | null
  /** Per-student required assessment counts keyed by profile id. */
  requiredAssessmentsByStudentId?: Readonly<Record<string, number>>
  /** Canonical active student↔instructor relationships for instructor analytics. */
  instructorAssignments?: ReadonlyArray<ActiveStudentInstructorAssignment>
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

function clampPercentage(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, value))
}

function metricEligibleStudents(students: Profile[]): Profile[] {
  return students.filter((student) => student.include_in_school_metrics !== false)
}

function hasReadinessEvidence(attempts: QuizAttempt[], progress: StudentProgress[]): boolean {
  return attempts.length > 0 || progress.some((record) =>
    record.progress_percentage > 0 ||
    record.lesson_completed === true ||
    record.flashcards_completed === true ||
    record.knowledge_checks_completed === true ||
    record.quiz_completed === true
  )
}

function hasGradeEvidence(grades: Grade[]): boolean {
  return grades.some((grade) => !grade.isExcused)
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

function requiredHoursForStudent(inputs: SchoolAnalyticsInputs, studentId: string): number {
  const studentValue = inputs.requiredHoursByStudentId?.[studentId]
  return resolveRequiredHours(studentValue ?? inputs.requiredHours)
}

function adaptiveHoursForStudent(inputs: SchoolAnalyticsInputs, studentId: string) {
  return calculateAdaptiveStudentHours(
    studentHourLogs(studentId, inputs.hourLogs),
    {
      programRequiredHours: requiredHoursForStudent(inputs, studentId),
      priorCreditMinutes: inputs.priorCreditMinutesByStudentId?.[studentId] ?? 0,
      requirementOverrideMinutes: inputs.requirementOverrideMinutesByStudentId?.[studentId] ?? null,
    },
  )
}

function requiredAssessmentsForStudent(inputs: SchoolAnalyticsInputs, studentId: string): number {
  const studentValue = inputs.requiredAssessmentsByStudentId?.[studentId]
  const candidate = studentValue ?? inputs.requiredAssessments
  return typeof candidate === 'number' && Number.isFinite(candidate) && candidate > 0
    ? candidate
    : DEFAULT_COMPLIANCE_THRESHOLDS.requiredAssessments
}

export function buildSchoolOverviewMetrics(inputs: SchoolAnalyticsInputs): SchoolOverviewMetrics {
  const { students, attendanceRecords, quizAttempts, progress, grades, gradeCategories, assessments } =
    inputs
  const metricStudents = metricEligibleStudents(students)
  const totalStudents = metricStudents.length
  const activeStudents = metricStudents.filter((s) => s.role === 'student' || s.role === 'apprentice').length
  const graduatedStudents = 0 // No graduation workflow is persisted yet.

  let atRiskCount = 0
  let completedMinutesSum = 0
  let remainingMinutesSum = 0
  let assessmentCompletedCount = 0
  let assessmentRequiredCount = 0
  const attendancePercentages: number[] = []
  const readinessScores: number[] = []
  const gradePercentages: number[] = []

  for (const student of metricStudents) {
    const sAttendance = studentAttendanceRecords(student.id, attendanceRecords)
    const attSummary = calculateAttendanceSummary(student.id, sAttendance)
    if (sAttendance.length > 0) {
      attendancePercentages.push(clampPercentage(attSummary.attendancePercentage))
    }

    const attempts = studentAttempts(student.id, quizAttempts)
    const prog = studentProgress(student.id, progress)
    const readiness = calculateCanonicalStudentLearningMetrics({
      userId: student.id,
      attempts,
      progress: prog,
      totalChapters: localChapters.length,
    }).readiness
    const studentHasReadinessEvidence = hasReadinessEvidence(attempts, prog)
    if (studentHasReadinessEvidence) {
      readinessScores.push(clampPercentage(readiness.score))
    }

    const sGrades = studentGrades(student.id, grades)
    const overall = clampPercentage(calculateOverallGrade(sGrades, gradeCategories))
    const studentHasGradeEvidence = hasGradeEvidence(sGrades)
    if (studentHasGradeEvidence) {
      gradePercentages.push(overall)
    }

    const hourSummary = adaptiveHoursForStudent(inputs, student.id)
    completedMinutesSum += hourSummary.creditedAndEarnedMinutes
    remainingMinutesSum += hourSummary.remainingMinutes

    const sAssessments = studentAssessments(student.id, assessments)
    assessmentCompletedCount += Math.min(sAssessments.length, requiredAssessmentsForStudent(inputs, student.id))
    assessmentRequiredCount += requiredAssessmentsForStudent(inputs, student.id)

    const missing = studentHasGradeEvidence
      ? gradeCategories.filter(
          (category) => sGrades.filter((grade) => grade.categoryId === category.id && !grade.isExcused).length === 0
        ).length
      : 0
    const failedAssessments = sAssessments.filter((assessment) => !assessment.isPassed)

    const hasRiskEvidence =
      (sAttendance.length > 0 && attSummary.isAtRisk) ||
      (studentHasReadinessEvidence && readiness.score < 70) ||
      (studentHasGradeEvidence && overall < 70) ||
      (studentHasGradeEvidence && missing >= 2) ||
      failedAssessments.length > 0

    if (hasRiskEvidence) atRiskCount += 1
  }

  return {
    totalStudents,
    activeStudents,
    graduatedStudents,
    atRiskStudents: atRiskCount,
    averageAttendance: clampPercentage(average(attendancePercentages)),
    averageReadiness: clampPercentage(average(readinessScores)),
    averageGrade: clampPercentage(average(gradePercentages)),
    hasGradeEvidence: gradePercentages.length > 0,
    completedHours: Math.round(completedMinutesSum / 60),
    remainingHours: Math.round(remainingMinutesSum / 60),
    assessmentCompletionRate:
      assessmentRequiredCount > 0
        ? clampPercentage(Math.round((assessmentCompletedCount / assessmentRequiredCount) * 100))
        : 0,
  }
}

export function buildStudentPerformanceRows(inputs: SchoolAnalyticsInputs): StudentPerformanceRow[] {
  const { students, attendanceRecords, quizAttempts, progress, grades, gradeCategories, assessments } =
    inputs
  return students.map((student) => {
    const attSummary = calculateAttendanceSummary(student.id, studentAttendanceRecords(student.id, attendanceRecords))
    const attempts = studentAttempts(student.id, quizAttempts)
    const prog = studentProgress(student.id, progress)
    const readiness = calculateCanonicalStudentLearningMetrics({
      userId: student.id,
      attempts,
      progress: prog,
      totalChapters: localChapters.length,
    }).readiness
    const sGrades = studentGrades(student.id, grades)
    const overall = calculateOverallGrade(sGrades, gradeCategories)
    const sAssessments = studentAssessments(student.id, assessments)
    const hourSummary = adaptiveHoursForStudent(inputs, student.id)
    const completedHours = hourSummary.creditedAndEarnedMinutes / 60

    const passed = sAssessments.filter((a) => a.isPassed).length
    const passRate = sAssessments.length > 0 ? Math.round((passed / sAssessments.length) * 100) : 0

    const missing = gradeCategories.filter(
      (c) => sGrades.filter((g) => g.categoryId === c.id && !g.isExcused).length === 0
    ).length

    const riskReasons: string[] = []
    const studentHasAttendanceEvidence = studentAttendanceRecords(student.id, attendanceRecords).length > 0
    const studentHasReadinessEvidence = hasReadinessEvidence(attempts, prog)
    const studentHasGradeEvidence = hasGradeEvidence(sGrades)
    if (studentHasAttendanceEvidence && attSummary.isAtRisk) {
      riskReasons.push(attSummary.riskReason || 'Attendance concern')
    }
    if (studentHasReadinessEvidence && readiness.score < 70) riskReasons.push(`Readiness ${readiness.score}`)
    if (studentHasGradeEvidence && overall < 70) riskReasons.push(`Grade ${overall}%`)
    if (studentHasGradeEvidence && missing >= 2) riskReasons.push(`${missing} missing assignments`)
    if (sAssessments.some((a) => !a.isPassed)) riskReasons.push('Failed assessment')

    return {
      studentId: student.id,
      fullName: student.full_name,
      attendancePercentage: attSummary.attendancePercentage,
      readinessScore: readiness.score,
      hasReadinessEvidence: studentHasReadinessEvidence,
      overallGrade: overall,
      hasGradeEvidence: studentHasGradeEvidence,
      hasAssessmentEvidence: sAssessments.length > 0,
      completedHours: Math.round(completedHours),
      requiredHours: hourSummary.effectiveRequiredHours,
      assessmentPassRate: passRate,
      isAtRisk: riskReasons.length > 0,
      riskReasons,
    }
  })
}

export function buildInstructorPerformanceRows(inputs: SchoolAnalyticsInputs): InstructorPerformanceRow[] {
  const { instructors, students, attendanceRecords, quizAttempts, progress, grades, gradeCategories, assessments } = inputs
  const metricStudents = metricEligibleStudents(students)
  const assignmentMap = buildInstructorAssignmentMap(inputs.instructorAssignments ?? [])

  return instructors.map((instructor) => {
    const assignedIds = assignmentMap.get(instructor.id) ?? new Set<string>()
    const assignedStudents = metricStudents.filter(
      (student) =>
        (student.role === 'student' || student.role === 'apprentice') &&
        assignedIds.has(student.id)
    )

    const attendances = assignedStudents
      .map((student) => {
        const records = studentAttendanceRecords(student.id, attendanceRecords)
        return records.length > 0
          ? calculateAttendanceSummary(student.id, records).attendancePercentage
          : null
      })
      .filter((value): value is number => value !== null)

    const readinesses = assignedStudents
      .map((student) => {
        const attempts = studentAttempts(student.id, quizAttempts)
        const prog = studentProgress(student.id, progress)
        if (!hasReadinessEvidence(attempts, prog)) return null
        return calculateCanonicalStudentLearningMetrics({
          userId: student.id,
          attempts,
          progress: prog,
          totalChapters: localChapters.length,
        }).readiness.score
      })
      .filter((value): value is number => value !== null)

    const gradesList = assignedStudents
      .map((student) => {
        const studentGradeRows = studentGrades(student.id, grades)
        return hasGradeEvidence(studentGradeRows)
          ? calculateOverallGrade(studentGradeRows, gradeCategories)
          : null
      })
      .filter((value): value is number => value !== null)

    // Instructor performance should reflect work performed for students they own,
    // never assessments of unrelated students in the same school.
    const assignedStudentIdSet = new Set(assignedStudents.map((student) => student.id))
    const instructorAssessments = assessments.filter(
      (assessment) =>
        assessment.evaluatorId === instructor.id &&
        assignedStudentIdSet.has(assessment.studentId)
    )

    // Messaging counts are not yet part of the canonical school analytics input.
    // Keep this truthful rather than carrying the old demo-only synthetic count.
    const messagesSent = 0

    const avgReadiness = average(readinesses)
    const avgAttendance = average(attendances)
    let successIndicator: 'high' | 'medium' | 'low' = 'low'
    if (assignedStudents.length > 0 && avgReadiness >= 80 && avgAttendance >= 80) successIndicator = 'high'
    else if (assignedStudents.length > 0 && avgReadiness >= 70 && avgAttendance >= 70) successIndicator = 'medium'

    return {
      instructorId: instructor.id,
      fullName: instructor.full_name,
      studentsAssigned: assignedStudents.length,
      averageAttendance: clampPercentage(avgAttendance),
      averageReadiness: clampPercentage(avgReadiness),
      averageGrade: clampPercentage(average(gradesList)),
      assessmentsCompleted: instructorAssessments.length,
      messagesSent,
      successIndicator,
    }
  })
}

export function buildSchoolHealthScore(inputs: SchoolAnalyticsInputs): SchoolHealthScore {
  const metrics = buildSchoolOverviewMetrics(inputs)
  const attendanceScore = clampPercentage(metrics.averageAttendance)
  const readinessScore = clampPercentage(metrics.averageReadiness)
  const gradeScore = clampPercentage(metrics.averageGrade)
  const assessmentScore = clampPercentage(metrics.assessmentCompletionRate)
  const totalRequiredHours = metricEligibleStudents(inputs.students).reduce(
    (sum, student) => sum + adaptiveHoursForStudent(inputs, student.id).effectiveRequiredHours,
    0,
  )
  const hoursScore =
    totalRequiredHours > 0
      ? clampPercentage(Math.round((metrics.completedHours / totalRequiredHours) * 100))
      : 0

  const score = Math.round(
    attendanceScore * 0.25 +
      readinessScore * 0.25 +
      gradeScore * 0.2 +
      assessmentScore * 0.15 +
      hoursScore * 0.15
  )

  const healthStudents = metricEligibleStudents(inputs.students)
  const healthStudentIds = new Set(healthStudents.map((student) => student.id))
  const hasAttendanceEvidence = inputs.attendanceRecords.some((record) =>
    healthStudentIds.has(record.userId)
  )
  const hasReadinessEvidenceForSchool = healthStudents.some((student) =>
    hasReadinessEvidence(
      studentAttempts(student.id, inputs.quizAttempts),
      studentProgress(student.id, inputs.progress)
    )
  )
  const hasGradeEvidenceForSchool = inputs.grades.some(
    (grade) => healthStudentIds.has(grade.studentId) && !grade.isExcused
  )
  const hasAssessmentEvidence = inputs.assessments.some((assessment) =>
    healthStudentIds.has(assessment.studentId)
  )
  const hasHoursEvidence =
    inputs.hourLogs.some((hourLog) => healthStudentIds.has(hourLog.user_id)) ||
    healthStudents.some(
      (student) => (inputs.priorCreditMinutesByStudentId?.[student.id] ?? 0) > 0
    )
  const hasEvidence =
    hasAttendanceEvidence ||
    hasReadinessEvidenceForSchool ||
    hasGradeEvidenceForSchool ||
    hasAssessmentEvidence ||
    hasHoursEvidence

  let label = hasEvidence ? 'Critical' : 'Not enough data yet'
  let colorClass = 'text-silver'
  if (!hasEvidence) {
    colorClass = 'text-silver-gray'
  } else if (score >= 90) {
    label = 'Excellent'
    colorClass = 'text-gold'
  } else if (score >= 80) {
    label = 'Good'
    colorClass = 'text-silver'
  } else if (score >= 70) {
    label = 'Fair'
    colorClass = 'text-warm-bronze'
  } else if (score >= 60) {
    label = 'At Risk'
    colorClass = 'text-warm-bronze'
  }

  return {
    score,
    label,
    colorClass,
    hasEvidence,
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
    const readiness = calculateCanonicalStudentLearningMetrics({
      userId: student.id,
      attempts,
      progress: prog,
      totalChapters: localChapters.length,
    }).readiness
    if (hasReadinessEvidence(attempts, prog) && readiness.score < 70) {
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

    const hourSummary = adaptiveHoursForStudent(inputs, student.id)
    const completedHours = hourSummary.creditedAndEarnedMinutes / 60
    const requiredHours = hourSummary.effectiveRequiredHours
    if (completedHours < requiredHours * 0.5) {
      alerts.push({
        id: `hours-${student.id}`,
        type: 'missing_hours',
        title: 'Missing Hours',
        description: `${student.full_name}: ${Math.round(completedHours)} of ${requiredHours} hours completed`,
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
  const metricStudentIds = new Set(metricEligibleStudents(inputs.students).map((student) => student.id))
  const rows = buildStudentPerformanceRows(inputs).filter((row) => metricStudentIds.has(row.studentId))
  const readinessEvidence = new Set(
    metricEligibleStudents(inputs.students)
      .filter((student) =>
        hasReadinessEvidence(
          studentAttempts(student.id, inputs.quizAttempts),
          studentProgress(student.id, inputs.progress)
        )
      )
      .map((student) => student.id)
  )
  const gradeEvidence = new Set(
    metricEligibleStudents(inputs.students)
      .filter((student) => hasGradeEvidence(studentGrades(student.id, inputs.grades)))
      .map((student) => student.id)
  )
  const assessmentEvidence = new Set(
    inputs.assessments
      .filter((assessment) => metricStudentIds.has(assessment.studentId))
      .map((assessment) => assessment.studentId)
  )

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
    value: Math.round(
      average(rows.filter((r) => readinessEvidence.has(r.studentId)).map((r) => r.readinessScore))
    ),
  }))

  const assessmentCompletionTrend = last14.map((p) => ({
    ...p,
    value: average(
      rows.filter((r) => assessmentEvidence.has(r.studentId)).map((r) => r.assessmentPassRate)
    ),
  }))

  const hoursCompletionTrend = last14.map((p) => ({
    ...p,
    value: clampPercentage(
      Math.round(
        average(
          rows.map((r) => (r.requiredHours > 0 ? (r.completedHours / r.requiredHours) * 100 : 0))
        )
      )
    ),
  }))

  const gradeDistribution = [
    { label: '90-100%', count: rows.filter((r) => r.overallGrade >= 90).length, colorClass: 'bg-gold' },
    { label: '80-89%', count: rows.filter((r) => r.overallGrade >= 80 && r.overallGrade < 90).length, colorClass: 'bg-silver' },
    { label: '70-79%', count: rows.filter((r) => r.overallGrade >= 70 && r.overallGrade < 80).length, colorClass: 'bg-warm-bronze' },
    { label: '60-69%', count: rows.filter((r) => r.overallGrade >= 60 && r.overallGrade < 70).length, colorClass: 'bg-warm-bronze' },
    { label: 'Below 60%', count: rows.filter((r) => gradeEvidence.has(r.studentId) && r.overallGrade < 60).length, colorClass: 'bg-silver' },
    { label: 'No Grade', count: rows.filter((r) => !gradeEvidence.has(r.studentId)).length, colorClass: 'bg-silver-gray' },
  ]

  const riskDistribution = [
    { label: 'At Risk', count: rows.filter((r) => r.isAtRisk).length, colorClass: 'bg-silver' },
    { label: 'On Track', count: rows.filter((r) => !r.isAtRisk).length, colorClass: 'bg-gold' },
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
  const metricStudentIds = new Set(metricEligibleStudents(inputs.students).map((student) => student.id))
  const metricRows = rows.filter((row) => metricStudentIds.has(row.studentId))
  const metrics = buildSchoolOverviewMetrics(inputs)
  const now = new Date().toISOString()
  const attendanceEvidence = new Set(
    inputs.attendanceRecords
      .filter((record) => metricStudentIds.has(record.userId))
      .map((record) => record.userId)
  )
  const readinessEvidence = new Set(
    metricEligibleStudents(inputs.students)
      .filter((student) =>
        hasReadinessEvidence(
          studentAttempts(student.id, inputs.quizAttempts),
          studentProgress(student.id, inputs.progress)
        )
      )
      .map((student) => student.id)
  )
  const gradeEvidence = new Set(
    metricEligibleStudents(inputs.students)
      .filter((student) => hasGradeEvidence(studentGrades(student.id, inputs.grades)))
      .map((student) => student.id)
  )
  const assessmentEvidence = new Set(
    inputs.assessments
      .filter((assessment) => metricStudentIds.has(assessment.studentId))
      .map((assessment) => assessment.studentId)
  )

  switch (type) {
    case 'attendance':
      return {
        type,
        title: 'Attendance Report',
        generatedAt: now,
        summary: attendanceEvidence.size > 0 ? `Average attendance: ${metrics.averageAttendance}%` : 'Average attendance: No Data',
        rows: rows.map((r) => ({
          Student: r.fullName,
          Attendance: attendanceEvidence.has(r.studentId) ? `${r.attendancePercentage}%` : 'No Data',
          Status: !attendanceEvidence.has(r.studentId)
            ? 'No Data'
            : r.attendancePercentage >= 80
              ? 'Good'
              : r.attendancePercentage >= 70
                ? 'Warning'
                : 'At Risk',
        })),
      }
    case 'readiness':
      return {
        type,
        title: 'Board Readiness Report',
        generatedAt: now,
        summary: readinessEvidence.size > 0 ? `Average readiness: ${metrics.averageReadiness}` : 'Average readiness: No Data',
        rows: rows.map((r) => ({
          Student: r.fullName,
          Readiness: readinessEvidence.has(r.studentId) ? r.readinessScore : 'No Data',
          Status: !readinessEvidence.has(r.studentId)
            ? 'No Data'
            : r.readinessScore >= 80
              ? 'Ready'
              : r.readinessScore >= 70
                ? 'Review'
                : 'At Risk',
        })),
      }
    case 'grade':
      return {
        type,
        title: 'Grade Report',
        generatedAt: now,
        summary: gradeEvidence.size > 0 ? `Average grade: ${metrics.averageGrade}%` : 'Average grade: No Grade',
        rows: rows.map((r) => ({
          Student: r.fullName,
          Grade: gradeEvidence.has(r.studentId) ? `${r.overallGrade}%` : 'No Grade',
        })),
      }
    case 'hours': {
      const hourRows = rows.map((r) => {
        const summary = adaptiveHoursForStudent(inputs, r.studentId)
        return {
          Student: r.fullName,
          Completed: Math.round(summary.creditedAndEarnedMinutes / 60),
          'Earned Here': Math.round(summary.earnedApprovedMinutes / 60),
          'Prior Credit': Math.round(summary.priorCreditMinutes / 60),
          Required: Math.round(summary.effectiveRequiredHours),
          Remaining: Math.round(summary.remainingMinutes / 60),
        }
      })
      return {
        type,
        title: 'Hours Completion Report',
        generatedAt: now,
        summary: `Total completed hours: ${Math.round(
          metricRows.reduce((sum, r) => {
            const summary = adaptiveHoursForStudent(inputs, r.studentId)
            return sum + summary.creditedAndEarnedMinutes
          }, 0) / 60
        )}`,
        rows: hourRows,
      }
    }
    case 'assessment':
      return {
        type,
        title: 'Assessment Report',
        generatedAt: now,
        summary: assessmentEvidence.size > 0
          ? `Average pass rate: ${clampPercentage(
              average(metricRows.filter((r) => assessmentEvidence.has(r.studentId)).map((r) => r.assessmentPassRate))
            )}%`
          : 'Average pass rate: No Assessments',
        rows: rows.map((r) => ({
          Student: r.fullName,
          'Pass Rate': assessmentEvidence.has(r.studentId) ? `${r.assessmentPassRate}%` : 'No Assessments',
          Status: !assessmentEvidence.has(r.studentId)
            ? 'No Assessments'
            : r.assessmentPassRate >= 80
              ? 'Passing'
              : 'Needs Practice',
        })),
      }
    case 'school_summary':
    default: {
      return {
        type,
        title: 'School Summary Report',
        generatedAt: now,
        summary: (() => {
          const health = buildSchoolHealthScore(inputs)
          return health.hasEvidence
            ? `School health: ${health.score}/100`
            : 'School health: Not enough data yet'
        })(),
        rows: [
          { Metric: 'Total Students', Value: metrics.totalStudents },
          { Metric: 'Active Students', Value: metrics.activeStudents },
          { Metric: 'At-Risk Students', Value: metrics.atRiskStudents },
          { Metric: 'Average Attendance', Value: attendanceEvidence.size > 0 ? `${metrics.averageAttendance}%` : 'No Data' },
          { Metric: 'Average Readiness', Value: readinessEvidence.size > 0 ? metrics.averageReadiness : 'No Data' },
          { Metric: 'Average Grade', Value: gradeEvidence.size > 0 ? `${metrics.averageGrade}%` : 'No Grade' },
          { Metric: 'Completed Hours', Value: metrics.completedHours },
          { Metric: 'Assessment Completion', Value: `${metrics.assessmentCompletionRate}%` },
        ],
      }
    }
  }
}
