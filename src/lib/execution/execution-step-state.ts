/**
 * Execution Engine — Execution Step State
 *
 * Immutable model tracking the execution state of a single step.
 *
 * Milestone 1.5.1: model only — no execution logic.
 */

import { ExecutionStatus } from './execution-status'

// ============================================================================
// EXECUTION STEP STATE METADATA
// ============================================================================

/**
 * Generic, extensible metadata for an execution step state.
 */
export type ExecutionStepStateMetadata = Record<string, unknown>

// ============================================================================
// EXECUTION STEP STATE
// ============================================================================

/**
 * Tracks the execution state of a single step within a phase.
 *
 * Immutable: all fields are readonly.
 */
export interface ExecutionStepState {
  /** The ID of the step this state tracks. */
  readonly stepId: string

  /** Current execution status of the step. */
  readonly status: ExecutionStatus

  /** ISO 8601 timestamp of when the step started executing. */
  readonly startedAt?: string

  /** ISO 8601 timestamp of when the step finished (completed, failed, or skipped). */
  readonly completedAt?: string

  /** Error message if the step failed. */
  readonly error?: string

  /** Generic extensible metadata. */
  readonly metadata?: ExecutionStepStateMetadata
}
