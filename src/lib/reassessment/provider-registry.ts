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
import { getChapter1MappingProvider } from './adapters/chapter-1-adapter'
import { getChapter2MappingProvider } from './adapters/chapter-2-adapter'
import { getChapter3MappingProvider } from './adapters/chapter-3-adapter'
import { getChapter4MappingProvider } from './adapters/chapter-4-adapter'
import { getChapter5MappingProvider } from './adapters/chapter-5-adapter'
import { getChapter6MappingProvider } from './adapters/chapter-6-adapter'
import { getChapter7MappingProvider } from './adapters/chapter-7-adapter'
import { getChapter8MappingProvider } from './adapters/chapter-8-adapter'
import { getChapter9MappingProvider } from './adapters/chapter-9-adapter'
import { getChapter10MappingProvider } from './adapters/chapter-10-adapter'
import { getChapter11MappingProvider } from './adapters/chapter-11-adapter'
import { getChapter12MappingProvider } from './adapters/chapter-12-adapter'
import { getChapter13MappingProvider } from './adapters/chapter-13-adapter'
import { getChapter14MappingProvider } from './adapters/chapter-14-adapter'
import { getChapter15MappingProvider } from './adapters/chapter-15-adapter'
import { getChapter16MappingProvider } from './adapters/chapter-16-adapter'
import { getChapter17MappingProvider } from './adapters/chapter-17-adapter'
import { getChapter18MappingProvider } from './adapters/chapter-18-adapter'
import {
  Chapter1DetectionProvider,
  createChapter1DetectionProvider,
  type Chapter1DetectionProviderConfig,
} from './adapters/chapter-1-detection-provider'
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
import {
  Chapter8DetectionProvider,
  createChapter8DetectionProvider,
  type Chapter8DetectionProviderConfig,
} from './adapters/chapter-8-detection-provider'
import {
  Chapter9DetectionProvider,
  createChapter9DetectionProvider,
  type Chapter9DetectionProviderConfig,
} from './adapters/chapter-9-detection-provider'
import {
  Chapter10DetectionProvider,
  createChapter10DetectionProvider,
  type Chapter10DetectionProviderConfig,
} from './adapters/chapter-10-detection-provider'
import {
  Chapter11DetectionProvider,
  createChapter11DetectionProvider,
  type Chapter11DetectionProviderConfig,
} from './adapters/chapter-11-detection-provider'
import {
  Chapter12DetectionProvider,
  createChapter12DetectionProvider,
  type Chapter12DetectionProviderConfig,
} from './adapters/chapter-12-detection-provider'
import {
  Chapter13DetectionProvider,
  createChapter13DetectionProvider,
  type Chapter13DetectionProviderConfig,
} from './adapters/chapter-13-detection-provider'
import {
  Chapter14DetectionProvider,
  createChapter14DetectionProvider,
  type Chapter14DetectionProviderConfig,
} from './adapters/chapter-14-detection-provider'
import {
  Chapter15DetectionProvider,
  createChapter15DetectionProvider,
  type Chapter15DetectionProviderConfig,
} from './adapters/chapter-15-detection-provider'
import {
  Chapter17DetectionProvider,
  createChapter17DetectionProvider,
  type Chapter17DetectionProviderConfig,
} from './adapters/chapter-17-detection-provider'
import {
  Chapter18DetectionProvider,
  createChapter18DetectionProvider,
  type Chapter18DetectionProviderConfig,
} from './adapters/chapter-18-detection-provider'

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
    this.registerProvider(getChapter1MappingProvider())
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
    // Register Chapter 8 (C8-7 targeted remediation)
    this.registerProvider(getChapter8MappingProvider())
    // Register Chapter 9 (G3 unified remediation runtime)
    this.registerProvider(getChapter9MappingProvider())
    // Register Chapter 10 (C10-8 final runtime)
    this.registerProvider(getChapter10MappingProvider())
    // Register Chapter 11 (C11-7 targeted remediation/reassessment)
    this.registerProvider(getChapter11MappingProvider())
    // Register Chapter 12 (C12-7 targeted remediation/reassessment)
    this.registerProvider(getChapter12MappingProvider())
    // Register Chapter 13 (C13-7 targeted remediation/reassessment)
    this.registerProvider(getChapter13MappingProvider())
    // Register Chapter 14 (C14-7 targeted remediation/reassessment)
    this.registerProvider(getChapter14MappingProvider())
    // Register Chapter 15 (C15-7 targeted remediation/reassessment)
    this.registerProvider(getChapter15MappingProvider())
    // Register Chapter 16 (C16-8 reassessment/recovery)
    this.registerProvider(getChapter16MappingProvider())
    // Register Chapter 17 (C17-7 targeted remediation/reassessment)
    this.registerProvider(getChapter17MappingProvider())
    // Register Chapter 18 (C18-7 targeted remediation/reassessment)
    this.registerProvider(getChapter18MappingProvider())
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

export function initializeChapter1DetectionProvider(
  config: Chapter1DetectionProviderConfig
): Chapter1DetectionProvider {
  const provider = createChapter1DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
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

export function initializeChapter8DetectionProvider(
  config: Chapter8DetectionProviderConfig
): Chapter8DetectionProvider {
  const provider = createChapter8DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

export function initializeChapter9DetectionProvider(
  config: Chapter9DetectionProviderConfig
): Chapter9DetectionProvider {
  const provider = createChapter9DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

export function initializeChapter10DetectionProvider(
  config: Chapter10DetectionProviderConfig
): Chapter10DetectionProvider {
  const provider = createChapter10DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

export function initializeChapter11DetectionProvider(
  config: Chapter11DetectionProviderConfig
): Chapter11DetectionProvider {
  const provider = createChapter11DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}


export function initializeChapter12DetectionProvider(
  config: Chapter12DetectionProviderConfig
): Chapter12DetectionProvider {
  const provider = createChapter12DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

export function initializeChapter13DetectionProvider(
  config: Chapter13DetectionProviderConfig
): Chapter13DetectionProvider {
  const provider = createChapter13DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

export function initializeChapter14DetectionProvider(
  config: Chapter14DetectionProviderConfig
): Chapter14DetectionProvider {
  const provider = createChapter14DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

export function initializeChapter15DetectionProvider(
  config: Chapter15DetectionProviderConfig
): Chapter15DetectionProvider {
  const provider = createChapter15DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}

export function initializeChapter17DetectionProvider(
  config: Chapter17DetectionProviderConfig
): Chapter17DetectionProvider {
  const provider = createChapter17DetectionProvider(config)
  const registry = getDetectionProviderRegistry()
  registry.registerProvider(provider)
  return provider
}


export function initializeChapter18DetectionProvider(
  config: Chapter18DetectionProviderConfig
): Chapter18DetectionProvider {
  const provider = createChapter18DetectionProvider(config)
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
  if (chapterId === 'ch-1') {
    return initializeChapter1DetectionProvider(config)
  }
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
  if (chapterId === 'ch-8') {
    return initializeChapter8DetectionProvider(config)
  }
  if (chapterId === 'ch-9') {
    return initializeChapter9DetectionProvider(config)
  }
  if (chapterId === 'ch-10') {
    return initializeChapter10DetectionProvider(config)
  }
  if (chapterId === 'ch-11') {
    return initializeChapter11DetectionProvider(config)
  }
  if (chapterId === 'ch-12') {
    return initializeChapter12DetectionProvider(config)
  }
  if (chapterId === 'ch-13') {
    return initializeChapter13DetectionProvider(config)
  }
  if (chapterId === 'ch-14') {
    return initializeChapter14DetectionProvider(config)
  }
  if (chapterId === 'ch-15') {
    return initializeChapter15DetectionProvider(config)
  }
  if (chapterId === 'ch-17') {
    return initializeChapter17DetectionProvider(config)
  }
  if (chapterId === 'ch-18') {
    return initializeChapter18DetectionProvider(config)
  }
  return undefined
}
