/**
 * Task Planner — Planning Validation Model
 *
 * Immutable models representing the structural validation of a TaskPlan.
 * Validation is informational only — it reports results without modifying
 * the plan or throwing exceptions.
 *
 * Milestone 5.3.1: planning validation model only.
 */

// ============================================================================
// VALIDATION STATUS
// ============================================================================

/**
 * The overall validation status.
 *
 * - Valid: All checks passed.
 * - Invalid: One or more checks failed.
 */
export type PlanningValidationStatus = 'Valid' | 'Invalid'

// ============================================================================
// VALIDATION CHECK
// ============================================================================

/**
 * A single validation check result.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface PlanningValidationCheck {
  /** Human-readable name of the check. */
  readonly name: string

  /** Whether the check passed. */
  readonly passed: boolean

  /** Human-readable description of the result. */
  readonly message: string
}

// ============================================================================
// PLANNING VALIDATION
// ============================================================================

/**
 * The complete validation result for a TaskPlan.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface PlanningValidation {
  /** Stable identifier for this validation. */
  readonly validationId: string

  /** Version of the validation engine. */
  readonly validationVersion: string

  /** Overall validation status. */
  readonly status: PlanningValidationStatus

  /** Individual check results. */
  readonly checks: readonly PlanningValidationCheck[]

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
