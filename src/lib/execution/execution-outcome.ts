/**
 * Execution — Execution Outcome Model
 *
 * Immutable model that consolidates the output of a single executeNext()
 * call into a single object. Contains the execution result, updated queue,
 * and updated progress — all immutable, never mutated.
 *
 * Milestone 7.2.2: execution outcome model only.
 */

import { ExecutionResult } from './execution-result'
import { ExecutionQueue } from './execution-queue'
import { ExecutionProgress } from './execution-progress'
import { ExecutionVerification } from './execution-verification'

// ============================================================================
// EXECUTION OUTCOME
// ============================================================================

/**
 * An immutable consolidation of a single execution step's output.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionOutcome {
  /** Stable identifier for this outcome. */
  readonly outcomeId: string

  /** Version of the outcome model. */
  readonly outcomeVersion: string

  /** The result of the executed queue item. */
  readonly executionResult: ExecutionResult

  /** The updated execution queue. */
  readonly executionQueue: ExecutionQueue

  /** The updated execution progress. */
  readonly executionProgress: ExecutionProgress

  /** The execution verification result. Optional for backward compatibility. */
  readonly executionVerification?: ExecutionVerification

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
