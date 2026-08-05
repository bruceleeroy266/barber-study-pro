/**
 * Execution Engine — Execution Status
 *
 * Enumeration of all possible execution states for plans, phases, and steps.
 *
 * Milestone 1.5.1: status enum only.
 */

// ============================================================================
// EXECUTION STATUS
// ============================================================================

/**
 * The possible execution states for a plan, phase, or step.
 */
export enum ExecutionStatus {
  /** Not yet eligible to run (dependencies not satisfied). */
  Pending = 'pending',

  /** Eligible to run (all dependencies satisfied). */
  Ready = 'ready',

  /** Currently executing. */
  Running = 'running',

  /** Finished successfully. */
  Completed = 'completed',

  /** Finished with an error. */
  Failed = 'failed',

  /** Prevented from running by an external condition. */
  Blocked = 'blocked',

  /** Intentionally bypassed. */
  Skipped = 'skipped',
}
