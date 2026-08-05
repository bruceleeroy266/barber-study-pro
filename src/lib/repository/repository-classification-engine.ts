/**
 * Repository — Repository Classification Engine
 *
 * Deterministic engine that classifies a repository based on its
 * RepositoryInventory. Classification uses only file names, directory names,
 * extensions, and repository structure — never file contents or code analysis.
 *
 * The engine:
 * - uses deterministic rules only — no AI, no code parsing.
 * - does NOT inspect file contents.
 * - does NOT analyze imports or dependencies.
 * - does NOT modify the repository.
 * - never throws.
 *
 * Milestone 9.1.2: repository classification only.
 */

import {
  Framework,
  PackageManager,
  PrimaryLanguage,
  ProjectType,
  RepositoryClassification,
} from './repository-classification'
import { RepositoryInventory } from './repository-inventory'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in classification metadata. */
const ENGINE_VERSION = 'repository-classification-engine@9.1.2'

/**
 * File name patterns that indicate specific frameworks.
 */
const FRAMEWORK_INDICATORS: Readonly<Record<string, Framework>> = {
  'next.config': 'Next.js',
  'nuxt.config': 'Vue',
  'angular.json': 'Angular',
  'vue.config': 'Vue',
  'svelte.config': 'None', // Svelte not in spec, maps to None
  'express': 'Express',
  'fastapi': 'FastAPI',
  'django': 'Django',
  'manage.py': 'Django',
}

/**
 * File name patterns that indicate specific package managers.
 */
const PACKAGE_MANAGER_INDICATORS: Readonly<Record<string, PackageManager>> = {
  'package-lock.json': 'npm',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'bun.lockb': 'bun',
  'requirements.txt': 'pip',
  'Pipfile': 'pip',
  'pyproject.toml': 'pip',
  'Cargo.toml': 'cargo',
  'build.gradle': 'gradle',
  'pom.xml': 'gradle', // Maven maps to gradle per spec examples
}

/**
 * File extensions mapped to primary languages.
 */
const LANGUAGE_EXTENSIONS: Readonly<Record<string, PrimaryLanguage>> = {
  ts: 'TypeScript',
  tsx: 'TypeScript',
  js: 'JavaScript',
  jsx: 'JavaScript',
  mjs: 'JavaScript',
  cjs: 'JavaScript',
  py: 'Python',
  java: 'Java',
  go: 'Go',
  rs: 'Rust',
  cs: 'CSharp',
}

// ============================================================================
// REPOSITORY CLASSIFICATION ENGINE
// ============================================================================

/**
 * Deterministic engine for repository classification.
 *
 * Classifies a repository using only structural information from the
 * RepositoryInventory. Never throws. Never modifies the repository.
 */
export class RepositoryClassificationEngine {
  /**
   * Classifies the repository from the given RepositoryInventory.
   *
   * @param inventory - The RepositoryInventory to classify.
   * @returns An immutable RepositoryClassification.
   */
  classify(inventory: RepositoryInventory): RepositoryClassification {
    const fileNames = this.extractFileNames(inventory)
    const extensions = this.extractExtensions(inventory)
    const directoryNames = this.extractDirectoryNames(inventory)

    const primaryLanguage = this.detectPrimaryLanguage(extensions)
    const frameworks = this.detectFrameworks(fileNames, directoryNames)
    const packageManagers = this.detectPackageManagers(fileNames)
    const projectType = this.detectProjectType(fileNames, directoryNames, frameworks)
    const confidence = this.calculateConfidence(
      primaryLanguage,
      frameworks,
      packageManagers,
      projectType
    )

    return {
      classificationId: `classification-${inventory.inventoryId}`,
      classificationVersion: ENGINE_VERSION,
      inventoryId: inventory.inventoryId,
      projectType,
      primaryLanguage,
      frameworks,
      packageManagers,
      confidence,
      metadata: {
        engineVersion: ENGINE_VERSION,
        inventoryId: inventory.inventoryId,
        classifiedAt: new Date().toISOString(),
        fileCount: inventory.totalFiles,
        directoryCount: inventory.totalDirectories,
      },
    }
  }

  /**
   * Extracts all file names from the inventory.
   */
  private extractFileNames(inventory: RepositoryInventory): readonly string[] {
    return inventory.files.map((f) => {
      const parts = f.path.split(/[/\\]/)
      return parts[parts.length - 1].toLowerCase()
    })
  }

  /**
   * Extracts all extensions from the inventory.
   */
  private extractExtensions(inventory: RepositoryInventory): readonly string[] {
    return inventory.files.map((f) => f.extension).filter((e) => e.length > 0)
  }

  /**
   * Extracts all directory names from the inventory.
   */
  private extractDirectoryNames(inventory: RepositoryInventory): readonly string[] {
    return inventory.directories.map((d) => {
      const parts = d.path.split(/[/\\]/)
      return parts[parts.length - 1].toLowerCase()
    })
  }

  /**
   * Detects the primary language from file extensions.
   */
  private detectPrimaryLanguage(extensions: readonly string[]): PrimaryLanguage {
    const counts = new Map<PrimaryLanguage, number>()

    for (const ext of extensions) {
      const language = LANGUAGE_EXTENSIONS[ext]
      if (language) {
        counts.set(language, (counts.get(language) ?? 0) + 1)
      }
    }

    if (counts.size === 0) {
      return 'Unknown'
    }

    let maxCount = 0
    let primary: PrimaryLanguage = 'Unknown'

    for (const [language, count] of counts) {
      if (count > maxCount) {
        maxCount = count
        primary = language
      }
    }

    return primary
  }

  /**
   * Detects frameworks from file names and directory names.
   */
  private detectFrameworks(
    fileNames: readonly string[],
    directoryNames: readonly string[]
  ): readonly Framework[] {
    const detected = new Set<Framework>()

    // Check file names
    for (const fileName of fileNames) {
      for (const [indicator, framework] of Object.entries(FRAMEWORK_INDICATORS)) {
        if (fileName.startsWith(indicator.toLowerCase()) && framework !== 'None') {
          detected.add(framework)
        }
      }
    }

    // Check for React in package.json presence (heuristic)
    if (fileNames.includes('package.json')) {
      // React is often present with Next.js or standalone
      if (detected.has('Next.js')) {
        detected.add('React')
      }
    }

    // Check directory names for framework hints
    if (directoryNames.includes('pages') || directoryNames.includes('app')) {
      if (fileNames.some((f) => f.startsWith('next.config'))) {
        detected.add('Next.js')
        detected.add('React')
      }
    }

    if (detected.size === 0) {
      return ['None']
    }

    return Array.from(detected).sort()
  }

  /**
   * Detects package managers from file names.
   */
  private detectPackageManagers(fileNames: readonly string[]): readonly PackageManager[] {
    const detected = new Set<PackageManager>()

    for (const fileName of fileNames) {
      const pm = PACKAGE_MANAGER_INDICATORS[fileName]
      if (pm) {
        detected.add(pm)
      }
    }

    // Default to npm if package.json exists but no lock file detected
    if (detected.size === 0 && fileNames.includes('package.json')) {
      detected.add('npm')
    }

    if (detected.size === 0) {
      return ['unknown']
    }

    return Array.from(detected).sort()
  }

  /**
   * Detects the project type from file names, directory names, and frameworks.
   */
  private detectProjectType(
    fileNames: readonly string[],
    directoryNames: readonly string[],
    frameworks: readonly Framework[]
  ): ProjectType {
    // Monorepo detection
    if (
      directoryNames.includes('packages') ||
      directoryNames.includes('apps') ||
      fileNames.includes('lerna.json') ||
      fileNames.includes('nx.json') ||
      fileNames.includes('turbo.json')
    ) {
      return 'Monorepo'
    }

    // Mobile detection
    if (
      fileNames.includes('ios') ||
      fileNames.includes('android') ||
      directoryNames.includes('ios') ||
      directoryNames.includes('android') ||
      fileNames.includes('pubspec.yaml') // Flutter
    ) {
      return 'Mobile'
    }

    // Desktop detection
    if (
      fileNames.includes('electron.js') ||
      fileNames.includes('electron.ts') ||
      fileNames.includes('tauri.conf.json') ||
      directoryNames.includes('electron')
    ) {
      return 'Desktop'
    }

    // CLI detection
    if (
      fileNames.includes('cli.ts') ||
      fileNames.includes('cli.js') ||
      fileNames.includes('bin') ||
      directoryNames.includes('bin')
    ) {
      return 'CLI'
    }

    // API detection
    if (
      frameworks.includes('Express') ||
      frameworks.includes('FastAPI') ||
      frameworks.includes('Django') ||
      directoryNames.includes('api') ||
      directoryNames.includes('routes') ||
      directoryNames.includes('controllers')
    ) {
      return 'API'
    }

    // WebApplication detection
    if (
      frameworks.includes('Next.js') ||
      frameworks.includes('React') ||
      frameworks.includes('Vue') ||
      frameworks.includes('Angular') ||
      directoryNames.includes('pages') ||
      directoryNames.includes('app') ||
      directoryNames.includes('components') ||
      directoryNames.includes('public') ||
      directoryNames.includes('src')
    ) {
      return 'WebApplication'
    }

    // Library detection
    if (
      fileNames.includes('index.ts') ||
      fileNames.includes('index.js') ||
      fileNames.includes('lib') ||
      directoryNames.includes('lib')
    ) {
      return 'Library'
    }

    return 'Unknown'
  }

  /**
   * Calculates classification confidence based on detected signals.
   */
  private calculateConfidence(
    primaryLanguage: PrimaryLanguage,
    frameworks: readonly Framework[],
    packageManagers: readonly PackageManager[],
    projectType: ProjectType
  ): number {
    let score = 0
    let maxScore = 0

    // Language detection contributes 0.3
    maxScore += 0.3
    if (primaryLanguage !== 'Unknown') {
      score += 0.3
    }

    // Framework detection contributes 0.3
    maxScore += 0.3
    if (frameworks.length > 0 && !frameworks.includes('None')) {
      score += 0.3
    }

    // Package manager detection contributes 0.2
    maxScore += 0.2
    if (packageManagers.length > 0 && !packageManagers.includes('unknown')) {
      score += 0.2
    }

    // Project type detection contributes 0.2
    maxScore += 0.2
    if (projectType !== 'Unknown') {
      score += 0.2
    }

    return maxScore > 0 ? Math.round((score / maxScore) * 100) / 100 : 0
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default classification engine instance. Stateless and safe to share.
 */
export const repositoryClassificationEngine = new RepositoryClassificationEngine()
