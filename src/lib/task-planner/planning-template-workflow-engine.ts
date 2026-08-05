/**
 * Task Planner — Planning Template Workflow Engine
 *
 * Deterministic engine that resolves a WorkflowVersion to a concrete
 * PlanningTemplateWorkflow. Delegates version selection to the
 * PolicyWorkflowSelector — the policy layer routes which workflow version
 * is used. Populates step intents via the WorkflowStepIntentEngine.
 *
 * The engine:
 * - does NOT execute workflows or change planning behavior.
 * - is deterministic — the same version always produces the same workflow.
 *
 * Milestone 5.1.2: workflow definition only.
 * Milestone 5.2.1: policy-aware workflow selection.
 * Milestone 5.2.2: versioned workflow resolution.
 * Milestone 5.2.3: workflow step intent population.
 */

import { PlanningPolicy } from './planning-policy'
import { PlanningTemplate } from './planning-template'
import {
  PlanningTemplateWorkflow,
  PlanningTemplateWorkflowStep,
} from './planning-template-workflow'
import { PolicyWorkflowSelector, policyWorkflowSelector } from './policy-workflow-selector'
import { WorkflowVersion } from './workflow-version'
import {
  WorkflowStepIntentEngine,
  workflowStepIntentEngine,
} from './workflow-step-intent-engine'

// ============================================================================
// DEFAULT WORKFLOW STEP DEFINITIONS
// ============================================================================

/**
 * The default four-step workflow definitions, without intents.
 * Intents are populated by the WorkflowStepIntentEngine.
 */
const DEFAULT_WORKFLOW_STEP_DEFINITIONS: readonly Omit<PlanningTemplateWorkflowStep, 'intent'>[] = [
  {
    id: 'analyze-task',
    name: 'Analyze Task',
    description: 'Review the task requirements and constraints.',
    order: 0,
  },
  {
    id: 'prepare-work',
    name: 'Prepare Work',
    description: 'Set up the working environment and gather prerequisites.',
    order: 1,
  },
  {
    id: 'execute-changes',
    name: 'Execute Changes',
    description: 'Perform the required modifications.',
    order: 2,
  },
  {
    id: 'verify-results',
    name: 'Verify Results',
    description: 'Validate that the changes meet the requirements.',
    order: 3,
  },
]

// ============================================================================
// WORKFLOW LOOKUP TABLE
// ============================================================================

/**
 * Centralized mapping from templateId to workflow step definitions.
 * Single source of truth — no branching beyond this table.
 */
const TEMPLATE_WORKFLOW_DEFINITIONS: Readonly<Record<string, readonly Omit<PlanningTemplateWorkflowStep, 'intent'>[]>> = {
  'generic-template': DEFAULT_WORKFLOW_STEP_DEFINITIONS,
  'code-change-template': DEFAULT_WORKFLOW_STEP_DEFINITIONS,
  'bug-fix-template': DEFAULT_WORKFLOW_STEP_DEFINITIONS,
  'refactor-template': DEFAULT_WORKFLOW_STEP_DEFINITIONS,
  'testing-template': DEFAULT_WORKFLOW_STEP_DEFINITIONS,
  'documentation-template': DEFAULT_WORKFLOW_STEP_DEFINITIONS,
  'configuration-template': DEFAULT_WORKFLOW_STEP_DEFINITIONS,
  'database-template': DEFAULT_WORKFLOW_STEP_DEFINITIONS,
  'deployment-template': DEFAULT_WORKFLOW_STEP_DEFINITIONS,
}

// ============================================================================
// PLANNING TEMPLATE WORKFLOW ENGINE
// ============================================================================

export class PlanningTemplateWorkflowEngine {
  private readonly selector: PolicyWorkflowSelector
  private readonly intentEngine: WorkflowStepIntentEngine

  /**
   * @param selector - The policy workflow selector to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   * @param intentEng - The workflow step intent engine to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   */
  constructor(
    selector: PolicyWorkflowSelector = policyWorkflowSelector,
    intentEng: WorkflowStepIntentEngine = workflowStepIntentEngine
  ) {
    this.selector = selector
    this.intentEngine = intentEng
  }

  /**
   * Resolves the workflow owned by the given template.
   *
   * @param template - The planning template whose workflow to resolve.
   * @returns An immutable PlanningTemplateWorkflow.
   */
  resolve(template: PlanningTemplate): PlanningTemplateWorkflow {
    // Create a minimal policy for delegation — the selector currently
    // ignores policy specifics and returns the template's workflow version.
    const policy: PlanningPolicy = {
      policyId: `policy-${template.templateId}`,
      policyName: 'Standard',
      planningTemplate: template,
      policyVersion: '1.0.0',
      rationale: 'Delegated from PlanningTemplateWorkflowEngine',
    }

    const version = this.selector.select(policy, template)
    return this.resolveVersion(version)
  }

  /**
   * Resolves a WorkflowVersion to a concrete PlanningTemplateWorkflow.
   *
   * @param version - The workflow version to resolve.
   * @returns An immutable PlanningTemplateWorkflow.
   */
  resolveVersion(version: WorkflowVersion): PlanningTemplateWorkflow {
    const stepDefinitions = TEMPLATE_WORKFLOW_DEFINITIONS[version.templateId] ?? DEFAULT_WORKFLOW_STEP_DEFINITIONS
    const steps = stepDefinitions.map((def) => this.populateIntent(def))

    return {
      templateId: version.templateId,
      workflowVersion: version.versionId,
      steps,
    }
  }

  /**
   * Populates the intent for a workflow step definition.
   *
   * @param definition - The step definition without an intent.
   * @returns A complete PlanningTemplateWorkflowStep with intent.
   */
  private populateIntent(
    definition: Omit<PlanningTemplateWorkflowStep, 'intent'>
  ): PlanningTemplateWorkflowStep {
    return {
      ...definition,
      intent: this.intentEngine.resolve(definition.name),
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default workflow engine instance. Stateless and safe to share.
 */
export const planningTemplateWorkflowEngine = new PlanningTemplateWorkflowEngine()
