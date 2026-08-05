/**
 * Task Complexity Analyzer — Complexity Confidence Model
 *
 * Strongly typed model representing how confident the system is in its own
 * complexity estimate. Confidence is derived deterministically from the
 * information present in the ComplexityRequest — it is NOT a measure of
 * engineering risk, not AI inference, and not a recommendation.
 *
 * The model is immutable: all fields are readonly and the lists are readonly
 * arrays, so a produced confidence result cannot be mutated in place.
 *
 * Milestone 3A: confidence model only.
 */

// ============================================================================
// CONFIDENCE LEVEL
// ============================================================================

/**
 * Qualitative confidence level, ordered from least to most confident.
 */
export enum ConfidenceLevel {
  VeryLow = 'very_low',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  VeryHigh = 'very_high',
}

// ============================================================================
// COMPLEXITY CONFIDENCE
// ============================================================================

/**
 * The result of estimating confidence in a complexity calculation.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ComplexityConfidence {
  /** Numeric confidence score, 0–100. Higher = more confident. */
  readonly score: number

  /** Qualitative confidence level derived from the score. */
  readonly level: ConfidenceLevel

  /**
   * Human-readable explanations describing how the score was derived
   * (one entry per applied deduction, plus a baseline entry).
   */
  readonly explanations: readonly string[]

  /**
   * Assumptions the calculator made because information was missing.
   */
  readonly assumptions: readonly string[]

  /**
   * Information that was absent from the request and reduced confidence.
   */
  readonly missingInformation: readonly string[]
}
