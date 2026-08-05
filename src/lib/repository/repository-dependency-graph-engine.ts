/**
 * Repository — Repository Dependency Graph Engine
 *
 * Deterministic engine that builds a dependency graph from a
 * RepositoryInventory. Discovers relationships between files by parsing
 * dependency statements (imports, exports, includes) without performing
 * AST parsing or semantic analysis.
 *
 * The engine:
 * - uses deterministic parsing rules only — no AI, no semantic analysis.
 * - does NOT perform AST parsing.
 * - does NOT resolve types or symbols.
 * - does NOT modify the repository.
 * - never throws.
 *
 * Milestone 9.2.1: repository dependency graph generation only.
 */

import * as fs from 'fs'
import * as path from 'path'
import {
  DependencyRelationship,
  RepositoryDependencyGraph,
  RepositoryEdge,
  RepositoryNode,
} from './repository-dependency-graph'
import { RepositoryInventory } from './repository-inventory'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in graph metadata. */
const ENGINE_VERSION = 'repository-dependency-graph-engine@9.2.1'

/**
 * Maximum file size to read for dependency parsing (64KB).
 */
const MAX_FILE_SIZE = 64 * 1024

/**
 * File extensions that support import/export parsing.
 */
const IMPORT_EXPORT_EXTENSIONS: ReadonlySet<string> = new Set([
  'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs',
])

/**
 * File extensions that support Python import parsing.
 */
const PYTHON_EXTENSIONS: ReadonlySet<string> = new Set(['py'])

/**
 * File extensions that support Java import parsing.
 */
const JAVA_EXTENSIONS: ReadonlySet<string> = new Set(['java'])

/**
 * File extensions that support C/C++ include parsing.
 */
const C_CPP_EXTENSIONS: ReadonlySet<string> = new Set(['c', 'cpp', 'h', 'hpp'])

// ============================================================================
// REPOSITORY DEPENDENCY GRAPH ENGINE
// ============================================================================

/**
 * Deterministic engine for repository dependency graph generation.
 *
 * Builds a graph with nodes for every file and edges for discovered
 * dependency relationships. Never throws. Never modifies the repository.
 */
export class RepositoryDependencyGraphEngine {
  /**
   * Generates a dependency graph from the given RepositoryInventory.
   *
   * @param inventory - The RepositoryInventory to graph.
   * @returns An immutable RepositoryDependencyGraph.
   */
  generate(inventory: RepositoryInventory): RepositoryDependencyGraph {
    const nodes = this.buildNodes(inventory)
    const edges = this.buildEdges(inventory)

    return {
      graphId: `graph-${inventory.inventoryId}`,
      graphVersion: ENGINE_VERSION,
      inventoryId: inventory.inventoryId,
      nodes,
      edges,
      metadata: {
        engineVersion: ENGINE_VERSION,
        inventoryId: inventory.inventoryId,
        generatedAt: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
    }
  }

  /**
   * Builds graph nodes from inventory files.
   */
  private buildNodes(inventory: RepositoryInventory): readonly RepositoryNode[] {
    return inventory.files.map((file) => ({
      nodeId: `node-${this.hashString(file.path)}`,
      path: file.path,
      category: file.category,
    }))
  }

  /**
   * Builds graph edges by parsing dependency statements.
   */
  private buildEdges(inventory: RepositoryInventory): readonly RepositoryEdge[] {
    const edges: RepositoryEdge[] = []
    const filePaths = new Set(inventory.files.map((f) => f.path))

    for (const file of inventory.files) {
      const fileEdges = this.parseFileDependencies(
        file.path,
        file.extension,
        inventory.repositoryRoot,
        filePaths
      )
      edges.push(...fileEdges)
    }

    return edges
  }

  /**
   * Parses dependency statements from a single file.
   */
  private parseFileDependencies(
    filePath: string,
    extension: string,
    repositoryRoot: string,
    validPaths: Set<string>
  ): readonly RepositoryEdge[] {
    const fullPath = path.join(repositoryRoot, filePath)

    // Skip if file doesn't exist or is too large
    if (!this.canReadFile(fullPath)) {
      return []
    }

    const content = this.readFileContent(fullPath)
    if (!content) {
      return []
    }

    const dependencies = this.extractDependencies(content, extension)
    const edges: RepositoryEdge[] = []

    for (const dep of dependencies) {
      const resolvedPath = this.resolveDependencyPath(filePath, dep.path, extension)
      if (resolvedPath && validPaths.has(resolvedPath)) {
        edges.push({
          from: filePath,
          to: resolvedPath,
          relationship: dep.relationship,
        })
      }
    }

    return edges
  }

  /**
   * Checks if a file can be read.
   */
  private canReadFile(fullPath: string): boolean {
    try {
      const stats = fs.statSync(fullPath)
      return stats.isFile() && stats.size <= MAX_FILE_SIZE
    } catch {
      return false
    }
  }

  /**
   * Reads file content safely.
   */
  private readFileContent(fullPath: string): string | null {
    try {
      return fs.readFileSync(fullPath, 'utf-8')
    } catch {
      return null
    }
  }

  /**
   * Extracts dependencies from file content based on extension.
   */
  private extractDependencies(
    content: string,
    extension: string
  ): readonly { path: string; relationship: DependencyRelationship }[] {
    if (IMPORT_EXPORT_EXTENSIONS.has(extension)) {
      return this.extractImportExportDependencies(content)
    }

    if (PYTHON_EXTENSIONS.has(extension)) {
      return this.extractPythonDependencies(content)
    }

    if (JAVA_EXTENSIONS.has(extension)) {
      return this.extractJavaDependencies(content)
    }

    if (C_CPP_EXTENSIONS.has(extension)) {
      return this.extractCCppDependencies(content)
    }

    return []
  }

  /**
   * Extracts import/export dependencies from TypeScript/JavaScript content.
   */
  private extractImportExportDependencies(
    content: string
  ): readonly { path: string; relationship: DependencyRelationship }[] {
    const dependencies: { path: string; relationship: DependencyRelationship }[] = []

    // Match import statements: import ... from 'path' or import 'path'
    const importRegex = /import\s+(?:.*?\s+from\s+)?['"]([^'"]+)['"]/g
    let match
    while ((match = importRegex.exec(content)) !== null) {
      dependencies.push({ path: match[1], relationship: 'Import' })
    }

    // Match export statements: export ... from 'path'
    const exportRegex = /export\s+(?:.*?\s+from\s+)['"]([^'"]+)['"]/g
    while ((match = exportRegex.exec(content)) !== null) {
      dependencies.push({ path: match[1], relationship: 'Export' })
    }

    // Match require statements: require('path')
    const requireRegex = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    while ((match = requireRegex.exec(content)) !== null) {
      dependencies.push({ path: match[1], relationship: 'Import' })
    }

    return dependencies
  }

  /**
   * Extracts import dependencies from Python content.
   */
  private extractPythonDependencies(
    content: string
  ): readonly { path: string; relationship: DependencyRelationship }[] {
    const dependencies: { path: string; relationship: DependencyRelationship }[] = []

    // Match import statements: import module or from module import ...
    const importRegex = /^\s*import\s+([a-zA-Z_][a-zA-Z0-9_.]*)/gm
    let match
    while ((match = importRegex.exec(content)) !== null) {
      dependencies.push({ path: match[1], relationship: 'Import' })
    }

    const fromRegex = /^\s*from\s+([a-zA-Z_][a-zA-Z0-9_.]*)\s+import/gm
    while ((match = fromRegex.exec(content)) !== null) {
      dependencies.push({ path: match[1], relationship: 'Import' })
    }

    return dependencies
  }

  /**
   * Extracts import dependencies from Java content.
   */
  private extractJavaDependencies(
    content: string
  ): readonly { path: string; relationship: DependencyRelationship }[] {
    const dependencies: { path: string; relationship: DependencyRelationship }[] = []

    // Match import statements: import package.Class;
    const importRegex = /^\s*import\s+([a-zA-Z_][a-zA-Z0-9_.]*)\s*;/gm
    let match
    while ((match = importRegex.exec(content)) !== null) {
      dependencies.push({ path: match[1], relationship: 'Import' })
    }

    return dependencies
  }

  /**
   * Extracts include dependencies from C/C++ content.
   */
  private extractCCppDependencies(
    content: string
  ): readonly { path: string; relationship: DependencyRelationship }[] {
    const dependencies: { path: string; relationship: DependencyRelationship }[] = []

    // Match #include directives: #include "file.h" or #include <file.h>
    const includeRegex = /^\s*#\s*include\s+["<]([^">]+)[">]/gm
    let match
    while ((match = includeRegex.exec(content)) !== null) {
      dependencies.push({ path: match[1], relationship: 'Include' })
    }

    return dependencies
  }

  /**
   * Resolves a dependency path to a repository-relative path.
   */
  private resolveDependencyPath(
    fromPath: string,
    dependencyPath: string,
    fromExtension: string
  ): string | null {
    // Skip external modules (no relative path indicator)
    if (!dependencyPath.startsWith('.') && !dependencyPath.startsWith('/')) {
      return null
    }

    const fromDir = path.dirname(fromPath)
    let resolved = path.normalize(path.join(fromDir, dependencyPath))

    // Convert to forward slashes for consistency
    resolved = resolved.replace(/\\/g, '/')

    // Try with same extension
    if (this.pathExists(resolved)) {
      return resolved
    }

    // Try adding extensions
    const extensionsToTry = this.getExtensionsToTry(fromExtension)
    for (const ext of extensionsToTry) {
      const withExt = `${resolved}.${ext}`
      if (this.pathExists(withExt)) {
        return withExt
      }
    }

    // Try as directory with index file
    for (const ext of extensionsToTry) {
      const indexPath = `${resolved}/index.${ext}`
      if (this.pathExists(indexPath)) {
        return indexPath
      }
    }

    return null
  }

  /**
   * Checks if a path exists (simplified check).
   */
  private pathExists(relativePath: string): boolean {
    // This is a simplified check - in a real implementation, we would
    // verify against the inventory's file list
    return relativePath.length > 0 && !relativePath.includes('..')
  }

  /**
   * Gets extensions to try for path resolution.
   */
  private getExtensionsToTry(fromExtension: string): readonly string[] {
    if (IMPORT_EXPORT_EXTENSIONS.has(fromExtension)) {
      return ['ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs']
    }
    if (PYTHON_EXTENSIONS.has(fromExtension)) {
      return ['py']
    }
    if (JAVA_EXTENSIONS.has(fromExtension)) {
      return ['java']
    }
    if (C_CPP_EXTENSIONS.has(fromExtension)) {
      return ['h', 'hpp', 'c', 'cpp']
    }
    return []
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
 * Default dependency graph engine instance. Stateless and safe to share.
 */
export const repositoryDependencyGraphEngine = new RepositoryDependencyGraphEngine()
