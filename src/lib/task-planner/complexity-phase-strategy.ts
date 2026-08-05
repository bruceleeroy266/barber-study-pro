/**
 * Task Planner — Complexity-Based Phase Strategy
 *
 * Deterministic strategy that maps complexity levels to phase definitions.
 * Centralizes the rules for how many phases to generate based solely on
 * the ComplexityReport.
 *
 * Milestone 1.4.1: complexity-based phase strategy only.
 */

import { ComplexityLevel } from '../complexity-model/complexity-level'
import { ComplexityReport } from '../complexity-model/complexity-report'

// ============================================================================
// PHASE DEFINITION
// ============================================================================

/**
 * A template for a phase to be generated.
 * Contains only the information needed to create a phase — no steps.
 */
export interface PhaseDefinition {
  /** Human-readable name of the phase. */
  readonly name: string

  /** Brief description of what this phase accomplishes. */
  readonly description: string
}

// ============================================================================
// COMPLEXITY PHASE STRATEGY
// ============================================================================

/**
 * Deterministic strategy that maps complexity levels to phase definitions.
 *
 * The strategy uses a centralized mapping from ComplexityLevel to an ordered
 * list of phase definitions. The same complexity level always produces the
 * same phases.
 */
export class ComplexityPhaseStrategy {
  /**
   * Centralized mapping from complexity level to phase definitions.
   * Ordered by phase sequence (index = order).
   */
  private static readonly PHASE_MAP: Record<ComplexityLevel, readonly PhaseDefinition[]> = {
    [ComplexityLevel.Tiny]: [
      { name: 'Implementation', description: 'Execute the task.' },
    ],
    [ComplexityLevel.Small]: [
      { name: 'Implementation', description: 'Execute the task.' },
    ],
    [ComplexityLevel.Medium]: [
      { name: 'Preparation', description: 'Set up prerequisites and context.' },
      { name: 'Implementation', description: 'Execute the task.' },
    ],
    [ComplexityLevel.Large]: [
      { name: 'Preparation', description: 'Set up prerequisites and context.' },
      { name: 'Implementation', description: 'Execute the task.' },
      { name: 'Validation', description: 'Verify correctness and completeness.' },
    ],
    [ComplexityLevel.VeryLarge]: [
      { name: 'Preparation', description: 'Set up prerequisites and context.' },
      { name: 'Implementation', description: 'Execute the task.' },
      { name: 'Validation', description: 'Verify correctness and completeness.' },
      { name: 'Finalization', description: 'Finalize and clean up.' },
    ],
    [ComplexityLevel.Extreme]: [
      { name: 'Preparation', description: 'Set up prerequisites and context.' },
      { name: 'Implementation', description: 'Execute the task.' },
      { name: 'Validation', description: 'Verify correctness and completeness.' },
      { name: 'Finalization', description: 'Finalize and clean up.' },
    ],
  }

  /**
   * Returns the ordered phase definitions for a given complexity report.
   *
   * @param report - The complexity report containing the level.
   * @returns Ordered array of phase definitions (index = phase order).
   */
  getPhases(report: ComplexityReport): readonly PhaseDefinition[] {
    return ComplexityPhaseStrategy.PHASE_MAP[report.level]
  }

  /**
   * Returns the number of phases for a given complexity report.
   *
   * @param report - The complexity report containing the level.
   * @returns The number of phases that will be generated.
   */
  getPhaseCount(report: ComplexityReport): number {
    return this.getPhases(report).length
  }
}
