/**
 * Chapter 2 Concept Runtime Architecture — Validation Tests
 *
 * Phase 6B-2: Comprehensive validation of the typed runtime metadata.
 *
 * Required validations:
 *   - All 25 concepts exist and IDs are unique
 *   - All 18 subconcepts exist and resolve to valid parent concepts
 *   - Every mapped concept resolves
 *   - Every mapped asset ID resolves to a real production asset
 *   - All 48 production quiz questions are accounted for
 *   - All 64 active flashcards are accounted for
 *   - Inactive fc-2-045 is handled intentionally and does not silently become active
 *   - Every active concept has ≥1 content asset
 *   - Every active concept has ≥1 active flashcard
 *   - Every active concept has ≥1 quiz question
 *   - qq-2-037 → C-2-16 is explicitly regression-tested
 *   - Chain resolution works for Question/Flashcard/Content → Concept → LO
 */

import { describe, it, expect } from 'vitest'
import {
  chapter2Concepts,
  chapter2LearningObjectives,
  chapter2Subconcepts,
  ACTIVE_CONCEPT_IDS,
  RETIRED_CONCEPT_IDS,
  LEARNING_OBJECTIVE_IDS,
  SUBCONCEPT_IDS,
} from './concepts'
import {
  chapter2ContentMappings,
  chapter2FlashcardMappings,
  chapter2QuizQuestionMappings,
} from './mappings'
import { chapter2PremiumFlashcards } from '../chapter-2-premium-flashcards'
import { chapter2PremiumQuizQuestions } from '../chapter-2-premium-quiz'
import { chapterContentData } from '../chapter-content'
import type { ConceptId, SubconceptId, LearningObjectiveId } from './types'

// ───────────────────────────────────────────────
// Production Asset Extractors
// ───────────────────────────────────────────────

function getProductionContentBlockIds(): Set<string> {
  const ch2 = chapterContentData['ch-2']
  if (!ch2) throw new Error('Chapter 2 content not found')
  const ids = new Set<string>()
  for (const section of ch2.sections) {
    ids.add(section.id)
    // Handle nested tabs/steps
    if ('tabs' in section && Array.isArray(section.tabs)) {
      for (const tab of section.tabs) ids.add(tab.id)
    }
    if ('steps' in section && Array.isArray(section.steps)) {
      for (const step of section.steps) ids.add(step.id)
    }
  }
  return ids
}

function getProductionFlashcardIds(): Set<string> {
  return new Set(chapter2PremiumFlashcards.map((f) => f.id))
}

function getActiveFlashcardIds(): Set<string> {
  return new Set(
    chapter2PremiumFlashcards.filter((f) => f.is_active).map((f) => f.id),
  )
}

function getInactiveFlashcardIds(): Set<string> {
  return new Set(
    chapter2PremiumFlashcards.filter((f) => !f.is_active).map((f) => f.id),
  )
}

function getProductionQuizQuestionIds(): Set<string> {
  return new Set(chapter2PremiumQuizQuestions.map((q) => q.id))
}

// ───────────────────────────────────────────────
// Test Suite
// ───────────────────────────────────────────────

describe('Chapter 2 Concept Runtime Architecture', () => {
  const conceptMap = new Map(chapter2Concepts.map((c) => [c.id, c]))
  const subconceptMap = new Map(chapter2Subconcepts.map((sc) => [sc.id, sc]))
  const loMap = new Map(chapter2LearningObjectives.map((lo) => [lo.id, lo]))

  const productionContentIds = getProductionContentBlockIds()
  const productionFlashcardIds = getProductionFlashcardIds()
  const activeFlashcardIds = getActiveFlashcardIds()
  const inactiveFlashcardIds = getInactiveFlashcardIds()
  const productionQuizIds = getProductionQuizQuestionIds()

  // ─────────────────────────────────────────────
  // 1. Concept Count and Uniqueness
  // ─────────────────────────────────────────────

  describe('Concept Definitions', () => {
    it('has exactly 25 active concepts', () => {
      const active = chapter2Concepts.filter((c) => c.status === 'active')
      expect(active).toHaveLength(25)
    })

    it('has exactly 1 retired concept (C-2-22)', () => {
      const retired = chapter2Concepts.filter((c) => c.status === 'retired')
      expect(retired).toHaveLength(1)
      expect(retired[0].id).toBe('C-2-22')
    })

    it('has unique concept IDs', () => {
      const ids = chapter2Concepts.map((c) => c.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('ACTIVE_CONCEPT_IDS contains exactly 25 IDs', () => {
      expect(ACTIVE_CONCEPT_IDS).toHaveLength(25)
    })

    it('RETIRED_CONCEPT_IDS contains exactly C-2-22', () => {
      expect(RETIRED_CONCEPT_IDS).toEqual(['C-2-22'])
    })
  })

  // ─────────────────────────────────────────────
  // 2. Subconcept Count and Parent Resolution
  // ─────────────────────────────────────────────

  describe('Subconcept Definitions', () => {
    it('has exactly 18 subconcepts', () => {
      expect(chapter2Subconcepts).toHaveLength(18)
    })

    it('has unique subconcept IDs', () => {
      const ids = chapter2Subconcepts.map((sc) => sc.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('every subconcept resolves to a valid parent concept', () => {
      for (const sc of chapter2Subconcepts) {
        const parent = conceptMap.get(sc.parentConceptId)
        expect(parent).toBeDefined()
        expect(parent!.status).toBe('active')
      }
    })

    it('every subconcept is attached to its parent concept', () => {
      for (const sc of chapter2Subconcepts) {
        const parent = conceptMap.get(sc.parentConceptId)!
        const attached = parent.subconcepts.find((s) => s.id === sc.id)
        expect(attached).toBeDefined()
      }
    })
  })

  // ─────────────────────────────────────────────
  // 3. Learning Objective Count and Concept Resolution
  // ─────────────────────────────────────────────

  describe('Learning Objective Definitions', () => {
    it('has exactly 14 learning objectives', () => {
      expect(chapter2LearningObjectives).toHaveLength(14)
    })

    it('has unique learning objective IDs', () => {
      const ids = chapter2LearningObjectives.map((lo) => lo.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('every LO references valid concept IDs', () => {
      for (const lo of chapter2LearningObjectives) {
        for (const conceptId of lo.conceptIds) {
          const concept = conceptMap.get(conceptId)
          expect(concept).toBeDefined()
          expect(concept!.status).toBe('active')
        }
      }
    })

    it('every concept references a valid LO', () => {
      for (const concept of chapter2Concepts) {
        const lo = loMap.get(concept.learningObjectiveId)
        expect(lo).toBeDefined()
      }
    })
  })

  // ─────────────────────────────────────────────
  // 4. Content Mapping Validation
  // ─────────────────────────────────────────────

  describe('Content Mappings', () => {
    it('every mapped content block ID exists in production', () => {
      for (const mapping of chapter2ContentMappings) {
        expect(
          productionContentIds.has(mapping.contentBlockId),
          `Content block '${mapping.contentBlockId}' not found in production`,
        ).toBe(true)
      }
    })

    it('every mapped concept resolves to an active concept', () => {
      for (const mapping of chapter2ContentMappings) {
        const concept = conceptMap.get(mapping.conceptId)
        expect(concept).toBeDefined()
        expect(concept!.status).toBe('active')
      }
    })

    it('every mapped subconcept resolves to a valid subconcept', () => {
      for (const mapping of chapter2ContentMappings) {
        if (mapping.subconceptId) {
          const subconcept = subconceptMap.get(mapping.subconceptId)
          expect(subconcept).toBeDefined()
          expect(subconcept!.parentConceptId).toBe(mapping.conceptId)
        }
      }
    })

    it('every secondary concept mapping resolves to an active concept', () => {
      for (const mapping of chapter2ContentMappings) {
        if (mapping.secondaryConceptIds) {
          for (const secondaryId of mapping.secondaryConceptIds) {
            const concept = conceptMap.get(secondaryId)
            expect(concept).toBeDefined()
            expect(concept!.status).toBe('active')
          }
        }
      }
    })

    it('no retired concept is referenced in content mappings', () => {
      for (const mapping of chapter2ContentMappings) {
        expect(RETIRED_CONCEPT_IDS).not.toContain(mapping.conceptId)
        if (mapping.secondaryConceptIds) {
          for (const id of mapping.secondaryConceptIds) {
            expect(RETIRED_CONCEPT_IDS).not.toContain(id)
          }
        }
      }
    })
  })

  // ─────────────────────────────────────────────
  // 5. Flashcard Mapping Validation
  // ─────────────────────────────────────────────

  describe('Flashcard Mappings', () => {
    it('all 65 production flashcards are accounted for in mappings', () => {
      const mappedIds = new Set(chapter2FlashcardMappings.map((m) => m.flashcardId))
      expect(mappedIds.size).toBe(65)
      for (const id of productionFlashcardIds) {
        expect(mappedIds.has(id as `fc-2-${string}`), `Flashcard '${id}' not mapped`).toBe(true)
      }
    })

    it('all 64 active flashcards are accounted for', () => {
      const mappedActiveIds = new Set(
        chapter2FlashcardMappings
          .filter((m) => activeFlashcardIds.has(m.flashcardId))
          .map((m) => m.flashcardId),
      )
      expect(mappedActiveIds.size).toBe(64)
    })

    it('inactive fc-2-045 is intentionally mapped but marked inactive', () => {
      // fc-2-045 must be in the mappings (so it doesn't silently become active)
      const mapping = chapter2FlashcardMappings.find((m) => m.flashcardId === 'fc-2-045')
      expect(mapping).toBeDefined()
      expect(mapping!.conceptId).toBe('C-2-05')

      // But it must be inactive in production
      expect(inactiveFlashcardIds.has('fc-2-045')).toBe(true)
      expect(activeFlashcardIds.has('fc-2-045')).toBe(false)
    })

    it('every mapped flashcard ID exists in production', () => {
      for (const mapping of chapter2FlashcardMappings) {
        expect(
          productionFlashcardIds.has(mapping.flashcardId),
          `Flashcard '${mapping.flashcardId}' not found in production`,
        ).toBe(true)
      }
    })

    it('every mapped concept resolves to an active concept', () => {
      for (const mapping of chapter2FlashcardMappings) {
        const concept = conceptMap.get(mapping.conceptId)
        expect(concept).toBeDefined()
        expect(concept!.status).toBe('active')
      }
    })

    it('no retired concept is referenced in flashcard mappings', () => {
      for (const mapping of chapter2FlashcardMappings) {
        expect(RETIRED_CONCEPT_IDS).not.toContain(mapping.conceptId)
      }
    })
  })

  // ─────────────────────────────────────────────
  // 6. Quiz Question Mapping Validation
  // ─────────────────────────────────────────────

  describe('Quiz Question Mappings', () => {
    it('all 48 production quiz questions are accounted for in mappings', () => {
      const mappedIds = new Set(chapter2QuizQuestionMappings.map((m) => m.questionId))
      expect(mappedIds.size).toBe(48)
      for (const id of productionQuizIds) {
        expect(mappedIds.has(id as `qq-2-${string}`), `Quiz question '${id}' not mapped`).toBe(true)
      }
    })

    it('every mapped quiz question ID exists in production', () => {
      for (const mapping of chapter2QuizQuestionMappings) {
        expect(
          productionQuizIds.has(mapping.questionId),
          `Quiz question '${mapping.questionId}' not found in production`,
        ).toBe(true)
      }
    })

    it('every mapped concept resolves to an active concept', () => {
      for (const mapping of chapter2QuizQuestionMappings) {
        const concept = conceptMap.get(mapping.conceptId)
        expect(concept).toBeDefined()
        expect(concept!.status).toBe('active')
      }
    })

    it('no retired concept is referenced in quiz mappings', () => {
      for (const mapping of chapter2QuizQuestionMappings) {
        expect(RETIRED_CONCEPT_IDS).not.toContain(mapping.conceptId)
      }
    })

    it('qq-2-033 and qq-2-036 are intentionally omitted (do not exist)', () => {
      expect(productionQuizIds.has('qq-2-033')).toBe(false)
      expect(productionQuizIds.has('qq-2-036')).toBe(false)
    })
  })

  // ─────────────────────────────────────────────
  // 7. Concept Coverage Validation
  // ─────────────────────────────────────────────

  describe('Concept Coverage', () => {
    it('every active concept has ≥1 content asset', () => {
      for (const conceptId of ACTIVE_CONCEPT_IDS) {
        const hasContent = chapter2ContentMappings.some((m) => m.conceptId === conceptId)
        expect(hasContent, `Concept '${conceptId}' has no content assets`).toBe(true)
      }
    })

    it('every active concept has ≥1 active flashcard', () => {
      for (const conceptId of ACTIVE_CONCEPT_IDS) {
        const hasActiveFlashcard = chapter2FlashcardMappings.some(
          (m) => m.conceptId === conceptId && activeFlashcardIds.has(m.flashcardId),
        )
        expect(hasActiveFlashcard, `Concept '${conceptId}' has no active flashcards`).toBe(true)
      }
    })

    it('every active concept has ≥1 quiz question', () => {
      for (const conceptId of ACTIVE_CONCEPT_IDS) {
        const hasQuiz = chapter2QuizQuestionMappings.some((m) => m.conceptId === conceptId)
        expect(hasQuiz, `Concept '${conceptId}' has no quiz questions`).toBe(true)
      }
    })
  })

  // ─────────────────────────────────────────────
  // 8. Regression Tests
  // ─────────────────────────────────────────────

  describe('Regression Tests', () => {
    it('qq-2-037 maps to C-2-16 (Work-Life Balance)', () => {
      const mapping = chapter2QuizQuestionMappings.find((m) => m.questionId === 'qq-2-037')
      expect(mapping).toBeDefined()
      expect(mapping!.conceptId).toBe('C-2-16')
    })

    it('C-2-16 has exactly 1 quiz question (qq-2-037)', () => {
      const mappings = chapter2QuizQuestionMappings.filter((m) => m.conceptId === 'C-2-16')
      expect(mappings).toHaveLength(1)
      expect(mappings[0].questionId).toBe('qq-2-037')
    })

    it('fc-2-045 is mapped to C-2-05 but is inactive', () => {
      const mapping = chapter2FlashcardMappings.find((m) => m.flashcardId === 'fc-2-045')
      expect(mapping).toBeDefined()
      expect(mapping!.conceptId).toBe('C-2-05')

      const productionCard = chapter2PremiumFlashcards.find((f) => f.id === 'fc-2-045')
      expect(productionCard).toBeDefined()
      expect(productionCard!.is_active).toBe(false)
    })
  })

  // ─────────────────────────────────────────────
  // 9. Chain Resolution (Question/Flashcard/Content → Concept → LO)
  // ─────────────────────────────────────────────

  describe('Chain Resolution', () => {
    function resolveConceptToLO(conceptId: ConceptId): LearningObjectiveId {
      const concept = conceptMap.get(conceptId)
      if (!concept) throw new Error(`Concept ${conceptId} not found`)
      return concept.learningObjectiveId
    }

    it('Question → Concept → LO chain resolves for all quiz questions', () => {
      for (const mapping of chapter2QuizQuestionMappings) {
        const loId = resolveConceptToLO(mapping.conceptId)
        const lo = loMap.get(loId)
        expect(lo).toBeDefined()
        expect(lo!.conceptIds).toContain(mapping.conceptId)
      }
    })

    it('Flashcard → Concept → LO chain resolves for all flashcards', () => {
      for (const mapping of chapter2FlashcardMappings) {
        const loId = resolveConceptToLO(mapping.conceptId)
        const lo = loMap.get(loId)
        expect(lo).toBeDefined()
        expect(lo!.conceptIds).toContain(mapping.conceptId)
      }
    })

    it('Content → Concept → LO chain resolves for all content blocks', () => {
      for (const mapping of chapter2ContentMappings) {
        const loId = resolveConceptToLO(mapping.conceptId)
        const lo = loMap.get(loId)
        expect(lo).toBeDefined()
        expect(lo!.conceptIds).toContain(mapping.conceptId)
      }
    })

    it('Concept → associated content/flashcards/questions resolves for all active concepts', () => {
      for (const conceptId of ACTIVE_CONCEPT_IDS) {
        const contentCount = chapter2ContentMappings.filter((m) => m.conceptId === conceptId).length
        const flashcardCount = chapter2FlashcardMappings.filter(
          (m) => m.conceptId === conceptId && activeFlashcardIds.has(m.flashcardId),
        ).length
        const quizCount = chapter2QuizQuestionMappings.filter((m) => m.conceptId === conceptId).length

        expect(contentCount, `Concept '${conceptId}' content count`).toBeGreaterThanOrEqual(1)
        expect(flashcardCount, `Concept '${conceptId}' flashcard count`).toBeGreaterThanOrEqual(1)
        expect(quizCount, `Concept '${conceptId}' quiz count`).toBeGreaterThanOrEqual(1)
      }
    })
  })

  // ─────────────────────────────────────────────
  // 10. Summary Statistics
  // ─────────────────────────────────────────────

  describe('Summary Statistics', () => {
    it('reports correct asset counts', () => {
      // Content blocks: 81 total (70 top-level + 11 nested)
      expect(chapter2ContentMappings.length).toBe(81)

      // Flashcards: 65 total (64 active + 1 inactive)
      expect(chapter2FlashcardMappings.length).toBe(65)

      // Quiz questions: 48 total
      expect(chapter2QuizQuestionMappings.length).toBe(48)
    })

    it('reports correct concept counts', () => {
      expect(chapter2Concepts.length).toBe(26) // 25 active + 1 retired
      expect(ACTIVE_CONCEPT_IDS.length).toBe(25)
      expect(RETIRED_CONCEPT_IDS.length).toBe(1)
    })

    it('reports correct subconcept counts', () => {
      expect(chapter2Subconcepts.length).toBe(18)
      expect(SUBCONCEPT_IDS.length).toBe(18)
    })

    it('reports correct LO counts', () => {
      expect(chapter2LearningObjectives.length).toBe(14)
      expect(LEARNING_OBJECTIVE_IDS.length).toBe(14)
    })
  })
})
