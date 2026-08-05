/**
 * Execution Assessment — Model
 *
 * Immutable model representing the complete execution assessment for a task.
 * Composes the outputs of the complexity analysis, budget evaluation, budget
 * decision, and execution readiness into a single result.
 *
 * It carries no recommendations, no plan, and no actions — those belong to
 * later milestones.
 *
 * Milestone 4: assessment model only.
 */

import { ComplexityReport } from '../complexity-model/complexity-report'
import { ExecutionBudgetEvaluation } from './execution-budget-evaluator'
import { BudgetDecision } from './budget-decision'
import { ExecutionReadiness } from './execution-readiness'

// ============================================================================
// EXECUTION ASSESSMENT
// ============================================================================

/**
 * The complete execution assessment for a task.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionAssessment {
  /** The complexity report for the task. */
  readonly complexityReport: ComplexityReport

  /** The budget evaluation for the task. */
  readonly budgetEvaluation: ExecutionBudgetEvaluation

  /** The budget decision for the task. */
  readonly budgetDecision: BudgetDecision

  /** The execution readiness assessment for the task. */
  readonly executionReadiness: ExecutionReadiness
}
