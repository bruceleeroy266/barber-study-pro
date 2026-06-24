/**
 * COMPLIANCE REPORTS
 * ASCYN PRO / Barber Study Pro V2
 *
 * Generates demo CSV-ready compliance reports for audit preparation.
 */

import { ComplianceReport, ComplianceReportType, Profile } from '@/types'
import { buildStudentCompliance, StudentComplianceInputs } from './compliance-engine'

export interface ComplianceReportInputs {
  students: Profile[]
  attendanceRecords: StudentComplianceInputs['attendanceRecords']
  hourLogs: StudentComplianceInputs['hourLogs']
  quizAttempts: StudentComplianceInputs['quizAttempts']
  progress: StudentComplianceInputs['progress']
  grades: StudentComplianceInputs['grades']
  gradeCategories: StudentComplianceInputs['gradeCategories']
  assessments: StudentComplianceInputs['assessments']
}

function buildStudentInputs(student: Profile, inputs: ComplianceReportInputs): StudentComplianceInputs {
  return {
    student,
    attendanceRecords: inputs.attendanceRecords,
    hourLogs: inputs.hourLogs,
    quizAttempts: inputs.quizAttempts,
    progress: inputs.progress,
    grades: inputs.grades,
    gradeCategories: inputs.gradeCategories,
    assessments: inputs.assessments,
  }
}

export function generateComplianceReport(
  type: ComplianceReportType,
  inputs: ComplianceReportInputs
): ComplianceReport {
  const now = new Date().toISOString()
  const rows = inputs.students.map((student) => buildStudentCompliance(buildStudentInputs(student, inputs)))

  switch (type) {
    case 'student_compliance':
      return {
        type,
        title: 'Student Compliance Report',
        generatedAt: now,
        summary: `Compliance overview for ${inputs.students.length} students`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          'Compliance Score': r.complianceScore.score,
          Attendance: `${r.attendanceSummary.attendancePercentage}%`,
          Hours: `${Math.round(r.completedHours)}/1500`,
          'Assessments Pass': `${r.assessmentPassRate}%`,
          'Practicals Pass': `${r.practicalPassRate}%`,
          Readiness: r.readiness.score,
          Grade: `${r.overallGrade}%`,
          Status: r.complianceScore.label,
        })),
      }
    case 'graduation_readiness':
      return {
        type,
        title: 'Graduation Readiness Report',
        generatedAt: now,
        summary: `${rows.filter((r) => r.graduationReadiness.isReady).length} of ${rows.length} students ready for graduation`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          'Readiness %': r.graduationReadiness.percentage,
          'Hours Complete': `${r.graduationReadiness.completedHours}/${r.graduationReadiness.requiredHours}`,
          'Assessments Complete': `${r.graduationReadiness.completedAssessments}/${r.graduationReadiness.requiredAssessments}`,
          'Practicals Complete': `${r.graduationReadiness.completedPracticals}/${r.graduationReadiness.requiredPracticals}`,
          Ready: r.graduationReadiness.isReady ? 'Yes' : 'No',
          'Remaining Items': r.graduationReadiness.remainingItems.join('; ') || 'None',
        })),
      }
    case 'board_eligibility':
      return {
        type,
        title: 'Board Eligibility Report',
        generatedAt: now,
        summary: `${rows.filter((r) => r.boardEligibility.status === 'eligible').length} eligible, ${rows.filter((r) => r.boardEligibility.status === 'near_eligible').length} near eligible`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          Status: r.boardEligibility.label,
          'Missing Requirements': r.boardEligibility.missingRequirements.join('; ') || 'None',
        })),
      }
    case 'instructor_compliance':
      return {
        type,
        title: 'Instructor Compliance Report',
        generatedAt: now,
        summary: `Compliance summary across ${inputs.students.length} students`,
        rows: rows.map((r) => ({
          Student: r.fullName,
          'Compliance Score': r.complianceScore.score,
          'Board Eligible': r.boardEligibility.status === 'eligible' ? 'Yes' : 'No',
          'At Risk': r.complianceScore.score < 70 ? 'Yes' : 'No',
        })),
      }
    case 'school_compliance':
    default: {
      const avgScore = rows.length > 0 ? Math.round(rows.reduce((sum, r) => sum + r.complianceScore.score, 0) / rows.length) : 0
      const eligibleCount = rows.filter((r) => r.boardEligibility.status === 'eligible').length
      return {
        type,
        title: 'School Compliance Report',
        generatedAt: now,
        summary: `Average compliance score: ${avgScore}/100 | Eligible students: ${eligibleCount}`,
        rows: [
          { Metric: 'Average Compliance Score', Value: avgScore },
          { Metric: 'Eligible Students', Value: eligibleCount },
          { Metric: 'Near Eligible Students', Value: rows.filter((r) => r.boardEligibility.status === 'near_eligible').length },
          { Metric: 'Not Eligible Students', Value: rows.filter((r) => r.boardEligibility.status === 'not_eligible').length },
          { Metric: 'At-Risk Students', Value: rows.filter((r) => r.complianceScore.score < 70).length },
        ],
      }
    }
  }
}
