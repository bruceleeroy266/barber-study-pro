/**
 * Task Planner — Planning Step Sequence
 *
 * Centralized, declarative definition of the deterministic planning step
 * sequence. Each entry describes one step in the fixed workflow.
 *
 * The sequence contains no logic — it is pure data consumed by the
 * DefaultStepStrategy.
 *
 * Milestone 1.3.6: sequence definition only.
 */

// ============================================================================
// SEQUENCE ENTRY
// ============================================================================

/**
 * A single entry in the deterministic planning step sequence.
 */
export interface PlanningStepSequenceEntry {
  /** Stable identifier for the step. */
  readonly id: string

  /** Human-readable name of the step. */
  readonly name: string

  /** Description of what the step does. */
  readonly description: string

  /** Zero-based position in the sequence. */
  readonly order: number
}

// ============================================================================
// DEFAULT PLANNING STEP SEQUENCE
// ============================================================================

/**
 * The deterministic planning step sequence.
 *
 * Always produces the same four steps in the same order, regardless of
 * the assessment contents.
 */
export const DEFAULT_PLANNING_STEP_SEQUENCE: readonly PlanningStepSequenceEntry[] = [
  {
    id: 'analyze-task',
    name: 'Analyze Task',
    description: 'Review the task requirements and constraints.',
    order: 0,
  },
  {
    id: 'prepare-work',
    name: 'Prepare Work',
    description: 'Set up the working environment and gather prerequisites.',
    order: 1,
  },
  {
    id: 'execute-changes',
    name: 'Execute Changes',
    description: 'Perform the required modifications.',
    order: 2,
  },
  {
    id: 'verify-results',
    name: 'Verify Results',
    description: 'Validate that the changes meet the requirements.',
    order: 3,
  },
]
