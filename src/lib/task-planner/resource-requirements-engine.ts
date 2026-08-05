/**
 * Task Planner — Resource Requirements Engine
 *
 * Deterministic engine that estimates the resources required to complete a
 * task from an ExecutionAssessment. Uses only information already available
 * in the assessment — no repository inspection, no AI, no heuristics beyond
 * deterministic mapping.
 *
 * The engine:
 * - does NOT allocate resources or schedule work.
 * - is deterministic — the same assessment always produces the same estimate.
 *
 * Milestone 1.5.3: resource estimation only.
 */

import { ExecutionAssessment } from '../execution-budget/execution-assessment'
import { ComplexityLevel } from '../complexity-model/complexity-level'
import {
  ResourceRequirements,
  ResourceLevel,
} from './resource-requirements'

// ============================================================================
// RESOURCE REQUIREMENTS ENGINE
// ============================================================================

export class ResourceRequirementsEngine {
  /**
   * Estimates resource requirements from the given assessment.
   *
   * @param assessment - The execution assessment to evaluate.
   * @returns An immutable ResourceRequirements result.
   */
  estimate(assessment: ExecutionAssessment): ResourceRequirements {
    const complexity = assessment.complexityReport.level

    return {
      estimatedFiles: assessment.complexityReport.estimatedFileCount,
      estimatedRuntimeMinutes: assessment.complexityReport.estimatedRuntime ?? 0,
      estimatedComplexity: complexity,
      estimatedMemoryUsage: this.mapComplexityToResourceLevel(complexity),
      estimatedRisk: this.mapComplexityToResourceLevel(complexity),
      metadata: {
        engineVersion: 'resource-requirements-engine@1.5.3',
      },
    }
  }

  /**
   * Maps a ComplexityLevel to a ResourceLevel deterministically.
   */
  private mapComplexityToResourceLevel(complexity: ComplexityLevel): ResourceLevel {
    switch (complexity) {
      case ComplexityLevel.Tiny:
      case ComplexityLevel.Small:
        return ResourceLevel.Low

      case ComplexityLevel.Medium:
        return ResourceLevel.Medium

      case ComplexityLevel.Large:
      case ComplexityLevel.VeryLarge:
      case ComplexityLevel.Extreme:
        return ResourceLevel.High

      default:
        return ResourceLevel.Low
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default resource requirements engine instance. Stateless and safe to share.
 */
export const resourceRequirementsEngine = new ResourceRequirementsEngine()
