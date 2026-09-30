import { describe, expect, it } from 'vitest'
import { chapter19PremiumFlashcards } from '../chapter-19-premium-flashcards'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import {
  ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS,
  CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
  chapter19ConceptFamilies,
  chapter19LearningObjectives,
} from './concepts'
import {
  chapter19FlashcardConceptMappings,
  chapter19LessonSectionConceptMappings,
  chapter19QuizQuestionConceptMappings,
} from './mappings'

describe('C19-1 canonical concept architecture certification', () => {
  it('freezes exactly seven active concept families and seven canonical learning objectives', () => {
    expect(chapter19ConceptFamilies).toHaveLength(7)
    expect(ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS).toHaveLength(7)
    expect(new Set(ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS).size).toBe(7)

    expect(chapter19LearningObjectives).toHaveLength(7)
    expect(new Set(chapter19LearningObjectives.map((objective) => objective.id)).size).toBe(7)
  })

  it('gives every canonical concept semantic lesson coverage', () => {
    const covered = new Set(
      chapter19LessonSectionConceptMappings.flatMap((mapping) => mapping.conceptFamilyIds),
    )

    for (const conceptId of ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS) {
      expect(covered.has(conceptId), conceptId).toBe(true)
    }
  })

  it('maps all 60 active flashcards exactly once', () => {
    expect(chapter19PremiumFlashcards).toHaveLength(60)
    expect(chapter19FlashcardConceptMappings).toHaveLength(60)

    const activeIds = chapter19PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter19FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(new Set(mappedIds).size).toBe(60)
    expect([...mappedIds].sort()).toEqual([...activeIds].sort())

    for (const mapping of chapter19FlashcardConceptMappings) {
      expect(ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
    }
  })

  it('maps all 15 active assessment questions exactly once by current question meaning', () => {
    expect(chapter19PremiumQuizQuestions).toHaveLength(15)
    expect(chapter19QuizQuestionConceptMappings).toHaveLength(15)

    const activeIds = chapter19PremiumQuizQuestions.map((question) => question.id)
    const mappedIds = chapter19QuizQuestionConceptMappings.map((mapping) => mapping.questionId)

    expect(new Set(mappedIds).size).toBe(15)
    expect([...mappedIds].sort()).toEqual([...activeIds].sort())

    const byQuestionId = Object.fromEntries(
      chapter19QuizQuestionConceptMappings.map((mapping) => [
        mapping.questionId,
        mapping.conceptFamilyId,
      ]),
    )

    expect(byQuestionId).toMatchObject({
      'qq-19-01': 'ch19-licensing-requirements-verification',
      'qq-19-02': 'ch19-exam-preparation-test-reasoning',
      'qq-19-03': 'ch19-practical-exam-safety-readiness',
      'qq-19-04': 'ch19-employment-readiness-professionalism',
      'qq-19-05': 'ch19-employment-readiness-professionalism',
      'qq-19-06': 'ch19-employment-readiness-professionalism',
      'qq-19-07': 'ch19-resume-portfolio-application-materials',
      'qq-19-08': 'ch19-resume-portfolio-application-materials',
      'qq-19-09': 'ch19-resume-portfolio-application-materials',
      'qq-19-10': 'ch19-job-search-shop-research-interview',
      'qq-19-11': 'ch19-job-search-shop-research-interview',
      'qq-19-12': 'ch19-job-search-shop-research-interview',
      'qq-19-13': 'ch19-job-search-shop-research-interview',
      'qq-19-14': 'ch19-employment-law-contracts-compliance',
      'qq-19-15': 'ch19-employment-law-contracts-compliance',
    })
  })

  it('keeps urgent safety separate from compliance/legal criticality', () => {
    expect(CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-practical-exam-safety-readiness',
    ])

    expect(CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch19-licensing-requirements-verification',
      'ch19-employment-law-contracts-compliance',
    ])

    for (const conceptId of CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS) {
      expect(CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).not.toContain(conceptId)
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

  it('does not use legacy remediation IDs as canonical architecture inputs', () => {
    const serialized = JSON.stringify({
      lesson: chapter19LessonSectionConceptMappings,
      flashcards: chapter19FlashcardConceptMappings,
      assessment: chapter19QuizQuestionConceptMappings,
    })

    expect(serialized).not.toMatch(/CH19-R-qq-19|CH19-R-LO[123]/)
  })
})
