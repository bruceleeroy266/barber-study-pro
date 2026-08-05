/**
 * Repository — Repository Change Readiness Model
 *
 * Immutable model representing the deterministic readiness assessment of a
 * validated RepositoryChangePlan. Evaluates execution readiness without
 * inspecting source code or modifying the repository.
 *
 * Milestone 9.4.1: repository change readiness model only.
 */

// ============================================================================
// READINESS STATUS
// ============================================================================

/**
 * The overall readiness status.
 *
 * - Ready: The plan is ready for execution.
 * - NotReady: The plan is not ready for execution.
 */
export type ReadinessStatus = 'Ready' | 'NotReady'

// ============================================================================
// REPOSITORY CHANGE BLOCKER
// ============================================================================

/**
 * A single blocker preventing plan execution.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryChangeBlocker {
  /** Stable identifier for this blocker. */
  readonly blockerId: string

  /** Human-readable description of the blocker. */
  readonly description: string
}

// ============================================================================
// REPOSITORY CHANGE RECOMMENDATION
// ============================================================================

/**
 * A single recommendation for resolving a blocker.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryChangeRecommendation {
  /** Stable identifier for this recommendation. */
  readonly recommendationId: string

  /** Human-readable description of the recommendation. */
  readonly description: string
}

// ============================================================================
// REPOSITORY CHANGE READINESS
// ============================================================================

/**
 * The complete deterministic readiness assessment for a validated plan.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryChangeReadiness {
  /** Stable identifier for this readiness assessment. */
  readonly readinessId: string

  /** Version of the readiness assessor. */
  readonly readinessVersion: string

  /** The validation that was assessed. */
  readonly validationId: string

  /** Overall readiness status. */
  readonly status: ReadinessStatus

  /** Blockers preventing execution (empty if Ready). */
  readonly blockers: readonly RepositoryChangeBlocker[]

  /** Recommendations for resolving blockers (empty if Ready). */
  readonly recommendations: readonly RepositoryChangeRecommendation[]

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
