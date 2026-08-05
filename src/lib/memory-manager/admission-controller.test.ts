/**
 * PingOS Memory Admission Controller — Unit Tests
 *
 * Comprehensive test suite covering:
 * - Accepted memories (all priority levels)
 * - Rejected memories (empty, invalid schema, transient, duplicates)
 * - Archived memories
 * - Duplicate handling
 * - Priority assignment
 * - Configurable rule behavior
 * - Invalid input
 * - Edge cases
 *
 * Run with: npx tsx --test src/lib/memory-manager/admission-controller.test.ts
 */

import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { MemoryManager } from './manager'
import { AdmissionController } from './admission-controller'
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

// ============================================================================
// ACCEPTED MEMORIES
// ============================================================================

describe('AdmissionController — Accepted Memories', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    manager = new MemoryManager()
    controller = new AdmissionController(manager)
  })

  it('accepts a valid engineering memory with high confidence', () => {
    const result = controller.admit(createValidInput())

    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.equal(result.priority, Priority.P2)
    assert.ok(result.reason.includes('Verified engineering memory'))
    assert.equal(result.triggeredRule, 'priority-assignment')
    assert.ok(result.normalizedMemory)
  })

  it('accepts a valid identity memory with P0 priority', () => {
    const result = controller.admit(
      createValidInput({
        type: MemoryType.Persona,
        category: MemoryCategory.Identity,
        title: 'Ping Identity',
      })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.equal(result.priority, Priority.P0)
    assert.ok(result.reason.includes('Identity memory'))
  })

  it('accepts a valid architecture decision with P1 priority', () => {
    const result = controller.admit(
      createValidInput({
        type: MemoryType.ArchitectureDecision,
        category: MemoryCategory.Project,
        title: 'Database Architecture Decision',
      })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.equal(result.priority, Priority.P1)
    assert.ok(result.reason.includes('long-term priority'))
  })

  it('accepts a valid strategic decision with P1 priority', () => {
    const result = controller.admit(
      createValidInput({
        type: MemoryType.StrategicDecision,
        category: MemoryCategory.Decision,
        title: 'Technology Stack Decision',
      })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.equal(result.priority, Priority.P1)
  })

  it('accepts a valid project overview with P1 priority', () => {
    const result = controller.admit(
      createValidInput({
        type: MemoryType.ProjectOverview,
        category: MemoryCategory.Project,
        title: 'ASCYN PRO Overview',
      })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.equal(result.priority, Priority.P1)
  })

  it('accepts a valid decision memory with P2 priority', () => {
    const result = controller.admit(
      createValidInput({
        type: MemoryType.TacticalDecision,
        category: MemoryCategory.Decision,
        title: 'API Design Decision',
      })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.equal(result.priority, Priority.P2)
    assert.ok(result.reason.includes('Decision memory'))
  })

  it('accepts a valid workspace memory with P3 priority', () => {
    const result = controller.admit(
      createValidInput({
        type: MemoryType.FileLocation,
        category: MemoryCategory.Workspace,
        title: 'Config File Location',
        verified: false,
        confidence: ConfidenceLevel.Unverified,
      })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.equal(result.priority, Priority.P3)
    assert.ok(result.reason.includes('Workspace memory'))
  })

  it('accepts an unverified engineering memory with P3 priority', () => {
    const result = controller.admit(
      createValidInput({
        verified: false,
        confidence: ConfidenceLevel.Low,
      })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.equal(result.priority, Priority.P3)
    assert.ok(result.reason.includes('Unverified engineering memory'))
  })

  it('accepts a memory with type/category mismatch but warns', () => {
    const result = controller.admit(
      createValidInput({
        type: MemoryType.CodePattern, // Should be Engineering
        category: MemoryCategory.Project, // But assigned to Project
      })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.ok(result.warnings.length > 0)
    assert.ok(result.warnings[0].includes('typically belongs to category'))
  })
})

// ============================================================================
// REJECTED MEMORIES
// ============================================================================

describe('AdmissionController — Rejected Memories', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    manager = new MemoryManager()
    controller = new AdmissionController(manager)
  })

  it('rejects memory with empty title', () => {
    const result = controller.admit(createValidInput({ title: '' }))

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.equal(result.priority, Priority.P4)
    assert.ok(result.reason.includes('title is required'))
    assert.equal(result.triggeredRule, 'required-fields')
  })

  it('rejects memory with blank title', () => {
    const result = controller.admit(createValidInput({ title: '   ' }))

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('title is required'))
  })

  it('rejects memory with empty content', () => {
    const result = controller.admit(createValidInput({ content: '' }))

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('content is required'))
  })

  it('rejects memory with missing source origin', () => {
    const result = controller.admit(
      createValidInput({ source: { origin: '' } })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('source.origin is required'))
  })

  it('rejects memory with invalid type', () => {
    const result = controller.admit(
      createValidInput({ type: 'invalid_type' as MemoryType })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('Invalid memory type'))
    assert.equal(result.triggeredRule, 'schema-validation')
  })

  it('rejects memory with invalid category', () => {
    const result = controller.admit(
      createValidInput({ category: 'invalid_category' as MemoryCategory })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('Invalid memory category'))
    assert.equal(result.triggeredRule, 'schema-validation')
  })

  it('rejects memory with title exceeding max length', () => {
    const result = controller.admit(
      createValidInput({ title: 'x'.repeat(501) })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('title exceeds maximum length'))
    assert.equal(result.triggeredRule, 'size-limits')
  })

  it('rejects memory with content exceeding max length', () => {
    const result = controller.admit(
      createValidInput({ content: 'x'.repeat(50_001) })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('content exceeds maximum length'))
    assert.equal(result.triggeredRule, 'size-limits')
  })

  it('rejects memory with too many tags', () => {
    const result = controller.admit(
      createValidInput({ tags: Array.from({ length: 51 }, (_, i) => `tag-${i}`) })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('tags exceed maximum count'))
    assert.equal(result.triggeredRule, 'size-limits')
  })

  it('rejects memory containing console log output', () => {
    const result = controller.admit(
      createValidInput({
        title: 'Debug output',
        content: 'console.log("debug info"); console.error("stack trace");',
      })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('console log output'))
    assert.equal(result.triggeredRule, 'transient-content')
  })

  it('rejects memory containing stack trace', () => {
    const result = controller.admit(
      createValidInput({
        title: 'Error occurred',
        content: 'Error: TypeError at Object.<anonymous> (src/lib/test.ts:25:10) at node_modules/...',
      })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('stack trace'))
    assert.equal(result.triggeredRule, 'transient-content')
  })

  it('rejects memory that is only a timestamp', () => {
    const result = controller.admit(
      createValidInput({
        title: '2026-07-29',
        content: '2026-07-29T01:00:00Z',
      })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('timestamp with no contextual value'))
    assert.equal(result.triggeredRule, 'transient-content')
  })

  it('rejects exact duplicate memory', () => {
    // Create an existing memory
    manager.create(createValidInput({ title: 'Existing Memory', content: 'Same content here.' }))

    // Try to admit an identical one
    const result = controller.admit(
      createValidInput({ title: 'Existing Memory', content: 'Same content here.' })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('exact duplicate'))
    assert.equal(result.triggeredRule, 'duplicate-detection')
  })

  it('rejects duplicate with same source reference and title', () => {
    manager.create(
      createValidInput({
        title: 'Auth Pattern',
        source: { origin: 'code-review', reference: 'src/lib/auth.ts' },
      })
    )

    const result = controller.admit(
      createValidInput({
        title: 'Auth Pattern',
        content: 'Different content but same source and title.',
        source: { origin: 'code-review', reference: 'src/lib/auth.ts' },
      })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('same source reference and title'))
    assert.equal(result.triggeredRule, 'duplicate-detection')
  })

  it('rejects memory below minimum confidence threshold', () => {
    const strictController = new AdmissionController(manager, {
      minConfidenceForAcceptance: ConfidenceLevel.Medium,
    })

    const result = strictController.admit(
      createValidInput({ confidence: ConfidenceLevel.Low })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('below minimum required'))
    assert.equal(result.triggeredRule, 'confidence-threshold')
  })
})

// ============================================================================
// ARCHIVED MEMORIES
// ============================================================================

describe('AdmissionController — Archived Memories', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    manager = new MemoryManager()
    controller = new AdmissionController(manager)
  })

  it('archives archive category memories immediately', () => {
    const result = controller.admit(
      createValidInput({
        type: MemoryType.HistoricalRecord,
        category: MemoryCategory.Archive,
        title: 'Old Spec from 2025',
      })
    )

    assert.equal(result.decision, AdmissionDecision.ArchiveImmediately)
    assert.equal(result.priority, Priority.P4)
    assert.ok(result.reason.includes('Archive memory'))
    assert.equal(result.triggeredRule, 'priority-assignment')
  })

  it('archives temporary content flagged with temporary tag', () => {
    const result = controller.admit(
      createValidInput({
        title: 'Temporary scratch notes',
        content: 'This is a temp draft with some hack and todo items.',
        tags: ['temporary'],
      })
    )

    assert.equal(result.decision, AdmissionDecision.ArchiveImmediately)
    assert.equal(result.priority, Priority.P4)
    assert.ok(result.reason.includes('temporary content'))
    assert.equal(result.triggeredRule, 'transient-content')
  })
})

// ============================================================================
// DUPLICATE HANDLING
// ============================================================================

describe('AdmissionController — Duplicate Handling', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    manager = new MemoryManager()
    controller = new AdmissionController(manager)
  })

  it('allows similar but not identical memories', () => {
    manager.create(
      createValidInput({
        title: 'Authentication Pattern',
        content: 'Use JWT tokens for stateless authentication.',
      })
    )

    const result = controller.admit(
      createValidInput({
        title: 'Authorization Pattern',
        content: 'Use RBAC for role-based access control.',
      })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
  })

  it('allows memories with same title but different content', () => {
    manager.create(
      createValidInput({
        title: 'Database Config',
        content: 'PostgreSQL configuration for production.',
        source: { origin: 'code-review', reference: 'src/lib/db.ts' },
      })
    )

    const result = controller.admit(
      createValidInput({
        title: 'Database Config',
        content: 'Redis configuration for caching layer.',
        source: { origin: 'code-review', reference: 'src/lib/redis.ts' }, // Different reference
      })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
  })

  it('can disable duplicate rejection via config', () => {
    const lenientController = new AdmissionController(manager, {
      rejectDuplicates: false,
    })

    manager.create(createValidInput({ title: 'Duplicate Test', content: 'Same content.' }))

    const result = lenientController.admit(
      createValidInput({ title: 'Duplicate Test', content: 'Same content.' })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
  })

  it('detects high-similarity duplicates', () => {
    const longContent = 'The quick brown fox jumps over the lazy dog. '.repeat(20)
    manager.create(createValidInput({ title: 'Fox Story', content: longContent }))

    // Nearly identical content (95%+ similarity) — only one word different
    const similarContent = 'The quick brown fox jumps over the lazy dog. '.repeat(20) + 'The quick brown fox jumps over the lazy dog.'
    const result = controller.admit(
      createValidInput({ title: 'Fox Story Continued', content: similarContent })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('near-duplicate content'))
  })
})

// ============================================================================
// PRIORITY ASSIGNMENT
// ============================================================================

describe('AdmissionController — Priority Assignment', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    manager = new MemoryManager()
    controller = new AdmissionController(manager)
  })

  it('assigns P0 to identity memories', () => {
    const result = controller.admit(
      createValidInput({ category: MemoryCategory.Identity, type: MemoryType.Persona })
    )
    assert.equal(result.priority, Priority.P0)
  })

  it('assigns P1 to architecture decisions', () => {
    const result = controller.admit(
      createValidInput({ type: MemoryType.ArchitectureDecision, category: MemoryCategory.Project })
    )
    assert.equal(result.priority, Priority.P1)
  })

  it('assigns P1 to strategic decisions', () => {
    const result = controller.admit(
      createValidInput({ type: MemoryType.StrategicDecision, category: MemoryCategory.Decision })
    )
    assert.equal(result.priority, Priority.P1)
  })

  it('assigns P1 to project overviews', () => {
    const result = controller.admit(
      createValidInput({ type: MemoryType.ProjectOverview, category: MemoryCategory.Project })
    )
    assert.equal(result.priority, Priority.P1)
  })

  it('assigns P2 to verified engineering memories', () => {
    const result = controller.admit(
      createValidInput({ verified: true, confidence: ConfidenceLevel.High })
    )
    assert.equal(result.priority, Priority.P2)
  })

  it('assigns P2 to decision memories', () => {
    const result = controller.admit(
      createValidInput({ category: MemoryCategory.Decision, type: MemoryType.TacticalDecision })
    )
    assert.equal(result.priority, Priority.P2)
  })

  it('assigns P3 to workspace memories', () => {
    const result = controller.admit(
      createValidInput({ category: MemoryCategory.Workspace, type: MemoryType.FileLocation })
    )
    assert.equal(result.priority, Priority.P3)
  })

  it('assigns P3 to unverified engineering memories', () => {
    const result = controller.admit(
      createValidInput({ verified: false, confidence: ConfidenceLevel.Low })
    )
    assert.equal(result.priority, Priority.P3)
  })

  it('assigns P4 to archive memories', () => {
    const result = controller.admit(
      createValidInput({ category: MemoryCategory.Archive, type: MemoryType.HistoricalRecord })
    )
    assert.equal(result.priority, Priority.P4)
  })
})

// ============================================================================
// CONFIGURABLE RULE BEHAVIOR
// ============================================================================

describe('AdmissionController — Configurable Rule Behavior', () => {
  let manager: MemoryManager

  beforeEach(() => {
    manager = new MemoryManager()
  })

  it('respects custom maxTitleLength', () => {
    const controller = new AdmissionController(manager, { maxTitleLength: 10 })

    const result = controller.admit(createValidInput({ title: 'x'.repeat(11) }))
    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('exceeds maximum length of 10'))
  })

  it('respects custom maxContentLength', () => {
    const controller = new AdmissionController(manager, { maxContentLength: 100 })

    const result = controller.admit(createValidInput({ content: 'x'.repeat(101) }))
    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('exceeds maximum length of 100'))
  })

  it('respects custom maxTags', () => {
    const controller = new AdmissionController(manager, { maxTags: 3 })

    const result = controller.admit(createValidInput({ tags: ['a', 'b', 'c', 'd'] }))
    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('exceed maximum count of 3'))
  })

  it('respects rejectOnTypeCategoryMismatch', () => {
    const controller = new AdmissionController(manager, { rejectOnTypeCategoryMismatch: true })

    const result = controller.admit(
      createValidInput({
        type: MemoryType.CodePattern, // Should be Engineering
        category: MemoryCategory.Project, // But assigned to Project
      })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('typically belongs to category'))
    assert.equal(result.triggeredRule, 'type-category-consistency')
  })

  it('respects custom duplicateSimilarityThreshold', () => {
    const controller = new AdmissionController(manager, {
      duplicateSimilarityThreshold: 0.5, // Lower threshold = more strict
    })

    manager.create(
      createValidInput({
        title: 'Original Story',
        content: 'The quick brown fox jumps over the lazy dog.',
      })
    )

    const result = controller.admit(
      createValidInput({
        title: 'Original Story Continued', // Similar title
        content: 'The quick brown fox jumps over the lazy cat.', // ~71% similar content
      })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('high similarity'))
  })

  it('supports custom rules prepended to pipeline', () => {
    const customRule = {
      id: 'custom-no-test',
      description: 'Rejects memories with "test" in title.',
      evaluate: (context: { memory: CreateMemoryInput }) => {
        if (context.memory.title.toLowerCase().includes('test')) {
          return {
            decision: AdmissionDecision.Reject,
            priority: Priority.P4,
            reason: 'Rejected: test memories not allowed.',
            warnings: [],
            triggeredRule: 'custom-no-test',
          }
        }
        return undefined
      },
    }

    const controller = new AdmissionController(manager, { customRules: [customRule] })

    const result = controller.admit(createValidInput({ title: 'Test Memory' }))
    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.equal(result.triggeredRule, 'custom-no-test')
  })

  it('supports post rules appended to pipeline', () => {
    const postRule = {
      id: 'post-log',
      description: 'Logs all accepted memories.',
      evaluate: () => undefined, // Never triggers
    }

    const controller = new AdmissionController(manager, { postRules: [postRule] })
    const rules = controller.getRules()

    // Post rule should be last
    assert.equal(rules[rules.length - 1].id, 'post-log')
  })
})

// ============================================================================
// INVALID INPUT
// ============================================================================

describe('AdmissionController — Invalid Input', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    manager = new MemoryManager()
    controller = new AdmissionController(manager)
  })

  it('handles null/undefined gracefully', () => {
    // TypeScript would catch this at compile time, but test runtime behavior
    const result = controller.admit({
      title: '',
      type: undefined as unknown as MemoryType,
      category: undefined as unknown as MemoryCategory,
      source: { origin: '' },
      content: '',
    })

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.equal(result.triggeredRule, 'required-fields')
  })

  it('handles missing tags gracefully', () => {
    const result = controller.admit(createValidInput({ tags: undefined }))

    assert.equal(result.decision, AdmissionDecision.Accept)
  })

  it('handles missing metadata gracefully', () => {
    const result = controller.admit(createValidInput({ metadata: undefined }))

    assert.equal(result.decision, AdmissionDecision.Accept)
  })

  it('handles missing source reference gracefully', () => {
    const result = controller.admit(
      createValidInput({ source: { origin: 'test' } })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
  })
})

// ============================================================================
// EDGE CASES
// ============================================================================

describe('AdmissionController — Edge Cases', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    manager = new MemoryManager()
    controller = new AdmissionController(manager)
  })

  it('handles empty existing memories store', () => {
    const result = controller.admit(createValidInput())

    assert.equal(result.decision, AdmissionDecision.Accept)
  })

  it('handles very long but valid title', () => {
    const result = controller.admit(
      createValidInput({ title: 'x'.repeat(500) })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
  })

  it('handles very long but valid content', () => {
    const result = controller.admit(
      createValidInput({ content: 'x'.repeat(50_000) })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
  })

  it('handles maximum allowed tags', () => {
    const result = controller.admit(
      createValidInput({ tags: Array.from({ length: 50 }, (_, i) => `tag-${i}`) })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
  })

  it('handles special characters in title and content', () => {
    const result = controller.admit(
      createValidInput({
        title: 'Special chars: <>&"\'`@#$%^&*()',
        content: 'Content with émojis 🎉 and spëcial çharacters.',
      })
    )

    assert.equal(result.decision, AdmissionDecision.Accept)
  })

  it('handles whitespace-only content as rejection', () => {
    const result = controller.admit(
      createValidInput({ content: '   \n\t   ' })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('content is required'))
  })

  it('returns normalized memory in result', () => {
    const input = createValidInput()
    const result = controller.admit(input)

    assert.equal(result.decision, AdmissionDecision.Accept)
    assert.deepEqual(result.normalizedMemory, input)
  })

  it('includes warnings array even when empty', () => {
    const result = controller.admit(createValidInput())

    assert.ok(Array.isArray(result.warnings))
  })

  it('includes triggeredRule in all decisions', () => {
    const accepted = controller.admit(createValidInput())
    assert.ok(accepted.triggeredRule)

    const rejected = controller.admit(createValidInput({ title: '' }))
    assert.ok(rejected.triggeredRule)
  })
})

// ============================================================================
// INTEGRATION WITH MEMORY MANAGER
// ============================================================================

describe('AdmissionController — Integration', () => {
  let manager: MemoryManager
  let controller: AdmissionController

  beforeEach(() => {
    manager = new MemoryManager()
    controller = new AdmissionController(manager)
  })

  it('admitted memory can be created in manager', () => {
    const input = createValidInput()
    const admission = controller.admit(input)

    assert.equal(admission.decision, AdmissionDecision.Accept)

    const result = manager.create(admission.normalizedMemory!)
    assert.ok(result.stored)
    assert.ok(result.memory)
    assert.ok(result.memory.id)
    assert.equal(result.memory.title, input.title)
  })

  it('rejected memory is not created in manager', () => {
    const input = createValidInput({ title: '' })
    const admission = controller.admit(input)

    assert.equal(admission.decision, AdmissionDecision.Reject)
    assert.equal(manager.count(), 0)
  })

  it('duplicate detection uses manager memories', () => {
    // Create a memory directly in manager
    manager.create(createValidInput({ title: 'Direct Create', content: 'Original content.' }))

    // Try to admit a duplicate
    const result = controller.admit(
      createValidInput({ title: 'Direct Create', content: 'Original content.' })
    )

    assert.equal(result.decision, AdmissionDecision.Reject)
    assert.ok(result.reason.includes('exact duplicate'))
  })

  it('controller exposes rules for inspection', () => {
    const rules = controller.getRules()

    assert.ok(rules.length >= 8) // At least the 8 default rules
    assert.ok(rules.every((r) => r.id && r.description && typeof r.evaluate === 'function'))
  })

  it('controller exposes config for inspection', () => {
    const config = controller.getConfig()

    assert.equal(config.maxTitleLength, 500)
    assert.equal(config.maxContentLength, 50_000)
    assert.equal(config.maxTags, 50)
    assert.equal(config.rejectDuplicates, true)
  })
})
