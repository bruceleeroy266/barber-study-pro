import { describe, expect, it } from 'vitest'
import { chapter11PremiumContent } from '../chapter-11-premium'
import { chapter11PremiumFlashcards } from '../chapter-11-premium-flashcards'
import { chapter11PremiumQuizQuestions } from '../chapter-11-premium-quiz'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import {
  ACTIVE_CHAPTER11_CONCEPT_FAMILY_IDS,
  chapter11ConceptFamilies,
  chapter11LearningObjectives,
} from './concepts'
import {
  chapter11ContentConceptMappings,
  chapter11FlashcardConceptMappings,
  chapter11MicroCheckPlacements,
  chapter11QuizQuestionConceptMappings,
} from './mappings'
import { CHAPTER11_GRADE_WEIGHTS, calculateChapter11Grade } from './grading'

function collectContentIds(value: unknown, ids: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) collectContentIds(item, ids)
    return ids
  }
  if (!value || typeof value !== 'object') return ids

  const record = value as Record<string, unknown>
  if (typeof record.id === 'string') ids.push(record.id)
  for (const child of Object.values(record)) collectContentIds(child, ids)
  return ids
}

describe('C11-1 canonical concept architecture + shared grading binding', () => {
  it('defines a stable active concept registry and learning objectives', () => {
    expect(chapter11LearningObjectives).toHaveLength(8)
    expect(chapter11ConceptFamilies).toHaveLength(8)
    expect(ACTIVE_CHAPTER11_CONCEPT_FAMILY_IDS).toHaveLength(8)
    expect(new Set(ACTIVE_CHAPTER11_CONCEPT_FAMILY_IDS).size).toBe(8)

    for (const concept of chapter11ConceptFamilies) {
      expect(concept.status).toBe('active')
      expect(concept.examRelevance).toBe('INDIRECT_REFERENCE_ONLY')
      expect(concept.sourceProvenance).toBe('INDUSTRY_STANDARD_SUBJECT_MATTER')
      expect(concept.learningObjectiveIds.length).toBeGreaterThan(0)
    }
  })

  it('maps every current lesson ID exactly once', () => {
    const authoredIds = collectContentIds(chapter11PremiumContent.sections)
    expect(authoredIds).toHaveLength(25)
    expect(new Set(authoredIds).size).toBe(25)

    expect(chapter11ContentConceptMappings).toHaveLength(25)
    expect(new Set(chapter11ContentConceptMappings.map((mapping) => mapping.contentBlockId)).size).toBe(25)
    expect(new Set(chapter11ContentConceptMappings.map((mapping) => mapping.contentBlockId))).toEqual(new Set(authoredIds))
  })

  it('maps all 80 flashcards exactly once', () => {
    expect(chapter11PremiumFlashcards).toHaveLength(80)
    expect(chapter11FlashcardConceptMappings).toHaveLength(80)
    expect(new Set(chapter11FlashcardConceptMappings.map((mapping) => mapping.flashcardId)).size).toBe(80)
    expect(new Set(chapter11FlashcardConceptMappings.map((mapping) => mapping.flashcardId))).toEqual(
      new Set(chapter11PremiumFlashcards.map((card) => card.id)),
    )
  })

  it('maps all 50 assessment questions exactly once', () => {
    expect(chapter11PremiumQuizQuestions).toHaveLength(50)
    expect(chapter11QuizQuestionConceptMappings).toHaveLength(50)
    expect(new Set(chapter11QuizQuestionConceptMappings.map((mapping) => mapping.questionId)).size).toBe(50)
    expect(new Set(chapter11QuizQuestionConceptMappings.map((mapping) => mapping.questionId))).toEqual(
      new Set(chapter11PremiumQuizQuestions.map((question) => question.id)),
    )
  })

  it('gives every canonical concept lesson, flashcard, assessment, and planned micro-check coverage', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER11_CONCEPT_FAMILY_IDS) {
      expect(chapter11ContentConceptMappings.some((m) => m.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(chapter11FlashcardConceptMappings.some((m) => m.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(chapter11QuizQuestionConceptMappings.some((m) => m.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(chapter11MicroCheckPlacements.some((m) => m.conceptFamilyId === conceptFamilyId)).toBe(true)
    }
  })

  it('reuses the certified shared grading contract without changing weights', () => {
    expect(CHAPTER11_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
    expect(CHAPTER11_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    expect(calculateChapter11Grade({
      microCheckPercent: 80,
      flashcardPercent: 90,
      chapterAssessmentPercent: 75,
      scenarioApplicationPercent: 80,
      remediationReassessmentPercent: 100,
    })).toEqual({
      baseGrade: 78.82,
      finalGrade: 81.99,
      recoveryApplied: true,
      componentWeights: SHARED_GRADE_WEIGHTS,
    })
  })
})
