/**
 * COMPLIANCE ENGINE
 * ASCYN PRO / ASCYN PRO V2
 *
 * High-level engine that aggregates compliance data for a student and produces
 * scores, eligibility, graduation readiness, and alerts.
 */

import { Profile, AttendanceRecord, HourLog, QuizAttempt, StudentProgress, Grade, GradeCategory, Assessment, ComplianceAlert } from '@/types'
import { calculateAttendanceSummary } from '@/lib/attendance'
import { calculateCanonicalStudentLearningMetrics } from '@/lib/student-level/metrics'
import { calculateStudentGradePerformance } from '@/lib/gradebook'
import { localChapters } from '@/lib/local-data'
import { calculateComplianceScore, ComplianceScoreInputs } from './compliance-score'
import { determineBoardEligibility } from './board-eligibility'
import { calculateGraduationReadiness } from './graduation-readiness'
import { ComplianceRuleThresholds, DEFAULT_COMPLIANCE_THRESHOLDS } from './compliance-rules'
import { calculateAdaptiveStudentHours } from '@/lib/hours/adaptive-student-hours'

export interface StudentComplianceInputs {
  student: Profile
  attendanceRecords: AttendanceRecord[]
  hourLogs: HourLog[]
  quizAttempts: QuizAttempt[]
  progress: StudentProgress[]
  grades: Grade[]
  gradeCategories: GradeCategory[]
  assessments: Assessment[]
  /**
   * Optional per-student thresholds (e.g. built from the student's program via
   * thresholdsWithRequiredHours(programs.required_hours)). Defaults to
   * DEFAULT_COMPLIANCE_THRESHOLDS, preserving prior behavior.
   */
  thresholds?: ComplianceRuleThresholds
  /** Accepted prior/transfer credit for the student's active enrollment. */
  priorCreditMinutes?: number | null
  /** Optional student-specific total requirement for the active enrollment. */
  requirementOverrideMinutes?: number | null
}

export function buildStudentCompliance(inputs: StudentComplianceInputs) {
  const { student, attendanceRecords, hourLogs, quizAttempts, progress, grades, gradeCategories, assessments } = inputs
  const baseThresholds = inputs.thresholds ?? DEFAULT_COMPLIANCE_THRESHOLDS

  const attSummary = calculateAttendanceSummary(
    student.id,
    attendanceRecords.filter((r) => r.userId === student.id)
  )

  const adaptiveHours = calculateAdaptiveStudentHours(
    hourLogs.filter((h) => h.user_id === student.id),
    {
      programRequiredHours: baseThresholds.requiredHours,
      priorCreditMinutes: inputs.priorCreditMinutes ?? 0,
      requirementOverrideMinutes: inputs.requirementOverrideMinutes ?? null,
    },
  )
  const completedHours = adaptiveHours.creditedAndEarnedMinutes / 60
  const thresholds: ComplianceRuleThresholds = {
    ...baseThresholds,
    requiredHours: adaptiveHours.effectiveRequiredHours,
  }

  const attempts = quizAttempts.filter((a) => a.user_id === student.id)
  const prog = progress.filter((p) => p.user_id === student.id)
  const learningMetrics = calculateCanonicalStudentLearningMetrics({
    userId: student.id,
    attempts,
    progress: prog,
    totalChapters: localChapters.length,
  })
  const readiness = learningMetrics.readiness

  const sGrades = grades.filter((g) => g.studentId === student.id)
  const gradePerformance = calculateStudentGradePerformance(
    student.id,
    sGrades,
    gradeCategories,
    assessments.filter((a) => a.studentId === student.id),
    0,
  )
  const overallGrade = gradePerformance.overallGrade

  const sAssessments = assessments.filter((a) => a.studentId === student.id)
  const passedAssessments = sAssessments.filter((a) => a.isPassed).length
  const completedAssessments = sAssessments.length
  const assessmentPassRate = completedAssessments > 0
    ? Math.round((passedAssessments / completedAssessments) * 100)
    : 0

  // The current assessment model stores instructor-evaluated practical skill
  // assessments. Until a distinct practical-event table exists, the same
  // records are the auditable practical evidence source.
  const completedPracticals = sAssessments.length
  const passedPracticals = passedAssessments
  const practicalPassRate = completedPracticals > 0
    ? Math.round((passedPracticals / completedPracticals) * 100)
    : 0

  const complianceInputs: ComplianceScoreInputs = {
    attendancePercentage: attSummary.attendancePercentage,
    completedHours,
    assessmentPassRate,
    practicalPassRate,
    readinessScore: readiness.score,
    overallGrade,
    completedAssessments,
    completedPracticals,
  }

  const complianceScore = calculateComplianceScore(complianceInputs, thresholds)
  const boardEligibility = determineBoardEligibility(complianceInputs, thresholds)
  const graduationReadiness = calculateGraduationReadiness({
    studentId: student.id,
    fullName: student.full_name,
    completedHours,
    completedAssessments,
    completedPracticals,
    attendancePercentage: attSummary.attendancePercentage,
    readinessScore: readiness.score,
    overallGrade,
  }, thresholds)

  const studentHourLogs = hourLogs.filter((h) => h.user_id === student.id)
  const hasAttendanceEvidence = attSummary.totalDays > 0
  const hasHoursEvidence = studentHourLogs.length > 0 || adaptiveHours.priorCreditMinutes > 0
  const hasReadinessEvidence = learningMetrics.hasReadinessEvidence
  const hasGradeEvidence = gradePerformance.hasGradeEvidence
  const hasAssessmentEvidence = completedAssessments > 0
  const hasTrackingEvidence =
    hasAttendanceEvidence ||
    hasHoursEvidence ||
    hasReadinessEvidence ||
    hasGradeEvidence ||
    hasAssessmentEvidence

  return {
    studentId: student.id,
    fullName: student.full_name,
    complianceScore,
    boardEligibility,
    graduationReadiness,
    attendanceSummary: attSummary,
    readiness,
    completedHours,
    earnedHours: adaptiveHours.earnedApprovedMinutes / 60,
    priorCreditHours: adaptiveHours.priorCreditMinutes / 60,
    assessmentPassRate,
    practicalPassRate,
    overallGrade,
    hasAttendanceEvidence,
    hasHoursEvidence,
    hasReadinessEvidence,
    hasGradeEvidence,
    hasAssessmentEvidence,
    hasTrackingEvidence,
  }
}

export function buildComplianceAlerts(inputs: StudentComplianceInputs): ComplianceAlert[] {
  const { student, attendanceRecords, hourLogs, quizAttempts, progress, grades, gradeCategories, assessments } = inputs
  const alerts: ComplianceAlert[] = []
  const baseThresholds = inputs.thresholds ?? DEFAULT_COMPLIANCE_THRESHOLDS

  const attSummary = calculateAttendanceSummary(
    student.id,
    attendanceRecords.filter((r) => r.userId === student.id)
  )

  const hasAttendanceEvidence = attSummary.totalDays > 0
  if (hasAttendanceEvidence && attSummary.isAtRisk) {
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

  const adaptiveHours = calculateAdaptiveStudentHours(
    hourLogs.filter((h) => h.user_id === student.id),
    {
      programRequiredHours: baseThresholds.requiredHours,
      priorCreditMinutes: inputs.priorCreditMinutes ?? 0,
      requirementOverrideMinutes: inputs.requirementOverrideMinutes ?? null,
    },
  )
  const completedHours = adaptiveHours.creditedAndEarnedMinutes / 60
  const thresholds: ComplianceRuleThresholds = {
    ...baseThresholds,
    requiredHours: adaptiveHours.effectiveRequiredHours,
  }

  const studentHourLogs = hourLogs.filter((h) => h.user_id === student.id)
  const hasHoursEvidence = studentHourLogs.length > 0 || adaptiveHours.priorCreditMinutes > 0
  if (hasHoursEvidence && completedHours < thresholds.requiredHours * 0.5) {
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
  const completedAssessments = sAssessments.length
  const requiredAssessments = thresholds.requiredAssessments
  const hasAssessmentEvidence = completedAssessments > 0
  if (hasAssessmentEvidence && requiredAssessments > 0 && completedAssessments < requiredAssessments) {
    alerts.push({
      id: `comp-assess-${student.id}`,
      type: 'missing_assessments',
      title: 'Missing Assessments',
      description: `${student.full_name}: ${completedAssessments}/${requiredAssessments} assessments completed`,
      studentId: student.id,
      studentName: student.full_name,
      priority: 'high',
      createdAt: new Date().toISOString(),
    })
  }

  const completedPracticals = sAssessments.length
  if (hasAssessmentEvidence && thresholds.requiredPracticals > 0 && completedPracticals < thresholds.requiredPracticals) {
    alerts.push({
      id: `comp-prac-${student.id}`,
      type: 'missing_practicals',
      title: 'Missing Practicals',
      description: `${student.full_name}: ${completedPracticals}/${thresholds.requiredPracticals} practicals completed`,
      studentId: student.id,
      studentName: student.full_name,
      priority: 'high',
      createdAt: new Date().toISOString(),
    })
  }

  const attempts = quizAttempts.filter((a) => a.user_id === student.id)
  const prog = progress.filter((p) => p.user_id === student.id)
  const learningMetrics = calculateCanonicalStudentLearningMetrics({
    userId: student.id,
    attempts,
    progress: prog,
    totalChapters: localChapters.length,
  })
  const readiness = learningMetrics.readiness

  if (learningMetrics.hasReadinessEvidence && readiness.score < thresholds.minimumReadinessScore) {
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
  const gradePerformance = calculateStudentGradePerformance(
    student.id,
    sGrades,
    gradeCategories,
    sAssessments,
    0,
  )
  const overallGrade = gradePerformance.overallGrade
  if (gradePerformance.hasGradeEvidence && overallGrade < thresholds.minimumOverallGrade) {
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

  const hasGraduationEvidence = hasHoursEvidence || hasAssessmentEvidence
  if (
    hasGraduationEvidence &&
    (
      (hasHoursEvidence && completedHours < thresholds.requiredHours) ||
      (hasAssessmentEvidence && thresholds.requiredAssessments > 0 && completedAssessments < thresholds.requiredAssessments) ||
      (hasAssessmentEvidence && thresholds.requiredPracticals > 0 && completedPracticals < thresholds.requiredPracticals)
    )
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
    (thresholds.requiredAssessments <= 0 || completedAssessments >= thresholds.requiredAssessments) &&
    (thresholds.requiredPracticals <= 0 || completedPracticals >= thresholds.requiredPracticals) &&
    learningMetrics.hasReadinessEvidence &&
    readiness.score >= thresholds.minimumReadinessScore &&
    gradePerformance.hasGradeEvidence &&
    overallGrade >= thresholds.minimumOverallGrade

  if (allRequirementsMet) {
    alerts.push({
      id: `comp-eligible-${student.id}`,
      type: 'board_eligible',
      title: 'Tracked Requirements Met',
      description: `${student.full_name}: All ASCYN PRO tracked program requirements met`,
      studentId: student.id,
      studentName: student.full_name,
      priority: 'medium',
      createdAt: new Date().toISOString(),
    })
  }

  return alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
