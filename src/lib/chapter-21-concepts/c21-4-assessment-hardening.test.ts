import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter21PremiumFlashcards } from '../chapter-21-premium-flashcards'
import { chapter21PremiumQuizQuestions } from '../chapter-21-premium-quiz'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'
import {
  ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS,
  CHAPTER21_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
  CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter21FlashcardConceptMappings,
  chapter21QuizQuestionConceptMappings,
} from './mappings'

const source = readFileSync(
  join(process.cwd(), 'src/lib/chapter-21-premium-quiz.ts'),
  'utf8',
)
const demoSource = readFileSync(
  join(process.cwd(), 'src/lib/demo-data.ts'),
  'utf8',
)

const expectedQuestionIds = Array.from(
  { length: 17 },
  (_, index) => `qq-21-${String(index + 1).padStart(2, '0')}`,
)

const expectedStandardIds = Array.from(
  { length: 17 },
  (_, index) => `CH21-Q${String(index + 1).padStart(2, '0')}`,
)

const expectedLearningObjectiveByQuestion = {
  'qq-21-01': 'LO-21-01',
  'qq-21-02': 'LO-21-01',
  'qq-21-03': 'LO-21-02',
  'qq-21-04': 'LO-21-03',
  'qq-21-05': 'LO-21-03',
  'qq-21-06': 'LO-21-06',
  'qq-21-07': 'LO-21-04',
  'qq-21-08': 'LO-21-04',
  'qq-21-09': 'LO-21-05',
  'qq-21-10': 'LO-21-05',
  'qq-21-11': 'LO-21-06',
  'qq-21-12': 'LO-21-07',
  'qq-21-13': 'LO-21-07',
  'qq-21-14': 'LO-21-08',
  'qq-21-15': 'LO-21-08',
  'qq-21-16': 'LO-21-08',
  'qq-21-17': 'LO-21-02',
} as const

describe('C21-4 assessment hardening certification', () => {
  it('preserves the hardened 60-card bank, eight concepts, and shared grading', () => {
    expect(chapter21PremiumFlashcards).toHaveLength(60)
    expect(chapter21FlashcardConceptMappings).toHaveLength(60)
    expect(ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS).toHaveLength(8)
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('preserves all 17 stable assessment IDs, standard IDs, order indexes, and quiz assignment', () => {
    expect(chapter21PremiumQuizQuestions).toHaveLength(17)
    expect(chapter21PremiumQuizQuestions.map((question) => question.id)).toEqual(
      expectedQuestionIds,
    )
    expect(
      chapter21PremiumQuizQuestions.map((question) => question.standardId),
    ).toEqual(expectedStandardIds)
    expect(
      chapter21PremiumQuizQuestions.map((question) => question.order_index),
    ).toEqual(Array.from({ length: 17 }, (_, index) => index + 1))
    expect(
      chapter21PremiumQuizQuestions.every(
        (question) => question.quiz_id === 'quiz-21',
      ),
    ).toBe(true)
  })

  it('replaces legacy CH21-LO metadata with canonical LO-21-01 through LO-21-08', () => {
    for (const question of chapter21PremiumQuizQuestions) {
      expect(question.learningObjective, question.id).toBe(
        expectedLearningObjectiveByQuestion[
          question.id as keyof typeof expectedLearningObjectiveByQuestion
        ],
      )
    }
    expect(source).not.toMatch(/learningObjective:\s*['"]CH21-LO0[1-8]['"]/)
  })

  it('maps all 17 questions exactly once and represents all eight concepts', () => {
    expect(chapter21QuizQuestionConceptMappings).toHaveLength(17)
    expect(
      new Set(
        chapter21QuizQuestionConceptMappings.map(
          (mapping) => mapping.questionId,
        ),
      ).size,
    ).toBe(17)

    for (const conceptFamilyId of ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS) {
      expect(
        chapter21QuizQuestionConceptMappings.some(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('keeps four distinct choices and substantive explanations on every item', () => {
    for (const question of chapter21PremiumQuizQuestions) {
      const choices = [
        question.answer_a,
        question.answer_b,
        question.answer_c,
        question.answer_d,
      ]
      expect(choices.every((choice) => choice.trim().length > 0), question.id).toBe(
        true,
      )
      expect(new Set(choices).size, question.id).toBe(4)
      expect(question.explanation?.trim().length ?? 0, question.id).toBeGreaterThan(
        100,
      )
    }
  })

  it('hardens entity and liability questions against one-size-fits-all conclusions', () => {
    expect(source).toContain(
      'generally does not create a separate entity-level liability shield',
    )
    expect(source).toContain(
      'Compare structures such as an LLC or corporation using current liability, tax, governance, filing, insurance, and financing considerations',
    )
    expect(source).toContain('Protection is not absolute')
    expect(source).not.toContain('most commonly recommended')
    expect(source).not.toContain(
      'An LLC protects personal assets from business liabilities while keeping paperwork and formalities manageable',
    )
  })

  it('hardens booth-rental and tax questions against label-based status assumptions', () => {
    expect(source).toContain(
      'the agreement and actual working relationship',
    )
    expect(source).toContain(
      'Use the booth-renter label alone to decide legal status',
    )
    expect(source).toContain(
      'Classification and business duties depend on the full facts and applicable rules rather than a label alone',
    )
    expect(source).toContain(
      'Whether self-employment tax, withholding, estimated payments, or other obligations apply depends on classification',
    )
    expect(source).not.toContain(
      'Booth renters are independent and must track and report all income',
    )
    expect(source).not.toContain(
      'paying self-employment taxes',
    )
  })

  it('hardens slow-day operational and advertising questions to evidence-based decisions', () => {
    expect(source).toContain(
      'Review demand, rebooking, staffing, pricing, and campaign data',
    )
    expect(source).toContain(
      'no campaign guarantees a full book',
    )
    expect(source).toContain(
      'define a measurable goal, verify consent/rules, and test results before expanding',
    )
    expect(source).toContain(
      'Which client-based marketing signal can add strong social proof when it is genuine and not misleading?',
    )
    expect(source).toContain(
      'Genuine reviews and referrals can add social proof when they reflect real experiences',
    )
  })

  it('removes the fixed 3-6 month startup-reserve rule', () => {
    expect(source).toContain(
      'There is no universal number of months that guarantees success',
    )
    expect(source).not.toContain('3-6 months of expenses')
  })

  it('preserves the active Chapter 21 inventory surface at 17 questions and 80 percent', () => {
    expect(source).toContain('17 premium quiz questions')
    expect(demoSource).toContain(
      '// Chapter 21: Premium flashcard-driven quiz (17 questions)',
    )
    expect(demoSource).toContain(
      "description: '17 board-exam style questions on ownership, business plans, record keeping, booth rental, operations, and advertising. Passing score: 80%.'",
    )
    expect(demoSource).toContain("chapter_id: 'ch-21'")
    expect(demoSource).toContain('passing_score: 80')
  })

  it('preserves compliance-sensitive families outside bodily safety', () => {
    expect(CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
    expect(
      CHAPTER21_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS,
    ).toEqual([
      'ch21-shop-opening-planning',
      'ch21-ownership-legal-structures',
      'ch21-recordkeeping-financial-compliance',
      'ch21-booth-rental-independent-business-responsibilities',
      'ch21-advertising-marketing-client-consent',
    ])
  })
})
