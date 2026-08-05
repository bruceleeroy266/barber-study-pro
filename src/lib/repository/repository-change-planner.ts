/**
 * Repository — Repository Change Planner
 *
 * Deterministic planner that generates a RepositoryChangePlan from a
 * RepositoryImpactAnalysis. Plans repository work without inspecting source
 * code or performing semantic analysis.
 *
 * The planner:
 * - uses deterministic rules only — no AI, no semantic analysis.
 * - does NOT inspect source code.
 * - does NOT modify the repository.
 * - never throws.
 *
 * Milestone 9.3.1: repository change planning only.
 */

import { RepositoryImpactAnalysis } from './repository-impact-analysis'
import {
  RepositoryChangePhase,
  RepositoryChangePlan,
} from './repository-change-plan'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in plan metadata. */
const PLANNER_VERSION = 'repository-change-planner@9.3.1'

/**
 * Phase names in deterministic order.
 */
const PHASE_NAMES = {
  Prepare: 'Prepare',
  Modify: 'Modify',
  Validate: 'Validate',
  Review: 'Review',
} as const

// ============================================================================
// REPOSITORY CHANGE PLANNER
// ============================================================================

/**
 * Deterministic planner for repository change plans.
 *
 * Generates an immutable change plan with four phases: Prepare, Modify,
 * Validate, and Review. Never throws. Never modifies the repository.
 */
export class RepositoryChangePlanner {
  /**
   * Generates a change plan from the given RepositoryImpactAnalysis.
   *
   * @param analysis - The RepositoryImpactAnalysis to plan for.
   * @returns An immutable RepositoryChangePlan.
   */
  plan(analysis: RepositoryImpactAnalysis): RepositoryChangePlan {
    const phases = this.buildPhases(analysis)
    const estimatedSteps = this.calculateEstimatedSteps(phases)

    return {
      planId: `plan-${analysis.analysisId}`,
      planVersion: PLANNER_VERSION,
      analysisId: analysis.analysisId,
      targetPath: analysis.targetPath,
      phases,
      estimatedSteps,
      riskLevel: analysis.riskLevel,
      metadata: {
        plannerVersion: PLANNER_VERSION,
        analysisId: analysis.analysisId,
        targetPath: analysis.targetPath,
        plannedAt: new Date().toISOString(),
        phaseCount: phases.length,
        estimatedSteps,
        riskLevel: analysis.riskLevel,
      },
    }
  }

  /**
   * Builds the four deterministic phases.
   */
  private buildPhases(
    analysis: RepositoryImpactAnalysis
  ): readonly RepositoryChangePhase[] {
    const targetPath = analysis.targetPath
    const directlyAffected = analysis.directlyAffected
    const transitivelyAffected = analysis.transitivelyAffected

    return [
      {
        phaseId: `phase-${analysis.analysisId}-1`,
        order: 1,
        name: PHASE_NAMES.Prepare,
        targets: [targetPath],
      },
      {
        phaseId: `phase-${analysis.analysisId}-2`,
        order: 2,
        name: PHASE_NAMES.Modify,
        targets: [targetPath],
      },
      {
        phaseId: `phase-${analysis.analysisId}-3`,
        order: 3,
        name: PHASE_NAMES.Validate,
        targets: directlyAffected,
      },
      {
        phaseId: `phase-${analysis.analysisId}-4`,
        order: 4,
        name: PHASE_NAMES.Review,
        targets: transitivelyAffected,
      },
    ]
  }

  /**
   * Calculates the total estimated steps from all phases.
   */
  private calculateEstimatedSteps(
    phases: readonly RepositoryChangePhase[]
  ): number {
    return phases.reduce((total, phase) => total + phase.targets.length, 0)
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default change planner instance. Stateless and safe to share.
 */
export const repositoryChangePlanner = new RepositoryChangePlanner()
