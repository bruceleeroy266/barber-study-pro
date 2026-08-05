/**
 * Repository — Repository Change Validator
 *
 * Deterministic validator that validates the structure and consistency of a
 * RepositoryChangePlan. Validation is informational only — it does NOT
 * inspect source code, modify the repository, or execute plans.
 *
 * The validator:
 * - uses deterministic rules only — no AI, no semantic analysis.
 * - does NOT inspect repository contents.
 * - does NOT modify the repository.
 * - never throws.
 *
 * Milestone 9.3.2: repository change plan validation only.
 */

import { RepositoryChangePlan } from './repository-change-plan'
import { RiskLevel } from './repository-impact-analysis'
import {
  RepositoryChangeCheck,
  RepositoryChangeValidation,
  ValidationStatus,
} from './repository-change-validation'
import { requireNonNull, requireProperty, combineGuards } from '../execution/execution-guards'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in validation metadata. */
const VALIDATOR_VERSION = 'repository-change-validator@9.3.2'

/**
 * Valid risk levels.
 */
const VALID_RISK_LEVELS: ReadonlySet<RiskLevel> = new Set([
  'Low',
  'Medium',
  'High',
  'Critical',
])

// ============================================================================
// REPOSITORY CHANGE VALIDATOR
// ============================================================================

/**
 * Deterministic validator for RepositoryChangePlans.
 *
 * Runs a fixed set of structural checks against the plan. All checks are
 * returned regardless of pass/fail status. Never throws. Never modifies
 * the repository.
 */
export class RepositoryChangeValidator {
  /**
   * Validates the given RepositoryChangePlan.
   *
   * @param plan - The RepositoryChangePlan to validate.
   * @returns An immutable RepositoryChangeValidation.
   */
  validate(plan: RepositoryChangePlan): RepositoryChangeValidation {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(plan, 'RepositoryChangePlan'),
      requireProperty(plan, 'planId', 'RepositoryChangePlan')
    )

    if (!guard.passed) {
      return this.buildGuardFailedValidation(plan, guard.message)
    }

    const checks: RepositoryChangeCheck[] = [
      this.checkPlanIdExists(plan),
      this.checkTargetPathExists(plan),
      this.checkPhasesExist(plan),
      this.checkPhaseOrderSequential(plan),
      this.checkEstimatedStepsMatch(plan),
      this.checkPhaseIdsUnique(plan),
      this.checkRiskLevelValid(plan),
    ]

    const allPassed = checks.every((c) => c.passed)
    const status: ValidationStatus = allPassed ? 'Passed' : 'Failed'

    return {
      validationId: `validation-${plan.planId}`,
      validationVersion: VALIDATOR_VERSION,
      planId: plan.planId,
      status,
      checks,
      metadata: {
        validatorVersion: VALIDATOR_VERSION,
        planId: plan.planId,
        validatedAt: new Date().toISOString(),
        totalChecks: checks.length,
        passedChecks: checks.filter((c) => c.passed).length,
        failedChecks: checks.filter((c) => !c.passed).length,
      },
    }
  }

  /**
   * Builds a guard-failed validation when input validation fails.
   */
  private buildGuardFailedValidation(
    plan: RepositoryChangePlan | null | undefined,
    reason: string
  ): RepositoryChangeValidation {
    return {
      validationId: `validation-guard-failed-${plan?.planId ?? 'unknown'}`,
      validationVersion: VALIDATOR_VERSION,
      planId: plan?.planId ?? 'unknown',
      status: 'Failed',
      checks: [
        {
          checkId: 'check-guard-failed',
          name: 'Input validation guard',
          passed: false,
          message: reason,
        },
      ],
      metadata: {
        validatorVersion: VALIDATOR_VERSION,
        planId: plan?.planId ?? 'unknown',
        validatedAt: new Date().toISOString(),
        totalChecks: 1,
        passedChecks: 0,
        failedChecks: 1,
        guardFailed: true,
        guardReason: reason,
      },
    }
  }

  // ==========================================================================
  // INDIVIDUAL CHECKS
  // ==========================================================================

  private checkPlanIdExists(plan: RepositoryChangePlan): RepositoryChangeCheck {
    const exists = plan.planId != null && plan.planId.length > 0
    return {
      checkId: 'check-plan-id-exists',
      name: 'Plan ID exists',
      passed: exists,
      message: exists
        ? `Plan ID '${plan.planId}' is present.`
        : 'Plan ID is missing or empty.',
    }
  }

  private checkTargetPathExists(plan: RepositoryChangePlan): RepositoryChangeCheck {
    const exists = plan.targetPath != null && plan.targetPath.length > 0
    return {
      checkId: 'check-target-path-exists',
      name: 'Target path exists',
      passed: exists,
      message: exists
        ? `Target path '${plan.targetPath}' is present.`
        : 'Target path is missing or empty.',
    }
  }

  private checkPhasesExist(plan: RepositoryChangePlan): RepositoryChangeCheck {
    const exists = plan.phases != null && plan.phases.length > 0
    return {
      checkId: 'check-phases-exist',
      name: 'At least one phase exists',
      passed: exists,
      message: exists
        ? `${plan.phases.length} phase(s) present.`
        : 'No phases present.',
    }
  }

  private checkPhaseOrderSequential(plan: RepositoryChangePlan): RepositoryChangeCheck {
    if (!plan.phases || plan.phases.length === 0) {
      return {
        checkId: 'check-phase-order-sequential',
        name: 'Phase order is sequential',
        passed: false,
        message: 'No phases to check.',
      }
    }

    const sequential = plan.phases.every((phase, index) => phase.order === index + 1)
    return {
      checkId: 'check-phase-order-sequential',
      name: 'Phase order is sequential',
      passed: sequential,
      message: sequential
        ? 'Phase order is sequential (1, 2, 3, ...).'
        : 'Phase order is not sequential.',
    }
  }

  private checkEstimatedStepsMatch(plan: RepositoryChangePlan): RepositoryChangeCheck {
    if (!plan.phases) {
      return {
        checkId: 'check-estimated-steps-match',
        name: 'Estimated steps equals total phase targets',
        passed: false,
        message: 'No phases to check.',
      }
    }

    const totalTargets = plan.phases.reduce(
      (sum, phase) => sum + (phase.targets?.length ?? 0),
      0
    )
    const matches = plan.estimatedSteps === totalTargets

    return {
      checkId: 'check-estimated-steps-match',
      name: 'Estimated steps equals total phase targets',
      passed: matches,
      message: matches
        ? `Estimated steps (${plan.estimatedSteps}) matches total targets (${totalTargets}).`
        : `Estimated steps (${plan.estimatedSteps}) does not match total targets (${totalTargets}).`,
    }
  }

  private checkPhaseIdsUnique(plan: RepositoryChangePlan): RepositoryChangeCheck {
    if (!plan.phases || plan.phases.length === 0) {
      return {
        checkId: 'check-phase-ids-unique',
        name: 'Every phase has a unique phaseId',
        passed: false,
        message: 'No phases to check.',
      }
    }

    const phaseIds = plan.phases.map((p) => p.phaseId)
    const uniqueIds = new Set(phaseIds)
    const unique = phaseIds.length === uniqueIds.size

    return {
      checkId: 'check-phase-ids-unique',
      name: 'Every phase has a unique phaseId',
      passed: unique,
      message: unique
        ? `All ${phaseIds.length} phase IDs are unique.`
        : 'Duplicate phase IDs found.',
    }
  }

  private checkRiskLevelValid(plan: RepositoryChangePlan): RepositoryChangeCheck {
    const valid = VALID_RISK_LEVELS.has(plan.riskLevel)
    return {
      checkId: 'check-risk-level-valid',
      name: 'Risk level is valid',
      passed: valid,
      message: valid
        ? `Risk level '${plan.riskLevel}' is valid.`
        : `Risk level '${plan.riskLevel}' is not valid.`,
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default validator instance. Stateless and safe to share.
 */
export const repositoryChangeValidator = new RepositoryChangeValidator()
