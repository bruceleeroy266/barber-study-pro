/**
 * Repository — Repository Change Execution Planner
 *
 * Deterministic planner that converts a RepositoryChangeReadiness into an
 * execution plan. Generates execution stages without inspecting source code
 * or modifying the repository.
 *
 * The planner:
 * - uses deterministic rules only — no AI, no semantic analysis.
 * - does NOT inspect repository contents.
 * - does NOT modify the repository.
 * - never throws.
 *
 * Milestone 9.4.2: repository change execution planning only.
 */

import { RepositoryChangePlan } from './repository-change-plan'
import { RepositoryChangeReadiness } from './repository-change-readiness'
import {
  RepositoryChangeExecutionPlan,
  RepositoryExecutionOperation,
  RepositoryExecutionStage,
} from './repository-change-execution-plan'
import { hashString, requireNonNull, requireProperty, combineGuards } from '../execution/execution-guards'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in execution plan metadata. */
const PLANNER_VERSION = 'repository-change-execution-planner@9.4.2'

/**
 * Stage names in deterministic order.
 */
const STAGE_NAMES = {
  Initialize: 'Initialize',
  Execute: 'Execute',
  Validate: 'Validate',
  Complete: 'Complete',
} as const

/**
 * Action names for operations.
 */
const ACTION_NAMES = {
  Prepare: 'Prepare',
  Modify: 'Modify',
  Validate: 'Validate',
  Finalize: 'Finalize',
} as const

// ============================================================================
// REPOSITORY CHANGE EXECUTION PLANNER
// ============================================================================

/**
 * Deterministic planner for repository change execution plans.
 *
 * Generates an immutable execution plan with four stages: Initialize,
 * Execute, Validate, and Complete. Returns a blocked plan if readiness is
 * NotReady. Never throws. Never modifies the repository.
 */
export class RepositoryChangeExecutionPlanner {
  /**
   * Generates an execution plan from the given readiness and change plan.
   *
   * @param readiness - The RepositoryChangeReadiness to plan for.
   * @param changePlan - The RepositoryChangePlan to execute.
   * @returns An immutable RepositoryChangeExecutionPlan.
   */
  plan(
    readiness: RepositoryChangeReadiness,
    changePlan: RepositoryChangePlan
  ): RepositoryChangeExecutionPlan {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(readiness, 'RepositoryChangeReadiness'),
      requireProperty(readiness, 'readinessId', 'RepositoryChangeReadiness'),
      requireProperty(readiness, 'status', 'RepositoryChangeReadiness'),
      requireNonNull(changePlan, 'RepositoryChangePlan'),
      requireProperty(changePlan, 'planId', 'RepositoryChangePlan')
    )

    if (!guard.passed) {
      return this.buildGuardFailedPlan(readiness, guard.message)
    }

    if (readiness.status === 'NotReady') {
      return this.buildBlockedPlan(readiness)
    }

    return this.buildPlannedExecution(readiness, changePlan)
  }

  /**
   * Builds a guard-failed plan when input validation fails.
   */
  private buildGuardFailedPlan(
    readiness: RepositoryChangeReadiness | null | undefined,
    reason: string
  ): RepositoryChangeExecutionPlan {
    return {
      executionPlanId: `exec-plan-guard-failed-${readiness?.readinessId ?? 'unknown'}`,
      executionPlanVersion: PLANNER_VERSION,
      readinessId: readiness?.readinessId ?? 'unknown',
      status: 'Blocked',
      stages: [],
      estimatedOperations: 0,
      metadata: {
        plannerVersion: PLANNER_VERSION,
        readinessId: readiness?.readinessId ?? 'unknown',
        plannedAt: new Date().toISOString(),
        status: 'Blocked',
        guardFailed: true,
        guardReason: reason,
      },
    }
  }

  /**
   * Builds a blocked execution plan for NotReady status.
   */
  private buildBlockedPlan(
    readiness: RepositoryChangeReadiness
  ): RepositoryChangeExecutionPlan {
    return {
      executionPlanId: `exec-plan-${readiness.readinessId}`,
      executionPlanVersion: PLANNER_VERSION,
      readinessId: readiness.readinessId,
      status: 'Blocked',
      stages: [],
      estimatedOperations: 0,
      metadata: {
        plannerVersion: PLANNER_VERSION,
        readinessId: readiness.readinessId,
        plannedAt: new Date().toISOString(),
        status: 'Blocked',
        blockerCount: readiness.blockers.length,
      },
    }
  }

  /**
   * Builds a planned execution for Ready status.
   */
  private buildPlannedExecution(
    readiness: RepositoryChangeReadiness,
    changePlan: RepositoryChangePlan
  ): RepositoryChangeExecutionPlan {
    const stages = this.buildStages(changePlan)
    const estimatedOperations = this.calculateEstimatedOperations(stages)

    return {
      executionPlanId: `exec-plan-${readiness.readinessId}`,
      executionPlanVersion: PLANNER_VERSION,
      readinessId: readiness.readinessId,
      status: 'Planned',
      stages,
      estimatedOperations,
      metadata: {
        plannerVersion: PLANNER_VERSION,
        readinessId: readiness.readinessId,
        plannedAt: new Date().toISOString(),
        status: 'Planned',
        stageCount: stages.length,
        estimatedOperations,
        changePlanId: changePlan.planId,
      },
    }
  }

  /**
   * Builds the four deterministic execution stages.
   */
  private buildStages(
    changePlan: RepositoryChangePlan
  ): readonly RepositoryExecutionStage[] {
    const targetPath = changePlan.targetPath
    const directlyAffected = changePlan.phases.find((p) => p.name === 'Validate')?.targets ?? []
    const transitivelyAffected = changePlan.phases.find((p) => p.name === 'Review')?.targets ?? []

    return [
      this.buildStage(1, STAGE_NAMES.Initialize, [
        this.buildOperation(1, targetPath, ACTION_NAMES.Prepare),
      ]),
      this.buildStage(2, STAGE_NAMES.Execute, [
        this.buildOperation(1, targetPath, ACTION_NAMES.Modify),
      ]),
      this.buildStage(3, STAGE_NAMES.Validate, [
        ...directlyAffected.map((target, index) =>
          this.buildOperation(index + 1, target, ACTION_NAMES.Validate)
        ),
      ]),
      this.buildStage(4, STAGE_NAMES.Complete, [
        ...transitivelyAffected.map((target, index) =>
          this.buildOperation(index + 1, target, ACTION_NAMES.Finalize)
        ),
      ]),
    ]
  }

  /**
   * Builds a single execution stage.
   */
  private buildStage(
    order: number,
    name: string,
    operations: readonly RepositoryExecutionOperation[]
  ): RepositoryExecutionStage {
    return {
      stageId: `stage-${order}-${name.toLowerCase()}`,
      order,
      name,
      operations,
    }
  }

  /**
   * Builds a single execution operation.
   */
  private buildOperation(
    order: number,
    target: string,
    action: string
  ): RepositoryExecutionOperation {
    return {
      operationId: `op-${order}-${action.toLowerCase()}-${hashString(target)}`,
      target,
      action,
    }
  }

  /**
   * Calculates the total estimated operations from all stages.
   */
  private calculateEstimatedOperations(
    stages: readonly RepositoryExecutionStage[]
  ): number {
    return stages.reduce((total, stage) => total + stage.operations.length, 0)
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default execution planner instance. Stateless and safe to share.
 */
export const repositoryChangeExecutionPlanner = new RepositoryChangeExecutionPlanner()
