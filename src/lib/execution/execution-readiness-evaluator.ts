/**
 * Execution Engine — Execution Readiness Evaluator
 *
 * Deterministic evaluator that determines which execution steps are currently
 * eligible to run based on their status and dependency completion.
 *
 * Milestone 1.5.3: readiness evaluation only — no execution behavior.
 */

import { ExecutionStatus } from './execution-status'
import { ExecutionState } from './execution-state'
import { ExecutionStepState } from './execution-step-state'

// ============================================================================
// EXECUTION READINESS RESULT
// ============================================================================

/**
 * Immutable result of evaluating execution readiness across all steps.
 */
export interface ExecutionReadinessResult {
  /** IDs of steps that are eligible to run (Pending + all dependencies Completed). */
  readonly readyStepIds: readonly string[]

  /** IDs of steps that are blocked (Pending + one or more dependencies not Completed). */
  readonly blockedStepIds: readonly string[]

  /** IDs of steps that have completed successfully. */
  readonly completedStepIds: readonly string[]

  /** IDs of steps that are currently running. */
  readonly runningStepIds: readonly string[]

  /** IDs of steps that have failed. */
  readonly failedStepIds: readonly string[]

  /** IDs of steps that have been skipped. */
  readonly skippedStepIds: readonly string[]

  /** Summary counts for each category. */
  readonly summary: {
    readonly total: number
    readonly ready: number
    readonly blocked: number
    readonly completed: number
    readonly running: number
    readonly failed: number
    readonly skipped: number
    readonly pending: number
  }
}

// ============================================================================
// EXECUTION READINESS EVALUATOR
// ============================================================================

/**
 * Evaluates which steps in an ExecutionState are ready to run.
 *
 * The evaluator is deterministic: the same ExecutionState always produces
 * the same ExecutionReadinessResult. It never mutates the input state.
 */
export class ExecutionReadinessEvaluator {
  /**
   * Evaluates readiness across all steps in an ExecutionState.
   *
   * @param state - The ExecutionState to evaluate.
   * @returns An immutable ExecutionReadinessResult categorizing all steps.
   */
  evaluate(state: ExecutionState): ExecutionReadinessResult {
    // Collect all steps from all phases
    const allSteps = this.collectAllSteps(state)

    // Build a lookup from stepId to status for dependency resolution
    const statusById = this.buildStatusLookup(allSteps)

    // Categorize each step
    const readyStepIds: string[] = []
    const blockedStepIds: string[] = []
    const completedStepIds: string[] = []
    const runningStepIds: string[] = []
    const failedStepIds: string[] = []
    const skippedStepIds: string[] = []

    for (const step of allSteps) {
      switch (step.status) {
        case ExecutionStatus.Completed:
          completedStepIds.push(step.stepId)
          break

        case ExecutionStatus.Running:
          runningStepIds.push(step.stepId)
          break

        case ExecutionStatus.Failed:
          failedStepIds.push(step.stepId)
          break

        case ExecutionStatus.Skipped:
          skippedStepIds.push(step.stepId)
          break

        case ExecutionStatus.Pending:
          if (this.areDependenciesSatisfied(step, statusById)) {
            readyStepIds.push(step.stepId)
          } else {
            blockedStepIds.push(step.stepId)
          }
          break

        case ExecutionStatus.Ready:
        case ExecutionStatus.Blocked:
          // Ready and Blocked statuses are transient — treat as pending for evaluation
          if (this.areDependenciesSatisfied(step, statusById)) {
            readyStepIds.push(step.stepId)
          } else {
            blockedStepIds.push(step.stepId)
          }
          break
      }
    }

    const total = allSteps.length
    const pending = total - completedStepIds.length - runningStepIds.length -
      failedStepIds.length - skippedStepIds.length

    return {
      readyStepIds,
      blockedStepIds,
      completedStepIds,
      runningStepIds,
      failedStepIds,
      skippedStepIds,
      summary: {
        total,
        ready: readyStepIds.length,
        blocked: blockedStepIds.length,
        completed: completedStepIds.length,
        running: runningStepIds.length,
        failed: failedStepIds.length,
        skipped: skippedStepIds.length,
        pending,
      },
    }
  }

  /**
   * Collects all steps from all phases in the ExecutionState.
   */
  private collectAllSteps(state: ExecutionState): readonly ExecutionStepState[] {
    return state.phases.flatMap((phase) => phase.steps)
  }

  /**
   * Builds a lookup map from stepId to ExecutionStatus.
   */
  private buildStatusLookup(
    steps: readonly ExecutionStepState[]
  ): ReadonlyMap<string, ExecutionStatus> {
    const map = new Map<string, ExecutionStatus>()
    for (const step of steps) {
      map.set(step.stepId, step.status)
    }
    return map
  }

  /**
   * Checks whether all dependencies of a step are satisfied (Completed).
   *
   * Dependencies are read from step.metadata.dependsOn, which was populated
   * by ExecutionStateFactory from TaskStep.dependsOn.
   */
  private areDependenciesSatisfied(
    step: ExecutionStepState,
    statusById: ReadonlyMap<string, ExecutionStatus>
  ): boolean {
    const dependsOn = step.metadata?.dependsOn as readonly string[] | undefined

    // No dependencies means the step is ready
    if (!dependsOn || dependsOn.length === 0) {
      return true
    }

    // All dependencies must be Completed
    return dependsOn.every((dependencyId) => statusById.get(dependencyId) === ExecutionStatus.Completed)
  }
}
