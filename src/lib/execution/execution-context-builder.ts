/**
 * Execution — Execution Context Builder
 *
 * Deterministic builder that assembles all validated planning artifacts from
 * a completed TaskPlan into a single immutable ExecutionContext.
 *
 * The builder:
 * - does NOT execute anything.
 * - does NOT modify the TaskPlan.
 * - does NOT inspect repositories or use AI.
 * - is deterministic — the same plan always produces the same context.
 *
 * Milestone 6.1.1: execution context assembly only.
 */

import { TaskPlan } from '../task-planner/task-plan'
import { PlanningTemplate } from '../task-planner/planning-template'
import { PlanningPolicy } from '../task-planner/planning-policy'
import { WorkflowVersion } from '../task-planner/workflow-version'
import { ResourceRequirements } from '../task-planner/resource-requirements'
import { TaskClassification } from '../task-planner/task-classification'
import { PlanningValidation } from '../task-planner/planning-validation'
import { ExecutionContext } from './execution-context'
import { ExecutionReadinessEngine, executionReadinessEngine } from './execution-readiness-engine'
import { requireNonNull, requireProperty, combineGuards } from './execution-guards'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in context metadata. */
const CONTEXT_BUILDER_VERSION = 'execution-context-builder@6.1.1'

// ============================================================================
// EXECUTION CONTEXT BUILDER
// ============================================================================

/**
 * Deterministic builder for assembling ExecutionContext snapshots.
 *
 * Extracts planning artifacts from TaskPlan metadata and packages them into
 * a single immutable ExecutionContext. No execution, no mutation, no AI.
 */
export class ExecutionContextBuilder {
  private readonly readinessEngine: ExecutionReadinessEngine

  /**
   * @param readinessEng - The execution readiness engine to use. Defaults
   *   to the shared singleton instance. Injected for testability.
   */
  constructor(readinessEng: ExecutionReadinessEngine = executionReadinessEngine) {
    this.readinessEngine = readinessEng
  }

  /**
   * Builds an ExecutionContext from the given TaskPlan.
   *
   * @param plan - The completed TaskPlan with populated metadata.
   * @returns An immutable ExecutionContext snapshot.
   */
  build(plan: TaskPlan): ExecutionContext {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(plan, 'TaskPlan'),
      requireProperty(plan, 'id', 'TaskPlan'),
      requireNonNull(plan?.metadata, 'TaskPlan.metadata')
    )

    if (!guard.passed) {
      return this.buildBlockedContext(plan, guard.message)
    }

    const planningTemplate = plan.metadata?.planningTemplate as PlanningTemplate
    const planningPolicy = plan.metadata?.planningPolicy as PlanningPolicy
    const resourceRequirements = plan.metadata?.resourceRequirements as ResourceRequirements
    const taskClassification = plan.metadata?.taskClassification as TaskClassification
    const planningValidation = plan.metadata?.planningValidation as PlanningValidation

    const workflowVersion: WorkflowVersion = {
      versionId: 'v1',
      versionName: 'Workflow v1',
      planningPolicy,
      templateId: planningTemplate?.templateId ?? 'unknown',
    }

    const context: ExecutionContext = {
      contextId: `context-${plan.id}`,
      contextVersion: CONTEXT_BUILDER_VERSION,
      taskPlan: plan,
      planningTemplate,
      planningPolicy,
      workflowVersion,
      resourceRequirements,
      taskClassification,
      planningValidation,
      metadata: {
        builderVersion: CONTEXT_BUILDER_VERSION,
        planId: plan.id,
        assembledAt: new Date().toISOString(),
      },
    }

    const readiness = this.readinessEngine.assess(context)

    return {
      ...context,
      readiness,
    }
  }

  /**
   * Builds a blocked context when input validation fails.
   */
  private buildBlockedContext(
    plan: TaskPlan | null | undefined,
    reason: string
  ): ExecutionContext {
    return {
      contextId: `context-blocked-${plan?.id ?? 'unknown'}`,
      contextVersion: CONTEXT_BUILDER_VERSION,
      taskPlan: plan as TaskPlan,
      planningTemplate: undefined as unknown as PlanningTemplate,
      planningPolicy: undefined as unknown as PlanningPolicy,
      workflowVersion: undefined as unknown as WorkflowVersion,
      resourceRequirements: undefined as unknown as ResourceRequirements,
      taskClassification: undefined as unknown as TaskClassification,
      planningValidation: undefined as unknown as PlanningValidation,
      metadata: {
        builderVersion: CONTEXT_BUILDER_VERSION,
        planId: plan?.id ?? 'unknown',
        blocked: true,
        blockReason: reason,
        assembledAt: new Date().toISOString(),
      },
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default context builder instance. Stateless and safe to share.
 */
export const executionContextBuilder = new ExecutionContextBuilder()
