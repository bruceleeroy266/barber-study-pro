/**
 * Execution — Execution Lifecycle Coordinator
 *
 * Deterministic coordinator that orchestrates all post-execution processing
 * for an ExecutionOutcome. Centralizes the pipeline: verification, analysis,
 * recovery assessment, recovery planning, and recovery execution.
 *
 * The coordinator:
 * - delegates to existing components without modifying them.
 * - does NOT change execution behavior.
 * - does NOT introduce new recovery logic.
 * - never throws.
 * - never mutates inputs.
 *
 * Milestone 8.3.1: execution lifecycle coordination only.
 */

import { ExecutionOutcome } from './execution-outcome'
import { ExecutionVerifier, executionVerifier } from './execution-verifier'
import { VerificationAnalyzer, verificationAnalyzer } from './verification-analyzer'
import { RecoveryAssessor, recoveryAssessor } from './recovery-assessor'
import { RecoveryPlanner, recoveryPlanner } from './recovery-planner'
import { RecoveryEngine, recoveryEngine } from './recovery-engine'
import { ExecutionLifecycle, LifecycleStage } from './execution-lifecycle'
import { requireNonNull, requireProperty, combineGuards } from './execution-guards'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in lifecycle metadata. */
const COORDINATOR_VERSION = 'execution-lifecycle-coordinator@8.3.1'

// ============================================================================
// EXECUTION LIFECYCLE COORDINATOR
// ============================================================================

/**
 * Deterministic coordinator for post-execution processing.
 *
 * Orchestrates the complete pipeline: verify → analyze → assess → plan → execute.
 * Attaches all resulting data to the outcome and returns a new immutable
 * ExecutionOutcome with lifecycle metadata.
 */
export class ExecutionLifecycleCoordinator {
  private readonly verifier: ExecutionVerifier
  private readonly analyzer: VerificationAnalyzer
  private readonly assessor: RecoveryAssessor
  private readonly planner: RecoveryPlanner
  private readonly recoveryEngine: RecoveryEngine

  /**
   * @param ver - The execution verifier to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   * @param anal - The verification analyzer to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   * @param assess - The recovery assessor to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   * @param plan - The recovery planner to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   * @param recEngine - The recovery engine to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   */
  constructor(
    ver: ExecutionVerifier = executionVerifier,
    anal: VerificationAnalyzer = verificationAnalyzer,
    assess: RecoveryAssessor = recoveryAssessor,
    plan: RecoveryPlanner = recoveryPlanner,
    recEngine: RecoveryEngine = recoveryEngine
  ) {
    this.verifier = ver
    this.analyzer = anal
    this.assessor = assess
    this.planner = plan
    this.recoveryEngine = recEngine
  }

  /**
   * Processes the given ExecutionOutcome through the complete lifecycle.
   *
   * Executes all post-execution stages in deterministic order, attaches
   * results to the outcome, and returns a new immutable ExecutionOutcome
   * with lifecycle metadata.
   *
   * @param outcome - The ExecutionOutcome to process.
   * @returns A new immutable ExecutionOutcome with all lifecycle data attached.
   */
  process(outcome: ExecutionOutcome): ExecutionOutcome {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(outcome, 'ExecutionOutcome'),
      requireNonNull(outcome?.executionResult, 'ExecutionOutcome.executionResult'),
      requireNonNull(outcome?.executionQueue, 'ExecutionOutcome.executionQueue'),
      requireNonNull(outcome?.executionProgress, 'ExecutionOutcome.executionProgress'),
      requireProperty(outcome, 'outcomeId', 'ExecutionOutcome')
    )

    if (!guard.passed) {
      // Return the outcome unchanged with diagnostic metadata attached
      return {
        ...outcome,
        metadata: {
          ...outcome?.metadata,
          lifecycleBlocked: true,
          lifecycleBlockReason: guard.message,
          lifecycleBlockGuard: guard.guardName,
        },
      }
    }

    // Stage 1: Verification
    const verification = this.verifier.verify(outcome)

    // Stage 2: Analysis
    const analysis = this.analyzer.analyze(verification)

    // Stage 3: Recovery Assessment
    const assessment = this.assessor.assess(analysis)

    // Stage 4: Recovery Planning
    const recoveryPlan = this.planner.plan(assessment)

    // Stage 5: Recovery Execution
    const recoveryResult = this.recoveryEngine.execute(recoveryPlan)

    // Build lifecycle metadata
    const lifecycle = this.buildLifecycle(outcome.outcomeId)

    // Return new immutable outcome with all data attached
    return {
      ...outcome,
      executionVerification: {
        ...verification,
        verificationAnalysis: {
          ...analysis,
          recoveryAssessment: {
            ...assessment,
            recoveryPlan,
            recoveryResult,
          },
        },
      },
      metadata: {
        ...outcome.metadata,
        executionLifecycle: lifecycle,
      },
    }
  }

  /**
   * Builds the immutable ExecutionLifecycle metadata.
   *
   * @param outcomeId - The outcome identifier.
   * @returns An immutable ExecutionLifecycle.
   */
  private buildLifecycle(outcomeId: string): ExecutionLifecycle {
    const stages: readonly LifecycleStage[] = [
      'Verification',
      'Analysis',
      'RecoveryAssessment',
      'RecoveryPlanning',
      'RecoveryExecution',
    ]

    return {
      lifecycleId: `lifecycle-${outcomeId}`,
      lifecycleVersion: COORDINATOR_VERSION,
      outcomeId,
      stages,
      metadata: {
        coordinatorVersion: COORDINATOR_VERSION,
        outcomeId,
        processedAt: new Date().toISOString(),
        stageCount: stages.length,
      },
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default coordinator instance. Stateless and safe to share.
 */
export const executionLifecycleCoordinator = new ExecutionLifecycleCoordinator()
