/**
 * Task Planner — Workflow Step Intent Engine
 *
 * Deterministic engine that resolves the intent of a workflow step based on
 * the step name. Uses a centralized lookup table — no AI, no repository
 * inspection, no adaptive behavior.
 *
 * Milestone 5.2.3: workflow step intent resolution only.
 */

import { WorkflowStepIntent } from './workflow-step-intent'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in intent metadata. */
const INTENT_ENGINE_VERSION = 'workflow-step-intent-engine@5.2.3'

// ============================================================================
// INTENT DEFINITIONS
// ============================================================================

const ANALYSIS_INTENT: WorkflowStepIntent = {
  intentId: 'intent-analysis',
  intentName: 'Analysis',
  description: 'Understanding the task requirements and constraints.',
  metadata: { engineVersion: INTENT_ENGINE_VERSION },
}

const PREPARATION_INTENT: WorkflowStepIntent = {
  intentId: 'intent-preparation',
  intentName: 'Preparation',
  description: 'Setting up the working environment and prerequisites.',
  metadata: { engineVersion: INTENT_ENGINE_VERSION },
}

const EXECUTION_INTENT: WorkflowStepIntent = {
  intentId: 'intent-execution',
  intentName: 'Execution',
  description: 'Performing the required modifications.',
  metadata: { engineVersion: INTENT_ENGINE_VERSION },
}

const VERIFICATION_INTENT: WorkflowStepIntent = {
  intentId: 'intent-verification',
  intentName: 'Verification',
  description: 'Validating that changes meet requirements.',
  metadata: { engineVersion: INTENT_ENGINE_VERSION },
}

// ============================================================================
// INTENT LOOKUP TABLE
// ============================================================================

/**
 * Centralized mapping from workflow step name to intent.
 * Single source of truth — no branching beyond this table.
 */
const STEP_INTENT_MAP: Readonly<Record<string, WorkflowStepIntent>> = {
  'Analyze Task': ANALYSIS_INTENT,
  'Prepare Work': PREPARATION_INTENT,
  'Execute Changes': EXECUTION_INTENT,
  'Verify Results': VERIFICATION_INTENT,
} as const

/** Fallback intent for unknown step names. */
const FALLBACK_INTENT: WorkflowStepIntent = EXECUTION_INTENT

// ============================================================================
// WORKFLOW STEP INTENT ENGINE
// ============================================================================

/**
 * Deterministic engine for resolving workflow step intents.
 *
 * Maps step names to their corresponding intents using a centralized lookup
 * table. No AI, no repository inspection, no adaptive behavior.
 */
export class WorkflowStepIntentEngine {
  /**
   * Resolves the intent for the given workflow step name.
   *
   * @param stepName - The human-readable name of the workflow step.
   * @returns The corresponding WorkflowStepIntent.
   */
  resolve(stepName: string): WorkflowStepIntent {
    return STEP_INTENT_MAP[stepName] ?? FALLBACK_INTENT
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default intent engine instance. Stateless and safe to share.
 */
export const workflowStepIntentEngine = new WorkflowStepIntentEngine()
