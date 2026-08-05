/**
 * Repository — Repository Impact Analysis Engine
 *
 * Deterministic engine that analyzes the impact of changes to a repository
 * file using the existing RepositoryDependencyGraph. Determines direct and
 * transitive dependents without inspecting source code or performing
 * semantic analysis.
 *
 * The engine:
 * - uses deterministic graph traversal only — no AI, no semantic analysis.
 * - does NOT inspect source code.
 * - does NOT perform AST parsing.
 * - does NOT modify the repository.
 * - never throws.
 *
 * Milestone 9.2.2: repository impact analysis only.
 */

import {
  RepositoryDependencyGraph,
  RepositoryEdge,
} from './repository-dependency-graph'
import {
  RepositoryImpactAnalysis,
  RiskLevel,
} from './repository-impact-analysis'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in analysis metadata. */
const ENGINE_VERSION = 'repository-impact-analysis-engine@9.2.2'

/**
 * Risk level thresholds based on total affected file count.
 */
const RISK_THRESHOLDS = {
  Medium: 1,
  High: 6,
  Critical: 21,
} as const

// ============================================================================
// REPOSITORY IMPACT ANALYSIS ENGINE
// ============================================================================

/**
 * Deterministic engine for repository impact analysis.
 *
 * Analyzes the impact of changes to a target file by traversing the
 * dependency graph to find direct and transitive dependents. Never throws.
 * Never modifies the repository.
 */
export class RepositoryImpactAnalysisEngine {
  /**
   * Analyzes the impact of changes to the target file.
   *
   * @param graph - The RepositoryDependencyGraph to analyze.
   * @param targetPath - The repository-relative path of the target file.
   * @returns An immutable RepositoryImpactAnalysis.
   */
  analyze(
    graph: RepositoryDependencyGraph,
    targetPath: string
  ): RepositoryImpactAnalysis {
    // Build reverse dependency map (who depends on me)
    const reverseDeps = this.buildReverseDependencyMap(graph.edges)

    // Find direct dependents
    const directlyAffected = this.findDirectDependents(targetPath, reverseDeps)

    // Find all transitively affected files
    const { transitivelyAffected, maxDepth } = this.findTransitiveDependents(
      targetPath,
      reverseDeps
    )

    // Calculate total affected (direct + transitive, deduplicated)
    const allAffected = new Set([...directlyAffected, ...transitivelyAffected])
    const totalAffected = allAffected.size

    // Determine risk level
    const riskLevel = this.determineRiskLevel(totalAffected)

    return {
      analysisId: `impact-${this.hashString(targetPath)}`,
      analysisVersion: ENGINE_VERSION,
      graphId: graph.graphId,
      targetPath,
      directlyAffected,
      transitivelyAffected,
      dependencyDepth: maxDepth,
      riskLevel,
      metadata: {
        engineVersion: ENGINE_VERSION,
        graphId: graph.graphId,
        targetPath,
        analyzedAt: new Date().toISOString(),
        directCount: directlyAffected.length,
        transitiveCount: transitivelyAffected.length,
        totalAffected,
        maxDepth,
      },
    }
  }

  /**
   * Builds a reverse dependency map from edges.
   * Maps: target path → array of files that depend on it
   */
  private buildReverseDependencyMap(
    edges: readonly RepositoryEdge[]
  ): ReadonlyMap<string, readonly string[]> {
    const map = new Map<string, string[]>()

    for (const edge of edges) {
      const existing = map.get(edge.to) ?? []
      map.set(edge.to, [...existing, edge.from])
    }

    return map
  }

  /**
   * Finds files that directly depend on the target.
   */
  private findDirectDependents(
    targetPath: string,
    reverseDeps: ReadonlyMap<string, readonly string[]>
  ): readonly string[] {
    return reverseDeps.get(targetPath) ?? []
  }

  /**
   * Finds all transitively affected files using BFS traversal.
   * Returns the list of transitively affected files and maximum depth.
   */
  private findTransitiveDependents(
    targetPath: string,
    reverseDeps: ReadonlyMap<string, readonly string[]>
  ): { transitivelyAffected: readonly string[]; maxDepth: number } {
    const visited = new Set<string>()
    const result: string[] = []
    let maxDepth = 0

    // BFS queue: [path, depth]
    const queue: [string, number][] = [[targetPath, 0]]
    visited.add(targetPath)

    while (queue.length > 0) {
      const [currentPath, depth] = queue.shift()!

      if (depth > maxDepth) {
        maxDepth = depth
      }

      const dependents = reverseDeps.get(currentPath) ?? []

      for (const dependent of dependents) {
        if (!visited.has(dependent)) {
          visited.add(dependent)
          result.push(dependent)
          queue.push([dependent, depth + 1])
        }
      }
    }

    // Remove direct dependents from result (they're tracked separately)
    const directDeps = new Set(reverseDeps.get(targetPath) ?? [])
    const transitivelyAffected = result.filter((p) => !directDeps.has(p))

    return { transitivelyAffected, maxDepth }
  }

  /**
   * Determines the risk level based on total affected file count.
   */
  private determineRiskLevel(totalAffected: number): RiskLevel {
    if (totalAffected >= RISK_THRESHOLDS.Critical) {
      return 'Critical'
    }
    if (totalAffected >= RISK_THRESHOLDS.High) {
      return 'High'
    }
    if (totalAffected >= RISK_THRESHOLDS.Medium) {
      return 'Medium'
    }
    return 'Low'
  }

  /**
   * Generates a simple hash from a string for ID generation.
   */
  private hashString(input: string): string {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default impact analysis engine instance. Stateless and safe to share.
 */
export const repositoryImpactAnalysisEngine = new RepositoryImpactAnalysisEngine()
