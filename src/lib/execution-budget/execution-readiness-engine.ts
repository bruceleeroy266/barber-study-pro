/**
 * Execution Budget Manager — Execution Readiness Engine
 *
 * Deterministic engine that assesses whether all prerequisites required for
 * execution are satisfied. It evaluates a centralized, declarative list of
 * requirements against the ComplexityReport, ExecutionBudgetEvaluation, and
 * BudgetDecision, and produces an ExecutionReadiness result.
 *
 * The engine:
 * - evaluates requirements sequentially, in declared order.
 * - contains no scattered branching — each requirement is a declarative
 *   definition with its own check and explanation.
 * - has no side effects, does not inspect repositories, does not use AI, and
 *   does not plan or recommend.
 *
 * Milestone 3: readiness assessment only.
 */

import { ComplexityReport } from '../complexity-model/complexity-report'
import { ExecutionBudgetEvaluation } from './execution-budget-evaluator'
import { BudgetDecision } from './budget-decision'
import {
  ExecutionReadiness,
  ExecutionReadinessStatus,
  ExecutionRequirement,
} from './execution-readiness'

// ============================================================================
// READINESS INPUT
// ============================================================================

/**
 * The inputs a readiness requirement may inspect.
 */
export interface ReadinessInput {
  readonly report: ComplexityReport
  readonly evaluation: ExecutionBudgetEvaluation
  readonly decision: BudgetDecision
}

// ============================================================================
// REQUIREMENT DEFINITION
// ============================================================================

/**
 * A declarative execution requirement. Each requirement knows how to check
 * itself and how to explain its result.
 */
export interface ExecutionRequirementDefinition {
  /** Stable identifier for the requirement. */
  readonly id: string

  /** Human-readable name of the requirement. */
  readonly name: string

  /** Returns true when the requirement is satisfied. */
  readonly check: (input: ReadinessInput) => boolean

  /** Builds the explanation for the requirement's current state. */
  readonly explain: (input: ReadinessInput, satisfied: boolean) => string
}

// ============================================================================
// DEFAULT REQUIREMENTS
// ============================================================================

/**
 * Centralized default execution requirements, evaluated in order.
 *
 * To change what counts as "ready," edit this list (or supply a custom list to
 * the engine). No branching lives inside the engine itself.
 */
export const DEFAULT_EXECUTION_REQUIREMENTS: readonly ExecutionRequirementDefinition[] = [
  {
    id: 'complexity-score-available',
    name: 'Complexity score available',
    check: ({ report }) => typeof report.totalScore === 'number' && Number.isFinite(report.totalScore),
    explain: ({ report }, satisfied) =>
      satisfied
        ? `Complexity score is available (${report.totalScore}).`
        : 'Complexity score is missing or invalid.',
  },
  {
    id: 'confidence-available',
    name: 'Confidence available',
    check: ({ report }) =>
      report.confidence !== undefined &&
      typeof report.confidence.score === 'number' &&
      Number.isFinite(report.confidence.score),
    explain: ({ report }, satisfied) =>
      satisfied
        ? `Confidence score is available (${report.confidence.score}).`
        : 'Confidence score is missing or invalid.',
  },
  {
    id: 'budget-passed',
    name: 'Budget passed',
    check: ({ evaluation }) => evaluation.passed,
    explain: ({ evaluation }, satisfied) =>
      satisfied
        ? 'The execution budget evaluation passed.'
        : `The execution budget evaluation failed with ${evaluation.violations.length} violation(s).`,
  },
  {
    id: 'budget-decision-available',
    name: 'Budget decision available',
    check: ({ decision }) => decision !== undefined && decision !== null,
    explain: (_input, satisfied) =>
      satisfied
        ? 'A budget decision is available.'
        : 'No budget decision is available.',
  },
]

// ============================================================================
// EXECUTION READINESS ENGINE
// ============================================================================

export class ExecutionReadinessEngine {
  private readonly requirements: readonly ExecutionRequirementDefinition[]

  /**
   * @param requirements - Declarative requirements to evaluate, in order.
   *   Defaults to DEFAULT_EXECUTION_REQUIREMENTS. Injectable for testing/tuning.
   */
  constructor(
    requirements: readonly ExecutionRequirementDefinition[] = DEFAULT_EXECUTION_REQUIREMENTS
  ) {
    this.requirements = requirements
  }

  /**
   * Assesses execution readiness from the supplied artifacts.
   *
   * @param report - The complexity report for the task.
   * @param evaluation - The budget evaluation for the task.
   * @param decision - The budget decision for the task.
   * @returns An immutable ExecutionReadiness result.
   */
  assess(
    report: ComplexityReport,
    evaluation: ExecutionBudgetEvaluation,
    decision: BudgetDecision
  ): ExecutionReadiness {
    const input: ReadinessInput = { report, evaluation, decision }

    const requirements: ExecutionRequirement[] = this.requirements.map((def) => {
      const satisfied = def.check(input)
      return {
        id: def.id,
        name: def.name,
        satisfied,
        explanation: def.explain(input, satisfied),
      }
    })

    const failedRequirements = requirements.filter((r) => !r.satisfied)
    const status =
      failedRequirements.length === 0
        ? ExecutionReadinessStatus.Ready
        : ExecutionReadinessStatus.NotReady

    const summary =
      status === ExecutionReadinessStatus.Ready
        ? `All ${requirements.length} execution requirement(s) satisfied. Ready to execute.`
        : `${failedRequirements.length} of ${requirements.length} execution requirement(s) not satisfied. Not ready to execute.`

    return {
      status,
      requirements,
      failedRequirements,
      summary,
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default readiness engine using the default requirements. Stateless and safe
 * to share.
 */
export const executionReadinessEngine = new ExecutionReadinessEngine()
