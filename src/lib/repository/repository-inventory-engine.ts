/**
 * Repository — Repository Inventory Engine
 *
 * Deterministic engine that inventories a repository's structure. Recursively
 * enumerates files and directories, recording paths, extensions, and sizes
 * without inspecting file contents or analyzing code.
 *
 * The engine:
 * - uses deterministic categorization only — no AI, no code parsing.
 * - does NOT inspect file contents.
 * - does NOT analyze dependencies.
 * - does NOT modify the repository.
 * - never throws.
 *
 * Milestone 9.1.1: repository inventory only.
 */

import * as fs from 'fs'
import * as path from 'path'
import {
  RepositoryDirectory,
  RepositoryFile,
  RepositoryFileCategory,
  RepositoryInventory,
} from './repository-inventory'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in inventory metadata. */
const ENGINE_VERSION = 'repository-inventory-engine@9.1.1'

/**
 * File extensions categorized as Source.
 */
const SOURCE_EXTENSIONS: ReadonlySet<string> = new Set([
  'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs',
  'py', 'java', 'c', 'cpp', 'h', 'hpp',
  'cs', 'go', 'rs', 'rb', 'php', 'swift',
  'kt', 'scala', 'clj', 'hs', 'ml', 'fs',
])

/**
 * File extensions categorized as Test.
 */
const TEST_EXTENSIONS: ReadonlySet<string> = new Set([
  'test.ts', 'test.tsx', 'test.js', 'test.jsx',
  'spec.ts', 'spec.tsx', 'spec.js', 'spec.jsx',
])

/**
 * File extensions categorized as Configuration.
 */
const CONFIG_EXTENSIONS: ReadonlySet<string> = new Set([
  'json', 'yaml', 'yml', 'toml', 'ini', 'env',
  'config', 'conf', 'properties', 'xml',
])

/**
 * File extensions categorized as Documentation.
 */
const DOC_EXTENSIONS: ReadonlySet<string> = new Set([
  'md', 'markdown', 'txt', 'rst', 'adoc', 'org',
])

/**
 * File extensions categorized as Asset.
 */
const ASSET_EXTENSIONS: ReadonlySet<string> = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico',
  'woff', 'woff2', 'ttf', 'otf', 'eot',
  'mp4', 'webm', 'mp3', 'wav', 'ogg',
  'pdf', 'zip', 'tar', 'gz',
])

/**
 * Directories to skip during inventory.
 */
const SKIP_DIRECTORIES: ReadonlySet<string> = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'out',
  'coverage',
  '.nyc_output',
  '.cache',
  '.turbo',
  '.vercel',
  '.vscode',
  '.idea',
])

// ============================================================================
// REPOSITORY INVENTORY ENGINE
// ============================================================================

/**
 * Deterministic engine for repository structure inventory.
 *
 * Recursively enumerates the repository, categorizes files deterministically,
 * and returns an immutable RepositoryInventory. Never throws. Never modifies
 * the repository.
 */
export class RepositoryInventoryEngine {
  /**
   * Inventories the repository at the given root path.
   *
   * @param repositoryRoot - Absolute path to the repository root.
   * @returns An immutable RepositoryInventory.
   */
  inventory(repositoryRoot: string): RepositoryInventory {
    const files: RepositoryFile[] = []
    const directories: RepositoryDirectory[] = []

    this.walkDirectory(repositoryRoot, repositoryRoot, 0, files, directories)

    return {
      inventoryId: `inventory-${this.hashPath(repositoryRoot)}`,
      inventoryVersion: ENGINE_VERSION,
      repositoryRoot,
      totalFiles: files.length,
      totalDirectories: directories.length,
      files,
      directories,
      metadata: {
        engineVersion: ENGINE_VERSION,
        repositoryRoot,
        inventoriedAt: new Date().toISOString(),
        totalFiles: files.length,
        totalDirectories: directories.length,
      },
    }
  }

  /**
   * Recursively walks a directory and records files and subdirectories.
   *
   * @param currentPath - Current absolute path being walked.
   * @param rootPath - Repository root path for relative path calculation.
   * @param depth - Current depth level.
   * @param files - Accumulator for files.
   * @param directories - Accumulator for directories.
   */
  private walkDirectory(
    currentPath: string,
    rootPath: string,
    depth: number,
    files: RepositoryFile[],
    directories: RepositoryDirectory[]
  ): void {
    let entries: fs.Dirent[]

    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true })
    } catch {
      // Skip directories that cannot be read
      return
    }

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name)
      const relativePath = path.relative(rootPath, fullPath)

      if (entry.isDirectory()) {
        // Skip excluded directories
        if (SKIP_DIRECTORIES.has(entry.name)) {
          continue
        }

        directories.push({
          path: relativePath,
          depth,
        })

        this.walkDirectory(fullPath, rootPath, depth + 1, files, directories)
      } else if (entry.isFile()) {
        const extension = this.getExtension(entry.name)
        const size = this.getFileSize(fullPath)
        const category = this.categorizeFile(relativePath, extension)

        files.push({
          path: relativePath,
          extension,
          size,
          category,
        })
      }
    }
  }

  /**
   * Extracts the extension from a filename.
   *
   * @param filename - The filename.
   * @returns The extension without dot, lowercase, or empty string.
   */
  private getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.')
    if (lastDot === -1 || lastDot === 0) {
      return ''
    }
    return filename.slice(lastDot + 1).toLowerCase()
  }

  /**
   * Gets the size of a file in bytes.
   *
   * @param filePath - Absolute path to the file.
   * @returns File size in bytes, or 0 if unreadable.
   */
  private getFileSize(filePath: string): number {
    try {
      const stats = fs.statSync(filePath)
      return stats.size
    } catch {
      return 0
    }
  }

  /**
   * Deterministically categorizes a file based on its path and extension.
   *
   * @param relativePath - Relative path from repository root.
   * @param extension - File extension (lowercase, no dot).
   * @returns The deterministic category.
   */
  private categorizeFile(relativePath: string, extension: string): RepositoryFileCategory {
    const lowerPath = relativePath.toLowerCase()

    // Check for test files by path patterns
    if (
      lowerPath.includes('__tests__') ||
      lowerPath.includes('.test.') ||
      lowerPath.includes('.spec.') ||
      lowerPath.startsWith('test/') ||
      lowerPath.startsWith('tests/')
    ) {
      return 'Test'
    }

    // Check by extension
    if (TEST_EXTENSIONS.has(extension)) {
      return 'Test'
    }

    if (SOURCE_EXTENSIONS.has(extension)) {
      return 'Source'
    }

    if (CONFIG_EXTENSIONS.has(extension)) {
      return 'Configuration'
    }

    if (DOC_EXTENSIONS.has(extension)) {
      return 'Documentation'
    }

    if (ASSET_EXTENSIONS.has(extension)) {
      return 'Asset'
    }

    return 'Other'
  }

  /**
   * Generates a simple hash from a path for inventory ID generation.
   *
   * @param inputPath - The path to hash.
   * @returns A short hash string.
   */
  private hashPath(inputPath: string): string {
    let hash = 0
    for (let i = 0; i < inputPath.length; i++) {
      const char = inputPath.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default inventory engine instance. Stateless and safe to share.
 */
export const repositoryInventoryEngine = new RepositoryInventoryEngine()
