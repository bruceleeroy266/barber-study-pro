/**
 * Execution Budget Manager — Budget Policy
 *
 * Centralized default execution budget policy. These are the default
 * engineering limits applied when no custom budget is supplied.
 *
 * All values are configurable: the evaluator consumes an ExecutionBudget and
 * contains no hardcoded limits of its own. To tune limits, edit
 * DEFAULT_EXECUTION_BUDGET or supply a custom ExecutionBudget.
 *
 * Milestone 1: policy only — no evaluation logic.
 */

import { ExecutionBudget } from './execution-budget'

// ============================================================================
// DEFAULT POLICY VALUES
// ============================================================================

/**
 * Default limits, defined once as named constants (no magic numbers scattered
 * through the policy or evaluator).
 */
export const DEFAULT_MAXIMUM_FILES = 8
export const DEFAULT_MAXIMUM_ESTIMATED_RUNTIME_MINUTES = 10
export const DEFAULT_MAXIMUM_COMPLEXITY_SCORE = 60
export const DEFAULT_MINIMUM_CONFIDENCE_SCORE = 70

// ============================================================================
// DEFAULT EXECUTION BUDGET
// ============================================================================

/**
 * The default execution budget policy.
 *
 * Centralized on purpose: this is the single source of truth for default
 * engineering limits.
 */
export const DEFAULT_EXECUTION_BUDGET: ExecutionBudget = {
  maximumFiles: DEFAULT_MAXIMUM_FILES,
  maximumEstimatedRuntimeMinutes: DEFAULT_MAXIMUM_ESTIMATED_RUNTIME_MINUTES,
  maximumComplexityScore: DEFAULT_MAXIMUM_COMPLEXITY_SCORE,
  minimumConfidenceScore: DEFAULT_MINIMUM_CONFIDENCE_SCORE,
  metadata: {
    name: 'default',
    description: 'Default execution budget policy for safe task execution.',
  },
}
