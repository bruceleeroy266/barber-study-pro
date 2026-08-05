/**
 * Task Planner — Default Step Strategy
 *
 * The default implementation of StepStrategy. Generates one TaskStep for
 * every entry in the workflow owned by the selected PlanningTemplate.
 *
 * The workflow is resolved through the PlanningTemplateWorkflowEngine,
 * shifting ownership from a global sequence to the template.
 *
 * Milestone 5.1.2: workflow ownership relocated to templates.
 */

import { ExecutionAssessment } from '../execution-budget/execution-assessment'
import { TaskStep } from './task-step'
import { StepStrategy } from './step-strategy'
import { StepPriority } from './step-priority-strategy'
import { ExecutionConstraint } from './step-constraint-strategy'
import {
  PlanningTemplateWorkflowEngine,
  planningTemplateWorkflowEngine,
} from './planning-template-workflow-engine'
import { PlanningTemplateWorkflowStep } from './planning-template-workflow'
import { PlanningTemplate } from './planning-template'
import { PlanningStrategy } from './planning-strategy'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in step metadata. */
const GENERATOR_VERSION = 'task-step-generator@5.1.2'

// ============================================================================
// DEFAULT STEP STRATEGY
// ============================================================================

/**
 * Default step generation strategy.
 *
 * Produces exactly one TaskStep per workflow step defined by the selected
 * PlanningTemplate. The output is deterministic — the same assessment
 * always yields the same steps.
 */
export class DefaultStepStrategy implements StepStrategy {
  private readonly workflowEngine: PlanningTemplateWorkflowEngine

  /**
   * @param workflowEng - The workflow engine used to resolve template
   *   workflows. Defaults to the shared singleton instance. Injected for
   *   testability.
   */
  constructor(
    workflowEng: PlanningTemplateWorkflowEngine = planningTemplateWorkflowEngine
  ) {
    this.workflowEngine = workflowEng
  }

  /**
   * Generates one TaskStep for every step in the template workflow.
   *
   * @param assessment - The execution assessment to derive the steps from.
   * @returns A readonly array of TaskSteps (one per workflow step).
   */
  generate(assessment: ExecutionAssessment): readonly TaskStep[] {
    const workflow = this.workflowEngine.resolve(this.resolveTemplate())
    return workflow.steps.map((step) => this.buildStep(step, assessment))
  }

  /**
   * Resolves the PlanningTemplate for the given assessment.
   *
   * Since all templates currently share the same workflow, this returns a
   * deterministic default. In later milestones, the actual selected template
   * will be passed through the planning pipeline.
   */
  private resolveTemplate(): PlanningTemplate {
    return {
      templateId: 'generic-template',
      templateName: 'Generic Planning Template',
      planningStrategy: PlanningStrategy.Generic,
      templateVersion: '1.0.0',
      rationale: 'Default template resolved by step strategy.',
    }
  }

  /**
   * Builds a single TaskStep from a workflow step and assessment.
   */
  private buildStep(
    step: PlanningTemplateWorkflowStep,
    assessment: ExecutionAssessment
  ): TaskStep {
    return {
      id: this.generateStepId(step, assessment),
      name: step.name,
      description: step.description,
      estimatedComplexity: assessment.complexityReport.level,
      estimatedFiles: assessment.complexityReport.estimatedFileCount,
      estimatedRuntime: assessment.complexityReport.estimatedRuntime ?? 0,
      priority: StepPriority.Normal,
      dependsOn: [],
      constraint: ExecutionConstraint.None,
      metadata: {
        generatedBy: GENERATOR_VERSION,
        sourceDecision: assessment.budgetDecision.decision,
        sourceComplexity: assessment.complexityReport.totalScore,
        sequenceOrder: step.order,
      },
    }
  }

  /**
   * Generates a deterministic step ID from the workflow step and assessment.
   * No timestamps — same assessment always produces the same IDs.
   */
  private generateStepId(
    step: PlanningTemplateWorkflowStep,
    assessment: ExecutionAssessment
  ): string {
    const score = assessment.complexityReport.totalScore
    const decision = assessment.budgetDecision.decision
    return `step-${step.order + 1}-${step.id}-${decision}-${score}`
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default strategy instance. Stateless and safe to share.
 */
export const defaultStepStrategy = new DefaultStepStrategy()
