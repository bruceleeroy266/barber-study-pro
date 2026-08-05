/**
 * Execution — Verification Analysis Model
 *
 * Immutable model representing the deterministic classification of a failed
 * ExecutionVerification. Analysis is informational only — it classifies
 * failures without modifying, retrying, or repairing anything.
 *
 * Milestone 8.1.2: verification failure analysis model only.
 */

// ============================================================================
// VERIFICATION ANALYSIS SEVERITY
// ============================================================================

/**
 * Deterministic severity classification for a verification failure.
 *
 * - Low: Minor structural inconsistency.
 * - Medium: Meaningful structural inconsistency.
 * - High: Significant structural integrity problem.
 * - Critical: Fundamental structural absence.
 */
export type VerificationAnalysisSeverity = 'Low' | 'Medium' | 'High' | 'Critical'

// ============================================================================
// VERIFICATION FAILURE CATEGORY
// ============================================================================

/**
 * Deterministic category for a single failed verification check.
 *
 * Each known checkId maps to exactly one category. Unknown checkIds map
 * to Unknown.
 */
export type VerificationFailureCategory =
  | 'MissingResult'
  | 'MissingQueue'
  | 'MissingProgress'
  | 'InvalidProgressTotals'
  | 'QueueMismatch'
  | 'InvalidQueueStatus'
  | 'Unknown'

import { RecoveryAssessment } from './recovery-assessment'

// ============================================================================
// VERIFICATION ANALYSIS
// ============================================================================

/**
 * The complete deterministic analysis of a failed ExecutionVerification.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface VerificationAnalysis {
  /** Stable identifier for this analysis. */
  readonly analysisId: string

  /** Version of the analyzer. */
  readonly analysisVersion: string

  /** The verification that was analyzed. */
  readonly verificationId: string

  /** Deterministic severity derived from the failed checks. */
  readonly severity: VerificationAnalysisSeverity

  /** Deterministic categories for every failed check. */
  readonly categories: readonly VerificationFailureCategory[]

  /** Deterministic recovery assessment. Optional for backward compatibility. */
  readonly recoveryAssessment?: RecoveryAssessment

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
