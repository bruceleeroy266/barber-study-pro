/**
 * Execution Engine — Execution State
 *
 * Immutable model tracking the overall execution state of a task plan.
 *
 * Milestone 1.5.1: model only — no execution logic.
 */

import { ExecutionStatus } from './execution-status'
import { ExecutionPhaseState } from './execution-phase-state'

// ============================================================================
// EXECUTION STATE METADATA
// ============================================================================

/**
 * Generic, extensible metadata for an execution state.
 */
export type ExecutionStateMetadata = Record<string, unknown>

// ============================================================================
// EXECUTION STATE
// ============================================================================

/**
 * Tracks the overall execution state of a task plan.
 *
 * Immutable: all fields are readonly.
 */
export interface ExecutionState {
  /** The ID of the plan this state tracks. */
  readonly planId: string

  /** Overall execution status of the plan. */
  readonly overallStatus: ExecutionStatus

  /** Execution states of all phases within this plan. */
  readonly phases: readonly ExecutionPhaseState[]

  /** ISO 8601 timestamp of when execution was initiated. */
  readonly createdAt: string

  /** Generic extensible metadata. */
  readonly metadata?: ExecutionStateMetadata
}
