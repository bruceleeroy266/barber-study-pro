/**
 * Execution — Execution Queue Builder
 *
 * Deterministic builder that converts an ExecutionSession into an ordered
 * ExecutionQueue by walking TaskPlan → Phase → Step. Maintains deterministic
 * ordering with no filtering, no optimization, and no scheduling.
 *
 * The builder:
 * - does NOT execute queue items.
 * - does NOT mutate queue items.
 * - does NOT inspect repositories or use AI.
 * - is deterministic — the same session always produces the same queue.
 *
 * Milestone 6.2.2: execution queue generation only.
 */

import { ExecutionSession } from './execution-session'
import {
  ExecutionQueue,
  ExecutionQueueItem,
  ExecutionQueueItemStatus,
} from './execution-queue'
import { requireNonNull, requireProperty, combineGuards } from './execution-guards'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in queue metadata. */
const QUEUE_BUILDER_VERSION = 'execution-queue-builder@6.2.2'

// ============================================================================
// EXECUTION QUEUE BUILDER
// ============================================================================

/**
 * Deterministic builder for generating execution queues.
 *
 * Walks the TaskPlan phases and steps in order, producing a flat queue of
 * ExecutionQueueItems. All items begin as Pending. No filtering, no
 * optimization, no scheduling.
 */
export class ExecutionQueueBuilder {
  /**
   * Builds an ExecutionQueue from the given ExecutionSession.
   *
   * @param session - The ExecutionSession containing the TaskPlan.
   * @returns An immutable ExecutionQueue with all items Pending.
   */
  build(session: ExecutionSession): ExecutionQueue {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(session, 'ExecutionSession'),
      requireNonNull(session?.executionContext, 'ExecutionSession.executionContext'),
      requireNonNull(session?.executionContext?.taskPlan, 'ExecutionSession.executionContext.taskPlan'),
      requireProperty(session, 'sessionId', 'ExecutionSession')
    )

    if (!guard.passed) {
      return this.buildBlockedQueue(session, guard.message)
    }

    const items: ExecutionQueueItem[] = []
    let order = 0

    const phases = session.executionContext.taskPlan.phases ?? []

    for (const phase of phases) {
      const steps = phase.steps ?? []

      for (const step of steps) {
        items.push({
          itemId: `item-${phase.id}-${step.id}`,
          phaseId: phase.id,
          stepId: step.id,
          order,
          status: 'Pending' as ExecutionQueueItemStatus,
        })
        order++
      }
    }

    return {
      queueId: `queue-${session.sessionId}`,
      queueVersion: QUEUE_BUILDER_VERSION,
      items,
      metadata: {
        builderVersion: QUEUE_BUILDER_VERSION,
        sessionId: session.sessionId,
        totalItems: items.length,
        totalPhases: phases.length,
        generatedAt: new Date().toISOString(),
      },
    }
  }

  /**
   * Builds a blocked queue when input validation fails.
   */
  private buildBlockedQueue(
    session: ExecutionSession | null | undefined,
    reason: string
  ): ExecutionQueue {
    return {
      queueId: `queue-blocked-${session?.sessionId ?? 'unknown'}`,
      queueVersion: QUEUE_BUILDER_VERSION,
      items: [],
      metadata: {
        builderVersion: QUEUE_BUILDER_VERSION,
        sessionId: session?.sessionId ?? 'unknown',
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
 * Default queue builder instance. Stateless and safe to share.
 */
export const executionQueueBuilder = new ExecutionQueueBuilder()
