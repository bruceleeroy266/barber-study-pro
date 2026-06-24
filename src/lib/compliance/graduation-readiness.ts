/**
 * GRADUATION READINESS ENGINE
 * ASCYN PRO / Barber Study Pro V2
 *
 * Calculates how close a student is to graduation based on hours, assessments,
 * practicals, attendance, readiness, and grades.
 */

import { GraduationReadiness } from '@/types'
import { DEFAULT_COMPLIANCE_THRESHOLDS } from './compliance-rules'

export interface GraduationReadinessInputs {
  studentId: string
  fullName: string
  completedHours: number
  completedAssessments: number
  completedPracticals: number
  attendancePercentage: number
  readinessScore: number
  overallGrade: number
}

export function calculateGraduationReadiness(inputs: GraduationReadinessInputs): GraduationReadiness {
  const thresholds = DEFAULT_COMPLIANCE_THRESHOLDS
  const remainingItems: string[] = []

  const hoursRatio = Math.min(1, inputs.completedHours / thresholds.requiredHours)
  const assessmentRatio = Math.min(1, inputs.completedAssessments / thresholds.requiredAssessments)
  const practicalRatio = Math.min(1, inputs.completedPracticals / thresholds.requiredPracticals)
  const attendanceRatio = Math.min(1, inputs.attendancePercentage / thresholds.minimumAttendancePercentage)
  const readinessRatio = Math.min(1, inputs.readinessScore / thresholds.minimumReadinessScore)
  const gradeRatio = Math.min(1, inputs.overallGrade / thresholds.minimumOverallGrade)

  const percentage = Math.round(
    (hoursRatio * 0.35 +
      assessmentRatio * 0.2 +
      practicalRatio * 0.2 +
      attendanceRatio * 0.1 +
      readinessRatio * 0.075 +
      gradeRatio * 0.075) *
      100
  )

  if (inputs.completedHours < thresholds.requiredHours) {
    remainingItems.push(`${Math.max(0, thresholds.requiredHours - inputs.completedHours)} hours remaining`)
  }
  if (inputs.completedAssessments < thresholds.requiredAssessments) {
    remainingItems.push(`${thresholds.requiredAssessments - inputs.completedAssessments} assessments remaining`)
  }
  if (inputs.completedPracticals < thresholds.requiredPracticals) {
    remainingItems.push(`${thresholds.requiredPracticals - inputs.completedPracticals} practicals remaining`)
  }
  if (inputs.attendancePercentage < thresholds.minimumAttendancePercentage) {
    remainingItems.push(`Attendance must reach ${thresholds.minimumAttendancePercentage}%`)
  }
  if (inputs.readinessScore < thresholds.minimumReadinessScore) {
    remainingItems.push(`Readiness must reach ${thresholds.minimumReadinessScore}`)
  }
  if (inputs.overallGrade < thresholds.minimumOverallGrade) {
    remainingItems.push(`Grade must reach ${thresholds.minimumOverallGrade}%`)
  }

  return {
    studentId: inputs.studentId,
    fullName: inputs.fullName,
    percentage,
    completedHours: inputs.completedHours,
    requiredHours: thresholds.requiredHours,
    completedAssessments: inputs.completedAssessments,
    requiredAssessments: thresholds.requiredAssessments,
    completedPracticals: inputs.completedPracticals,
    requiredPracticals: thresholds.requiredPracticals,
    overallGrade: inputs.overallGrade,
    attendancePercentage: inputs.attendancePercentage,
    readinessScore: inputs.readinessScore,
    isReady: remainingItems.length === 0,
    remainingItems,
  }
}
