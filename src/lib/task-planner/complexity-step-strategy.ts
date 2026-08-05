/**
 * Task Planner — Complexity-Based Step Strategy
 *
 * Deterministic strategy that maps complexity levels and phase types to
 * step definitions. Centralizes the rules for how many steps to generate
 * per phase based solely on the ComplexityReport and phase name.
 *
 * Milestone 1.4.2: complexity-based step strategy only.
 */

import { ComplexityLevel } from '../complexity-model/complexity-level'
import { ComplexityReport } from '../complexity-model/complexity-report'

// ============================================================================
// STEP DEFINITION
// ============================================================================

/**
 * A template for a step to be generated.
 * Contains only the information needed to create a step — no estimation.
 */
export interface StepDefinition {
  /** Human-readable name of the step. */
  readonly name: string

  /** Brief description of what this step accomplishes. */
  readonly description: string
}

// ============================================================================
// COMPLEXITY STEP STRATEGY
// ============================================================================

/**
 * Deterministic strategy that maps complexity levels and phase types to
 * ordered step definitions.
 *
 * The strategy uses centralized mappings:
 * - Implementation phase: steps vary by complexity level
 * - Preparation phase: always 1 step
 * - Validation phase: always 1 step
 * - Finalization phase: always 1 step
 *
 * The same inputs always produce the same step definitions.
 */
export class ComplexityStepStrategy {
  /**
   * Centralized mapping for Implementation phase steps by complexity level.
   */
  private static readonly IMPLEMENTATION_STEPS: Record<ComplexityLevel, readonly StepDefinition[]> = {
    [ComplexityLevel.Tiny]: [
      { name: 'Execute Work', description: 'Execute the task.' },
    ],
    [ComplexityLevel.Small]: [
      { name: 'Execute Work', description: 'Execute the task.' },
    ],
    [ComplexityLevel.Medium]: [
      { name: 'Prepare Work', description: 'Prepare for execution.' },
      { name: 'Execute Work', description: 'Execute the task.' },
    ],
    [ComplexityLevel.Large]: [
      { name: 'Prepare Work', description: 'Prepare for execution.' },
      { name: 'Execute Work', description: 'Execute the task.' },
      { name: 'Verify Work', description: 'Verify the work completed correctly.' },
    ],
    [ComplexityLevel.VeryLarge]: [
      { name: 'Prepare Work', description: 'Prepare for execution.' },
      { name: 'Execute Work', description: 'Execute the task.' },
      { name: 'Verify Work', description: 'Verify the work completed correctly.' },
      { name: 'Final Review', description: 'Perform final review and sign-off.' },
    ],
    [ComplexityLevel.Extreme]: [
      { name: 'Prepare Work', description: 'Prepare for execution.' },
      { name: 'Execute Work', description: 'Execute the task.' },
      { name: 'Verify Work', description: 'Verify the work completed correctly.' },
      { name: 'Final Review', description: 'Perform final review and sign-off.' },
    ],
  }

  /**
   * Fixed steps for non-Implementation phases.
   */
  private static readonly FIXED_PHASE_STEPS: Record<string, readonly StepDefinition[]> = {
    Preparation: [
      { name: 'Prepare Environment', description: 'Set up the working environment.' },
    ],
    Validation: [
      { name: 'Validate Results', description: 'Validate the results of the work.' },
    ],
    Finalization: [
      { name: 'Final Cleanup', description: 'Perform final cleanup and wrap-up.' },
    ],
  }

  /**
   * Returns the ordered step definitions for a given phase and complexity report.
   *
   * @param phaseName - The name of the phase (e.g., "Implementation", "Preparation").
   * @param report - The complexity report containing the level.
   * @returns Ordered array of step definitions (index = step order).
   */
  getSteps(phaseName: string, report: ComplexityReport): readonly StepDefinition[] {
    // Check for fixed phase steps first
    const fixedSteps = ComplexityStepStrategy.FIXED_PHASE_STEPS[phaseName]
    if (fixedSteps) {
      return fixedSteps
    }

    // Default to Implementation phase steps
    return ComplexityStepStrategy.IMPLEMENTATION_STEPS[report.level]
  }

  /**
   * Returns the number of steps for a given phase and complexity report.
   *
   * @param phaseName - The name of the phase.
   * @param report - The complexity report containing the level.
   * @returns The number of steps that will be generated.
   */
  getStepCount(phaseName: string, report: ComplexityReport): number {
    return this.getSteps(phaseName, report).length
  }
}
