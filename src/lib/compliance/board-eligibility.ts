/**
 * BOARD ELIGIBILITY ENGINE
 * ASCYN PRO / ASCYN PRO V2
 *
 * Determines whether a student is eligible, nearly eligible, or not eligible
 * to sit for the state board exam based on attendance, hours, assessments,
 * practicals, readiness, and grades.
 */

import { BoardEligibilityResult, BoardEligibilityStatus } from '@/types'
import { ComplianceRuleThresholds, DEFAULT_COMPLIANCE_THRESHOLDS } from './compliance-rules'
import { ComplianceScoreInputs } from './compliance-score'

function addIfMissing(condition: boolean, list: string[], message: string): void {
  if (condition) list.push(message)
}

export function determineBoardEligibility(
  inputs: ComplianceScoreInputs,
  thresholds: ComplianceRuleThresholds = DEFAULT_COMPLIANCE_THRESHOLDS
): BoardEligibilityResult {
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
  if (thresholds.requiredAssessments > 0) {
    addIfMissing(
      inputs.completedAssessments < thresholds.requiredAssessments,
      missingRequirements,
      `Assessments completed: ${inputs.completedAssessments}/${thresholds.requiredAssessments}`
    )
    addIfMissing(
      inputs.assessmentPassRate < thresholds.minimumAssessmentPassRate,
      missingRequirements,
      `Assessment pass rate: ${inputs.assessmentPassRate}% (need ${thresholds.minimumAssessmentPassRate}%)`
    )
  }
  if (thresholds.requiredPracticals > 0) {
    addIfMissing(
      inputs.completedPracticals < thresholds.requiredPracticals,
      missingRequirements,
      `Practicals completed: ${inputs.completedPracticals}/${thresholds.requiredPracticals}`
    )
    addIfMissing(
      inputs.practicalPassRate < thresholds.minimumPracticalPassRate,
      missingRequirements,
      `Practical pass rate: ${inputs.practicalPassRate}% (need ${thresholds.minimumPracticalPassRate}%)`
    )
  }
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
    reasons.push('All ASCYN PRO tracked program requirements met')
  } else if (mostlyMet) {
    status = 'near_eligible'
    reasons.push('Close to meeting the tracked program requirements')
  } else {
    status = 'not_eligible'
    reasons.push('Multiple tracked program requirements remain')
  }

  let label: string
  let colorClass: string
  switch (status) {
    case 'eligible':
      label = 'Tracked Requirements Met'
      colorClass = 'text-gold'
      break
    case 'near_eligible':
      label = 'Nearly Complete'
      colorClass = 'text-warm-bronze'
      break
    default:
      label = 'Requirements Remaining'
      colorClass = 'text-silver'
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
