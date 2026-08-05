/**
 * Repository — Repository Change Plan Model
 *
 * Immutable model representing the deterministic change plan for a repository
 * modification. Generated from a RepositoryImpactAnalysis without inspecting
 * source code or performing semantic analysis.
 *
 * Milestone 9.3.1: repository change plan model only.
 */

import { RiskLevel } from './repository-impact-analysis'

// ============================================================================
// REPOSITORY CHANGE PHASE
// ============================================================================

/**
 * A single phase in the change plan.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryChangePhase {
  /** Stable identifier for this phase. */
  readonly phaseId: string

  /** Execution order (1-based). */
  readonly order: number

  /** Human-readable phase name. */
  readonly name: string

  /** Target files for this phase. */
  readonly targets: readonly string[]
}

// ============================================================================
// REPOSITORY CHANGE PLAN
// ============================================================================

/**
 * The complete deterministic change plan for a repository modification.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryChangePlan {
  /** Stable identifier for this plan. */
  readonly planId: string

  /** Version of the change planner. */
  readonly planVersion: string

  /** The impact analysis that was planned for. */
  readonly analysisId: string

  /** The target file path being changed. */
  readonly targetPath: string

  /** Ordered phases of the change plan. */
  readonly phases: readonly RepositoryChangePhase[]

  /** Total estimated steps (sum of all phase targets). */
  readonly estimatedSteps: number

  /** Risk level carried forward from the analysis. */
  readonly riskLevel: RiskLevel

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
