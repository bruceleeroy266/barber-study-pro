/**
 * Task Planner — Step Priority Strategy
 *
 * Deterministic strategy that maps phase names and step names to execution
 * priorities. Centralizes the rules for assigning priority to generated
 * TaskSteps.
 *
 * Milestone 1.4.3: step prioritization strategy only.
 */

// ============================================================================
// STEP PRIORITY
// ============================================================================

/**
 * Execution priority levels for task steps.
 * Ordered from highest to lowest priority.
 */
export enum StepPriority {
  Critical = 'critical',
  High = 'high',
  Normal = 'normal',
  Low = 'low',
}

// ============================================================================
// STEP PRIORITY STRATEGY
// ============================================================================

/**
 * Deterministic strategy that maps phase names and step names to execution
 * priorities.
 *
 * The strategy uses a centralized mapping from (phaseName, stepName) to
 * StepPriority. The same inputs always produce the same priority.
 */
export class StepPriorityStrategy {
  /**
   * Centralized mapping from (phaseName, stepName) to StepPriority.
   * Key format: `${phaseName}:${stepName}`
   */
  private static readonly PRIORITY_MAP: Record<string, StepPriority> = {
    // Preparation Phase
    'Preparation:Prepare Environment': StepPriority.Critical,

    // Implementation Phase
    'Implementation:Prepare Work': StepPriority.High,
    'Implementation:Execute Work': StepPriority.Critical,
    'Implementation:Verify Work': StepPriority.High,
    'Implementation:Final Review': StepPriority.Normal,

    // Validation Phase
    'Validation:Validate Results': StepPriority.High,

    // Finalization Phase
    'Finalization:Final Cleanup': StepPriority.Low,
  }

  /**
   * Default priority for unmapped steps.
   */
  private static readonly DEFAULT_PRIORITY: StepPriority = StepPriority.Normal

  /**
   * Returns the execution priority for a given phase and step.
   *
   * @param phaseName - The name of the phase (e.g., "Implementation").
   * @param stepName - The name of the step (e.g., "Execute Work").
   * @returns The StepPriority for the step.
   */
  getPriority(phaseName: string, stepName: string): StepPriority {
    const key = `${phaseName}:${stepName}`
    return StepPriorityStrategy.PRIORITY_MAP[key] ?? StepPriorityStrategy.DEFAULT_PRIORITY
  }

  /**
   * Checks whether a priority mapping exists for the given phase and step.
   *
   * @param phaseName - The name of the phase.
   * @param stepName - The name of the step.
   * @returns True if a specific mapping exists, false if using default.
   */
  hasMapping(phaseName: string, stepName: string): boolean {
    const key = `${phaseName}:${stepName}`
    return key in StepPriorityStrategy.PRIORITY_MAP
  }
}
