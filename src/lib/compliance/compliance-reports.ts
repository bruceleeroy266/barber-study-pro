/**
 * COMPLIANCE REPORTS
 * ASCYN PRO / ASCYN PRO V2
 *
 * Generates CSV-ready internal program-requirement reports for audit preparation.
 */

import { ComplianceReport, ComplianceReportType, Profile } from '@/types'
import { buildStudentCompliance, StudentComplianceInputs } from './compliance-engine'
import { ComplianceRuleThresholds } from './compliance-rules'

export interface ComplianceReportInputs {
  students: Profile[]
  attendanceRecords: StudentComplianceInputs['attendanceRecords']
  hourLogs: StudentComplianceInputs['hourLogs']
  quizAttempts: StudentComplianceInputs['quizAttempts']
  progress: StudentComplianceInputs['progress']
  grades: StudentComplianceInputs['grades']
  gradeCategories: StudentComplianceInputs['gradeCategories']
  assessments: StudentComplianceInputs['assessments']
  priorCreditMinutesByStudentId?: Readonly<Record<string, number>>
  requirementOverrideMinutesByStudentId?: Readonly<Record<string, number | null>>
}

function buildStudentInputs(
  student: Profile,
  inputs: ComplianceReportInputs,
  thresholdsByStudentId?: ReadonlyMap<string, ComplianceRuleThresholds>
): StudentComplianceInputs {
  return {
    student,
    attendanceRecords: inputs.attendanceRecords,
    hourLogs: inputs.hourLogs,
    quizAttempts: inputs.quizAttempts,
    progress: inputs.progress,
    grades: inputs.grades,
    gradeCategories: inputs.gradeCategories,
    assessments: inputs.assessments,
    thresholds: thresholdsByStudentId?.get(student.id),
    priorCreditMinutes: inputs.priorCreditMinutesByStudentId?.[student.id] ?? 0,
    requirementOverrideMinutes: inputs.requirementOverrideMinutesByStudentId?.[student.id] ?? null,
  }
}

export function generateComplianceReport(
  type: ComplianceReportType,
  inputs: ComplianceReportInputs,
  thresholdsByStudentId?: ReadonlyMap<string, ComplianceRuleThresholds>
): ComplianceReport {
  const now = new Date().toISOString()
  const rows = inputs.students.map((student) => buildStudentCompliance(buildStudentInputs(student, inputs, thresholdsByStudentId)))

  switch (type) {
    case 'student_compliance':
      return {
        type,
        title: 'Student Requirement Tracking Report',
        generatedAt: now,
        summary: `ASCYN PRO requirement tracking overview for ${inputs.students.length} students`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          'Tracking Score': r.hasTrackingEvidence ? r.complianceScore.score : 'Not enough data yet',
          Attendance: r.hasAttendanceEvidence ? `${r.attendanceSummary.attendancePercentage}%` : 'No Attendance Data',
          Hours: r.hasHoursEvidence ? `${Math.round(r.completedHours)}/${r.graduationReadiness.requiredHours}` : 'No Hours Data',
          'Earned Here': Math.round(r.earnedHours),
          'Prior Credit': Math.round(r.priorCreditHours),
          'Assessment Pass Rate': r.graduationReadiness.requiredAssessments <= 0
            ? 'Not Required'
            : r.hasAssessmentEvidence ? `${r.assessmentPassRate}%` : 'No Assessments',
          'Practical Pass Rate': r.graduationReadiness.requiredPracticals <= 0
            ? 'Not Required'
            : r.hasAssessmentEvidence ? `${r.practicalPassRate}%` : 'No Practicals',
          Readiness: r.hasReadinessEvidence ? r.readiness.score : 'No Data',
          Grade: r.hasGradeEvidence ? `${r.overallGrade}%` : 'No Grade',
          Status: r.hasTrackingEvidence ? r.complianceScore.label : 'Not enough data yet',
        })),
      }
    case 'graduation_readiness': {
      const evidenceRows = rows.filter((r) => r.hasTrackingEvidence)
      const readyCount = evidenceRows.filter((r) => r.graduationReadiness.isReady).length
      return {
        type,
        title: 'Program Completion Readiness Report',
        generatedAt: now,
        summary: evidenceRows.length === 0
          ? 'Program completion readiness: Not enough data yet'
          : `${readyCount} of ${evidenceRows.length} students with tracked evidence meet all ASCYN PRO tracked program thresholds`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          'Readiness %': r.hasTrackingEvidence ? r.graduationReadiness.percentage : 'Not enough data yet',
          'Hours Complete': r.hasHoursEvidence
            ? `${r.graduationReadiness.completedHours}/${r.graduationReadiness.requiredHours}`
            : 'No Hours Data',
          'Earned Here': r.hasHoursEvidence ? Math.round(r.earnedHours) : 'No Hours Data',
          'Prior Credit': r.hasHoursEvidence ? Math.round(r.priorCreditHours) : 'No Hours Data',
          'Assessments Complete': r.graduationReadiness.requiredAssessments <= 0
            ? 'Not Required'
            : r.hasAssessmentEvidence
              ? `${r.graduationReadiness.completedAssessments}/${r.graduationReadiness.requiredAssessments}`
              : 'No Assessments',
          'Practicals Complete': r.graduationReadiness.requiredPracticals <= 0
            ? 'Not Required'
            : r.hasAssessmentEvidence
              ? `${r.graduationReadiness.completedPracticals}/${r.graduationReadiness.requiredPracticals}`
              : 'No Practicals',
          Ready: r.hasTrackingEvidence ? (r.graduationReadiness.isReady ? 'Yes' : 'No') : 'Not enough data yet',
          'Remaining Items': r.hasTrackingEvidence
            ? (r.graduationReadiness.remainingItems.join('; ') || 'None')
            : 'Not enough data yet',
        })),
      }
    }
    case 'board_eligibility': {
      const evidenceRows = rows.filter((r) => r.hasTrackingEvidence)
      const metCount = evidenceRows.filter((r) => r.boardEligibility.status === 'eligible').length
      const nearCount = evidenceRows.filter((r) => r.boardEligibility.status === 'near_eligible').length
      return {
        type,
        title: 'Tracked Requirements Check',
        generatedAt: now,
        summary: evidenceRows.length === 0
          ? 'Tracked requirements: Not enough data yet'
          : `${metCount} meet all tracked requirements, ${nearCount} nearly complete among students with tracked evidence`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          Status: r.hasTrackingEvidence ? r.boardEligibility.label : 'Not enough data yet',
          'Missing Requirements': r.hasTrackingEvidence
            ? (r.boardEligibility.missingRequirements.join('; ') || 'None')
            : 'Not enough data yet',
        })),
      }
    }
    case 'instructor_compliance': {
      const evidenceRows = rows.filter((r) => r.hasTrackingEvidence)
      return {
        type,
        title: 'Instructor Requirement Tracking Report',
        generatedAt: now,
        summary: evidenceRows.length === 0
          ? 'Requirement tracking summary: Not enough data yet'
          : `Requirement tracking summary across ${evidenceRows.length} students with tracked evidence`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          'Tracking Score': r.hasTrackingEvidence ? r.complianceScore.score : 'Not enough data yet',
          'Tracked Requirements Met': r.hasTrackingEvidence
            ? (r.boardEligibility.status === 'eligible' ? 'Yes' : 'No')
            : 'Not enough data yet',
          'At Risk': r.hasTrackingEvidence
            ? (r.complianceScore.score < 70 ? 'Yes' : 'No')
            : 'Not enough data yet',
        })),
      }
    }
    case 'school_compliance':
    default: {
      const evidenceRows = rows.filter((r) => r.hasTrackingEvidence)
      const avgScore = evidenceRows.length > 0
        ? Math.round(evidenceRows.reduce((sum, r) => sum + r.complianceScore.score, 0) / evidenceRows.length)
        : null
      const eligibleCount = evidenceRows.filter((r) => r.boardEligibility.status === 'eligible').length
      const nearEligibleCount = evidenceRows.filter((r) => r.boardEligibility.status === 'near_eligible').length
      const requirementsRemainingCount = evidenceRows.filter((r) => r.boardEligibility.status === 'not_eligible').length
      const needsAttentionCount = evidenceRows.filter((r) => r.complianceScore.score < 70).length
      return {
        type,
        title: 'School Requirement Tracking Report',
        generatedAt: now,
        summary: avgScore === null
          ? 'Average ASCYN tracking score: Not enough data yet'
          : `Average ASCYN tracking score: ${avgScore}/100 | Students meeting tracked requirements: ${eligibleCount}`,
        rows: [
          { Metric: 'Average Tracking Score', Value: avgScore ?? 'Not enough data yet' },
          { Metric: 'Tracked Requirements Met', Value: eligibleCount },
          { Metric: 'Nearly Complete', Value: nearEligibleCount },
          { Metric: 'Requirements Remaining', Value: requirementsRemainingCount },
          { Metric: 'Needs Attention', Value: needsAttentionCount },
        ],
      }
    }
  }
}
