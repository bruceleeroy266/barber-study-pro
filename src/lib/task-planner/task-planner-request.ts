/**
 * Task Planner — Planner Request Model
 *
 * Immutable model representing the complete input to the Task Planner.
 * Aggregates all upstream pipeline outputs needed to produce a plan.
 *
 * Milestone 2: request model only — no planning logic.
 */

import { ComplexityReport } from '../complexity-model/complexity-report'
import { ExecutionBudgetEvaluation } from '../execution-budget/execution-budget-evaluator'
import { BudgetDecision } from '../execution-budget/budget-decision'
import { ExecutionReadiness } from '../execution-budget/execution-readiness'

// ============================================================================
// PLANNER REQUEST METADATA
// ============================================================================

/**
 * Generic, extensible metadata for a planner request.
 * Open-ended to support future extension without assumptions about planning.
 */
export type TaskPlannerRequestMetadata = Record<string, unknown>

// ============================================================================
// TASK PLANNER REQUEST
// ============================================================================

/**
 * The complete input required to invoke the Task Planner.
 *
 * Immutable: all fields are readonly.
 */
export interface TaskPlannerRequest {
  /** Human-readable description of the task to plan. */
  readonly taskDescription: string

  /** The complexity report produced by the Complexity Calculator. */
  readonly complexityReport: ComplexityReport

  /** The budget evaluation produced by the Budget Evaluator. */
  readonly budgetEvaluation: ExecutionBudgetEvaluation

  /** The budget decision produced by the Budget Decision Engine. */
  readonly budgetDecision: BudgetDecision

  /** The readiness assessment produced by the Execution Readiness Engine. */
  readonly executionReadiness: ExecutionReadiness

  /** Generic extensible metadata. */
  readonly metadata?: TaskPlannerRequestMetadata
}
