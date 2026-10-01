import { describe, expect, it } from 'vitest'
import { chapter21PremiumFlashcards } from '../chapter-21-premium-flashcards'
import { chapter21PremiumQuizQuestions } from '../chapter-21-premium-quiz'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import {
  ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS,
  CHAPTER21_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
  chapter21ConceptFamilies,
  chapter21LearningObjectives,
} from './concepts'
import {
  chapter21FlashcardConceptMappings,
  chapter21LessonSectionConceptMappings,
  chapter21MicroCheckPlacements,
  chapter21QuizQuestionConceptMappings,
} from './mappings'

describe('C21-1 canonical concept architecture certification', () => {
  it('freezes exactly eight active concept families and eight canonical learning objectives', () => {
    expect(chapter21ConceptFamilies).toHaveLength(8)
    expect(ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS).toHaveLength(8)
    expect(new Set(ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS).size).toBe(8)

    expect(chapter21LearningObjectives.map((objective) => objective.id)).toEqual([
      'LO-21-01',
      'LO-21-02',
      'LO-21-03',
      'LO-21-04',
      'LO-21-05',
      'LO-21-06',
      'LO-21-07',
      'LO-21-08',
    ])
  })

  it('gives every canonical concept real lesson-section coverage', () => {
    const covered = new Set(
      chapter21LessonSectionConceptMappings.flatMap(
        (mapping) => mapping.conceptFamilyIds,
      ),
    )

    for (const conceptId of ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS) {
      expect(covered.has(conceptId), conceptId).toBe(true)
    }

    expect(
      chapter21LessonSectionConceptMappings.map(
        (mapping) => mapping.lessonSectionId,
      ),
    ).toEqual([
      'chapter-21-introduction',
      'ch21-lo1',
      'ch21-lo2',
      'ch21-lo3',
      'ch21-lo4',
      'ch21-lo5',
      'ch21-lo6',
      'ch21-lo7',
      'ch21-lo8',
    ])
  })

  it('maps all 60 active flashcards exactly once by current meaning', () => {
    expect(chapter21PremiumFlashcards).toHaveLength(60)
    expect(chapter21FlashcardConceptMappings).toHaveLength(60)

    const activeIds = chapter21PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter21FlashcardConceptMappings.map(
      (mapping) => mapping.flashcardId,
    )

    expect(new Set(mappedIds).size).toBe(60)
    expect([...mappedIds].sort()).toEqual([...activeIds].sort())

    const counts = ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS.map(
      (conceptFamilyId) =>
        chapter21FlashcardConceptMappings.filter(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ).length,
    )

    expect(counts).toEqual([5, 5, 10, 10, 5, 5, 10, 10])
  })

  it('maps all 17 active assessment questions exactly once', () => {
    expect(chapter21PremiumQuizQuestions).toHaveLength(17)
    expect(chapter21QuizQuestionConceptMappings).toHaveLength(17)

    const activeIds = chapter21PremiumQuizQuestions.map(
      (question) => question.id,
    )
    const mappedIds = chapter21QuizQuestionConceptMappings.map(
      (mapping) => mapping.questionId,
    )

    expect(new Set(mappedIds).size).toBe(17)
    expect([...mappedIds].sort()).toEqual([...activeIds].sort())

    expect(
      Object.fromEntries(
        chapter21QuizQuestionConceptMappings.map((mapping) => [
          mapping.questionId,
          mapping.conceptFamilyId,
        ]),
      ),
    ).toEqual({
      'qq-21-01': 'ch21-business-entry-paths',
      'qq-21-02': 'ch21-business-entry-paths',
      'qq-21-03': 'ch21-shop-opening-planning',
      'qq-21-04': 'ch21-ownership-legal-structures',
      'qq-21-05': 'ch21-ownership-legal-structures',
      'qq-21-06':
        'ch21-booth-rental-independent-business-responsibilities',
      'qq-21-07': 'ch21-business-plan-financial-planning',
      'qq-21-08': 'ch21-business-plan-financial-planning',
      'qq-21-09': 'ch21-recordkeeping-financial-compliance',
      'qq-21-10': 'ch21-recordkeeping-financial-compliance',
      'qq-21-11':
        'ch21-booth-rental-independent-business-responsibilities',
      'qq-21-12': 'ch21-shop-operations-management',
      'qq-21-13': 'ch21-shop-operations-management',
      'qq-21-14': 'ch21-advertising-marketing-client-consent',
      'qq-21-15': 'ch21-advertising-marketing-client-consent',
      'qq-21-16': 'ch21-advertising-marketing-client-consent',
      'qq-21-17': 'ch21-shop-opening-planning',
    })
  })

  it('keeps all compliance-critical business concepts separate from bodily safety', () => {
    expect(CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])

    expect(
      CHAPTER21_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
    ).toEqual([
      'ch21-shop-opening-planning',
      'ch21-ownership-legal-structures',
      'ch21-recordkeeping-financial-compliance',
      'ch21-booth-rental-independent-business-responsibilities',
      'ch21-advertising-marketing-client-consent',
    ])

    for (const conceptId of CHAPTER21_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS) {
      expect(CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).not.toContain(
        conceptId,
      )
    }
  })

  it('reserves two future micro-check questions after each matching LO', () => {
    expect(chapter21MicroCheckPlacements).toHaveLength(8)
    expect(
      chapter21MicroCheckPlacements.reduce(
        (sum, placement) => sum + placement.plannedQuestionCount,
        0,
      ),
    ).toBe(16)
    expect(
      chapter21MicroCheckPlacements.map(
        (placement) => placement.afterSectionId,
      ),
    ).toEqual([
      'ch21-lo1',
      'ch21-lo2',
      'ch21-lo3',
      'ch21-lo4',
      'ch21-lo5',
      'ch21-lo6',
      'ch21-lo7',
      'ch21-lo8',
    ])
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
