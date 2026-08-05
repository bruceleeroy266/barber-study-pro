/**
 * Execution — Execution Engine Foundation
 *
 * Deterministic engine that consumes an ExecutionContext and produces an
 * immutable ExecutionSession. This milestone establishes the foundation only —
 * no work is executed, no state is mutated, and every session begins Pending.
 *
 * The engine:
 * - does NOT execute steps, schedule work, or perform retries.
 * - does NOT inspect repositories or use AI.
 * - does NOT modify the TaskPlan or ExecutionContext.
 * - never throws — always returns a Pending session.
 *
 * Milestone 6.2.1: execution engine foundation only.
 */

import { ExecutionContext } from './execution-context'
import { ExecutionSession, ExecutionSessionStatus } from './execution-session'
import { ExecutionQueueBuilder, executionQueueBuilder } from './execution-queue-builder'
import { ExecutionProgressBuilder, executionProgressBuilder } from './execution-progress-builder'
import { ExecutionStepRunner, executionStepRunner } from './execution-step-runner'
import { ExecutionQueue, ExecutionQueueItem } from './execution-queue'
import { ExecutionHistoryRecorder, executionHistoryRecorder } from './execution-history-recorder'
import { ExecutionHistory } from './execution-history'
import { ExecutionQueueUpdater, executionQueueUpdater } from './execution-queue-updater'
import { ExecutionProgressUpdater, executionProgressUpdater } from './execution-progress-updater'
import { ExecutionProgress } from './execution-progress'
import { ExecutionOutcome } from './execution-outcome'
import { ExecutionQueueRunner } from './execution-queue-runner'
import { ExecutionLifecycleCoordinator, executionLifecycleCoordinator } from './execution-lifecycle-coordinator'
import { requireNonNull, requireProperty, combineGuards, GuardResult } from './execution-guards'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in session metadata. */
const ENGINE_VERSION = 'execution-engine@6.2.1'

// ============================================================================
// EXECUTION ENGINE
// ============================================================================

/**
 * Deterministic foundation for execution session creation.
 *
 * Accepts an ExecutionContext and returns an immutable ExecutionSession
 * with status Pending. Execution is intentionally deferred to a future
 * milestone.
 */
export class ExecutionEngine {
  private readonly queueBuilder: ExecutionQueueBuilder
  private readonly progressBuilder: ExecutionProgressBuilder
  private readonly stepRunner: ExecutionStepRunner
  private readonly historyRecorder: ExecutionHistoryRecorder
  private readonly queueUpdater: ExecutionQueueUpdater
  private readonly progressUpdater: ExecutionProgressUpdater
  private readonly lifecycleCoordinator: ExecutionLifecycleCoordinator

  /**
   * @param queueBld - The execution queue builder to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   * @param progressBld - The execution progress builder to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   * @param stepRun - The execution step runner to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   * @param historyRec - The execution history recorder to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   * @param queueUpd - The execution queue updater to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   * @param progressUpd - The execution progress updater to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   * @param lifecycleCoord - The execution lifecycle coordinator to use. Defaults to the
   *   shared singleton instance. Injected for testability.
   */
  constructor(
    queueBld: ExecutionQueueBuilder = executionQueueBuilder,
    progressBld: ExecutionProgressBuilder = executionProgressBuilder,
    stepRun: ExecutionStepRunner = executionStepRunner,
    historyRec: ExecutionHistoryRecorder = executionHistoryRecorder,
    queueUpd: ExecutionQueueUpdater = executionQueueUpdater,
    progressUpd: ExecutionProgressUpdater = executionProgressUpdater,
    lifecycleCoord: ExecutionLifecycleCoordinator = executionLifecycleCoordinator
  ) {
    this.queueBuilder = queueBld
    this.progressBuilder = progressBld
    this.stepRunner = stepRun
    this.historyRecorder = historyRec
    this.queueUpdater = queueUpd
    this.progressUpdater = progressUpd
    this.lifecycleCoordinator = lifecycleCoord
  }

  /**
   * Creates an ExecutionSession from the given ExecutionContext.
   *
   * Regardless of readiness status, every session begins as Pending.
   * No exceptions are thrown. No work is executed.
   *
   * @param context - The ExecutionContext to consume.
   * @returns An immutable ExecutionSession with status Pending and an attached queue.
   */
  start(context: ExecutionContext): ExecutionSession {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(context, 'ExecutionContext'),
      requireNonNull(context?.taskPlan, 'ExecutionContext.taskPlan'),
      requireProperty(context, 'contextId', 'ExecutionContext')
    )

    if (!guard.passed) {
      // Return a blocked session with diagnostic information
      return this.buildBlockedSession(context, guard)
    }

    const status: ExecutionSessionStatus = 'Pending'

    const session: ExecutionSession = {
      sessionId: `session-${context.contextId}`,
      sessionVersion: ENGINE_VERSION,
      executionContext: context,
      status,
      metadata: {
        engineVersion: ENGINE_VERSION,
        contextId: context.contextId,
        readinessStatus: context.readiness?.status ?? 'unknown',
        createdAt: new Date().toISOString(),
      },
    }

    const executionQueue = this.queueBuilder.build(session)
    const executionProgress = this.progressBuilder.build(executionQueue)

    return {
      ...session,
      metadata: {
        ...session.metadata,
        executionQueue,
        executionProgress,
      },
    }
  }

  /**
   * Builds a blocked session when input validation fails.
   *
   * @param context - The potentially invalid ExecutionContext.
   * @param guard - The failed guard result with diagnostic info.
   * @returns An immutable ExecutionSession with status Blocked.
   */
  private buildBlockedSession(
    context: ExecutionContext | null | undefined,
    guard: GuardResult
  ): ExecutionSession {
    const contextId = context?.contextId ?? 'unknown'
    return {
      sessionId: `session-blocked-${contextId}`,
      sessionVersion: ENGINE_VERSION,
      executionContext: context as ExecutionContext,
      status: 'Failed',
      metadata: {
        engineVersion: ENGINE_VERSION,
        contextId,
        blocked: true,
        blockReason: guard.message,
        blockGuard: guard.guardName,
        createdAt: new Date().toISOString(),
      },
    }
  }

  /**
   * Executes the first Pending queue item in the session.
   *
   * Locates the first Pending item from the session's execution queue,
   * passes it to the step runner, records the result in history, updates
   * the queue, synchronizes progress, and verifies the outcome. Does NOT
   * mutate the session.
   *
   * @param session - The ExecutionSession containing the queue.
   * @returns An immutable ExecutionOutcome with executionVerification attached,
   *   or null if no Pending items exist or input validation fails.
   */
  executeNext(session: ExecutionSession): ExecutionOutcome | null {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(session, 'ExecutionSession'),
      requireNonNull(session?.metadata, 'ExecutionSession.metadata')
    )

    if (!guard.passed) {
      return null
    }

    const queue = session.metadata?.executionQueue as ExecutionQueue | undefined

    if (!queue?.items) {
      return null
    }

    const firstPending: ExecutionQueueItem | undefined = queue.items.find(
      (item) => item.status === 'Pending'
    )

    if (!firstPending) {
      return null
    }

    const result = this.stepRunner.run(firstPending)

    const existingHistory = session.metadata?.executionHistory as ExecutionHistory | undefined
    this.historyRecorder.record(result, existingHistory)

    const updatedQueue = this.queueUpdater.update(queue, result)

    const existingProgress = session.metadata?.executionProgress as ExecutionProgress
    const updatedProgress = this.progressUpdater.update(existingProgress, updatedQueue)

    const outcome: ExecutionOutcome = {
      outcomeId: `outcome-${result.resultId}`,
      outcomeVersion: 'execution-outcome@7.2.2',
      executionResult: result,
      executionQueue: updatedQueue,
      executionProgress: updatedProgress,
      metadata: {
        sessionId: session.sessionId,
        queueItemId: result.queueItemId,
        createdAt: new Date().toISOString(),
      },
    }

    return this.lifecycleCoordinator.process(outcome)
  }

  /**
   * Executes every Pending queue item in order.
   *
   * Creates an ExecutionQueueRunner and delegates sequential execution.
   * Reuses executeNext() for each item. Does NOT modify executeNext()
   * behavior. Does NOT mutate the original session.
   *
   * @param session - The ExecutionSession containing the queue.
   * @returns An array of ExecutionOutcomes, one per executed item, in order.
   */
  executeAll(session: ExecutionSession): ExecutionOutcome[] {
    const runner = new ExecutionQueueRunner(this)
    return runner.run(session)
  }
}
