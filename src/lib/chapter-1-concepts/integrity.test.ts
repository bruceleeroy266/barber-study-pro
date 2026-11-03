import { describe, expect, it } from 'vitest'
import {
  ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS,
  CHAPTER1_CONCEPT_FAMILY_IDS,
  chapter1ConceptFamilies,
  chapter1LearningObjectives,
} from './concepts'
import {
  chapter1ContentConceptMappings,
  chapter1FlashcardConceptMappings,
  chapter1QuizQuestionConceptMappings,
  chapter1ReassessmentQuestionConceptMappings,
} from './mappings'
import { chapter1MicroChecks } from './micro-checks'
import { chapter1PremiumQuizQuestions } from '../chapter-1-premium-quiz'
import { chapter1PremiumFlashcards } from '../chapter-1-premium-flashcards'
import { chapter1ReassessmentQuestions } from '../chapter-1-reassessment-questions'
import { getChapterContent } from '../chapter-content'

describe('Chapter 1 concept architecture integrity', () => {
  it('locks five objectives and five canonical concept families', () => {
    expect(chapter1LearningObjectives).toHaveLength(5)
    expect(chapter1ConceptFamilies).toHaveLength(5)
    expect(CHAPTER1_CONCEPT_FAMILY_IDS).toHaveLength(5)
    expect(ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS).toHaveLength(5)
    expect(new Set(ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS).size).toBe(5)
  })

  it('keeps objective and family references bidirectionally valid', () => {
    const concepts = new Map(chapter1ConceptFamilies.map((x) => [x.id, x]))
    const objectives = new Map(chapter1LearningObjectives.map((x) => [x.id, x]))
    for (const objective of chapter1LearningObjectives)
      for (const id of objective.conceptFamilyIds) expect(concepts.has(id)).toBe(true)
    for (const concept of chapter1ConceptFamilies) {
      expect(objectives.has(concept.learningObjectiveId)).toBe(true)
      expect(concept.learningObjectiveIds).toContain(concept.learningObjectiveId)
      for (const id of concept.learningObjectiveIds)
        expect(chapter1LearningObjectives.find((x) => x.id === id)?.conceptFamilyIds).toContain(concept.id)
    }
  })

  it('maps all 30 quiz questions exactly once with no orphan IDs', () => {
    expect(chapter1PremiumQuizQuestions).toHaveLength(30)
    expect(chapter1QuizQuestionConceptMappings).toHaveLength(30)
    expect(new Set(chapter1QuizQuestionConceptMappings.map((x) => x.questionId)).size).toBe(30)
    const served = new Set(chapter1PremiumQuizQuestions.map((q) => q.id))
    for (const mapping of chapter1QuizQuestionConceptMappings) {
      expect(served.has(mapping.questionId)).toBe(true)
      expect(ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
    }
    for (const question of chapter1PremiumQuizQuestions)
      expect(chapter1QuizQuestionConceptMappings.find((x) => x.questionId === question.id)).toBeDefined()
  })

  it('locks the per-family quiz question distribution (incl. the qq-1-015 licensing correction)', () => {
    // Distribution after ASCYN-QUIZ-ANALYTICS-10 Task A: qq-1-015 (barber-pole
    // display legality) moved to licensing-organizations; modern-profession keeps 2.
    const expected: Record<string, number> = {
      'ch1-origins-culture': 12,
      'ch1-barber-surgeons-symbols': 8,
      'ch1-tools-technology': 4,
      'ch1-licensing-organizations': 4,
      'ch1-modern-profession': 2,
    }
    for (const id of ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS) {
      const count = chapter1QuizQuestionConceptMappings.filter((x) => x.conceptFamilyId === id).length
      expect(count, `family ${id}`).toBe(expected[id])
    }
  })

  it('keeps qq-1-015 (legal display of the barber pole) under licensing-organizations', () => {
    const mapping = chapter1QuizQuestionConceptMappings.find((x) => x.questionId === 'qq-1-015')
    expect(mapping?.conceptFamilyId).toBe('ch1-licensing-organizations')
  })

  it('keeps the 75-question reassessment reserve fully mapped with no orphans', () => {
    expect(chapter1ReassessmentQuestions).toHaveLength(75)
    expect(chapter1ReassessmentQuestionConceptMappings).toHaveLength(75)
    expect(new Set(chapter1ReassessmentQuestionConceptMappings.map((x) => x.questionId)).size).toBe(75)
    const reserve = new Set(chapter1ReassessmentQuestions.map((q) => q.id))
    for (const mapping of chapter1ReassessmentQuestionConceptMappings) {
      expect(reserve.has(mapping.questionId)).toBe(true)
      expect(ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
    }
    for (const id of ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS) {
      const count = chapter1ReassessmentQuestionConceptMappings.filter((x) => x.conceptFamilyId === id).length
      expect(count, `family ${id} reserve depth`).toBe(15)
    }
  })

  it('maps all flashcards exactly once with no orphans', () => {
    expect(chapter1PremiumFlashcards.length).toBeGreaterThan(0)
    expect(chapter1FlashcardConceptMappings).toHaveLength(chapter1PremiumFlashcards.length)
    const served = new Set(chapter1PremiumFlashcards.map((f) => f.id))
    expect(new Set(chapter1FlashcardConceptMappings.map((x) => x.flashcardId)).size).toBe(
      chapter1FlashcardConceptMappings.length
    )
    for (const mapping of chapter1FlashcardConceptMappings) {
      expect(served.has(mapping.flashcardId)).toBe(true)
      expect(ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
    }
  })

  it('maps only existing lesson content blocks, with multiple mappings limited to the documented exception', () => {
    const content = getChapterContent(1)
    expect(content).not.toBeNull()
    const servedIds = new Set(
      Array.from(JSON.stringify(content).matchAll(/"id"\s*:\s*"([^"]+)"/g)).map((m) => m[1])
    )
    for (const mapping of chapter1ContentConceptMappings) {
      expect(servedIds.has(mapping.contentBlockId), `content block ${mapping.contentBlockId} is not served`).toBe(true)
      expect(ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
    }
    // DOCUMENTED exception (ASCYN-QUIZ-ANALYTICS-09): the 'shaving-beard-culture'
    // block legitimately spans both ancient customs and tool evolution. Any OTHER
    // content block mapped to more than one family fails this test.
    const DOCUMENTED_MULTI_MAPPED_BLOCKS = new Set(['shaving-beard-culture'])
    const blockIds = chapter1ContentConceptMappings.map((x) => x.contentBlockId)
    const duplicates = new Set(blockIds.filter((id, i) => blockIds.indexOf(id) !== i))
    expect(duplicates).toEqual(DOCUMENTED_MULTI_MAPPED_BLOCKS)
  })

  it('keeps every micro-check question bound to a valid active family', () => {
    expect(chapter1MicroChecks).toHaveLength(5)
    const questionIds = new Set<string>()
    const coveredFamilies = new Set<string>()
    for (const check of chapter1MicroChecks) {
      expect(ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS).toContain(check.conceptFamilyId)
      for (const question of check.questions) {
        expect(ACTIVE_CHAPTER1_CONCEPT_FAMILY_IDS).toContain(question.conceptFamilyId)
        expect(questionIds.has(question.id)).toBe(false)
        questionIds.add(question.id)
        coveredFamilies.add(question.conceptFamilyId)
      }
    }
    expect(coveredFamilies.size).toBe(5)
  })
})
