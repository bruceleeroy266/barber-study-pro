/**
 * Execution — Execution Queue Updater
 *
 * Deterministic updater that transitions the state of exactly one queue item
 * after execution. Returns a new immutable ExecutionQueue — never mutates
 * existing items.
 *
 * The updater:
 * - does NOT execute queue items.
 * - does NOT update execution progress.
 * - does NOT mutate existing queue items.
 * - is deterministic — the same inputs always produce the same output.
 *
 * Milestone 7.1.3: queue item state transition only.
 */

import { ExecutionQueue, ExecutionQueueItem, ExecutionQueueItemStatus } from './execution-queue'
import { ExecutionResult } from './execution-result'
import { requireNonNull, combineGuards } from './execution-guards'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in updater metadata. */
const QUEUE_UPDATER_VERSION = 'execution-queue-updater@7.1.3'

// ============================================================================
// EXECUTION QUEUE UPDATER
// ============================================================================

/**
 * Deterministic updater for queue item state transitions.
 *
 * Locates the queue item matching the result's queueItemId and returns a new
 * immutable queue with only that item's status changed. All other items
 * remain unchanged.
 */
export class ExecutionQueueUpdater {
  /**
   * Updates the status of the queue item matching the given result.
   *
   * @param queue - The ExecutionQueue to update.
   * @param result - The ExecutionResult containing the target queueItemId.
   * @returns A new immutable ExecutionQueue with the item's status updated.
   */
  update(queue: ExecutionQueue, result: ExecutionResult): ExecutionQueue {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(queue, 'ExecutionQueue'),
      requireNonNull(queue?.items, 'ExecutionQueue.items'),
      requireNonNull(result, 'ExecutionResult'),
      requireNonNull(result?.queueItemId, 'ExecutionResult.queueItemId')
    )

    if (!guard.passed) {
      return queue ?? this.buildEmptyQueue(guard.message)
    }

    const updatedItems = queue.items.map((item) =>
      this.transitionItem(item, result)
    )

    return {
      ...queue,
      items: updatedItems,
      metadata: {
        ...queue.metadata,
        updaterVersion: QUEUE_UPDATER_VERSION,
        lastUpdatedItemId: result.queueItemId,
        lastUpdatedAt: new Date().toISOString(),
      },
    }
  }

  /**
   * Builds an empty queue when input validation fails.
   */
  private buildEmptyQueue(reason: string): ExecutionQueue {
    return {
      queueId: `queue-guard-failed`,
      queueVersion: QUEUE_UPDATER_VERSION,
      items: [],
      metadata: {
        updaterVersion: QUEUE_UPDATER_VERSION,
        guardFailed: true,
        guardReason: reason,
        lastUpdatedAt: new Date().toISOString(),
      },
    }
  }

  /**
   * Transitions a single queue item based on the execution result.
   *
   * @param item - The queue item to potentially transition.
   * @param result - The execution result to match against.
   * @returns The original item (unchanged) or a new item with updated status.
   */
  private transitionItem(
    item: ExecutionQueueItem,
    result: ExecutionResult
  ): ExecutionQueueItem {
    if (item.itemId !== result.queueItemId) {
      return item
    }

    const newStatus = this.mapResultStatus(result.status)

    return {
      ...item,
      status: newStatus,
    }
  }

  /**
   * Maps an ExecutionResultStatus to the corresponding queue item status.
   *
   * @param resultStatus - The status from the execution result.
   * @returns The corresponding queue item status.
   */
  private mapResultStatus(resultStatus: string): ExecutionQueueItemStatus {
    switch (resultStatus) {
      case 'Success':
        return 'Completed'
      case 'Failed':
        return 'Failed'
      case 'Skipped':
        return 'Skipped'
      default:
        return 'Pending'
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default queue updater instance. Stateless and safe to share.
 */
export const executionQueueUpdater = new ExecutionQueueUpdater()
