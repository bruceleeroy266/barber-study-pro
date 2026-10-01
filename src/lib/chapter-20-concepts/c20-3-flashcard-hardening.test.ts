import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter20PremiumContent } from '../chapter-20-premium-content'
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
  chapter20LessonSectionConceptMappings,
  chapter20QuizQuestionConceptMappings,
} from './mappings'

const source = readFileSync(
  join(process.cwd(), 'src/lib/chapter-20-premium-flashcards.ts'),
  'utf8',
)

const expectedFlashcardIds = Array.from(
  { length: 60 },
  (_, index) => `fc-ch20-${String(index + 1).padStart(3, '0')}`,
)

const expectedStandardIds = Array.from(
  { length: 60 },
  (_, index) => `CH20-F${String(index + 1).padStart(3, '0')}`,
)

const expectedQuizIds = Array.from(
  { length: 17 },
  (_, index) => `qq-20-${String(index + 1).padStart(2, '0')}`,
)

describe('C20-3 flashcard hardening and concept certification', () => {
  it('preserves the exact Chapter 20 inventories and stable card identifiers', () => {
    expect(chapter20PremiumContent.sections.length).toBeGreaterThan(6)
    expect(chapter20LessonSectionConceptMappings).toHaveLength(7)

    expect(chapter20PremiumFlashcards).toHaveLength(60)
    expect(chapter20PremiumFlashcards.map((card) => card.id)).toEqual(expectedFlashcardIds)
    expect(chapter20PremiumFlashcards.map((card) => card.standardId)).toEqual(expectedStandardIds)
    expect(chapter20PremiumFlashcards.map((card) => card.order_index)).toEqual(
      Array.from({ length: 60 }, (_, index) => index + 1),
    )
    expect(chapter20PremiumFlashcards.every((card) => card.chapter_id === 'ch-20')).toBe(true)
    expect(chapter20PremiumFlashcards.every((card) => card.is_active)).toBe(true)

    expect(chapter20PremiumQuizQuestions).toHaveLength(17)
    expect(chapter20PremiumQuizQuestions.map((question) => question.id)).toEqual(expectedQuizIds)
  })

  it('maps every stable flashcard ID exactly once to a valid canonical concept family', () => {
    const mappedIds = chapter20FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(mappedIds).toHaveLength(60)
    expect(new Set(mappedIds).size).toBe(60)
    expect([...mappedIds].sort()).toEqual([...expectedFlashcardIds].sort())

    for (const mapping of chapter20FlashcardConceptMappings) {
      expect(ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
    }
  })

  it('keeps ten flashcards in each of the six canonical concept families', () => {
    const counts = ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS.map(
      (conceptId) =>
        chapter20FlashcardConceptMappings.filter(
          (mapping) => mapping.conceptFamilyId === conceptId,
        ).length,
    )
    expect(counts).toEqual([10, 10, 10, 10, 10, 10])
  })

  it('hardens worker classification to facts and circumstances instead of labels', () => {
    expect(source).toContain('classification should not be decided from one factor or label alone')
    expect(source).toContain('depends on the actual facts and level of business independence')
    expect(source).toContain('the label alone does not determine legal or tax status')
    expect(source).not.toContain('The shop controls work hours, how the job is performed, and withholds taxes')
    expect(source).not.toContain('A self-employed worker with a written contract who handles own taxes')
  })

  it('removes stale fixed Form 1099 threshold/form assumptions', () => {
    expect(source).not.toContain('receives a Form 1099 when earnings exceed $600')
    expect(source).not.toContain('Form 1099-MISC from the shop owner')
    expect(source).toContain('verify the current form and threshold')
    expect(source).toContain('current IRS reporting rules require it')
  })

  it('hardens income and tip reporting without inventing universal consequences', () => {
    expect(source).toContain('Tips can be taxable income')
    expect(source).toContain('Report taxable income from tips and other work according to current tax rules')
    expect(source).toContain('retain supporting records')
    expect(source).toContain('The exact consequences depend on the facts and applicable rules')
    expect(source).not.toContain('four serious consequences')
  })

  it('removes arbitrary evaluation, pricing, and retail-compensation formulas', () => {
    expect(source).not.toContain('About 90 days after hiring and then roughly once a year')
    expect(source).toContain('Evaluation schedules vary by employer')
    expect(source).not.toContain('Once you have a loyal client base and have fully mastered your services')
    expect(source).toContain('There is no single universal timing rule')
    expect(source).not.toContain('Most shops pay commission on retail sales')
    expect(source).toContain("when the shop's compensation plan includes retail commission or incentives")
  })

  it('keeps teamwork guidance professional without demanding blind loyalty or submission', () => {
    expect(source).toContain('speaking up about legitimate concerns')
    expect(source).toContain('without treating inappropriate conduct or unsafe expectations as acceptable')
  })

  it('hardens ethical selling, referral, and client-photo marketing language', () => {
    expect(source).toContain('avoid making promises about results you cannot guarantee')
    expect(source).toContain('Obtain clear permission before posting identifiable client content')
    expect(source).toContain('advertising rules, and clear offer terms')
    expect(source).toContain('mutually beneficial arrangement')
  })

  it('keeps every card meaningfully distinct by front text', () => {
    const normalizedFronts = chapter20PremiumFlashcards.map((card) =>
      card.front.trim().toLowerCase().replace(/\s+/g, ' '),
    )
    expect(new Set(normalizedFronts).size).toBe(60)
  })

  it('preserves the compliance-vs-safety boundary and shared grading contract', () => {
    expect(CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
    expect(CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch20-employment-classification-compensation',
      'ch20-financial-responsibility-income-reporting',
      'ch20-client-retention-marketing-consent',
    ])
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })

  it('preserves all 17 assessment mappings without rewriting assessment content in C20-3', () => {
    const mappedIds = chapter20QuizQuestionConceptMappings.map(
      (mapping) => mapping.questionId,
    )
    expect(mappedIds).toHaveLength(17)
    expect(new Set(mappedIds).size).toBe(17)
    expect([...mappedIds].sort()).toEqual([...expectedQuizIds].sort())
  })
})
