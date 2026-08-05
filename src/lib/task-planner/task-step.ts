/**
 * Task Planner — Task Step Model
 *
 * Immutable model for a single step within a task phase. Pure data — no
 * execution state, no progress, no planning logic.
 *
 * Milestone 1: model only.
 */

import { ComplexityLevel } from '../complexity-model/complexity-level'
import { StepPriority } from './step-priority-strategy'
import { ExecutionConstraint } from './step-constraint-strategy'

// ============================================================================
// TASK STEP METADATA
// ============================================================================

/**
 * Generic, extensible metadata for a task step.
 * Open-ended to support future extension without assumptions about execution.
 */
export type TaskStepMetadata = Record<string, unknown>

// ============================================================================
// TASK STEP
// ============================================================================

/**
 * A single, atomic unit of work within a task phase.
 *
 * Immutable: all fields are readonly.
 */
export interface TaskStep {
  /** Stable identifier for the step. */
  readonly id: string

  /** Human-readable name of the step. */
  readonly name: string

  /** Description of what the step does. */
  readonly description: string

  /** Estimated qualitative complexity of the step. */
  readonly estimatedComplexity: ComplexityLevel

  /** Estimated number of files the step will touch. */
  readonly estimatedFiles: number

  /** Estimated runtime for the step, in minutes. */
  readonly estimatedRuntime: number

  /** Execution priority of the step. */
  readonly priority: StepPriority

  /** IDs of prerequisite steps that must complete before this step. */
  readonly dependsOn: readonly string[]

  /** Execution constraint describing what kind of interaction this step may perform. */
  readonly constraint: ExecutionConstraint

  /** Generic extensible metadata. */
  readonly metadata?: TaskStepMetadata
}
