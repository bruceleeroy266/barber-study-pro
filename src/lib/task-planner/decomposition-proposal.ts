/**
 * Task Planner — Decomposition Proposal Model
 *
 * Immutable models representing a deterministic proposal for how a task
 * should be divided when decomposition is required.
 *
 * It carries no actual decomposition logic — it is purely a proposal
 * attached to the TaskPlan metadata.
 *
 * Milestone 1.4.2: proposal model only.
 */

// ============================================================================
// DECOMPOSITION STRATEGY
// ============================================================================

/**
 * The strategy used to propose decomposition.
 */
export enum DecompositionStrategy {
  /** Split into preparation and execution phases. */
  PreparationThenExecution = 'preparation_then_execution',
}

// ============================================================================
// PROPOSED GROUP
// ============================================================================

/**
 * A proposed grouping of steps within a phase.
 */
export interface ProposedGroup {
  /** Stable identifier for the group. */
  readonly id: string

  /** Human-readable name of the group. */
  readonly name: string

  /** The step names proposed for this group. */
  readonly stepNames: readonly string[]
}

// ============================================================================
// DECOMPOSITION PROPOSAL
// ============================================================================

/**
 * The result of generating a decomposition proposal.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface DecompositionProposal {
  /** Stable identifier for the proposal. */
  readonly proposalId: string

  /** The strategy used to generate the proposal. */
  readonly strategy: DecompositionStrategy

  /** The number of phases proposed. */
  readonly proposedPhaseCount: number

  /** The proposed groups of steps. */
  readonly proposedGroups: readonly ProposedGroup[]

  /** Human-readable rationale for the proposal. */
  readonly rationale: string

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
