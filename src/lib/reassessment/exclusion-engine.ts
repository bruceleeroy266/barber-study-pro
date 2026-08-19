/**
 * Phase 6C-2b — Historical Exclusion Engine
 *
 * Chapter-agnostic engine for computing reassessment question exclusion sets.
 * Combines historical quiz_attempts.answers_json with reassessment_question_history
 * using canonical question→concept mappings.
 *
 * Architecture: Application-layer canonical mapping (Option B)
 *   - Database: persistence and integrity only
 *   - Application: educational-semantic resolution
 */

import type {
  ChapterId,
  ConceptId,
  ExclusionComputationOptions,
  ExclusionSet,
  HistoricalQuizAttempt,
  ICanonicalMappingProvider,
  IExclusionDatabaseClient,
  IHistoricalExclusionEngine,
  PoolExhaustionState,
  QuizQuestionId,
  ReassessmentSelectionResult,
} from './types'
import { getCanonicalMappingProvider } from './provider-registry'

// ───────────────────────────────────────────────
// Historical Exclusion Engine
// ───────────────────────────────────────────────

export class HistoricalExclusionEngine implements IHistoricalExclusionEngine {
  constructor(
    private readonly dbClient: IExclusionDatabaseClient,
    private readonly chapterId: ChapterId
  ) {}

  /**
   * Get the canonical mapping provider for this engine's chapter.
   */
  private getMappingProvider(): ICanonicalMappingProvider {
    return getCanonicalMappingProvider(this.chapterId)
  }

  /**
   * Extract question IDs from historical quiz attempts that map to the target concept.
   *
   * Semantic resolution: Uses canonical mapping to determine which questions
   * assess the target concept. Does NOT infer from question-ID naming.
   */
  private extractHistoricalQuestionIds(
    historicalAttempts: HistoricalQuizAttempt[],
    targetConceptId: ConceptId,
    mappingProvider: ICanonicalMappingProvider
  ): { mapped: Set<QuizQuestionId>; unmapped: Set<QuizQuestionId> } {
    const mapped = new Set<QuizQuestionId>()
    const unmapped = new Set<QuizQuestionId>()

    for (const attempt of historicalAttempts) {
      // Extract question IDs from answers_json keys
      const questionIds = Object.keys(attempt.answersJson)

      for (const questionId of questionIds) {
        // Resolve concept using canonical mapping (NOT ID naming)
        const conceptId = mappingProvider.getConceptForQuestion(questionId)

        if (conceptId === undefined) {
          // Unmapped question — track but do not fabricate mapping
          unmapped.add(questionId)
        } else if (conceptId === targetConceptId) {
          // Question assesses the target concept
          mapped.add(questionId)
        }
        // Questions mapped to other concepts are ignored (no contamination)
      }
    }

    return { mapped, unmapped }
  }

  /**
   * Compute the exclusion set for a student + concept.
   *
   * The exclusion set is the union of:
   *   1. Question IDs in historical quiz_attempts.answers_json that map to the target concept
   *   2. Question IDs already recorded in reassessment_question_history
   *
   * Both previously correct and incorrect responses count as attempted.
   */
  async computeExclusionSet(
    userId: string,
    conceptId: ConceptId,
    options: ExclusionComputationOptions = {}
  ): Promise<ExclusionSet> {
    const {
      includeHistoricalAttempts = true,
      includeReassessmentHistory = true,
      completedAttemptsOnly = true,
    } = options

    const mappingProvider = this.getMappingProvider()

    // Initialize sets
    let historicalQuestionIds = new Set<QuizQuestionId>()
    let unmappedHistoricalQuestionIds = new Set<QuizQuestionId>()
    let reassessmentHistoryQuestionIds = new Set<QuizQuestionId>()

    // Fetch historical quiz attempts (pre-6C-2b and normal quizzes)
    if (includeHistoricalAttempts) {
      const historicalAttempts = await this.dbClient.getHistoricalQuizAttempts(userId, {
        completedOnly: completedAttemptsOnly,
      })

      const extracted = this.extractHistoricalQuestionIds(
        historicalAttempts,
        conceptId,
        mappingProvider
      )
      historicalQuestionIds = extracted.mapped
      unmappedHistoricalQuestionIds = extracted.unmapped
    }

    // Fetch reassessment question history (6C-2b+)
    if (includeReassessmentHistory) {
      const reassessmentHistory = await this.dbClient.getReassessmentQuestionHistory(
        userId,
        conceptId
      )

      for (const record of reassessmentHistory) {
        reassessmentHistoryQuestionIds.add(record.questionId)
      }
    }

    // Union and deduplicate
    const combinedExclusionSet = new Set<QuizQuestionId>([
      ...historicalQuestionIds,
      ...reassessmentHistoryQuestionIds,
    ])

    return {
      conceptId,
      userId,
      historicalQuestionIds,
      reassessmentHistoryQuestionIds,
      combinedExclusionSet,
      unmappedHistoricalQuestionIds,
    }
  }

  /**
   * Select an eligible reassessment question for a student + concept.
   *
   * Selection algorithm:
   *   1. Compute exclusion set
   *   2. Get all questions mapped to the concept from canonical provider
   *   3. Filter out excluded questions
   *   4. If no eligible questions remain, record pool exhaustion and return NULL
   *   5. Select a question (deterministic: first available by ID order)
   *
   * Concurrency: The actual recording is protected by UNIQUE constraint
   * and record_question_attempt() ON CONFLICT DO NOTHING.
   */
  async selectReassessmentQuestion(
    userId: string,
    conceptId: ConceptId,
    cycleId: string
  ): Promise<ReassessmentSelectionResult> {
    const mappingProvider = this.getMappingProvider()

    // Compute exclusion set
    const exclusionSet = await this.computeExclusionSet(userId, conceptId)

    // Get all questions for this concept from canonical mapping
    const allQuestionsForConcept = mappingProvider.getQuestionsForConcept(conceptId)

    // Filter out excluded questions
    const eligibleQuestions = allQuestionsForConcept.filter(
      (qId) => !exclusionSet.combinedExclusionSet.has(qId)
    )

    // Check for pool exhaustion
    if (eligibleQuestions.length === 0) {
      // Record explicit pool exhaustion
      const exhaustionId = await this.dbClient.checkAndRecordPoolExhaustion(
        userId,
        conceptId,
        this.chapterId,
        cycleId,
        allQuestionsForConcept.length
      )

      const poolExhaustion: PoolExhaustionState = {
        isExhausted: true,
        totalQuestionsInPool: allQuestionsForConcept.length,
        attemptedQuestionCount: exclusionSet.combinedExclusionSet.size,
        attemptedQuestionIds: Array.from(exclusionSet.combinedExclusionSet),
        availableQuestionIds: [],
      }

      return {
        success: false,
        poolExhaustion,
        error: `Pool exhausted for concept ${conceptId}. All ${allQuestionsForConcept.length} questions have been attempted.`,
        exclusionSet,
      }
    }

    // Select first eligible question (deterministic by ID order)
    const selectedQuestionId = eligibleQuestions.sort()[0]

    return {
      success: true,
      selectedQuestionId,
      exclusionSet,
    }
  }

  /**
   * Check if a specific question is eligible for reassessment.
   */
  async isQuestionEligible(
    userId: string,
    conceptId: ConceptId,
    questionId: QuizQuestionId
  ): Promise<boolean> {
    const exclusionSet = await this.computeExclusionSet(userId, conceptId)
    return !exclusionSet.combinedExclusionSet.has(questionId)
  }

  /**
   * Get the pool exhaustion state for a student + concept.
   */
  async getPoolExhaustionState(
    userId: string,
    conceptId: ConceptId
  ): Promise<PoolExhaustionState> {
    const mappingProvider = this.getMappingProvider()
    const exclusionSet = await this.computeExclusionSet(userId, conceptId)
    const allQuestionsForConcept = mappingProvider.getQuestionsForConcept(conceptId)

    const availableQuestionIds = allQuestionsForConcept.filter(
      (qId) => !exclusionSet.combinedExclusionSet.has(qId)
    )

    return {
      isExhausted: availableQuestionIds.length === 0,
      totalQuestionsInPool: allQuestionsForConcept.length,
      attemptedQuestionCount: exclusionSet.combinedExclusionSet.size,
      attemptedQuestionIds: Array.from(exclusionSet.combinedExclusionSet),
      availableQuestionIds,
    }
  }
}

// ───────────────────────────────────────────────
// Factory Function
// ───────────────────────────────────────────────

/**
 * Create a historical exclusion engine for a specific chapter.
 */
export function createHistoricalExclusionEngine(
  dbClient: IExclusionDatabaseClient,
  chapterId: ChapterId
): HistoricalExclusionEngine {
  return new HistoricalExclusionEngine(dbClient, chapterId)
}
