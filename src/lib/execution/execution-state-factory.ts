/**
 * Execution Engine — Execution State Factory
 *
 * Deterministic factory that creates an initial immutable ExecutionState
 * from a completed TaskPlan. All phases and steps are initialized as Pending.
 *
 * Milestone 1.5.2: state initialization only — no execution behavior.
 */

import { TaskPlan } from '../task-planner/task-plan'
import { TaskPhase } from '../task-planner/task-phase'
import { TaskStep } from '../task-planner/task-step'
import { ExecutionStatus } from './execution-status'
import { ExecutionState } from './execution-state'
import { ExecutionPhaseState } from './execution-phase-state'
import { ExecutionStepState } from './execution-step-state'

// ============================================================================
// EXECUTION STATE FACTORY
// ============================================================================

/**
 * Creates an initial ExecutionState from a TaskPlan.
 *
 * The factory is deterministic: the same TaskPlan always produces the same
 * ExecutionState structure (though createdAt will differ by timestamp).
 *
 * The factory never mutates the input TaskPlan — it creates entirely new
 * immutable objects.
 */
export class ExecutionStateFactory {
  /**
   * Creates an initial ExecutionState from a TaskPlan.
   *
   * @param plan - The completed TaskPlan to initialize execution for.
   * @returns A new ExecutionState with all phases and steps set to Pending.
   */
  create(plan: TaskPlan): ExecutionState {
    const phases = plan.phases.map((phase) => this.createPhaseState(phase))

    return {
      planId: plan.id,
      overallStatus: ExecutionStatus.Pending,
      phases,
      createdAt: new Date().toISOString(),
      metadata: {
        generatedBy: 'ExecutionStateFactory',
        plannerVersion: '1.5.2',
        planName: plan.name,
        phaseCount: phases.length,
        stepCount: phases.reduce((count, phase) => count + phase.steps.length, 0),
      },
    }
  }

  /**
   * Creates an ExecutionPhaseState from a TaskPhase.
   *
   * @param phase - The TaskPhase to convert.
   * @returns A new ExecutionPhaseState with status Pending.
   */
  private createPhaseState(phase: TaskPhase): ExecutionPhaseState {
    const steps = phase.steps.map((step) => this.createStepState(step))

    return {
      phaseId: phase.id,
      status: ExecutionStatus.Pending,
      steps,
      metadata: {
        phaseName: phase.name,
        phaseOrder: phase.order,
        stepCount: steps.length,
      },
    }
  }

  /**
   * Creates an ExecutionStepState from a TaskStep.
   *
   * @param step - The TaskStep to convert.
   * @returns A new ExecutionStepState with status Pending.
   */
  private createStepState(step: TaskStep): ExecutionStepState {
    return {
      stepId: step.id,
      status: ExecutionStatus.Pending,
      metadata: {
        stepName: step.name,
        stepPriority: step.priority,
        stepConstraint: step.constraint,
        dependsOn: step.dependsOn,
      },
    }
  }
}
