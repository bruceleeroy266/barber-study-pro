/**
 * Execution — Recovery Assessment Model
 *
 * Immutable model representing the deterministic recoverability evaluation
 * of a VerificationAnalysis. Assessment is informational only — it evaluates
 * recoverability without performing recovery, retrying, or repairing.
 *
 * Milestone 8.1.3: recovery assessment model only.
 */

// ============================================================================
// RECOMMENDED ACTION
// ============================================================================

/**
 * Deterministic recommended action for a verification failure.
 *
 * - None: No action needed.
 * - Retry: The failure may be resolved by retrying.
 * - Rollback: The failure may require reverting state.
 * - ManualReview: The failure requires human intervention.
 */
export type RecommendedAction = 'None' | 'Retry' | 'Rollback' | 'ManualReview'

import { RecoveryPlan } from './recovery-plan'
import { RecoveryResult } from './recovery-result'

// ============================================================================
// RECOVERY ASSESSMENT
// ============================================================================

/**
 * The complete deterministic recovery assessment for a VerificationAnalysis.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RecoveryAssessment {
  /** Stable identifier for this assessment. */
  readonly assessmentId: string

  /** Version of the assessor. */
  readonly assessmentVersion: string

  /** The analysis that was assessed. */
  readonly analysisId: string

  /** Whether the failure is recoverable. */
  readonly recoverable: boolean

  /** Deterministic recommended action. */
  readonly recommendedAction: RecommendedAction

  /** Deterministic recovery plan. Optional for backward compatibility. */
  readonly recoveryPlan?: RecoveryPlan

  /** Deterministic recovery result. Optional for backward compatibility. */
  readonly recoveryResult?: RecoveryResult

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
