/**
 * Execution Budget Manager — Execution Readiness Model
 *
 * Immutable models representing whether all prerequisites required for
 * execution are satisfied. Readiness answers only: "Is everything needed to
 * execute present and satisfied?"
 *
 * It carries no recommendations, no plan, and no actions — those belong to
 * later milestones.
 *
 * Milestone 3: readiness model only.
 */

// ============================================================================
// READINESS STATUS
// ============================================================================

/**
 * The possible readiness outcomes.
 */
export enum ExecutionReadinessStatus {
  /** All execution requirements are satisfied. */
  Ready = 'ready',

  /** One or more execution requirements are missing or failed. */
  NotReady = 'not_ready',
}

// ============================================================================
// EXECUTION REQUIREMENT
// ============================================================================

/**
 * A single prerequisite for execution, with its evaluated state.
 */
export interface ExecutionRequirement {
  /** Stable identifier for the requirement. */
  readonly id: string

  /** Human-readable name of the requirement. */
  readonly name: string

  /** Whether the requirement is satisfied. */
  readonly satisfied: boolean

  /** Human-readable explanation of the requirement's state. */
  readonly explanation: string
}

// ============================================================================
// EXECUTION READINESS
// ============================================================================

/**
 * The result of assessing execution readiness.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionReadiness {
  /** Overall readiness status. */
  readonly status: ExecutionReadinessStatus

  /** All evaluated requirements, in evaluation order. */
  readonly requirements: readonly ExecutionRequirement[]

  /** The subset of requirements that were not satisfied. */
  readonly failedRequirements: readonly ExecutionRequirement[]

  /** Human-readable summary of the readiness assessment. */
  readonly summary: string
}
