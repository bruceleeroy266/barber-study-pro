/**
 * Execution Budget Manager — Public API
 *
 * Re-exports the execution budget model, default policy, and evaluator.
 *
 * Milestone 1: budget evaluation only — no planning, splitting, or strategy.
 *
 * Usage:
 *   import { executionBudgetEvaluator, DEFAULT_EXECUTION_BUDGET } from '@/lib/execution-budget'
 */

// Execution Budget Model
export type { ExecutionBudget, ExecutionBudgetMetadata } from './execution-budget'

// Budget Policy
export {
  DEFAULT_EXECUTION_BUDGET,
  DEFAULT_MAXIMUM_FILES,
  DEFAULT_MAXIMUM_ESTIMATED_RUNTIME_MINUTES,
  DEFAULT_MAXIMUM_COMPLEXITY_SCORE,
  DEFAULT_MINIMUM_CONFIDENCE_SCORE,
} from './execution-budget-policy'

// Budget Evaluator
export { ExecutionBudgetEvaluator, executionBudgetEvaluator, BudgetCategory } from './execution-budget-evaluator'
export type { BudgetViolation, ExecutionBudgetEvaluation } from './execution-budget-evaluator'

// Budget Decision Model
export { BudgetDecisionType } from './budget-decision'
export type { BudgetDecision, BudgetEvaluationSummary } from './budget-decision'

// Budget Decision Engine
export {
  BudgetDecisionEngine,
  budgetDecisionEngine,
  buildDefaultDecisionRules,
  DEFAULT_SEVERITY_CONFIG,
} from './budget-decision-engine'
export type { BudgetDecisionRule, SeverityConfig } from './budget-decision-engine'

// Execution Readiness
export { ExecutionReadinessStatus } from './execution-readiness'
export type { ExecutionReadiness, ExecutionRequirement } from './execution-readiness'
export {
  ExecutionReadinessEngine,
  executionReadinessEngine,
  DEFAULT_EXECUTION_REQUIREMENTS,
} from './execution-readiness-engine'
export type { ExecutionRequirementDefinition, ReadinessInput } from './execution-readiness-engine'

// Execution Assessment
export type { ExecutionAssessment } from './execution-assessment'

// Execution Assessment Pipeline
export { ExecutionAssessmentPipeline, executionAssessmentPipeline } from './execution-assessment-pipeline'
