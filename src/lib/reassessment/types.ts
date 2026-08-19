/**
 * Phase 6C-2b — Historical Exclusion Engine Types
 *
 * Chapter-agnostic type definitions for the reassessment question exclusion engine.
 * This module defines the contracts for:
 *   - Canonical mapping providers (chapter-specific adapters)
 *   - Historical evidence extraction
 *   - Exclusion set computation
 *
 * Architecture: Application-layer canonical mapping (Option B)
 *   - Database: persistence and integrity only
 *   - Application: educational-semantic resolution
 */

// ───────────────────────────────────────────────
// Branded ID Types (Chapter-Agnostic)
// ───────────────────────────────────────────────

/** Stable concept identifier. Format: C-{chapter}-{sequence} */
export type ConceptId = string

/** Quiz question identifier. Format: qq-{chapter}-{sequence} */
export type QuizQuestionId = string

/** Chapter identifier. Format: ch-{number} */
export type ChapterId = string

// ───────────────────────────────────────────────
// Canonical Mapping Provider Interface
// ───────────────────────────────────────────────

/**
 * Canonical mapping provider — implemented by chapter-specific adapters.
 *
 * This interface defines how the exclusion engine resolves question→concept
 * relationships without hard-coding chapter-specific logic.
 */
export interface ICanonicalMappingProvider {
  /** The chapter this provider serves */
  readonly chapterId: ChapterId

  /**
   * Get the concept ID for a given quiz question.
   * Returns undefined if the question is not mapped to any concept.
   *
   * @param questionId - The quiz question ID to resolve
   * @returns The concept ID, or undefined if unmapped
   */
  getConceptForQuestion(questionId: QuizQuestionId): ConceptId | undefined

  /**
   * Get all question IDs mapped to a given concept.
   * Returns empty array if no questions are mapped to the concept.
   *
   * @param conceptId - The concept ID to resolve
   * @returns Array of question IDs mapped to this concept
   */
  getQuestionsForConcept(conceptId: ConceptId): readonly QuizQuestionId[]

  /**
   * Check if a question is mapped to a specific concept.
   *
   * @param questionId - The quiz question ID
   * @param conceptId - The concept ID
   * @returns true if the question assesses the concept
   */
  isQuestionMappedToConcept(questionId: QuizQuestionId, conceptId: ConceptId): boolean

  /**
   * Get all concept IDs known to this provider.
   *
   * @returns Array of all concept IDs in this chapter
   */
  getAllConceptIds(): readonly ConceptId[]

  /**
   * Get all question IDs known to this provider.
   *
   * @returns Array of all question IDs in this chapter
   */
  getAllQuestionIds(): readonly QuizQuestionId[]
}

// ───────────────────────────────────────────────
// Historical Evidence Types
// ───────────────────────────────────────────────

/**
 * A historical quiz attempt record from quiz_attempts table.
 * Contains the raw answers_json that needs semantic resolution.
 */
export interface HistoricalQuizAttempt {
  /** Quiz attempt UUID */
  id: string
  /** User UUID */
  userId: string
  /** Quiz ID (e.g., 'quiz-2') */
  quizId: string
  /** Raw answers JSON: { question_id: answer_value, ... } */
  answersJson: Record<string, unknown>
  /** When the attempt was completed */
  completedAt: Date
  /** Whether this is a reassessment (Phase 6C-2b+) */
  isReassessment?: boolean
  /** Target concept for reassessments */
  targetConceptId?: ConceptId
  /** Remediation cycle ID for reassessments */
  remediationCycleId?: string
}

/**
 * A persisted reassessment question history record.
 */
export interface ReassessmentQuestionHistoryRecord {
  /** Record UUID */
  id: string
  /** User UUID */
  userId: string
  /** Concept ID */
  conceptId: ConceptId
  /** Question ID */
  questionId: QuizQuestionId
  /** Quiz attempt UUID */
  quizAttemptId: string
  /** Remediation cycle UUID (NULL for initial quiz) */
  cycleId: string | null
  /** Whether the answer was correct */
  isCorrect: boolean
  /** When the attempt occurred */
  attemptedAt: Date
}

// ───────────────────────────────────────────────
// Exclusion Set Computation
// ───────────────────────────────────────────────

/**
 * The computed exclusion set for a student + concept.
 * Contains all question IDs that must be excluded from reassessment selection.
 */
export interface ExclusionSet {
  /** The target concept */
  conceptId: ConceptId
  /** The target student */
  userId: string
  /** Question IDs from historical quiz_attempts.answers_json */
  historicalQuestionIds: Set<QuizQuestionId>
  /** Question IDs from reassessment_question_history */
  reassessmentHistoryQuestionIds: Set<QuizQuestionId>
  /** Union of both sources (deduplicated) */
  combinedExclusionSet: Set<QuizQuestionId>
  /** Questions that were unmapped (present in history but not in canonical mapping) */
  unmappedHistoricalQuestionIds: Set<QuizQuestionId>
}

/**
 * Options for exclusion set computation.
 */
export interface ExclusionComputationOptions {
  /** Include historical quiz attempts (default: true) */
  includeHistoricalAttempts?: boolean
  /** Include reassessment history (default: true) */
  includeReassessmentHistory?: boolean
  /** Only include completed attempts (default: true) */
  completedAttemptsOnly?: boolean
}

// ───────────────────────────────────────────────
// Pool Exhaustion Types
// ───────────────────────────────────────────────

/**
 * Pool exhaustion state for a concept.
 */
export interface PoolExhaustionState {
  /** Whether the pool is exhausted */
  isExhausted: boolean
  /** Total questions in the canonical pool for this concept */
  totalQuestionsInPool: number
  /** Number of questions the student has attempted */
  attemptedQuestionCount: number
  /** Question IDs already attempted */
  attemptedQuestionIds: QuizQuestionId[]
  /** Available (unseen) question IDs */
  availableQuestionIds: QuizQuestionId[]
}

// ───────────────────────────────────────────────
// Selection Result Types
// ───────────────────────────────────────────────

/**
 * Result of a reassessment question selection operation.
 */
export interface ReassessmentSelectionResult {
  /** Whether selection was successful */
  success: boolean
  /** The selected question ID (if successful) */
  selectedQuestionId?: QuizQuestionId
  /** Pool exhaustion state (if exhausted) */
  poolExhaustion?: PoolExhaustionState
  /** Error message (if failed) */
  error?: string
  /** The exclusion set used for selection */
  exclusionSet: ExclusionSet
}

// ───────────────────────────────────────────────
// Database Client Interface
// ───────────────────────────────────────────────

/**
 * Minimal database client interface for the exclusion engine.
 * Allows for testability and abstraction over Supabase client.
 */
export interface IExclusionDatabaseClient {
  /**
   * Get historical quiz attempts for a user.
   * Returns attempts with answers_json that need semantic resolution.
   */
  getHistoricalQuizAttempts(
    userId: string,
    options?: { completedOnly?: boolean }
  ): Promise<HistoricalQuizAttempt[]>

  /**
   * Get reassessment question history for a user + concept.
   */
  getReassessmentQuestionHistory(
    userId: string,
    conceptId: ConceptId
  ): Promise<ReassessmentQuestionHistoryRecord[]>

  /**
   * Record a question attempt (with concurrency protection).
   * Returns the record ID if inserted, NULL if already exists.
   */
  recordQuestionAttempt(
    userId: string,
    conceptId: ConceptId,
    questionId: QuizQuestionId,
    quizAttemptId: string,
    cycleId: string | null,
    isCorrect: boolean
  ): Promise<string | null>

  /**
   * Check and record pool exhaustion atomically.
   */
  checkAndRecordPoolExhaustion(
    userId: string,
    conceptId: ConceptId,
    chapterId: ChapterId,
    cycleId: string,
    totalQuestionsInPool: number
  ): Promise<string | null>
}

// ───────────────────────────────────────────────
// Exclusion Engine Interface
// ───────────────────────────────────────────────

/**
 * The chapter-agnostic historical exclusion engine.
 */
export interface IHistoricalExclusionEngine {
  /**
   * Compute the exclusion set for a student + concept.
   * Combines historical quiz attempts and reassessment history.
   */
  computeExclusionSet(
    userId: string,
    conceptId: ConceptId,
    options?: ExclusionComputationOptions
  ): Promise<ExclusionSet>

  /**
   * Select an eligible reassessment question for a student + concept.
   * Returns NULL if pool is exhausted (with explicit exhaustion state).
   */
  selectReassessmentQuestion(
    userId: string,
    conceptId: ConceptId,
    cycleId: string
  ): Promise<ReassessmentSelectionResult>

  /**
   * Check if a specific question is eligible for reassessment.
   */
  isQuestionEligible(
    userId: string,
    conceptId: ConceptId,
    questionId: QuizQuestionId
  ): Promise<boolean>

  /**
   * Get the pool exhaustion state for a student + concept.
   */
  getPoolExhaustionState(
    userId: string,
    conceptId: ConceptId
  ): Promise<PoolExhaustionState>
}
