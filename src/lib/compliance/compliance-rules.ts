/**
 * STATE BOARD COMPLIANCE RULES
 * ASCYN PRO / Barber Study Pro V2
 *
 * Configurable thresholds used by the compliance engine.
 */

export interface ComplianceRuleThresholds {
  requiredHours: number
  minimumAttendancePercentage: number
  minimumReadinessScore: number
  minimumOverallGrade: number
  minimumAssessmentPassRate: number
  minimumPracticalPassRate: number
  requiredAssessments: number
  requiredPracticals: number
}

export const DEFAULT_COMPLIANCE_THRESHOLDS: ComplianceRuleThresholds = {
  requiredHours: 1500,
  minimumAttendancePercentage: 80,
  minimumReadinessScore: 70,
  minimumOverallGrade: 70,
  minimumAssessmentPassRate: 80,
  minimumPracticalPassRate: 80,
  requiredAssessments: 5,
  requiredPracticals: 10,
}

export const COMPLIANCE_WEIGHTS = {
  attendance: 0.2,
  hours: 0.25,
  assessments: 0.2,
  practicals: 0.15,
  readiness: 0.1,
  grades: 0.1,
}

export function getStatusForThreshold(
  actual: number,
  required: number,
  partialRatio = 0.8
): 'met' | 'partial' | 'missing' {
  if (actual >= required) return 'met'
  if (actual >= required * partialRatio) return 'partial'
  return 'missing'
}

export function getComplianceLabel(score: number): { label: string; colorClass: string } {
  if (score >= 90) return { label: 'Excellent', colorClass: 'text-green-400' }
  if (score >= 80) return { label: 'Good', colorClass: 'text-blue-400' }
  if (score >= 70) return { label: 'Fair', colorClass: 'text-yellow-400' }
  if (score >= 60) return { label: 'At Risk', colorClass: 'text-orange-400' }
  return { label: 'Critical', colorClass: 'text-red-400' }
}
