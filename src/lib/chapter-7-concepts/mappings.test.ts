import { describe, expect, it } from 'vitest'
import { chapter7PremiumFlashcards } from '../chapter-7-premium-flashcards'
import { chapter7PremiumQuizQuestions } from '../chapter-7-premium-quiz'
import { CHAPTER7_CONCEPT_FAMILY_IDS } from './concepts'
import {
  chapter7ContentConceptMappings,
  chapter7FlashcardConceptMappings,
  chapter7MicroCheckPlacements,
  chapter7QuizQuestionConceptMappings,
} from './mappings'

function duplicates(values: readonly string[]) {
  return values.filter((value, index) => values.indexOf(value) !== index)
}

describe('Chapter 7 asset-to-concept mappings', () => {
  it('maps every active flashcard exactly once', () => {
    const activeIds = chapter7PremiumFlashcards.filter((card) => card.is_active).map((card) => card.id).sort()
    const mappedIds = chapter7FlashcardConceptMappings.map((mapping) => mapping.flashcardId).sort()

    expect(duplicates(mappedIds)).toEqual([])
    expect(mappedIds).toEqual(activeIds)
  })

  it('maps every chapter quiz question exactly once', () => {
    const questionIds = chapter7PremiumQuizQuestions.map((question) => question.id).sort()
    const mappedIds = chapter7QuizQuestionConceptMappings.map((mapping) => mapping.questionId).sort()

    expect(duplicates(mappedIds)).toEqual([])
    expect(mappedIds).toEqual(questionIds)
  })

  it('uses only canonical concept-family IDs', () => {
    const valid = new Set<string>(CHAPTER7_CONCEPT_FAMILY_IDS)
    const used = [
      ...chapter7ContentConceptMappings.map((mapping) => mapping.conceptFamilyId),
      ...chapter7FlashcardConceptMappings.map((mapping) => mapping.conceptFamilyId),
      ...chapter7QuizQuestionConceptMappings.map((mapping) => mapping.conceptFamilyId),
      ...chapter7MicroCheckPlacements.map((placement) => placement.conceptFamilyId),
    ]

    expect(used.every((id) => valid.has(id))).toBe(true)
  })

  it('places one micro-check after a meaningful section for every concept family', () => {
    const placementConceptIds = chapter7MicroCheckPlacements.map((placement) => placement.conceptFamilyId).sort()
    expect(duplicates(placementConceptIds)).toEqual([])
    expect(placementConceptIds).toEqual([...CHAPTER7_CONCEPT_FAMILY_IDS].sort())
    expect(chapter7MicroCheckPlacements.every((placement) => placement.plannedQuestionCount >= 1 && placement.plannedQuestionCount <= 3)).toBe(true)
  })

  it('does not treat flashcard activity as the only assessment evidence for any concept with quiz coverage', () => {
    const quizConcepts = new Set(chapter7QuizQuestionConceptMappings.map((mapping) => mapping.conceptFamilyId))
    const flashcardConcepts = new Set(chapter7FlashcardConceptMappings.map((mapping) => mapping.conceptFamilyId))
    for (const conceptId of flashcardConcepts) {
      expect(quizConcepts.has(conceptId)).toBe(true)
    }
  })
})
