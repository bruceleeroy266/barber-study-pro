/**
 * Repository — Repository Execution Session Model
 *
 * Immutable model representing the deterministic execution session for a
 * repository change. Tracks execution state without inspecting source code
 * or modifying the repository.
 *
 * Milestone 10.0.1: repository execution session model only.
 */

import { RepositoryExecutionStage } from './repository-change-execution-plan'

// ============================================================================
// EXECUTION SESSION STATUS
// ============================================================================

/**
 * The overall execution session status.
 *
 * - Pending: Session created but not yet ready.
 * - Ready: Session is ready to begin execution.
 * - Running: Session is currently executing.
 * - Completed: Session has completed successfully.
 * - Blocked: Session is blocked and cannot execute.
 */
export type ExecutionSessionStatus =
  | 'Pending'
  | 'Ready'
  | 'Running'
  | 'Completed'
  | 'Blocked'

// ============================================================================
// REPOSITORY EXECUTION SESSION
// ============================================================================

/**
 * The complete deterministic execution session for a repository change.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryExecutionSession {
  /** Stable identifier for this session. */
  readonly sessionId: string

  /** Version of the execution coordinator. */
  readonly sessionVersion: string

  /** The execution plan that created this session. */
  readonly executionPlanId: string

  /** Overall session status. */
  readonly status: ExecutionSessionStatus

  /** The current stage being executed (null if not started or blocked). */
  readonly currentStage: RepositoryExecutionStage | null

  /** Number of completed operations. */
  readonly completedOperations: number

  /** Number of remaining operations. */
  readonly remainingOperations: number

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
