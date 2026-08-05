/**
 * PingOS Memory Manager — In-Memory Store
 *
 * The default MemoryStore implementation, backed by a `Map<string, Memory>`.
 * Suitable for Phase 1 (no persistence), unit tests, and development.
 *
 * Identity is delegated to an IdGenerator strategy (SequentialIdGenerator by
 * default), so swapping to UUIDs or database-generated IDs does not require
 * changing this class.
 *
 * For persistent backends (Supabase, SQLite), implement MemoryStore against
 * the database instead of a Map; MemoryManager and AdmissionController will
 * work unchanged.
 */

import { Memory } from './types'
import { MemoryStore } from './memory-store'
import { IdGenerator, SequentialIdGenerator } from './id-generator'

// ============================================================================
// IN-MEMORY STORE
// ============================================================================

export class InMemoryStore implements MemoryStore {
  /** Backing collection. */
  private readonly memories: Map<string, Memory> = new Map()

  /** Identity strategy for new memories. */
  private readonly idGenerator: IdGenerator

  /**
   * @param idGenerator - Optional identity strategy. Defaults to sequential IDs.
   */
  constructor(idGenerator: IdGenerator = new SequentialIdGenerator()) {
    this.idGenerator = idGenerator
  }

  // --------------------------------------------------------------------------
  // WRITE
  // --------------------------------------------------------------------------

  insert(memory: Memory): Memory {
    this.memories.set(memory.id, memory)
    return memory
  }

  update(memory: Memory): Memory | undefined {
    if (!this.memories.has(memory.id)) return undefined
    this.memories.set(memory.id, memory)
    return memory
  }

  delete(id: string): boolean {
    return this.memories.delete(id)
  }

  clear(): void {
    this.memories.clear()
  }

  // --------------------------------------------------------------------------
  // READ (MemoryLookup)
  // --------------------------------------------------------------------------

  findById(id: string): Memory | undefined {
    return this.memories.get(id)
  }

  getAll(): readonly Memory[] {
    return Array.from(this.memories.values())
  }

  count(): number {
    return this.memories.size
  }

  // --------------------------------------------------------------------------
  // IDENTITY
  // --------------------------------------------------------------------------

  generateId(): string {
    return this.idGenerator.generate()
  }
}
