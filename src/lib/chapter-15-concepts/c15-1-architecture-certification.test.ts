import { describe, expect, it } from 'vitest'
import { chapter15PremiumContent } from '../chapter-15-premium'
import { chapter15PremiumFlashcards } from '../chapter-15-premium-flashcards'
import { chapter15PremiumQuizQuestions } from '../chapter-15-premium-quiz'
import {
  ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS,
  chapter15LearningObjectives,
} from './concepts'
import {
  chapter15ContentConceptMappings,
  chapter15FlashcardConceptMappings,
  chapter15MicroCheckPlacements,
  chapter15QuizQuestionConceptMappings,
} from './mappings'
import {
  CHAPTER15_GRADE_WEIGHTS,
  calculateChapter15ConceptMastery,
  calculateChapter15Grade,
} from './grading'
import {
  getFlashcardEvidenceConcept,
  getFlashcardEvidenceInventory,
  getScenarioEvidenceConcept,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

describe('C15-1 canonical concept architecture and shared grading', () => {
  it('defines seven learning objectives and seven stable concept families', () => {
    expect(chapter15LearningObjectives).toHaveLength(7)
    expect(ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS).toHaveLength(7)
    expect(new Set(ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS).size).toBe(7)
  })

  it('maps every current top-level lesson section exactly once', () => {
    const sectionIds = chapter15PremiumContent.sections.map((section) => section.id)
    const mappedIds = chapter15ContentConceptMappings.map((mapping) => mapping.contentBlockId)

    expect(sectionIds).toHaveLength(54)
    expect(mappedIds).toHaveLength(54)
    expect(new Set(mappedIds).size).toBe(54)
    expect([...mappedIds].sort()).toEqual([...sectionIds].sort())
  })

  it('maps all 90 Chapter 15 flashcards exactly once', () => {
    const flashcardIds = chapter15PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter15FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(flashcardIds).toHaveLength(90)
    expect(mappedIds).toHaveLength(90)
    expect(new Set(mappedIds).size).toBe(90)
    expect([...mappedIds].sort()).toEqual([...flashcardIds].sort())

    for (const id of flashcardIds) {
      expect(getFlashcardEvidenceConcept('ch-15', id), id).not.toBeNull()
    }
  })

  it('maps all 72 Chapter 15 assessment questions exactly once', () => {
    const questionIds = chapter15PremiumQuizQuestions.map((question) => question.id)
    const mappedIds = chapter15QuizQuestionConceptMappings.map((mapping) => mapping.questionId)

    expect(questionIds).toHaveLength(72)
    expect(mappedIds).toHaveLength(72)
    expect(new Set(mappedIds).size).toBe(72)
    expect([...mappedIds].sort()).toEqual([...questionIds].sort())
  })

  it('gives every active concept lesson, flashcard, and assessment coverage', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS) {
      expect(
        chapter15ContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        `${conceptFamilyId} lesson coverage`,
      ).toBe(true)
      expect(
        chapter15FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        `${conceptFamilyId} flashcard coverage`,
      ).toBe(true)
      expect(
        chapter15QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        `${conceptFamilyId} assessment coverage`,
      ).toBe(true)
    }
  })

  it('defines one planned two-question micro-check placement per concept family', () => {
    expect(chapter15MicroCheckPlacements).toHaveLength(7)
    expect(chapter15MicroCheckPlacements.every((placement) => placement.plannedQuestionCount === 2)).toBe(true)
    expect(new Set(chapter15MicroCheckPlacements.map((placement) => placement.conceptFamilyId))).toEqual(
      new Set(ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS),
    )
  })

  it('registers Chapter 15 flashcard and scenario evidence in the shared durable activity registry', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-15')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-15')).toHaveLength(90)

    const scenarioIds = getScenarioEvidenceInventory('ch-15')
    expect(scenarioIds).toHaveLength(5)

    for (const itemId of scenarioIds) {
      const [sectionId, rawIndex] = itemId.split(':')
      const expected = chapter15ContentConceptMappings.find(
        (mapping) => mapping.contentBlockId === sectionId,
      )?.conceptFamilyId

      expect(expected, itemId).toBeDefined()
      expect(getScenarioEvidenceConcept('ch-15', sectionId, Number(rawIndex)), itemId).toBe(expected)
    }
  })

  it('inherits the shared 20/10/40/15/15 grade contract', () => {
    expect(CHAPTER15_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
    expect(CHAPTER15_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const grade = calculateChapter15Grade({
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

  it('delegates Chapter 15 concept mastery to the shared mastery engine', () => {
    const result = calculateChapter15ConceptMastery(
      [
        {
          studentId: 'student-c15',
          chapterId: 'ch-15',
          conceptFamilyId: 'ch15-attachment-methods-bonding',
          source: 'chapter_assessment',
          itemId: 'qq-15-038',
          difficulty: 'understanding',
          correct: false,
          attemptPhase: 'initial',
          timestamp: '2026-09-29T03:20:00.000Z',
        },
        {
          studentId: 'student-c15',
          chapterId: 'ch-15',
          conceptFamilyId: 'ch15-attachment-methods-bonding',
          source: 'scenario_application',
          itemId: 'attachment-scenario:0',
          difficulty: 'scenario',
          correct: true,
          attemptPhase: 'initial',
          timestamp: '2026-09-29T03:25:00.000Z',
        },
      ],
      '2026-09-29T03:30:00.000Z',
    )

    expect(result.observationCount).toBe(2)
    expect(result.initialMissCount).toBe(1)
    expect(result.mastery).toBeGreaterThan(0)
    expect(result.mastery).toBeLessThan(100)
  })
})
