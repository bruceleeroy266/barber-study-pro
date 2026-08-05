/**
 * Execution — Execution Progress Model
 *
 * Immutable models representing deterministic execution progress tracking.
 * Records execution position without executing queue items or mutating state.
 *
 * Milestone 6.2.3: execution progress model only.
 */

// ============================================================================
// PROGRESS STATUS
// ============================================================================

/**
 * The lifecycle status of execution progress.
 *
 * - NotStarted: No items have been completed.
 * - InProgress: Some items completed, work remaining.
 * - Complete: All items completed.
 */
export type ExecutionProgressStatus = 'NotStarted' | 'InProgress' | 'Complete'

// ============================================================================
// EXECUTION PROGRESS
// ============================================================================

/**
 * An immutable snapshot of execution progress.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionProgress {
  /** Stable identifier for this progress record. */
  readonly progressId: string

  /** Version of the progress builder. */
  readonly progressVersion: string

  /** The itemId of the current position, or null if queue is empty. */
  readonly currentItem: string | null

  /** Number of completed items. */
  readonly completedItems: number

  /** Number of remaining items. */
  readonly remainingItems: number

  /** Total number of items in the queue. */
  readonly totalItems: number

  /** Completion percentage (0–100). */
  readonly percentComplete: number

  /** Current progress status. */
  readonly status: ExecutionProgressStatus

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
