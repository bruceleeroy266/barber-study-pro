/**
 * Repository — Repository Impact Analysis Model
 *
 * Immutable model representing the deterministic impact analysis of a change
 * to a repository file. Analyzes which files are affected using the existing
 * RepositoryDependencyGraph without inspecting source code or performing
 * semantic analysis.
 *
 * Milestone 9.2.2: repository impact analysis model only.
 */

// ============================================================================
// RISK LEVEL
// ============================================================================

/**
 * Deterministic risk level based on the number of affected files.
 *
 * - Low: 0 affected files
 * - Medium: 1–5 affected files
 * - High: 6–20 affected files
 * - Critical: 21+ affected files
 */
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'

// ============================================================================
// REPOSITORY IMPACT ANALYSIS
// ============================================================================

/**
 * The complete deterministic impact analysis for a target file.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryImpactAnalysis {
  /** Stable identifier for this analysis. */
  readonly analysisId: string

  /** Version of the impact analysis engine. */
  readonly analysisVersion: string

  /** The dependency graph that was analyzed. */
  readonly graphId: string

  /** The target file path being analyzed. */
  readonly targetPath: string

  /** Files directly affected by changes to the target. */
  readonly directlyAffected: readonly string[]

  /** Files transitively affected by changes to the target. */
  readonly transitivelyAffected: readonly string[]

  /** Maximum dependency depth from the target. */
  readonly dependencyDepth: number

  /** Deterministic risk level. */
  readonly riskLevel: RiskLevel

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
