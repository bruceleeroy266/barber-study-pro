/**
 * Execution — Execution Readiness Model
 *
 * Immutable models representing the structural readiness assessment of an
 * ExecutionContext. Readiness is informational only — it reports results
 * without modifying the context or throwing exceptions.
 *
 * Milestone 6.1.2: execution readiness model only.
 */

// ============================================================================
// READINESS STATUS
// ============================================================================

/**
 * The overall readiness status.
 *
 * - Ready: All checks passed.
 * - NotReady: One or more checks failed.
 */
export type ExecutionReadinessStatus = 'Ready' | 'NotReady'

// ============================================================================
// READINESS CHECK
// ============================================================================

/**
 * A single readiness check result.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionReadinessCheck {
  /** Human-readable name of the check. */
  readonly name: string

  /** Whether the check passed. */
  readonly passed: boolean

  /** Human-readable description of the result. */
  readonly message: string
}

// ============================================================================
// EXECUTION READINESS
// ============================================================================

/**
 * The complete readiness assessment for an ExecutionContext.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionReadiness {
  /** Stable identifier for this readiness assessment. */
  readonly readinessId: string

  /** Version of the readiness engine. */
  readonly readinessVersion: string

  /** Overall readiness status. */
  readonly status: ExecutionReadinessStatus

  /** Individual check results. */
  readonly checks: readonly ExecutionReadinessCheck[]

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
