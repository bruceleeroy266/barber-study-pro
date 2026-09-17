import { describe, expect, it } from 'vitest'
import { chapter4PremiumFlashcards } from '@/lib/chapter-4-premium-flashcards'
import { chapter4PremiumQuizQuestions } from '@/lib/chapter-4-premium-quiz'
import {
  ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS,
  chapter4ConceptFamilies,
  chapter4LearningObjectives,
} from './concepts'
import {
  chapter4FlashcardConceptMappings,
  chapter4QuizQuestionConceptMappings,
  getChapter4ConceptForFlashcard,
  getChapter4ConceptForQuizQuestion,
} from './mappings'

const expectedConceptCounts = {
  'ch4-pathogens-transmission': { flashcards: 9, quiz: 5 },
  'ch4-disinfection-sterilization': { flashcards: 10, quiz: 6 },
  'ch4-cross-contamination': { flashcards: 8, quiz: 5 },
  'ch4-blood-exposure-ppe': { flashcards: 9, quiz: 5 },
  'ch4-regulatory-chemical-safety': { flashcards: 7, quiz: 4 },
  'ch4-safe-practice-compliance': { flashcards: 7, quiz: 5 },
} as const

describe('Chapter 4 content foundation integrity', () => {
  it('locks eight learning objectives and six active canonical concepts', () => {
    expect(chapter4LearningObjectives).toHaveLength(8)
    expect(chapter4ConceptFamilies).toHaveLength(6)
    expect(ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS).toHaveLength(6)
    expect(new Set(ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS).size).toBe(6)
    expect(chapter4ConceptFamilies.map((concept) => concept.id)).toEqual([
      'ch4-pathogens-transmission',
      'ch4-disinfection-sterilization',
      'ch4-cross-contamination',
      'ch4-blood-exposure-ppe',
      'ch4-regulatory-chemical-safety',
      'ch4-safe-practice-compliance',
    ])
  })

  it('keeps learning-objective and concept references bidirectionally valid', () => {
    const objectiveIds = new Set(chapter4LearningObjectives.map((objective) => objective.id))
    const conceptIds = new Set(ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS)

    for (const objective of chapter4LearningObjectives) {
      expect(objective.conceptFamilyIds.length).toBeGreaterThan(0)
      for (const conceptId of objective.conceptFamilyIds) expect(conceptIds.has(conceptId)).toBe(true)
    }

    for (const concept of chapter4ConceptFamilies) {
      expect(concept.learningObjectiveIds.length).toBeGreaterThan(0)
      for (const objectiveId of concept.learningObjectiveIds) expect(objectiveIds.has(objectiveId)).toBe(true)
      for (const objectiveId of concept.learningObjectiveIds) {
        const objective = chapter4LearningObjectives.find((item) => item.id === objectiveId)
        expect(objective?.conceptFamilyIds).toContain(concept.id)
      }
    }
  })

  it('serves exactly 50 active canonical Chapter 4 flashcards with stable IDs', () => {
    expect(chapter4PremiumFlashcards).toHaveLength(50)
    expect(chapter4PremiumFlashcards.map((card) => card.id)).toEqual(
      Array.from({ length: 50 }, (_, index) => `fc-4-${String(index + 1).padStart(3, '0')}`),
    )
    expect(chapter4PremiumFlashcards.every((card) => card.chapter_id === 'ch-4')).toBe(true)
    expect(chapter4PremiumFlashcards.every((card) => card.is_active === true)).toBe(true)
    expect(new Set(chapter4PremiumFlashcards.map((card) => card.front.trim().toLowerCase())).size).toBe(50)
  })

  it('maps every flashcard exactly once with no orphans and the locked concept distribution', () => {
    expect(chapter4FlashcardConceptMappings).toHaveLength(50)
    expect(new Set(chapter4FlashcardConceptMappings.map((mapping) => mapping.flashcardId)).size).toBe(50)

    const servedIds = new Set(chapter4PremiumFlashcards.map((card) => card.id))
    for (const mapping of chapter4FlashcardConceptMappings) {
      expect(servedIds.has(mapping.flashcardId)).toBe(true)
      expect(getChapter4ConceptForFlashcard(mapping.flashcardId)).toBe(mapping.conceptFamilyId)
    }
    for (const card of chapter4PremiumFlashcards) expect(getChapter4ConceptForFlashcard(card.id)).not.toBeNull()

    for (const conceptId of ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS) {
      expect(chapter4FlashcardConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptId)).toHaveLength(
        expectedConceptCounts[conceptId].flashcards,
      )
    }
  })

  it('serves exactly 30 initial-assessment questions with stable unique IDs and complete answers', () => {
    expect(chapter4PremiumQuizQuestions).toHaveLength(30)
    expect(chapter4PremiumQuizQuestions.map((question) => question.id)).toEqual(
      Array.from({ length: 30 }, (_, index) => `qq-4-${String(index + 1).padStart(3, '0')}`),
    )
    expect(new Set(chapter4PremiumQuizQuestions.map((question) => question.question.trim().toLowerCase())).size).toBe(30)

    for (const question of chapter4PremiumQuizQuestions) {
      expect(question.quiz_id).toBe('quiz-4')
      expect(['a', 'b', 'c', 'd']).toContain(question.correct_answer)
      expect(question.answer_a.trim()).not.toBe('')
      expect(question.answer_b.trim()).not.toBe('')
      expect(question.answer_c.trim()).not.toBe('')
      expect(question.answer_d.trim()).not.toBe('')
      expect(new Set([question.answer_a, question.answer_b, question.answer_c, question.answer_d])).toHaveSize(4)
      expect(question.explanation.trim()).not.toBe('')
    }
  })

  it('locks initial-assessment difficulty at 12 easy, 12 medium, and 6 hard', () => {
    const counts = chapter4PremiumQuizQuestions.reduce<Record<string, number>>((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1
      return acc
    }, {})
    expect(counts).toEqual({ easy: 12, medium: 12, hard: 6 })
  })

  it('maps every quiz question exactly once with no orphans and the locked 5/6/5/5/4/5 distribution', () => {
    expect(chapter4QuizQuestionConceptMappings).toHaveLength(30)
    expect(new Set(chapter4QuizQuestionConceptMappings.map((mapping) => mapping.questionId)).size).toBe(30)

    const servedIds = new Set(chapter4PremiumQuizQuestions.map((question) => question.id))
    for (const mapping of chapter4QuizQuestionConceptMappings) {
      expect(servedIds.has(mapping.questionId)).toBe(true)
      expect(getChapter4ConceptForQuizQuestion(mapping.questionId)).toBe(mapping.conceptFamilyId)
    }
    for (const question of chapter4PremiumQuizQuestions) expect(getChapter4ConceptForQuizQuestion(question.id)).not.toBeNull()

    for (const conceptId of ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS) {
      expect(chapter4QuizQuestionConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptId)).toHaveLength(
        expectedConceptCounts[conceptId].quiz,
      )
    }
  })

  it('fails closed for unknown Chapter 4 content IDs', () => {
    expect(getChapter4ConceptForFlashcard('fc-4-999')).toBeNull()
    expect(getChapter4ConceptForQuizQuestion('qq-4-999')).toBeNull()
  })
})
