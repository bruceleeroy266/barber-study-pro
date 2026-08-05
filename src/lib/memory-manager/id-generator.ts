/**
 * PingOS Memory Manager — ID Generation Strategy
 *
 * Abstracts how memory IDs are generated so the storage backend can own
 * identity without coupling the rest of the system to a specific scheme.
 *
 * Design principles:
 * - Single responsibility: only produces unique IDs.
 * - Swappable: in-memory sequential IDs today; UUID/ULID or database-generated
 *   IDs (e.g., Supabase `gen_random_uuid()`) tomorrow.
 * - Stateless interface: implementations may keep internal counters, but the
 *   contract is a single `generate()` call.
 *
 * Future backends:
 * - In-memory: sequential IDs (this file's default).
 * - Supabase/Postgres: let the database generate the ID (return a placeholder
 *   or use a UUID strategy and let the DB column default take over).
 */

// ============================================================================
// ID GENERATOR INTERFACE
// ============================================================================

/**
 * Strategy for generating unique memory IDs.
 */
export interface IdGenerator {
  /**
   * Generates a new unique memory ID.
   *
   * @returns A unique identifier string.
   */
  generate(): string
}

// ============================================================================
// SEQUENTIAL ID GENERATOR (In-Memory Default)
// ============================================================================

/**
 * Generates simple sequential IDs suitable for in-memory storage and tests.
 * Format: `mem_<epochMs>_<counter>`.
 *
 * Not collision-resistant across processes — for persistence backends use a
 * UUID/ULID strategy or database-generated IDs instead.
 */
export class SequentialIdGenerator implements IdGenerator {
  private counter = 0

  generate(): string {
    this.counter += 1
    return `mem_${Date.now()}_${this.counter}`
  }
}

// ============================================================================
// UUID ID GENERATOR
// ============================================================================

/**
 * Generates RFC 4122 v4 UUIDs. Suitable for distributed or persistent
 * storage where sequential IDs are not unique enough.
 *
 * Uses the Web Crypto `randomUUID()` available in Node 16.17+ and browsers.
 */
export class UuidIdGenerator implements IdGenerator {
  generate(): string {
    // globalThis.crypto.randomUUID() is available in Node 16.17+ and modern browsers.
    return globalThis.crypto.randomUUID()
  }
}
