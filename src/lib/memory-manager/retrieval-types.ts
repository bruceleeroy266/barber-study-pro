/**
 * PingOS Memory Retrieval Engine — Types
 *
 * Defines the query, result, and configuration types for the Retrieval Engine.
 * Designed for extensibility: new filter fields, sort options, and pagination
 * strategies can be added without breaking existing consumers.
 *
 * Phase 2: In-memory filtering only — no persistence, embeddings, or AI.
 */

import { Memory, MemoryCategory, MemoryType, ConfidenceLevel } from './types'

// ============================================================================
// SORT OPTIONS
// ============================================================================

/**
 * Available sort strategies for retrieval results.
 */
export enum SortOption {
  /** Most recently created first. */
  NewestFirst = 'newest_first',

  /** Oldest created first. */
  OldestFirst = 'oldest_first',

  /** Highest confidence first (High → Medium → Low → Unverified). */
  HighestConfidence = 'highest_confidence',

  /** Alphabetically by title (A → Z). */
  AlphabeticalTitle = 'alphabetical_title',
}

// ============================================================================
// RETRIEVAL QUERY
// ============================================================================

/**
 * Query object for retrieving memories. All fields are optional;
 * omitted fields are not filtered on.
 *
 * Extensible: add new filter fields here and in the engine's applyFilters method.
 */
export interface RetrievalQuery {
  // --------------------------------------------------------------------------
  // FILTERS
  // --------------------------------------------------------------------------

  /** Filter by memory category. */
  category?: MemoryCategory

  /** Filter by memory type. */
  type?: MemoryType

  /** Filter by tags — memory must have ALL specified tags. */
  tags?: string[]

  /** Filter by minimum confidence level (inclusive). */
  minConfidence?: ConfidenceLevel

  /** Filter by exact confidence level. */
  confidence?: ConfidenceLevel

  /** Filter by verified status. */
  verified?: boolean

  /** Filter by source origin (exact match). */
  sourceOrigin?: string

  /** Filter by source reference (exact match). */
  sourceReference?: string

  /** Filter by memory ID. */
  id?: string

  /** Filter by creation date — memories created on or after this ISO 8601 date. */
  createdAfter?: string

  /** Filter by creation date — memories created on or before this ISO 8601 date. */
  createdBefore?: string

  /** Filter by update date — memories updated on or after this ISO 8601 date. */
  updatedAfter?: string

  /** Filter by update date — memories updated on or before this ISO 8601 date. */
  updatedBefore?: string

  /** Filter by priority metadata field (if present in memory metadata). */
  priority?: string

  // --------------------------------------------------------------------------
  // SORTING
  // --------------------------------------------------------------------------

  /** Sort order for results. Defaults to NewestFirst. */
  sort?: SortOption

  // --------------------------------------------------------------------------
  // PAGINATION
  // --------------------------------------------------------------------------

  /** Maximum number of results to return. Defaults to 50. */
  limit?: number

  /** Number of results to skip. Defaults to 0. */
  offset?: number
}

// ============================================================================
// RETRIEVAL RESULT
// ============================================================================

/**
 * Result object returned by the Retrieval Engine.
 * Contains matching memories, metadata about the query execution,
 * and pagination information.
 */
export interface RetrievalResult {
  /** The memories that matched the query (after filtering, sorting, and pagination). */
  memories: Memory[]

  /** Total number of memories that matched the filters (before pagination). */
  totalResults: number

  /** The filters that were actually applied (non-undefined fields from the query). */
  appliedFilters: Partial<RetrievalQuery>

  /** Execution time in milliseconds. */
  executionTimeMs: number

  /** Pagination information. */
  pagination: {
    /** The limit that was applied. */
    limit: number

    /** The offset that was applied. */
    offset: number

    /** Whether there are more results beyond the current page. */
    hasMore: boolean

    /** Total number of pages available with the current limit. */
    totalPages: number

    /** Current page number (1-indexed). */
    currentPage: number
  }
}

// ============================================================================
// QUERY VALIDATION
// ============================================================================

/**
 * Validation error for invalid queries.
 */
export class RetrievalQueryError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown
  ) {
    super(message)
    this.name = 'RetrievalQueryError'
  }
}

/**
 * Validates a RetrievalQuery and throws on invalid input.
 *
 * @param query - The query to validate.
 * @throws RetrievalQueryError if any field is invalid.
 */
export function validateRetrievalQuery(query: RetrievalQuery): void {
  if (query.limit !== undefined) {
    if (!Number.isInteger(query.limit) || query.limit < 1) {
      throw new RetrievalQueryError(
        `Invalid limit: ${query.limit}. Must be a positive integer.`,
        'limit',
        query.limit
      )
    }
    if (query.limit > 1000) {
      throw new RetrievalQueryError(
        `Invalid limit: ${query.limit}. Must be <= 1000 to prevent memory exhaustion.`,
        'limit',
        query.limit
      )
    }
  }

  if (query.offset !== undefined) {
    if (!Number.isInteger(query.offset) || query.offset < 0) {
      throw new RetrievalQueryError(
        `Invalid offset: ${query.offset}. Must be a non-negative integer.`,
        'offset',
        query.offset
      )
    }
  }

  if (query.createdAfter !== undefined && !isValidISODate(query.createdAfter)) {
    throw new RetrievalQueryError(
      `Invalid createdAfter date: ${query.createdAfter}. Must be a valid ISO 8601 date string.`,
      'createdAfter',
      query.createdAfter
    )
  }

  if (query.createdBefore !== undefined && !isValidISODate(query.createdBefore)) {
    throw new RetrievalQueryError(
      `Invalid createdBefore date: ${query.createdBefore}. Must be a valid ISO 8601 date string.`,
      'createdBefore',
      query.createdBefore
    )
  }

  if (query.updatedAfter !== undefined && !isValidISODate(query.updatedAfter)) {
    throw new RetrievalQueryError(
      `Invalid updatedAfter date: ${query.updatedAfter}. Must be a valid ISO 8601 date string.`,
      'updatedAfter',
      query.updatedAfter
    )
  }

  if (query.updatedBefore !== undefined && !isValidISODate(query.updatedBefore)) {
    throw new RetrievalQueryError(
      `Invalid updatedBefore date: ${query.updatedBefore}. Must be a valid ISO 8601 date string.`,
      'updatedBefore',
      query.updatedBefore
    )
  }

  if (query.tags !== undefined && !Array.isArray(query.tags)) {
    throw new RetrievalQueryError(
      `Invalid tags: expected array, got ${typeof query.tags}.`,
      'tags',
      query.tags
    )
  }

  if (query.sort !== undefined && !Object.values(SortOption).includes(query.sort)) {
    throw new RetrievalQueryError(
      `Invalid sort option: ${query.sort}. Must be one of: ${Object.values(SortOption).join(', ')}.`,
      'sort',
      query.sort
    )
  }
}

/**
 * Checks if a string is a valid ISO 8601 date.
 */
function isValidISODate(value: string): boolean {
  if (typeof value !== 'string') return false
  const date = new Date(value)
  return !isNaN(date.getTime())
}
