/**
 * Execution Engine — Public API
 *
 * Re-exports the immutable execution state models, factory, and evaluator.
 *
 * Milestone 1.5.1–1.5.3: models, state initialization, and readiness evaluation.
 */

// Execution Status
export { ExecutionStatus } from './execution-status'

// Execution Step State
export type { ExecutionStepState, ExecutionStepStateMetadata } from './execution-step-state'

// Execution Phase State
export type { ExecutionPhaseState, ExecutionPhaseStateMetadata } from './execution-phase-state'

// Execution State
export type { ExecutionState, ExecutionStateMetadata } from './execution-state'

// Execution State Factory
export { ExecutionStateFactory } from './execution-state-factory'

// Execution Readiness Evaluator
export type { ExecutionReadinessResult } from './execution-readiness-evaluator'
export { ExecutionReadinessEvaluator } from './execution-readiness-evaluator'

// Execution Context (Milestone 6.1.1)
export type { ExecutionContext } from './execution-context'
export { ExecutionContextBuilder, executionContextBuilder } from './execution-context-builder'

// Execution Readiness Assessment (Milestone 6.1.2)
export type {
  ExecutionReadiness,
  ExecutionReadinessCheck,
  ExecutionReadinessStatus,
} from './execution-readiness'
export {
  ExecutionReadinessEngine,
  executionReadinessEngine,
} from './execution-readiness-engine'

// Execution Session (Milestone 6.2.1)
export type { ExecutionSession, ExecutionSessionStatus } from './execution-session'

// Execution Queue (Milestone 6.2.2)
export type {
  ExecutionQueue,
  ExecutionQueueItem,
  ExecutionQueueItemStatus,
} from './execution-queue'
export { ExecutionQueueBuilder, executionQueueBuilder } from './execution-queue-builder'

// Execution Progress (Milestone 6.2.3)
export type {
  ExecutionProgress,
  ExecutionProgressStatus,
} from './execution-progress'
export { ExecutionProgressBuilder, executionProgressBuilder } from './execution-progress-builder'

// Execution Result (Milestone 7.1.1)
export type { ExecutionResult, ExecutionResultStatus } from './execution-result'

// Execution Step Runner (Milestone 7.1.1)
export { ExecutionStepRunner, executionStepRunner } from './execution-step-runner'

// Execution History (Milestone 7.1.2)
export type {
  ExecutionHistory,
  ExecutionHistoryEntry,
} from './execution-history'
export {
  ExecutionHistoryRecorder,
  executionHistoryRecorder,
} from './execution-history-recorder'

// Execution Queue Updater (Milestone 7.1.3)
export { ExecutionQueueUpdater, executionQueueUpdater } from './execution-queue-updater'

// Execution Progress Updater (Milestone 7.2.1)
export { ExecutionProgressUpdater, executionProgressUpdater } from './execution-progress-updater'

// Execution Outcome (Milestone 7.2.2)
export type { ExecutionOutcome } from './execution-outcome'

// Execution Queue Runner (Milestone 7.3.1)
export { ExecutionQueueRunner } from './execution-queue-runner'

// Execution Verification (Milestone 8.1.1)
export type {
  ExecutionVerification,
  ExecutionVerificationCheck,
  ExecutionVerificationStatus,
} from './execution-verification'
export { ExecutionVerifier, executionVerifier } from './execution-verifier'

// Verification Analysis (Milestone 8.1.2)
export type {
  VerificationAnalysis,
  VerificationAnalysisSeverity,
  VerificationFailureCategory,
} from './verification-analysis'
export { VerificationAnalyzer, verificationAnalyzer } from './verification-analyzer'

// Recovery Assessment (Milestone 8.1.3)
export type {
  RecoveryAssessment,
  RecommendedAction,
} from './recovery-assessment'
export { RecoveryAssessor, recoveryAssessor } from './recovery-assessor'

// Recovery Plan (Milestone 8.2.1)
export type {
  RecoveryAction,
  RecoveryActionType,
  RecoveryPlan,
  RecoveryStrategy,
} from './recovery-plan'
export { RecoveryPlanner, recoveryPlanner } from './recovery-planner'

// Recovery Result (Milestone 8.2.2)
export type {
  ExecutedAction,
  ExecutedActionStatus,
  RecoveryResult,
  RecoveryResultStatus,
} from './recovery-result'
export { RecoveryEngine, recoveryEngine } from './recovery-engine'

// Execution Lifecycle (Milestone 8.3.1)
export type {
  ExecutionLifecycle,
  LifecycleStage,
} from './execution-lifecycle'
export {
  ExecutionLifecycleCoordinator,
  executionLifecycleCoordinator,
} from './execution-lifecycle-coordinator'

// Execution Engine Foundation (Milestone 6.2.1)
export { ExecutionEngine } from './execution-engine'

// Execution Guards (Milestone 10.2.1)
export type { GuardResult } from './execution-guards'
export {
  guardPass,
  guardFail,
  requireNonNull,
  requireNonEmptyString,
  requireNonEmptyArray,
  requireProperty,
  combineGuards,
  hashString,
} from './execution-guards'
