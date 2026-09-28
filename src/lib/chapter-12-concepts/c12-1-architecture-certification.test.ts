import { describe, expect, it } from 'vitest'
import { chapter12PremiumContent } from '../chapter-12-premium'
import { chapter12PremiumFlashcards } from '../chapter-12-premium-flashcards'
import { chapter12PremiumQuizQuestions } from '../chapter-12-premium-quiz'
import {
  ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS,
  chapter12LearningObjectives,
} from './concepts'
import {
  chapter12ContentConceptMappings,
  chapter12FlashcardConceptMappings,
  chapter12QuizQuestionConceptMappings,
} from './mappings'
import {
  CHAPTER12_GRADE_WEIGHTS,
  calculateChapter12ConceptMastery,
  calculateChapter12Grade,
} from './grading'
import {
  getFlashcardEvidenceConcept,
  getFlashcardEvidenceInventory,
  getScenarioEvidenceConcept,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

describe('C12-1 canonical concept architecture and shared grading', () => {
  it('defines eight learning objectives and eight stable concept families', () => {
    expect(chapter12LearningObjectives).toHaveLength(8)
    expect(ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS).toHaveLength(8)
    expect(new Set(ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS).size).toBe(8)
  })

  it('maps every current top-level lesson section exactly once', () => {
    const sectionIds = chapter12PremiumContent.sections.map((section) => section.id)
    const mappedIds = chapter12ContentConceptMappings.map((mapping) => mapping.contentBlockId)

    expect(mappedIds).toHaveLength(sectionIds.length)
    expect(new Set(mappedIds).size).toBe(mappedIds.length)
    expect([...mappedIds].sort()).toEqual([...sectionIds].sort())
  })

  it('maps all 115 current Chapter 12 flashcards exactly once', () => {
    const flashcardIds = chapter12PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter12FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(flashcardIds).toHaveLength(115)
    expect(mappedIds).toHaveLength(115)
    expect(new Set(mappedIds).size).toBe(115)
    expect([...mappedIds].sort()).toEqual([...flashcardIds].sort())

    for (const id of flashcardIds) {
      expect(getFlashcardEvidenceConcept('ch-12', id), id).not.toBeNull()
    }
  })

  it('maps all 45 current Chapter 12 assessment questions exactly once', () => {
    const questionIds = chapter12PremiumQuizQuestions.map((question) => question.id)
    const mappedIds = chapter12QuizQuestionConceptMappings.map((mapping) => mapping.questionId)

    expect(questionIds).toHaveLength(45)
    expect(mappedIds).toHaveLength(45)
    expect(new Set(mappedIds).size).toBe(45)
    expect([...mappedIds].sort()).toEqual([...questionIds].sort())
  })

  it('registers Chapter 12 flashcard and application evidence in the shared durable activity registry', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-12')).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-12')).toHaveLength(115)

    const scenarioIds = getScenarioEvidenceInventory('ch-12')
    expect(scenarioIds.length).toBeGreaterThan(0)

    for (const itemId of scenarioIds) {
      const [sectionId, rawIndex] = itemId.split(':')
      expect(
        getScenarioEvidenceConcept('ch-12', sectionId, Number(rawIndex)),
        itemId,
      ).toBe('ch12-contraindications-service-safety')
    }
  })

  it('inherits the shared 20/10/40/15/15 grade contract without a Chapter 12-specific weighting system', () => {
    expect(CHAPTER12_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
    expect(CHAPTER12_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const grade = calculateChapter12Grade({
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

  it('delegates concept mastery to the shared mastery engine', () => {
    const result = calculateChapter12ConceptMastery(
      [
        {
          studentId: 'student-c12',
          chapterId: 'ch-12',
          conceptFamilyId: 'ch12-massage-principles-manipulations',
          source: 'chapter_assessment',
          itemId: 'qq-12-027',
          difficulty: 'understanding',
          correct: false,
          attemptPhase: 'initial',
          timestamp: '2026-09-28T05:00:00.000Z',
        },
        {
          studentId: 'student-c12',
          chapterId: 'ch-12',
          conceptFamilyId: 'ch12-massage-principles-manipulations',
          source: 'scenario_application',
          itemId: 'contraindications-safety:0',
          difficulty: 'scenario',
          correct: true,
          attemptPhase: 'initial',
          timestamp: '2026-09-28T05:05:00.000Z',
        },
      ],
      '2026-09-28T05:10:00.000Z',
    )

    expect(result.observationCount).toBe(2)
    expect(result.initialMissCount).toBe(1)
    expect(result.mastery).toBeGreaterThan(0)
    expect(result.mastery).toBeLessThan(100)
  })
})
