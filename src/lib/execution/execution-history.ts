/**
 * Execution — Execution History Model
 *
 * Immutable models representing an append-only record of executed queue items.
 * History is never mutated — new entries produce new immutable instances.
 *
 * Milestone 7.1.2: execution history model only.
 */

import { ExecutionResult } from './execution-result'

// ============================================================================
// EXECUTION HISTORY ENTRY
// ============================================================================

/**
 * A single entry in the execution history.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionHistoryEntry {
  /** Stable identifier for this entry. */
  readonly entryId: string

  /** The queue item that was executed. */
  readonly queueItemId: string

  /** The result of the execution. */
  readonly executionResult: ExecutionResult

  /** ISO timestamp when this entry was recorded. */
  readonly recordedAt: string
}

// ============================================================================
// EXECUTION HISTORY
// ============================================================================

/**
 * An append-only, immutable record of execution results.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ExecutionHistory {
  /** Stable identifier for this history. */
  readonly historyId: string

  /** Version of the history recorder. */
  readonly historyVersion: string

  /** The recorded entries, in order. */
  readonly entries: readonly ExecutionHistoryEntry[]

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
