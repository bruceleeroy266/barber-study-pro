/**
 * Task Complexity Analyzer — Complexity Report
 *
 * The complete result of a complexity calculation. Contains the derived
 * complexity level, the normalized total score, a transparent per-factor
 * breakdown, and estimation metadata.
 *
 * Deliberately excludes recommendations, risk analysis, and execution
 * strategy — those belong to later milestones.
 *
 * Milestone 2: report model only.
 */

import { ComplexityLevel } from './complexity-level'
import { ComplexityBreakdown } from './complexity-breakdown'
import { ComplexityConfidence } from './complexity-confidence'

// ============================================================================
// REPORT METADATA
// ============================================================================

/**
 * Context about how the report was produced.
 */
export interface ComplexityReportMetadata {
  /** The task description from the request. */
  taskDescription: string

  /** Whether the repository was reported as indexed by the caller. */
  repositoryIndexed: boolean

  /** ISO 8601 timestamp of when the report was generated. */
  generatedAt: string

  /** Identifier of the calculator/configuration that produced the report. */
  calculatorVersion: string
}

// ============================================================================
// COMPLEXITY REPORT
// ============================================================================

/**
 * The full result of estimating a task's complexity.
 */
export interface ComplexityReport {
  /** The derived qualitative complexity level. */
  level: ComplexityLevel

  /**
   * Normalized total complexity score, 0–100.
   * Higher = more complex.
   */
  totalScore: number

  /** Per-factor contributions that produced the total score. */
  breakdown: ComplexityBreakdown

  /**
   * Estimated number of files the task will touch.
   * Derived from the request (or 0 if not provided).
   */
  estimatedFileCount: number

  /**
   * Estimated runtime/effort for the task, if derivable from the request.
   * Optional — undefined when the request supplies no execution-time input.
   */
  estimatedRuntime?: number

  /**
   * Confidence in this complexity estimate, derived deterministically from
   * the information present in the request.
   */
  confidence: ComplexityConfidence

  /** Provenance and context for this report. */
  metadata: ComplexityReportMetadata
}
