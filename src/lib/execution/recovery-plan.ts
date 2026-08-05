/**
 * Execution — Recovery Plan Model
 *
 * Immutable model representing the deterministic sequence of recovery actions
 * derived from a RecoveryAssessment. Planning is informational only — it does
 * NOT execute retries, perform rollback, or repair failures.
 *
 * Milestone 8.2.1: recovery plan model only.
 */

// ============================================================================
// RECOVERY STRATEGY
// ============================================================================

/**
 * Deterministic recovery strategy derived from the recommended action.
 *
 * - None: No recovery needed.
 * - Retry: Retry the failed execution.
 * - Rollback: Revert to a previous state.
 * - ManualReview: Require human intervention.
 */
export type RecoveryStrategy = 'None' | 'Retry' | 'Rollback' | 'ManualReview'

// ============================================================================
// RECOVERY ACTION TYPE
// ============================================================================

/**
 * The type of a single recovery action.
 */
export type RecoveryActionType = 'RetryExecution' | 'RollbackExecution' | 'NotifyManualReview'

// ============================================================================
// RECOVERY ACTION
// ============================================================================

/**
 * A single deterministic recovery action.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RecoveryAction {
  /** Stable identifier for this action. */
  readonly actionId: string

  /** Execution order (1-based). */
  readonly order: number

  /** The type of action. */
  readonly type: RecoveryActionType

  /** Human-readable description. */
  readonly description: string
}

// ============================================================================
// RECOVERY PLAN
// ============================================================================

/**
 * The complete deterministic recovery plan for a RecoveryAssessment.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RecoveryPlan {
  /** Stable identifier for this plan. */
  readonly planId: string

  /** Version of the planner. */
  readonly planVersion: string

  /** The assessment that was planned for. */
  readonly assessmentId: string

  /** Deterministic recovery strategy. */
  readonly strategy: RecoveryStrategy

  /** Ordered list of recovery actions. */
  readonly actions: readonly RecoveryAction[]

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
