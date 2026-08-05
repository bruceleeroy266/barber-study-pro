/**
 * Task Planner — Decomposition Readiness Engine
 *
 * Deterministic engine that evaluates whether a task exceeds the limits of
 * a single deterministic execution plan. It assesses an ExecutionAssessment
 * against configurable thresholds and produces a DecompositionReadiness result.
 *
 * The engine:
 * - evaluates only existing assessment information — no repository inspection,
 *   no AI, no code analysis.
 * - is deterministic — the same assessment and thresholds always produce the
 *   same readiness result.
 * - does NOT perform decomposition, create phases, or split steps.
 *
 * Milestone 1.4.1: readiness assessment only.
 */

import { ExecutionAssessment } from '../execution-budget/execution-assessment'
import { BudgetDecisionType } from '../execution-budget/budget-decision'
import {
  DecompositionReadiness,
  DecompositionReadinessStatus,
  DecompositionReason,
} from './decomposition-readiness'

// ============================================================================
// THRESHOLD CONFIGURATION
// ============================================================================

/**
 * Configurable thresholds for decomposition readiness evaluation.
 */
export interface DecompositionThresholds {
  /** Maximum estimated files before decomposition is recommended/required. */
  readonly maximumFiles: number

  /** Maximum estimated runtime (minutes) before decomposition is recommended/required. */
  readonly maximumRuntimeMinutes: number

  /** Maximum complexity score before decomposition is recommended/required. */
  readonly maximumComplexityScore: number
}

/**
 * Default thresholds. Aligned with DEFAULT_EXECUTION_BUDGET limits.
 */
export const DEFAULT_DECOMPOSITION_THRESHOLDS: DecompositionThresholds = {
  maximumFiles: 8,
  maximumRuntimeMinutes: 10,
  maximumComplexityScore: 60,
}

// ============================================================================
// DECOMPOSITION READINESS ENGINE
// ============================================================================

export class DecompositionReadinessEngine {
  private readonly thresholds: DecompositionThresholds

  /**
   * @param thresholds - The thresholds to evaluate against. Defaults to
   *   DEFAULT_DECOMPOSITION_THRESHOLDS. Injected for testability/tuning.
   */
  constructor(thresholds: DecompositionThresholds = DEFAULT_DECOMPOSITION_THRESHOLDS) {
    this.thresholds = thresholds
  }

  /**
   * Assesses decomposition readiness from the supplied assessment.
   *
   * @param assessment - The execution assessment to evaluate.
   * @returns An immutable DecompositionReadiness result.
   */
  assess(assessment: ExecutionAssessment): DecompositionReadiness {
    const reasons: DecompositionReason[] = []
    const thresholdsEvaluated: string[] = []

    // Rule 1: Estimated file count
    thresholdsEvaluated.push('maximumFiles')
    const fileCount = assessment.complexityReport.estimatedFileCount
    if (fileCount > this.thresholds.maximumFiles) {
      reasons.push({
        id: 'file-count-exceeded',
        explanation:
          `Estimated file count (${fileCount}) exceeds the decomposition ` +
          `threshold (${this.thresholds.maximumFiles}).`,
        threshold: this.thresholds.maximumFiles,
        actualValue: fileCount,
      })
    }

    // Rule 2: Estimated runtime
    thresholdsEvaluated.push('maximumRuntimeMinutes')
    const runtime = assessment.complexityReport.estimatedRuntime
    if (runtime !== undefined && runtime > this.thresholds.maximumRuntimeMinutes) {
      reasons.push({
        id: 'runtime-exceeded',
        explanation:
          `Estimated runtime (${runtime} min) exceeds the decomposition ` +
          `threshold (${this.thresholds.maximumRuntimeMinutes} min).`,
        threshold: this.thresholds.maximumRuntimeMinutes,
        actualValue: runtime,
      })
    }

    // Rule 3: Complexity score
    thresholdsEvaluated.push('maximumComplexityScore')
    const complexity = assessment.complexityReport.totalScore
    if (complexity > this.thresholds.maximumComplexityScore) {
      reasons.push({
        id: 'complexity-exceeded',
        explanation:
          `Complexity score (${complexity}) exceeds the decomposition ` +
          `threshold (${this.thresholds.maximumComplexityScore}).`,
        threshold: this.thresholds.maximumComplexityScore,
        actualValue: complexity,
      })
    }

    // Rule 4: Budget decision requires splitting
    thresholdsEvaluated.push('budgetDecisionRequiresSplitting')
    if (assessment.budgetDecision.decision === BudgetDecisionType.RequiresSplitting) {
      reasons.push({
        id: 'budget-requires-splitting',
        explanation:
          'Budget decision indicates the task requires splitting to fit ' +
          'within execution limits.',
        threshold: 1,
        actualValue: 1,
      })
    }

    // Determine status
    const status = this.determineStatus(reasons)

    return {
      status,
      reasons,
      thresholdsEvaluated,
      metadata: {
        engineVersion: 'decomposition-readiness-engine@1.4.1',
      },
    }
  }

  /**
   * Determines the overall readiness status from the matched reasons.
   */
  private determineStatus(reasons: readonly DecompositionReason[]): DecompositionReadinessStatus {
    if (reasons.length === 0) {
      return DecompositionReadinessStatus.NotRequired
    }

    // Any single threshold exceeded → decomposition is required
    if (reasons.length >= 1) {
      return DecompositionReadinessStatus.Required
    }

    return DecompositionReadinessStatus.NotRequired
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default readiness engine using default thresholds. Stateless and safe to share.
 */
export const decompositionReadinessEngine = new DecompositionReadinessEngine()
