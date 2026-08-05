/**
 * Task Planner — Workflow Step Intent Model
 *
 * Immutable models representing the deterministic intent of a workflow step.
 * Each step in a PlanningTemplateWorkflow carries an intent describing its
 * purpose within the workflow.
 *
 * Milestone 5.2.3: workflow step intent model only.
 */

// ============================================================================
// WORKFLOW STEP INTENT VALUES
// ============================================================================

/**
 * The available workflow step intents.
 *
 * - Analysis: Understanding the task requirements and constraints.
 * - Preparation: Setting up the working environment and prerequisites.
 * - Execution: Performing the required modifications.
 * - Verification: Validating that changes meet requirements.
 */
export type WorkflowStepIntentValue = 'Analysis' | 'Preparation' | 'Execution' | 'Verification'

// ============================================================================
// WORKFLOW STEP INTENT
// ============================================================================

/**
 * The intent of a workflow step.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface WorkflowStepIntent {
  /** Stable identifier for the intent. */
  readonly intentId: string

  /** Human-readable name of the intent. */
  readonly intentName: WorkflowStepIntentValue

  /** Description of what this intent represents. */
  readonly description: string

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
