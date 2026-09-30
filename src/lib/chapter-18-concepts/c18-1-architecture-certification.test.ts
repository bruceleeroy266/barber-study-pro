import { describe, expect, it } from 'vitest'
import { chapter18PremiumContent } from '../chapter-18-premium'
import { chapter18PremiumFlashcards } from '../chapter-18-premium-flashcards'
import { chapter18PremiumQuizQuestions } from '../chapter-18-premium-quiz'
import {
  ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS,
  CHAPTER18_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
  chapter18ConceptFamilies,
  chapter18LearningObjectives,
} from './concepts'
import {
  chapter18ContentConceptMappings,
  chapter18FlashcardConceptMappings,
  chapter18LessonSectionConceptMappings,
  chapter18QuizQuestionConceptMappings,
} from './mappings'
import {
  CHAPTER18_GRADE_WEIGHTS,
  calculateChapter18ConceptMastery,
  calculateChapter18Grade,
} from './grading'
import {
  getFlashcardEvidenceConcept,
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
  isUnifiedActivityEvidenceChapter,
} from '../concept-mastery/activity-evidence-registry'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

describe('C18-1 canonical concept architecture and shared grading/evidence binding', () => {
  it('defines seven stable active concept families and seven architecture learning objectives', () => {
    expect(chapter18ConceptFamilies).toHaveLength(7)
    expect(chapter18LearningObjectives).toHaveLength(7)
    expect(ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS).toHaveLength(7)
    expect(new Set(ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS).size).toBe(7)
    expect(chapter18ConceptFamilies.every((concept) => concept.status === 'active')).toBe(true)
  })

  it('preserves the one-shell runtime lesson while mapping all ten logical instructional sections', () => {
    expect(chapter18PremiumContent.sections).toHaveLength(1)
    expect(chapter18PremiumContent.sections[0]?.id).toBe('chapter-18-lesson')
    expect(chapter18ContentConceptMappings).toEqual([
      { contentBlockId: 'chapter-18-lesson', conceptFamilyId: 'ch18-application-consultation-procedures' },
    ])
    expect(chapter18LessonSectionConceptMappings).toHaveLength(10)
    expect(new Set(chapter18LessonSectionConceptMappings.map((mapping) => mapping.lessonSectionKey)).size).toBe(10)
  })

  it('maps all 50 flashcards exactly once through the shared activity-evidence registry', () => {
    const runtimeIds = chapter18PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter18FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(runtimeIds).toHaveLength(50)
    expect(mappedIds).toHaveLength(50)
    expect(new Set(mappedIds).size).toBe(50)
    expect([...mappedIds].sort()).toEqual([...runtimeIds].sort())
    expect(mappedIds.every((id) => getFlashcardEvidenceConcept('ch-18', id) !== null)).toBe(true)
    expect(getFlashcardEvidenceInventory('ch-18')).toHaveLength(50)
  })

  it('maps all 15 existing chapter-assessment questions exactly once without rewriting them', () => {
    const runtimeIds = chapter18PremiumQuizQuestions.map((question) => question.id)
    const mappedIds = chapter18QuizQuestionConceptMappings.map((mapping) => mapping.questionId)

    expect(runtimeIds).toHaveLength(15)
    expect(mappedIds).toHaveLength(15)
    expect(new Set(mappedIds).size).toBe(15)
    expect([...mappedIds].sort()).toEqual([...runtimeIds].sort())
  })

  it('gives every concept family semantic lesson, flashcard, and assessment coverage', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS) {
      expect(chapter18LessonSectionConceptMappings.some((mapping) => mapping.conceptFamilyIds.includes(conceptFamilyId)), conceptFamilyId).toBe(true)
      expect(chapter18FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
      expect(chapter18QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId), conceptFamilyId).toBe(true)
    }
  })

  it('identifies only the inherited developer/lightener and service-safety families as safety-critical at C18-1', () => {
    expect(CHAPTER18_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch18-developers-lighteners-toners',
      'ch18-service-safety-chemical-handling',
    ])
    expect(chapter18ConceptFamilies.filter((concept) => concept.safetyCritical)).toHaveLength(2)
  })

  it('registers Chapter 18 as a unified activity-evidence chapter without inventing scenario inventory', () => {
    expect(isUnifiedActivityEvidenceChapter('ch-18')).toBe(true)
    expect(getScenarioEvidenceInventory('ch-18')).toEqual([])
  })

  it('delegates grading and mastery to the unchanged shared 20/10/40/15/15 architecture', () => {
    expect(CHAPTER18_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
    expect(CHAPTER18_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })

    const grade = calculateChapter18Grade({
      microCheckPercent: 100,
      flashcardPercent: 100,
      chapterAssessmentPercent: 100,
      scenarioApplicationPercent: 100,
      remediationReassessmentPercent: 100,
    })
    expect(grade.finalGrade).toBe(100)

    const mastery = calculateChapter18ConceptMastery([
      {
        studentId: 'student-c18',
        chapterId: 'ch-18',
        conceptFamilyId: 'ch18-service-safety-chemical-handling',
        source: 'chapter_assessment',
        itemId: 'qq-18-12',
        difficulty: 'application',
        correct: false,
        attemptPhase: 'initial',
        timestamp: '2026-09-29T20:00:00.000Z',
      },
    ], '2026-09-29T20:01:00.000Z')

    expect(mastery.initialMissCount).toBe(1)
  })
})
