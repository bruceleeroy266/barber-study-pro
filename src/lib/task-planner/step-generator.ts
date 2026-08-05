/**
 * Task Planner — Step Generator
 *
 * Deterministic generator that populates each TaskPhase with TaskSteps based
 * on the ComplexityReport and phase type. This milestone creates ONLY
 * placeholder steps — no estimation, no decomposition, no repository
 * inspection.
 *
 * Milestone 1.4.2: complexity-based step generation.
 */

import { TaskStep } from './task-step'
import { TaskPhase } from './task-phase'
import { TaskPlan } from './task-plan'
import { TaskPlannerRequest } from './task-planner-request'
import { ComplexityStepStrategy, StepDefinition } from './complexity-step-strategy'
import { StepPriorityStrategy } from './step-priority-strategy'
import { StepDependencyStrategy } from './step-dependency-strategy'
import { StepConstraintStrategy } from './step-constraint-strategy'

// ============================================================================
// STEP GENERATOR
// ============================================================================

/**
 * Generates TaskSteps for each phase in a TaskPlan based on complexity.
 *
 * Uses ComplexityStepStrategy to determine the number and names of steps
 * from the ComplexityReport and phase name. The generator is deterministic:
 * the same inputs always produce the same step structure.
 */
export class StepGenerator {
  private readonly strategy: ComplexityStepStrategy
  private readonly priorityStrategy: StepPriorityStrategy
  private readonly dependencyStrategy: StepDependencyStrategy
  private readonly constraintStrategy: StepConstraintStrategy

  /**
   * Creates a new StepGenerator.
   *
   * @param strategy - The complexity-based step strategy to use.
   *                   Defaults to a new ComplexityStepStrategy instance.
   * @param priorityStrategy - The step priority strategy to use.
   *                           Defaults to a new StepPriorityStrategy instance.
   * @param dependencyStrategy - The step dependency strategy to use.
   *                             Defaults to a new StepDependencyStrategy instance.
   * @param constraintStrategy - The step constraint strategy to use.
   *                             Defaults to a new StepConstraintStrategy instance.
   */
  constructor(
    strategy?: ComplexityStepStrategy,
    priorityStrategy?: StepPriorityStrategy,
    dependencyStrategy?: StepDependencyStrategy,
    constraintStrategy?: StepConstraintStrategy
  ) {
    this.strategy = strategy ?? new ComplexityStepStrategy()
    this.priorityStrategy = priorityStrategy ?? new StepPriorityStrategy()
    this.dependencyStrategy = dependencyStrategy ?? new StepDependencyStrategy()
    this.constraintStrategy = constraintStrategy ?? new StepConstraintStrategy()
  }

  /**
   * Generates steps for each phase in a TaskPlan.
   *
   * @param request - The complete planning input.
   * @param plan - The TaskPlan containing phases (with empty steps arrays).
   * @returns A new TaskPlan with steps populated in each phase.
   */
  generate(request: TaskPlannerRequest, plan: TaskPlan): TaskPlan {
    const updatedPhases = plan.phases.map((phase) => this.populatePhaseWithSteps(request, phase))

    return {
      ...plan,
      phases: updatedPhases,
      metadata: {
        ...plan.metadata,
        stepGeneration: {
          generatedBy: 'StepGenerator',
          generatedAt: new Date().toISOString(),
          plannerVersion: '1.4.2',
          stepCount: updatedPhases.reduce((count, phase) => count + phase.steps.length, 0),
          strategy: 'complexity_based',
          complexityLevel: request.complexityReport.level,
        },
      },
    }
  }

  /**
   * Populates a single phase with steps from the strategy.
   *
   * @param request - The planning request (for context in metadata).
   * @param phase - The phase to populate.
   * @returns A new TaskPhase with steps added.
   */
  private populatePhaseWithSteps(request: TaskPlannerRequest, phase: TaskPhase): TaskPhase {
    const stepDefinitions = this.strategy.getSteps(phase.name, request.complexityReport)
    const dependencies = this.dependencyStrategy.resolveDependencies(phase.id, stepDefinitions)
    const steps = stepDefinitions.map((definition, index) =>
      this.createStep(definition, index, request, phase, dependencies[index])
    )

    return {
      ...phase,
      steps,
    }
  }

  /**
   * Creates a TaskStep from a step definition.
   *
   * @param definition - The step definition from the strategy.
   * @param index - The zero-based order of this step within the phase.
   * @param request - The planning request (for context in metadata).
   * @param phase - The parent phase (for context in metadata).
   * @returns A TaskStep with placeholder values.
   */
  private createStep(
    definition: StepDefinition,
    index: number,
    request: TaskPlannerRequest,
    phase: TaskPhase,
    dependsOn: readonly string[]
  ): TaskStep {
    const priority = this.priorityStrategy.getPriority(phase.name, definition.name)
    const constraint = this.constraintStrategy.getConstraint(phase.name, definition.name)

    return {
      id: `${phase.id}-step-${index + 1}`,
      name: definition.name,
      description: definition.description,
      estimatedComplexity: request.complexityReport.level,
      estimatedFiles: 0,
      estimatedRuntime: 0,
      priority,
      dependsOn,
      constraint,
      metadata: {
        generatedBy: 'StepGenerator',
        generatedAt: new Date().toISOString(),
        plannerVersion: '1.4.5',
        stepType: 'complexity_based',
        parentPhase: {
          id: phase.id,
          name: phase.name,
          order: phase.order,
        },
        sourceRequest: {
          taskDescription: request.taskDescription,
          complexityLevel: request.complexityReport.level,
        },
      },
    }
  }
}
