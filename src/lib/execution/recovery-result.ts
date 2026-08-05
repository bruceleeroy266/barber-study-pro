/**
 * Execution — Recovery Result Model
 *
 * Immutable model representing the deterministic result of executing a
 * RecoveryPlan. Execution is informational only — it uses placeholder
 * implementations and does NOT perform real retries, real rollback, or
 * external notifications.
 *
 * Milestone 8.2.2: recovery result model only.
 */

import { RecoveryActionType } from './recovery-plan'

// ============================================================================
// RECOVERY RESULT STATUS
// ============================================================================

/**
 * The overall status of a recovery execution.
 *
 * - Success: All actions completed successfully.
 * - Failed: One or more actions failed.
 */
export type RecoveryResultStatus = 'Success' | 'Failed'

// ============================================================================
// EXECUTED ACTION STATUS
// ============================================================================

/**
 * The status of a single executed action.
 *
 * - Success: The action completed successfully.
 * - Failed: The action failed.
 */
export type ExecutedActionStatus = 'Success' | 'Failed'

// ============================================================================
// EXECUTED ACTION
// ============================================================================

/**
 * A single executed recovery action.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutedAction {
  /** Stable identifier for this action (matches RecoveryAction.actionId). */
  readonly actionId: string

  /** The type of action. */
  readonly actionType: RecoveryActionType

  /** The execution status. */
  readonly status: ExecutedActionStatus

  /** ISO timestamp when the action completed. */
  readonly completedAt: string
}

// ============================================================================
// RECOVERY RESULT
// ============================================================================

/**
 * The complete deterministic result of executing a RecoveryPlan.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RecoveryResult {
  /** Stable identifier for this result. */
  readonly resultId: string

  /** Version of the recovery engine. */
  readonly resultVersion: string

  /** The plan that was executed. */
  readonly planId: string

  /** Ordered list of executed actions. */
  readonly executedActions: readonly ExecutedAction[]

  /** Overall execution status. */
  readonly status: RecoveryResultStatus

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
