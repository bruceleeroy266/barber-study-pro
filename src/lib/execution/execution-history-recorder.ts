/**
 * Execution — Execution History Recorder
 *
 * Deterministic recorder that appends ExecutionResults to an immutable
 * ExecutionHistory. Never mutates existing history — always returns a new
 * immutable instance with the new entry appended.
 *
 * The recorder:
 * - does NOT execute queue items.
 * - does NOT mutate existing history entries.
 * - does NOT inspect repositories or use AI.
 * - is deterministic — the same inputs always produce the same output shape.
 *
 * Milestone 7.1.2: execution history recording only.
 */

import { ExecutionResult } from './execution-result'
import {
  ExecutionHistory,
  ExecutionHistoryEntry,
} from './execution-history'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in history metadata. */
const HISTORY_RECORDER_VERSION = 'execution-history-recorder@7.1.2'

// ============================================================================
// EXECUTION HISTORY RECORDER
// ============================================================================

/**
 * Deterministic recorder for building immutable execution histories.
 *
 * Appends new entries without mutating existing history. If no history
 * exists, creates a new one. Always returns a new immutable instance.
 */
export class ExecutionHistoryRecorder {
  /**
   * Records an ExecutionResult into an ExecutionHistory.
   *
   * @param result - The ExecutionResult to record.
   * @param history - The existing history to append to, or undefined to create new.
   * @returns A new immutable ExecutionHistory with the entry appended.
   */
  record(
    result: ExecutionResult,
    history?: ExecutionHistory
  ): ExecutionHistory {
    const entry: ExecutionHistoryEntry = {
      entryId: `entry-${result.resultId}`,
      queueItemId: result.queueItemId,
      executionResult: result,
      recordedAt: new Date().toISOString(),
    }

    const existingEntries = history?.entries ?? []
    const existingHistoryId = history?.historyId ?? `history-${result.resultId}`

    return {
      historyId: existingHistoryId,
      historyVersion: HISTORY_RECORDER_VERSION,
      entries: [...existingEntries, entry],
      metadata: {
        recorderVersion: HISTORY_RECORDER_VERSION,
        totalEntries: existingEntries.length + 1,
        lastRecordedAt: entry.recordedAt,
      },
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default history recorder instance. Stateless and safe to share.
 */
export const executionHistoryRecorder = new ExecutionHistoryRecorder()
