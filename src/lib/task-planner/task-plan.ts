/**
 * Task Planner — Task Plan Model
 *
 * Immutable model for a task plan. Pure data — no behavior, no methods.
 *
 * Milestone 1: model only.
 */

import { TaskPhase } from './task-phase'

// ============================================================================
// TASK PLAN METADATA
// ============================================================================

/**
 * Generic, extensible metadata for a task plan.
 * Open-ended to support future extension without assumptions about execution.
 */
export type TaskPlanMetadata = Record<string, unknown>

// ============================================================================
// TASK PLAN
// ============================================================================

/**
 * A structured plan for executing a task, composed of ordered phases.
 *
 * Immutable: all fields are readonly.
 */
export interface TaskPlan {
  /** Stable identifier for the plan. */
  readonly id: string

  /** Human-readable name of the plan. */
  readonly name: string

  /** The phases that make up this plan. */
  readonly phases: readonly TaskPhase[]

  /** Generic extensible metadata. */
  readonly metadata?: TaskPlanMetadata
}
