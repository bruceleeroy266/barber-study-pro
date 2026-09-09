/**
 * STATE BOARD COMPLIANCE RULES
 * ASCYN PRO / ASCYN PRO V2
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

/**
 * Build thresholds for a specific program by overriding only `requiredHours`
 * with the school-configured value (programs.required_hours). All other
 * thresholds stay at the app-wide defaults. A missing/invalid value preserves
 * the default fallback behavior.
 */
export function thresholdsWithRequiredHours(requiredHours?: number | null): ComplianceRuleThresholds {
  if (typeof requiredHours !== 'number' || !Number.isFinite(requiredHours) || requiredHours <= 0) {
    return DEFAULT_COMPLIANCE_THRESHOLDS
  }
  return { ...DEFAULT_COMPLIANCE_THRESHOLDS, requiredHours }
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
  if (score >= 90) return { label: 'Excellent', colorClass: 'text-gold' }
  if (score >= 80) return { label: 'Good', colorClass: 'text-silver' }
  if (score >= 70) return { label: 'Fair', colorClass: 'text-warm-bronze' }
  if (score >= 60) return { label: 'At Risk', colorClass: 'text-warm-bronze' }
  return { label: 'Critical', colorClass: 'text-silver' }
}
