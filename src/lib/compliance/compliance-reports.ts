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
          'Tracking Score': r.complianceScore.score,
          Attendance: r.hasAttendanceEvidence ? `${r.attendanceSummary.attendancePercentage}%` : 'No Attendance Data',
          Hours: `${Math.round(r.completedHours)}/${r.graduationReadiness.requiredHours}`,
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
          Status: r.complianceScore.label,
        })),
      }
    case 'graduation_readiness':
      return {
        type,
        title: 'Program Completion Readiness Report',
        generatedAt: now,
        summary: `${rows.filter((r) => r.graduationReadiness.isReady).length} of ${rows.length} students meet all ASCYN PRO tracked program thresholds`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          'Readiness %': r.graduationReadiness.percentage,
          'Hours Complete': `${r.graduationReadiness.completedHours}/${r.graduationReadiness.requiredHours}`,
          'Earned Here': Math.round(r.earnedHours),
          'Prior Credit': Math.round(r.priorCreditHours),
          'Assessments Complete': `${r.graduationReadiness.completedAssessments}/${r.graduationReadiness.requiredAssessments}`,
          'Practicals Complete': `${r.graduationReadiness.completedPracticals}/${r.graduationReadiness.requiredPracticals}`,
          Ready: r.graduationReadiness.isReady ? 'Yes' : 'No',
          'Remaining Items': r.graduationReadiness.remainingItems.join('; ') || 'None',
        })),
      }
    case 'board_eligibility':
      return {
        type,
        title: 'Tracked Requirements Check',
        generatedAt: now,
        summary: `${rows.filter((r) => r.boardEligibility.status === 'eligible').length} meet all tracked requirements, ${rows.filter((r) => r.boardEligibility.status === 'near_eligible').length} nearly complete`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          Status: r.boardEligibility.label,
          'Missing Requirements': r.boardEligibility.missingRequirements.join('; ') || 'None',
        })),
      }
    case 'instructor_compliance':
      return {
        type,
        title: 'Instructor Requirement Tracking Report',
        generatedAt: now,
        summary: `Requirement tracking summary across ${inputs.students.length} students`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          'Tracking Score': r.complianceScore.score,
          'Tracked Requirements Met': r.boardEligibility.status === 'eligible' ? 'Yes' : 'No',
          'At Risk': r.complianceScore.score < 70 ? 'Yes' : 'No',
        })),
      }
    case 'school_compliance':
    default: {
      const avgScore = rows.length > 0 ? Math.round(rows.reduce((sum, r) => sum + r.complianceScore.score, 0) / rows.length) : 0
      const eligibleCount = rows.filter((r) => r.boardEligibility.status === 'eligible').length
      return {
        type,
        title: 'School Requirement Tracking Report',
        generatedAt: now,
        summary: `Average ASCYN tracking score: ${avgScore}/100 | Students meeting tracked requirements: ${eligibleCount}`,
        rows: [
          { Metric: 'Average Tracking Score', Value: avgScore },
          { Metric: 'Tracked Requirements Met', Value: eligibleCount },
          { Metric: 'Nearly Complete', Value: rows.filter((r) => r.boardEligibility.status === 'near_eligible').length },
          { Metric: 'Requirements Remaining', Value: rows.filter((r) => r.boardEligibility.status === 'not_eligible').length },
          { Metric: 'Needs Attention', Value: rows.filter((r) => r.complianceScore.score < 70).length },
        ],
      }
    }
  }
}
