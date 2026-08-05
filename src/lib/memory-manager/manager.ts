/**
 * PingOS Memory Manager — Central Entry Point
 *
 * The MemoryManager class is the single entry point for all memory operations.
 * It provides a clean API for creating, reading, updating, and classifying
 * memories while hiding internal storage and routing details.
 *
 * Phase 1: Foundation only — in-memory storage with no persistence.
 * Future phases will add database backends, retrieval engines, and
 * automatic learning pipelines.
 *
 * Usage:
 *   const manager = new MemoryManager()
 *   const memory = manager.create({ title: '...', type: MemoryType.CodePattern, ... })
 *   const classified = manager.classify(memory)
 */

import {
  Memory,
  MemoryCategory,
  MemoryType,
  ConfidenceLevel,
  CreateMemoryInput,
  UpdateMemoryInput,
  isMemoryType,
  isMemoryCategory,
} from './types'
import { classifyMemory, classifyMemories, ClassificationResult } from './classifier'
import { getCategoryForType, getActiveCategories } from './categories'
import { AdmissionController } from './admission-controller'
import { AdmissionDecision, AdmissionResult, Priority } from './admission-types'
import { MemoryLookup } from './memory-lookup'
import { MemoryStore } from './memory-store'
import { InMemoryStore } from './in-memory-store'

// ============================================================================
// ADMISSION METADATA
// ============================================================================

/**
 * Shape of the `_admission` record embedded into a stored memory's `metadata`
 * when the memory is created through the Admission Controller pipeline.
 * Exported so consumers and tests can read admission metadata in a typed way.
 */
export interface AdmissionMetadata {
  /** Priority assigned by the Admission Controller. */
  priority: Priority

  /** The admission decision that led to storage. */
  decision: AdmissionDecision

  /** Human-readable explanation of the decision. */
  reason: string

  /** The rule that triggered the decision (if any). */
  triggeredRule?: string

  /** Non-fatal warnings generated during admission. */
  warnings: string[]

  /** ISO 8601 timestamp of when the memory was admitted. */
  admittedAt: string
}

// ============================================================================
// CREATE MEMORY RESULT
// ============================================================================

/**
 * Result of a create operation that went through the Admission Controller.
 * Wraps the stored memory with admission metadata for audit and debugging.
 */
export interface CreateMemoryResult {
  /** The stored memory (undefined if rejected). */
  memory?: Memory

  /** Whether the memory was successfully stored. */
  stored: boolean

  /** The admission decision that led to this result. */
  decision: AdmissionDecision

  /** The priority assigned by the Admission Controller. */
  priority: Priority

  /** Human-readable explanation of the admission decision. */
  reason: string

  /** Any warnings generated during admission. */
  warnings: string[]

  /** The rule that triggered the admission decision. */
  triggeredRule?: string

  /** The full admission result (for advanced use cases). */
  admissionResult: AdmissionResult
}

// ============================================================================
// MEMORY MANAGER OPTIONS
// ============================================================================

/**
 * Configuration options for creating a MemoryManager.
 */
export interface MemoryManagerOptions {
  /**
   * Optional AdmissionController instance. If provided, all create()
   * operations will route through admission control. If omitted, create()
   * falls back to legacy behavior (direct storage with basic validation).
   *
   * For production use, always provide an AdmissionController.
   */
  admissionController?: AdmissionController

  /**
   * Optional storage backend. Defaults to a new InMemoryStore.
   *
   * Provide a shared store when an AdmissionController must see the same
   * memories the manager writes (e.g., for duplicate detection):
   *   const store = new InMemoryStore()
   *   const controller = new AdmissionController(store)
   *   const manager = new MemoryManager({ store, admissionController: controller })
   */
  store?: MemoryStore

  /**
   * Whether to throw on admission rejection. Default: false.
   * When false, rejected memories return a CreateMemoryResult with stored=false.
   * When true, rejected memories throw an Error with the rejection reason.
   */
  throwOnRejection?: boolean
}

// ============================================================================
// MEMORY MANAGER
// ============================================================================

export class MemoryManager implements MemoryLookup {
  /** Storage backend. Owns persistence and identity generation. */
  private readonly store: MemoryStore

  /** Optional AdmissionController for gating memory creation. */
  private readonly admissionController?: AdmissionController

  /** Whether to throw on admission rejection. */
  private readonly throwOnRejection: boolean

  /**
   * Creates a new MemoryManager.
   *
   * @param options - Configuration options including optional AdmissionController
   *   and storage backend.
   */
  constructor(options: MemoryManagerOptions = {}) {
    this.store = options.store ?? new InMemoryStore()
    this.admissionController = options.admissionController
    this.throwOnRejection = options.throwOnRejection ?? false
  }

  /**
   * Returns the underlying storage backend.
   *
   * Useful for sharing the store with an AdmissionController so duplicate
   * detection sees the same memories the manager writes, and for tests that
   * need direct store access.
   */
  getStore(): MemoryStore {
    return this.store
  }

  // --------------------------------------------------------------------------
  // CREATE
  // --------------------------------------------------------------------------

  /**
   * Creates a new memory and stores it.
   *
   * When an AdmissionController is configured, the input is first evaluated
   * through the admission pipeline. The result includes admission metadata
   * (decision, priority, reason, warnings).
   *
   * When no AdmissionController is configured, falls back to legacy behavior
   * (direct storage with basic validation).
   *
   * @param input - The memory creation input.
   * @returns CreateMemoryResult with the stored memory and admission metadata.
   * @throws If throwOnRejection is true and the memory is rejected.
   */
  create(input: CreateMemoryInput): CreateMemoryResult {
    // Route through Admission Controller if configured
    if (this.admissionController) {
      return this.createWithAdmission(input)
    }

    // Legacy path: direct storage with basic validation
    return this.createLegacy(input)
  }

  /**
   * Creates a memory through the Admission Controller pipeline.
   */
  private createWithAdmission(input: CreateMemoryInput): CreateMemoryResult {
    const admissionResult = this.admissionController!.admit(input)

    // Handle rejection
    if (admissionResult.decision === AdmissionDecision.Reject) {
      if (this.throwOnRejection) {
        throw new Error(`Memory rejected: ${admissionResult.reason}`)
      }
      return {
        stored: false,
        decision: admissionResult.decision,
        priority: admissionResult.priority,
        reason: admissionResult.reason,
        warnings: admissionResult.warnings,
        triggeredRule: admissionResult.triggeredRule,
        admissionResult,
      }
    }

    // Use normalized memory if provided, otherwise use original input
    const memoryToStore = admissionResult.normalizedMemory ?? input

    // Store the memory
    const now = new Date().toISOString()
    const id = this.store.generateId()

    const memory: Memory = {
      id,
      title: memoryToStore.title,
      type: memoryToStore.type,
      category: memoryToStore.category,
      tags: memoryToStore.tags ?? [],
      createdAt: now,
      updatedAt: now,
      confidence: memoryToStore.confidence ?? ConfidenceLevel.Unverified,
      verified: memoryToStore.verified ?? false,
      source: memoryToStore.source,
      content: memoryToStore.content,
      metadata: {
        ...memoryToStore.metadata,
        // Preserve admission metadata in memory metadata
        _admission: {
          priority: admissionResult.priority,
          decision: admissionResult.decision,
          reason: admissionResult.reason,
          triggeredRule: admissionResult.triggeredRule,
          warnings: admissionResult.warnings,
          admittedAt: now,
        },
      },
    }

    this.store.insert(memory)

    return {
      memory,
      stored: true,
      decision: admissionResult.decision,
      priority: admissionResult.priority,
      reason: admissionResult.reason,
      warnings: admissionResult.warnings,
      triggeredRule: admissionResult.triggeredRule,
      admissionResult,
    }
  }

  /**
   * Legacy create path without admission control.
   * Used when no AdmissionController is configured.
   */
  private createLegacy(input: CreateMemoryInput): CreateMemoryResult {
    this.validateCreateInput(input)

    const now = new Date().toISOString()
    const id = this.store.generateId()

    const memory: Memory = {
      id,
      title: input.title,
      type: input.type,
      category: input.category,
      tags: input.tags ?? [],
      createdAt: now,
      updatedAt: now,
      confidence: input.confidence ?? ConfidenceLevel.Unverified,
      verified: input.verified ?? false,
      source: input.source,
      content: input.content,
      metadata: input.metadata,
    }

    this.store.insert(memory)

    // Return a synthetic admission result for API consistency
    const syntheticAdmissionResult: AdmissionResult = {
      decision: AdmissionDecision.Accept,
      priority: Priority.P3,
      reason: 'Accepted: legacy path — no admission controller configured.',
      warnings: [],
      normalizedMemory: input,
      triggeredRule: 'legacy',
    }

    return {
      memory,
      stored: true,
      decision: AdmissionDecision.Accept,
      priority: Priority.P3,
      reason: syntheticAdmissionResult.reason,
      warnings: [],
      triggeredRule: 'legacy',
      admissionResult: syntheticAdmissionResult,
    }
  }

  /**
   * Creates a memory without any admission control or validation.
   * Use with extreme caution — bypasses all safety checks.
   *
   * @param input - The memory creation input.
   * @returns The created memory.
   * @throws If the input is fundamentally invalid (missing required fields).
   */
  createUnsafe(input: CreateMemoryInput): Memory {
    this.validateCreateInput(input)

    const now = new Date().toISOString()
    const id = this.store.generateId()

    const memory: Memory = {
      id,
      title: input.title,
      type: input.type,
      category: input.category,
      tags: input.tags ?? [],
      createdAt: now,
      updatedAt: now,
      confidence: input.confidence ?? ConfidenceLevel.Unverified,
      verified: input.verified ?? false,
      source: input.source,
      content: input.content,
      metadata: input.metadata,
    }

    this.store.insert(memory)
    return memory
  }

  // --------------------------------------------------------------------------
  // READ
  // --------------------------------------------------------------------------

  /**
   * Retrieves a memory by ID.
   * Implements MemoryLookup.findById().
   *
   * @param id - The memory ID.
   * @returns The memory, or undefined if not found.
   */
  findById(id: string): Memory | undefined {
    return this.store.findById(id)
  }

  /**
   * Retrieves a memory by ID.
   * Alias for findById() for backward compatibility.
   *
   * @param id - The memory ID.
   * @returns The memory, or undefined if not found.
   */
  getById(id: string): Memory | undefined {
    return this.findById(id)
  }

  /**
   * Returns all memories in the store.
   * Implements MemoryLookup.getAll().
   * Phase 1: No filtering or pagination — use with caution on large datasets.
   */
  getAll(): Memory[] {
    return Array.from(this.store.getAll())
  }

  /**
   * Returns all memories in a specific category.
   */
  getByCategory(category: MemoryCategory): Memory[] {
    return this.getAll().filter((m) => m.category === category)
  }

  /**
   * Returns all memories of a specific type.
   */
  getByType(type: MemoryType): Memory[] {
    return this.getAll().filter((m) => m.type === type)
  }

  /**
   * Returns all memories with a specific tag.
   */
  getByTag(tag: string): Memory[] {
    return this.getAll().filter((m) => m.tags.includes(tag))
  }

  /**
   * Returns all verified memories.
   */
  getVerified(): Memory[] {
    return this.getAll().filter((m) => m.verified)
  }

  /**
   * Returns all memories with confidence at or above a threshold.
   */
  getByConfidence(minConfidence: ConfidenceLevel): Memory[] {
    const order = [ConfidenceLevel.Unverified, ConfidenceLevel.Low, ConfidenceLevel.Medium, ConfidenceLevel.High]
    const minIndex = order.indexOf(minConfidence)
    return this.getAll().filter((m) => order.indexOf(m.confidence) >= minIndex)
  }

  // --------------------------------------------------------------------------
  // UPDATE
  // --------------------------------------------------------------------------

  /**
   * Updates an existing memory.
   *
   * @param input - The update input (ID required, all other fields optional).
   * @returns The updated memory, or undefined if not found.
   */
  update(input: UpdateMemoryInput): Memory | undefined {
    const existing = this.store.findById(input.id)
    if (!existing) return undefined

    const updated: Memory = {
      ...existing,
      title: input.title ?? existing.title,
      type: input.type ?? existing.type,
      category: input.category ?? existing.category,
      tags: input.tags ?? existing.tags,
      confidence: input.confidence ?? existing.confidence,
      verified: input.verified ?? existing.verified,
      source: input.source ?? existing.source,
      content: input.content ?? existing.content,
      metadata: input.metadata ?? existing.metadata,
      updatedAt: new Date().toISOString(),
    }

    this.store.update(updated)
    return updated
  }

  // --------------------------------------------------------------------------
  // DELETE
  // --------------------------------------------------------------------------

  /**
   * Deletes a memory by ID.
   *
   * @param id - The memory ID.
   * @returns True if deleted, false if not found.
   */
  delete(id: string): boolean {
    return this.store.delete(id)
  }

  // --------------------------------------------------------------------------
  // CLASSIFY
  // --------------------------------------------------------------------------

  /**
   * Classifies a memory object and returns the recommended category.
   * Does not modify the stored memory — use update() to apply changes.
   */
  classify(memory: {
    type?: string
    category?: string
    tags?: string[]
    title?: string
    content?: string
  }): ClassificationResult {
    return classifyMemory(memory)
  }

  /**
   * Classifies multiple memories in batch.
   */
  classifyBatch(
    memories: Array<{
      type?: string
      category?: string
      tags?: string[]
      title?: string
      content?: string
    }>
  ): ClassificationResult[] {
    return classifyMemories(memories)
  }

  /**
   * Re-classifies a stored memory and updates its category if different.
   * Returns the updated memory, or undefined if not found.
   */
  reclassify(id: string): Memory | undefined {
    const memory = this.store.findById(id)
    if (!memory) return undefined

    const result = classifyMemory(memory)
    if (result.category !== memory.category) {
      return this.update({ id, category: result.category })
    }
    return memory
  }

  // --------------------------------------------------------------------------
  // UTILITY
  // --------------------------------------------------------------------------

  /**
   * Returns the total number of memories in the store.
   */
  count(): number {
    return this.store.count()
  }

  /**
   * Returns statistics about the memory store.
   */
  getStats(): {
    total: number
    byCategory: Record<MemoryCategory, number>
    byType: Record<string, number>
    verified: number
    unverified: number
  } {
    const all = this.getAll()
    const byCategory = {} as Record<MemoryCategory, number>
    const byType: Record<string, number> = {}

    for (const cat of getActiveCategories()) {
      byCategory[cat] = 0
    }

    for (const m of all) {
      byCategory[m.category] = (byCategory[m.category] ?? 0) + 1
      byType[m.type] = (byType[m.type] ?? 0) + 1
    }

    return {
      total: all.length,
      byCategory,
      byType,
      verified: all.filter((m) => m.verified).length,
      unverified: all.filter((m) => !m.verified).length,
    }
  }

  /**
   * Clears all memories from the store.
   * Use with caution — this is irreversible in Phase 1.
   */
  clear(): void {
    this.store.clear()
  }

  // --------------------------------------------------------------------------
  // PRIVATE HELPERS
  // --------------------------------------------------------------------------

  /**
   * Validates create input. Throws on invalid data.
   */
  private validateCreateInput(input: CreateMemoryInput): void {
    if (!input.title || input.title.trim().length === 0) {
      throw new Error('Memory title is required.')
    }
    if (!input.content || input.content.trim().length === 0) {
      throw new Error('Memory content is required.')
    }
    if (!isMemoryType(input.type)) {
      throw new Error(`Invalid memory type: ${input.type}`)
    }
    if (!isMemoryCategory(input.category)) {
      throw new Error(`Invalid memory category: ${input.category}`)
    }
    if (!input.source || !input.source.origin) {
      throw new Error('Memory source with origin is required.')
    }

    // Warn if type and category are inconsistent (but don't throw)
    const expectedCategory = getCategoryForType(input.type)
    if (expectedCategory !== input.category) {
      console.warn(
        `Memory type "${input.type}" typically belongs to category "${expectedCategory}", ` +
          `but was assigned to "${input.category}". This may indicate a misclassification.`
      )
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default singleton instance for convenience.
 * Prefer dependency injection for testability in production code.
 *
 * Note: This singleton does NOT have an AdmissionController configured.
 * For production use with admission control, share a single store:
 *   const store = new InMemoryStore()
 *   const controller = new AdmissionController(store)
 *   const manager = new MemoryManager({ store, admissionController: controller })
 */
export const memoryManager = new MemoryManager()
