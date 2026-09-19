/**
 * C4-3 — Chapter 5 Concept Detection Provider
 *
 * Concrete implementation of IConceptDetectionProvider for Chapter 5.
 * Bridges the locked Chapter 5 concept runtime to the chapter-agnostic
 * EvaluationService.evaluateCycleWithDetection() — the same contract
 * Chapter 2's and Chapter 3's detection providers satisfy.
 *
 * Architecture:
 *   - Reuses the canonical question→concept mappings (initial + reserve)
 *     from chapter-4-concepts/mappings.ts
 *   - Delegates to the shared detection engine through the Chapter 5 binding
 *     (buildConceptEvidence + detectConceptState from chapter-4-concepts/detection)
 *   - Does NOT duplicate detection thresholds, state logic, or evidence semantics
 *
 * Binding Rules:
 *   - Production evaluation must derive detection from legitimate persisted evidence
 *   - No arbitrary caller-supplied detection state may become authoritative
 *   - Canonical mapping verification is enforced before detection
 */

import {
  chapter5QuizQuestionConceptMappings,
} from '@/lib/chapter-4-concepts/mappings'
import {
  ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS,
} from '@/lib/chapter-4-concepts/concepts'
import {
  buildConceptEvidence,
  detectConceptState,
  type ConceptDetectionResult as Chapter5BindingResult,
} from '@/lib/chapter-4-concepts/detection'
import type { Chapter5ConceptFamilyId } from '@/lib/chapter-4-concepts/types'
import type { QuizAttempt } from '@/types'
import type {
  ConceptId,
  ChapterId,
  QuizQuestionId,
} from '../types'
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
 * Configuration for Chapter5DetectionProvider.
 */
export interface Chapter5DetectionProviderConfig {
  /**
   * Callback to fetch quiz attempts from the database.
   * Must return complete QuizAttempt records with answers_json.
   */
  fetchQuizAttempts: FetchQuizAttemptsCallback
}

// ───────────────────────────────────────────────
// Chapter 5 Detection Provider
// ───────────────────────────────────────────────

/**
 * Chapter 5 implementation of IConceptDetectionProvider.
 *
 * This provider:
 *   1. Validates that the concept exists in the locked Chapter 5 taxonomy
 *   2. Fetches quiz attempts via the injected callback
 *   3. Filters attempts to only include questions canonically mapped to the target family
 *   4. Delegates to the shared engine (via the Ch4 binding) for evidence + state
 */
export class Chapter5DetectionProvider implements IConceptDetectionProvider {
  readonly chapterId: ChapterId = 'ch-5'

  private readonly fetchQuizAttempts: FetchQuizAttemptsCallback
  private readonly conceptToQuestionsMap: Map<ConceptId, Set<QuizQuestionId>>
  private readonly validConceptIds: Set<ConceptId>

  constructor(config: Chapter5DetectionProviderConfig) {
    this.fetchQuizAttempts = config.fetchQuizAttempts

    // Build canonical mapping lookup from chapter-4-concepts/mappings.ts
    // (initial 50-question bank; reserve mappings are added when C5 reassessment content is introduced)
    this.conceptToQuestionsMap = new Map()
    this.validConceptIds = new Set(ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS as readonly string[])

    for (const mapping of [
      ...chapter5QuizQuestionConceptMappings,
    ]) {
      const questionId = mapping.questionId as string
      const conceptId = mapping.conceptFamilyId as string

      const existing = this.conceptToQuestionsMap.get(conceptId) ?? new Set()
      existing.add(questionId)
      this.conceptToQuestionsMap.set(conceptId, existing)
    }
  }

  /**
   * Detect the concept state from evidence.
   *
   * @param conceptId - The concept family ID to detect
   * @param evidenceIds - Array of quiz_attempt IDs providing evidence
   * @returns Detection result with state, confidence, and evidence
   */
  async detectConceptState(
    conceptId: ConceptId,
    evidenceIds: string[]
  ): Promise<ConceptDetectionResult | null> {
    // Validate concept exists in the locked Chapter 5 taxonomy
    if (!this.validConceptIds.has(conceptId)) {
      return null
    }

    // Fetch quiz attempts from database
    const quizAttempts = await this.fetchQuizAttempts(evidenceIds)

    if (quizAttempts.length === 0) {
      return null
    }

    // Verify canonical mapping: filter attempts to only include
    // questions canonically mapped to the target family
    const canonicalQuestionIds = this.conceptToQuestionsMap.get(conceptId)
    if (!canonicalQuestionIds || canonicalQuestionIds.size === 0) {
      return null
    }

    // Filter each attempt's answers to only include canonically mapped questions
    const filteredAttempts = quizAttempts.map((attempt) => {
      const filteredAnswers: Record<string, string> = {}
      const answers = attempt.answers_json as Record<string, string>

      for (const [questionId, answer] of Object.entries(answers)) {
        if (canonicalQuestionIds.has(questionId)) {
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
      // No canonically mapped questions found in evidence — insufficient evidence
      const emptyEvidence = buildConceptEvidence(conceptId as Chapter5ConceptFamilyId, [])
      const result = detectConceptState(emptyEvidence)
      return this.mapToProviderResult(result)
    }

    // Build concept evidence using the shared engine (Ch4 binding)
    const evidence = buildConceptEvidence(
      conceptId as Chapter5ConceptFamilyId,
      filteredAttempts
    )

    // Detect state using the shared engine (Ch4 binding)
    const detectionResult = detectConceptState(evidence)

    return this.mapToProviderResult(detectionResult)
  }

  /**
   * Map the Ch4 binding's detection result to the provider result format.
   */
  private mapToProviderResult(result: Chapter5BindingResult): ConceptDetectionResult {
    return {
      conceptId: result.conceptId,
      state: result.state,
      confidence: result.confidence,
      evidence: result.evidence,
    }
  }

  /**
   * Check if a concept ID is valid for this provider.
   */
  isValidConcept(conceptId: ConceptId): boolean {
    return this.validConceptIds.has(conceptId)
  }
}

// ───────────────────────────────────────────────
// Factory Function
// ───────────────────────────────────────────────

/**
 * Create a Chapter 5 detection provider with the given configuration.
 */
export function createChapter5DetectionProvider(
  config: Chapter5DetectionProviderConfig
): Chapter5DetectionProvider {
  return new Chapter5DetectionProvider(config)
}
