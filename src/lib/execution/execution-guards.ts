/**
 * Execution — Guard Utilities
 *
 * Shared defensive guards for the execution preparation pipeline.
 * Every public entry point should validate inputs before proceeding.
 * Guards never throw — they return diagnostic information.
 *
 * Milestone 10.2.1: execution hardening only.
 */

// ============================================================================
// GUARD RESULT
// ============================================================================

/**
 * Result of a guard check. Contains diagnostic information on failure.
 */
export interface GuardResult {
  /** Whether the guard passed. */
  readonly passed: boolean

  /** Human-readable diagnostic message when the guard fails. */
  readonly message: string

  /** The name of the guard that produced this result. */
  readonly guardName: string
}

// ============================================================================
// GUARD FUNCTIONS
// ============================================================================

/**
 * Creates a passing guard result.
 */
export function guardPass(guardName: string): GuardResult {
  return { passed: true, message: '', guardName }
}

/**
 * Creates a failing guard result with diagnostic information.
 */
export function guardFail(guardName: string, message: string): GuardResult {
  return { passed: false, message, guardName }
}

/**
 * Guards that a value is not null or undefined.
 *
 * @param value - The value to check.
 * @param name - Human-readable name for diagnostics.
 * @returns GuardResult indicating pass/fail.
 */
export function requireNonNull<T>(
  value: T | null | undefined,
  name: string
): GuardResult {
  if (value === null || value === undefined) {
    return guardFail('requireNonNull', `${name} is null or undefined.`)
  }
  return guardPass('requireNonNull')
}

/**
 * Guards that a string is not null, undefined, or empty.
 *
 * @param value - The string to check.
 * @param name - Human-readable name for diagnostics.
 * @returns GuardResult indicating pass/fail.
 */
export function requireNonEmptyString(
  value: string | null | undefined,
  name: string
): GuardResult {
  if (value === null || value === undefined) {
    return guardFail('requireNonEmptyString', `${name} is null or undefined.`)
  }
  if (typeof value !== 'string' || value.trim().length === 0) {
    return guardFail('requireNonEmptyString', `${name} is empty or not a string.`)
  }
  return guardPass('requireNonEmptyString')
}

/**
 * Guards that an array is not null, undefined, or empty.
 *
 * @param value - The array to check.
 * @param name - Human-readable name for diagnostics.
 * @returns GuardResult indicating pass/fail.
 */
export function requireNonEmptyArray<T>(
  value: readonly T[] | null | undefined,
  name: string
): GuardResult {
  if (value === null || value === undefined) {
    return guardFail('requireNonEmptyArray', `${name} is null or undefined.`)
  }
  if (!Array.isArray(value) || value.length === 0) {
    return guardFail('requireNonEmptyArray', `${name} is empty or not an array.`)
  }
  return guardPass('requireNonEmptyArray')
}

/**
 * Guards that a value has a specific property.
 *
 * @param value - The object to check.
 * @param property - The property name to look for.
 * @param name - Human-readable name for diagnostics.
 * @returns GuardResult indicating pass/fail.
 */
export function requireProperty<T extends object>(
  value: T | null | undefined,
  property: string,
  name: string
): GuardResult {
  if (value === null || value === undefined) {
    return guardFail('requireProperty', `${name} is null or undefined.`)
  }
  if (!(property in value)) {
    return guardFail('requireProperty', `${name} is missing required property '${property}'.`)
  }
  return guardPass('requireProperty')
}

/**
 * Combines multiple guard results into a single result.
 * Returns the first failure, or a pass if all succeed.
 *
 * @param results - The guard results to combine.
 * @returns The first failing GuardResult, or a passing result.
 */
export function combineGuards(...results: GuardResult[]): GuardResult {
  for (const result of results) {
    if (!result.passed) {
      return result
    }
  }
  return guardPass('combineGuards')
}

// ============================================================================
// HASH UTILITY
// ============================================================================

/**
 * Generates a deterministic hash from a string.
 * Shared utility to eliminate duplication across modules.
 *
 * @param input - The string to hash.
 * @returns A deterministic base-36 hash string.
 */
export function hashString(input: string): string {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}
