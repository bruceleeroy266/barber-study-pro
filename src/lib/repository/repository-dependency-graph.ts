/**
 * Repository — Repository Dependency Graph Model
 *
 * Immutable model representing the deterministic dependency graph of a
 * repository. Nodes represent files; edges represent dependency relationships
 * discovered through deterministic parsing of dependency statements.
 *
 * Milestone 9.2.1: repository dependency graph model only.
 */

import { RepositoryFileCategory } from './repository-inventory'

// ============================================================================
// DEPENDENCY RELATIONSHIP
// ============================================================================

/**
 * The type of dependency relationship between two files.
 *
 * - Import: File imports from another file
 * - Export: File exports to another file
 * - Include: File includes another file (C/C++ style)
 * - Reference: File references another file
 * - Unknown: Relationship type cannot be determined
 */
export type DependencyRelationship =
  | 'Import'
  | 'Export'
  | 'Include'
  | 'Reference'
  | 'Unknown'

// ============================================================================
// REPOSITORY NODE
// ============================================================================

/**
 * A single node in the dependency graph representing a file.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryNode {
  /** Stable identifier for this node. */
  readonly nodeId: string

  /** Relative path from repository root. */
  readonly path: string

  /** File category from inventory. */
  readonly category: RepositoryFileCategory
}

// ============================================================================
// REPOSITORY EDGE
// ============================================================================

/**
 * A single edge in the dependency graph representing a dependency.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryEdge {
  /** Source node path (the file that depends). */
  readonly from: string

  /** Target node path (the file being depended upon). */
  readonly to: string

  /** The type of dependency relationship. */
  readonly relationship: DependencyRelationship
}

// ============================================================================
// REPOSITORY DEPENDENCY GRAPH
// ============================================================================

/**
 * The complete deterministic dependency graph of a repository.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryDependencyGraph {
  /** Stable identifier for this graph. */
  readonly graphId: string

  /** Version of the graph engine. */
  readonly graphVersion: string

  /** The inventory that was graphed. */
  readonly inventoryId: string

  /** All nodes in the graph. */
  readonly nodes: readonly RepositoryNode[]

  /** All edges in the graph. */
  readonly edges: readonly RepositoryEdge[]

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
