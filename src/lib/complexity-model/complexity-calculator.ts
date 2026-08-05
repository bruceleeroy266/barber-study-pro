/**
 * Task Complexity Analyzer — Complexity Calculator
 *
 * Deterministic calculator that estimates task complexity from a supplied
 * ComplexityRequest. It reads the factor and level registries and the
 * configured weights, derives a raw value per factor, applies weights,
 * normalizes to a 0–100 score, maps the score to a ComplexityLevel, and
 * returns a transparent ComplexityReport.
 *
 * The calculator:
 * - works ONLY from the supplied request — it does not inspect repositories,
 *   call external services, infer code structure, or estimate tokens.
 * - is deterministic — the same request and weights always produce the same
 *   report (aside from the generatedAt timestamp).
 *
 * Milestone 2: calculation only — no risk analysis, budgeting, planning,
 * recommendations, or reporting beyond the ComplexityReport model.
 */

import { ComplexityFactor, getComplexityFactors } from './complexity-factors'
import { ComplexityLevel, getComplexityLevelsByRank } from './complexity-level'
import { ComplexityWeights, DEFAULT_COMPLEXITY_WEIGHTS } from './complexity-weights'
import { ComplexityRequest } from './complexity-request'
import { ComplexityFactorBreakdown, ComplexityBreakdown } from './complexity-breakdown'
import { ComplexityReport } from './complexity-report'
import { ConfidenceCalculator, confidenceCalculator } from './complexity-confidence-calculator'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Maximum raw value for any factor (inclusive). */
const MAX_RAW_VALUE = 10

/** Highest possible normalized score. */
const MAX_SCORE = 100

/** Identifier recorded in report metadata. */
const CALCULATOR_VERSION = 'complexity-calculator@2'

// ============================================================================
// COMPLEXITY CALCULATOR
// ============================================================================

export class ComplexityCalculator {
  private readonly weights: ComplexityWeights
  private readonly confidenceCalculator: ConfidenceCalculator

  /**
   * @param weights - Optional weight overrides. Defaults to
   *   DEFAULT_COMPLEXITY_WEIGHTS. Must provide a weight for every factor.
   * @param confidenceCalc - Optional confidence calculator. Defaults to the
   *   shared confidenceCalculator instance. Injected for testability/tuning.
   */
  constructor(
    weights: ComplexityWeights = DEFAULT_COMPLEXITY_WEIGHTS,
    confidenceCalc: ConfidenceCalculator = confidenceCalculator
  ) {
    this.weights = weights
    this.confidenceCalculator = confidenceCalc
  }

  /**
   * Calculates the complexity of a task from the supplied request.
   *
   * @param request - The input describing the task.
   * @returns A ComplexityReport with level, score, breakdown, and metadata.
   */
  calculate(request: ComplexityRequest): ComplexityReport {
    const breakdown = this.buildBreakdown(request)
    const totalScore = this.normalizeScore(breakdown)
    const level = this.mapScoreToLevel(totalScore)
    const confidence = this.confidenceCalculator.calculate(request)

    return {
      level,
      totalScore,
      breakdown,
      estimatedFileCount: request.estimatedAffectedFiles ?? 0,
      estimatedRuntime: request.factorValues?.[ComplexityFactor.EstimatedExecutionTime],
      confidence,
      metadata: {
        taskDescription: request.taskDescription,
        repositoryIndexed: request.repositoryIndexed,
        generatedAt: new Date().toISOString(),
        calculatorVersion: CALCULATOR_VERSION,
      },
    }
  }

  // --------------------------------------------------------------------------
  // BREAKDOWN
  // --------------------------------------------------------------------------

  /**
   * Builds the per-factor breakdown by deriving a raw value for each factor
   * and applying its configured weight.
   */
  private buildBreakdown(request: ComplexityRequest): ComplexityBreakdown {
    return getComplexityFactors().map((factorDef) => {
      const factor = factorDef.id
      const { rawValue, explanation } = this.deriveRawValue(factor, request)
      const weight = this.weights[factor]
      const weightedValue = rawValue * weight

      const entry: ComplexityFactorBreakdown = {
        factor,
        rawValue,
        weight,
        weightedValue,
        explanation,
      }
      return entry
    })
  }

  /**
   * Derives the raw (0–10) value for a single factor from the request.
   *
   * Explicit `factorValues` always win. Otherwise the value is derived from
   * the convenience request fields where possible, defaulting to 0.
   */
  private deriveRawValue(
    factor: ComplexityFactor,
    request: ComplexityRequest
  ): { rawValue: number; explanation: string } {
    // Explicit override takes precedence.
    const explicit = request.factorValues?.[factor]
    if (explicit !== undefined) {
      return {
        rawValue: this.clampRaw(explicit),
        explanation: `Supplied explicitly in the request (factorValues.${factor}).`,
      }
    }

    // Derive from convenience fields where applicable.
    switch (factor) {
      case ComplexityFactor.FilesAffected:
        return {
          rawValue: this.clampRaw(request.estimatedAffectedFiles ?? 0),
          explanation:
            request.estimatedAffectedFiles !== undefined
              ? `Derived from estimatedAffectedFiles (${request.estimatedAffectedFiles}).`
              : 'No estimatedAffectedFiles provided; defaulted to 0.',
        }

      case ComplexityFactor.DependencyDepth:
        return {
          rawValue: this.clampRaw(request.knownDependencies?.length ?? 0),
          explanation:
            request.knownDependencies !== undefined
              ? `Derived from ${request.knownDependencies.length} known dependencies.`
              : 'No knownDependencies provided; defaulted to 0.',
        }

      case ComplexityFactor.ExternalIntegrations:
        return {
          rawValue: this.clampRaw(request.externalIntegrations?.length ?? 0),
          explanation:
            request.externalIntegrations !== undefined
              ? `Derived from ${request.externalIntegrations.length} external integrations.`
              : 'No externalIntegrations provided; defaulted to 0.',
        }

      default:
        return {
          rawValue: 0,
          explanation: `No input supplied for ${factor}; defaulted to 0.`,
        }
    }
  }

  // --------------------------------------------------------------------------
  // SCORING
  // --------------------------------------------------------------------------

  /**
   * Normalizes the weighted sum of the breakdown to a 0–100 score.
   *
   * score = (Σ weightedValue / Σ (MAX_RAW_VALUE × weight)) × 100
   */
  private normalizeScore(breakdown: ComplexityBreakdown): number {
    const weightedSum = breakdown.reduce((sum, entry) => sum + entry.weightedValue, 0)
    const maxPossible = breakdown.reduce(
      (sum, entry) => sum + MAX_RAW_VALUE * entry.weight,
      0
    )

    if (maxPossible === 0) return 0

    const normalized = (weightedSum / maxPossible) * MAX_SCORE
    // Round to two decimals for a stable, readable score.
    return Math.round(normalized * 100) / 100
  }

  /**
   * Maps a normalized 0–100 score to a ComplexityLevel by dividing the range
   * evenly across the registered levels (ordered by rank).
   */
  private mapScoreToLevel(score: number): ComplexityLevel {
    const levels = getComplexityLevelsByRank() // ascending rank
    const clamped = Math.max(0, Math.min(MAX_SCORE, score))
    const bandSize = MAX_SCORE / levels.length
    const index = Math.min(Math.floor(clamped / bandSize), levels.length - 1)
    return levels[index].id
  }

  // --------------------------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------------------------

  /**
   * Clamps a raw factor value to the valid 0–MAX_RAW_VALUE range.
   */
  private clampRaw(value: number): number {
    return Math.max(0, Math.min(MAX_RAW_VALUE, value))
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default calculator instance using the default weights.
 * Prefer constructing a ComplexityCalculator with custom weights when tuning.
 */
export const complexityCalculator = new ComplexityCalculator()
