/**
 * C3-3 Stage 3 — Chapter 3 Canonical Mapping Provider
 *
 * Reference ICanonicalMappingProvider implementation for Chapter 3, plugging
 * the locked Chapter 3 concept taxonomy into the chapter-agnostic historical
 * exclusion engine — the same contract Chapter 2's adapter satisfies.
 *
 * Pool composition mirrors Chapter 2's union design: the provider serves the
 * canonical question→concept mappings for BOTH the locked 30-question
 * initial bank and the 60-question reassessment reserve. The mappings module
 * (chapter-3-concepts/mappings.ts) remains the single source of truth —
 * entries are projected, never duplicated or restated.
 *
 * Historical exclusion is what keeps initial-quiz questions out of an active
 * cycle's eligible pool: a cycle is only ever created after a persisted
 * initial-quiz attempt, so every initial question already sits in the
 * student's answers_json exclusion evidence.
 */

import {
  chapter3QuizQuestionConceptMappings,
  chapter3ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-3-concepts/mappings'
import type {
  ConceptId,
  QuizQuestionId,
  ChapterId,
  ICanonicalMappingProvider,
} from '@/lib/reassessment/types'

// ───────────────────────────────────────────────
// Chapter 3 Mapping Provider
// ───────────────────────────────────────────────

export class Chapter3MappingProvider implements ICanonicalMappingProvider {
  readonly chapterId: ChapterId = 'ch-3'

  // Build lookup maps for efficient resolution
  private readonly questionToConceptMap: Map<QuizQuestionId, ConceptId>
  private readonly conceptToQuestionsMap: Map<ConceptId, QuizQuestionId[]>

  constructor() {
    this.questionToConceptMap = new Map()
    this.conceptToQuestionsMap = new Map()

    // Build bidirectional mappings from the canonical source (initial + reserve)
    for (const mapping of [
      ...chapter3QuizQuestionConceptMappings,
      ...chapter3ReassessmentQuestionConceptMappings,
    ]) {
      const questionId = mapping.questionId as string
      const conceptId = mapping.conceptFamilyId as string

      // Question → Concept
      this.questionToConceptMap.set(questionId, conceptId)

      // Concept → Questions
      const existing = this.conceptToQuestionsMap.get(conceptId) ?? []
      this.conceptToQuestionsMap.set(conceptId, [...existing, questionId])
    }
  }

  getConceptForQuestion(questionId: QuizQuestionId): ConceptId | undefined {
    return this.questionToConceptMap.get(questionId)
  }

  getQuestionsForConcept(conceptId: ConceptId): readonly QuizQuestionId[] {
    return this.conceptToQuestionsMap.get(conceptId) ?? []
  }

  isQuestionMappedToConcept(questionId: QuizQuestionId, conceptId: ConceptId): boolean {
    const mappedConcept = this.questionToConceptMap.get(questionId)
    return mappedConcept === conceptId
  }

  getAllConceptIds(): readonly ConceptId[] {
    return Array.from(this.conceptToQuestionsMap.keys())
  }

  getAllQuestionIds(): readonly QuizQuestionId[] {
    return Array.from(this.questionToConceptMap.keys())
  }
}

// ───────────────────────────────────────────────
// Singleton Instance
// ───────────────────────────────────────────────

let chapter3ProviderInstance: Chapter3MappingProvider | null = null

/**
 * Get the singleton Chapter 3 mapping provider instance.
 */
export function getChapter3MappingProvider(): Chapter3MappingProvider {
  if (!chapter3ProviderInstance) {
    chapter3ProviderInstance = new Chapter3MappingProvider()
  }
  return chapter3ProviderInstance
}

/**
 * Reset the singleton instance (for testing).
 */
export function resetChapter3MappingProvider(): void {
  chapter3ProviderInstance = null
}
