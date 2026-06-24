/**
 * BOARD ELIGIBILITY ENGINE
 * ASCYN PRO / Barber Study Pro V2
 *
 * Determines whether a student is eligible, nearly eligible, or not eligible
 * to sit for the state board exam based on attendance, hours, assessments,
 * practicals, readiness, and grades.
 */

import { BoardEligibilityResult, BoardEligibilityStatus } from '@/types'
import { DEFAULT_COMPLIANCE_THRESHOLDS } from './compliance-rules'
import { ComplianceScoreInputs } from './compliance-score'

function addIfMissing(condition: boolean, list: string[], message: string): void {
  if (condition) list.push(message)
}

export function determineBoardEligibility(inputs: ComplianceScoreInputs): BoardEligibilityResult {
  const thresholds = DEFAULT_COMPLIANCE_THRESHOLDS
  const missingRequirements: string[] = []
  const reasons: string[] = []

  addIfMissing(
    inputs.completedHours < thresholds.requiredHours,
    missingRequirements,
    `Hours: ${inputs.completedHours}/${thresholds.requiredHours}`
  )
  addIfMissing(
    inputs.attendancePercentage < thresholds.minimumAttendancePercentage,
    missingRequirements,
    `Attendance: ${inputs.attendancePercentage}% (need ${thresholds.minimumAttendancePercentage}%)`
  )
  addIfMissing(
    inputs.assessmentPassRate < thresholds.minimumAssessmentPassRate,
    missingRequirements,
    `Assessment pass rate: ${inputs.assessmentPassRate}% (need ${thresholds.minimumAssessmentPassRate}%)`
  )
  addIfMissing(
    inputs.practicalPassRate < thresholds.minimumPracticalPassRate,
    missingRequirements,
    `Practical pass rate: ${inputs.practicalPassRate}% (need ${thresholds.minimumPracticalPassRate}%)`
  )
  addIfMissing(
    inputs.readinessScore < thresholds.minimumReadinessScore,
    missingRequirements,
    `Readiness: ${inputs.readinessScore} (need ${thresholds.minimumReadinessScore})`
  )
  addIfMissing(
    inputs.overallGrade < thresholds.minimumOverallGrade,
    missingRequirements,
    `Grade: ${inputs.overallGrade}% (need ${thresholds.minimumOverallGrade}%)`
  )

  const allMet = missingRequirements.length === 0
  const mostlyMet =
    !allMet &&
    missingRequirements.length <= 2 &&
    inputs.completedHours >= thresholds.requiredHours * 0.85 &&
    inputs.attendancePercentage >= thresholds.minimumAttendancePercentage * 0.9

  let status: BoardEligibilityStatus
  if (allMet) {
    status = 'eligible'
    reasons.push('All state board requirements met')
  } else if (mostlyMet) {
    status = 'near_eligible'
    reasons.push('Close to eligibility; minor requirements remain')
  } else {
    status = 'not_eligible'
    reasons.push('Multiple state board requirements not yet met')
  }

  let label: string
  let colorClass: string
  switch (status) {
    case 'eligible':
      label = 'Eligible for Board'
      colorClass = 'text-green-400'
      break
    case 'near_eligible':
      label = 'Nearly Eligible'
      colorClass = 'text-yellow-400'
      break
    default:
      label = 'Not Eligible'
      colorClass = 'text-red-400'
  }

  return {
    status,
    label,
    colorClass,
    reasons,
    missingRequirements,
    estimatedCompletionDate: null,
  }
}
