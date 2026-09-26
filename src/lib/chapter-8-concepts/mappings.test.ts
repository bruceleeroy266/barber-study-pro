import { describe, expect, it } from 'vitest'
import { chapter8PremiumContent } from '../chapter-8-premium'
import { chapter8PremiumFlashcards } from '../chapter-8-premium-flashcards'
import { chapter8PremiumQuizQuestions } from '../chapter-8-premium-quiz'
import { CHAPTER8_CONCEPT_FAMILY_IDS } from './concepts'
import {
  chapter8ContentConceptMappings,
  chapter8FlashcardConceptMappings,
  chapter8QuizQuestionConceptMappings,
} from './mappings'

describe('C8-2 Chapter 8 existing-asset mappings', () => {
  it('maps every current top-level lesson section to at least one canonical concept', () => {
    const sectionIds = chapter8PremiumContent.sections
      .map((section) => ('id' in section ? section.id : null))
      .filter((id): id is string => !!id)

    expect(sectionIds).toHaveLength(31)

    const mapped = new Set(chapter8ContentConceptMappings.map((mapping) => mapping.contentBlockId))
    expect([...new Set(sectionIds.filter((id) => !mapped.has(id)))]).toEqual([])
    expect([...mapped].filter((id) => !sectionIds.includes(id))).toEqual([])
  })

  it('maps all active flashcards exactly once', () => {
    const activeIds = chapter8PremiumFlashcards
      .filter((card) => card.is_active)
      .map((card) => card.id)

    expect(activeIds).toHaveLength(57)
    expect(chapter8FlashcardConceptMappings).toHaveLength(57)

    const mappedIds = chapter8FlashcardConceptMappings.map((mapping) => mapping.flashcardId)
    expect(new Set(mappedIds).size).toBe(57)
    expect(new Set(mappedIds)).toEqual(new Set(activeIds))
  })

  it('maps all 30 assessment questions exactly once', () => {
    const questionIds = chapter8PremiumQuizQuestions.map((question) => question.id)

    expect(questionIds).toHaveLength(30)
    expect(chapter8QuizQuestionConceptMappings).toHaveLength(30)

    const mappedIds = chapter8QuizQuestionConceptMappings.map((mapping) => mapping.questionId)
    expect(new Set(mappedIds).size).toBe(30)
    expect(new Set(mappedIds)).toEqual(new Set(questionIds))
  })

  it('uses only canonical Chapter 8 concept-family IDs', () => {
    const valid = new Set<string>(CHAPTER8_CONCEPT_FAMILY_IDS)
    const allConceptIds = [
      ...chapter8ContentConceptMappings.map((mapping) => mapping.conceptFamilyId),
      ...chapter8FlashcardConceptMappings.map((mapping) => mapping.conceptFamilyId),
      ...chapter8QuizQuestionConceptMappings.map((mapping) => mapping.conceptFamilyId),
    ]

    expect(allConceptIds.every((conceptId) => valid.has(conceptId))).toBe(true)
  })

  it('gives every canonical concept at least one mapped lesson block and one assessment evidence item', () => {
    for (const conceptId of CHAPTER8_CONCEPT_FAMILY_IDS) {
      expect(chapter8ContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptId)).toBe(true)
      expect(
        chapter8FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptId) ||
        chapter8QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptId),
      ).toBe(true)
    }
  })

  it('keeps high-priority safety questions mapped to the correct safety family where the item is actually about safety', () => {
    const equipmentSafety = new Set(
      chapter8QuizQuestionConceptMappings
        .filter((mapping) => mapping.conceptFamilyId === 'ch8-equipment-safety')
        .map((mapping) => mapping.questionId),
    )
    const lightSafety = new Set(
      chapter8QuizQuestionConceptMappings
        .filter((mapping) => mapping.conceptFamilyId === 'ch8-light-therapy-safety')
        .map((mapping) => mapping.questionId),
    )

    expect(equipmentSafety.has('qq-8-011')).toBe(true)
    expect(equipmentSafety.has('qq-8-012')).toBe(true)
    expect(lightSafety.has('qq-8-029')).toBe(true)
    expect(lightSafety.has('qq-8-030')).toBe(true)
  })
})
