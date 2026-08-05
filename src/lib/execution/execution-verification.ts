/**
 * Execution — Execution Verification Model
 *
 * Immutable models representing the structural verification of an
 * ExecutionOutcome. Verification is informational only — it evaluates the
 * outcome without modifying it, retrying, or repairing.
 *
 * Milestone 8.1.1: execution verification model only.
 */

// ============================================================================
// VERIFICATION STATUS
// ============================================================================

/**
 * The overall verification status.
 *
 * - Passed: All checks passed.
 * - Failed: One or more checks failed.
 */
export type ExecutionVerificationStatus = 'Passed' | 'Failed'

// ============================================================================
// VERIFICATION CHECK
// ============================================================================

/**
 * A single verification check result.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionVerificationCheck {
  /** Stable identifier for this check. */
  readonly checkId: string

  /** Human-readable name of the check. */
  readonly name: string

  /** Whether the check passed. */
  readonly passed: boolean

  /** Human-readable description of the result. */
  readonly message: string
}

import { VerificationAnalysis } from './verification-analysis'

// ============================================================================
// EXECUTION VERIFICATION
// ============================================================================

/**
 * The complete verification result for an ExecutionOutcome.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionVerification {
  /** Stable identifier for this verification. */
  readonly verificationId: string

  /** Version of the verifier. */
  readonly verificationVersion: string

  /** The outcome that was verified. */
  readonly outcomeId: string

  /** Overall verification status. */
  readonly status: ExecutionVerificationStatus

  /** Individual check results. */
  readonly checks: readonly ExecutionVerificationCheck[]

  /** Deterministic failure analysis. Optional for backward compatibility. */
  readonly verificationAnalysis?: VerificationAnalysis

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
