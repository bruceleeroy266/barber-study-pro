/**
 * Task Planner — Step Strategy Contract
 *
 * Defines the abstraction that determines how TaskSteps are generated.
 * Introduced to make step generation extensible without changing the
 * generator's orchestration responsibility.
 *
 * Milestone 1.3.5: strategy contract only — no behavior change.
 */

import { ExecutionAssessment } from '../execution-budget/execution-assessment'
import { TaskStep } from './task-step'

// ============================================================================
// STEP STRATEGY INTERFACE
// ============================================================================

/**
 * The contract for step generation strategies.
 *
 * Implementations transform an ExecutionAssessment into a deterministic
 * sequence of TaskSteps. The interface is intentionally minimal — one
 * method — to keep the contract stable as strategies evolve.
 */
export interface StepStrategy {
  /**
   * Generates a deterministic sequence of steps from the given assessment.
   *
   * @param assessment - The execution assessment to derive the steps from.
   * @returns A readonly array of TaskSteps.
   */
  generate(assessment: ExecutionAssessment): readonly TaskStep[]
}
