/**
 * Repository — Repository Change Validation Model
 *
 * Immutable model representing the deterministic validation of a
 * RepositoryChangePlan. Validates structure and consistency without
 * inspecting source code or modifying the repository.
 *
 * Milestone 9.3.2: repository change validation model only.
 */

// ============================================================================
// VALIDATION STATUS
// ============================================================================

/**
 * The overall validation status.
 *
 * - Passed: All checks passed.
 * - Failed: One or more checks failed.
 */
export type ValidationStatus = 'Passed' | 'Failed'

// ============================================================================
// REPOSITORY CHANGE CHECK
// ============================================================================

/**
 * A single validation check result.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryChangeCheck {
  /** Stable identifier for this check. */
  readonly checkId: string

  /** Human-readable name of the check. */
  readonly name: string

  /** Whether the check passed. */
  readonly passed: boolean

  /** Human-readable description of the result. */
  readonly message: string
}

// ============================================================================
// REPOSITORY CHANGE VALIDATION
// ============================================================================

/**
 * The complete deterministic validation of a RepositoryChangePlan.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryChangeValidation {
  /** Stable identifier for this validation. */
  readonly validationId: string

  /** Version of the validator. */
  readonly validationVersion: string

  /** The plan that was validated. */
  readonly planId: string

  /** Overall validation status. */
  readonly status: ValidationStatus

  /** Individual check results. */
  readonly checks: readonly RepositoryChangeCheck[]

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
