import { describe, expect, it } from 'vitest'
import { chapter4PremiumFlashcards } from '@/lib/chapter-4-premium-flashcards'
import { chapter4PremiumQuizQuestions } from '@/lib/chapter-4-premium-quiz'
import {
  ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS,
  chapter4ConceptFamilies,
  chapter4LearningObjectives,
  isChapter4ConceptFamilyId,
} from './concepts'
import {
  chapter4ContentConceptMappings,
  chapter4FlashcardConceptMappings,
  chapter4QuizQuestionConceptMappings,
  chapter4ReassessmentQuestionConceptMappings,
  getChapter4ConceptForFlashcard,
  getChapter4ConceptForQuizQuestion,
} from './mappings'
import { chapter4PremiumContent } from '@/lib/chapter-4-premium'
import { chapter4ReassessmentQuestions } from '@/lib/chapter-4-reassessment-questions'

const expectedConceptCounts = {
  'ch4-pathogens-transmission': { flashcards: 17, quiz: 5 },
  'ch4-disinfection-sterilization': { flashcards: 13, quiz: 6 },
  'ch4-cross-contamination': { flashcards: 8, quiz: 5 },
  'ch4-blood-exposure-ppe': { flashcards: 9, quiz: 5 },
  'ch4-regulatory-chemical-safety': { flashcards: 9, quiz: 4 },
  'ch4-safe-practice-compliance': { flashcards: 14, quiz: 5 },
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

  it('serves exactly 70 active canonical Chapter 4 flashcards with stable IDs', () => {
    expect(chapter4PremiumFlashcards).toHaveLength(70)
    expect(chapter4PremiumFlashcards.map((card) => card.id)).toEqual(
      Array.from({ length: 70 }, (_, index) => `fc-4-${String(index + 1).padStart(3, '0')}`),
    )
    expect(chapter4PremiumFlashcards.every((card) => card.chapter_id === 'ch-4')).toBe(true)
    expect(chapter4PremiumFlashcards.every((card) => card.is_active === true)).toBe(true)
    expect(new Set(chapter4PremiumFlashcards.map((card) => card.front.trim().toLowerCase())).size).toBe(70)
  })

  it('maps every flashcard exactly once with no orphans and the locked concept distribution', () => {
    expect(chapter4FlashcardConceptMappings).toHaveLength(70)
    expect(new Set(chapter4FlashcardConceptMappings.map((mapping) => mapping.flashcardId)).size).toBe(70)

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
      expect(new Set([question.answer_a, question.answer_b, question.answer_c, question.answer_d]).size).toBe(4)
      expect(question.explanation?.trim()).not.toBe('')
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

  it('designates a valid, distinct primary learning objective per family (C4-2)', () => {
    const objectiveIds = new Set(chapter4LearningObjectives.map((objective) => objective.id))
    const primaries = chapter4ConceptFamilies.map((concept) => concept.learningObjectiveId)

    for (const concept of chapter4ConceptFamilies) {
      // Primary exists in the canonical LO set and is a member of the family's
      // own many-to-many relationships (which stay intact).
      expect(objectiveIds.has(concept.learningObjectiveId)).toBe(true)
      expect(concept.learningObjectiveIds).toContain(concept.learningObjectiveId)
    }

    // The six primary assignments are the audited intentional set, all distinct.
    expect(new Set(primaries).size).toBe(6)
    expect(primaries).toEqual(['LO-4-02', 'LO-4-04', 'LO-4-03', 'LO-4-06', 'LO-4-01', 'LO-4-08'])
  })

  it('maps every Chapter 4 content mapping to a real section with full family coverage (C4-2)', () => {
    expect(chapter4ContentConceptMappings.length).toBeGreaterThan(0)

    // No duplicate or malformed section mappings.
    expect(new Set(chapter4ContentConceptMappings.map((mapping) => mapping.contentBlockId)).size).toBe(
      chapter4ContentConceptMappings.length,
    )

    // Every mapping references a known concept family and a REAL served section id.
    const servedSectionIds = new Set(chapter4PremiumContent.sections.map((section) => section.id))
    for (const mapping of chapter4ContentConceptMappings) {
      expect(isChapter4ConceptFamilyId(mapping.conceptFamilyId)).toBe(true)
      expect(servedSectionIds.has(mapping.contentBlockId), mapping.contentBlockId).toBe(true)
    }

    // Every canonical family has at least one PRIMARY content block — no orphan families.
    for (const conceptId of ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS) {
      expect(
        chapter4ContentConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptId).length,
      ).toBeGreaterThan(0)
    }
  })

  it('serves exactly 90 reserve questions continuing the sequence with complete answers (C4-3)', () => {
    expect(chapter4ReassessmentQuestions).toHaveLength(90)

    // IDs and order continue the initial bank's sequence — no reuse, no gaps.
    expect(chapter4ReassessmentQuestions.map((question) => question.id)).toEqual(
      Array.from({ length: 90 }, (_, index) => `qq-4-${String(index + 31).padStart(3, '0')}`),
    )
    expect(chapter4ReassessmentQuestions.map((question) => question.order_index)).toEqual(
      Array.from({ length: 90 }, (_, index) => index + 31),
    )
    expect(chapter4ReassessmentQuestions.every((question) => question.quiz_id === 'quiz-4')).toBe(true)

    // Reserve IDs never enter the initial serving path.
    const initialIds = new Set(chapter4PremiumQuizQuestions.map((question) => question.id))
    for (const question of chapter4ReassessmentQuestions) expect(initialIds.has(question.id)).toBe(false)

    // Complete, distinct answers + explanations; unique wording.
    for (const question of chapter4ReassessmentQuestions) {
      expect(['a', 'b', 'c', 'd']).toContain(question.correct_answer)
      expect(new Set([question.answer_a, question.answer_b, question.answer_c, question.answer_d]).size).toBe(4)
      expect(question.explanation?.trim()).not.toBe('')
    }
    expect(new Set(chapter4ReassessmentQuestions.map((question) => question.question.trim().toLowerCase())).size).toBe(90)
  })

  it('locks reserve difficulty at 6/6/3 per family with globally balanced answer positions (C4-3)', () => {
    for (const conceptId of ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS) {
      const questionIds = new Set<string>(
        chapter4ReassessmentQuestionConceptMappings
          .filter((mapping) => mapping.conceptFamilyId === conceptId)
          .map((mapping) => mapping.questionId as string),
      )
      expect(questionIds.size).toBe(15)
      const counts = chapter4ReassessmentQuestions
        .filter((question) => questionIds.has(question.id))
        .reduce<Record<string, number>>((acc, question) => {
          acc[question.difficulty] = (acc[question.difficulty] ?? 0) + 1
          return acc
        }, {})
      expect(counts).toEqual({ easy: 6, medium: 6, hard: 3 })
    }

    const positions = chapter4ReassessmentQuestions.reduce<Record<string, number>>((acc, question) => {
      acc[question.correct_answer] = (acc[question.correct_answer] ?? 0) + 1
      return acc
    }, {})
    expect(positions).toEqual({ a: 23, b: 23, c: 22, d: 22 })
  })

  it('maps every reserve question exactly once with no orphans (C4-3)', () => {
    expect(chapter4ReassessmentQuestionConceptMappings).toHaveLength(90)
    expect(new Set(chapter4ReassessmentQuestionConceptMappings.map((mapping) => mapping.questionId)).size).toBe(90)

    const servedIds = new Set(chapter4ReassessmentQuestions.map((question) => question.id))
    const conceptIds = new Set(ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS)
    for (const mapping of chapter4ReassessmentQuestionConceptMappings) {
      expect(servedIds.has(mapping.questionId)).toBe(true)
      expect(conceptIds.has(mapping.conceptFamilyId)).toBe(true)
    }
  })
})
