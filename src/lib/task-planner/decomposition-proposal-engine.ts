/**
 * Task Planner — Decomposition Proposal Engine
 *
 * Deterministic engine that generates a decomposition proposal when
 * decomposition readiness indicates it is required. The engine produces a
 * fixed two-phase proposal (Analyze/Prepare, Execute/Verify) without
 * modifying the actual TaskPlan.
 *
 * The engine:
 * - returns null when decomposition is NOT_REQUIRED.
 * - returns a deterministic proposal when decomposition is REQUIRED.
 * - contains no AI, no repository inspection, no code analysis.
 *
 * Milestone 1.4.2: proposal generation only.
 */

import { ExecutionAssessment } from '../execution-budget/execution-assessment'
import {
  DecompositionReadiness,
  DecompositionReadinessStatus,
} from './decomposition-readiness'
import {
  DecompositionProposal,
  DecompositionStrategy,
  ProposedGroup,
} from './decomposition-proposal'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in proposal metadata. */
const ENGINE_VERSION = 'decomposition-proposal-engine@1.4.2'

// ============================================================================
// DECOMPOSITION PROPOSAL ENGINE
// ============================================================================

export class DecompositionProposalEngine {
  /**
   * Generates a decomposition proposal from the given assessment and readiness.
   *
   * @param assessment - The execution assessment to evaluate.
   * @param readiness - The decomposition readiness result.
   * @returns A DecompositionProposal when required, or null when not required.
   */
  propose(
    assessment: ExecutionAssessment,
    readiness: DecompositionReadiness
  ): DecompositionProposal | null {
    if (readiness.status === DecompositionReadinessStatus.NotRequired) {
      return null
    }

    return this.buildProposal(assessment, readiness)
  }

  /**
   * Builds a deterministic decomposition proposal.
   */
  private buildProposal(
    assessment: ExecutionAssessment,
    readiness: DecompositionReadiness
  ): DecompositionProposal {
    const proposedGroups: readonly ProposedGroup[] = [
      {
        id: 'phase-1-preparation',
        name: 'Preparation',
        stepNames: ['Analyze Task', 'Prepare Work'],
      },
      {
        id: 'phase-2-execution',
        name: 'Execution',
        stepNames: ['Execute Changes', 'Verify Results'],
      },
    ]

    return {
      proposalId: this.generateProposalId(assessment),
      strategy: DecompositionStrategy.PreparationThenExecution,
      proposedPhaseCount: 2,
      proposedGroups,
      rationale: this.buildRationale(readiness),
      metadata: {
        engineVersion: ENGINE_VERSION,
        sourceComplexity: assessment.complexityReport.totalScore,
        sourceDecision: assessment.budgetDecision.decision,
        readinessStatus: readiness.status,
      },
    }
  }

  /**
   * Generates a deterministic proposal ID from the assessment.
   */
  private generateProposalId(assessment: ExecutionAssessment): string {
    const score = assessment.complexityReport.totalScore
    const decision = assessment.budgetDecision.decision
    return `decomposition-${decision}-${score}`
  }

  /**
   * Builds a human-readable rationale from the readiness result.
   */
  private buildRationale(readiness: DecompositionReadiness): string {
    const reasonCount = readiness.reasons.length
    const reasonIds = readiness.reasons.map((r) => r.id).join(', ')
    return (
      `Decomposition is ${readiness.status}. ` +
      `${reasonCount} threshold(s) exceeded: ${reasonIds}. ` +
      'Proposed split: Preparation (Analyze, Prepare) then Execution (Execute, Verify).'
    )
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default proposal engine instance. Stateless and safe to share.
 */
export const decompositionProposalEngine = new DecompositionProposalEngine()
