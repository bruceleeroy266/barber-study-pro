/**
 * PingOS Memory Retrieval Engine — Unit Tests
 *
 * Comprehensive test suite covering:
 * - Single filter queries
 * - Multi-filter queries
 * - Sorting options
 * - Pagination
 * - Empty results
 * - Invalid queries
 *
 * Run with: npx tsx --test src/lib/memory-manager/retrieval-engine.test.ts
 */

import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { Memory, MemoryCategory, MemoryType, ConfidenceLevel } from './types'
import { RetrievalEngine } from './retrieval-engine'
import { SortOption, RetrievalQueryError } from './retrieval-types'

// ============================================================================
// TEST FIXTURES
// ============================================================================

function createTestMemory(overrides: Partial<Memory> = {}): Memory {
  const now = new Date().toISOString()
  return {
    id: `mem_test_${Math.random().toString(36).slice(2, 9)}`,
    title: 'Test Memory',
    type: MemoryType.CodePattern,
    category: MemoryCategory.Engineering,
    tags: ['test'],
    createdAt: now,
    updatedAt: now,
    confidence: ConfidenceLevel.Medium,
    verified: false,
    source: { origin: 'test-suite', reference: 'test.ts', description: 'Test memory' },
    content: 'Test content',
    metadata: {},
    ...overrides,
  }
}

function createTestMemories(): Memory[] {
  const base = new Date('2026-01-01T00:00:00Z')

  return [
    createTestMemory({
      id: 'mem_001',
      title: 'Alpha Project Overview',
      type: MemoryType.ProjectOverview,
      category: MemoryCategory.Project,
      tags: ['supabase', 'database', 'ascyn-pro'],
      createdAt: new Date(base.getTime() + 1000).toISOString(),
      updatedAt: new Date(base.getTime() + 1000).toISOString(),
      confidence: ConfidenceLevel.High,
      verified: true,
      source: { origin: 'code-review', reference: 'src/lib/db.ts' },
      metadata: { priority: 'high' },
    }),
    createTestMemory({
      id: 'mem_002',
      title: 'Beta Authentication Pattern',
      type: MemoryType.CodePattern,
      category: MemoryCategory.Engineering,
      tags: ['auth', 'security', 'supabase'],
      createdAt: new Date(base.getTime() + 2000).toISOString(),
      updatedAt: new Date(base.getTime() + 2000).toISOString(),
      confidence: ConfidenceLevel.Medium,
      verified: true,
      source: { origin: 'code-review', reference: 'src/lib/auth.ts' },
      metadata: { priority: 'medium' },
    }),
    createTestMemory({
      id: 'mem_003',
      title: 'Gamma Bug Fix',
      type: MemoryType.BugFix,
      category: MemoryCategory.Engineering,
      tags: ['bug', 'fix'],
      createdAt: new Date(base.getTime() + 3000).toISOString(),
      updatedAt: new Date(base.getTime() + 3000).toISOString(),
      confidence: ConfidenceLevel.Low,
      verified: false,
      source: { origin: 'manual', reference: 'notes.md' },
      metadata: {},
    }),
    createTestMemory({
      id: 'mem_004',
      title: 'Delta Strategic Decision',
      type: MemoryType.StrategicDecision,
      category: MemoryCategory.Decision,
      tags: ['strategy', 'architecture'],
      createdAt: new Date(base.getTime() + 4000).toISOString(),
      updatedAt: new Date(base.getTime() + 4000).toISOString(),
      confidence: ConfidenceLevel.High,
      verified: true,
      source: { origin: 'meeting', reference: 'notes.md' },
      metadata: { priority: 'high' },
    }),
    createTestMemory({
      id: 'mem_005',
      title: 'Epsilon File Location',
      type: MemoryType.FileLocation,
      category: MemoryCategory.Workspace,
      tags: ['config', 'setup'],
      createdAt: new Date(base.getTime() + 5000).toISOString(),
      updatedAt: new Date(base.getTime() + 5000).toISOString(),
      confidence: ConfidenceLevel.Unverified,
      verified: false,
      source: { origin: 'manual' },
      metadata: {},
    }),
    createTestMemory({
      id: 'mem_006',
      title: 'Zeta Historical Record',
      type: MemoryType.HistoricalRecord,
      category: MemoryCategory.Archive,
      tags: ['archive', 'old'],
      createdAt: new Date(base.getTime() + 6000).toISOString(),
      updatedAt: new Date(base.getTime() + 6000).toISOString(),
      confidence: ConfidenceLevel.Low,
      verified: false,
      source: { origin: 'import', reference: 'legacy.json' },
      metadata: {},
    }),
  ]
}

// ============================================================================
// SINGLE FILTER TESTS
// ============================================================================

describe('RetrievalEngine — Single Filters', () => {
  let engine: RetrievalEngine
  let memories: Memory[]

  beforeEach(() => {
    engine = new RetrievalEngine()
    memories = createTestMemories()
  })

  it('filters by category', () => {
    const result = engine.retrieve(memories, { category: MemoryCategory.Engineering })

    assert.equal(result.totalResults, 2)
    assert.ok(result.memories.every((m) => m.category === MemoryCategory.Engineering))
    assert.deepEqual(result.appliedFilters, { category: MemoryCategory.Engineering })
  })

  it('filters by type', () => {
    const result = engine.retrieve(memories, { type: MemoryType.BugFix })

    assert.equal(result.totalResults, 1)
    assert.equal(result.memories[0].id, 'mem_003')
    assert.deepEqual(result.appliedFilters, { type: MemoryType.BugFix })
  })

  it('filters by single tag', () => {
    const result = engine.retrieve(memories, { tags: ['supabase'] })

    assert.equal(result.totalResults, 2)
    assert.ok(result.memories.every((m) => m.tags.includes('supabase')))
  })

  it('filters by multiple tags (AND logic)', () => {
    const result = engine.retrieve(memories, { tags: ['supabase', 'security'] })

    assert.equal(result.totalResults, 1)
    assert.equal(result.memories[0].id, 'mem_002')
  })

  it('filters by exact confidence level', () => {
    const result = engine.retrieve(memories, { confidence: ConfidenceLevel.High })

    assert.equal(result.totalResults, 2)
    assert.ok(result.memories.every((m) => m.confidence === ConfidenceLevel.High))
  })

  it('filters by minimum confidence level', () => {
    const result = engine.retrieve(memories, { minConfidence: ConfidenceLevel.Medium })

    // Medium+ includes: mem_001 (High), mem_002 (Medium), mem_004 (High)
    assert.equal(result.totalResults, 3)
    assert.ok(
      result.memories.every((m) =>
        [ConfidenceLevel.Medium, ConfidenceLevel.High].includes(m.confidence)
      )
    )
  })

  it('filters by verified status (true)', () => {
    const result = engine.retrieve(memories, { verified: true })

    assert.equal(result.totalResults, 3)
    assert.ok(result.memories.every((m) => m.verified))
  })

  it('filters by verified status (false)', () => {
    const result = engine.retrieve(memories, { verified: false })

    assert.equal(result.totalResults, 3)
    assert.ok(result.memories.every((m) => !m.verified))
  })

  it('filters by source origin', () => {
    const result = engine.retrieve(memories, { sourceOrigin: 'code-review' })

    assert.equal(result.totalResults, 2)
    assert.ok(result.memories.every((m) => m.source.origin === 'code-review'))
  })

  it('filters by source reference', () => {
    const result = engine.retrieve(memories, { sourceReference: 'notes.md' })

    assert.equal(result.totalResults, 2)
    assert.ok(result.memories.every((m) => m.source.reference === 'notes.md'))
  })

  it('filters by memory ID', () => {
    const result = engine.retrieve(memories, { id: 'mem_004' })

    assert.equal(result.totalResults, 1)
    assert.equal(result.memories[0].id, 'mem_004')
  })

  it('filters by createdAfter date', () => {
    const cutoff = new Date('2026-01-01T00:00:03Z').toISOString()
    const result = engine.retrieve(memories, { createdAfter: cutoff })

    // Memories at +3s, +4s, +5s, +6s are at or after the cutoff
    assert.equal(result.totalResults, 4)
    assert.ok(result.memories.every((m) => m.createdAt >= cutoff))
  })

  it('filters by createdBefore date', () => {
    const cutoff = new Date('2026-01-01T00:00:03Z').toISOString()
    const result = engine.retrieve(memories, { createdBefore: cutoff })

    assert.equal(result.totalResults, 3)
    assert.ok(result.memories.every((m) => m.createdAt <= cutoff))
  })

  it('filters by date range (createdAfter + createdBefore)', () => {
    const after = new Date('2026-01-01T00:00:02Z').toISOString()
    const before = new Date('2026-01-01T00:00:05Z').toISOString()
    const result = engine.retrieve(memories, { createdAfter: after, createdBefore: before })

    // Memories at +2s, +3s, +4s, +5s fall within the range
    assert.equal(result.totalResults, 4)
    assert.ok(result.memories.every((m) => m.createdAt >= after && m.createdAt <= before))
  })

  it('filters by priority metadata', () => {
    const result = engine.retrieve(memories, { priority: 'high' })

    assert.equal(result.totalResults, 2)
    assert.ok(result.memories.every((m) => m.metadata?.priority === 'high'))
  })
})

// ============================================================================
// MULTI-FILTER TESTS
// ============================================================================

describe('RetrievalEngine — Multi-Filter Queries', () => {
  let engine: RetrievalEngine
  let memories: Memory[]

  beforeEach(() => {
    engine = new RetrievalEngine()
    memories = createTestMemories()
  })

  it('combines category + tags + verified + minConfidence', () => {
    const result = engine.retrieve(memories, {
      category: MemoryCategory.Engineering,
      tags: ['supabase'],
      verified: true,
      minConfidence: ConfidenceLevel.Medium,
    })

    assert.equal(result.totalResults, 1)
    assert.equal(result.memories[0].id, 'mem_002')
    assert.deepEqual(result.appliedFilters, {
      category: MemoryCategory.Engineering,
      tags: ['supabase'],
      verified: true,
      minConfidence: ConfidenceLevel.Medium,
    })
  })

  it('combines category + verified', () => {
    const result = engine.retrieve(memories, {
      category: MemoryCategory.Engineering,
      verified: true,
    })

    assert.equal(result.totalResults, 1)
    assert.equal(result.memories[0].id, 'mem_002')
  })

  it('combines tags + date range', () => {
    const after = new Date('2026-01-01T00:00:01Z').toISOString()
    const before = new Date('2026-01-01T00:00:04Z').toISOString()
    const result = engine.retrieve(memories, {
      tags: ['supabase'],
      createdAfter: after,
      createdBefore: before,
    })

    // mem_001 (+1s) and mem_002 (+2s) both have 'supabase' tag and fall in range
    assert.equal(result.totalResults, 2)
    assert.ok(result.memories.every((m) => m.tags.includes('supabase')))
  })

  it('combines sourceOrigin + confidence', () => {
    const result = engine.retrieve(memories, {
      sourceOrigin: 'code-review',
      confidence: ConfidenceLevel.High,
    })

    assert.equal(result.totalResults, 1)
    assert.equal(result.memories[0].id, 'mem_001')
  })

  it('returns empty when filters are mutually exclusive', () => {
    const result = engine.retrieve(memories, {
      category: MemoryCategory.Project,
      type: MemoryType.BugFix, // BugFix is in Engineering, not Project
    })

    assert.equal(result.totalResults, 0)
    assert.equal(result.memories.length, 0)
  })
})

// ============================================================================
// SORTING TESTS
// ============================================================================

describe('RetrievalEngine — Sorting', () => {
  let engine: RetrievalEngine
  let memories: Memory[]

  beforeEach(() => {
    engine = new RetrievalEngine()
    memories = createTestMemories()
  })

  it('sorts by newest first (default)', () => {
    const result = engine.retrieve(memories, {})

    assert.equal(result.memories[0].id, 'mem_006') // Latest createdAt
    assert.equal(result.memories[5].id, 'mem_001') // Earliest createdAt
  })

  it('sorts by oldest first', () => {
    const result = engine.retrieve(memories, { sort: SortOption.OldestFirst })

    assert.equal(result.memories[0].id, 'mem_001') // Earliest createdAt
    assert.equal(result.memories[5].id, 'mem_006') // Latest createdAt
  })

  it('sorts by highest confidence', () => {
    const result = engine.retrieve(memories, { sort: SortOption.HighestConfidence })

    // High confidence first (mem_001, mem_004), then Medium (mem_002), then Low (mem_003, mem_006), then Unverified (mem_005)
    assert.equal(result.memories[0].confidence, ConfidenceLevel.High)
    assert.equal(result.memories[1].confidence, ConfidenceLevel.High)
    assert.equal(result.memories[2].confidence, ConfidenceLevel.Medium)
    assert.equal(result.memories[3].confidence, ConfidenceLevel.Low)
    assert.equal(result.memories[4].confidence, ConfidenceLevel.Low)
    assert.equal(result.memories[5].confidence, ConfidenceLevel.Unverified)
  })

  it('sorts alphabetically by title', () => {
    const result = engine.retrieve(memories, { sort: SortOption.AlphabeticalTitle })

    const titles = result.memories.map((m) => m.title)
    assert.deepEqual(titles, [
      'Alpha Project Overview',
      'Beta Authentication Pattern',
      'Delta Strategic Decision',
      'Epsilon File Location',
      'Gamma Bug Fix',
      'Zeta Historical Record',
    ])
  })

  it('sorts with filters applied', () => {
    const result = engine.retrieve(memories, {
      category: MemoryCategory.Engineering,
      sort: SortOption.AlphabeticalTitle,
    })

    assert.equal(result.totalResults, 2)
    assert.equal(result.memories[0].title, 'Beta Authentication Pattern')
    assert.equal(result.memories[1].title, 'Gamma Bug Fix')
  })
})

// ============================================================================
// PAGINATION TESTS
// ============================================================================

describe('RetrievalEngine — Pagination', () => {
  let engine: RetrievalEngine
  let memories: Memory[]

  beforeEach(() => {
    engine = new RetrievalEngine()
    memories = createTestMemories()
  })

  it('applies default limit (50)', () => {
    const result = engine.retrieve(memories, {})

    assert.equal(result.pagination.limit, 50)
    assert.equal(result.memories.length, 6) // All 6 fit in one page
  })

  it('applies custom limit', () => {
    const result = engine.retrieve(memories, { limit: 2 })

    assert.equal(result.pagination.limit, 2)
    assert.equal(result.memories.length, 2)
    assert.equal(result.pagination.totalPages, 3)
    assert.equal(result.pagination.hasMore, true)
  })

  it('applies offset', () => {
    const result = engine.retrieve(memories, { limit: 2, offset: 2 })

    assert.equal(result.pagination.offset, 2)
    assert.equal(result.memories.length, 2)
    assert.equal(result.pagination.currentPage, 2)
    assert.equal(result.pagination.hasMore, true)
  })

  it('handles last page correctly', () => {
    const result = engine.retrieve(memories, { limit: 2, offset: 4 })

    assert.equal(result.memories.length, 2)
    assert.equal(result.pagination.currentPage, 3)
    assert.equal(result.pagination.hasMore, false)
  })

  it('handles offset beyond total results', () => {
    const result = engine.retrieve(memories, { limit: 10, offset: 100 })

    assert.equal(result.memories.length, 0)
    assert.equal(result.pagination.hasMore, false)
    assert.equal(result.pagination.totalPages, 1)
  })

  it('paginates with filters applied', () => {
    const result = engine.retrieve(memories, {
      category: MemoryCategory.Engineering,
      limit: 1,
      offset: 0,
    })

    assert.equal(result.totalResults, 2)
    assert.equal(result.memories.length, 1)
    assert.equal(result.pagination.totalPages, 2)
    assert.equal(result.pagination.hasMore, true)
  })

  it('calculates pagination metadata correctly', () => {
    const result = engine.retrieve(memories, { limit: 4, offset: 0 })

    assert.equal(result.pagination.totalPages, 2)
    assert.equal(result.pagination.currentPage, 1)
    assert.equal(result.pagination.hasMore, true)
  })
})

// ============================================================================
// EMPTY RESULTS TESTS
// ============================================================================

describe('RetrievalEngine — Empty Results', () => {
  let engine: RetrievalEngine
  let memories: Memory[]

  beforeEach(() => {
    engine = new RetrievalEngine()
    memories = createTestMemories()
  })

  it('returns empty array when no memories match', () => {
    const result = engine.retrieve(memories, { category: MemoryCategory.Identity })

    assert.equal(result.totalResults, 0)
    assert.equal(result.memories.length, 0)
    assert.equal(result.pagination.hasMore, false)
    assert.equal(result.pagination.totalPages, 0)
  })

  it('returns empty array when filtering empty input', () => {
    const result = engine.retrieve([], {})

    assert.equal(result.totalResults, 0)
    assert.equal(result.memories.length, 0)
  })

  it('returns empty array when tags do not match', () => {
    const result = engine.retrieve(memories, { tags: ['nonexistent-tag'] })

    assert.equal(result.totalResults, 0)
  })
})

// ============================================================================
// INVALID QUERY TESTS
// ============================================================================

describe('RetrievalEngine — Invalid Queries', () => {
  let engine: RetrievalEngine
  let memories: Memory[]

  beforeEach(() => {
    engine = new RetrievalEngine()
    memories = createTestMemories()
  })

  it('throws on negative limit', () => {
    assert.throws(
      () => engine.retrieve(memories, { limit: -1 }),
      (err: Error) => err instanceof RetrievalQueryError && err.message.includes('Invalid limit')
    )
  })

  it('throws on zero limit', () => {
    assert.throws(
      () => engine.retrieve(memories, { limit: 0 }),
      (err: Error) => err instanceof RetrievalQueryError && err.message.includes('Invalid limit')
    )
  })

  it('throws on non-integer limit', () => {
    assert.throws(
      () => engine.retrieve(memories, { limit: 1.5 }),
      (err: Error) => err instanceof RetrievalQueryError && err.message.includes('Invalid limit')
    )
  })

  it('throws on limit exceeding maximum (1000)', () => {
    assert.throws(
      () => engine.retrieve(memories, { limit: 1001 }),
      (err: Error) => err instanceof RetrievalQueryError && err.message.includes('Invalid limit')
    )
  })

  it('throws on negative offset', () => {
    assert.throws(
      () => engine.retrieve(memories, { offset: -1 }),
      (err: Error) => err instanceof RetrievalQueryError && err.message.includes('Invalid offset')
    )
  })

  it('throws on non-integer offset', () => {
    assert.throws(
      () => engine.retrieve(memories, { offset: 1.5 }),
      (err: Error) => err instanceof RetrievalQueryError && err.message.includes('Invalid offset')
    )
  })

  it('throws on invalid createdAfter date', () => {
    assert.throws(
      () => engine.retrieve(memories, { createdAfter: 'not-a-date' }),
      (err: Error) => err instanceof RetrievalQueryError && err.message.includes('Invalid createdAfter')
    )
  })

  it('throws on invalid createdBefore date', () => {
    assert.throws(
      () => engine.retrieve(memories, { createdBefore: '2026-13-45' }),
      (err: Error) => err instanceof RetrievalQueryError && err.message.includes('Invalid createdBefore')
    )
  })

  it('throws on invalid sort option', () => {
    assert.throws(
      () => engine.retrieve(memories, { sort: 'invalid_sort' as SortOption }),
      (err: Error) => err instanceof RetrievalQueryError && err.message.includes('Invalid sort option')
    )
  })

  it('throws on non-array tags', () => {
    assert.throws(
      () => engine.retrieve(memories, { tags: 'not-an-array' as unknown as string[] }),
      (err: Error) => err instanceof RetrievalQueryError && err.message.includes('Invalid tags')
    )
  })
})

// ============================================================================
// RESULT METADATA TESTS
// ============================================================================

describe('RetrievalEngine — Result Metadata', () => {
  let engine: RetrievalEngine
  let memories: Memory[]

  beforeEach(() => {
    engine = new RetrievalEngine()
    memories = createTestMemories()
  })

  it('includes execution time', () => {
    const result = engine.retrieve(memories, {})

    assert.ok(typeof result.executionTimeMs === 'number')
    assert.ok(result.executionTimeMs >= 0)
  })

  it('includes applied filters in result', () => {
    const result = engine.retrieve(memories, {
      category: MemoryCategory.Project,
      verified: true,
    })

    assert.deepEqual(result.appliedFilters, {
      category: MemoryCategory.Project,
      verified: true,
    })
  })

  it('excludes unspecified filters from appliedFilters', () => {
    const result = engine.retrieve(memories, { category: MemoryCategory.Project })

    assert.deepEqual(result.appliedFilters, { category: MemoryCategory.Project })
    assert.equal('verified' in result.appliedFilters, false)
    assert.equal('tags' in result.appliedFilters, false)
  })

  it('returns empty appliedFilters when no filters specified', () => {
    const result = engine.retrieve(memories, {})

    assert.deepEqual(result.appliedFilters, {})
  })
})

// ============================================================================
// EDGE CASES
// ============================================================================

describe('RetrievalEngine — Edge Cases', () => {
  let engine: RetrievalEngine

  beforeEach(() => {
    engine = new RetrievalEngine()
  })

  it('handles memories with no tags', () => {
    const memory = createTestMemory({ tags: [] })
    const result = engine.retrieve([memory], { tags: ['any-tag'] })

    assert.equal(result.totalResults, 0)
  })

  it('handles memories with no metadata', () => {
    const memory = createTestMemory({ metadata: undefined })
    const result = engine.retrieve([memory], { priority: 'high' })

    assert.equal(result.totalResults, 0)
  })

  it('handles memories with missing source reference', () => {
    const memory = createTestMemory({ source: { origin: 'test' } })
    const result = engine.retrieve([memory], { sourceReference: 'any-ref' })

    assert.equal(result.totalResults, 0)
  })

  it('handles large result sets efficiently', () => {
    const largeMemories: Memory[] = []
    for (let i = 0; i < 1000; i++) {
      largeMemories.push(
        createTestMemory({
          id: `mem_${i}`,
          title: `Memory ${i}`,
          createdAt: new Date(Date.now() + i * 1000).toISOString(),
        })
      )
    }

    const result = engine.retrieve(largeMemories, { limit: 10 })

    assert.equal(result.totalResults, 1000)
    assert.equal(result.memories.length, 10)
    assert.ok(result.executionTimeMs < 100) // Should complete in under 100ms
  })
})
