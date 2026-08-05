/**
 * PingOS Memory Manager — Memory Lookup Interface
 *
 * A minimal, read-only interface for querying existing memories.
 * Used by AdmissionController for duplicate detection without creating
 * a circular dependency on the concrete MemoryManager class.
 *
 * Design principles:
 * - Read-only: No mutation operations exposed
 * - Minimal: Only operations needed for admission decisions
 * - Abstraction: Breaks the circular dependency between AdmissionController and MemoryManager
 *
 * Dependency direction:
 *   AdmissionController ──► MemoryLookup (interface)
 *                                 ▲
 *   MemoryManager ────────────────┘
 */

import { Memory } from './types'

// ============================================================================
// MEMORY LOOKUP INTERFACE
// ============================================================================

/**
 * Read-only interface for querying existing memories.
 * Implemented by MemoryManager to provide duplicate detection capabilities
 * to AdmissionController without circular dependencies.
 */
export interface MemoryLookup {
  /**
   * Retrieves a memory by its unique identifier.
   *
   * @param id - The memory ID to look up.
   * @returns The memory if found, undefined otherwise.
   */
  findById(id: string): Memory | undefined

  /**
   * Returns all memories in the store.
   * Used by duplicate detection to compare against existing content.
   *
   * @returns Array of all memories (read-only).
   */
  getAll(): readonly Memory[]

  /**
   * Returns the total count of memories in the store.
   * Useful for quick checks and statistics.
   *
   * @returns The number of memories.
   */
  count(): number
}

// ============================================================================
// TYPE GUARD
// ============================================================================

/**
 * Type guard to check if an object implements MemoryLookup.
 * Useful for runtime validation in tests and dependency injection.
 */
export function isMemoryLookup(obj: unknown): obj is MemoryLookup {
  if (typeof obj !== 'object' || obj === null) return false
  const lookup = obj as MemoryLookup
  return (
    typeof lookup.findById === 'function' &&
    typeof lookup.getAll === 'function' &&
    typeof lookup.count === 'function'
  )
}
