/**
 * Repository — Repository Classification Model
 *
 * Immutable model representing the deterministic classification of a
 * repository based on its structure and file names. Classification uses
 * only file names, directory names, extensions, and repository structure —
 * never file contents or code analysis.
 *
 * Milestone 9.1.2: repository classification model only.
 */

// ============================================================================
// PROJECT TYPE
// ============================================================================

/**
 * Deterministic project type classification.
 *
 * - WebApplication: Browser-based web application
 * - Library: Reusable library or package
 * - CLI: Command-line interface tool
 * - API: Backend API service
 * - Mobile: Mobile application
 * - Desktop: Desktop application
 * - Monorepo: Multi-package repository
 * - Unknown: Cannot be determined
 */
export type ProjectType =
  | 'WebApplication'
  | 'Library'
  | 'CLI'
  | 'API'
  | 'Mobile'
  | 'Desktop'
  | 'Monorepo'
  | 'Unknown'

// ============================================================================
// PRIMARY LANGUAGE
// ============================================================================

/**
 * Primary programming language detected from file extensions.
 */
export type PrimaryLanguage =
  | 'TypeScript'
  | 'JavaScript'
  | 'Python'
  | 'Java'
  | 'Go'
  | 'Rust'
  | 'CSharp'
  | 'Unknown'

// ============================================================================
// FRAMEWORK
// ============================================================================

/**
 * Framework detected from configuration files and structure.
 */
export type Framework =
  | 'Next.js'
  | 'React'
  | 'Vue'
  | 'Angular'
  | 'Express'
  | 'FastAPI'
  | 'Django'
  | 'None'

// ============================================================================
// PACKAGE MANAGER
// ============================================================================

/**
 * Package manager detected from lock files and configuration.
 */
export type PackageManager =
  | 'npm'
  | 'pnpm'
  | 'yarn'
  | 'bun'
  | 'pip'
  | 'cargo'
  | 'gradle'
  | 'unknown'

// ============================================================================
// REPOSITORY CLASSIFICATION
// ============================================================================

/**
 * The complete deterministic classification of a repository.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface RepositoryClassification {
  /** Stable identifier for this classification. */
  readonly classificationId: string

  /** Version of the classification engine. */
  readonly classificationVersion: string

  /** The inventory that was classified. */
  readonly inventoryId: string

  /** Deterministic project type. */
  readonly projectType: ProjectType

  /** Primary programming language. */
  readonly primaryLanguage: PrimaryLanguage

  /** Detected frameworks (may be empty). */
  readonly frameworks: readonly Framework[]

  /** Detected package managers (may be empty). */
  readonly packageManagers: readonly PackageManager[]

  /** Classification confidence (0.0–1.0). */
  readonly confidence: number

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
