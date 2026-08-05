/**
 * Execution Budget Manager — Budget Decision Model
 *
 * Immutable model representing the deterministic execution decision derived
 * from an ExecutionBudgetEvaluation. A decision answers only:
 * "Can this task execute under the current budget?"
 *
 * It carries no recommendations, no execution plan, no phase breakdown, and no
 * execution strategy — those belong to later milestones.
 *
 * Milestone 2: decision model only.
 */

import { BudgetViolation } from './execution-budget-evaluator'

// ============================================================================
// BUDGET DECISION
// ============================================================================

/**
 * The possible execution decisions.
 */
export enum BudgetDecisionType {
  /** Task fits comfortably within budget — proceed. */
  Allow = 'allow',

  /** Task fits but with minor violations — proceed with caution. */
  AllowWithWarning = 'allow_with_warning',

  /** Task exceeds budget but is theoretically recoverable by splitting. */
  RequiresSplitting = 'requires_splitting',

  /** Task critically violates policy — do not proceed. */
  Block = 'block',
}

// ============================================================================
// EVALUATION SUMMARY
// ============================================================================

/**
 * A compact, immutable summary of the evaluation that produced the decision.
 */
export interface BudgetEvaluationSummary {
  /** Whether the underlying evaluation passed all limits. */
  readonly passed: boolean

  /** Total number of violations found. */
  readonly violationCount: number
}

// ============================================================================
// BUDGET DECISION
// ============================================================================

/**
 * The deterministic execution decision for a task.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface BudgetDecision {
  /** The decision outcome. */
  readonly decision: BudgetDecisionType

  /** Human-readable explanation of why this decision was reached. */
  readonly explanation: string

  /** The violations that triggered this decision (empty when none). */
  readonly triggeredViolations: readonly BudgetViolation[]

  /** A compact summary of the evaluation behind the decision. */
  readonly evaluationSummary: BudgetEvaluationSummary
}
