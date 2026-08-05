/**
 * Execution Budget Manager — Budget Decision Engine
 *
 * Deterministic engine that converts an ExecutionBudgetEvaluation into a
 * BudgetDecision. It answers only: "Can this task execute under the current
 * budget?"
 *
 * The engine evaluates a centralized, ordered list of decision rules; the
 * first matching rule wins. It contains no hardcoded branching scattered
 * through the implementation and no magic numbers — severity thresholds are
 * named configuration consumed by the rules.
 *
 * It does NOT create execution plans, split tasks, recommend phases, inspect
 * repositories, use AI, or persist anything. No side effects.
 *
 * Milestone 2: decision only.
 */

import {
  BudgetCategory,
  BudgetViolation,
  ExecutionBudgetEvaluation,
} from './execution-budget-evaluator'
import {
  BudgetDecision,
  BudgetDecisionType,
  BudgetEvaluationSummary,
} from './budget-decision'

// ============================================================================
// SEVERITY CONFIGURATION
// ============================================================================

/**
 * Named severity thresholds, per budget category.
 *
 * A violation whose `exceededAmount` is:
 *   <= minorThreshold  → minor
 *   <= criticalThreshold → recoverable (candidate for splitting)
 *   >  criticalThreshold → critical (blocking)
 *
 * Centralized here so the rules contain no magic numbers. To tune decision
 * behavior, edit these values (or supply a custom SeverityConfig).
 */
export interface SeverityConfig {
  readonly minorThreshold: Readonly<Record<BudgetCategory, number>>
  readonly criticalThreshold: Readonly<Record<BudgetCategory, number>>
}

/**
 * Default severity thresholds.
 */
export const DEFAULT_SEVERITY_CONFIG: SeverityConfig = {
  minorThreshold: {
    [BudgetCategory.Files]: 2,
    [BudgetCategory.EstimatedRuntime]: 5,
    [BudgetCategory.ComplexityScore]: 10,
    [BudgetCategory.ConfidenceScore]: 10,
  },
  criticalThreshold: {
    [BudgetCategory.Files]: 8,
    [BudgetCategory.EstimatedRuntime]: 20,
    [BudgetCategory.ComplexityScore]: 30,
    [BudgetCategory.ConfidenceScore]: 30,
  },
}

// ============================================================================
// VIOLATION SEVERITY
// ============================================================================

/**
 * The severity classification of a single violation.
 */
enum ViolationSeverity {
  Minor = 'minor',
  Recoverable = 'recoverable',
  Critical = 'critical',
}

/**
 * Classifies a violation's severity using the configured thresholds.
 */
function classifyViolation(
  violation: BudgetViolation,
  config: SeverityConfig
): ViolationSeverity {
  const minor = config.minorThreshold[violation.category]
  const critical = config.criticalThreshold[violation.category]

  if (violation.exceededAmount > critical) return ViolationSeverity.Critical
  if (violation.exceededAmount > minor) return ViolationSeverity.Recoverable
  return ViolationSeverity.Minor
}

// ============================================================================
// DECISION RULE
// ============================================================================

/**
 * A single, ordered decision rule. The engine evaluates rules in order; the
 * first rule whose `condition` returns true produces the decision.
 */
export interface BudgetDecisionRule {
  /** Stable identifier for the rule. */
  readonly id: string

  /** The decision this rule produces when it matches. */
  readonly decision: BudgetDecisionType

  /** Returns true when this rule applies to the evaluation. */
  readonly condition: (evaluation: ExecutionBudgetEvaluation) => boolean

  /** Builds the human-readable explanation for the decision. */
  readonly explanation: (evaluation: ExecutionBudgetEvaluation) => string
}

// ============================================================================
// DEFAULT DECISION RULES
// ============================================================================

/**
 * Builds the centralized, ordered default rule set for a given severity config.
 *
 * Order matters: the first matching rule wins.
 */
export function buildDefaultDecisionRules(
  config: SeverityConfig = DEFAULT_SEVERITY_CONFIG
): readonly BudgetDecisionRule[] {
  const hasViolations = (e: ExecutionBudgetEvaluation) => e.violations.length > 0

  const hasCritical = (e: ExecutionBudgetEvaluation) =>
    e.violations.some((v) => classifyViolation(v, config) === ViolationSeverity.Critical)

  const hasRecoverable = (e: ExecutionBudgetEvaluation) =>
    e.violations.some((v) => classifyViolation(v, config) === ViolationSeverity.Recoverable)

  return [
    {
      id: 'no-violations',
      decision: BudgetDecisionType.Allow,
      condition: (e) => !hasViolations(e),
      explanation: () => 'No budget violations. The task fits within the current budget.',
    },
    {
      id: 'critical-violation',
      decision: BudgetDecisionType.Block,
      condition: (e) => hasViolations(e) && hasCritical(e),
      explanation: (e) => {
        const critical = e.violations.filter(
          (v) => classifyViolation(v, config) === ViolationSeverity.Critical
        )
        return (
          `Critical budget violation(s) detected (${critical.length}). ` +
          'The task exceeds recoverable limits and cannot proceed.'
        )
      },
    },
    {
      id: 'recoverable-violation',
      decision: BudgetDecisionType.RequiresSplitting,
      condition: (e) => hasViolations(e) && hasRecoverable(e),
      explanation: () =>
        'Budget exceeded but theoretically recoverable. The task is too large ' +
        'for a single execution budget.',
    },
    {
      id: 'minor-violations-only',
      decision: BudgetDecisionType.AllowWithWarning,
      condition: (e) => hasViolations(e),
      explanation: (e) =>
        `Minor budget violation(s) detected (${e.violations.length}). ` +
        'The task may proceed, but with caution.',
    },
  ]
}

// ============================================================================
// BUDGET DECISION ENGINE
// ============================================================================

export class BudgetDecisionEngine {
  private readonly rules: readonly BudgetDecisionRule[]

  /**
   * @param rules - Ordered decision rules. Defaults to the rules built from
   *   DEFAULT_SEVERITY_CONFIG. Injectable for testing and tuning.
   */
  constructor(rules: readonly BudgetDecisionRule[] = buildDefaultDecisionRules()) {
    this.rules = rules
  }

  /**
   * Decides whether a task can execute under the current budget.
   *
   * @param evaluation - The budget evaluation to convert into a decision.
   * @returns An immutable BudgetDecision.
   * @throws If no rule matches (indicates a misconfigured rule set).
   */
  decide(evaluation: ExecutionBudgetEvaluation): BudgetDecision {
    for (const rule of this.rules) {
      if (rule.condition(evaluation)) {
        return {
          decision: rule.decision,
          explanation: rule.explanation(evaluation),
          triggeredViolations: evaluation.violations,
          evaluationSummary: this.summarize(evaluation),
        }
      }
    }

    // A well-formed rule set always ends with a catch-all rule. Reaching here
    // means the injected rules are incomplete.
    throw new Error('BudgetDecisionEngine: no decision rule matched the evaluation.')
  }

  /**
   * Builds a compact, immutable summary of the evaluation.
   */
  private summarize(evaluation: ExecutionBudgetEvaluation): BudgetEvaluationSummary {
    return {
      passed: evaluation.passed,
      violationCount: evaluation.violations.length,
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default decision engine using the default rules. Stateless and safe to share.
 */
export const budgetDecisionEngine = new BudgetDecisionEngine()
