/**
 * C4-3 — Chapter 4 Canonical Mapping Provider
 *
 * ICanonicalMappingProvider implementation for Chapter 4, plugging the
 * locked Chapter 4 concept taxonomy into the chapter-agnostic historical
 * exclusion engine — the same contract Chapter 2's and Chapter 3's adapters
 * satisfy.
 *
 * Pool composition mirrors the union design: the provider serves the
 * canonical question→concept mappings for BOTH the locked 30-question
 * initial bank and the 90-question reassessment reserve. The mappings module
 * (chapter-4-concepts/mappings.ts) remains the single source of truth —
 * entries are projected, never duplicated or restated.
 *
 * Historical exclusion is what keeps initial-quiz questions out of an active
 * cycle's eligible pool: a cycle is only ever created after a persisted
 * initial-quiz attempt, so every initial question already sits in the
 * student's answers_json exclusion evidence.
 */

import {
  chapter4QuizQuestionConceptMappings,
  chapter4ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-4-concepts/mappings'
import type {
  ConceptId,
  QuizQuestionId,
  ChapterId,
  ICanonicalMappingProvider,
} from '@/lib/reassessment/types'

// ───────────────────────────────────────────────
// Chapter 4 Mapping Provider
// ───────────────────────────────────────────────

export class Chapter4MappingProvider implements ICanonicalMappingProvider {
  readonly chapterId: ChapterId = 'ch-4'

  // Build lookup maps for efficient resolution
  private readonly questionToConceptMap: Map<QuizQuestionId, ConceptId>
  private readonly conceptToQuestionsMap: Map<ConceptId, QuizQuestionId[]>

  constructor() {
    this.questionToConceptMap = new Map()
    this.conceptToQuestionsMap = new Map()

    // Build bidirectional mappings from the canonical source (initial + reserve)
    for (const mapping of [
      ...chapter4QuizQuestionConceptMappings,
      ...chapter4ReassessmentQuestionConceptMappings,
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

let chapter4ProviderInstance: Chapter4MappingProvider | null = null

/**
 * Get the singleton Chapter 4 mapping provider instance.
 */
export function getChapter4MappingProvider(): Chapter4MappingProvider {
  if (!chapter4ProviderInstance) {
    chapter4ProviderInstance = new Chapter4MappingProvider()
  }
  return chapter4ProviderInstance
}

/**
 * Reset the singleton instance (for testing).
 */
export function resetChapter4MappingProvider(): void {
  chapter4ProviderInstance = null
}
