/**
 * Repository — Repository Change Readiness Assessor
 *
 * Deterministic assessor that evaluates whether a validated
 * RepositoryChangePlan is ready for execution. Assessment is informational
 * only — it does NOT inspect source code, modify the repository, or execute
 * plans.
 *
 * The assessor:
 * - uses deterministic rules only — no AI, no semantic analysis.
 * - does NOT inspect repository contents.
 * - does NOT modify the repository.
 * - never throws.
 *
 * Milestone 9.4.1: repository change readiness assessment only.
 */

import { RepositoryChangeValidation } from './repository-change-validation'
import {
  ReadinessStatus,
  RepositoryChangeBlocker,
  RepositoryChangeReadiness,
  RepositoryChangeRecommendation,
} from './repository-change-readiness'
import { requireNonNull, requireProperty, combineGuards } from '../execution/execution-guards'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in readiness metadata. */
const ASSESSOR_VERSION = 'repository-change-readiness-assessor@9.4.1'

// ============================================================================
// REPOSITORY CHANGE READINESS ASSESSOR
// ============================================================================

/**
 * Deterministic assessor for RepositoryChangePlan readiness.
 *
 * Evaluates validation results to determine execution readiness. Creates
 * blockers and recommendations for failed checks. Never throws. Never
 * modifies the repository.
 */
export class RepositoryChangeReadinessAssessor {
  /**
   * Assesses the readiness of the given RepositoryChangeValidation.
   *
   * @param validation - The RepositoryChangeValidation to assess.
   * @returns An immutable RepositoryChangeReadiness.
   */
  assess(validation: RepositoryChangeValidation): RepositoryChangeReadiness {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(validation, 'RepositoryChangeValidation'),
      requireProperty(validation, 'validationId', 'RepositoryChangeValidation'),
      requireProperty(validation, 'status', 'RepositoryChangeValidation')
    )

    if (!guard.passed) {
      return this.buildGuardFailedReadiness(validation, guard.message)
    }

    const status = this.determineStatus(validation)
    const blockers = this.buildBlockers(validation)
    const recommendations = this.buildRecommendations(blockers)

    return {
      readinessId: `readiness-${validation.validationId}`,
      readinessVersion: ASSESSOR_VERSION,
      validationId: validation.validationId,
      status,
      blockers,
      recommendations,
      metadata: {
        assessorVersion: ASSESSOR_VERSION,
        validationId: validation.validationId,
        assessedAt: new Date().toISOString(),
        validationStatus: validation.status,
        blockerCount: blockers.length,
        recommendationCount: recommendations.length,
      },
    }
  }

  /**
   * Builds a guard-failed readiness when input validation fails.
   */
  private buildGuardFailedReadiness(
    validation: RepositoryChangeValidation | null | undefined,
    reason: string
  ): RepositoryChangeReadiness {
    return {
      readinessId: `readiness-guard-failed-${validation?.validationId ?? 'unknown'}`,
      readinessVersion: ASSESSOR_VERSION,
      validationId: validation?.validationId ?? 'unknown',
      status: 'NotReady',
      blockers: [
        {
          blockerId: 'blocker-guard-failed',
          description: `Input validation failed: ${reason}`,
        },
      ],
      recommendations: [
        {
          recommendationId: 'recommendation-guard-failed',
          description: 'Ensure the validation object is valid before assessing readiness.',
        },
      ],
      metadata: {
        assessorVersion: ASSESSOR_VERSION,
        validationId: validation?.validationId ?? 'unknown',
        assessedAt: new Date().toISOString(),
        validationStatus: validation?.status ?? 'unknown',
        blockerCount: 1,
        recommendationCount: 1,
        guardFailed: true,
        guardReason: reason,
      },
    }
  }

  /**
   * Determines the readiness status from the validation.
   */
  private determineStatus(validation: RepositoryChangeValidation): ReadinessStatus {
    return validation.status === 'Passed' ? 'Ready' : 'NotReady'
  }

  /**
   * Builds blockers from failed validation checks.
   */
  private buildBlockers(
    validation: RepositoryChangeValidation
  ): readonly RepositoryChangeBlocker[] {
    if (validation.status === 'Passed') {
      return []
    }

    return validation.checks
      .filter((check) => !check.passed)
      .map((check, index) => ({
        blockerId: `blocker-${validation.validationId}-${index + 1}`,
        description: `Validation check failed: ${check.name} — ${check.message}`,
      }))
  }

  /**
   * Builds recommendations for resolving blockers.
   */
  private buildRecommendations(
    blockers: readonly RepositoryChangeBlocker[]
  ): readonly RepositoryChangeRecommendation[] {
    return blockers.map((blocker) => ({
      recommendationId: `recommendation-${blocker.blockerId}`,
      description: this.getRecommendationForBlocker(blocker),
    }))
  }

  /**
   * Generates a recommendation description for a blocker.
   */
  private getRecommendationForBlocker(
    blocker: RepositoryChangeBlocker
  ): string {
    const description = blocker.description

    if (description.includes('Plan ID exists')) {
      return 'Ensure the change plan has a valid, non-empty plan ID.'
    }
    if (description.includes('Target path exists')) {
      return 'Ensure the change plan specifies a valid, non-empty target file path.'
    }
    if (description.includes('At least one phase exists')) {
      return 'Ensure the change plan contains at least one phase.'
    }
    if (description.includes('Phase order is sequential')) {
      return 'Ensure phase orders are sequential starting from 1 (1, 2, 3, ...).'
    }
    if (description.includes('Estimated steps equals total phase targets')) {
      return 'Recalculate estimated steps to equal the sum of all phase target counts.'
    }
    if (description.includes('Every phase has a unique phaseId')) {
      return 'Ensure every phase has a unique phase ID.'
    }
    if (description.includes('Risk level is valid')) {
      return 'Ensure the risk level is one of: Low, Medium, High, Critical.'
    }

    return 'Review and resolve the validation failure before proceeding.'
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default readiness assessor instance. Stateless and safe to share.
 */
export const repositoryChangeReadinessAssessor = new RepositoryChangeReadinessAssessor()
