/**
 * Execution Assessment — Pipeline
 *
 * Deterministic pipeline that orchestrates the existing execution assessment
 * components into a single entry point. It composes the ComplexityCalculator,
 * ExecutionBudgetEvaluator, BudgetDecisionEngine, and ExecutionReadinessEngine
 * in fixed order, producing an ExecutionAssessment.
 *
 * The pipeline:
 * - contains no business logic of its own.
 * - does not modify decision rules, create plans, or split tasks.
 * - is deterministic — the same request always produces the same assessment.
 * - allows errors to propagate; no retry, no swallowing, no logging.
 *
 * Milestone 4: orchestration only.
 */

import { ComplexityRequest } from '../complexity-model/complexity-request'
import { ComplexityCalculator, complexityCalculator } from '../complexity-model/complexity-calculator'
import { ExecutionBudgetEvaluator, executionBudgetEvaluator } from './execution-budget-evaluator'
import { BudgetDecisionEngine, budgetDecisionEngine } from './budget-decision-engine'
import { ExecutionReadinessEngine, executionReadinessEngine } from './execution-readiness-engine'
import { ExecutionAssessment } from './execution-assessment'

// ============================================================================
// EXECUTION ASSESSMENT PIPELINE
// ============================================================================

export class ExecutionAssessmentPipeline {
  private readonly complexityCalculator: ComplexityCalculator
  private readonly budgetEvaluator: ExecutionBudgetEvaluator
  private readonly decisionEngine: BudgetDecisionEngine
  private readonly readinessEngine: ExecutionReadinessEngine

  /**
   * @param complexityCalc - The complexity calculator to use. Defaults to the
   *   shared singleton instance.
   * @param budgetEval - The budget evaluator to use. Defaults to the shared
   *   singleton instance.
   * @param decisionEng - The budget decision engine to use. Defaults to the
   *   shared singleton instance.
   * @param readinessEng - The execution readiness engine to use. Defaults to
   *   the shared singleton instance.
   */
  constructor(
    complexityCalc: ComplexityCalculator = complexityCalculator,
    budgetEval: ExecutionBudgetEvaluator = executionBudgetEvaluator,
    decisionEng: BudgetDecisionEngine = budgetDecisionEngine,
    readinessEng: ExecutionReadinessEngine = executionReadinessEngine
  ) {
    this.complexityCalculator = complexityCalc
    this.budgetEvaluator = budgetEval
    this.decisionEngine = decisionEng
    this.readinessEngine = readinessEng
  }

  /**
   * Runs the full execution assessment pipeline for a task.
   *
   * Pipeline order:
   *   1. ComplexityCalculator (includes ConfidenceCalculator internally)
   *   2. ExecutionBudgetEvaluator
   *   3. BudgetDecisionEngine
   *   4. ExecutionReadinessEngine
   *
   * @param request - The complexity request describing the task.
   * @returns An immutable ExecutionAssessment.
   * @throws If any upstream component throws, the error propagates unchanged.
   */
  assess(request: ComplexityRequest): ExecutionAssessment {
    // Step 1: Complexity analysis (includes confidence calculation).
    const complexityReport = this.complexityCalculator.calculate(request)

    // Step 2: Budget evaluation.
    const budgetEvaluation = this.budgetEvaluator.evaluate(complexityReport)

    // Step 3: Budget decision.
    const budgetDecision = this.decisionEngine.decide(budgetEvaluation)

    // Step 4: Execution readiness.
    const executionReadiness = this.readinessEngine.assess(
      complexityReport,
      budgetEvaluation,
      budgetDecision
    )

    return {
      complexityReport,
      budgetEvaluation,
      budgetDecision,
      executionReadiness,
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default pipeline instance using the default component singletons.
 * Stateless and safe to share.
 */
export const executionAssessmentPipeline = new ExecutionAssessmentPipeline()
