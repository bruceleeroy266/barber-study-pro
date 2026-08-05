/**
 * Task Planner — Step Dependency Strategy
 *
 * Deterministic strategy that assigns execution dependencies between
 * generated TaskSteps. Centralizes the rules for which steps must complete
 * before others can begin.
 *
 * Milestone 1.4.4: step dependency strategy only.
 */

import { StepDefinition } from './complexity-step-strategy'

// ============================================================================
// STEP DEPENDENCY STRATEGY
// ============================================================================

/**
 * Deterministic strategy that maps phase names and ordered step definitions
 * to dependency relationships.
 *
 * The strategy uses a centralized mapping from step name to the names of
 * its prerequisite steps. Dependencies are resolved to step IDs by the
 * StepGenerator after steps are created.
 *
 * The same inputs always produce the same dependency structure.
 */
export class StepDependencyStrategy {
  /**
   * Centralized mapping from step name to the names of its prerequisite steps.
   * An empty array means the step has no dependencies.
   */
  private static readonly DEPENDENCY_MAP: Record<string, readonly string[]> = {
    // Preparation Phase
    'Prepare Environment': [],

    // Implementation Phase
    'Prepare Work': [],
    'Execute Work': ['Prepare Work'],
    'Verify Work': ['Execute Work'],
    'Final Review': ['Verify Work'],

    // Validation Phase
    'Validate Results': [],

    // Finalization Phase
    'Final Cleanup': [],
  }

  /**
   * Returns the names of prerequisite steps for a given step.
   *
   * @param stepName - The name of the step to look up.
   * @returns Array of prerequisite step names (empty if none).
   */
  getDependencyNames(stepName: string): readonly string[] {
    return StepDependencyStrategy.DEPENDENCY_MAP[stepName] ?? []
  }

  /**
   * Resolves dependency names to step IDs for a given set of ordered steps.
   *
   * For each step definition, looks up its dependency names and maps them
   * to the IDs that those steps will have within the same phase.
   *
   * @param phaseId - The ID of the parent phase (used to construct step IDs).
   * @param stepDefinitions - The ordered step definitions for the phase.
   * @returns An array of dependency ID arrays, parallel to stepDefinitions.
   */
  resolveDependencies(
    phaseId: string,
    stepDefinitions: readonly StepDefinition[]
  ): readonly (readonly string[])[] {
    // Build a lookup from step name to its generated ID
    const nameToId = new Map<string, string>()
    stepDefinitions.forEach((definition, index) => {
      nameToId.set(definition.name, `${phaseId}-step-${index + 1}`)
    })

    // Resolve each step's dependency names to IDs
    return stepDefinitions.map((definition) => {
      const dependencyNames = this.getDependencyNames(definition.name)
      return dependencyNames
        .map((name) => nameToId.get(name))
        .filter((id): id is string => id !== undefined)
    })
  }
}
