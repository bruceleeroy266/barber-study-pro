/**
 * Execution — Execution Progress Updater
 *
 * Deterministic updater that derives ExecutionProgress entirely from the
 * current ExecutionQueue state. Progress is a derived model — it never
 * maintains independent state and always reflects the queue.
 *
 * The updater:
 * - does NOT execute queue items.
 * - does NOT mutate the existing progress object.
 * - does NOT inspect repositories or use AI.
 * - is deterministic — the same queue always produces the same progress.
 *
 * Milestone 7.2.1: execution progress synchronization only.
 */

import { ExecutionQueue } from './execution-queue'
import {
  ExecutionProgress,
  ExecutionProgressStatus,
} from './execution-progress'
import { requireNonNull, combineGuards } from './execution-guards'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in progress metadata. */
const PROGRESS_UPDATER_VERSION = 'execution-progress-updater@7.2.1'

// ============================================================================
// EXECUTION PROGRESS UPDATER
// ============================================================================

/**
 * Deterministic updater for synchronizing progress from queue state.
 *
 * Calculates all progress values directly from the queue. Returns a new
 * immutable ExecutionProgress — never mutates the existing object.
 */
export class ExecutionProgressUpdater {
  /**
   * Derives a new ExecutionProgress from the given queue.
   *
   * @param progress - The existing ExecutionProgress (used for ID preservation).
   * @param queue - The current ExecutionQueue to derive progress from.
   * @returns A new immutable ExecutionProgress reflecting the queue state.
   */
  update(progress: ExecutionProgress, queue: ExecutionQueue): ExecutionProgress {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(progress, 'ExecutionProgress'),
      requireNonNull(queue, 'ExecutionQueue'),
      requireNonNull(queue?.items, 'ExecutionQueue.items')
    )

    if (!guard.passed) {
      return progress ?? this.buildEmptyProgress(queue, guard.message)
    }

    const totalItems = queue.items.length
    const completedItems = queue.items.filter((item) => item.status === 'Completed').length
    const remainingItems = queue.items.filter(
      (item) => item.status === 'Pending' || item.status === 'Waiting'
    ).length
    const currentItem = queue.items.find((item) => item.status === 'Pending')?.itemId ?? null

    let percentComplete: number
    if (totalItems === 0) {
      percentComplete = 100
    } else {
      percentComplete = Math.floor((completedItems / totalItems) * 100)
    }

    const status = this.deriveStatus(completedItems, remainingItems)

    return {
      progressId: progress.progressId,
      progressVersion: PROGRESS_UPDATER_VERSION,
      currentItem,
      completedItems,
      remainingItems,
      totalItems,
      percentComplete,
      status,
      metadata: {
        ...progress.metadata,
        updaterVersion: PROGRESS_UPDATER_VERSION,
        queueId: queue.queueId,
        syncedAt: new Date().toISOString(),
      },
    }
  }

  /**
   * Builds an empty progress when input validation fails.
   */
  private buildEmptyProgress(
    queue: ExecutionQueue | null | undefined,
    reason: string
  ): ExecutionProgress {
    return {
      progressId: `progress-guard-failed`,
      progressVersion: PROGRESS_UPDATER_VERSION,
      currentItem: null,
      completedItems: 0,
      remainingItems: 0,
      totalItems: 0,
      percentComplete: 0,
      status: 'NotStarted',
      metadata: {
        updaterVersion: PROGRESS_UPDATER_VERSION,
        queueId: queue?.queueId ?? 'unknown',
        guardFailed: true,
        guardReason: reason,
        syncedAt: new Date().toISOString(),
      },
    }
  }

  /**
   * Derives the progress status from completed and remaining counts.
   *
   * @param completedItems - Number of completed items.
   * @param remainingItems - Number of remaining items.
   * @returns The derived ExecutionProgressStatus.
   */
  private deriveStatus(completedItems: number, remainingItems: number): ExecutionProgressStatus {
    if (remainingItems === 0) {
      return 'Complete'
    }
    if (completedItems > 0) {
      return 'InProgress'
    }
    return 'NotStarted'
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default progress updater instance. Stateless and safe to share.
 */
export const executionProgressUpdater = new ExecutionProgressUpdater()
