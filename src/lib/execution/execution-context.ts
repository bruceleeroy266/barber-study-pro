/**
 * Execution — Execution Context Model
 *
 * Immutable snapshot of all validated planning artifacts, packaged for
 * consumption by future execution components. Read-only — no mutable state,
 * no execution logic, no behavior.
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
import { ExecutionReadiness } from './execution-readiness'

// ============================================================================
// EXECUTION CONTEXT
// ============================================================================

/**
 * An immutable, read-only snapshot of all planning artifacts.
 *
 * Packaged by the ExecutionContextBuilder from a completed TaskPlan.
 * Contains no mutable state and no execution logic.
 */
export interface ExecutionContext {
  /** Stable identifier for this context. */
  readonly contextId: string

  /** Version of the context builder. */
  readonly contextVersion: string

  /** The source task plan. */
  readonly taskPlan: TaskPlan

  /** The selected planning template. */
  readonly planningTemplate: PlanningTemplate

  /** The selected planning policy. */
  readonly planningPolicy: PlanningPolicy

  /** The selected workflow version. */
  readonly workflowVersion: WorkflowVersion

  /** The estimated resource requirements. */
  readonly resourceRequirements: ResourceRequirements

  /** The task classification. */
  readonly taskClassification: TaskClassification

  /** The planning validation result. */
  readonly planningValidation: PlanningValidation

  /** The execution readiness assessment. */
  readonly readiness?: ExecutionReadiness

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
