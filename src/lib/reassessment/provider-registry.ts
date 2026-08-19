/**
 * Phase 6C-2b — Mapping Provider Registry
 *
 * Central registry for chapter-specific canonical mapping providers.
 * Allows the exclusion engine to resolve the correct provider for a given chapter
 * without hard-coding chapter-specific logic.
 */

import type { ChapterId, ICanonicalMappingProvider } from './types'
import { getChapter2MappingProvider } from './adapters/chapter-2-adapter'

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
// Singleton Instance
// ───────────────────────────────────────────────

let registryInstance: MappingProviderRegistry | null = null

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
 * Reset the singleton instance (for testing).
 */
export function resetMappingProviderRegistry(): void {
  registryInstance = null
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
