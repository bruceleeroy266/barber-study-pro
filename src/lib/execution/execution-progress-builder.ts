/**
 * Execution — Execution Progress Builder
 *
 * Deterministic builder that produces an immutable ExecutionProgress from
 * an ExecutionQueue. Records initial execution position — no execution, no
 * mutation, no scheduling.
 *
 * The builder:
 * - does NOT execute queue items.
 * - does NOT mutate queue items.
 * - does NOT inspect repositories or use AI.
 * - is deterministic — the same queue always produces the same progress.
 *
 * Milestone 6.2.3: execution progress tracking only.
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
const PROGRESS_BUILDER_VERSION = 'execution-progress-builder@6.2.3'

// ============================================================================
// EXECUTION PROGRESS BUILDER
// ============================================================================

/**
 * Deterministic builder for generating execution progress snapshots.
 *
 * Every new progress object begins as NotStarted with 0% completion.
 * No execution, no mutation, no scheduling.
 */
export class ExecutionProgressBuilder {
  /**
   * Builds an ExecutionProgress from the given ExecutionQueue.
   *
   * @param queue - The ExecutionQueue to track progress for.
   * @returns An immutable ExecutionProgress initialized to NotStarted.
   */
  build(queue: ExecutionQueue): ExecutionProgress {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(queue, 'ExecutionQueue'),
      requireNonNull(queue?.items, 'ExecutionQueue.items')
    )

    if (!guard.passed) {
      return this.buildBlockedProgress(queue, guard.message)
    }

    const totalItems = queue.items.length
    const completedItems = 0
    const remainingItems = totalItems
    const currentItem = totalItems > 0 ? queue.items[0].itemId : null
    const percentComplete = 0
    const status: ExecutionProgressStatus = 'NotStarted'

    return {
      progressId: `progress-${queue.queueId}`,
      progressVersion: PROGRESS_BUILDER_VERSION,
      currentItem,
      completedItems,
      remainingItems,
      totalItems,
      percentComplete,
      status,
      metadata: {
        builderVersion: PROGRESS_BUILDER_VERSION,
        queueId: queue.queueId,
        generatedAt: new Date().toISOString(),
      },
    }
  }

  /**
   * Builds a blocked progress when input validation fails.
   */
  private buildBlockedProgress(
    queue: ExecutionQueue | null | undefined,
    reason: string
  ): ExecutionProgress {
    return {
      progressId: `progress-blocked-${queue?.queueId ?? 'unknown'}`,
      progressVersion: PROGRESS_BUILDER_VERSION,
      currentItem: null,
      completedItems: 0,
      remainingItems: 0,
      totalItems: 0,
      percentComplete: 0,
      status: 'NotStarted',
      metadata: {
        builderVersion: PROGRESS_BUILDER_VERSION,
        queueId: queue?.queueId ?? 'unknown',
        blocked: true,
        blockReason: reason,
        generatedAt: new Date().toISOString(),
      },
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default progress builder instance. Stateless and safe to share.
 */
export const executionProgressBuilder = new ExecutionProgressBuilder()
