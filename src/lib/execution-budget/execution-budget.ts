/**
 * Execution Budget Manager — Execution Budget Model
 *
 * Strongly typed, immutable model representing the engineering limits within
 * which a task is allowed to execute. A budget is a pure data container — it
 * carries no logic. Evaluation lives in the Budget Evaluator.
 *
 * Milestone 1: budget model only.
 */

// ============================================================================
// BUDGET METADATA
// ============================================================================

/**
 * Optional descriptive context for a budget.
 */
export interface ExecutionBudgetMetadata {
  /** Human-readable name for the budget (e.g. "default", "strict", "demo"). */
  readonly name?: string

  /** Free-form description of when/why this budget applies. */
  readonly description?: string

  /** ISO 8601 timestamp of when the budget was created. */
  readonly createdAt?: string
}

// ============================================================================
// EXECUTION BUDGET
// ============================================================================

/**
 * The engineering limits a task must satisfy to execute safely.
 *
 * Immutable: all fields are readonly. Create new budgets rather than mutating.
 */
export interface ExecutionBudget {
  /** Maximum number of files a task may touch. */
  readonly maximumFiles: number

  /** Maximum estimated runtime, in minutes. */
  readonly maximumEstimatedRuntimeMinutes: number

  /** Maximum allowed complexity score (0–100). */
  readonly maximumComplexityScore: number

  /** Minimum required confidence score (0–100). */
  readonly minimumConfidenceScore: number

  /** Optional descriptive metadata. */
  readonly metadata?: ExecutionBudgetMetadata
}
