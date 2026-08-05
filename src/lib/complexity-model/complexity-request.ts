/**
 * Task Complexity Analyzer — Complexity Request
 *
 * Input model for the ComplexityCalculator. Describes everything the
 * calculator is allowed to consider when estimating task complexity.
 *
 * The calculator works ONLY from this supplied request — it does not inspect
 * repositories, call external services, infer code structure, or estimate
 * tokens. All factor inputs must be provided here (directly or via the
 * convenience fields below).
 *
 * Milestone 2: input model only — no parsing logic.
 */

import { ComplexityFactor } from './complexity-factors'

// ============================================================================
// FACTOR RAW VALUES
// ============================================================================

/**
 * Raw (unweighted) input value for a single complexity factor, on a 0–10
 * scale, where 0 = no impact and 10 = maximum impact.
 *
 * Providing explicit factor values gives the caller full control over the
 * dimensions that cannot be derived from the convenience request fields.
 */
export type FactorRawValues = Partial<Record<ComplexityFactor, number>>

// ============================================================================
// COMPLEXITY REQUEST
// ============================================================================

/**
 * The information required to estimate a task's complexity.
 */
export interface ComplexityRequest {
  /** Free-form description of the task. Used for context/metadata only. */
  taskDescription: string

  /**
   * Estimated number of files the task will touch, if known.
   * Maps to the FilesAffected factor. Optional.
   */
  estimatedAffectedFiles?: number

  /**
   * Whether the repository has been indexed and is available to the caller.
   * Recorded for metadata/confidence purposes; the calculator does not itself
   * inspect the repository regardless of this flag.
   */
  repositoryIndexed: boolean

  /**
   * Known dependencies (module/package names) the task interacts with, if any.
   * Informs the DependencyDepth factor. Optional.
   */
  knownDependencies?: string[]

  /**
   * External systems or services the task interacts with, if any.
   * Informs the ExternalIntegrations factor. Optional.
   */
  externalIntegrations?: string[]

  /** Free-form notes for additional context. Metadata only. Optional. */
  notes?: string

  /**
   * Optional explicit raw values (0–10) for any complexity factor.
   *
   * Use these to supply dimensions that are not derivable from the convenience
   * fields above (e.g. ApiImpact, ArchitectureImpact, TestingEffort,
   * DocumentationEffort, Ambiguity, Refactoring, EstimatedExecutionTime), or to
   * override a derived value. Factors not supplied here or derivable from the
   * request default to 0.
   */
  factorValues?: FactorRawValues
}
