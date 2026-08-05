/**
 * Task Planner — Planning Template Workflow Model
 *
 * Immutable models representing the workflow defined by a PlanningTemplate.
 * Each template owns its workflow — the planner delegates to the template
 * rather than using a global sequence.
 *
 * Milestone 5.1.2: workflow definition model only.
 * Milestone 5.2.3: workflow step intent added.
 */

import { WorkflowStepIntent } from './workflow-step-intent'

// ============================================================================
// WORKFLOW STEP
// ============================================================================

/**
 * A single step within a template workflow.
 */
export interface PlanningTemplateWorkflowStep {
  /** Stable identifier for the step. */
  readonly id: string

  /** Human-readable name of the step. */
  readonly name: string

  /** Description of what the step does. */
  readonly description: string

  /** Zero-based position in the workflow. */
  readonly order: number

  /** The deterministic intent of this step. */
  readonly intent: WorkflowStepIntent
}

// ============================================================================
// PLANNING TEMPLATE WORKFLOW
// ============================================================================

/**
 * The workflow defined by a PlanningTemplate.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface PlanningTemplateWorkflow {
  /** The template that owns this workflow. */
  readonly templateId: string

  /** Version of the workflow definition. */
  readonly workflowVersion: string

  /** The steps that make up this workflow. */
  readonly steps: readonly PlanningTemplateWorkflowStep[]
}
