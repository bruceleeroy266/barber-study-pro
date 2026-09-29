import { describe, expect, it } from 'vitest'
import { chapter14PremiumContent } from '../chapter-14-premium'
import { chapter14PremiumFlashcards } from '../chapter-14-premium-flashcards'
import { chapter14PremiumQuizQuestions } from '../chapter-14-premium-quiz'
import {
  ACTIVE_CHAPTER14_CONCEPT_FAMILY_IDS,
  chapter14LearningObjectives,
} from './concepts'
import {
  chapter14ContentConceptMappings,
  chapter14FlashcardConceptMappings,
  chapter14QuizQuestionConceptMappings,
} from './mappings'
import {
  CHAPTER14_GRADE_WEIGHTS,
  calculateChapter14ConceptMastery,
  calculateChapter14Grade,
} from './grading'
import {
  getFlashcardEvidenceConcept,
  getFlashcardEvidenceInventory,
  getScenarioEvidenceConcept,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

describe('C14-1 canonical concept architecture and shared grading', () => {
  it('defines seven learning objectives and seven stable concept families', () => {
    expect(chapter14LearningObjectives).toHaveLength(7)
    expect(ACTIVE_CHAPTER14_CONCEPT_FAMILY_IDS).toHaveLength(7)
    expect(new Set(ACTIVE_CHAPTER14_CONCEPT_FAMILY_IDS).size).toBe(7)
  })

  it('maps every current top-level lesson section exactly once', () => {
    const sectionIds = chapter14PremiumContent.sections.map((section) => section.id)
    const mappedIds = chapter14ContentConceptMappings.map((mapping) => mapping.contentBlockId)

    expect(sectionIds).toHaveLength(64)
    expect(mappedIds).toHaveLength(64)
    expect(new Set(mappedIds).size).toBe(64)
    expect([...mappedIds].sort()).toEqual([...sectionIds].sort())
  })

  it('maps all 112 Chapter 14 flashcards exactly once', () => {
    const flashcardIds = chapter14PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter14FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(flashcardIds).toHaveLength(112)
    expect(mappedIds).toHaveLength(112)
    expect(new Set(mappedIds).size).toBe(112)
    expect([...mappedIds].sort()).toEqual([...flashcardIds].sort())

    for (const id of flashcardIds) {
      expect(getFlashcardEvidenceConcept('ch-14', id), id).not.toBeNull()
    }
  })

  it('maps all 70 Chapter 14 assessment questions exactly once', () => {
    const questionIds = chapter14PremiumQuizQuestions.map((question) => question.id)
    const mappedIds = chapter14QuizQuestionConceptMappings.map((mapping) => mapping.questionId)

    expect(questionIds).toHaveLength(70)
    expect(mappedIds).toHaveLength(70)
    expect(new Set(mappedIds).size).toBe(70)
    expect([...mappedIds].sort()).toEqual([...questionIds].sort())
  })

  it('gives every active concept lesson, flashcard, and assessment coverage', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER14_CONCEPT_FAMILY_IDS) {
      expect(
        chapter14ContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        `${conceptFamilyId} lesson coverage`,
      ).toBe(true)
      expect(
        chapter14FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        `${conceptFamilyId} flashcard coverage`,
      ).toBe(true)
      expect(
        chapter14QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        `${conceptFamilyId} assessment coverage`,
      ).toBe(true)
    }
  })

  it('registers Chapter 14 flashcard and application evidence in the shared durable activity registry', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-14')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-14')).toHaveLength(112)

    const scenarioIds = getScenarioEvidenceInventory('ch-14')
    expect(scenarioIds).toHaveLength(4)

    for (const itemId of scenarioIds) {
      const [sectionId, rawIndex] = itemId.split(':')
      const expected = chapter14ContentConceptMappings.find(
        (mapping) => mapping.contentBlockId === sectionId,
      )?.conceptFamilyId

      expect(expected, itemId).toBeDefined()
      expect(getScenarioEvidenceConcept('ch-14', sectionId, Number(rawIndex)), itemId).toBe(expected)
    }
  })

  it('inherits the shared 20/10/40/15/15 grade contract', () => {
    expect(CHAPTER14_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
    expect(CHAPTER14_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const grade = calculateChapter14Grade({
      microCheckPercent: 80,
      flashcardPercent: 90,
      chapterAssessmentPercent: 70,
      scenarioApplicationPercent: 60,
      remediationReassessmentPercent: 100,
    })

    expect(grade.componentWeights).toBe(SHARED_GRADE_WEIGHTS)
    expect(grade.recoveryApplied).toBe(true)
    expect(grade.finalGrade).toBeGreaterThanOrEqual(grade.baseGrade)
  })

  it('delegates Chapter 14 concept mastery to the shared mastery engine', () => {
    const result = calculateChapter14ConceptMastery(
      [
        {
          studentId: 'student-c14',
          chapterId: 'ch-14',
          conceptFamilyId: 'ch14-cutting-geometry-guides',
          source: 'chapter_assessment',
          itemId: 'qq-14-028',
          difficulty: 'understanding',
          correct: false,
          attemptPhase: 'initial',
          timestamp: '2026-09-28T14:00:00.000Z',
        },
        {
          studentId: 'student-c14',
          chapterId: 'ch-14',
          conceptFamilyId: 'ch14-cutting-geometry-guides',
          source: 'scenario_application',
          itemId: 'consultation-scenario-1:0',
          difficulty: 'scenario',
          correct: true,
          attemptPhase: 'initial',
          timestamp: '2026-09-28T14:05:00.000Z',
        },
      ],
      '2026-09-28T14:10:00.000Z',
    )

    expect(result.observationCount).toBe(2)
    expect(result.initialMissCount).toBe(1)
    expect(result.mastery).toBeGreaterThan(0)
    expect(result.mastery).toBeLessThan(100)
  })
})
