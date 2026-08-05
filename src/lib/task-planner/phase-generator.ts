/**
 * Task Planner — Phase Generator
 *
 * Deterministic generator that populates a TaskPlan skeleton with high-level
 * TaskPhases based on the ComplexityReport. This milestone creates ONLY
 * phases — no steps, no estimation, no decomposition.
 *
 * Milestone 1.4.1: complexity-based phase generation.
 */

import { TaskPhase } from './task-phase'
import { TaskPlan } from './task-plan'
import { TaskPlannerRequest } from './task-planner-request'
import { ComplexityPhaseStrategy, PhaseDefinition } from './complexity-phase-strategy'

// ============================================================================
// PHASE GENERATOR
// ============================================================================

/**
 * Generates high-level TaskPhases for a TaskPlan based on complexity.
 *
 * Uses ComplexityPhaseStrategy to determine the number and names of phases
 * from the ComplexityReport. The generator is deterministic: the same
 * complexity level always produces the same phase structure.
 */
export class PhaseGenerator {
  private readonly strategy: ComplexityPhaseStrategy

  /**
   * Creates a new PhaseGenerator.
   *
   * @param strategy - The complexity-based phase strategy to use.
   *                   Defaults to a new ComplexityPhaseStrategy instance.
   */
  constructor(strategy?: ComplexityPhaseStrategy) {
    this.strategy = strategy ?? new ComplexityPhaseStrategy()
  }

  /**
   * Generates phases for a TaskPlan skeleton.
   *
   * @param request - The complete planning input.
   * @param skeletonPlan - The initial TaskPlan skeleton (with empty phases).
   * @returns A new TaskPlan with populated phases (steps remain empty).
   */
  generate(request: TaskPlannerRequest, skeletonPlan: TaskPlan): TaskPlan {
    const phaseDefinitions = this.strategy.getPhases(request.complexityReport)
    const phases = phaseDefinitions.map((definition, index) =>
      this.createPhase(definition, index, request)
    )

    return {
      ...skeletonPlan,
      phases,
      metadata: {
        ...skeletonPlan.metadata,
        phaseGeneration: {
          generatedBy: 'PhaseGenerator',
          generatedAt: new Date().toISOString(),
          plannerVersion: '1.4.1',
          phaseCount: phases.length,
          strategy: 'complexity_based',
          complexityLevel: request.complexityReport.level,
        },
      },
    }
  }

  /**
   * Creates a TaskPhase from a phase definition.
   *
   * @param definition - The phase definition from the strategy.
   * @param order - The zero-based order of this phase.
   * @param request - The planning request (for context in metadata).
   * @returns A TaskPhase with empty steps array.
   */
  private createPhase(
    definition: PhaseDefinition,
    order: number,
    request: TaskPlannerRequest
  ): TaskPhase {
    const phaseId = `phase-${order + 1}-${definition.name.toLowerCase().replace(/\s+/g, '-')}`

    return {
      id: phaseId,
      name: definition.name,
      order,
      steps: [],
      metadata: {
        generatedBy: 'PhaseGenerator',
        generatedAt: new Date().toISOString(),
        plannerVersion: '1.4.1',
        phaseType: 'complexity_based',
        description: definition.description,
        sourceRequest: {
          taskDescription: request.taskDescription,
          complexityLevel: request.complexityReport.level,
        },
      },
    }
  }
}
