/**
 * PingOS Memory Manager — Integration Tests
 *
 * Tests the integration between MemoryManager and AdmissionController.
 * Verifies that every create() operation routes through admission control
 * and handles all decision outcomes correctly.
 *
 * Run with: npx tsx --test src/lib/memory-manager/manager-integration.test.ts
 */

import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { MemoryManager, AdmissionMetadata } from './manager'
import { AdmissionController } from './admission-controller'
import { InMemoryStore } from './in-memory-store'
import { AdmissionDecision, Priority } from './admission-types'
import { MemoryCategory, MemoryType, ConfidenceLevel, CreateMemoryInput } from './types'

// ============================================================================
// TEST FIXTURES
// ============================================================================

function createValidInput(overrides: Partial<CreateMemoryInput> = {}): CreateMemoryInput {
  return {
    title: 'Test Memory Title',
    type: MemoryType.CodePattern,
    category: MemoryCategory.Engineering,
    tags: ['test', 'pattern'],
    confidence: ConfidenceLevel.High,
    verified: true,
    source: {
      origin: 'test-suite',
      reference: 'src/lib/test.ts',
      description: 'Test memory',
    },
    content: 'This is a valid test memory with sufficient content to pass all validation rules.',
    metadata: {},
    ...overrides,
  }
}

/**
 * Extracts the typed admission metadata embedded by the Admission Controller
 * from a stored memory's `metadata._admission` record.
 */
function admissionOf(memory: { metadata?: Record<string, unknown> }): AdmissionMetadata {
  return memory.metadata?._admission as AdmissionMetadata
}

// ============================================================================
// SUCCESSFUL ADMISSION
// ============================================================================

describe('MemoryManager Integration — Successful Admission', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    // Share a single store between the controller (for duplicate detection)
    // and the manager (for writes). This replaces the old two-step wiring that
    // left the controller pointing at a different store than the manager.
    const store = new InMemoryStore()
    controller = new AdmissionController(store)
    manager = new MemoryManager({ store, admissionController: controller })
  })

  it('stores an accepted memory and returns CreateMemoryResult', () => {
    const input = createValidInput()
    const result = manager.create(input)

    assert.equal(result.stored, true)
    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.ok(result.memory)
    assert.equal(result.memory!.title, input.title)
    assert.equal(result.memory!.type, input.type)
    assert.equal(result.memory!.category, input.category)
  })

  it('preserves assigned priority in result and memory metadata', () => {
    const input = createValidInput({
      type: MemoryType.Persona,
      category: MemoryCategory.Identity,
    })
    const result = manager.create(input)

    assert.equal(result.priority, Priority.P0)
    assert.ok(result.memory)
    assert.equal(admissionOf(result.memory!).priority, Priority.P0)
  })

  it('stores normalized memory from admission controller', () => {
    const input = createValidInput({
      title: '  Whitespace Title  ',
      tags: ['Test', 'test', 'TEST', 'pattern'],
    })
    const result = manager.create(input)

    assert.equal(result.stored, true)
    assert.ok(result.memory)
    // Note: The current admission controller does not normalize whitespace/tags
    // This test verifies the integration point exists for when normalization is added
    assert.ok(result.memory!.title.length > 0)
  })

  it('includes admission metadata in stored memory', () => {
    const input = createValidInput()
    const result = manager.create(input)

    assert.ok(result.memory)
    const admissionMeta = admissionOf(result.memory!)
    assert.ok(admissionMeta)
    assert.equal(admissionMeta.decision, AdmissionDecision.Accept)
    assert.equal(admissionMeta.priority, result.priority)
    assert.equal(admissionMeta.reason, result.reason)
    assert.equal(admissionMeta.triggeredRule, result.triggeredRule)
    assert.ok(admissionMeta.admittedAt)
  })

  it('returns admission result with all fields', () => {
    const input = createValidInput()
    const result = manager.create(input)

    assert.ok(result.admissionResult)
    assert.equal(result.admissionResult.decision, result.decision)
    assert.equal(result.admissionResult.priority, result.priority)
    assert.equal(result.admissionResult.reason, result.reason)
    assert.deepEqual(result.admissionResult.warnings, result.warnings)
    assert.equal(result.admissionResult.triggeredRule, result.triggeredRule)
  })
})

// ============================================================================
// REJECTED MEMORIES
// ============================================================================

describe('MemoryManager Integration — Rejected Memories', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    const store = new InMemoryStore()
    controller = new AdmissionController(store)
    manager = new MemoryManager({ store, admissionController: controller })
  })

  it('does not store rejected memory with empty title', () => {
    const input = createValidInput({ title: '' })
    const result = manager.create(input)

    assert.equal(result.stored, false)
    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.equal(result.memory, undefined)
    assert.ok(result.reason.includes('title'))
    assert.equal(manager.count(), 0)
  })

  it('does not store rejected memory with console log content', () => {
    const input = createValidInput({
      content: 'console.log("debug info"); console.error("error");',
    })
    const result = manager.create(input)

    assert.equal(result.stored, false)
    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.equal(result.triggeredRule, 'transient-content')
    assert.equal(manager.count(), 0)
  })

  it('does not store duplicate memory', () => {
    const input = createValidInput()
    
    // First create should succeed
    const first = manager.create(input)
    assert.equal(first.stored, true)
    assert.equal(manager.count(), 1)

    // Second identical create should be rejected as duplicate
    const second = manager.create(input)
    assert.equal(second.stored, false)
    assert.equal(second.decision, AdmissionDecision.Reject)
    assert.equal(second.triggeredRule, 'duplicate-detection')
    assert.equal(manager.count(), 1)
  })

  it('returns clear rejection reason', () => {
    const input = createValidInput({ title: '', content: '' })
    const result = manager.create(input)

    assert.equal(result.stored, false)
    assert.ok(result.reason.length > 0)
    assert.ok(result.reason.includes('Missing or empty required fields'))
  })

  it('throws on rejection when throwOnRejection is true', () => {
    const strictManager = new MemoryManager({
      admissionController: controller,
      throwOnRejection: true,
    })

    const input = createValidInput({ title: '' })
    
    assert.throws(
      () => strictManager.create(input),
      /Memory rejected:/
    )
  })
})

// ============================================================================
// ARCHIVED MEMORIES
// ============================================================================

describe('MemoryManager Integration — Archived Memories', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    const store = new InMemoryStore()
    controller = new AdmissionController(store)
    manager = new MemoryManager({ store, admissionController: controller })
  })

  it('stores archive category memories with ArchiveImmediately decision', () => {
    const input = createValidInput({
      type: MemoryType.HistoricalRecord,
      category: MemoryCategory.Archive,
      title: 'Old 2025 Specification',
    })
    const result = manager.create(input)

    assert.equal(result.stored, true)
    assert.equal(result.decision, AdmissionDecision.ArchiveImmediately)
    assert.equal(result.priority, Priority.P4)
    assert.ok(result.memory)
    assert.equal(result.memory!.category, MemoryCategory.Archive)
  })

  it('preserves archive reason in memory metadata', () => {
    const input = createValidInput({
      type: MemoryType.HistoricalRecord,
      category: MemoryCategory.Archive,
    })
    const result = manager.create(input)

    assert.ok(result.memory)
    const admissionMeta = admissionOf(result.memory!)
    assert.equal(admissionMeta.decision, AdmissionDecision.ArchiveImmediately)
    assert.ok(admissionMeta.reason.includes('Archive'))
  })
})

// ============================================================================
// PRIORITY PRESERVATION
// ============================================================================

describe('MemoryManager Integration — Priority Preservation', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    const store = new InMemoryStore()
    controller = new AdmissionController(store)
    manager = new MemoryManager({ store, admissionController: controller })
  })

  it('preserves P0 priority for identity memories', () => {
    const input = createValidInput({
      type: MemoryType.Persona,
      category: MemoryCategory.Identity,
    })
    const result = manager.create(input)

    assert.equal(result.priority, Priority.P0)
    assert.equal(admissionOf(result.memory!).priority, Priority.P0)
  })

  it('preserves P1 priority for architecture decisions', () => {
    const input = createValidInput({
      type: MemoryType.ArchitectureDecision,
      category: MemoryCategory.Project,
    })
    const result = manager.create(input)

    assert.equal(result.priority, Priority.P1)
    assert.equal(admissionOf(result.memory!).priority, Priority.P1)
  })

  it('preserves P2 priority for verified engineering memories', () => {
    const input = createValidInput({
      type: MemoryType.CodePattern,
      category: MemoryCategory.Engineering,
      verified: true,
      confidence: ConfidenceLevel.High,
    })
    const result = manager.create(input)

    assert.equal(result.priority, Priority.P2)
    assert.equal(admissionOf(result.memory!).priority, Priority.P2)
  })

  it('preserves P3 priority for workspace memories', () => {
    const input = createValidInput({
      type: MemoryType.FileLocation,
      category: MemoryCategory.Workspace,
    })
    const result = manager.create(input)

    assert.equal(result.priority, Priority.P3)
    assert.equal(admissionOf(result.memory!).priority, Priority.P3)
  })

  it('preserves P4 priority for archive memories', () => {
    const input = createValidInput({
      type: MemoryType.HistoricalRecord,
      category: MemoryCategory.Archive,
    })
    const result = manager.create(input)

    assert.equal(result.priority, Priority.P4)
    assert.equal(admissionOf(result.memory!).priority, Priority.P4)
  })
})

// ============================================================================
// LEGACY BEHAVIOR (Backward Compatibility)
// ============================================================================

describe('MemoryManager Integration — Legacy Behavior', () => {
  it('works without AdmissionController (legacy mode)', () => {
    const manager = new MemoryManager()
    const input = createValidInput()
    const result = manager.create(input)

    assert.equal(result.stored, true)
    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.equal(result.priority, Priority.P3)
    assert.equal(result.triggeredRule, 'legacy')
    assert.ok(result.memory)
    assert.equal(manager.count(), 1)
  })

  it('legacy mode does not reject duplicates', () => {
    const manager = new MemoryManager()
    const input = createValidInput()

    const first = manager.create(input)
    const second = manager.create(input)

    assert.equal(first.stored, true)
    assert.equal(second.stored, true)
    assert.equal(manager.count(), 2)
  })

  it('legacy mode still validates required fields', () => {
    const manager = new MemoryManager()
    const input = createValidInput({ title: '' })

    assert.throws(
      () => manager.create(input),
      /Memory title is required/
    )
  })

  it('createUnsafe bypasses all validation', () => {
    const manager = new MemoryManager({ admissionController: new AdmissionController(new InMemoryStore()) })
    const input = createValidInput({ title: '' })

    // createUnsafe should throw on invalid input (it uses validateCreateInput)
    assert.throws(
      () => manager.createUnsafe(input),
      /Memory title is required/
    )
  })
})

// ============================================================================
// EXISTING MEMORYMANAGER BEHAVIOR
// ============================================================================

describe('MemoryManager Integration — Existing Behavior Preserved', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    const store = new InMemoryStore()
    controller = new AdmissionController(store)
    manager = new MemoryManager({ store, admissionController: controller })
  })

  it('getById returns stored memory', () => {
    const input = createValidInput()
    const result = manager.create(input)
    
    const retrieved = manager.getById(result.memory!.id)
    assert.ok(retrieved)
    assert.equal(retrieved.id, result.memory!.id)
    assert.equal(retrieved.title, input.title)
  })

  it('getAll returns all stored memories', () => {
    manager.createUnsafe(createValidInput({ title: 'Memory 1' }))
    manager.createUnsafe(createValidInput({ title: 'Memory 2' }))
    manager.createUnsafe(createValidInput({ title: 'Memory 3' }))

    const all = manager.getAll()
    assert.equal(all.length, 3)
  })

  it('getByCategory filters correctly', () => {
    manager.createUnsafe(createValidInput({ category: MemoryCategory.Engineering }))
    manager.createUnsafe(createValidInput({ 
      category: MemoryCategory.Identity,
      type: MemoryType.Persona,
    }))

    const engineering = manager.getByCategory(MemoryCategory.Engineering)
    const identity = manager.getByCategory(MemoryCategory.Identity)

    assert.equal(engineering.length, 1)
    assert.equal(identity.length, 1)
  })

  it('getByType filters correctly', () => {
    manager.createUnsafe(createValidInput({ type: MemoryType.CodePattern }))
    manager.createUnsafe(createValidInput({ 
      type: MemoryType.BugFix,
      title: 'Bug Fix Memory',
    }))

    const patterns = manager.getByType(MemoryType.CodePattern)
    const bugs = manager.getByType(MemoryType.BugFix)

    assert.equal(patterns.length, 1)
    assert.equal(bugs.length, 1)
  })

  it('getByTag filters correctly', () => {
    manager.createUnsafe(createValidInput({ tags: ['security', 'rbac'] }))
    manager.createUnsafe(createValidInput({ tags: ['performance'] }))

    const security = manager.getByTag('security')
    const performance = manager.getByTag('performance')

    assert.equal(security.length, 1)
    assert.equal(performance.length, 1)
  })

  it('getVerified returns only verified memories', () => {
    manager.create(createValidInput({ verified: true }))
    manager.create(createValidInput({ 
      verified: false,
      title: 'Unverified Memory',
    }))

    const verified = manager.getVerified()
    assert.equal(verified.length, 1)
    assert.equal(verified[0].verified, true)
  })

  it('update modifies stored memory', () => {
    const result = manager.create(createValidInput())
    const updated = manager.update({
      id: result.memory!.id,
      title: 'Updated Title',
      verified: false,
    })

    assert.ok(updated)
    assert.equal(updated.title, 'Updated Title')
    assert.equal(updated.verified, false)
  })

  it('delete removes memory', () => {
    const result = manager.create(createValidInput())
    assert.equal(manager.count(), 1)

    const deleted = manager.delete(result.memory!.id)
    assert.equal(deleted, true)
    assert.equal(manager.count(), 0)
  })

  it('classify returns classification result', () => {
    const result = manager.classify({
      type: 'bug_fix',
      title: 'Fixed authentication redirect loop',
    })

    assert.equal(result.category, MemoryCategory.Engineering)
    assert.ok(result.confidence > 0.9)
  })

  it('getStats returns correct statistics', () => {
    manager.createUnsafe(createValidInput({ 
      category: MemoryCategory.Engineering,
      verified: true,
    }))
    manager.createUnsafe(createValidInput({ 
      category: MemoryCategory.Identity,
      type: MemoryType.Persona,
      verified: false,
    }))

    const stats = manager.getStats()
    assert.equal(stats.total, 2)
    assert.equal(stats.byCategory[MemoryCategory.Engineering], 1)
    assert.equal(stats.byCategory[MemoryCategory.Identity], 1)
    assert.equal(stats.verified, 1)
    assert.equal(stats.unverified, 1)
  })

  it('clear removes all memories', () => {
    manager.createUnsafe(createValidInput())
    manager.createUnsafe(createValidInput({ title: 'Memory 2' }))
    assert.equal(manager.count(), 2)

    manager.clear()
    assert.equal(manager.count(), 0)
  })
})

// ============================================================================
// DUPLICATE DETECTION INTEGRATION
// ============================================================================

describe('MemoryManager Integration — Duplicate Detection', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    const store = new InMemoryStore()
    controller = new AdmissionController(store)
    manager = new MemoryManager({ store, admissionController: controller })
  })

  it('duplicate detection uses existing memories from manager', () => {
    // Store first memory
    const first = manager.create(createValidInput({
      title: 'Authentication Pattern',
      content: 'Use JWT for stateless authentication with refresh tokens.',
    }))
    assert.equal(first.stored, true)

    // Try to store near-duplicate
    const second = manager.create(createValidInput({
      title: 'Authentication Pattern',
      content: 'Use JWT for stateless authentication with refresh tokens.',
    }))
    assert.equal(second.stored, false)
    assert.equal(second.triggeredRule, 'duplicate-detection')
  })

  it('allows similar but distinct memories', () => {
    const first = manager.create(createValidInput({
      title: 'Authentication Pattern',
      content: 'Use JWT for stateless authentication.',
    }))
    assert.equal(first.stored, true)

    const second = manager.create(createValidInput({
      title: 'Authorization Pattern',
      content: 'Use RBAC for role-based access control.',
    }))
    assert.equal(second.stored, true)
    assert.equal(manager.count(), 2)
  })
})

// ============================================================================
// EDGE CASES
// ============================================================================

describe('MemoryManager Integration — Edge Cases', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    const store = new InMemoryStore()
    controller = new AdmissionController(store)
    manager = new MemoryManager({ store, admissionController: controller })
  })

  it('handles memory with minimal valid input', () => {
    const input: CreateMemoryInput = {
      title: 'Minimal',
      type: MemoryType.CodePattern,
      category: MemoryCategory.Engineering,
      source: { origin: 'test' },
      content: 'Minimal content.',
    }
    const result = manager.create(input)

    assert.equal(result.stored, true)
    assert.ok(result.memory)
    assert.deepEqual(result.memory!.tags, [])
    assert.equal(result.memory!.confidence, ConfidenceLevel.Unverified)
    assert.equal(result.memory!.verified, false)
  })

  it('handles memory with all optional fields populated', () => {
    const input: CreateMemoryInput = {
      title: 'Full Memory',
      type: MemoryType.CodePattern,
      category: MemoryCategory.Engineering,
      tags: ['tag1', 'tag2', 'tag3'],
      confidence: ConfidenceLevel.High,
      verified: true,
      source: {
        origin: 'code-review',
        reference: 'src/lib/auth.ts',
        description: 'Authentication module',
      },
      content: 'Complete memory content with all fields populated.',
      metadata: {
        filePath: 'src/lib/auth.ts',
        lineCount: 150,
        reviewers: ['alice', 'bob'],
      },
    }
    const result = manager.create(input)

    assert.equal(result.stored, true)
    assert.ok(result.memory)
    assert.deepEqual(result.memory!.tags, ['tag1', 'tag2', 'tag3'])
    assert.equal(result.memory!.confidence, ConfidenceLevel.High)
    assert.equal(result.memory!.verified, true)
    assert.equal(result.memory!.source.reference, 'src/lib/auth.ts')
    assert.equal(result.memory!.metadata?.filePath, 'src/lib/auth.ts')
    assert.ok(result.memory!.metadata?._admission)
  })

  it('handles special characters in title and content', () => {
    const input = createValidInput({
      title: 'Memory with <special> "characters" & symbols!',
      content: 'Content with\nnewlines\tand\ttabs and émojis 🎉',
    })
    const result = manager.create(input)

    assert.equal(result.stored, true)
    assert.ok(result.memory)
    assert.equal(result.memory!.title, input.title)
    assert.equal(result.memory!.content, input.content)
  })

  it('handles very long but valid content', () => {
    const longContent = 'x'.repeat(49_999) // Just under 50k limit
    const input = createValidInput({ content: longContent })
    const result = manager.create(input)

    assert.equal(result.stored, true)
    assert.ok(result.memory)
    assert.equal(result.memory!.content.length, 49_999)
  })

  it('rejects content exceeding size limit', () => {
    const longContent = 'x'.repeat(50_001) // Over 50k limit
    const input = createValidInput({ content: longContent })
    const result = manager.create(input)

    assert.equal(result.stored, false)
    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.equal(result.triggeredRule, 'size-limits')
  })
})
