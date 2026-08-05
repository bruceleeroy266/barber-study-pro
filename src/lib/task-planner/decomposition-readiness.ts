/**
 * Task Planner — Decomposition Readiness Model
 *
 * Immutable models representing whether a task exceeds the limits of a
 * single deterministic execution plan and therefore requires decomposition.
 *
 * It carries no recommendations, no decomposition logic, and no execution
 * strategy — those belong to later milestones.
 *
 * Milestone 1.4.1: readiness model only.
 */

// ============================================================================
// DECOMPOSITION READINESS STATUS
// ============================================================================

/**
 * The possible decomposition readiness outcomes.
 */
export enum DecompositionReadinessStatus {
  /** Task fits within a single deterministic plan — no decomposition needed. */
  NotRequired = 'not_required',

  /** Task is approaching limits — decomposition should be considered. */
  Recommended = 'recommended',

  /** Task exceeds limits — decomposition is required. */
  Required = 'required',
}

// ============================================================================
// DECOMPOSITION REASON
// ============================================================================

/**
 * A single reason why decomposition readiness was assessed at a given level.
 */
export interface DecompositionReason {
  /** Stable identifier for the reason. */
  readonly id: string

  /** Human-readable explanation. */
  readonly explanation: string

  /** The threshold value that was evaluated. */
  readonly threshold: number

  /** The actual value observed in the assessment. */
  readonly actualValue: number
}

// ============================================================================
// DECOMPOSITION READINESS
// ============================================================================

/**
 * The result of assessing decomposition readiness.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface DecompositionReadiness {
  /** Overall decomposition readiness status. */
  readonly status: DecompositionReadinessStatus

  /** All reasons that contributed to the status. */
  readonly reasons: readonly DecompositionReason[]

  /** The thresholds that were evaluated during assessment. */
  readonly thresholdsEvaluated: readonly string[]

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
