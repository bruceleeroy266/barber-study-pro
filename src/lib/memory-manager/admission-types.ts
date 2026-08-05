/**
 * PingOS Memory Admission Controller — Types
 *
 * Defines the decision, priority, result, and rule types for the Admission
 * Controller. Designed for extensibility: new rules, priorities, and decision
 * outcomes can be added without breaking existing consumers.
 *
 * Phase 3: Admission control only — no persistence, embeddings, or AI.
 */

import { MemoryCategory, MemoryType, ConfidenceLevel, CreateMemoryInput } from './types'

// ============================================================================
// ADMISSION DECISION
// ============================================================================

/**
 * The outcome of evaluating a memory through the Admission Controller.
 */
export enum AdmissionDecision {
  /** Memory is accepted and should be stored. */
  Accept = 'accept',

  /** Memory is rejected and should NOT be stored. */
  Reject = 'reject',

  /** Memory is accepted but should be archived immediately (low long-term value). */
  ArchiveImmediately = 'archive_immediately',
}

// ============================================================================
// PRIORITY LEVELS
// ============================================================================

/**
 * Priority level assigned to accepted memories.
 * Determines retention, retrieval ranking, and storage treatment.
 */
export enum Priority {
  /** P0 — Permanent. Identity, mission, engineering principles. Never expire. */
  P0 = 'P0',

  /** P1 — Long-term. Architecture, project decisions. Retain indefinitely. */
  P1 = 'P1',

  /** P2 — Important. Engineering solutions, verified bugs. Retain for extended period. */
  P2 = 'P2',

  /** P3 — Temporary. Workspace, current sprint, active tasks. Retain for short period. */
  P3 = 'P3',

  /** P4 — Ephemeral. Debug output, logs, transient notes. Retain briefly or discard. */
  P4 = 'P4',
}

// ============================================================================
// ADMISSION RESULT
// ============================================================================

/**
 * The result of evaluating a memory through the Admission Controller.
 * Contains the decision, assigned priority, reasoning, and any warnings.
 */
export interface AdmissionResult {
  /** The admission decision. */
  decision: AdmissionDecision

  /** Priority assigned to the memory (only meaningful for Accept/ArchiveImmediately). */
  priority: Priority

  /** Human-readable explanation of why this decision was made. */
  reason: string

  /** Non-fatal issues detected during evaluation (e.g., type/category mismatch). */
  warnings: string[]

  /** The normalized memory input (if modifications were made during admission). */
  normalizedMemory?: CreateMemoryInput

  /** The rule that triggered the final decision (for audit trail). */
  triggeredRule?: string
}

// ============================================================================
// ADMISSION RULE
// ============================================================================

/**
 * Context provided to admission rules during evaluation.
 * Contains the memory being evaluated and access to existing memories
 * for duplicate detection.
 */
export interface AdmissionContext {
  /** The memory input being evaluated. */
  memory: CreateMemoryInput

  /** All existing memories (for duplicate detection). */
  existingMemories: readonly {
    id: string
    title: string
    type: MemoryType
    category: MemoryCategory
    tags: string[]
    content: string
    source: { origin: string; reference?: string }
  }[]
}

/**
 * A single admission rule. Rules are evaluated in order; the first rule
 * that returns a non-undefined result short-circuits the pipeline.
 *
 * Rules should be pure functions — no side effects, no mutations.
 */
export interface AdmissionRule {
  /** Unique identifier for the rule (used in audit trail). */
  id: string

  /** Human-readable description of what the rule checks. */
  description: string

  /**
   * Evaluates the memory and returns an AdmissionResult if the rule
   * triggers, or undefined if the rule does not apply.
   *
   * @param context - The admission context with memory and existing memories.
   * @returns AdmissionResult if the rule triggers, undefined otherwise.
   */
  evaluate(context: AdmissionContext): AdmissionResult | undefined
}

// ============================================================================
// ADMISSION CONFIG
// ============================================================================

/**
 * Configuration for the Admission Controller.
 * Allows customization of limits, thresholds, and rule behavior.
 */
export interface AdmissionConfig {
  /** Maximum allowed length for memory title (characters). Default: 500. */
  maxTitleLength?: number

  /** Maximum allowed length for memory content (characters). Default: 50_000. */
  maxContentLength?: number

  /** Maximum allowed number of tags. Default: 50. */
  maxTags?: number

  /** Minimum confidence level required for acceptance. Default: Unverified (all accepted). */
  minConfidenceForAcceptance?: ConfidenceLevel

  /** Whether to reject memories with type/category mismatches. Default: false (warn only). */
  rejectOnTypeCategoryMismatch?: boolean

  /** Whether to reject duplicate memories. Default: true. */
  rejectDuplicates?: boolean

  /** Similarity threshold for duplicate detection (0.0 to 1.0). Default: 0.9. */
  duplicateSimilarityThreshold?: number

  /** Custom rules to prepend before built-in rules. */
  customRules?: AdmissionRule[]

  /** Custom rules to append after built-in rules. */
  postRules?: AdmissionRule[]
}

// ============================================================================
// DEFAULT CONFIG
// ============================================================================

/**
 * Default configuration values for the Admission Controller.
 */
export const DEFAULT_ADMISSION_CONFIG: Required<Omit<AdmissionConfig, 'customRules' | 'postRules'>> = {
  maxTitleLength: 500,
  maxContentLength: 50_000,
  maxTags: 50,
  minConfidenceForAcceptance: ConfidenceLevel.Unverified,
  rejectOnTypeCategoryMismatch: false,
  rejectDuplicates: true,
  duplicateSimilarityThreshold: 0.9,
}
