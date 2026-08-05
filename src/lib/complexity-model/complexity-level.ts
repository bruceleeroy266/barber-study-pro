/**
 * Task Complexity Analyzer — Complexity Levels
 *
 * Strongly typed model for the qualitative size of a task. Levels are ordered
 * by `rank` (ascending effort/impact) and carry no scoring logic — they are
 * descriptive labels only. Calculation and mapping from scores to levels live
 * in a later milestone.
 *
 * Milestone 1: foundation only — no logic, no scoring.
 */

// ============================================================================
// COMPLEXITY LEVEL IDENTIFIER
// ============================================================================

/**
 * Stable identifier for each complexity level.
 */
export enum ComplexityLevel {
  Tiny = 'tiny',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  VeryLarge = 'very_large',
  Extreme = 'extreme',
}

// ============================================================================
// COMPLEXITY LEVEL DEFINITION
// ============================================================================

/**
 * Descriptive metadata for a single complexity level.
 */
export interface ComplexityLevelDefinition {
  /** Stable identifier. */
  id: ComplexityLevel

  /** Human-readable name for display. */
  displayName: string

  /** What this level represents. */
  description: string

  /**
   * Numeric rank for ordering. Higher rank = greater complexity.
   * Ranks are ordinal, not scores — they establish sequence only.
   */
  rank: number
}

// ============================================================================
// COMPLEXITY LEVEL REGISTRY
// ============================================================================

/**
 * Central registry of all complexity levels, keyed by identifier.
 * Single source of truth — no level metadata is hardcoded elsewhere.
 */
export const ComplexityLevelRegistry: Record<ComplexityLevel, ComplexityLevelDefinition> = {
  [ComplexityLevel.Tiny]: {
    id: ComplexityLevel.Tiny,
    displayName: 'Tiny',
    description: 'A trivial change confined to a single location with no ripple effects.',
    rank: 1,
  },
  [ComplexityLevel.Small]: {
    id: ComplexityLevel.Small,
    displayName: 'Small',
    description: 'A contained change touching a few files with minimal impact.',
    rank: 2,
  },
  [ComplexityLevel.Medium]: {
    id: ComplexityLevel.Medium,
    displayName: 'Medium',
    description: 'A moderate change spanning multiple files or a single subsystem.',
    rank: 3,
  },
  [ComplexityLevel.Large]: {
    id: ComplexityLevel.Large,
    displayName: 'Large',
    description: 'A significant change crossing subsystems or affecting public APIs.',
    rank: 4,
  },
  [ComplexityLevel.VeryLarge]: {
    id: ComplexityLevel.VeryLarge,
    displayName: 'Very Large',
    description: 'A major change with broad architectural or cross-cutting impact.',
    rank: 5,
  },
  [ComplexityLevel.Extreme]: {
    id: ComplexityLevel.Extreme,
    displayName: 'Extreme',
    description: 'A foundational change affecting the whole system or its core design.',
    rank: 6,
  },
}

// ============================================================================
// HELPERS (lookup only — no scoring)
// ============================================================================

/**
 * Returns the definition for a complexity level.
 */
export function getComplexityLevelDefinition(level: ComplexityLevel): ComplexityLevelDefinition {
  return ComplexityLevelRegistry[level]
}

/**
 * Returns all complexity levels ordered by ascending rank.
 */
export function getComplexityLevelsByRank(): ComplexityLevelDefinition[] {
  return Object.values(ComplexityLevelRegistry).sort((a, b) => a.rank - b.rank)
}
