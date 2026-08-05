/**
 * Execution Budget Manager — Budget Evaluator
 *
 * Deterministic evaluator that decides whether a task (described by a
 * ComplexityReport) fits within a given ExecutionBudget.
 *
 * The evaluator:
 * - checks only complexity score, confidence score, estimated file count, and
 *   estimated runtime (when available).
 * - consumes an ExecutionBudget policy — it contains no hardcoded limits.
 * - is deterministic — the same report and budget always produce the same
 *   evaluation.
 *
 * It does NOT inspect repositories, plan, split tasks, call AI, integrate with
 * memory, or produce recommendations.
 *
 * Milestone 1: evaluation only.
 */

import { ComplexityReport } from '../complexity-model/complexity-report'
import { ExecutionBudget } from './execution-budget'
import { DEFAULT_EXECUTION_BUDGET } from './execution-budget-policy'

// ============================================================================
// BUDGET CATEGORY
// ============================================================================

/**
 * The budget dimensions that can be violated.
 */
export enum BudgetCategory {
  Files = 'files',
  EstimatedRuntime = 'estimated_runtime',
  ComplexityScore = 'complexity_score',
  ConfidenceScore = 'confidence_score',
}

// ============================================================================
// BUDGET VIOLATION
// ============================================================================

/**
 * A single way in which the task exceeded (or failed to meet) a budget limit.
 */
export interface BudgetViolation {
  /** The budget dimension that was violated. */
  readonly category: BudgetCategory

  /** The configured limit from the budget. */
  readonly expectedLimit: number

  /** The actual value observed in the report. */
  readonly actualValue: number

  /**
   * How far past the limit the actual value is.
   * Always >= 0. For "minimum" constraints (confidence) this is the shortfall.
   */
  readonly exceededAmount: number

  /** Human-readable explanation of the violation. */
  readonly explanation: string
}

// ============================================================================
// BUDGET EVALUATION RESULT
// ============================================================================

/**
 * The outcome of evaluating a ComplexityReport against an ExecutionBudget.
 */
export interface ExecutionBudgetEvaluation {
  /** True when the task satisfies every applicable budget limit. */
  readonly passed: boolean

  /** All budget violations found (empty when passed is true). */
  readonly violations: readonly BudgetViolation[]

  /**
   * Remaining capacity per budget dimension (limit − actual, clamped at 0).
   * Useful for understanding headroom without producing recommendations.
   */
  readonly remainingCapacity: Readonly<Record<BudgetCategory, number>>
}

// ============================================================================
// BUDGET EVALUATOR
// ============================================================================

export class ExecutionBudgetEvaluator {
  /**
   * Evaluates a ComplexityReport against an ExecutionBudget.
   *
   * @param report - The complexity report describing the task.
   * @param budget - The budget policy to enforce. Defaults to
   *   DEFAULT_EXECUTION_BUDGET.
   * @returns An ExecutionBudgetEvaluation with pass/fail, violations, and
   *   remaining capacity.
   */
  evaluate(
    report: ComplexityReport,
    budget: ExecutionBudget = DEFAULT_EXECUTION_BUDGET
  ): ExecutionBudgetEvaluation {
    const violations: BudgetViolation[] = []

    // --- Files (maximum) ---
    const actualFiles = report.estimatedFileCount
    if (actualFiles > budget.maximumFiles) {
      violations.push({
        category: BudgetCategory.Files,
        expectedLimit: budget.maximumFiles,
        actualValue: actualFiles,
        exceededAmount: actualFiles - budget.maximumFiles,
        explanation:
          `Estimated file count (${actualFiles}) exceeds the maximum allowed ` +
          `(${budget.maximumFiles}).`,
      })
    }

    // --- Complexity score (maximum) ---
    const actualComplexity = report.totalScore
    if (actualComplexity > budget.maximumComplexityScore) {
      violations.push({
        category: BudgetCategory.ComplexityScore,
        expectedLimit: budget.maximumComplexityScore,
        actualValue: actualComplexity,
        exceededAmount: actualComplexity - budget.maximumComplexityScore,
        explanation:
          `Complexity score (${actualComplexity}) exceeds the maximum allowed ` +
          `(${budget.maximumComplexityScore}).`,
      })
    }

    // --- Confidence score (minimum) ---
    const actualConfidence = report.confidence.score
    if (actualConfidence < budget.minimumConfidenceScore) {
      violations.push({
        category: BudgetCategory.ConfidenceScore,
        expectedLimit: budget.minimumConfidenceScore,
        actualValue: actualConfidence,
        exceededAmount: budget.minimumConfidenceScore - actualConfidence,
        explanation:
          `Confidence score (${actualConfidence}) is below the minimum required ` +
          `(${budget.minimumConfidenceScore}).`,
      })
    }

    // --- Estimated runtime (maximum, only when available) ---
    // Note: ComplexityReport.estimatedRuntime is treated as minutes at this
    // integration boundary.
    const actualRuntime = report.estimatedRuntime
    if (actualRuntime !== undefined && actualRuntime > budget.maximumEstimatedRuntimeMinutes) {
      violations.push({
        category: BudgetCategory.EstimatedRuntime,
        expectedLimit: budget.maximumEstimatedRuntimeMinutes,
        actualValue: actualRuntime,
        exceededAmount: actualRuntime - budget.maximumEstimatedRuntimeMinutes,
        explanation:
          `Estimated runtime (${actualRuntime} min) exceeds the maximum allowed ` +
          `(${budget.maximumEstimatedRuntimeMinutes} min).`,
      })
    }

    const remainingCapacity: Readonly<Record<BudgetCategory, number>> = {
      [BudgetCategory.Files]: Math.max(0, budget.maximumFiles - actualFiles),
      [BudgetCategory.EstimatedRuntime]:
        actualRuntime !== undefined
          ? Math.max(0, budget.maximumEstimatedRuntimeMinutes - actualRuntime)
          : budget.maximumEstimatedRuntimeMinutes,
      [BudgetCategory.ComplexityScore]: Math.max(0, budget.maximumComplexityScore - actualComplexity),
      [BudgetCategory.ConfidenceScore]: Math.max(0, actualConfidence - budget.minimumConfidenceScore),
    }

    return {
      passed: violations.length === 0,
      violations,
      remainingCapacity,
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default evaluator instance. The evaluator is stateless, so a shared
 * instance is safe; budgets are supplied per-call.
 */
export const executionBudgetEvaluator = new ExecutionBudgetEvaluator()
