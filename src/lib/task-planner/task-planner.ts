/**
 * Task Planner — Foundation Contract
 *
 * Defines the public interface for the Task Planner foundation. The planner
 * transforms an ExecutionAssessment into a TaskPlan using deterministic rules.
 *
 * This milestone establishes ONLY the planner entry point and orchestration.
 * It does NOT perform automatic task decomposition, phase generation, task
 * splitting, execution strategy creation, or checkpointing.
 *
 * Milestone 1.3.2: foundation contract only.
 */

import { ExecutionAssessment } from '../execution-budget/execution-assessment'
import { TaskPlan } from './task-plan'

// ============================================================================
// TASK PLANNER INTERFACE
// ============================================================================

/**
 * The public contract for task planning.
 *
 * Implementations transform an ExecutionAssessment into a TaskPlan. The
 * interface is intentionally minimal — a single method — to keep the contract
 * stable as planning logic evolves in later milestones.
 */
export interface TaskPlanner {
  /**
   * Produces a task plan from the given execution assessment.
   *
   * @param assessment - The complete execution assessment from the upstream pipeline.
   * @returns A TaskPlan with empty phases and populated metadata.
   * @throws {PlanningError} When the assessment is not READY.
   */
  plan(assessment: ExecutionAssessment): TaskPlan
}

// ============================================================================
// PLANNING ERROR
// ============================================================================

/**
 * Deterministic error thrown when planning cannot proceed.
 *
 * The planner does not automatically recover, retry, or generate partial
 * plans. It either produces a complete TaskPlan or throws a PlanningError.
 */
export class PlanningError extends Error {
  /** Stable error code for programmatic handling. */
  readonly code: string

  /** The assessment that caused the failure. */
  readonly assessment: ExecutionAssessment

  constructor(code: string, message: string, assessment: ExecutionAssessment) {
    super(message)
    this.name = 'PlanningError'
    this.code = code
    this.assessment = assessment
  }
}
