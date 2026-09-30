import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter18PremiumContent } from '../chapter-18-premium'
import { chapter18PremiumFlashcards } from '../chapter-18-premium-flashcards'
import { chapter18PremiumQuizQuestions } from '../chapter-18-premium-quiz'
import {
  ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS,
  CHAPTER18_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter18ContentConceptMappings,
  chapter18FlashcardConceptMappings,
  chapter18LessonSectionConceptMappings,
  chapter18QuizQuestionConceptMappings,
} from './mappings'
import { CHAPTER18_GRADE_WEIGHTS } from './grading'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const source = readFileSync(join(process.cwd(), 'src/lib/chapter-18-premium.ts'), 'utf8')

describe('C18-2 source-grounded lesson hardening', () => {
  it('preserves the certified C18-1 architecture and educational inventories', () => {
    expect(chapter18PremiumContent.sections).toHaveLength(1)
    expect(chapter18PremiumContent.sections[0]?.id).toBe('chapter-18-lesson')
    expect(chapter18PremiumFlashcards).toHaveLength(50)
    expect(chapter18PremiumQuizQuestions).toHaveLength(15)
    expect(ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS).toHaveLength(7)
    expect(CHAPTER18_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch18-developers-lighteners-toners',
      'ch18-service-safety-chemical-handling',
    ])
    expect(chapter18LessonSectionConceptMappings).toHaveLength(10)
    expect(chapter18ContentConceptMappings).toHaveLength(1)
    expect(chapter18FlashcardConceptMappings).toHaveLength(50)
    expect(chapter18QuizQuestionConceptMappings).toHaveLength(15)
    expect(CHAPTER18_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
  })

  it('removes the blanket FDA/aniline-derivative patch-test rule', () => {
    expect(source).not.toContain('The FDA requires a <strong>patch test 24–48 hours</strong> before each application')
    expect(source).not.toContain('required 24–48 hours before service')
    expect(source).not.toContain('<strong>Patch tests</strong> are required for aniline derivative products')
    expect(source).toContain('coal-tar hair dyes have specific federal caution-label and preliminary-test requirements')
    expect(source).toContain('perform the skin test before each use of hair dye')
    expect(source).toContain('follow its timing exactly')
  })

  it('removes universal developer-volume lift and gray-coverage formulas', () => {
    expect(source).not.toContain('<strong>20-volume:</strong> standard for permanent color, covers gray, 1–2 levels lift')
    expect(source).not.toContain('<strong>30-volume:</strong> up to 3 levels lift')
    expect(source).not.toContain('<strong>40-volume:</strong> up to 4 levels lift')
    expect(source).not.toContain('Good for blending up to 25% gray')
    expect(source).not.toContain('Lighter shades often flatter clients with 80–100% gray')
    expect(source).toContain('lift is not determined by volume alone')
    expect(source).toContain('Gray-coverage and lift capabilities are product-specific')
    expect(source).toContain('not a fixed percentage rule')
  })

  it('hardens lightener, toner, processing, and overlap language to manufacturer boundaries', () => {
    expect(source).not.toContain('<strong>Cream:</strong> most popular on-the-scalp')
    expect(source).not.toContain('<strong>Powder:</strong> stronger, usually off-the-scalp')
    expect(source).not.toContain('<strong>Oil:</strong> mildest; used for 1–2 levels of lift')
    expect(source).not.toContain('Permanent color applied to <strong>pre-lightened</strong> hair')
    expect(source).toContain('Do not assume a format is automatically safe for on-scalp use')
    expect(source).toContain('Follow the manufacturer\'s allowed developer, mixing ratio, application area, processing time, heat, and overlap instructions')
    expect(source).toContain('Toner chemistry varies by product')
    expect(source).toContain('Avoid unapproved overlap')
  })

  it('removes unsupported improvised-formula and damaged-hair prescriptions', () => {
    expect(source).not.toContain('<strong>Soap cap:</strong> equal parts tint, developer, and shampoo')
    expect(source).not.toContain('Recondition with protein or lanolin treatments before coloring')
    expect(source).not.toContain('needs more time or stronger developer')
    expect(source).toContain('do not create an improvised mixture outside manufacturer directions')
    expect(source).toContain('Do not assume a conditioning treatment makes damaged hair suitable')
    expect(source).toContain('do not automatically compensate with stronger developer')
  })

  it('tightens chemical compatibility and scalp contraindication language', () => {
    expect(source).not.toContain('<strong>Never apply hydrogen peroxide over metallic dyes.</strong>')
    expect(source).not.toContain('Always test for metallic salts before professional chemical services')
    expect(source).toContain('Do not perform haircolor on an irritated, sunburned, or damaged scalp')
    expect(source).toContain('Do not combine an oxidative color/lightener service with an unknown or incompatible prior color system')
    expect(source).toContain('do not guess; use the manufacturer\'s prescribed test or decline/postpone the chemical service')
  })

  it('replaces blanket facial-hair prohibitions with product-specific permitted-use rules', () => {
    expect(source).not.toContain('<strong>Never use aniline derivative tints</strong> on mustaches or beards')
    expect(source).not.toContain('<strong>Never use metallic or progressive dyes</strong> on facial hair')
    expect(source).not.toContain('Avoid aniline derivative and metallic dyes completely')
    expect(source).toContain('only when its label or professional instructions specifically allow facial-hair use')
    expect(source).toContain('Do not transfer scalp-hair directions to facial hair by assumption')
    expect(source).toContain('use only a product whose manufacturer expressly permits the intended beard or mustache application')
  })

  it('removes unsupported fixed hair-analysis and color-system claims', () => {
    expect(source).not.toContain('wet hair stretches up to 50% and returns')
    expect(source).not.toContain('as thin as ⅛ inch')
    expect(source).not.toContain('1–10 scale (1 = black, 10 = lightest blond)')
    expect(source).not.toContain('Blue is the strongest and only cool primary; yellow is the weakest')
    expect(source).toContain('exact section size depends on the technique and product instructions')
    expect(source).toContain('exact numbering and shade names can vary by manufacturer')
  })
})
