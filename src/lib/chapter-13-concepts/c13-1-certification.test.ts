import { describe, expect, it } from 'vitest'
import { chapter13PremiumContent } from '../chapter-13-premium'
import { chapter13PremiumFlashcards } from '../chapter-13-premium-flashcards'
import { chapter13PremiumQuizQuestions } from '../chapter-13-premium-quiz'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import {
  getFlashcardEvidenceConcept,
  getFlashcardEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'
import { isConceptDetectionSupported } from '../remediation/chapter-registry'
import {
  ACTIVE_CHAPTER13_CONCEPT_FAMILY_IDS,
  chapter13ConceptFamilies,
  chapter13LearningObjectives,
} from './concepts'
import {
  chapter13ContentConceptMappings,
  chapter13FlashcardConceptMappings,
  chapter13MicroCheckPlacements,
  chapter13QuizQuestionConceptMappings,
} from './mappings'
import { CHAPTER13_GRADE_WEIGHTS, calculateChapter13Grade } from './grading'

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

describe('C13-1 canonical concept architecture + shared grading/evidence binding', () => {
  it('defines eight stable active concept families and learning objectives', () => {
    expect(chapter13LearningObjectives).toHaveLength(8)
    expect(chapter13ConceptFamilies).toHaveLength(8)
    expect(ACTIVE_CHAPTER13_CONCEPT_FAMILY_IDS).toHaveLength(8)
    expect(new Set(ACTIVE_CHAPTER13_CONCEPT_FAMILY_IDS).size).toBe(8)

    for (const concept of chapter13ConceptFamilies) {
      expect(concept.status).toBe('active')
      expect(concept.examRelevance).toBe('INDIRECT_REFERENCE_ONLY')
      expect(concept.sourceProvenance).toBe('INDUSTRY_STANDARD_SUBJECT_MATTER')
      expect(concept.learningObjectiveIds.length).toBeGreaterThan(0)
    }
  })

  it('maps every current lesson ID exactly once without rewriting lesson content', () => {
    const authoredIds = collectContentIds(chapter13PremiumContent.sections)
    expect(authoredIds).toHaveLength(41)
    expect(new Set(authoredIds).size).toBe(41)

    expect(chapter13ContentConceptMappings).toHaveLength(41)
    expect(new Set(chapter13ContentConceptMappings.map((mapping) => mapping.contentBlockId)).size).toBe(41)
    expect(new Set(chapter13ContentConceptMappings.map((mapping) => mapping.contentBlockId))).toEqual(new Set(authoredIds))
  })

  it('maps all 90 active flashcards exactly once', () => {
    expect(chapter13PremiumFlashcards).toHaveLength(90)
    expect(chapter13PremiumFlashcards.every((card) => card.is_active)).toBe(true)
    expect(chapter13FlashcardConceptMappings).toHaveLength(90)
    expect(new Set(chapter13FlashcardConceptMappings.map((mapping) => mapping.flashcardId)).size).toBe(90)
    expect(new Set(chapter13FlashcardConceptMappings.map((mapping) => mapping.flashcardId))).toEqual(
      new Set(chapter13PremiumFlashcards.map((card) => card.id)),
    )
  })

  it('maps all 45 existing assessment questions exactly once', () => {
    expect(chapter13PremiumQuizQuestions).toHaveLength(45)
    expect(chapter13QuizQuestionConceptMappings).toHaveLength(45)
    expect(new Set(chapter13QuizQuestionConceptMappings.map((mapping) => mapping.questionId)).size).toBe(45)
    expect(new Set(chapter13QuizQuestionConceptMappings.map((mapping) => mapping.questionId))).toEqual(
      new Set(chapter13PremiumQuizQuestions.map((question) => question.id)),
    )
  })

  it('gives every canonical concept lesson, flashcard, assessment, and planned micro-check coverage', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER13_CONCEPT_FAMILY_IDS) {
      expect(chapter13ContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(chapter13FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(chapter13QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId)).toBe(true)
      expect(chapter13MicroCheckPlacements.some((mapping) => mapping.conceptFamilyId === conceptFamilyId)).toBe(true)
    }
  })

  it('reuses the shared grading contract without changing weights', () => {
    expect(CHAPTER13_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
    expect(CHAPTER13_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    expect(calculateChapter13Grade({
      microCheckPercent: 80,
      flashcardPercent: 90,
      chapterAssessmentPercent: 75,
      scenarioApplicationPercent: 80,
      remediationReassessmentPercent: 100,
    })).toEqual({
      baseGrade: 78.82,
      finalGrade: 82,
      recoveryApplied: true,
      componentWeights: SHARED_GRADE_WEIGHTS,
    })
  })

  it('binds Chapter 13 flashcard activity to the unified durable evidence registry', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-13')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-13')).toHaveLength(90)

    for (const mapping of chapter13FlashcardConceptMappings) {
      expect(getFlashcardEvidenceConcept('ch-13', mapping.flashcardId)).toBe(mapping.conceptFamilyId)
    }

    // Chapter 12 is already part of the certified unified activity-evidence registry on current main.
    expect(isUnifiedActivityEvidenceChapter('ch-12')).toBe(true)
  })

  it('registers Chapter 13 for the shared initial-quiz concept-detection handoff', () => {
    expect(isConceptDetectionSupported('ch-13')).toBe(true)
  })

  it('allows later certified assessment hardening while preserving all C13-1 IDs and mappings', () => {
    const counts = chapter13PremiumQuizQuestions.reduce<Record<string, number>>((acc, question) => {
      acc[question.correct_answer] = (acc[question.correct_answer] ?? 0) + 1
      return acc
    }, {})

    expect(counts).toEqual({ a: 12, b: 11, c: 11, d: 11 })
  })
})
