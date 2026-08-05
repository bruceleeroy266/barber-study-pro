/**
 * PingOS Memory Manager — MemoryStore Abstraction
 *
 * MemoryStore is the single seam between the memory subsystem and its
 * storage backend. It owns persistence concerns: storing memories, reading
 * them back, updating, deleting, counting, clearing, and identity generation.
 *
 * Design principles:
 * - Storage-only: no admission, classification, or coordination logic.
 * - Read side is a superset of MemoryLookup, so a store can be passed directly
 *   to AdmissionController for duplicate detection.
 * - Swappable: InMemoryStore today; Supabase/SQLite/semantic stores tomorrow
 *   implement the same interface without touching MemoryManager.
 *
 * Dependency direction:
 *   MemoryManager ──────► MemoryStore (interface)
 *   AdmissionController ─► MemoryLookup (read-only subset)
 *                                ▲
 *   InMemoryStore ───────────────┘ (implements both)
 *
 * Keeping MemoryLookup as the narrow read-only interface means the controller
 * never sees mutation operations, while the store remains the single source
 * of truth for both reads and writes.
 */

import { Memory } from './types'
import { MemoryLookup } from './memory-lookup'

// ============================================================================
// MEMORY STORE INTERFACE
// ============================================================================

/**
 * Storage backend for memories.
 *
 * Extends MemoryLookup (findById / getAll / count) with the write and
 * lifecycle operations a backend must support. Implementations must be the
 * single source of truth for the memories they hold.
 */
export interface MemoryStore extends MemoryLookup {
  /**
   * Persists a fully-formed memory. The store is responsible for assigning
   * the memory's `id` (via its identity strategy) if not already meaningful
   * for the backend; callers should treat the returned memory as canonical.
   *
   * @param memory - The memory to store (id may be a placeholder).
   * @returns The stored memory, including its canonical id.
   */
  insert(memory: Memory): Memory

  /**
   * Replaces an existing memory with the provided version.
   *
   * @param memory - The full memory to persist (matched by `id`).
   * @returns The updated memory, or undefined if no memory with that id exists.
   */
  update(memory: Memory): Memory | undefined

  /**
   * Removes a memory by id.
   *
   * @param id - The memory id.
   * @returns True if a memory was removed, false if not found.
   */
  delete(id: string): boolean

  /**
   * Removes all memories from the store.
   */
  clear(): void

  /**
   * Generates a new unique id using the store's identity strategy.
   * Exposed so the coordinator can build a complete Memory before insert.
   */
  generateId(): string
}
