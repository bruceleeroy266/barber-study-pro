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
  chapter20MicroCheckPlacements,
  chapter20QuizQuestionConceptMappings,
} from './mappings'

const source = readFileSync(
  join(process.cwd(), 'src/lib/chapter-20-premium-content.ts'),
  'utf8',
)

describe('C20-2 lesson hardening certification', () => {
  it('preserves the C20-1 architecture and existing inventories', () => {
    expect(ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS).toHaveLength(6)
    expect(chapter20PremiumFlashcards).toHaveLength(60)
    expect(chapter20PremiumQuizQuestions).toHaveLength(17)
    expect(chapter20FlashcardConceptMappings).toHaveLength(60)
    expect(chapter20QuizQuestionConceptMappings).toHaveLength(17)
    expect(chapter20LessonSectionConceptMappings).toHaveLength(7)
    expect(chapter20PremiumContent.sections.some((section) => section.id === 'ch20-lo6')).toBe(true)
  })

  it('binds each real LO section to its canonical family in learner content', () => {
    const expected = [
      ['ch20-lo1', 'ch20-professional-transition-workplace-expectations'],
      ['ch20-lo2', 'ch20-teamwork-workplace-relationships'],
      ['ch20-lo3', 'ch20-employment-classification-compensation'],
      ['ch20-lo4', 'ch20-financial-responsibility-income-reporting'],
      ['ch20-lo5', 'ch20-ethical-selling-retailing'],
      ['ch20-lo6', 'ch20-client-retention-marketing-consent'],
    ] as const

    for (const [sectionId, conceptId] of expected) {
      expect(source).toContain(`id: '${sectionId}'`)
      expect(source).toContain(`data-concept-family="${conceptId}"`)
    }
  })

  it('removes the legacy wrapper name without changing the runtime section inventory', () => {
    expect(source).not.toContain('ch20-legacy-content')
    expect(source).toContain('ch20-lesson-content')
  })

  it('hardens worker-classification content against label-based legal conclusions', () => {
    expect(source).toContain('the label placed on the arrangement does not by itself determine legal or tax status')
    expect(source).toContain('behavioral control, financial control, and the relationship between the parties')
    expect(source).toContain('classification depends on the full working relationship rather than a single factor')
    expect(source).not.toContain('You should receive Form 1099-MISC when you earn more than $600 in a year')
    expect(source).not.toContain('A written contract is required, and quarterly tax payments may be necessary')
  })

  it('hardens income and tip reporting to current-rule verification', () => {
    expect(source).toContain('Tips and other taxable income must be tracked and reported according to current tax rules')
    expect(source).toContain('keep a daily tip record')
    expect(source).toContain('Verify current requirements with the IRS')
  })

  it('strengthens client-photo consent and privacy wording', () => {
    expect(source).toContain('Obtain clear client permission before posting identifiable photos')
    expect(source).toContain('privacy, advertising, platform, school, and shop rules')
  })

  it('adds one ungraded application anchor for every canonical family', () => {
    const applyIds = Array.from({ length: 6 }, (_, index) =>
      `ch20-apply-${String(index + 1).padStart(2, '0')}`,
    )
    for (const id of applyIds) expect(source).toContain(`id="${id}"`)

    for (const conceptId of ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS) {
      expect(source).toContain(`data-concept-family="${conceptId}"`)
    }
  })

  it('plans exactly two future micro-check questions per family after the matching LO section', () => {
    expect(chapter20MicroCheckPlacements).toHaveLength(6)
    expect(chapter20MicroCheckPlacements.map((placement) => placement.afterSectionId)).toEqual([
      'ch20-lo1',
      'ch20-lo2',
      'ch20-lo3',
      'ch20-lo4',
      'ch20-lo5',
      'ch20-lo6',
    ])
    expect(chapter20MicroCheckPlacements.every((placement) => placement.plannedQuestionCount === 2)).toBe(true)
    expect(new Set(chapter20MicroCheckPlacements.map((placement) => placement.conceptFamilyId))).toEqual(
      new Set(ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS),
    )
  })

  it('keeps compliance-sensitive concepts separate from bodily safety', () => {
    expect(CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
    expect(CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch20-employment-classification-compensation',
      'ch20-financial-responsibility-income-reporting',
      'ch20-client-retention-marketing-consent',
    ])
  })

  it('preserves the shared 20/10/40/15/15 grading contract', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })
})
