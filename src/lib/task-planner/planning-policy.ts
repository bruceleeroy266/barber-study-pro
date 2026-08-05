/**
 * Task Planner — Planning Policy Model
 *
 * Immutable models representing the deterministic selection of a planning
 * policy based on the selected PlanningTemplate.
 *
 * It carries no policy execution, no adaptive planning, and no behavior
 * changes — it is purely a selection attached to the plan.
 *
 * Milestone 5.1.3: policy selection model only.
 */

import { PlanningTemplate } from './planning-template'

// ============================================================================
// PLANNING POLICY VALUES
// ============================================================================

/**
 * The available planning policies.
 *
 * - Standard: Balanced approach suitable for most tasks.
 * - Conservative: Cautious approach with extra validation and smaller steps.
 * - Aggressive: Streamlined approach optimized for speed and efficiency.
 */
export type PlanningPolicyValue = 'Standard' | 'Conservative' | 'Aggressive'

// ============================================================================
// PLANNING POLICY
// ============================================================================

/**
 * The selected planning policy.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface PlanningPolicy {
  /** Stable identifier for the policy. */
  readonly policyId: string

  /** Human-readable name of the policy. */
  readonly policyName: string

  /** The planning template that produced this selection. */
  readonly planningTemplate: PlanningTemplate

  /** Version of the policy. */
  readonly policyVersion: string

  /** Human-readable rationale for the selection. */
  readonly rationale: string

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
