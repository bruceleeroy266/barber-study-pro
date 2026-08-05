/**
 * Task Planner — Workflow Version Model
 *
 * Immutable models representing a versioned workflow selection.
 * A PlanningPolicy selects a WorkflowVersion, which is then resolved
 * to a concrete PlanningTemplateWorkflow.
 *
 * Milestone 5.2.2: versioned workflow selection only.
 */

import { PlanningPolicy } from './planning-policy'

// ============================================================================
// WORKFLOW VERSION
// ============================================================================

/**
 * A versioned workflow selection.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface WorkflowVersion {
  /** Stable identifier for the version. */
  readonly versionId: string

  /** Human-readable name of the version. */
  readonly versionName: string

  /** The planning policy that selected this version. */
  readonly planningPolicy: PlanningPolicy

  /** The template that owns this workflow version. */
  readonly templateId: string
}
