/**
 * Task Planner — Policy Workflow Selector
 *
 * Deterministic selector that routes workflow selection through the policy layer.
 * Selects a WorkflowVersion based on the PlanningPolicy, which is then resolved
 * to a concrete PlanningTemplateWorkflow by the engine.
 *
 * The selector:
 * - does NOT modify workflow contents or generated TaskSteps.
 * - is deterministic — the same policy and template always produce the same version.
 *
 * Milestone 5.2.1: policy-aware workflow selection.
 * Milestone 5.2.2: versioned workflow selection.
 */

import { PlanningPolicy } from './planning-policy'
import { PlanningTemplate } from './planning-template'
import { WorkflowVersion } from './workflow-version'

// ============================================================================
// VERSION LOOKUP TABLE
// ============================================================================

/**
 * Centralized mapping from policy name to workflow version.
 * All policies currently map to v1 — the existing workflow version.
 */
const POLICY_VERSION_MAP: Readonly<Record<string, string>> = {
  'Standard': 'v1',
  'Conservative': 'v1',
  'Aggressive': 'v1',
} as const

/** Fallback version for unknown policies. */
const FALLBACK_VERSION = 'v1'

// ============================================================================
// POLICY WORKFLOW SELECTOR
// ============================================================================

/**
 * Deterministic selector for versioned workflow resolution.
 *
 * Routes workflow version selection through the policy layer. Currently maps
 * all policies to v1 — Standard, Conservative, and Aggressive all receive
 * the same workflow version.
 */
export class PolicyWorkflowSelector {
  /**
   * Selects the workflow version for the given policy and template.
   *
   * @param policy - The selected planning policy.
   * @param template - The planning template that owns the workflow.
   * @returns An immutable WorkflowVersion.
   */
  select(policy: PlanningPolicy, template: PlanningTemplate): WorkflowVersion {
    const versionId = POLICY_VERSION_MAP[policy.policyName] ?? FALLBACK_VERSION

    return {
      versionId,
      versionName: `Workflow ${versionId}`,
      planningPolicy: policy,
      templateId: template.templateId,
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default policy workflow selector instance. Stateless and safe to share.
 */
export const policyWorkflowSelector = new PolicyWorkflowSelector()
