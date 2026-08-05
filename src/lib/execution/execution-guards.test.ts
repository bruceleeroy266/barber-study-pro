/**
 * Execution Guards — Unit Tests
 *
 * Comprehensive test suite for the shared guard utilities used across
 * the execution preparation pipeline.
 *
 * Run with: npx tsx --test src/lib/execution/execution-guards.test.ts
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  guardPass,
  guardFail,
  requireNonNull,
  requireNonEmptyString,
  requireNonEmptyArray,
  requireProperty,
  combineGuards,
  hashString,
} from './execution-guards'

// ============================================================================
// GUARD RESULT TESTS
// ============================================================================

describe('guardPass', () => {
  it('should return a passing result', () => {
    const result = guardPass('testGuard')
    assert.strictEqual(result.passed, true)
    assert.strictEqual(result.message, '')
    assert.strictEqual(result.guardName, 'testGuard')
  })
})

describe('guardFail', () => {
  it('should return a failing result with message', () => {
    const result = guardFail('testGuard', 'something went wrong')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'something went wrong')
    assert.strictEqual(result.guardName, 'testGuard')
  })
})

// ============================================================================
// REQUIRE NON-NULL TESTS
// ============================================================================

describe('requireNonNull', () => {
  it('should pass for non-null values', () => {
    assert.strictEqual(requireNonNull('hello', 'testValue').passed, true)
    assert.strictEqual(requireNonNull(0, 'testValue').passed, true)
    assert.strictEqual(requireNonNull(false, 'testValue').passed, true)
    assert.strictEqual(requireNonNull({}, 'testValue').passed, true)
    assert.strictEqual(requireNonNull([], 'testValue').passed, true)
  })

  it('should fail for null', () => {
    const result = requireNonNull(null, 'testValue')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'testValue is null or undefined.')
    assert.strictEqual(result.guardName, 'requireNonNull')
  })

  it('should fail for undefined', () => {
    const result = requireNonNull(undefined, 'testValue')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'testValue is null or undefined.')
  })
})

// ============================================================================
// REQUIRE NON-EMPTY STRING TESTS
// ============================================================================

describe('requireNonEmptyString', () => {
  it('should pass for non-empty strings', () => {
    assert.strictEqual(requireNonEmptyString('hello', 'testValue').passed, true)
    assert.strictEqual(requireNonEmptyString('a', 'testValue').passed, true)
  })

  it('should fail for null', () => {
    const result = requireNonEmptyString(null, 'testValue')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'testValue is null or undefined.')
  })

  it('should fail for undefined', () => {
    const result = requireNonEmptyString(undefined, 'testValue')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'testValue is null or undefined.')
  })

  it('should fail for empty string', () => {
    const result = requireNonEmptyString('', 'testValue')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'testValue is empty or not a string.')
  })

  it('should fail for whitespace-only string', () => {
    const result = requireNonEmptyString('   ', 'testValue')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'testValue is empty or not a string.')
  })
})

// ============================================================================
// REQUIRE NON-EMPTY ARRAY TESTS
// ============================================================================

describe('requireNonEmptyArray', () => {
  it('should pass for non-empty arrays', () => {
    assert.strictEqual(requireNonEmptyArray([1], 'testValue').passed, true)
    assert.strictEqual(requireNonEmptyArray(['a', 'b'], 'testValue').passed, true)
  })

  it('should fail for null', () => {
    const result = requireNonEmptyArray(null, 'testValue')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'testValue is null or undefined.')
  })

  it('should fail for undefined', () => {
    const result = requireNonEmptyArray(undefined, 'testValue')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'testValue is null or undefined.')
  })

  it('should fail for empty array', () => {
    const result = requireNonEmptyArray([], 'testValue')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'testValue is empty or not an array.')
  })
})

// ============================================================================
// REQUIRE PROPERTY TESTS
// ============================================================================

describe('requireProperty', () => {
  it('should pass when property exists', () => {
    const obj = { id: '123', name: 'test' }
    assert.strictEqual(requireProperty(obj, 'id', 'testObject').passed, true)
    assert.strictEqual(requireProperty(obj, 'name', 'testObject').passed, true)
  })

  it('should fail for null object', () => {
    const result = requireProperty(null, 'id', 'testObject')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'testObject is null or undefined.')
  })

  it('should fail for undefined object', () => {
    const result = requireProperty(undefined, 'id', 'testObject')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'testObject is null or undefined.')
  })

  it('should fail when property is missing', () => {
    const obj = { id: '123' }
    const result = requireProperty(obj, 'missing', 'testObject')
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, "testObject is missing required property 'missing'.")
  })
})

// ============================================================================
// COMBINE GUARDS TESTS
// ============================================================================

describe('combineGuards', () => {
  it('should pass when all guards pass', () => {
    const result = combineGuards(
      guardPass('guard1'),
      guardPass('guard2'),
      guardPass('guard3')
    )
    assert.strictEqual(result.passed, true)
  })

  it('should return first failure', () => {
    const result = combineGuards(
      guardPass('guard1'),
      guardFail('guard2', 'second guard failed'),
      guardFail('guard3', 'third guard failed')
    )
    assert.strictEqual(result.passed, false)
    assert.strictEqual(result.message, 'second guard failed')
    assert.strictEqual(result.guardName, 'guard2')
  })

  it('should pass with no arguments', () => {
    const result = combineGuards()
    assert.strictEqual(result.passed, true)
  })
})

// ============================================================================
// HASH STRING TESTS
// ============================================================================

describe('hashString', () => {
  it('should produce deterministic output', () => {
    const hash1 = hashString('test')
    const hash2 = hashString('test')
    assert.strictEqual(hash1, hash2)
  })

  it('should produce different output for different inputs', () => {
    const hash1 = hashString('test1')
    const hash2 = hashString('test2')
    assert.notStrictEqual(hash1, hash2)
  })

  it('should return a string', () => {
    const hash = hashString('test')
    assert.strictEqual(typeof hash, 'string')
  })

  it('should handle empty string', () => {
    const hash = hashString('')
    assert.strictEqual(typeof hash, 'string')
  })
})
