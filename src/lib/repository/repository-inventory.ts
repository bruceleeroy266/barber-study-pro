/**
 * Repository — Repository Inventory Model
 *
 * Immutable model representing the deterministic inventory of a repository's
 * structure. Records files, directories, extensions, and sizes without
 * inspecting file contents or analyzing code.
 *
 * Milestone 9.1.1: repository inventory model only.
 */

// ============================================================================
// REPOSITORY FILE CATEGORY
// ============================================================================

/**
 * Deterministic category for a repository file based on its path and extension.
 *
 * - Source: Source code files (TypeScript, JavaScript, etc.)
 * - Test: Test files (spec, test, __tests__, etc.)
 * - Configuration: Configuration files (JSON, YAML, env, etc.)
 * - Documentation: Documentation files (Markdown, text, etc.)
 * - Asset: Static assets (images, fonts, etc.)
 * - Other: Everything else
 */
export type RepositoryFileCategory =
  | 'Source'
  | 'Test'
  | 'Configuration'
  | 'Documentation'
  | 'Asset'
  | 'Other'

// ============================================================================
// REPOSITORY FILE
// ============================================================================

/**
 * A single file in the repository inventory.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryFile {
  /** Relative path from repository root. */
  readonly path: string

  /** File extension (without dot, lowercase). */
  readonly extension: string

  /** File size in bytes. */
  readonly size: number

  /** Deterministic file category. */
  readonly category: RepositoryFileCategory
}

// ============================================================================
// REPOSITORY DIRECTORY
// ============================================================================

/**
 * A single directory in the repository inventory.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryDirectory {
  /** Relative path from repository root. */
  readonly path: string

  /** Depth level (0 = root). */
  readonly depth: number
}

// ============================================================================
// REPOSITORY INVENTORY
// ============================================================================

/**
 * The complete deterministic inventory of a repository.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryInventory {
  /** Stable identifier for this inventory. */
  readonly inventoryId: string

  /** Version of the inventory engine. */
  readonly inventoryVersion: string

  /** Absolute path to the repository root. */
  readonly repositoryRoot: string

  /** Total number of files. */
  readonly totalFiles: number

  /** Total number of directories. */
  readonly totalDirectories: number

  /** All files in the repository. */
  readonly files: readonly RepositoryFile[]

  /** All directories in the repository. */
  readonly directories: readonly RepositoryDirectory[]

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
