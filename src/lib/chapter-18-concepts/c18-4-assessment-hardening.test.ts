import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter18PremiumFlashcards } from '../chapter-18-premium-flashcards'
import { chapter18PremiumQuizQuestions } from '../chapter-18-premium-quiz'
import {
  ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS,
  CHAPTER18_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter18FlashcardConceptMappings,
  chapter18QuizQuestionConceptMappings,
} from './mappings'
import { CHAPTER18_GRADE_WEIGHTS } from './grading'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const source = readFileSync(join(process.cwd(), 'src/lib/chapter-18-premium-quiz.ts'), 'utf8')

const expectedQuestionIds = Array.from(
  { length: 15 },
  (_, index) => `qq-18-${String(index + 1).padStart(2, '0')}`,
)

const expectedCorrectAnswers = {
  'qq-18-01': 'b',
  'qq-18-02': 'b',
  'qq-18-03': 'b',
  'qq-18-04': 'a',
  'qq-18-05': 'c',
  'qq-18-06': 'c',
  'qq-18-07': 'c',
  'qq-18-08': 'c',
  'qq-18-09': 'b',
  'qq-18-10': 'b',
  'qq-18-11': 'b',
  'qq-18-12': 'c',
  'qq-18-13': 'c',
  'qq-18-14': 'c',
  'qq-18-15': 'c',
} as const

const expectedConceptByQuestion = {
  'qq-18-01': 'ch18-analysis-structure',
  'qq-18-02': 'ch18-analysis-structure',
  'qq-18-03': 'ch18-color-theory',
  'qq-18-04': 'ch18-color-products',
  'qq-18-05': 'ch18-developers-lighteners-toners',
  'qq-18-06': 'ch18-color-theory',
  'qq-18-07': 'ch18-correction-gray-porosity',
  'qq-18-08': 'ch18-color-products',
  'qq-18-09': 'ch18-application-consultation-procedures',
  'qq-18-10': 'ch18-application-consultation-procedures',
  'qq-18-11': 'ch18-color-products',
  'qq-18-12': 'ch18-service-safety-chemical-handling',
  'qq-18-13': 'ch18-service-safety-chemical-handling',
  'qq-18-14': 'ch18-service-safety-chemical-handling',
  'qq-18-15': 'ch18-correction-gray-porosity',
} as const

describe('C18-4 assessment source-grounding and answer-key certification', () => {
  it('preserves the certified 50-card bank, seven concepts, safety flags, and shared grading', () => {
    expect(chapter18PremiumFlashcards).toHaveLength(50)
    expect(chapter18FlashcardConceptMappings).toHaveLength(50)
    expect(ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS).toHaveLength(7)
    expect(CHAPTER18_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch18-developers-lighteners-toners',
      'ch18-service-safety-chemical-handling',
    ])
    expect(CHAPTER18_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
  })

  it('preserves all 15 stable assessment IDs exactly once', () => {
    const ids = chapter18PremiumQuizQuestions.map((question) => question.id)

    expect(ids).toHaveLength(15)
    expect(ids).toEqual(expectedQuestionIds)
    expect(new Set(ids).size).toBe(15)
  })

  it('certifies the answer key for every hardened assessment item', () => {
    for (const question of chapter18PremiumQuizQuestions) {
      expect(question.correct_answer, question.id).toBe(
        expectedCorrectAnswers[question.id as keyof typeof expectedCorrectAnswers],
      )
    }
  })

  it('certifies every assessment question maps exactly once to the intended valid concept family', () => {
    expect(chapter18QuizQuestionConceptMappings).toHaveLength(15)
    expect(new Set(chapter18QuizQuestionConceptMappings.map((mapping) => mapping.questionId)).size).toBe(15)

    for (const mapping of chapter18QuizQuestionConceptMappings) {
      expect(ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
      expect(mapping.conceptFamilyId, mapping.questionId).toBe(
        expectedConceptByQuestion[mapping.questionId as keyof typeof expectedConceptByQuestion],
      )
    }
  })

  it('gives every question four distinct answer choices and a non-empty explanation', () => {
    for (const question of chapter18PremiumQuizQuestions) {
      const choices = [question.answer_a, question.answer_b, question.answer_c, question.answer_d]
      expect(choices.every((choice) => choice.trim().length > 0), question.id).toBe(true)
      expect(new Set(choices).size, question.id).toBe(4)
      expect(question.explanation.trim().length, question.id).toBeGreaterThan(40)
    }
  })

  it('removes unverified textbook page citations and legacy review-page claims', () => {
    expect(source).not.toMatch(/Review:.*\(p{1,2}\.\s*\d+/i)
    expect(source).not.toMatch(/\(pp?\.\s*\d+/i)
  })

  it('removes universal developer, porosity, gray-coverage, and lightener rules', () => {
    expect(source).not.toContain('20-volume developer is the standard for many permanent haircolor products')
    expect(source).not.toContain('one to two levels lighter than the desired result')
    expect(source).not.toContain('Demipermanent color only covers up to about 50 percent gray')
    expect(source).not.toContain('A single-process color cannot lift dark hair light enough')
    expect(source).toContain('lift and gray-coverage capability are system-dependent')
    expect(source).toContain('there is no universal rule to compensate')
    expect(source).toContain('avoid unapproved overlap')
  })

  it('repairs FDA/allergy-test language without asserting one universal timing law', () => {
    expect(source).not.toContain('A patch test for aniline derivative products must be done 24 to 48 hours before the service')
    expect(source).not.toContain('The law requires the 24- to 48-hour wait')
    expect(source).not.toContain('Federal law creates one universal 24–48-hour timing rule for every haircolor product')

    expect(source).toContain('FDA advises users and salons to perform a skin test before each hair-dye use')
    expect(source).toContain('qualifying coal-tar hair dyes have specific caution-label and preliminary-test requirements')
  })

  it('repairs facial-hair, compatibility, damaged-container, and tint-back safety logic', () => {
    expect(source).not.toContain('Do not use aniline derivative tints or metallic dyes on mustaches or beards')
    expect(source).not.toContain('Apply a color filler first')
    expect(source).not.toContain('Throw the bottle away. Do not open or use it.')

    expect(source).toContain('manufacturer expressly permits the intended beard or mustache application')
    expect(source).toContain('Do not use the compromised product')
    expect(source).toContain('manufacturer-supported tint-back, filler, or equalization strategy')
  })

  it('keeps all seven concepts represented in the 15-question assessment bank', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS) {
      expect(
        chapter18QuizQuestionConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        conceptFamilyId,
      ).toBe(true)
    }
  })
})
