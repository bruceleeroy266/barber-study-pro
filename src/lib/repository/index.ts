/**
 * Repository — Public API
 *
 * Re-exports the immutable repository inventory, classification,
 * dependency graph, impact analysis, and change plan models and engines.
 *
 * Milestone 9.1.1: repository inventory.
 * Milestone 9.1.2: repository classification.
 * Milestone 9.2.1: repository dependency graph.
 * Milestone 9.2.2: repository impact analysis.
 * Milestone 9.3.1: repository change planning.
 * Milestone 9.3.2: repository change validation.
 * Milestone 9.4.1: repository change readiness assessment.
 * Milestone 9.4.2: repository change execution planning.
 * Milestone 10.0.1: repository execution coordination.
 * Milestone 10.1.1: repository operation orchestration.
 */

// Repository Inventory (Milestone 9.1.1)
export type {
  RepositoryDirectory,
  RepositoryFile,
  RepositoryFileCategory,
  RepositoryInventory,
} from './repository-inventory'
export {
  RepositoryInventoryEngine,
  repositoryInventoryEngine,
} from './repository-inventory-engine'

// Repository Classification (Milestone 9.1.2)
export type {
  Framework,
  PackageManager,
  PrimaryLanguage,
  ProjectType,
  RepositoryClassification,
} from './repository-classification'
export {
  RepositoryClassificationEngine,
  repositoryClassificationEngine,
} from './repository-classification-engine'

// Repository Dependency Graph (Milestone 9.2.1)
export type {
  DependencyRelationship,
  RepositoryDependencyGraph,
  RepositoryEdge,
  RepositoryNode,
} from './repository-dependency-graph'
export {
  RepositoryDependencyGraphEngine,
  repositoryDependencyGraphEngine,
} from './repository-dependency-graph-engine'

// Repository Impact Analysis (Milestone 9.2.2)
export type {
  RepositoryImpactAnalysis,
  RiskLevel,
} from './repository-impact-analysis'
export {
  RepositoryImpactAnalysisEngine,
  repositoryImpactAnalysisEngine,
} from './repository-impact-analysis-engine'

// Repository Change Plan (Milestone 9.3.1)
export type {
  RepositoryChangePhase,
  RepositoryChangePlan,
} from './repository-change-plan'
export {
  RepositoryChangePlanner,
  repositoryChangePlanner,
} from './repository-change-planner'

// Repository Change Validation (Milestone 9.3.2)
export type {
  RepositoryChangeCheck,
  RepositoryChangeValidation,
  ValidationStatus,
} from './repository-change-validation'
export {
  RepositoryChangeValidator,
  repositoryChangeValidator,
} from './repository-change-validator'

// Repository Change Readiness (Milestone 9.4.1)
export type {
  ReadinessStatus,
  RepositoryChangeBlocker,
  RepositoryChangeReadiness,
  RepositoryChangeRecommendation,
} from './repository-change-readiness'
export {
  RepositoryChangeReadinessAssessor,
  repositoryChangeReadinessAssessor,
} from './repository-change-readiness-assessor'

// Repository Change Execution Plan (Milestone 9.4.2)
export type {
  ExecutionPlanStatus,
  RepositoryChangeExecutionPlan,
  RepositoryExecutionOperation,
  RepositoryExecutionStage,
} from './repository-change-execution-plan'
export {
  RepositoryChangeExecutionPlanner,
  repositoryChangeExecutionPlanner,
} from './repository-change-execution-planner'

// Repository Execution Session (Milestone 10.0.1)
export type {
  ExecutionSessionStatus,
  RepositoryExecutionSession,
} from './repository-execution-session'
export {
  RepositoryExecutionCoordinator,
  repositoryExecutionCoordinator,
} from './repository-execution-coordinator'

// Repository Operation Queue (Milestone 10.1.1)
export type {
  QueueStatus,
  RepositoryOperationQueue,
  RepositoryQueuedOperation,
} from './repository-operation-queue'
export {
  RepositoryOperationOrchestrator,
  repositoryOperationOrchestrator,
} from './repository-operation-orchestrator'
