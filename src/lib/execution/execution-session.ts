/**
 * Execution — Execution Session Model
 *
 * Immutable models representing a single execution session. A session is
 * created by the ExecutionEngine when it consumes an ExecutionContext.
 * Every new session begins as Pending — execution is intentionally deferred.
 *
 * Milestone 6.2.1: execution session model only.
 */

import { ExecutionContext } from './execution-context'

// ============================================================================
// SESSION STATUS
// ============================================================================

/**
 * The lifecycle status of an execution session.
 *
 * - Pending: Session created, execution not yet started.
 * - Running: Execution in progress.
 * - Completed: Execution finished successfully.
 * - Failed: Execution encountered an error.
 */
export type ExecutionSessionStatus = 'Pending' | 'Running' | 'Completed' | 'Failed'

// ============================================================================
// EXECUTION SESSION
// ============================================================================

/**
 * An immutable execution session.
 *
 * Created by the ExecutionEngine from an ExecutionContext. Contains no
 * mutable state and no execution logic.
 */
export interface ExecutionSession {
  /** Stable identifier for this session. */
  readonly sessionId: string

  /** Version of the execution engine that created this session. */
  readonly sessionVersion: string

  /** The execution context that produced this session. */
  readonly executionContext: ExecutionContext

  /** Current lifecycle status. */
  readonly status: ExecutionSessionStatus

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
