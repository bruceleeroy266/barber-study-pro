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
  chapter18FlashcardConceptMappings,
  chapter18LessonSectionConceptMappings,
  chapter18QuizQuestionConceptMappings,
} from './mappings'
import { CHAPTER18_GRADE_WEIGHTS } from './grading'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const source = readFileSync(join(process.cwd(), 'src/lib/chapter-18-premium-flashcards.ts'), 'utf8')

const expectedFlashcardIds = Array.from(
  { length: 50 },
  (_, index) => `fc-ch18-${String(index + 1).padStart(3, '0')}`,
)

const expectedQuizIds = Array.from(
  { length: 15 },
  (_, index) => `qq-18-${String(index + 1).padStart(2, '0')}`,
)

describe('C18-3 flashcard source-grounding and concept certification', () => {
  it('preserves the certified C18-1/C18-2 architecture and 50/15 inventories', () => {
    expect(chapter18PremiumContent.sections).toHaveLength(1)
    expect(chapter18PremiumContent.sections[0]?.id).toBe('chapter-18-lesson')
    expect(chapter18LessonSectionConceptMappings).toHaveLength(10)

    expect(chapter18PremiumFlashcards).toHaveLength(50)
    expect(chapter18PremiumFlashcards.map((card) => card.id)).toEqual(expectedFlashcardIds)

    expect(chapter18PremiumQuizQuestions).toHaveLength(15)
    expect(chapter18PremiumQuizQuestions.map((question) => question.id)).toEqual(expectedQuizIds)

    expect(ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS).toHaveLength(7)
    expect(CHAPTER18_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS).toEqual([
      'ch18-developers-lighteners-toners',
      'ch18-service-safety-chemical-handling',
    ])

    expect(CHAPTER18_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
  })

  it('maps every one of the 50 stable flashcard IDs exactly once to a valid concept family', () => {
    const mappedIds = chapter18FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(mappedIds).toHaveLength(50)
    expect(new Set(mappedIds).size).toBe(50)
    expect([...mappedIds].sort()).toEqual([...expectedFlashcardIds].sort())

    for (const mapping of chapter18FlashcardConceptMappings) {
      expect(ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
    }
  })

  it('preserves all 15 assessment mappings without rewriting the assessment bank in C18-3', () => {
    const mappedIds = chapter18QuizQuestionConceptMappings.map((mapping) => mapping.questionId)

    expect(mappedIds).toHaveLength(15)
    expect(new Set(mappedIds).size).toBe(15)
    expect([...mappedIds].sort()).toEqual([...expectedQuizIds].sort())
  })

  it('removes unverified textbook-page citations from the flashcard backs', () => {
    for (const card of chapter18PremiumFlashcards) {
      expect(card.back).not.toMatch(/\(p{1,2}\.\s*\d+/i)
    }
  })

  it('removes fixed developer-volume, gray-percentage, wash-count, and hair-analysis rules', () => {
    expect(source).not.toContain('Normal wet hair can stretch up to 50 percent')
    expect(source).not.toContain('as thin as \\u215b inch')
    expect(source).not.toContain('lasts about six to eight shampoos')
    expect(source).not.toContain('lasts up to 24 shampoos')
    expect(source).not.toContain('30-volume lifts up to three levels')
    expect(source).not.toContain('40-volume lifts up to four levels')
    expect(source).not.toContain('20-volume is standard for permanent color and gray coverage')

    expect(source).toContain('lift and permitted use depend on the complete product system')
    expect(source).toContain('Do not memorize a universal lift result for each volume')
    expect(source).toContain('neither automatically justifies stronger developer')
  })

  it('repairs FDA and allergy-test wording without inventing a universal 24–48-hour law', () => {
    expect(source).not.toContain('The FDA requires a patch test 24 to 48 hours before each application')
    expect(source).not.toContain('Federal law requires a predisposition (patch) test 24-48 hours')
    expect(source).not.toContain('A patch test is required')

    expect(source).toContain('coal-tar hair dyes under a special statutory framework')
    expect(source).toContain('FDA advises doing a skin test before each hair-dye use')
    expect(source).toContain('Do not generalize that framework into one universal 24–48-hour rule')
  })

  it('replaces universal lightener-format and toner assumptions with manufacturer-specific rules', () => {
    expect(source).not.toContain('Cream lighteners are popular on-the-scalp products')
    expect(source).not.toContain('Powder lighteners are stronger and usually off-the-scalp')
    expect(source).not.toContain('Oil lighteners are the mildest')
    expect(source).not.toContain('A toner may be semipermanent, demipermanent, or permanent haircolor. A patch test is required.')

    expect(source).toContain('Format alone does not determine strength or on-scalp safety')
    expect(source).toContain('Toner chemistry can be semipermanent, demipermanent, permanent, or another manufacturer-defined system')
  })

  it('hardens compatibility, scalp, and facial-hair safety wording', () => {
    expect(source).not.toContain('Never use aniline derivative tints or metallic dyes on mustaches or beards')
    expect(source).not.toContain('react dangerously with professional chemicals')
    expect(source).not.toContain('disease before applying color')

    expect(source).toContain('follow the planned product\'s compatibility warnings or prescribed test')
    expect(source).toContain('only when the product manufacturer expressly permits that intended facial-hair use')
    expect(source).toContain('Do not diagnose disease')
  })

  it('keeps every concept family represented in the hardened 50-card bank', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER18_CONCEPT_FAMILY_IDS) {
      expect(
        chapter18FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        conceptFamilyId,
      ).toBe(true)
    }
  })
})
