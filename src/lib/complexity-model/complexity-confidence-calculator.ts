/**
 * Task Complexity Analyzer — Confidence Calculator
 *
 * Deterministic calculator that estimates how confident the system is in its
 * own complexity estimate, using ONLY information already present in the
 * ComplexityRequest.
 *
 * It does NOT inspect the repository, analyze source code, infer architecture,
 * estimate runtime or tokens, call AI, or call external services.
 *
 * Deductions are defined as centralized, declarative rules (see
 * CONFIDENCE_DEDUCTION_RULES). The calculator consumes those rules — it
 * contains no hardcoded deduction values. Every deduction carries an explicit
 * explanation, so the resulting confidence is fully auditable.
 *
 * Milestone 3A: confidence estimation only.
 */

import { ComplexityRequest } from './complexity-request'
import { ComplexityConfidence, ConfidenceLevel } from './complexity-confidence'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Starting confidence before any deductions. */
const BASELINE_CONFIDENCE = 100

/** Lowest possible confidence score. */
const MIN_CONFIDENCE = 0

// ============================================================================
// DEDUCTION RULES
// ============================================================================

/**
 * A single, explainable confidence deduction rule.
 *
 * Rules are declarative: `applies` inspects the request and returns true when
 * the deduction should fire. `points` is the number of confidence points
 * subtracted. `explanation`, `assumption`, and `missingInformation` describe
 * the deduction for auditability.
 */
export interface ConfidenceDeductionRule {
  /** Stable identifier for the rule. */
  readonly id: string

  /** Confidence points subtracted when the rule applies (positive number). */
  readonly points: number

  /** Human-readable explanation of why the deduction applies. */
  readonly explanation: string

  /** Assumption made because the information was missing (if any). */
  readonly assumption?: string

  /** Description of the missing information (if any). */
  readonly missingInformation?: string

  /** Returns true when this deduction applies to the given request. */
  readonly applies: (request: ComplexityRequest) => boolean
}

/**
 * Centralized confidence deduction rules.
 *
 * To tune confidence behavior, edit this list — the calculator consumes it and
 * contains no deduction values of its own (no magic numbers).
 */
export const CONFIDENCE_DEDUCTION_RULES: readonly ConfidenceDeductionRule[] = [
  {
    id: 'repository-not-indexed',
    points: 25,
    explanation: 'Repository not indexed: structural context is unavailable.',
    assumption: 'Assuming a typical repository structure.',
    missingInformation: 'Indexed repository structure.',
    applies: (request) => request.repositoryIndexed === false,
  },
  {
    id: 'missing-dependency-information',
    points: 15,
    explanation: 'Missing dependency information: dependency depth cannot be assessed.',
    assumption: 'Assuming an average dependency depth.',
    missingInformation: 'Known dependencies.',
    applies: (request) => request.knownDependencies === undefined,
  },
  {
    id: 'missing-estimated-file-count',
    points: 10,
    explanation: 'Missing estimated file count: the blast radius is unknown.',
    assumption: 'Assuming a small number of affected files.',
    missingInformation: 'Estimated affected file count.',
    applies: (request) => request.estimatedAffectedFiles === undefined,
  },
  {
    id: 'missing-factor-values',
    points: 10,
    explanation: 'Missing factor values: some complexity dimensions were not supplied.',
    assumption: 'Assuming low impact for unsupplied complexity dimensions.',
    missingInformation: 'Explicit factor values.',
    applies: (request) =>
      request.factorValues === undefined || Object.keys(request.factorValues).length === 0,
  },
  {
    id: 'missing-external-integration-information',
    points: 10,
    explanation: 'Missing external integration information: integration surface is unknown.',
    assumption: 'Assuming no external integrations.',
    missingInformation: 'External integrations.',
    applies: (request) => request.externalIntegrations === undefined,
  },
  {
    id: 'missing-notes',
    points: 5,
    explanation: 'Missing notes: less contextual information was provided.',
    missingInformation: 'Supplementary notes.',
    applies: (request) => request.notes === undefined || request.notes.trim().length === 0,
  },
]

// ============================================================================
// CONFIDENCE LEVEL THRESHOLDS
// ============================================================================

/**
 * Maps a numeric confidence score to a ConfidenceLevel.
 * Thresholds are centralized here (not hardcoded inline) for clarity.
 */
const CONFIDENCE_LEVEL_THRESHOLDS: readonly { min: number; level: ConfidenceLevel }[] = [
  { min: 90, level: ConfidenceLevel.VeryHigh },
  { min: 70, level: ConfidenceLevel.High },
  { min: 50, level: ConfidenceLevel.Medium },
  { min: 30, level: ConfidenceLevel.Low },
  { min: 0, level: ConfidenceLevel.VeryLow },
]

// ============================================================================
// CONFIDENCE CALCULATOR
// ============================================================================

export class ConfidenceCalculator {
  private readonly rules: readonly ConfidenceDeductionRule[]

  /**
   * @param rules - Deduction rules to apply. Defaults to
   *   CONFIDENCE_DEDUCTION_RULES. Injectable for testing and tuning.
   */
  constructor(rules: readonly ConfidenceDeductionRule[] = CONFIDENCE_DEDUCTION_RULES) {
    this.rules = rules
  }

  /**
   * Estimates confidence in a complexity estimate from the supplied request.
   *
   * @param request - The same request used for the complexity calculation.
   * @returns An immutable ComplexityConfidence result.
   */
  calculate(request: ComplexityRequest): ComplexityConfidence {
    let score = BASELINE_CONFIDENCE
    const explanations: string[] = [
      `Baseline confidence starts at ${BASELINE_CONFIDENCE}.`,
    ]
    const assumptions: string[] = []
    const missingInformation: string[] = []

    for (const rule of this.rules) {
      if (rule.applies(request)) {
        score -= rule.points
        explanations.push(`${rule.explanation} (-${rule.points})`)
        if (rule.assumption) assumptions.push(rule.assumption)
        if (rule.missingInformation) missingInformation.push(rule.missingInformation)
      }
    }

    score = Math.max(MIN_CONFIDENCE, score)
    explanations.push(`Final confidence: ${score}.`)

    return {
      score,
      level: this.mapScoreToLevel(score),
      explanations,
      assumptions,
      missingInformation,
    }
  }

  /**
   * Maps a numeric confidence score to a ConfidenceLevel using the
   * centralized thresholds.
   */
  private mapScoreToLevel(score: number): ConfidenceLevel {
    for (const threshold of CONFIDENCE_LEVEL_THRESHOLDS) {
      if (score >= threshold.min) return threshold.level
    }
    return ConfidenceLevel.VeryLow
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default confidence calculator using the default deduction rules.
 */
export const confidenceCalculator = new ConfidenceCalculator()
