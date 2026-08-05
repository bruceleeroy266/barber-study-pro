/**
 * Task Planner — Planner Result Model
 *
 * Immutable model representing the output of the Task Planner.
 * Contains the produced plan (when successful) and a human-readable summary.
 *
 * Milestone 2: result model only — no planning logic.
 */

import { TaskPlan } from './task-plan'

// ============================================================================
// PLANNER RESULT METADATA
// ============================================================================

/**
 * Generic, extensible metadata for a planner result.
 * Open-ended to support future extension without assumptions about planning.
 */
export type TaskPlannerResultMetadata = Record<string, unknown>

// ============================================================================
// TASK PLANNER RESULT
// ============================================================================

/**
 * The result of invoking the Task Planner.
 *
 * Immutable: all fields are readonly.
 */
export interface TaskPlannerResult {
  /** Whether planning completed successfully. */
  readonly success: boolean

  /**
   * The produced task plan.
   * Undefined when planning fails or is not yet implemented.
   */
  readonly taskPlan?: TaskPlan

  /** Human-readable summary of the planning outcome. */
  readonly summary: string

  /** Generic extensible metadata. */
  readonly metadata?: TaskPlannerResultMetadata
}
