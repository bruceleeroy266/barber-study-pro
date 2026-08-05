/**
 * Task Complexity Analyzer — Complexity Breakdown
 *
 * Represents the contribution of a single complexity factor to the total
 * score. Purely descriptive — it records what went into the calculation so the
 * result is transparent and auditable. No recommendation logic.
 *
 * Milestone 2: breakdown model only.
 */

import { ComplexityFactor } from './complexity-factors'

// ============================================================================
// FACTOR BREAKDOWN ENTRY
// ============================================================================

/**
 * The contribution of one factor to the overall complexity score.
 */
export interface ComplexityFactorBreakdown {
  /** The factor being measured. */
  factor: ComplexityFactor

  /**
   * The raw (unweighted) input value for this factor, on a 0–10 scale.
   */
  rawValue: number

  /**
   * The weight applied to this factor (from the weight configuration).
   */
  weight: number

  /**
   * The weighted contribution: rawValue × weight.
   */
  weightedValue: number

  /**
   * Human-readable explanation of how this factor was evaluated / where the
   * raw value came from.
   */
  explanation: string
}

// ============================================================================
// COMPLEXITY BREAKDOWN
// ============================================================================

/**
 * The full set of per-factor contributions, in stable factor order.
 */
export type ComplexityBreakdown = ComplexityFactorBreakdown[]
