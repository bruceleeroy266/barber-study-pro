/**
 * PingOS Memory Retrieval Engine — Core Engine
 *
 * The RetrievalEngine is the single API responsible for finding memories.
 * It accepts a RetrievalQuery, applies filters, sorts results, and paginates.
 *
 * Design principles:
 * - Storage-agnostic: works with any array of Memory objects.
 * - Stateless: each query is independent; no internal cache or state.
 * - Extensible: new filters and sort options can be added without refactoring.
 * - Future-ready: semantic search, vector search, and knowledge graph
 *   capabilities will plug into this engine without major changes.
 *
 * Phase 2: In-memory filtering only — no persistence, embeddings, or AI.
 *
 * Usage:
 *   const engine = new RetrievalEngine()
 *   const result = engine.retrieve(allMemories, {
 *     category: MemoryCategory.Project,
 *     tags: ['supabase'],
 *     verified: true,
 *     minConfidence: ConfidenceLevel.Medium,
 *     sort: SortOption.NewestFirst,
 *     limit: 20,
 *     offset: 0,
 *   })
 */

import { Memory, ConfidenceLevel } from './types'
import {
  RetrievalQuery,
  RetrievalResult,
  SortOption,
  validateRetrievalQuery,
} from './retrieval-types'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Default number of results per page. */
const DEFAULT_LIMIT = 50

/** Default offset (start from the beginning). */
const DEFAULT_OFFSET = 0

/** Confidence level ordering for sorting (higher index = higher confidence). */
const CONFIDENCE_ORDER: ConfidenceLevel[] = [
  ConfidenceLevel.Unverified,
  ConfidenceLevel.Low,
  ConfidenceLevel.Medium,
  ConfidenceLevel.High,
]

// ============================================================================
// RETRIEVAL ENGINE
// ============================================================================

export class RetrievalEngine {
  /**
   * Retrieves memories matching the given query.
   *
   * @param memories - The full set of memories to search (from any storage backend).
   * @param query - The retrieval query with filters, sorting, and pagination.
   * @returns RetrievalResult with matching memories and metadata.
   * @throws RetrievalQueryError if the query is invalid.
   */
  retrieve(memories: Memory[], query: RetrievalQuery = {}): RetrievalResult {
    const startTime = performance.now()

    // Validate the query before processing
    validateRetrievalQuery(query)

    // Apply defaults
    const sort = query.sort ?? SortOption.NewestFirst
    const limit = query.limit ?? DEFAULT_LIMIT
    const offset = query.offset ?? DEFAULT_OFFSET

    // Step 1: Filter
    const filtered = this.applyFilters(memories, query)

    // Step 2: Sort
    const sorted = this.applySort(filtered, sort)

    // Step 3: Paginate
    const paginated = sorted.slice(offset, offset + limit)

    // Step 4: Build result
    const totalResults = filtered.length
    const totalPages = Math.ceil(totalResults / limit)
    const currentPage = Math.floor(offset / limit) + 1
    const hasMore = offset + limit < totalResults

    const executionTimeMs = performance.now() - startTime

    return {
      memories: paginated,
      totalResults,
      appliedFilters: this.extractAppliedFilters(query),
      executionTimeMs,
      pagination: {
        limit,
        offset,
        hasMore,
        totalPages,
        currentPage,
      },
    }
  }

  // --------------------------------------------------------------------------
  // FILTERING
  // --------------------------------------------------------------------------

  /**
   * Applies all specified filters to the memory set.
   * Filters are combined with AND logic — a memory must match ALL specified filters.
   */
  private applyFilters(memories: Memory[], query: RetrievalQuery): Memory[] {
    return memories.filter((memory) => {
      // Filter by ID
      if (query.id !== undefined && memory.id !== query.id) {
        return false
      }

      // Filter by category
      if (query.category !== undefined && memory.category !== query.category) {
        return false
      }

      // Filter by type
      if (query.type !== undefined && memory.type !== query.type) {
        return false
      }

      // Filter by tags (memory must have ALL specified tags)
      if (query.tags !== undefined && query.tags.length > 0) {
        const hasAllTags = query.tags.every((tag) => memory.tags.includes(tag))
        if (!hasAllTags) return false
      }

      // Filter by exact confidence level
      if (query.confidence !== undefined && memory.confidence !== query.confidence) {
        return false
      }

      // Filter by minimum confidence level (inclusive)
      if (query.minConfidence !== undefined) {
        const memoryIndex = CONFIDENCE_ORDER.indexOf(memory.confidence)
        const minIndex = CONFIDENCE_ORDER.indexOf(query.minConfidence)
        if (memoryIndex < minIndex) return false
      }

      // Filter by verified status
      if (query.verified !== undefined && memory.verified !== query.verified) {
        return false
      }

      // Filter by source origin
      if (query.sourceOrigin !== undefined && memory.source.origin !== query.sourceOrigin) {
        return false
      }

      // Filter by source reference
      if (query.sourceReference !== undefined && memory.source.reference !== query.sourceReference) {
        return false
      }

      // Filter by creation date range
      if (query.createdAfter !== undefined && memory.createdAt < query.createdAfter) {
        return false
      }
      if (query.createdBefore !== undefined && memory.createdAt > query.createdBefore) {
        return false
      }

      // Filter by update date range
      if (query.updatedAfter !== undefined && memory.updatedAt < query.updatedAfter) {
        return false
      }
      if (query.updatedBefore !== undefined && memory.updatedAt > query.updatedBefore) {
        return false
      }

      // Filter by priority (from metadata)
      if (query.priority !== undefined) {
        const memoryPriority = memory.metadata?.priority
        if (memoryPriority !== query.priority) return false
      }

      return true
    })
  }

  // --------------------------------------------------------------------------
  // SORTING
  // --------------------------------------------------------------------------

  /**
   * Sorts the filtered memories according to the specified sort option.
   */
  private applySort(memories: Memory[], sort: SortOption): Memory[] {
    const sorted = [...memories] // Create a copy to avoid mutating the input

    switch (sort) {
      case SortOption.NewestFirst:
        return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

      case SortOption.OldestFirst:
        return sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

      case SortOption.HighestConfidence:
        return sorted.sort((a, b) => {
          const aIndex = CONFIDENCE_ORDER.indexOf(a.confidence)
          const bIndex = CONFIDENCE_ORDER.indexOf(b.confidence)
          // Higher confidence first; ties broken by newest first
          if (bIndex !== aIndex) return bIndex - aIndex
          return b.createdAt.localeCompare(a.createdAt)
        })

      case SortOption.AlphabeticalTitle:
        return sorted.sort((a, b) => a.title.localeCompare(b.title))

      default:
        return sorted
    }
  }

  // --------------------------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------------------------

  /**
   * Extracts only the filters that were actually specified (non-undefined)
   * from the query. Used for transparency in the result.
   */
  private extractAppliedFilters(query: RetrievalQuery): Partial<RetrievalQuery> {
    const applied: Partial<RetrievalQuery> = {}

    if (query.id !== undefined) applied.id = query.id
    if (query.category !== undefined) applied.category = query.category
    if (query.type !== undefined) applied.type = query.type
    if (query.tags !== undefined && query.tags.length > 0) applied.tags = query.tags
    if (query.confidence !== undefined) applied.confidence = query.confidence
    if (query.minConfidence !== undefined) applied.minConfidence = query.minConfidence
    if (query.verified !== undefined) applied.verified = query.verified
    if (query.sourceOrigin !== undefined) applied.sourceOrigin = query.sourceOrigin
    if (query.sourceReference !== undefined) applied.sourceReference = query.sourceReference
    if (query.createdAfter !== undefined) applied.createdAfter = query.createdAfter
    if (query.createdBefore !== undefined) applied.createdBefore = query.createdBefore
    if (query.updatedAfter !== undefined) applied.updatedAfter = query.updatedAfter
    if (query.updatedBefore !== undefined) applied.updatedBefore = query.updatedBefore
    if (query.priority !== undefined) applied.priority = query.priority

    return applied
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default singleton instance for convenience.
 * Prefer dependency injection for testability in production code.
 */
export const retrievalEngine = new RetrievalEngine()
