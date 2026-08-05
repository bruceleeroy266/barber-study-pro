/**
 * Task Planner — Task Phase Model
 *
 * Immutable model for a phase within a task plan. Pure data — no execution
 * logic.
 *
 * Milestone 1: model only.
 */

import { TaskStep } from './task-step'

// ============================================================================
// TASK PHASE METADATA
// ============================================================================

/**
 * Generic, extensible metadata for a task phase.
 * Open-ended to support future extension without assumptions about execution.
 */
export type TaskPhaseMetadata = Record<string, unknown>

// ============================================================================
// TASK PHASE
// ============================================================================

/**
 * A named, ordered grouping of steps within a task plan.
 *
 * Immutable: all fields are readonly.
 */
export interface TaskPhase {
  /** Stable identifier for the phase. */
  readonly id: string

  /** Human-readable name of the phase. */
  readonly name: string

  /** Zero-based position of the phase within the plan's sequence. */
  readonly order: number

  /** The steps that make up this phase. */
  readonly steps: readonly TaskStep[]

  /** Generic extensible metadata. */
  readonly metadata?: TaskPhaseMetadata
}
