/**
 * Execution — Execution Readiness Engine
 *
 * Deterministic engine that evaluates whether an ExecutionContext is
 * structurally ready for execution. Reports results without modifying the
 * context or throwing exceptions.
 *
 * The engine:
 * - uses deterministic rules only — no AI, no repository inspection.
 * - does NOT execute anything.
 * - does NOT repair failures.
 * - never throws.
 *
 * Milestone 6.1.2: execution readiness assessment only.
 */

import { ExecutionContext } from './execution-context'
import {
  ExecutionReadiness,
  ExecutionReadinessCheck,
  ExecutionReadinessStatus,
} from './execution-readiness'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in readiness metadata. */
const READINESS_ENGINE_VERSION = 'execution-readiness-engine@6.1.2'

// ============================================================================
// EXECUTION READINESS ENGINE
// ============================================================================

/**
 * Deterministic engine for assessing ExecutionContext structural readiness.
 *
 * Runs a fixed set of checks against the context. All checks are returned
 * regardless of pass/fail status. No exceptions are thrown. No repairs.
 */
export class ExecutionReadinessEngine {
  /**
   * Assesses the readiness of the given ExecutionContext.
   *
   * @param context - The ExecutionContext to assess.
   * @returns An immutable ExecutionReadiness with all check results.
   */
  assess(context: ExecutionContext): ExecutionReadiness {
    const checks: ExecutionReadinessCheck[] = [
      this.checkPlanningValidationValid(context),
      this.checkPlanningTemplateExists(context),
      this.checkPlanningPolicyExists(context),
      this.checkWorkflowVersionExists(context),
      this.checkResourceRequirementsExist(context),
      this.checkTaskClassificationExists(context),
      this.checkTaskPlanHasPhases(context),
      this.checkTaskPlanHasExecutableSteps(context),
    ]

    const allPassed = checks.every((c) => c.passed)
    const status: ExecutionReadinessStatus = allPassed ? 'Ready' : 'NotReady'

    return {
      readinessId: `readiness-${context.contextId}`,
      readinessVersion: READINESS_ENGINE_VERSION,
      status,
      checks,
      metadata: {
        engineVersion: READINESS_ENGINE_VERSION,
        contextId: context.contextId,
        assessedAt: new Date().toISOString(),
        totalChecks: checks.length,
        passedChecks: checks.filter((c) => c.passed).length,
        failedChecks: checks.filter((c) => !c.passed).length,
      },
    }
  }

  // ==========================================================================
  // INDIVIDUAL CHECKS
  // ==========================================================================

  private checkPlanningValidationValid(context: ExecutionContext): ExecutionReadinessCheck {
    const validation = context.planningValidation
    const isValid = validation != null && validation.status === 'Valid'
    return {
      name: 'PlanningValidation is Valid',
      passed: isValid,
      message: isValid
        ? 'PlanningValidation status is Valid.'
        : `PlanningValidation status is ${validation?.status ?? 'missing'}.`,
    }
  }

  private checkPlanningTemplateExists(context: ExecutionContext): ExecutionReadinessCheck {
    const exists = context.planningTemplate != null
    return {
      name: 'PlanningTemplate exists',
      passed: exists,
      message: exists
        ? 'PlanningTemplate is present.'
        : 'PlanningTemplate is missing.',
    }
  }

  private checkPlanningPolicyExists(context: ExecutionContext): ExecutionReadinessCheck {
    const exists = context.planningPolicy != null
    return {
      name: 'PlanningPolicy exists',
      passed: exists,
      message: exists
        ? 'PlanningPolicy is present.'
        : 'PlanningPolicy is missing.',
    }
  }

  private checkWorkflowVersionExists(context: ExecutionContext): ExecutionReadinessCheck {
    const exists = context.workflowVersion != null
    return {
      name: 'WorkflowVersion exists',
      passed: exists,
      message: exists
        ? `WorkflowVersion '${context.workflowVersion.versionId}' is present.`
        : 'WorkflowVersion is missing.',
    }
  }

  private checkResourceRequirementsExist(context: ExecutionContext): ExecutionReadinessCheck {
    const exists = context.resourceRequirements != null
    return {
      name: 'ResourceRequirements exist',
      passed: exists,
      message: exists
        ? 'ResourceRequirements are present.'
        : 'ResourceRequirements are missing.',
    }
  }

  private checkTaskClassificationExists(context: ExecutionContext): ExecutionReadinessCheck {
    const exists = context.taskClassification != null
    return {
      name: 'TaskClassification exists',
      passed: exists,
      message: exists
        ? 'TaskClassification is present.'
        : 'TaskClassification is missing.',
    }
  }

  private checkTaskPlanHasPhases(context: ExecutionContext): ExecutionReadinessCheck {
    const phaseCount = context.taskPlan?.phases?.length ?? 0
    const hasPhases = phaseCount > 0
    return {
      name: 'TaskPlan contains phases',
      passed: hasPhases,
      message: hasPhases
        ? `TaskPlan contains ${phaseCount} phase(s).`
        : 'TaskPlan contains no phases.',
    }
  }

  private checkTaskPlanHasExecutableSteps(context: ExecutionContext): ExecutionReadinessCheck {
    const phases = context.taskPlan?.phases ?? []
    const totalSteps = phases.reduce((count, phase) => count + (phase.steps?.length ?? 0), 0)
    const hasSteps = totalSteps > 0
    return {
      name: 'TaskPlan contains executable steps',
      passed: hasSteps,
      message: hasSteps
        ? `TaskPlan contains ${totalSteps} executable step(s) across ${phases.length} phase(s).`
        : 'TaskPlan contains no executable steps.',
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default readiness engine instance. Stateless and safe to share.
 */
export const executionReadinessEngine = new ExecutionReadinessEngine()
