import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter20PremiumFlashcards } from '../chapter-20-premium-flashcards'
import { chapter20PremiumQuizQuestions } from '../chapter-20-premium-quiz'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import {
  ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS,
  CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter20FlashcardConceptMappings,
  chapter20QuizQuestionConceptMappings,
} from './mappings'

const source = readFileSync(
  join(process.cwd(), 'src/lib/chapter-20-premium-quiz.ts'),
  'utf8',
)

const demoSource = readFileSync(
  join(process.cwd(), 'src/lib/demo-data.ts'),
  'utf8',
)

const expectedQuestionIds = Array.from(
  { length: 17 },
  (_, index) => `qq-20-${String(index + 1).padStart(2, '0')}`,
)

const expectedStandardIds = Array.from(
  { length: 17 },
  (_, index) => `CH20-Q${String(index + 1).padStart(2, '0')}`,
)

const expectedLearningObjectiveByQuestion = {
  'qq-20-01': 'LO-20-01',
  'qq-20-02': 'LO-20-01',
  'qq-20-03': 'LO-20-01',
  'qq-20-04': 'LO-20-02',
  'qq-20-05': 'LO-20-02',
  'qq-20-06': 'LO-20-02',
  'qq-20-07': 'LO-20-03',
  'qq-20-08': 'LO-20-03',
  'qq-20-09': 'LO-20-03',
  'qq-20-10': 'LO-20-04',
  'qq-20-11': 'LO-20-04',
  'qq-20-12': 'LO-20-04',
  'qq-20-13': 'LO-20-05',
  'qq-20-14': 'LO-20-05',
  'qq-20-15': 'LO-20-06',
  'qq-20-16': 'LO-20-06',
  'qq-20-17': 'LO-20-06',
} as const

const expectedConceptByQuestion = {
  'qq-20-01': 'ch20-professional-transition-workplace-expectations',
  'qq-20-02': 'ch20-professional-transition-workplace-expectations',
  'qq-20-03': 'ch20-professional-transition-workplace-expectations',
  'qq-20-04': 'ch20-teamwork-workplace-relationships',
  'qq-20-05': 'ch20-teamwork-workplace-relationships',
  'qq-20-06': 'ch20-teamwork-workplace-relationships',
  'qq-20-07': 'ch20-employment-classification-compensation',
  'qq-20-08': 'ch20-employment-classification-compensation',
  'qq-20-09': 'ch20-employment-classification-compensation',
  'qq-20-10': 'ch20-financial-responsibility-income-reporting',
  'qq-20-11': 'ch20-financial-responsibility-income-reporting',
  'qq-20-12': 'ch20-financial-responsibility-income-reporting',
  'qq-20-13': 'ch20-ethical-selling-retailing',
  'qq-20-14': 'ch20-ethical-selling-retailing',
  'qq-20-15': 'ch20-client-retention-marketing-consent',
  'qq-20-16': 'ch20-client-retention-marketing-consent',
  'qq-20-17': 'ch20-client-retention-marketing-consent',
} as const

describe('C20-4 assessment hardening and mapping certification', () => {
  it('preserves the hardened 60-card bank, six concepts, and shared grading', () => {
    expect(chapter20PremiumFlashcards).toHaveLength(60)
    expect(chapter20FlashcardConceptMappings).toHaveLength(60)
    expect(ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS).toHaveLength(6)
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('preserves all 17 stable assessment IDs, standard IDs, order indexes, and quiz assignment', () => {
    expect(chapter20PremiumQuizQuestions).toHaveLength(17)
    expect(chapter20PremiumQuizQuestions.map((question) => question.id)).toEqual(expectedQuestionIds)
    expect(chapter20PremiumQuizQuestions.map((question) => question.standardId)).toEqual(expectedStandardIds)
    expect(chapter20PremiumQuizQuestions.map((question) => question.order_index)).toEqual(
      Array.from({ length: 17 }, (_, index) => index + 1),
    )
    expect(chapter20PremiumQuizQuestions.every((question) => question.quiz_id === 'quiz-20')).toBe(true)
    expect(new Set(chapter20PremiumQuizQuestions.map((question) => question.id)).size).toBe(17)
  })

  it('replaces legacy CH20-LO metadata with canonical LO-20-01 through LO-20-06', () => {
    for (const question of chapter20PremiumQuizQuestions) {
      expect(question.learningObjective, question.id).toBe(
        expectedLearningObjectiveByQuestion[
          question.id as keyof typeof expectedLearningObjectiveByQuestion
        ],
      )
    }
    expect(source).not.toMatch(/learningObjective:\s*['"]CH20-LO0[1-6]['"]/)
  })

  it('certifies every question maps exactly once to the intended concept family', () => {
    expect(chapter20QuizQuestionConceptMappings).toHaveLength(17)
    expect(new Set(chapter20QuizQuestionConceptMappings.map((mapping) => mapping.questionId)).size).toBe(17)

    for (const mapping of chapter20QuizQuestionConceptMappings) {
      expect(ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
      expect(mapping.conceptFamilyId, mapping.questionId).toBe(
        expectedConceptByQuestion[
          mapping.questionId as keyof typeof expectedConceptByQuestion
        ],
      )
    }
  })

  it('keeps all six canonical concepts represented in the assessment bank', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS) {
      expect(
        chapter20QuizQuestionConceptMappings.some(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('gives every assessment item four distinct non-empty choices and a substantive explanation', () => {
    for (const question of chapter20PremiumQuizQuestions) {
      const choices = [
        question.answer_a,
        question.answer_b,
        question.answer_c,
        question.answer_d,
      ]
      expect(choices.every((choice) => choice.trim().length > 0), question.id).toBe(true)
      expect(new Set(choices).size, question.id).toBe(4)
      expect(question.explanation?.trim().length ?? 0, question.id).toBeGreaterThan(80)
    }
  })

  it('hardens worker classification and booth-rental questions', () => {
    expect(source).toContain('actual working relationship, including control, financial independence')
    expect(source).toContain('title, commission method, or chair-rental label alone')
    expect(source).toContain('The actual agreement and applicable rules for scheduling, pricing, client records, fees, taxes, insurance')
    expect(source).not.toContain('classification determines tax responsibilities, required contracts')
    expect(source).not.toContain('solely responsible for her own clientele')
  })

  it('hardens compensation, income reporting, and pricing questions', () => {
    expect(source).toContain('written compensation terms')
    expect(source).toContain('Track income consistently and follow current reporting requirements')
    expect(source).toContain('There is no universal calendar rule for raising prices')
    expect(source).not.toContain('increases Social Security benefits')
    expect(source).not.toContain('prices should be increased by a reasonable amount every year or two')
  })

  it('hardens teamwork, ethical selling, and client consent questions', () => {
    expect(source).toContain('without demanding blind obedience')
    expect(source).toContain("respect the client's decision")
    expect(source).toContain('does not treat one consent format as universal')
  })

  it('reconciles every active Chapter 20 inventory surface to 17 questions', () => {
    expect(source).toContain('17 premium quiz questions')
    expect(demoSource).toContain('// Chapter 20: Premium flashcard-driven quiz (17 questions)')
    expect(demoSource).toContain("description: '17 board-exam style questions")
    expect(demoSource).not.toContain('// Chapter 20: Premium flashcard-driven quiz (15 questions)')
  })

  it('preserves the 80 percent chapter assessment threshold', () => {
    expect(demoSource).toContain("chapter_id: 'ch-20'")
    expect(demoSource).toContain('Passing score: 80%.')
    expect(demoSource).toContain('passing_score: 80')
  })

  it('preserves compliance-sensitive families outside bodily safety', () => {
    expect(CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
    expect(CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch20-employment-classification-compensation',
      'ch20-financial-responsibility-income-reporting',
      'ch20-client-retention-marketing-consent',
    ])
  })
})
