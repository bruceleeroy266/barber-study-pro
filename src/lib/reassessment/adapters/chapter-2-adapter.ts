/**
 * Phase 6C-2b — Chapter 2 Canonical Mapping Provider
 *
 * Reference implementation of ICanonicalMappingProvider for Chapter 2.
 * Uses the existing chapter-2-concepts/mappings.ts as the canonical source.
 *
 * This adapter plugs Chapter 2's canonical question→concept mappings into
 * the chapter-agnostic historical exclusion engine.
 */

import { chapter2QuizQuestionMappings } from '@/lib/chapter-2-concepts/mappings'
import type { ConceptId, QuizQuestionId, ChapterId, ICanonicalMappingProvider } from '@/lib/reassessment/types'

// ───────────────────────────────────────────────
// Chapter 2 Mapping Provider
// ───────────────────────────────────────────────

export class Chapter2MappingProvider implements ICanonicalMappingProvider {
  readonly chapterId: ChapterId = 'ch-2'

  // Build lookup maps for efficient resolution
  private readonly questionToConceptMap: Map<QuizQuestionId, ConceptId>
  private readonly conceptToQuestionsMap: Map<ConceptId, QuizQuestionId[]>

  constructor() {
    this.questionToConceptMap = new Map()
    this.conceptToQuestionsMap = new Map()

    // Build bidirectional mappings from canonical source
    for (const mapping of chapter2QuizQuestionMappings) {
      const { questionId, conceptId } = mapping

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

let chapter2ProviderInstance: Chapter2MappingProvider | null = null

/**
 * Get the singleton Chapter 2 mapping provider instance.
 */
export function getChapter2MappingProvider(): Chapter2MappingProvider {
  if (!chapter2ProviderInstance) {
    chapter2ProviderInstance = new Chapter2MappingProvider()
  }
  return chapter2ProviderInstance
}

/**
 * Reset the singleton instance (for testing).
 */
export function resetChapter2MappingProvider(): void {
  chapter2ProviderInstance = null
}
