/**
 * Task Planner — Step Constraint Strategy
 *
 * Deterministic strategy that assigns execution constraints to generated
 * TaskSteps. Centralizes the rules for what kind of system interaction each
 * step is allowed to perform.
 *
 * Milestone 1.4.5: step constraint strategy only.
 */

// ============================================================================
// EXECUTION CONSTRAINT
// ============================================================================

/**
 * Execution constraint levels for task steps.
 * Describes the type of system interaction a step is permitted to perform.
 */
export enum ExecutionConstraint {
  /** No specific constraint — default for unmapped steps. */
  None = 'none',

  /** Step may only read/inspect — no modifications. */
  ReadOnly = 'read_only',

  /** Step may create or modify files. */
  FileModification = 'file_modification',

  /** Step performs validation or verification. */
  Validation = 'validation',

  /** Step performs cleanup or teardown. */
  Cleanup = 'cleanup',
}

// ============================================================================
// STEP CONSTRAINT STRATEGY
// ============================================================================

/**
 * Deterministic strategy that maps phase names and step names to execution
 * constraints.
 *
 * The strategy uses a centralized mapping from (phaseName, stepName) to
 * ExecutionConstraint. The same inputs always produce the same constraint.
 */
export class StepConstraintStrategy {
  /**
   * Centralized mapping from (phaseName, stepName) to ExecutionConstraint.
   * Key format: `${phaseName}:${stepName}`
   */
  private static readonly CONSTRAINT_MAP: Record<string, ExecutionConstraint> = {
    // Preparation Phase
    'Preparation:Prepare Environment': ExecutionConstraint.ReadOnly,

    // Implementation Phase
    'Implementation:Prepare Work': ExecutionConstraint.ReadOnly,
    'Implementation:Execute Work': ExecutionConstraint.FileModification,
    'Implementation:Verify Work': ExecutionConstraint.Validation,
    'Implementation:Final Review': ExecutionConstraint.Validation,

    // Validation Phase
    'Validation:Validate Results': ExecutionConstraint.Validation,

    // Finalization Phase
    'Finalization:Final Cleanup': ExecutionConstraint.Cleanup,
  }

  /**
   * Default constraint for unmapped steps.
   */
  private static readonly DEFAULT_CONSTRAINT: ExecutionConstraint = ExecutionConstraint.None

  /**
   * Returns the execution constraint for a given phase and step.
   *
   * @param phaseName - The name of the phase (e.g., "Implementation").
   * @param stepName - The name of the step (e.g., "Execute Work").
   * @returns The ExecutionConstraint for the step.
   */
  getConstraint(phaseName: string, stepName: string): ExecutionConstraint {
    const key = `${phaseName}:${stepName}`
    return StepConstraintStrategy.CONSTRAINT_MAP[key] ?? StepConstraintStrategy.DEFAULT_CONSTRAINT
  }

  /**
   * Checks whether a constraint mapping exists for the given phase and step.
   *
   * @param phaseName - The name of the phase.
   * @param stepName - The name of the step.
   * @returns True if a specific mapping exists, false if using default.
   */
  hasMapping(phaseName: string, stepName: string): boolean {
    const key = `${phaseName}:${stepName}`
    return key in StepConstraintStrategy.CONSTRAINT_MAP
  }
}
