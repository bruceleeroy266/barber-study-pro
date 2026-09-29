import { describe, expect, it } from 'vitest'
import { chapter17PremiumContent } from '../chapter-17-premium'
import { chapter17PremiumFlashcards } from '../chapter-17-premium-flashcards'
import { chapter17PremiumQuizQuestions, chapter17LearningQuestions } from '../chapter-17-premium-quiz'
import {
  ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS,
  chapter17ConceptFamilies,
  chapter17LearningObjectives,
} from './concepts'
import {
  chapter17ContentConceptMappings,
  chapter17FlashcardConceptMappings,
  chapter17LearningQuestionConceptMappings,
  chapter17MicroCheckPlacements,
  chapter17QuizQuestionConceptMappings,
} from './mappings'
import {
  CHAPTER17_GRADE_WEIGHTS,
  calculateChapter17ConceptMastery,
  calculateChapter17Grade,
} from './grading'
import {
  getFlashcardEvidenceConcept,
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

describe('C17-1 canonical concept architecture and shared grading/evidence binding', () => {
  it('defines seven stable active concept families and seven architecture learning objectives', () => {
    expect(chapter17ConceptFamilies).toHaveLength(7)
    expect(chapter17LearningObjectives).toHaveLength(7)
    expect(ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS).toHaveLength(7)
    expect(new Set(ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS).size).toBe(7)
    expect(chapter17ConceptFamilies.every((concept) => concept.status === 'active')).toBe(true)
  })

  it('maps all 24 top-level lesson sections exactly once', () => {
    const runtimeIds = chapter17PremiumContent.sections.map((section) => section.id)
    const mappedIds = chapter17ContentConceptMappings.map((mapping) => mapping.contentBlockId)

    expect(runtimeIds).toHaveLength(24)
    expect(mappedIds).toHaveLength(24)
    expect(new Set(mappedIds).size).toBe(24)
    expect([...mappedIds].sort()).toEqual([...runtimeIds].sort())
  })

  it('maps all 60 flashcards exactly once through the shared evidence registry', () => {
    const runtimeIds = chapter17PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter17FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(runtimeIds).toHaveLength(60)
    expect(mappedIds).toHaveLength(60)
    expect(new Set(mappedIds).size).toBe(60)
    expect([...mappedIds].sort()).toEqual([...runtimeIds].sort())
    expect(mappedIds.every((id) => getFlashcardEvidenceConcept('ch-17', id) !== null)).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-17')).toHaveLength(60)
  })

  it('maps all 30 chapter-assessment questions exactly once and preserves 16 existing learning questions', () => {
    const assessmentIds = chapter17PremiumQuizQuestions.map((question) => question.id)
    const mappedAssessmentIds = chapter17QuizQuestionConceptMappings.map((mapping) => mapping.questionId)
    const learningIds = chapter17LearningQuestions.map((question) => question.id)
    const mappedLearningIds = chapter17LearningQuestionConceptMappings.map((mapping) => mapping.questionId)

    expect(assessmentIds).toHaveLength(30)
    expect(mappedAssessmentIds).toHaveLength(30)
    expect(new Set(mappedAssessmentIds).size).toBe(30)
    expect([...mappedAssessmentIds].sort()).toEqual([...assessmentIds].sort())

    expect(learningIds).toHaveLength(16)
    expect(mappedLearningIds).toHaveLength(16)
    expect(new Set(mappedLearningIds).size).toBe(16)
    expect([...mappedLearningIds].sort()).toEqual([...learningIds].sort())
  })

  it('gives every concept family lesson, flashcard, and assessment coverage', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS) {
      expect(chapter17ContentConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(chapter17FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(chapter17QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
    }
  })

  it('plans seven two-question micro-check placements, one per concept family', () => {
    expect(chapter17MicroCheckPlacements).toHaveLength(7)
    expect(new Set(chapter17MicroCheckPlacements.map((placement) => placement.id)).size).toBe(7)
    expect(new Set(chapter17MicroCheckPlacements.map((placement) => placement.conceptFamilyId))).toEqual(
      new Set(ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS),
    )
    expect(chapter17MicroCheckPlacements.every((placement) => placement.plannedQuestionCount === 2)).toBe(true)

    const runtimeIds = new Set(chapter17PremiumContent.sections.map((section) => section.id))
    expect(chapter17MicroCheckPlacements.every((placement) => runtimeIds.has(placement.afterSectionId))).toBe(true)
  })

  it('registers Chapter 17 as a unified activity-evidence chapter with its current scenario inventory', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-17')).toBe(true)
    expect(getScenarioEvidenceInventory('ch-17')).toHaveLength(1)
    expect(getScenarioEvidenceInventory('ch-17')).toEqual(['scenario-1:0'])
  })

  it('delegates grading and mastery to the unchanged shared 20/10/40/15/15 architecture', () => {
    expect(CHAPTER17_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
    expect(CHAPTER17_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const grade = calculateChapter17Grade({
      microCheckPercent: 100,
      flashcardPercent: 100,
      chapterAssessmentPercent: 100,
      scenarioApplicationPercent: 100,
      remediationReassessmentPercent: 100,
    })
    expect(grade.finalGrade).toBe(100)

    const mastery = calculateChapter17ConceptMastery([
      {
        studentId: 'student-c17',
        chapterId: 'ch-17',
        conceptFamilyId: 'ch17-chemistry-bond-transformation',
        source: 'chapter_assessment',
        itemId: 'qq-17-006',
        difficulty: 'application',
        correct: false,
        attemptPhase: 'initial',
        timestamp: '2026-09-29T17:00:00.000Z',
      },
    ], '2026-09-29T17:01:00.000Z')

    expect(mastery.initialMissCount).toBe(1)
  })
})
