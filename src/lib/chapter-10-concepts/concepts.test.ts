import { describe, expect, it } from 'vitest'
import { chapter10PremiumContent } from '../chapter-10-premium'
import { chapter10PremiumFlashcards } from '../chapter-10-premium-flashcards'
import { chapter10PremiumQuizQuestions } from '../chapter-10-premium-quiz'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import { CHAPTER10_CONCEPT_FAMILY_IDS, chapter10ConceptFamilies, chapter10LearningObjectives } from './concepts'
import { CHAPTER10_GRADE_WEIGHTS, calculateChapter10Grade } from './grading'
import {
  chapter10ContentConceptMappings,
  chapter10FlashcardConceptMappings,
  chapter10QuizQuestionConceptMappings,
  getChapter10ContentBlocksForConcept,
  getChapter10FlashcardsForConcept,
  getChapter10QuizQuestionsForConcept,
} from './mappings'

describe('C10-1 canonical concept architecture', () => {
  it('defines nine learning objectives and nine stable concept families', () => {
    expect(chapter10LearningObjectives).toHaveLength(9)
    expect(chapter10ConceptFamilies).toHaveLength(9)
    expect(CHAPTER10_CONCEPT_FAMILY_IDS).toHaveLength(9)
    expect(new Set(CHAPTER10_CONCEPT_FAMILY_IDS).size).toBe(9)
    expect(chapter10ConceptFamilies.every((c) => c.examRelevance === 'INDIRECT_REFERENCE_ONLY')).toBe(true)
  })

  it('maps every current lesson content block exactly once', () => {
    const collectIds = (value: unknown): string[] => {
      if (Array.isArray(value)) return value.flatMap(collectIds)
      if (!value || typeof value !== 'object') return []
      const record = value as Record<string, unknown>
      const ownId = typeof record.id === 'string' ? [record.id] : []
      return [
        ...ownId,
        ...Object.entries(record)
          .filter(([key]) => key !== 'id')
          .flatMap(([, child]) => collectIds(child)),
      ]
    }

    const runtimeIds = collectIds(chapter10PremiumContent.sections).sort()
    const mappedIds = chapter10ContentConceptMappings.map((m) => m.contentBlockId).sort()
    expect(runtimeIds).toHaveLength(47)
    expect(mappedIds).toEqual(runtimeIds)
    expect(new Set(mappedIds).size).toBe(mappedIds.length)
  })

  it('maps all 118 active flashcards exactly once without changing IDs', () => {
    const runtimeIds = chapter10PremiumFlashcards.map((card) => card.id).sort()
    const mappedIds = chapter10FlashcardConceptMappings.map((m) => m.flashcardId).sort()
    expect(runtimeIds).toHaveLength(118)
    expect(mappedIds).toEqual(runtimeIds)
    expect(new Set(mappedIds).size).toBe(118)
  })

  it('maps all 75 assessment items exactly once without changing IDs', () => {
    const runtimeIds = chapter10PremiumQuizQuestions.map((q) => q.id).sort()
    const mappedIds = chapter10QuizQuestionConceptMappings.map((m) => m.questionId).sort()
    expect(runtimeIds).toHaveLength(75)
    expect(mappedIds).toEqual(runtimeIds)
    expect(new Set(mappedIds).size).toBe(75)
  })

  it('gives every canonical concept lesson, flashcard, and assessment coverage', () => {
    for (const conceptId of CHAPTER10_CONCEPT_FAMILY_IDS) {
      expect(getChapter10ContentBlocksForConcept(conceptId).length).toBeGreaterThan(0)
      expect(getChapter10FlashcardsForConcept(conceptId).length).toBeGreaterThan(0)
      expect(getChapter10QuizQuestionsForConcept(conceptId).length).toBeGreaterThan(0)
    }
  })

  it('uses the locked shared grading weights instead of a Chapter 10 formula copy', () => {
    expect(CHAPTER10_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
    const result = calculateChapter10Grade({
      microCheckPercent: 100,
      flashcardPercent: 100,
      chapterAssessmentPercent: 100,
      scenarioApplicationPercent: 100,
      remediationReassessmentPercent: 100,
    })
    expect(result.finalGrade).toBe(100)
  })
})
