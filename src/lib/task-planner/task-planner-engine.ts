/**
 * Task Planner — Foundation Engine
 *
 * Deterministic implementation of the TaskPlanner interface. Validates the
 * ExecutionAssessment, requires READY status, and produces a TaskPlan with
 * empty phases and populated metadata.
 *
 * The engine:
 * - contains no planning logic, phase generation, or decomposition.
 * - does not inspect repositories, use AI, or create execution strategies.
 * - is deterministic — the same assessment always produces the same plan.
 * - throws PlanningError on validation failure; no recovery, no retry.
 *
 * Milestone 1.3.2: foundation engine only.
 */

import { ExecutionAssessment } from '../execution-budget/execution-assessment'
import { ExecutionReadinessStatus } from '../execution-budget/execution-readiness'
import { TaskPlan } from './task-plan'
import { TaskPlanner, PlanningError } from './task-planner'
import { TaskPhaseGenerator, taskPhaseGenerator } from './task-phase-generator'
import { DecompositionReadinessEngine, decompositionReadinessEngine } from './decomposition-readiness-engine'
import { DecompositionProposalEngine, decompositionProposalEngine } from './decomposition-proposal-engine'
import { TaskClassificationEngine, taskClassificationEngine } from './task-classification-engine'
import { PlanningStrategyEngine, planningStrategyEngine } from './planning-strategy-engine'
import { ResourceRequirementsEngine, resourceRequirementsEngine } from './resource-requirements-engine'
import { PlanningTemplateEngine, planningTemplateEngine } from './planning-template-engine'
import { PlanningPolicyEngine, planningPolicyEngine } from './planning-policy-engine'
import { PlanningValidationEngine, planningValidationEngine } from './planning-validation-engine'
import { ExecutionContextBuilder, executionContextBuilder } from '../execution/execution-context-builder'
import { TaskPlannerRequest } from './task-planner-request'
import { TaskPlannerResult } from './task-planner-result'
import { InitialPlanGenerator } from './initial-plan-generator'
import { PhaseGenerator } from './phase-generator'
import { StepGenerator } from './step-generator'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in plan metadata. */
const PLANNER_VERSION = 'task-planner-engine@1.3.2'

// ============================================================================
// TASK PLANNER ENGINE
// ============================================================================

/**
 * The foundation TaskPlanner implementation.
 *
 * Validates that the ExecutionAssessment is READY, then produces an empty
 * TaskPlan with metadata. No phases, steps, or decomposition are generated.
 */
export class TaskPlannerEngine implements TaskPlanner {
  private readonly phaseGenerator: TaskPhaseGenerator
  private readonly readinessEngine: DecompositionReadinessEngine
  private readonly proposalEngine: DecompositionProposalEngine
  private readonly classificationEngine: TaskClassificationEngine
  private readonly strategyEngine: PlanningStrategyEngine
  private readonly resourceEngine: ResourceRequirementsEngine
  private readonly templateEngine: PlanningTemplateEngine
  private readonly policyEngine: PlanningPolicyEngine
  private readonly validationEngine: PlanningValidationEngine
  private readonly contextBuilder: ExecutionContextBuilder

  /**
   * @param phaseGen - The phase generator to use. Defaults to the shared
   *   singleton instance. Injected for testability.
   * @param readinessEng - The decomposition readiness engine to use. Defaults
   *   to the shared singleton instance. Injected for testability.
   * @param proposalEng - The decomposition proposal engine to use. Defaults
   *   to the shared singleton instance. Injected for testability.
   * @param classificationEng - The task classification engine to use. Defaults
   *   to the shared singleton instance. Injected for testability.
   * @param strategyEng - The planning strategy engine to use. Defaults
   *   to the shared singleton instance. Injected for testability.
   * @param resourceEng - The resource requirements engine to use. Defaults
   *   to the shared singleton instance. Injected for testability.
   * @param templateEng - The planning template engine to use. Defaults
   *   to the shared singleton instance. Injected for testability.
   * @param policyEng - The planning policy engine to use. Defaults
   *   to the shared singleton instance. Injected for testability.
   * @param validationEng - The planning validation engine to use. Defaults
   *   to the shared singleton instance. Injected for testability.
   * @param contextBld - The execution context builder to use. Defaults
   *   to the shared singleton instance. Injected for testability.
   */
  constructor(
    phaseGen: TaskPhaseGenerator = taskPhaseGenerator,
    readinessEng: DecompositionReadinessEngine = decompositionReadinessEngine,
    proposalEng: DecompositionProposalEngine = decompositionProposalEngine,
    classificationEng: TaskClassificationEngine = taskClassificationEngine,
    strategyEng: PlanningStrategyEngine = planningStrategyEngine,
    resourceEng: ResourceRequirementsEngine = resourceRequirementsEngine,
    templateEng: PlanningTemplateEngine = planningTemplateEngine,
    policyEng: PlanningPolicyEngine = planningPolicyEngine,
    validationEng: PlanningValidationEngine = planningValidationEngine,
    contextBld: ExecutionContextBuilder = executionContextBuilder
  ) {
    this.phaseGenerator = phaseGen
    this.readinessEngine = readinessEng
    this.proposalEngine = proposalEng
    this.classificationEngine = classificationEng
    this.strategyEngine = strategyEng
    this.resourceEngine = resourceEng
    this.templateEngine = templateEng
    this.policyEngine = policyEng
    this.validationEngine = validationEng
    this.contextBuilder = contextBld
  }

  /**
   * Produces a task plan from the given execution assessment.
   *
   * @param assessment - The complete execution assessment from the upstream pipeline.
   * @returns A TaskPlan with one phase and populated metadata.
   * @throws {PlanningError} When the assessment is not READY.
   */
  plan(assessment: ExecutionAssessment): TaskPlan {
    this.validate(assessment)

    const phase = this.phaseGenerator.generate(assessment)
    const decompositionReadiness = this.readinessEngine.assess(assessment)
    const decompositionProposal = this.proposalEngine.propose(assessment, decompositionReadiness)
    const taskClassification = this.classificationEngine.classify(assessment)
    const planningStrategy = this.strategyEngine.recommend(taskClassification)
    const resourceRequirements = this.resourceEngine.estimate(assessment)
    const planningTemplate = this.templateEngine.select(planningStrategy)
    const planningPolicy = this.policyEngine.select(planningTemplate)

    const taskPlan: TaskPlan = {
      id: this.generatePlanId(assessment),
      name: this.generatePlanName(assessment),
      phases: [phase],
      metadata: {
        plannerVersion: PLANNER_VERSION,
        createdAt: new Date().toISOString(),
        sourceDecision: assessment.budgetDecision.decision,
        sourceComplexity: assessment.complexityReport.totalScore,
        decompositionReadiness,
        decompositionProposal,
        taskClassification,
        planningStrategy,
        resourceRequirements,
        planningTemplate,
        planningPolicy,
      },
    }

    const planningValidation = this.validationEngine.validate(taskPlan)

    const planWithValidation: TaskPlan = {
      ...taskPlan,
      metadata: {
        ...taskPlan.metadata,
        planningValidation,
      },
    }

    const executionContext = this.contextBuilder.build(planWithValidation)

    return {
      ...planWithValidation,
      metadata: {
        ...planWithValidation.metadata,
        executionContext,
      },
    }
  }

  /**
   * Validates the execution assessment.
   *
   * @param assessment - The assessment to validate.
   * @throws {PlanningError} When validation fails.
   */
  private validate(assessment: ExecutionAssessment): void {
    if (!assessment) {
      throw new PlanningError(
        'missing_assessment',
        'Planning failed: execution assessment is required.',
        assessment
      )
    }

    if (assessment.executionReadiness.status !== ExecutionReadinessStatus.Ready) {
      throw new PlanningError(
        'not_ready',
        `Planning failed: execution readiness is ${assessment.executionReadiness.status}, ` +
          `but ${ExecutionReadinessStatus.Ready} is required. ` +
          `Failed requirements: ${assessment.executionReadiness.failedRequirements.length}.`,
        assessment
      )
    }
  }

  /**
   * Generates a deterministic plan ID from the assessment.
   */
  private generatePlanId(assessment: ExecutionAssessment): string {
    const timestamp = assessment.complexityReport.metadata.generatedAt
    const score = assessment.complexityReport.totalScore
    return `plan-${timestamp}-${score}`
  }

  /**
   * Generates a human-readable plan name from the assessment.
   */
  private generatePlanName(assessment: ExecutionAssessment): string {
    const description = assessment.complexityReport.metadata.taskDescription
    return `Plan: ${description}`
  }
}

// ============================================================================
// LEGACY IMPLEMENTATIONS (preserved for backward compatibility)
// ============================================================================

/**
 * The legacy TaskPlanner implementation that generates phases and steps.
 *
 * @deprecated Use TaskPlannerEngine for the foundation contract. This class
 *             will be removed in a future milestone.
 */
export class InitialTaskPlanner {
  private readonly planGenerator: InitialPlanGenerator
  private readonly phaseGenerator: PhaseGenerator
  private readonly stepGenerator: StepGenerator

  constructor(
    planGenerator?: InitialPlanGenerator,
    phaseGenerator?: PhaseGenerator,
    stepGenerator?: StepGenerator
  ) {
    this.planGenerator = planGenerator ?? new InitialPlanGenerator()
    this.phaseGenerator = phaseGenerator ?? new PhaseGenerator()
    this.stepGenerator = stepGenerator ?? new StepGenerator()
  }

  plan(request: TaskPlannerRequest): TaskPlannerResult {
    if (!request) {
      return {
        success: false,
        summary: 'Planning failed: request is required.',
        metadata: {
          error: 'missing_request',
          plannerVersion: '1.3.5',
        },
      }
    }

    const skeletonPlan = this.planGenerator.generate(request)
    const planWithPhases = this.phaseGenerator.generate(request, skeletonPlan)
    const taskPlan = this.stepGenerator.generate(request, planWithPhases)

    const totalSteps = taskPlan.phases.reduce((count, phase) => count + phase.steps.length, 0)

    return {
      success: true,
      taskPlan,
      summary: `Task plan created for task: "${taskPlan.name}". Plan ID: ${taskPlan.id}. Phases: ${taskPlan.phases.length}, Steps: ${totalSteps}.`,
      metadata: {
        plannerVersion: '1.3.5',
        generatedBy: 'InitialTaskPlanner',
        phaseCount: taskPlan.phases.length,
        stepCount: totalSteps,
      },
    }
  }
}

/**
 * @deprecated Use InitialTaskPlanner instead. This placeholder will be removed
 *             in a future milestone.
 */
export class PlaceholderTaskPlanner {
  private readonly delegate: InitialTaskPlanner

  constructor() {
    this.delegate = new InitialTaskPlanner()
  }

  plan(request: TaskPlannerRequest): TaskPlannerResult {
    return this.delegate.plan(request)
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default planner engine instance. Stateless and safe to share.
 */
export const taskPlannerEngine = new TaskPlannerEngine()
