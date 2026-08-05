/**
 * Task Planner — Public API
 *
 * Re-exports the immutable planning models, planner contract, and generators.
 *
 * Milestones 1–5, 1.4.1: models, contract, skeleton, phase, step generation,
 * and complexity-based phase strategy.
 *
 * Milestone 1.3.2: foundation engine (ExecutionAssessment → TaskPlan).
 */

// Task Step
export type { TaskStep, TaskStepMetadata } from './task-step'

// Task Phase
export type { TaskPhase, TaskPhaseMetadata } from './task-phase'

// Task Plan
export type { TaskPlan, TaskPlanMetadata } from './task-plan'

// Planner Request
export type { TaskPlannerRequest, TaskPlannerRequestMetadata } from './task-planner-request'

// Planner Result
export type { TaskPlannerResult, TaskPlannerResultMetadata } from './task-planner-result'

// Initial Plan Generator
export { InitialPlanGenerator } from './initial-plan-generator'

// Complexity Phase Strategy
export type { PhaseDefinition } from './complexity-phase-strategy'
export { ComplexityPhaseStrategy } from './complexity-phase-strategy'

// Phase Generator
export { PhaseGenerator } from './phase-generator'

// Complexity Step Strategy
export type { StepDefinition } from './complexity-step-strategy'
export { ComplexityStepStrategy } from './complexity-step-strategy'

// Step Priority Strategy
export { StepPriority, StepPriorityStrategy } from './step-priority-strategy'

// Step Dependency Strategy
export { StepDependencyStrategy } from './step-dependency-strategy'

// Step Constraint Strategy
export { ExecutionConstraint, StepConstraintStrategy } from './step-constraint-strategy'

// Step Generator
export { StepGenerator } from './step-generator'

// Foundation Planner Contract & Engine (Milestone 1.3.2)
export type { TaskPlanner } from './task-planner'
export { PlanningError } from './task-planner'
export { TaskPlannerEngine, taskPlannerEngine } from './task-planner-engine'

// Single-Phase Generator (Milestone 1.3.3)
export { TaskPhaseGenerator, taskPhaseGenerator } from './task-phase-generator'

// Single-Step Generator (Milestone 1.3.4)
export { TaskStepGenerator, taskStepGenerator } from './task-step-generator'

// Step Strategy Foundation (Milestone 1.3.5)
export type { StepStrategy } from './step-strategy'
export { DefaultStepStrategy, defaultStepStrategy } from './default-step-strategy'

// Planning Step Sequence (Milestone 1.3.6)
export type { PlanningStepSequenceEntry } from './planning-step-sequence'
export { DEFAULT_PLANNING_STEP_SEQUENCE } from './planning-step-sequence'

// Decomposition Readiness (Milestone 1.4.1)
export { DecompositionReadinessStatus } from './decomposition-readiness'
export type { DecompositionReadiness, DecompositionReason } from './decomposition-readiness'
export {
  DecompositionReadinessEngine,
  decompositionReadinessEngine,
  DEFAULT_DECOMPOSITION_THRESHOLDS,
} from './decomposition-readiness-engine'
export type { DecompositionThresholds } from './decomposition-readiness-engine'

// Decomposition Proposal (Milestone 1.4.2)
export { DecompositionStrategy } from './decomposition-proposal'
export type { DecompositionProposal, ProposedGroup } from './decomposition-proposal'
export {
  DecompositionProposalEngine,
  decompositionProposalEngine,
} from './decomposition-proposal-engine'

// Task Classification (Milestone 1.5.1)
export { TaskType } from './task-classification'
export type { TaskClassification, ClassificationRuleMatch } from './task-classification'
export {
  TaskClassificationEngine,
  taskClassificationEngine,
} from './task-classification-engine'

// Planning Strategy Recommendation (Milestone 1.5.2)
export { PlanningStrategy } from './planning-strategy'
export type { PlanningStrategyRecommendation } from './planning-strategy'
export {
  PlanningStrategyEngine,
  planningStrategyEngine,
} from './planning-strategy-engine'

// Resource Requirements (Milestone 1.5.3)
export { ResourceLevel } from './resource-requirements'
export type { ResourceRequirements } from './resource-requirements'
export {
  ResourceRequirementsEngine,
  resourceRequirementsEngine,
} from './resource-requirements-engine'

// Planning Template Selection (Milestone 5.1.1)
export type { PlanningTemplate } from './planning-template'
export {
  PlanningTemplateEngine,
  planningTemplateEngine,
} from './planning-template-engine'

// Planning Template Workflow (Milestone 5.1.2)
export type { PlanningTemplateWorkflow, PlanningTemplateWorkflowStep } from './planning-template-workflow'
export {
  PlanningTemplateWorkflowEngine,
  planningTemplateWorkflowEngine,
} from './planning-template-workflow-engine'

// Planning Policy Selection (Milestone 5.1.3)
export type { PlanningPolicy, PlanningPolicyValue } from './planning-policy'
export {
  PlanningPolicyEngine,
  planningPolicyEngine,
} from './planning-policy-engine'

// Policy-Aware Workflow Selection (Milestone 5.2.1)
export {
  PolicyWorkflowSelector,
  policyWorkflowSelector,
} from './policy-workflow-selector'

// Versioned Workflow Selection (Milestone 5.2.2)
export type { WorkflowVersion } from './workflow-version'

// Workflow Step Intent (Milestone 5.2.3)
export type { WorkflowStepIntent, WorkflowStepIntentValue } from './workflow-step-intent'
export {
  WorkflowStepIntentEngine,
  workflowStepIntentEngine,
} from './workflow-step-intent-engine'

// Planning Validation (Milestone 5.3.1)
export type {
  PlanningValidation,
  PlanningValidationCheck,
  PlanningValidationStatus,
} from './planning-validation'
export {
  PlanningValidationEngine,
  planningValidationEngine,
} from './planning-validation-engine'

// Legacy Planner Implementations (preserved for backward compatibility)
export { InitialTaskPlanner, PlaceholderTaskPlanner } from './task-planner-engine'
