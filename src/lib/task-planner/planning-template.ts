/**
 * Task Planner — Planning Template Model
 *
 * Immutable models representing the deterministic selection of a planning
 * template based on the recommended PlanningStrategy.
 *
 * It carries no template execution, no adaptive planning, and no behavior
 * changes — it is purely a selection attached to the plan.
 *
 * Milestone 5.1.1: template selection model only.
 */

import { PlanningStrategy } from './planning-strategy'

// ============================================================================
// PLANNING TEMPLATE
// ============================================================================

/**
 * The selected planning template.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface PlanningTemplate {
  /** Stable identifier for the template. */
  readonly templateId: string

  /** Human-readable name of the template. */
  readonly templateName: string

  /** The planning strategy that produced this selection. */
  readonly planningStrategy: PlanningStrategy

  /** Version of the template. */
  readonly templateVersion: string

  /** Human-readable rationale for the selection. */
  readonly rationale: string

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
