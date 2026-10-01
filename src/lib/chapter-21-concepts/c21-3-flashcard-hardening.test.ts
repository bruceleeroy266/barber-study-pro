import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter21PremiumContent } from '../chapter-21-premium-content'
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
  join(process.cwd(), 'src/lib/chapter-21-premium-flashcards.ts'),
  'utf8',
)

const expectedFlashcardIds = Array.from(
  { length: 60 },
  (_, index) => `fc-ch21-${String(index + 1).padStart(3, '0')}`,
)

const expectedStandardIds = Array.from(
  { length: 60 },
  (_, index) => `CH21-F${String(index + 1).padStart(3, '0')}`,
)

const expectedQuizIds = Array.from(
  { length: 17 },
  (_, index) => `qq-21-${String(index + 1).padStart(2, '0')}`,
)

describe('C21-3 flashcard hardening certification', () => {
  it('preserves the exact 60-card inventory, stable IDs, standard IDs, order, chapter, and active state', () => {
    expect(chapter21PremiumContent.sections.length).toBeGreaterThan(8)
    expect(chapter21PremiumFlashcards).toHaveLength(60)
    expect(chapter21PremiumFlashcards.map((card) => card.id)).toEqual(
      expectedFlashcardIds,
    )
    expect(
      chapter21PremiumFlashcards.map((card) => card.standardId),
    ).toEqual(expectedStandardIds)
    expect(
      chapter21PremiumFlashcards.map((card) => card.order_index),
    ).toEqual(Array.from({ length: 60 }, (_, index) => index + 1))
    expect(
      chapter21PremiumFlashcards.every(
        (card) => card.chapter_id === 'ch-21',
      ),
    ).toBe(true)
    expect(
      chapter21PremiumFlashcards.every((card) => card.is_active),
    ).toBe(true)
  })

  it('maps every flashcard exactly once to a canonical concept family', () => {
    const mappedIds = chapter21FlashcardConceptMappings.map(
      (mapping) => mapping.flashcardId,
    )

    expect(mappedIds).toHaveLength(60)
    expect(new Set(mappedIds).size).toBe(60)
    expect([...mappedIds].sort()).toEqual([...expectedFlashcardIds].sort())

    for (const mapping of chapter21FlashcardConceptMappings) {
      expect(ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS).toContain(
        mapping.conceptFamilyId,
      )
    }
  })

  it('preserves the intentional 5/5/10/10/5/5/10/10 canonical distribution', () => {
    const counts = ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS.map(
      (conceptFamilyId) =>
        chapter21FlashcardConceptMappings.filter(
          (mapping) => mapping.conceptFamilyId === conceptFamilyId,
        ).length,
    )
    expect(counts).toEqual([5, 5, 10, 10, 5, 5, 10, 10])
  })

  it('hardens startup and shop-opening claims without fixed reserve rules', () => {
    expect(source).toContain(
      'Estimate the reserve from projected costs, financing, expected revenue, and risk rather than one universal number of months',
    )
    expect(source).toContain(
      'based on the actual relationship and applicable rules',
    )
    expect(source).not.toContain(
      'Most new shops take months to become profitable',
    )
  })

  it('hardens entity, liability, corporation, and franchise claims', () => {
    expect(source).toContain(
      'protection is not absolute and the best structure depends on the owner',
    )
    expect(source).toContain(
      'actual treatment depends on the entity and valid tax elections',
    )
    expect(source).toContain(
      'the actual franchise agreement governs',
    )
    expect(source).not.toContain(
      'It protects personal assets from business liabilities while keeping paperwork manageable',
    )
    expect(source).not.toContain(
      'Corporate profits are taxed at the business level and again as shareholder dividends unless structured to avoid it',
    )
  })

  it('hardens booth-rental classification and tax cards against label shortcuts and fixed percentages', () => {
    expect(source).toContain(
      'the booth-renter label alone does not determine tax treatment',
    )
    expect(source).toContain(
      'No. Estimated tax needs vary with income, deductions, structure, withholding, state rules, and other facts',
    )
    expect(source).toContain(
      'compare it with the actual working relationship',
    )
    expect(source).not.toContain('Approximately 25–30%')
    expect(source).not.toContain(
      'The booth renter is responsible for reporting income and paying self-employment taxes',
    )
  })

  it('hardens recordkeeping and client-information guidance', () => {
    expect(source).toContain(
      'Keep only information needed for legitimate service or business purposes',
    )
    expect(source).toContain(
      'Cash is not automatically exempt from tax or reporting',
    )
    expect(source).toContain(
      'supporting documents required for the business',
    )
  })

  it('keeps cleanliness operational without duplicating the safety curriculum', () => {
    expect(source).toContain(
      'actual infection-control and sanitation procedures must follow the dedicated safety curriculum',
    )
    expect(CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
  })

  it('hardens advertising, reviews, referrals, and client-photo consent', () => {
    expect(source).toContain(
      'there is no rule that frequency always beats quality',
    )
    expect(source).toContain(
      'testimonials should be genuine, not misleading',
    )
    expect(source).toContain(
      'Obtain clear permission using the form required by applicable law or policy',
    )
    expect(source).toContain(
      'ethical, mutually understood cross-promotion',
    )
    expect(source).not.toContain(
      "Get the client's permission, preferably in writing",
    )
  })

  it('keeps every card front meaningfully distinct', () => {
    const normalized = chapter21PremiumFlashcards.map((card) =>
      card.front.trim().toLowerCase().replace(/\s+/g, ' '),
    )
    expect(new Set(normalized).size).toBe(60)
  })

  it('preserves all 17 assessment IDs and mappings without rewriting the assessment in C21-3', () => {
    expect(chapter21PremiumQuizQuestions).toHaveLength(17)
    expect(chapter21PremiumQuizQuestions.map((question) => question.id)).toEqual(
      expectedQuizIds,
    )

    const mappedIds = chapter21QuizQuestionConceptMappings.map(
      (mapping) => mapping.questionId,
    )
    expect(mappedIds).toHaveLength(17)
    expect(new Set(mappedIds).size).toBe(17)
    expect([...mappedIds].sort()).toEqual([...expectedQuizIds].sort())
  })

  it('preserves compliance-vs-safety separation and shared grading', () => {
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
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })
})
