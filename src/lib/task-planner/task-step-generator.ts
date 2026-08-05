/**
 * Task Planner — Single-Step Generator
 *
 * Orchestrates step generation by delegating to a StepStrategy. The
 * generator itself contains no generation logic — it is purely an
 * orchestration layer.
 *
 * Milestone 1.3.5: refactored to delegate to StepStrategy.
 */

import { ExecutionAssessment } from '../execution-budget/execution-assessment'
import { TaskStep } from './task-step'
import { StepStrategy } from './step-strategy'
import { defaultStepStrategy } from './default-step-strategy'

// ============================================================================
// TASK STEP GENERATOR
// ============================================================================

/**
 * Orchestrates single-step generation by delegating to an injected
 * StepStrategy.
 *
 * The generator:
 * - contains no generation logic of its own.
 * - delegates entirely to the configured strategy.
 * - produces exactly ONE step — no decomposition, no branching.
 */
export class TaskStepGenerator {
  private readonly strategy: StepStrategy

  /**
   * @param strategy - The step generation strategy to use. Defaults to
   *   DefaultStepStrategy (shared singleton). Injected for testability.
   */
  constructor(strategy: StepStrategy = defaultStepStrategy) {
    this.strategy = strategy
  }

  /**
   * Generates a deterministic sequence of steps from the given assessment
   * by delegating to the configured strategy.
   *
   * @param assessment - The execution assessment to derive the steps from.
   * @returns A readonly array of TaskSteps.
   */
  generate(assessment: ExecutionAssessment): readonly TaskStep[] {
    return this.strategy.generate(assessment)
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default step generator instance. Stateless and safe to share.
 */
export const taskStepGenerator = new TaskStepGenerator()
