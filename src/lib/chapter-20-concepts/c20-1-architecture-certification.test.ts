import { describe, expect, it } from 'vitest'
import { chapter20PremiumFlashcards } from '../chapter-20-premium-flashcards'
import { chapter20PremiumQuizQuestions } from '../chapter-20-premium-quiz'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import {
  ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS,
  CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
  chapter20ConceptFamilies,
  chapter20LearningObjectives,
} from './concepts'
import {
  chapter20FlashcardConceptMappings,
  chapter20LessonSectionConceptMappings,
  chapter20QuizQuestionConceptMappings,
} from './mappings'

describe('C20-1 canonical concept architecture certification', () => {
  it('freezes exactly six active concept families and six canonical learning objectives', () => {
    expect(chapter20ConceptFamilies).toHaveLength(6)
    expect(ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS).toHaveLength(6)
    expect(new Set(ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS).size).toBe(6)

    expect(chapter20LearningObjectives).toHaveLength(6)
    expect(new Set(chapter20LearningObjectives.map((objective) => objective.id)).size).toBe(6)
  })

  it('gives every canonical concept real lesson-section coverage', () => {
    const covered = new Set(
      chapter20LessonSectionConceptMappings.flatMap((mapping) => mapping.conceptFamilyIds),
    )
    for (const conceptId of ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS) {
      expect(covered.has(conceptId), conceptId).toBe(true)
    }

    expect(chapter20LessonSectionConceptMappings.map((mapping) => mapping.lessonSectionId)).toEqual([
      'ch20-introduction',
      'ch20-lo1',
      'ch20-lo2',
      'ch20-lo3',
      'ch20-lo4',
      'ch20-lo5',
      'ch20-lo6',
    ])
  })

  it('maps all 60 active flashcards exactly once', () => {
    expect(chapter20PremiumFlashcards).toHaveLength(60)
    expect(chapter20FlashcardConceptMappings).toHaveLength(60)

    const activeIds = chapter20PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter20FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(new Set(mappedIds).size).toBe(60)
    expect([...mappedIds].sort()).toEqual([...activeIds].sort())

    const counts = Object.fromEntries(
      ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS.map((conceptId) => [
        conceptId,
        chapter20FlashcardConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptId).length,
      ]),
    )
    expect(Object.values(counts)).toEqual([10, 10, 10, 10, 10, 10])
  })

  it('maps all 17 active assessment questions exactly once by current meaning', () => {
    expect(chapter20PremiumQuizQuestions).toHaveLength(17)
    expect(chapter20QuizQuestionConceptMappings).toHaveLength(17)

    const activeIds = chapter20PremiumQuizQuestions.map((question) => question.id)
    const mappedIds = chapter20QuizQuestionConceptMappings.map((mapping) => mapping.questionId)

    expect(new Set(mappedIds).size).toBe(17)
    expect([...mappedIds].sort()).toEqual([...activeIds].sort())

    const byQuestionId = Object.fromEntries(
      chapter20QuizQuestionConceptMappings.map((mapping) => [
        mapping.questionId,
        mapping.conceptFamilyId,
      ]),
    )

    expect(byQuestionId).toEqual({
      'qq-20-01': 'ch20-professional-transition-workplace-expectations',
      'qq-20-02': 'ch20-professional-transition-workplace-expectations',
      'qq-20-03': 'ch20-professional-transition-workplace-expectations',
      'qq-20-04': 'ch20-teamwork-workplace-relationships',
      'qq-20-05': 'ch20-teamwork-workplace-relationships',
      'qq-20-06': 'ch20-teamwork-workplace-relationships',
      'qq-20-07': 'ch20-employment-classification-compensation',
      'qq-20-08': 'ch20-employment-classification-compensation',
      'qq-20-09': 'ch20-employment-classification-compensation',
      'qq-20-10': 'ch20-financial-responsibility-income-reporting',
      'qq-20-11': 'ch20-financial-responsibility-income-reporting',
      'qq-20-12': 'ch20-financial-responsibility-income-reporting',
      'qq-20-13': 'ch20-ethical-selling-retailing',
      'qq-20-14': 'ch20-ethical-selling-retailing',
      'qq-20-15': 'ch20-client-retention-marketing-consent',
      'qq-20-16': 'ch20-client-retention-marketing-consent',
      'qq-20-17': 'ch20-client-retention-marketing-consent',
    })
  })

  it('does not invent a bodily-safety concept where Chapter 20 has none', () => {
    expect(CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
  })

  it('keeps compliance-sensitive employment, finance, and client-consent concepts distinct from safety', () => {
    expect(CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch20-employment-classification-compensation',
      'ch20-financial-responsibility-income-reporting',
      'ch20-client-retention-marketing-consent',
    ])

    for (const conceptId of CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS) {
      expect(CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).not.toContain(conceptId)
    }
  })

  it('preserves the shared 20/10/40/15/15 grading contract', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })
})
