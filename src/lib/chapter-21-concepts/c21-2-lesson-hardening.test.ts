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
  chapter21LessonSectionConceptMappings,
  chapter21MicroCheckPlacements,
  chapter21QuizQuestionConceptMappings,
} from './mappings'

const source = readFileSync(
  join(process.cwd(), 'src/lib/chapter-21-premium-content.ts'),
  'utf8',
)

describe('C21-2 lesson hardening certification', () => {
  it('preserves the C21-1 architecture and existing inventories', () => {
    expect(ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS).toHaveLength(8)
    expect(chapter21PremiumFlashcards).toHaveLength(60)
    expect(chapter21PremiumQuizQuestions).toHaveLength(17)
    expect(chapter21FlashcardConceptMappings).toHaveLength(60)
    expect(chapter21QuizQuestionConceptMappings).toHaveLength(17)
    expect(chapter21LessonSectionConceptMappings).toHaveLength(9)
    expect(
      chapter21PremiumContent.sections.some(
        (section) => section.id === 'ch21-lo8',
      ),
    ).toBe(true)
  })

  it('binds all eight LO sections to canonical LO IDs and concept families', () => {
    const expected = [
      ['ch21-lo1', 'LO-21-01', 'ch21-business-entry-paths'],
      ['ch21-lo2', 'LO-21-02', 'ch21-shop-opening-planning'],
      ['ch21-lo3', 'LO-21-03', 'ch21-ownership-legal-structures'],
      ['ch21-lo4', 'LO-21-04', 'ch21-business-plan-financial-planning'],
      ['ch21-lo5', 'LO-21-05', 'ch21-recordkeeping-financial-compliance'],
      [
        'ch21-lo6',
        'LO-21-06',
        'ch21-booth-rental-independent-business-responsibilities',
      ],
      ['ch21-lo7', 'LO-21-07', 'ch21-shop-operations-management'],
      [
        'ch21-lo8',
        'LO-21-08',
        'ch21-advertising-marketing-client-consent',
      ],
    ] as const

    for (const [sectionId, loId, conceptId] of expected) {
      expect(source).toContain(`id: '${sectionId}'`)
      expect(source).toContain(`standardId: '${loId}'`)
      expect(source).toContain(`data-learning-objective="${loId}"`)
      expect(source).toContain(`data-concept-family="${conceptId}"`)
    }
  })

  it('hardens shop-opening and licensing language against universal requirements', () => {
    expect(source).toContain(
      'There is no universal number of months that guarantees success',
    )
    expect(source).toContain(
      'Requirements vary by jurisdiction and business structure',
    )
    expect(source).not.toContain(
      'enough operating cash to cover 3–6 months of expenses',
    )
    expect(source).not.toContain(
      'obtain an Employer Identification Number (EIN)',
    )
  })

  it('hardens entity, liability, and tax-structure claims', () => {
    expect(source).toContain(
      'the protection is not absolute and does not replace insurance',
    )
    expect(source).toContain(
      'Avoid reducing the choice to a simple "double taxation versus S corporation" rule',
    )
    expect(source).toContain(
      'No single business structure is automatically right for every shop',
    )
    expect(source).not.toContain(
      'An LLC separates personal and business liability',
    )
    expect(source).not.toContain(
      'double taxation unless structured as an S corporation',
    )
    expect(source).not.toContain(
      'the most common choice for independent shop owners',
    )
  })

  it('hardens recordkeeping and booth-rental tax/classification content', () => {
    expect(source).toContain(
      'Record-retention periods are not one universal number',
    )
    expect(source).toContain(
      'the label "booth renter" does not by itself determine worker classification',
    )
    expect(source).toContain(
      'Do not use a fixed savings percentage as a universal tax rule',
    )
    expect(source).toContain(
      'Classification depends on the full facts and circumstances, not a label alone',
    )
    expect(source).not.toContain(
      'Set aside 25–30% of every dollar you earn',
    )
    expect(source).not.toContain(
      'usually make quarterly estimated tax payments',
    )
    expect(source).not.toContain(
      'keep records for the required number of years',
    )
  })

  it('keeps operations cleanliness tied to the safety source-of-truth chapter', () => {
    expect(source).toContain(
      'Chapter 21 treats cleanliness as an operations responsibility; it does not replace the safety chapter',
    )
    expect(CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([])
  })

  it('hardens advertising, privacy, consent, and promotion language', () => {
    expect(source).toContain(
      'no channel or campaign guarantees a full appointment book',
    )
    expect(source).toContain(
      'a social-media tag equals consent for advertising use',
    )
    expect(source).toContain(
      'Obtain clear permission before using identifiable client images',
    )
    expect(source).toContain(
      'privacy, advertising, communications, platform, school, and shop rules',
    )
  })

  it('adds one ungraded Apply It anchor per canonical family', () => {
    const applyIds = Array.from({ length: 8 }, (_, index) =>
      `ch21-apply-${String(index + 1).padStart(2, '0')}`,
    )
    for (const id of applyIds) {
      expect(source).toContain(`id="${id}"`)
    }
    expect((source.match(/data-graded="false"/g) ?? [])).toHaveLength(8)
  })

  it('keeps future micro-check placement at two questions per family', () => {
    expect(chapter21MicroCheckPlacements).toHaveLength(8)
    expect(
      chapter21MicroCheckPlacements.every(
        (placement) => placement.plannedQuestionCount === 2,
      ),
    ).toBe(true)
    expect(
      new Set(
        chapter21MicroCheckPlacements.map(
          (placement) => placement.conceptFamilyId,
        ),
      ),
    ).toEqual(new Set(ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS))
  })

  it('preserves compliance-vs-safety separation', () => {
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
