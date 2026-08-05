/**
 * Execution — Execution Result Model
 *
 * Immutable models representing the result of executing a single queue item.
 * For this milestone, every execution returns Success — no failures, no retries.
 *
 * Milestone 7.1.1: execution result model only.
 */

// ============================================================================
// RESULT STATUS
// ============================================================================

/**
 * The outcome status of a single queue item execution.
 *
 * - Success: The item completed successfully.
 * - Failed: The item encountered an error.
 * - Skipped: The item was skipped.
 */
export type ExecutionResultStatus = 'Success' | 'Failed' | 'Skipped'

// ============================================================================
// EXECUTION RESULT
// ============================================================================

/**
 * An immutable record of a single queue item execution.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionResult {
  /** Stable identifier for this result. */
  readonly resultId: string

  /** Version of the step runner that produced this result. */
  readonly resultVersion: string

  /** The queue item that was executed. */
  readonly queueItemId: string

  /** The outcome status. */
  readonly status: ExecutionResultStatus

  /** ISO timestamp when execution started. */
  readonly startedAt: string

  /** ISO timestamp when execution completed. */
  readonly completedAt: string

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
