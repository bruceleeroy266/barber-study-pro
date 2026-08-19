/**
 * Phase 6C-2d — Chapter 2 Concept Detection Provider
 *
 * Concrete implementation of IConceptDetectionProvider for Chapter 2.
 * Bridges the canonical Chapter 2 architecture to EvaluationService.evaluateCycleWithDetection().
 *
 * Architecture:
 *   - Reuses canonical question→concept mappings from chapter-2-concepts/mappings.ts
 *   - Delegates to Phase 6B-3 detection engine (buildConceptEvidence + detectConceptState)
 *   - Does NOT duplicate detection thresholds, state logic, or evidence-building semantics
 *
 * Binding Rules:
 *   - Production evaluation must derive detection from legitimate persisted evidence
 *   - No arbitrary caller-supplied detection state may become authoritative
 *   - Canonical mapping verification is enforced before detection
 */

import { chapter2QuizQuestionMappings } from '@/lib/chapter-2-concepts/mappings'
import {
  buildConceptEvidence,
  detectConceptState,
  type ConceptEvidence,
  type ConceptDetectionResult as Phase6B3DetectionResult,
} from '@/lib/chapter-2-concepts/detection'
import type { ConceptId as Chapter2ConceptId, QuizQuestionId as Chapter2QuizQuestionId } from '@/lib/chapter-2-concepts/types'
import type { QuizAttempt } from '@/types'
import type {
  ConceptId,
  ChapterId,
  QuizQuestionId,
} from '@/lib/reassessment/types'
import type {
  IConceptDetectionProvider,
  ConceptDetectionResult,
} from '../provider-registry'

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

/**
 * Callback function to fetch quiz attempts by IDs.
 * Injected to avoid circular dependencies with Supabase client.
 */
export type FetchQuizAttemptsCallback = (attemptIds: string[]) => Promise<QuizAttempt[]>

/**
 * Configuration for Chapter2DetectionProvider.
 */
export interface Chapter2DetectionProviderConfig {
  /**
   * Callback to fetch quiz attempts from the database.
   * Must return complete QuizAttempt records with answers_json.
   */
  fetchQuizAttempts: FetchQuizAttemptsCallback
}

// ───────────────────────────────────────────────
// Chapter 2 Detection Provider
// ───────────────────────────────────────────────

/**
 * Chapter 2 implementation of IConceptDetectionProvider.
 *
 * This provider:
 *   1. Validates that the concept exists in the canonical Chapter 2 taxonomy
 *   2. Fetches quiz attempts via the injected callback
 *   3. Filters attempts to only include questions canonically mapped to the target concept
 *   4. Delegates to Phase 6B-3 buildConceptEvidence() for evidence construction
 *   5. Delegates to Phase 6B-3 detectConceptState() for state/confidence determination
 *
 * The provider ensures that:
 *   - Only legitimate persisted reassessment evidence is used
 *   - Canonical question→concept resolution is enforced
 *   - Unrelated concept questions cannot influence the target concept
 *   - Detection state comes from the authoritative Phase 6B-3 engine
 */
export class Chapter2DetectionProvider implements IConceptDetectionProvider {
  readonly chapterId: ChapterId = 'ch-2'

  private readonly fetchQuizAttempts: FetchQuizAttemptsCallback
  private readonly conceptToQuestionsMap: Map<ConceptId, Set<QuizQuestionId>>
  private readonly validConceptIds: Set<ConceptId>

  constructor(config: Chapter2DetectionProviderConfig) {
    this.fetchQuizAttempts = config.fetchQuizAttempts

    // Build canonical mapping lookup from chapter-2-concepts/mappings.ts
    this.conceptToQuestionsMap = new Map()
    this.validConceptIds = new Set()

    for (const mapping of chapter2QuizQuestionMappings) {
      const { questionId, conceptId } = mapping

      this.validConceptIds.add(conceptId as ConceptId)

      const existing = this.conceptToQuestionsMap.get(conceptId as ConceptId) ?? new Set()
      existing.add(questionId as QuizQuestionId)
      this.conceptToQuestionsMap.set(conceptId as ConceptId, existing)
    }
  }

  /**
   * Detect the concept state from evidence.
   *
   * This method:
   *   1. Validates the concept ID is in the canonical Chapter 2 taxonomy
   *   2. Fetches quiz attempts via the injected callback
   *   3. Verifies each attempt contains questions canonically mapped to the concept
   *   4. Builds concept evidence using Phase 6B-3 buildConceptEvidence()
   *   5. Detects state using Phase 6B-3 detectConceptState()
   *
   * @param conceptId - The concept ID to detect
   * @param evidenceIds - Array of quiz_attempt IDs providing evidence
   * @returns Detection result with state, confidence, and evidence
   */
  async detectConceptState(
    conceptId: ConceptId,
    evidenceIds: string[]
  ): Promise<ConceptDetectionResult | null> {
    // Validate concept exists in canonical taxonomy
    if (!this.validConceptIds.has(conceptId)) {
      return null
    }

    // Fetch quiz attempts from database
    const quizAttempts = await this.fetchQuizAttempts(evidenceIds)

    if (quizAttempts.length === 0) {
      return null
    }

    // Verify canonical mapping: filter attempts to only include
    // questions canonically mapped to the target concept
    const canonicalQuestionIds = this.conceptToQuestionsMap.get(conceptId)
    if (!canonicalQuestionIds || canonicalQuestionIds.size === 0) {
      return null
    }

    // Filter each attempt's answers to only include canonically mapped questions
    const filteredAttempts = quizAttempts.map((attempt) => {
      const filteredAnswers: Record<string, string> = {}
      const answers = attempt.answers_json as Record<string, string>

      for (const [questionId, answer] of Object.entries(answers)) {
        if (canonicalQuestionIds.has(questionId as QuizQuestionId)) {
          filteredAnswers[questionId] = answer
        }
      }

      return {
        ...attempt,
        answers_json: filteredAnswers,
      }
    })

    // Check if any attempt has mapped questions
    const hasMappedQuestions = filteredAttempts.some(
      (attempt) => Object.keys(attempt.answers_json).length > 0
    )

    if (!hasMappedQuestions) {
      // No canonically mapped questions found in evidence
      // Return insufficient evidence via Phase 6B-3
      const emptyEvidence = buildConceptEvidence(conceptId as Chapter2ConceptId, [])
      const result = detectConceptState(emptyEvidence)
      return this.mapToProviderResult(result)
    }

    // Build concept evidence using Phase 6B-3 authoritative engine
    const evidence = buildConceptEvidence(conceptId as Chapter2ConceptId, filteredAttempts)

    // Detect state using Phase 6B-3 authoritative engine
    const detectionResult = detectConceptState(evidence)

    return this.mapToProviderResult(detectionResult)
  }

  /**
   * Map Phase 6B-3 detection result to IConceptDetectionProvider result format.
   *
   * The Phase 6B-3 ConceptDetectionResult includes learningObjectiveId and flags,
   * which are not required by the provider interface but are preserved in evidence.
   */
  private mapToProviderResult(result: Phase6B3DetectionResult): ConceptDetectionResult {
    return {
      conceptId: result.conceptId,
      state: result.state,
      confidence: result.confidence,
      evidence: result.evidence,
    }
  }

  /**
   * Check if a concept ID is valid for this provider.
   *
   * @param conceptId - The concept ID to check
   * @returns true if the concept exists in the canonical Chapter 2 taxonomy
   */
  isValidConcept(conceptId: ConceptId): boolean {
    return this.validConceptIds.has(conceptId)
  }

  /**
   * Get all question IDs canonically mapped to a concept.
   *
   * @param conceptId - The concept ID
   * @returns Array of question IDs mapped to the concept
   */
  getCanonicalQuestionIds(conceptId: ConceptId): readonly QuizQuestionId[] {
    const questions = this.conceptToQuestionsMap.get(conceptId)
    return questions ? Array.from(questions) : []
  }

  /**
   * Verify that a quiz attempt contains questions canonically mapped to the concept.
   *
   * @param conceptId - The target concept ID
   * @param attempt - The quiz attempt to verify
   * @returns Object with verification result and mapped question count
   */
  verifyCanonicalMapping(
    conceptId: ConceptId,
    attempt: QuizAttempt
  ): { verified: boolean; mappedQuestionCount: number } {
    const canonicalQuestionIds = this.conceptToQuestionsMap.get(conceptId)
    if (!canonicalQuestionIds) {
      return { verified: false, mappedQuestionCount: 0 }
    }

    const answers = attempt.answers_json as Record<string, string>
    let mappedCount = 0

    for (const questionId of Object.keys(answers)) {
      if (canonicalQuestionIds.has(questionId as QuizQuestionId)) {
        mappedCount++
      }
    }

    return {
      verified: mappedCount > 0,
      mappedQuestionCount: mappedCount,
    }
  }
}

// ───────────────────────────────────────────────
// Singleton Instance
// ───────────────────────────────────────────────

let chapter2DetectionProviderInstance: Chapter2DetectionProvider | null = null

/**
 * Get the singleton Chapter 2 detection provider instance.
 *
 * NOTE: This requires the fetchQuizAttempts callback to be configured.
 * Use createChapter2DetectionProvider() for explicit configuration.
 */
export function getChapter2DetectionProvider(): Chapter2DetectionProvider {
  if (!chapter2DetectionProviderInstance) {
    throw new Error(
      'Chapter2DetectionProvider not initialized. ' +
      'Call createChapter2DetectionProvider() with a fetchQuizAttempts callback first.'
    )
  }
  return chapter2DetectionProviderInstance
}

/**
 * Create and initialize the singleton Chapter 2 detection provider.
 *
 * @param config - Configuration with fetchQuizAttempts callback
 * @returns The initialized provider instance
 */
export function createChapter2DetectionProvider(
  config: Chapter2DetectionProviderConfig
): Chapter2DetectionProvider {
  chapter2DetectionProviderInstance = new Chapter2DetectionProvider(config)
  return chapter2DetectionProviderInstance
}

/**
 * Reset the singleton instance (for testing).
 */
export function resetChapter2DetectionProvider(): void {
  chapter2DetectionProviderInstance = null
}
