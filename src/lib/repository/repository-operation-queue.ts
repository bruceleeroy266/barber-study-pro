/**
 * Repository — Repository Operation Queue Model
 *
 * Immutable model representing the deterministic operation queue for a
 * repository execution session. Flattens execution stages into a single
 * ordered queue without executing operations or modifying the repository.
 *
 * Milestone 10.1.1: repository operation queue model only.
 */

// ============================================================================
// QUEUE STATUS
// ============================================================================

/**
 * The overall queue status.
 *
 * - Ready: Queue is ready for operation execution.
 * - Empty: Queue contains no operations.
 * - Blocked: Queue is blocked and cannot execute.
 */
export type QueueStatus = 'Ready' | 'Empty' | 'Blocked'

// ============================================================================
// REPOSITORY QUEUED OPERATION
// ============================================================================

/**
 * A single queued operation in the operation queue.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryQueuedOperation {
  /** Stable identifier for this queued operation. */
  readonly queuedOperationId: string

  /** Queue order (1-based, sequential). */
  readonly order: number

  /** Name of the stage this operation belongs to. */
  readonly stageName: string

  /** Action to perform. */
  readonly action: string

  /** Target file for this operation. */
  readonly target: string
}

// ============================================================================
// REPOSITORY OPERATION QUEUE
// ============================================================================

/**
 * The complete deterministic operation queue for a repository execution.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryOperationQueue {
  /** Stable identifier for this queue. */
  readonly queueId: string

  /** Version of the operation orchestrator. */
  readonly queueVersion: string

  /** The execution session that created this queue. */
  readonly sessionId: string

  /** Overall queue status. */
  readonly status: QueueStatus

  /** Ordered operations in the queue. */
  readonly operations: readonly RepositoryQueuedOperation[]

  /** Total number of operations in the queue. */
  readonly totalOperations: number

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
