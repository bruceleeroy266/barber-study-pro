/**
 * Execution — Execution Lifecycle Model
 *
 * Immutable model representing the deterministic lifecycle that processed an
 * ExecutionOutcome. Provides metadata describing the completed pipeline
 * stages without duplicating verification, analysis, or recovery data.
 *
 * Milestone 8.3.1: execution lifecycle model only.
 */

// ============================================================================
// LIFECYCLE STAGE
// ============================================================================

/**
 * The stages of the execution lifecycle pipeline.
 *
 * - Verification: Structural verification of the outcome.
 * - Analysis: Failure analysis of the verification.
 * - RecoveryAssessment: Recoverability assessment of the analysis.
 * - RecoveryPlanning: Recovery plan generation from the assessment.
 * - RecoveryExecution: Recovery plan execution.
 */
export type LifecycleStage =
  | 'Verification'
  | 'Analysis'
  | 'RecoveryAssessment'
  | 'RecoveryPlanning'
  | 'RecoveryExecution'

// ============================================================================
// EXECUTION LIFECYCLE
// ============================================================================

/**
 * Immutable metadata describing the lifecycle that processed an ExecutionOutcome.
 *
 * Does NOT duplicate verification, analysis, or recovery data — only records
 * which stages were completed and when.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionLifecycle {
  /** Stable identifier for this lifecycle. */
  readonly lifecycleId: string

  /** Version of the lifecycle coordinator. */
  readonly lifecycleVersion: string

  /** The outcome that was processed. */
  readonly outcomeId: string

  /** Ordered list of completed stages. */
  readonly stages: readonly LifecycleStage[]

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
