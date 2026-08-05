/**
 * Execution — Execution Queue Runner
 *
 * Deterministic runner that executes every Pending queue item in order by
 * repeatedly invoking ExecutionEngine.executeNext(). Threads the updated
 * queue and progress from each ExecutionOutcome into the next iteration.
 *
 * The runner:
 * - does NOT implement parallel execution, retries, or scheduling.
 * - does NOT reorder, skip, or filter items.
 * - does NOT inspect repositories or use AI.
 * - is deterministic — the same session always produces the same outcomes.
 *
 * Milestone 7.3.1: sequential queue execution only.
 */

import { ExecutionEngine } from './execution-engine'
import { ExecutionSession } from './execution-session'
import { ExecutionOutcome } from './execution-outcome'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in runner metadata. */
const QUEUE_RUNNER_VERSION = 'execution-queue-runner@7.3.1'

// ============================================================================
// EXECUTION QUEUE RUNNER
// ============================================================================

/**
 * Deterministic runner for sequential queue execution.
 *
 * Reuses ExecutionEngine.executeNext() for each item. After each execution,
 * the updated queue and progress are threaded into the next iteration via
 * a new immutable session view. The original session is never mutated.
 */
export class ExecutionQueueRunner {
  private readonly engine: ExecutionEngine

  /**
   * @param eng - The ExecutionEngine to use for item execution.
   *   Injected for testability.
   */
  constructor(eng: ExecutionEngine) {
    this.engine = eng
  }

  /**
   * Executes every Pending queue item in order.
   *
   * @param session - The ExecutionSession containing the queue.
   * @returns An array of ExecutionOutcomes, one per executed item, in order.
   */
  run(session: ExecutionSession): ExecutionOutcome[] {
    const outcomes: ExecutionOutcome[] = []
    let currentSession = session

    while (true) {
      const outcome = this.engine.executeNext(currentSession)

      if (!outcome) {
        break
      }

      outcomes.push(outcome)

      currentSession = {
        ...currentSession,
        metadata: {
          ...currentSession.metadata,
          executionQueue: outcome.executionQueue,
          executionProgress: outcome.executionProgress,
        },
      }
    }

    return outcomes
  }
}

// ============================================================================
// RUNNER VERSION EXPORT
// ============================================================================

export { QUEUE_RUNNER_VERSION }
