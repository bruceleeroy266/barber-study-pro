/**
 * Execution — Execution Step Runner
 *
 * Deterministic placeholder runner for a single queue item. Returns a
 * deterministic Success result — no repository operations, no file operations,
 * no external commands, no AI reasoning.
 *
 * The runner:
 * - does NOT execute real work.
 * - does NOT mutate the queue item.
 * - does NOT inspect repositories.
 * - is deterministic — the same item always produces the same result shape.
 *
 * Milestone 7.1.1: single queue item execution only.
 */

import { ExecutionQueueItem } from './execution-queue'
import { ExecutionResult, ExecutionResultStatus } from './execution-result'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in result metadata. */
const STEP_RUNNER_VERSION = 'execution-step-runner@7.1.1'

// ============================================================================
// EXECUTION STEP RUNNER
// ============================================================================

/**
 * Deterministic placeholder for executing a single queue item.
 *
 * Always returns Success. No real work is performed. No failures. No retries.
 */
export class ExecutionStepRunner {
  /**
   * Executes a single queue item.
   *
   * @param item - The ExecutionQueueItem to execute.
   * @returns An immutable ExecutionResult with status Success.
   */
  run(item: ExecutionQueueItem): ExecutionResult {
    const now = new Date().toISOString()
    const status: ExecutionResultStatus = 'Success'

    return {
      resultId: `result-${item.itemId}`,
      resultVersion: STEP_RUNNER_VERSION,
      queueItemId: item.itemId,
      status,
      startedAt: now,
      completedAt: now,
      metadata: {
        runnerVersion: STEP_RUNNER_VERSION,
        phaseId: item.phaseId,
        stepId: item.stepId,
        order: item.order,
      },
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default step runner instance. Stateless and safe to share.
 */
export const executionStepRunner = new ExecutionStepRunner()
