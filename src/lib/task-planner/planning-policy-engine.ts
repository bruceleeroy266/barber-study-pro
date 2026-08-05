/**
 * Task Planner — Planning Policy Engine
 *
 * Deterministic engine that selects a PlanningPolicy based on the provided
 * PlanningTemplate. Uses a centralized lookup table with no AI, no repository
 * inspection, and no behavior changes.
 *
 * Milestone 5.1.3: policy selection engine only.
 */

import { PlanningTemplate } from './planning-template'
import { PlanningPolicy, PlanningPolicyValue } from './planning-policy'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in policy metadata. */
const POLICY_ENGINE_VERSION = 'planning-policy-engine@5.1.3'

/** Default policy version for all generated policies. */
const DEFAULT_POLICY_VERSION = '1.0.0'

// ============================================================================
// POLICY LOOKUP TABLE
// ============================================================================

/**
 * Centralized lookup table mapping template IDs to policy values.
 *
 * All templates initially map to Standard. This milestone establishes the
 * architecture only — template-specific policies are deferred.
 */
const TEMPLATE_POLICY_MAP: Readonly<Record<string, PlanningPolicyValue>> = {
  // All templates default to Standard
  'template-standard': 'Standard',
  'template-conservative': 'Standard',
  'template-aggressive': 'Standard',
  'template-decomposition': 'Standard',
  'template-default': 'Standard',
} as const

/** Fallback policy for unknown templates. */
const FALLBACK_POLICY: PlanningPolicyValue = 'Standard'

// ============================================================================
// PLANNING POLICY ENGINE
// ============================================================================

/**
 * Deterministic engine for selecting planning policies.
 *
 * Uses a centralized lookup table to map PlanningTemplate selections to
 * PlanningPolicy values. No AI, no repository inspection, no behavior changes.
 */
export class PlanningPolicyEngine {
  /**
   * Selects a planning policy for the given planning template.
   *
   * @param template - The planning template to evaluate.
   * @returns The selected planning policy.
   */
  select(template: PlanningTemplate): PlanningPolicy {
    const policyValue = this.lookupPolicy(template.templateId)
    return this.buildPolicy(template, policyValue)
  }

  /**
   * Looks up the policy value for a template ID.
   *
   * @param templateId - The template identifier.
   * @returns The mapped policy value, or the fallback if not found.
   */
  private lookupPolicy(templateId: string): PlanningPolicyValue {
    return TEMPLATE_POLICY_MAP[templateId] ?? FALLBACK_POLICY
  }

  /**
   * Builds an immutable PlanningPolicy from the template and policy value.
   *
   * @param template - The source planning template.
   * @param policyValue - The selected policy value.
   * @returns The constructed planning policy.
   */
  private buildPolicy(
    template: PlanningTemplate,
    policyValue: PlanningPolicyValue
  ): PlanningPolicy {
    return {
      policyId: `policy-${template.templateId}`,
      policyName: policyValue,
      planningTemplate: template,
      policyVersion: DEFAULT_POLICY_VERSION,
      rationale: `Template '${template.templateName}' maps to policy '${policyValue}' via centralized lookup.`,
      metadata: {
        engineVersion: POLICY_ENGINE_VERSION,
        selectedAt: new Date().toISOString(),
        templateId: template.templateId,
        templateVersion: template.templateVersion,
      },
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default policy engine instance. Stateless and safe to share.
 */
export const planningPolicyEngine = new PlanningPolicyEngine()
