/**
 * Execution Engine — Execution Phase State
 *
 * Immutable model tracking the execution state of a single phase.
 *
 * Milestone 1.5.1: model only — no execution logic.
 */

import { ExecutionStatus } from './execution-status'
import { ExecutionStepState } from './execution-step-state'

// ============================================================================
// EXECUTION PHASE STATE METADATA
// ============================================================================

/**
 * Generic, extensible metadata for an execution phase state.
 */
export type ExecutionPhaseStateMetadata = Record<string, unknown>

// ============================================================================
// EXECUTION PHASE STATE
// ============================================================================

/**
 * Tracks the execution state of a single phase within a plan.
 *
 * Immutable: all fields are readonly.
 */
export interface ExecutionPhaseState {
  /** The ID of the phase this state tracks. */
  readonly phaseId: string

  /** Current execution status of the phase. */
  readonly status: ExecutionStatus

  /** Execution states of all steps within this phase. */
  readonly steps: readonly ExecutionStepState[]

  /** Generic extensible metadata. */
  readonly metadata?: ExecutionPhaseStateMetadata
}
