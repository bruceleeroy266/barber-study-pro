/**
 * Repository — Repository Change Execution Plan Model
 *
 * Immutable model representing the deterministic execution plan for a
 * repository change. Converts a RepositoryChangeReadiness into an execution
 * sequence without inspecting source code or modifying the repository.
 *
 * Milestone 9.4.2: repository change execution plan model only.
 */

// ============================================================================
// EXECUTION PLAN STATUS
// ============================================================================

/**
 * The overall execution plan status.
 *
 * - Planned: The plan is ready for execution.
 * - Blocked: The plan is blocked and cannot be executed.
 */
export type ExecutionPlanStatus = 'Planned' | 'Blocked'

// ============================================================================
// REPOSITORY EXECUTION OPERATION
// ============================================================================

/**
 * A single operation in an execution stage.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryExecutionOperation {
  /** Stable identifier for this operation. */
  readonly operationId: string

  /** Target file for this operation. */
  readonly target: string

  /** Action to perform. */
  readonly action: string
}

// ============================================================================
// REPOSITORY EXECUTION STAGE
// ============================================================================

/**
 * A single stage in the execution plan.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryExecutionStage {
  /** Stable identifier for this stage. */
  readonly stageId: string

  /** Execution order (1-based). */
  readonly order: number

  /** Human-readable stage name. */
  readonly name: string

  /** Operations in this stage. */
  readonly operations: readonly RepositoryExecutionOperation[]
}

// ============================================================================
// REPOSITORY CHANGE EXECUTION PLAN
// ============================================================================

/**
 * The complete deterministic execution plan for a repository change.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryChangeExecutionPlan {
  /** Stable identifier for this execution plan. */
  readonly executionPlanId: string

  /** Version of the execution planner. */
  readonly executionPlanVersion: string

  /** The readiness assessment that was planned for. */
  readonly readinessId: string

  /** Overall execution plan status. */
  readonly status: ExecutionPlanStatus

  /** Ordered stages of the execution plan. */
  readonly stages: readonly RepositoryExecutionStage[]

  /** Total estimated operations (sum of all stage operations). */
  readonly estimatedOperations: number

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
