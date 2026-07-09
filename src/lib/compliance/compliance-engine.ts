/**
 * COMPLIANCE ENGINE
 * ASCYN PRO / ASCYN PRO V2
 *
 * High-level engine that aggregates compliance data for a student and produces
 * scores, eligibility, graduation readiness, and alerts.
 */

import { Profile, AttendanceRecord, HourLog, QuizAttempt, StudentProgress, Grade, GradeCategory, Assessment, ComplianceAlert } from '@/types'
import { calculateAttendanceSummary } from '@/lib/attendance'
import { calculateBoardReadiness } from '@/lib/readiness'
import { calculateOverallGrade } from '@/lib/gradebook'
import { localChapters } from '@/lib/local-data'
import { calculateComplianceScore, ComplianceScoreInputs } from './compliance-score'
import { determineBoardEligibility } from './board-eligibility'
import { calculateGraduationReadiness } from './graduation-readiness'
import { DEFAULT_COMPLIANCE_THRESHOLDS } from './compliance-rules'

export interface StudentComplianceInputs {
  student: Profile
  attendanceRecords: AttendanceRecord[]
  hourLogs: HourLog[]
  quizAttempts: QuizAttempt[]
  progress: StudentProgress[]
  grades: Grade[]
  gradeCategories: GradeCategory[]
  assessments: Assessment[]
}

export function buildStudentCompliance(inputs: StudentComplianceInputs) {
  const { student, attendanceRecords, hourLogs, quizAttempts, progress, grades, gradeCategories, assessments } = inputs

  const attSummary = calculateAttendanceSummary(
    student.id,
    attendanceRecords.filter((r) => r.userId === student.id)
  )

  const approvedMinutes = hourLogs
    .filter((h) => h.user_id === student.id && h.status === 'approved')
    .reduce((sum, h) => sum + h.minutes, 0)
  const completedHours = approvedMinutes / 60

  const attempts = quizAttempts.filter((a) => a.user_id === student.id)
  const prog = progress.filter((p) => p.user_id === student.id)
  const readiness = calculateBoardReadiness({
    userId: student.id,
    attempts,
    progress: prog,
    totalChapters: localChapters.length,
    streakDays: 0,
  })

  const sGrades = grades.filter((g) => g.studentId === student.id)
  const overallGrade = calculateOverallGrade(sGrades, gradeCategories)

  const sAssessments = assessments.filter((a) => a.studentId === student.id)
  const passedAssessments = sAssessments.filter((a) => a.isPassed).length
  const assessmentPassRate = sAssessments.length > 0 ? Math.round((passedAssessments / sAssessments.length) * 100) : 0

  // Demo scope: all assessments are practical skill evaluations
  const passedPracticals = passedAssessments
  const practicalPassRate = assessmentPassRate

  const complianceInputs: ComplianceScoreInputs = {
    attendancePercentage: attSummary.attendancePercentage,
    completedHours,
    assessmentPassRate,
    practicalPassRate,
    readinessScore: readiness.score,
    overallGrade,
    completedAssessments: passedAssessments,
    completedPracticals: passedPracticals,
  }

  const complianceScore = calculateComplianceScore(complianceInputs)
  const boardEligibility = determineBoardEligibility(complianceInputs)
  const graduationReadiness = calculateGraduationReadiness({
    studentId: student.id,
    fullName: student.full_name,
    completedHours,
    completedAssessments: passedAssessments,
    completedPracticals: passedPracticals,
    attendancePercentage: attSummary.attendancePercentage,
    readinessScore: readiness.score,
    overallGrade,
  })

  return {
    studentId: student.id,
    fullName: student.full_name,
    complianceScore,
    boardEligibility,
    graduationReadiness,
    attendanceSummary: attSummary,
    readiness,
    completedHours,
    assessmentPassRate,
    practicalPassRate,
    overallGrade,
  }
}

export function buildComplianceAlerts(inputs: StudentComplianceInputs): ComplianceAlert[] {
  const { student, attendanceRecords, hourLogs, quizAttempts, progress, grades, gradeCategories, assessments } = inputs
  const alerts: ComplianceAlert[] = []
  const thresholds = DEFAULT_COMPLIANCE_THRESHOLDS

  const attSummary = calculateAttendanceSummary(
    student.id,
    attendanceRecords.filter((r) => r.userId === student.id)
  )

  if (attSummary.isAtRisk) {
    alerts.push({
      id: `comp-att-${student.id}`,
      type: 'low_attendance',
      title: 'Low Attendance',
      description: `${student.full_name}: ${attSummary.riskReason}`,
      studentId: student.id,
      studentName: student.full_name,
      priority: 'high',
      createdAt: new Date().toISOString(),
    })
  }

  const approvedMinutes = hourLogs
    .filter((h) => h.user_id === student.id && h.status === 'approved')
    .reduce((sum, h) => sum + h.minutes, 0)
  const completedHours = approvedMinutes / 60

  if (completedHours < thresholds.requiredHours * 0.5) {
    alerts.push({
      id: `comp-hours-${student.id}`,
      type: 'missing_hours',
      title: 'Missing Hours',
      description: `${student.full_name}: ${Math.round(completedHours)} of ${thresholds.requiredHours} hours completed`,
      studentId: student.id,
      studentName: student.full_name,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    })
  }

  const sAssessments = assessments.filter((a) => a.studentId === student.id)
  const passedAssessments = sAssessments.filter((a) => a.isPassed).length
  const requiredAssessments = Math.max(thresholds.requiredAssessments, sAssessments.length)
  if (passedAssessments < requiredAssessments) {
    alerts.push({
      id: `comp-assess-${student.id}`,
      type: 'missing_assessments',
      title: 'Missing Assessments',
      description: `${student.full_name}: ${passedAssessments}/${requiredAssessments} assessments passed`,
      studentId: student.id,
      studentName: student.full_name,
      priority: 'high',
      createdAt: new Date().toISOString(),
    })
  }

  // Demo scope: all assessments are treated as practicals
  const passedPracticals = passedAssessments
  if (passedPracticals < thresholds.requiredPracticals) {
    alerts.push({
      id: `comp-prac-${student.id}`,
      type: 'missing_practicals',
      title: 'Missing Practicals',
      description: `${student.full_name}: ${passedPracticals}/${thresholds.requiredPracticals} practicals passed`,
      studentId: student.id,
      studentName: student.full_name,
      priority: 'high',
      createdAt: new Date().toISOString(),
    })
  }

  const attempts = quizAttempts.filter((a) => a.user_id === student.id)
  const prog = progress.filter((p) => p.user_id === student.id)
  const readiness = calculateBoardReadiness({
    userId: student.id,
    attempts,
    progress: prog,
    totalChapters: localChapters.length,
    streakDays: 0,
  })

  if (readiness.score < thresholds.minimumReadinessScore) {
    alerts.push({
      id: `comp-ready-${student.id}`,
      type: 'low_readiness',
      title: 'Low Board Readiness',
      description: `${student.full_name}: Readiness ${readiness.score}/${thresholds.minimumReadinessScore}`,
      studentId: student.id,
      studentName: student.full_name,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    })
  }

  const sGrades = grades.filter((g) => g.studentId === student.id)
  const overallGrade = calculateOverallGrade(sGrades, gradeCategories)
  if (overallGrade > 0 && overallGrade < thresholds.minimumOverallGrade) {
    alerts.push({
      id: `comp-grade-${student.id}`,
      type: 'low_grade',
      title: 'Low Grade',
      description: `${student.full_name}: Overall grade ${overallGrade}% (need ${thresholds.minimumOverallGrade}%)`,
      studentId: student.id,
      studentName: student.full_name,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    })
  }

  if (
    completedHours < thresholds.requiredHours ||
    passedAssessments < thresholds.requiredAssessments ||
    passedPracticals < thresholds.requiredPracticals
  ) {
    alerts.push({
      id: `comp-grad-${student.id}`,
      type: 'graduation_risk',
      title: 'Graduation Risk',
      description: `${student.full_name}: Missing graduation requirements`,
      studentId: student.id,
      studentName: student.full_name,
      priority: 'high',
      createdAt: new Date().toISOString(),
    })
  }

  const allRequirementsMet =
    completedHours >= thresholds.requiredHours &&
    attSummary.attendancePercentage >= thresholds.minimumAttendancePercentage &&
    passedAssessments >= thresholds.requiredAssessments &&
    passedPracticals >= thresholds.requiredPracticals &&
    readiness.score >= thresholds.minimumReadinessScore &&
    overallGrade >= thresholds.minimumOverallGrade

  if (allRequirementsMet) {
    alerts.push({
      id: `comp-eligible-${student.id}`,
      type: 'board_eligible',
      title: 'Board Eligible',
      description: `${student.full_name}: All state board requirements met`,
      studentId: student.id,
      studentName: student.full_name,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    })
  }

  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
