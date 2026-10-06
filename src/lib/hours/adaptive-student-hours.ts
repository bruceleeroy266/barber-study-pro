import type { HoursProgressLog } from '@/lib/hours/reporting'
import { getOfficialMinutes } from '@/lib/hours/reporting'

export type EnrollmentRequirementSource = 'program' | 'student_override'

export interface EnrollmentHourContractInput {
  programRequiredHours: number
  priorCreditMinutes?: number | null
  requirementOverrideMinutes?: number | null
  contractVersion?: number | null
}

export interface AdaptiveStudentHoursSummary {
  programRequiredHours: number
  programRequiredMinutes: number
  priorCreditMinutes: number
  earnedApprovedMinutes: number
  creditedAndEarnedMinutes: number
  effectiveRequiredMinutes: number
  effectiveRequiredHours: number
  requirementSource: EnrollmentRequirementSource
  remainingMinutes: number
  completionPercentage: number
  contractVersion: number
}

/**
 * Canonical adaptive-hours calculation contract.
 *
 * - Program requirement remains the school/program baseline.
 * - Prior/transfer credit is accepted historical credit and is NEVER fabricated
 *   as hour_logs or attendance.
 * - requirementOverrideMinutes changes only the student's enrollment requirement.
 * - Earned hours come only from the existing effective-hour chain.
 * - Pending/rejected hours do not contribute.
 * - Remaining hours floor at zero; raw completed minutes are not silently capped.
 * - Completion percentage is bounded 0..100 for display/report parity.
 */
export function calculateAdaptiveStudentHours(
  logs: HoursProgressLog[],
  contract: EnrollmentHourContractInput,
): AdaptiveStudentHoursSummary {
  const programRequiredHours =
    Number.isFinite(contract.programRequiredHours) && contract.programRequiredHours > 0
      ? contract.programRequiredHours
      : 0
  const programRequiredMinutes = Math.round(programRequiredHours * 60)

  const priorCreditMinutes =
    Number.isInteger(contract.priorCreditMinutes) && (contract.priorCreditMinutes ?? 0) >= 0
      ? (contract.priorCreditMinutes as number)
      : 0

  const override = contract.requirementOverrideMinutes
  const hasValidOverride =
    Number.isInteger(override) && (override as number) > 0

  const effectiveRequiredMinutes = hasValidOverride
    ? (override as number)
    : programRequiredMinutes

  const earnedApprovedMinutes = logs.reduce(
    (sum, log) => sum + getOfficialMinutes(log),
    0,
  )

  const creditedAndEarnedMinutes = priorCreditMinutes + earnedApprovedMinutes
  const remainingMinutes = Math.max(
    0,
    effectiveRequiredMinutes - creditedAndEarnedMinutes,
  )

  const completionPercentage = effectiveRequiredMinutes > 0
    ? Math.min(
        100,
        Math.max(
          0,
          Math.round((creditedAndEarnedMinutes / effectiveRequiredMinutes) * 100),
        ),
      )
    : 0

  return {
    programRequiredHours,
    programRequiredMinutes,
    priorCreditMinutes,
    earnedApprovedMinutes,
    creditedAndEarnedMinutes,
    effectiveRequiredMinutes,
    effectiveRequiredHours: effectiveRequiredMinutes / 60,
    requirementSource: hasValidOverride ? 'student_override' : 'program',
    remainingMinutes,
    completionPercentage,
    contractVersion:
      Number.isInteger(contract.contractVersion) && (contract.contractVersion ?? 0) >= 0
        ? (contract.contractVersion as number)
        : 0,
  }
}
