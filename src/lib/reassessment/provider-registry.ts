/**
 * Phase 6C-2b — Mapping Provider Registry
 *
 * Central registry for chapter-specific canonical mapping providers.
 * Allows the exclusion engine to resolve the correct provider for a given chapter
 * without hard-coding chapter-specific logic.
 *
 * Phase 6C-2d — Detection Provider Registry
 *
 * Extended to support concept detection providers for evaluation services.
 */

import type { ChapterId, ICanonicalMappingProvider, ConceptId } from './types'
import type { DetectionState, DetectionConfidence, ConceptEvidence } from '../concept-detection/engine'
import { getChapter2MappingProvider } from './adapters/chapter-2-adapter'
import { getChapter3MappingProvider } from './adapters/chapter-3-adapter'
import { getChapter4MappingProvider } from './adapters/chapter-4-adapter'
import { getChapter5MappingProvider } from './adapters/chapter-5-adapter'
import { getChapter6MappingProvider } from './adapters/chapter-6-adapter'
import { getChapter7MappingProvider } from './adapters/chapter-7-adapter'
import {
  Chapter2DetectionProvider,
  createChapter2DetectionProvider,
  type Chapter2DetectionProviderConfig,
} from './adapters/chapter-2-detection-provider'
import {
  Chapter3DetectionProvider,
  createChapter3DetectionProvider,
  type Chapter3DetectionProviderConfig,
} from './adapters/chapter-3-detection-provider'
import {
  Chapter4DetectionProvider,
  createChapter4DetectionProvider,
  type Chapter4DetectionProviderConfig,
} from './adapters/chapter-4-detection-provider'
import {
  Chapter5DetectionProvider,
  createChapter5DetectionProvider,
  type Chapter5DetectionProviderConfig,
} from './adapters/chapter-5-detection-provider'
import {
  Chapter6DetectionProvider,
  createChapter6DetectionProvider,
  type Chapter6DetectionProviderConfig,
} from './adapters/chapter-6-detection-provider'
import {
  Chapter7DetectionProvider,
  createChapter7DetectionProvider,
  type Chapter7DetectionProviderConfig,
} from './adapters/chapter-7-detection-provider'

// ───────────────────────────────────────────────
// Concept Detection Provider Interface
// ───────────────────────────────────────────────

/**
 * Detection result from a concept detection provider.
 */
export interface ConceptDetectionResult {
  conceptId: ConceptId
  state: DetectionState
  confidence: DetectionConfidence
  evidence: ConceptEvidence
}

/**
 * Concept detection provider — implemented by chapter-specific adapters.
 *
 * This interface defines how the evaluation service resolves detection state
 * without hard-coding chapter-specific logic.
 */
export interface IConceptDetectionProvider {
  /** The chapter this provider serves */
  readonly chapterId: ChapterId

  /**
   * Detect the concept state from evidence.
   *
   * @param conceptId - The concept ID to detect
   * @param evidenceIds - Array of quiz_attempt IDs providing evidence
   * @returns Detection result with state, confidence, and evidence
   */
  detectConceptState(
    conceptId: ConceptId,
    evidenceIds: string[]
  ): Promise<ConceptDetectionResult | null>
}

// ───────────────────────────────────────────────
// Provider Registry
// ───────────────────────────────────────────────

class MappingProviderRegistry {
  private readonly providers: Map<ChapterId, ICanonicalMappingProvider> = new Map()

  constructor() {
    // Register Chapter 2 as the reference implementation
    this.registerProvider(getChapter2MappingProvider())
    // Register Chapter 3 (C3-3)
    this.registerProvider(getChapter3MappingProvider())
    // Register Chapter 4 (C4-3)
    this.registerProvider(getChapter4MappingProvider())
    // Register Chapter 5 (book-aligned reassessment)
    this.registerProvider(getChapter5MappingProvider())
    // Register Chapter 6 (C6-5)
    this.registerProvider(getChapter6MappingProvider())
    // Register Chapter 7 (C7-9 final certification)
    this.registerProvider(getChapter7MappingProvider())
  }

  /**
   * Register a canonical mapping provider for a chapter.
   */
  registerProvider(provider: ICanonicalMappingProvider): void {
    this.providers.set(provider.chapterId, provider)
  }

  /**
   * Get the canonical mapping provider for a chapter.
   * Returns undefined if no provider is registered for the chapter.
   */
  getProvider(chapterId: ChapterId): ICanonicalMappingProvider | undefined {
    return this.providers.get(chapterId)
  }

  /**
   * Check if a provider is registered for a chapter.
   */
  hasProvider(chapterId: ChapterId): boolean {
    return this.providers.has(chapterId)
  }

  /**
   * Get all registered chapter IDs.
   */
  getRegisteredChapterIds(): readonly ChapterId[] {
    return Array.from(this.providers.keys())
  }
}

// ───────────────────────────────────────────────
// Detection Provider Registry
// ───────────────────────────────────────────────

class DetectionProviderRegistry {
  private readonly providers: Map<ChapterId, IConceptDetectionProvider> = new Map()

  /**
   * Register a concept detection provider for a chapter.
   */
  registerProvider(provider: IConceptDetectionProvider): void {
    this.providers.set(provider.chapterId, provider)
  }

  /**
   * Get the concept detection provider for a chapter.
   * Returns undefined if no provider is registered for the chapter.
   */
  getProvider(chapterId: ChapterId): IConceptDetectionProvider | undefined {
    return this.providers.get(chapterId)
  }

  /**
   * Check if a provider is registered for a chapter.
   */
  hasProvider(chapterId: ChapterId): boolean {
    return this.providers.has(chapterId)
  }

  /**
   * Get all registered chapter IDs.
   */
  getRegisteredChapterIds(): readonly ChapterId[] {
    return Array.from(this.providers.keys())
  }
}

// ───────────────────────────────────────────────
// Singleton Instances
// ───────────────────────────────────────────────

let registryInstance: MappingProviderRegistry | null = null
let detectionRegistryInstance: DetectionProviderRegistry | null = null

/**
 * Get the singleton mapping provider registry instance.
 */
export function getMappingProviderRegistry(): MappingProviderRegistry {
  if (!registryInstance) {
    registryInstance = new MappingProviderRegistry()
  }
  return registryInstance
}

/**
 * Get the singleton detection provider registry instance.
 */
export function getDetectionProviderRegistry(): DetectionProviderRegistry {
  if (!detectionRegistryInstance) {
    detectionRegistryInstance = new DetectionProviderRegistry()
  }
  return detectionRegistryInstance
}

/**
 * Reset the singleton instances (for testing).
 */
export function resetMappingProviderRegistry(): void {
  registryInstance = null
}

export function resetDetectionProviderRegistry(): void {
  detectionRegistryInstance = null
}

// ───────────────────────────────────────────────
// Convenience Functions
// ───────────────────────────────────────────────

/**
 * Get the canonical mapping provider for a chapter.
 * Throws if no provider is registered.
 */
export function getCanonicalMappingProvider(chapterId: ChapterId): ICanonicalMappingProvider {
  const registry = getMappingProviderRegistry()
  const provider = registry.getProvider(chapterId)
  if (!provider) {
    throw new Error(`No canonical mapping provider registered for chapter: ${chapterId}`)
  }
  return provider
}

/**
 * Check if a canonical mapping provider exists for a chapter.
 */
export function hasCanonicalMappingProvider(chapterId: ChapterId): boolean {
  const registry = getMappingProviderRegistry()
  return registry.hasProvider(chapterId)
}

/**
 * Get the concept detection provider for a chapter.
 * Throws if no provider is registered.
 */
export function getConceptDetectionProvider(chapterId: ChapterId): IConceptDetectionProvider {
  const registry = getDetectionProviderRegistry()
  const provider = registry.getProvider(chapterId)
  if (!provider) {
    throw new Error(`No concept detection provider registered for chapter: ${chapterId}`)
  }
  return provider
}

/**
 * Check if a concept detection provider exists for a chapter.
 */
export function hasConceptDetectionProvider(chapterId: ChapterId): boolean {
  const registry = getDetectionProviderRegistry()
  return registry.hasProvider(chapterId)
}

/**
 * Initialize and register the Chapter 2 detection provider.
 *
 * This function creates the Chapter2DetectionProvider with the given
 * configuration and registers it in the detection provider registry.
 *
 * @param config - Configuration with fetchQuizAttempts callback
 * @returns The registered Chapter2DetectionProvider instance
 */
export function initializeChapter2DetectionProvider(
  config: Chapter2DetectionProviderConfig
): Chapter2DetectionProvider {
  const provider = createChapter2DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

/**
 * Initialize and register the Chapter 3 detection provider (C3-3).
 *
 * This function creates the Chapter3DetectionProvider with the given
 * configuration and registers it in the detection provider registry.
 *
 * @param config - Configuration with fetchQuizAttempts callback
 * @returns The registered Chapter3DetectionProvider instance
 */
export function initializeChapter3DetectionProvider(
  config: Chapter3DetectionProviderConfig
): Chapter3DetectionProvider {
  const provider = createChapter3DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

/**
 * Initialize and register the Chapter 4 detection provider (C4-3).
 *
 * This function creates the Chapter4DetectionProvider with the given
 * configuration and registers it in the detection provider registry.
 *
 * @param config - Configuration with fetchQuizAttempts callback
 * @returns The registered Chapter4DetectionProvider instance
 */
export function initializeChapter4DetectionProvider(
  config: Chapter4DetectionProviderConfig
): Chapter4DetectionProvider {
  const provider = createChapter4DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

export function initializeChapter5DetectionProvider(
  config: Chapter5DetectionProviderConfig
): Chapter5DetectionProvider {
  const provider = createChapter5DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

export function initializeChapter6DetectionProvider(
  config: Chapter6DetectionProviderConfig
): Chapter6DetectionProvider {
  const provider = createChapter6DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

export function initializeChapter7DetectionProvider(
  config: Chapter7DetectionProviderConfig
): Chapter7DetectionProvider {
  const provider = createChapter7DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

/**
 * Initialize and register the detection provider for a chapter (C3-3).
 *
 * Chapter-aware resolution used by the reassessment submission path:
 * resolves and registers the correct provider per chapter instead of
 * hard-coding Chapter 2. Returns undefined for unsupported chapters
 * (fail-closed).
 */
export function initializeChapterDetectionProvider(
  chapterId: ChapterId,
  config: Chapter2DetectionProviderConfig
): IConceptDetectionProvider | undefined {
  if (chapterId === 'ch-2') {
    return initializeChapter2DetectionProvider(config)
  }
  if (chapterId === 'ch-3') {
    return initializeChapter3DetectionProvider(config)
  }
  if (chapterId === 'ch-4') {
    return initializeChapter4DetectionProvider(config)
  }
  if (chapterId === 'ch-5') {
    return initializeChapter5DetectionProvider(config)
  }
  if (chapterId === 'ch-6') {
    return initializeChapter6DetectionProvider(config)
  }
  if (chapterId === 'ch-7') {
    return initializeChapter7DetectionProvider(config)
  }
  return undefined
}
