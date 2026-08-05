/**
 * Task Planner — Single-Phase Generator
 *
 * Deterministic generator that produces exactly one TaskPhase from an
 * ExecutionAssessment. Always returns the same structure for the same input.
 *
 * The generator:
 * - produces exactly ONE phase — no decomposition, no branching.
 * - contains no randomness, timestamps in IDs, or AI reasoning.
 * - does not inspect repositories or generate checkpoints.
 *
 * Milestone 1.3.3: single-phase generation only.
 */

import { ExecutionAssessment } from '../execution-budget/execution-assessment'
import { TaskPhase } from './task-phase'
import { TaskStepGenerator, taskStepGenerator } from './task-step-generator'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in phase metadata. */
const GENERATOR_VERSION = 'task-phase-generator@1.3.3'

// ============================================================================
// TASK PHASE GENERATOR
// ============================================================================

/**
 * Generates a single deterministic phase from an ExecutionAssessment.
 *
 * The phase always has:
 * - id: derived from assessment complexity score and decision
 * - name: derived from assessment task description
 * - order: 1 (first and only phase)
 * - steps: empty collection
 * - metadata: generator version, source decision, source complexity
 */
export class TaskPhaseGenerator {
  private readonly stepGenerator: TaskStepGenerator

  /**
   * @param stepGen - The step generator to use. Defaults to the shared
   *   singleton instance. Injected for testability.
   */
  constructor(stepGen: TaskStepGenerator = taskStepGenerator) {
    this.stepGenerator = stepGen
  }

  /**
   * Generates exactly one phase from the given assessment.
   *
   * @param assessment - The execution assessment to derive the phase from.
   * @returns A single TaskPhase containing the deterministic step sequence.
   */
  generate(assessment: ExecutionAssessment): TaskPhase {
    const steps = this.stepGenerator.generate(assessment)

    return {
      id: this.generatePhaseId(assessment),
      name: this.generatePhaseName(assessment),
      order: 1,
      steps: [...steps],
      metadata: {
        generatedBy: GENERATOR_VERSION,
        sourceDecision: assessment.budgetDecision.decision,
        sourceComplexity: assessment.complexityReport.totalScore,
      },
    }
  }

  /**
   * Generates a deterministic phase ID from the assessment.
   * No timestamps — same assessment always produces the same ID.
   */
  private generatePhaseId(assessment: ExecutionAssessment): string {
    const score = assessment.complexityReport.totalScore
    const decision = assessment.budgetDecision.decision
    return `phase-1-${decision}-${score}`
  }

  /**
   * Generates a human-readable phase name from the assessment.
   */
  private generatePhaseName(assessment: ExecutionAssessment): string {
    const description = assessment.complexityReport.metadata.taskDescription
    return `Execute: ${description}`
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default phase generator instance. Stateless and safe to share.
 */
export const taskPhaseGenerator = new TaskPhaseGenerator()
