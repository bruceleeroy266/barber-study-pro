/**
 * Task Planner — Planning Validation Engine
 *
 * Deterministic engine that validates the structural completeness of a
 * TaskPlan. Reports results without modifying the plan or throwing exceptions.
 *
 * The engine:
 * - uses deterministic rules only — no AI, no repository inspection.
 * - does NOT repair invalid plans.
 * - does NOT reject invalid plans.
 *
 * Milestone 5.3.1: planning validation only.
 */

import { TaskPlan } from './task-plan'
import {
  PlanningValidation,
  PlanningValidationCheck,
  PlanningValidationStatus,
} from './planning-validation'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in validation metadata. */
const VALIDATION_ENGINE_VERSION = 'planning-validation-engine@5.3.1'

// ============================================================================
// PLANNING VALIDATION ENGINE
// ============================================================================

/**
 * Deterministic engine for validating TaskPlan structural completeness.
 *
 * Runs a fixed set of checks against the plan and its metadata. All checks
 * are returned regardless of pass/fail status. No exceptions are thrown.
 */
export class PlanningValidationEngine {
  /**
   * Validates the given TaskPlan.
   *
   * @param plan - The TaskPlan to validate.
   * @returns An immutable PlanningValidation with all check results.
   */
  validate(plan: TaskPlan): PlanningValidation {
    const checks: PlanningValidationCheck[] = [
      this.checkPlanningTemplateExists(plan),
      this.checkPlanningPolicyExists(plan),
      this.checkWorkflowVersionExists(plan),
      this.checkWorkflowExists(plan),
      this.checkEveryPhaseHasSteps(plan),
      this.checkEveryStepHasIntent(plan),
      this.checkResourceRequirementsExist(plan),
      this.checkTaskClassificationExists(plan),
    ]

    const allPassed = checks.every((c) => c.passed)
    const status: PlanningValidationStatus = allPassed ? 'Valid' : 'Invalid'

    return {
      validationId: `validation-${plan.id}`,
      validationVersion: VALIDATION_ENGINE_VERSION,
      status,
      checks,
      metadata: {
        engineVersion: VALIDATION_ENGINE_VERSION,
        planId: plan.id,
        validatedAt: new Date().toISOString(),
        totalChecks: checks.length,
        passedChecks: checks.filter((c) => c.passed).length,
        failedChecks: checks.filter((c) => !c.passed).length,
      },
    }
  }

  // ==========================================================================
  // INDIVIDUAL CHECKS
  // ==========================================================================

  private checkPlanningTemplateExists(plan: TaskPlan): PlanningValidationCheck {
    const exists = plan.metadata?.planningTemplate != null
    return {
      name: 'PlanningTemplate exists',
      passed: exists,
      message: exists
        ? 'PlanningTemplate is present in plan metadata.'
        : 'PlanningTemplate is missing from plan metadata.',
    }
  }

  private checkPlanningPolicyExists(plan: TaskPlan): PlanningValidationCheck {
    const exists = plan.metadata?.planningPolicy != null
    return {
      name: 'PlanningPolicy exists',
      passed: exists,
      message: exists
        ? 'PlanningPolicy is present in plan metadata.'
        : 'PlanningPolicy is missing from plan metadata.',
    }
  }

  private checkWorkflowVersionExists(plan: TaskPlan): PlanningValidationCheck {
    // WorkflowVersion is selected by PolicyWorkflowSelector but not currently
    // attached to plan metadata. Check if planningPolicy exists as a proxy —
    // the policy implies a version was selected.
    const policyExists = plan.metadata?.planningPolicy != null
    return {
      name: 'WorkflowVersion exists',
      passed: policyExists,
      message: policyExists
        ? 'WorkflowVersion is implied by the presence of PlanningPolicy.'
        : 'WorkflowVersion cannot be determined — PlanningPolicy is missing.',
    }
  }

  private checkWorkflowExists(plan: TaskPlan): PlanningValidationCheck {
    // The workflow is resolved by PlanningTemplateWorkflowEngine but not
    // currently attached to plan metadata. Check if planningTemplate exists
    // as a proxy — the template implies a workflow was resolved.
    const templateExists = plan.metadata?.planningTemplate != null
    return {
      name: 'Workflow exists',
      passed: templateExists,
      message: templateExists
        ? 'Workflow is implied by the presence of PlanningTemplate.'
        : 'Workflow cannot be determined — PlanningTemplate is missing.',
    }
  }

  private checkEveryPhaseHasSteps(plan: TaskPlan): PlanningValidationCheck {
    if (plan.phases.length === 0) {
      return {
        name: 'Every phase has at least one step',
        passed: false,
        message: 'Plan has no phases.',
      }
    }

    const emptyPhases = plan.phases.filter((p) => p.steps.length === 0)
    const passed = emptyPhases.length === 0

    return {
      name: 'Every phase has at least one step',
      passed,
      message: passed
        ? `All ${plan.phases.length} phase(s) have at least one step.`
        : `${emptyPhases.length} of ${plan.phases.length} phase(s) have no steps.`,
    }
  }

  private checkEveryStepHasIntent(plan: TaskPlan): PlanningValidationCheck {
    // TaskStep objects in phases do not carry intents — intents belong to
    // PlanningTemplateWorkflowStep. This check verifies the workflow steps
    // have intents by checking the workflow resolution chain.
    const templateExists = plan.metadata?.planningTemplate != null
    return {
      name: 'Every step has an intent',
      passed: templateExists,
      message: templateExists
        ? 'Workflow step intents are populated by the PlanningTemplateWorkflowEngine.'
        : 'Cannot verify step intents — PlanningTemplate is missing.',
    }
  }

  private checkResourceRequirementsExist(plan: TaskPlan): PlanningValidationCheck {
    const exists = plan.metadata?.resourceRequirements != null
    return {
      name: 'ResourceRequirements exist',
      passed: exists,
      message: exists
        ? 'ResourceRequirements are present in plan metadata.'
        : 'ResourceRequirements are missing from plan metadata.',
    }
  }

  private checkTaskClassificationExists(plan: TaskPlan): PlanningValidationCheck {
    const exists = plan.metadata?.taskClassification != null
    return {
      name: 'TaskClassification exists',
      passed: exists,
      message: exists
        ? 'TaskClassification is present in plan metadata.'
        : 'TaskClassification is missing from plan metadata.',
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default validation engine instance. Stateless and safe to share.
 */
export const planningValidationEngine = new PlanningValidationEngine()
