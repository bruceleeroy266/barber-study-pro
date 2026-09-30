import { describe, expect, it } from 'vitest'
import { chapter16PremiumContent } from '../chapter-16-premium'
import { chapter16PremiumFlashcards } from '../chapter-16-premium-flashcards'
import { chapter16PremiumQuizQuestions } from '../chapter-16-premium-quiz'
import {
  ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS,
  chapter16LearningObjectives,
} from './concepts'
import {
  chapter16ContentConceptMappings,
  chapter16FlashcardConceptMappings,
  chapter16InstructionalSections,
  chapter16MicroCheckPlacements,
  chapter16QuizQuestionConceptMappings,
} from './mappings'
import {
  CHAPTER16_GRADE_WEIGHTS,
  calculateChapter16ConceptMastery,
  calculateChapter16Grade,
} from './grading'
import {
  getFlashcardEvidenceConcept,
  getFlashcardEvidenceInventory,
  getScenarioEvidenceConcept,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

describe('C16-1 canonical concept architecture and shared grading', () => {
  it('defines eight stable learning objectives and concept families', () => {
    expect(chapter16LearningObjectives).toHaveLength(8)
    expect(ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS).toHaveLength(8)
    expect(new Set(ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS).size).toBe(8)
  })

  it('maps all eleven instructional sections into the canonical concept architecture', () => {
    expect(chapter16InstructionalSections).toHaveLength(11)
    expect(chapter16InstructionalSections.map((section) => section.sectionNumber)).toEqual(
      Array.from({ length: 11 }, (_, index) => index + 1),
    )
    for (const section of chapter16InstructionalSections) {
      expect(ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS).toContain(section.conceptFamilyId)
    }
  })

  it('maps every current top-level Chapter 16 lesson block exactly once', () => {
    const sectionIds = chapter16PremiumContent.sections.map((section) => section.id)
    const mappedIds = chapter16ContentConceptMappings.map((mapping) => mapping.contentBlockId)

    expect(sectionIds).toHaveLength(93)
    expect(mappedIds).toHaveLength(93)
    expect(new Set(mappedIds).size).toBe(93)
    expect([...mappedIds].sort()).toEqual([...sectionIds].sort())
  })

  it('maps all 68 Chapter 16 flashcards exactly once', () => {
    const flashcardIds = chapter16PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter16FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(flashcardIds).toHaveLength(68)
    expect(mappedIds).toHaveLength(68)
    expect(new Set(mappedIds).size).toBe(68)
    expect([...mappedIds].sort()).toEqual([...flashcardIds].sort())

    for (const id of flashcardIds) {
      expect(getFlashcardEvidenceConcept('ch-16', id), id).not.toBeNull()
    }
  })

  it('maps all 30 Chapter 16 assessment questions exactly once', () => {
    const questionIds = chapter16PremiumQuizQuestions.map((question) => question.id)
    const mappedIds = chapter16QuizQuestionConceptMappings.map((mapping) => mapping.questionId)

    expect(questionIds).toHaveLength(30)
    expect(mappedIds).toHaveLength(30)
    expect(new Set(mappedIds).size).toBe(30)
    expect([...mappedIds].sort()).toEqual([...questionIds].sort())
  })

  it('gives every active concept lesson, flashcard, and assessment coverage', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS) {
      expect(
        chapter16ContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        `${conceptFamilyId} lesson coverage`,
      ).toBe(true)
      expect(
        chapter16FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        `${conceptFamilyId} flashcard coverage`,
      ).toBe(true)
      expect(
        chapter16QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        `${conceptFamilyId} assessment coverage`,
      ).toBe(true)
    }
  })

  it('defines one planned two-question micro-check placement per concept family', () => {
    expect(chapter16MicroCheckPlacements).toHaveLength(8)
    expect(chapter16MicroCheckPlacements.every((placement) => placement.plannedQuestionCount === 2)).toBe(true)
    expect(new Set(chapter16MicroCheckPlacements.map((placement) => placement.conceptFamilyId))).toEqual(
      new Set(ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS),
    )
  })

  it('registers Chapter 16 flashcard and scenario evidence in the shared durable activity registry', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-16')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-16')).toHaveLength(68)

    const scenarioIds = getScenarioEvidenceInventory('ch-16')
    expect(scenarioIds).toHaveLength(7)

    for (const itemId of scenarioIds) {
      const [sectionId, rawIndex] = itemId.split(':')
      const expected = chapter16ContentConceptMappings.find(
        (mapping) => mapping.contentBlockId === sectionId,
      )?.conceptFamilyId

      expect(expected, itemId).toBeDefined()
      expect(getScenarioEvidenceConcept('ch-16', sectionId, Number(rawIndex)), itemId).toBe(expected)
    }
  })

  it('inherits the shared 20/10/40/15/15 grade contract', () => {
    expect(CHAPTER16_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
    expect(CHAPTER16_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const grade = calculateChapter16Grade({
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

  it('delegates Chapter 16 concept mastery to the shared mastery engine', () => {
    const result = calculateChapter16ConceptMastery(
      [
        {
          studentId: 'student-c16',
          chapterId: 'ch-16',
          conceptFamilyId: 'ch16-advanced-techniques-texturizing',
          source: 'chapter_assessment',
          itemId: 'qq-16-022',
          difficulty: 'understanding',
          correct: false,
          attemptPhase: 'initial',
          timestamp: '2026-09-29T04:00:00.000Z',
        },
        {
          studentId: 'student-c16',
          chapterId: 'ch-16',
          conceptFamilyId: 'ch16-advanced-techniques-texturizing',
          source: 'scenario_application',
          itemId: 'advanced-techniques-scenario:0',
          difficulty: 'scenario',
          correct: true,
          attemptPhase: 'initial',
          timestamp: '2026-09-29T04:05:00.000Z',
        },
      ],
      '2026-09-29T04:10:00.000Z',
    )

    expect(result.observationCount).toBe(2)
    expect(result.initialMissCount).toBe(1)
    expect(result.mastery).toBeGreaterThan(0)
    expect(result.mastery).toBeLessThan(100)
  })
})
