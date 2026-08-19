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
import type { DetectionState, DetectionConfidence, ConceptEvidence } from '../chapter-2-concepts/detection'
import { getChapter2MappingProvider } from './adapters/chapter-2-adapter'
import {
  Chapter2DetectionProvider,
  createChapter2DetectionProvider,
  type Chapter2DetectionProviderConfig,
} from './adapters/chapter-2-detection-provider'

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
