import { describe, expect, it } from 'vitest'
import { chapter9PremiumContent } from '../chapter-9-premium'
import { chapter9PremiumFlashcards } from '../chapter-9-premium-flashcards'
import { chapter9PremiumQuizQuestions } from '../chapter-9-premium-quiz'
import { CHAPTER9_CONCEPT_FAMILY_IDS } from './concepts'
import {
  chapter9ContentConceptMappings,
  chapter9FlashcardConceptMappings,
  chapter9QuizQuestionConceptMappings,
} from './mappings'

function expectExactlyOnce(actualIds: readonly string[], mappedIds: readonly string[]) {
  expect(mappedIds).toHaveLength(actualIds.length)
  expect(new Set(mappedIds).size).toBe(mappedIds.length)
  expect(new Set(mappedIds)).toEqual(new Set(actualIds))
}

describe('C9-1 Chapter 9 asset-to-concept integrity', () => {
  it('maps every one of the 38 current lesson sections exactly once', () => {
    const sectionIds = chapter9PremiumContent.sections.map((section) => section.id)
    expect(sectionIds).toHaveLength(38)
    expectExactlyOnce(
      sectionIds,
      chapter9ContentConceptMappings.map((mapping) => mapping.contentBlockId),
    )
  })

  it('maps every one of the 50 current active flashcards exactly once', () => {
    const cardIds = chapter9PremiumFlashcards
      .filter((card) => card.is_active)
      .map((card) => card.id)
    expect(cardIds).toHaveLength(50)
    expectExactlyOnce(
      cardIds,
      chapter9FlashcardConceptMappings.map((mapping) => mapping.flashcardId),
    )
  })

  it('maps every one of the 30 current quiz questions exactly once', () => {
    const questionIds = chapter9PremiumQuizQuestions.map((question) => question.id)
    expect(questionIds).toHaveLength(30)
    expectExactlyOnce(
      questionIds,
      chapter9QuizQuestionConceptMappings.map((mapping) => mapping.questionId),
    )
  })

  it('gives every canonical concept instructional coverage', () => {
    for (const conceptFamilyId of CHAPTER9_CONCEPT_FAMILY_IDS) {
      expect(
        chapter9ContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
      ).toBe(true)
      expect(
        chapter9FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
      ).toBe(true)
      expect(
        chapter9QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
      ).toBe(true)
    }
  })
})
