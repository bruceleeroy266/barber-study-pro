import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter17PremiumContent } from '../chapter-17-premium'
import { chapter17PremiumFlashcards } from '../chapter-17-premium-flashcards'
import { chapter17PremiumQuizQuestions, chapter17LearningQuestions } from '../chapter-17-premium-quiz'
import {
  ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter17ContentConceptMappings,
  chapter17FlashcardConceptMappings,
  chapter17LearningQuestionConceptMappings,
  chapter17QuizQuestionConceptMappings,
} from './mappings'

const source = readFileSync(join(process.cwd(), 'src/lib/chapter-17-premium.ts'), 'utf8')

describe('C17-2 source-grounded lesson hardening', () => {
  it('preserves the certified C17-1 architecture and educational inventories', () => {
    expect(chapter17PremiumContent.sections).toHaveLength(24)
    expect(chapter17PremiumFlashcards).toHaveLength(60)
    expect(chapter17PremiumQuizQuestions).toHaveLength(30)
    expect(chapter17LearningQuestions).toHaveLength(16)
    expect(ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS).toHaveLength(7)

    expect(chapter17ContentConceptMappings).toHaveLength(24)
    expect(chapter17FlashcardConceptMappings).toHaveLength(60)
    expect(chapter17QuizQuestionConceptMappings).toHaveLength(30)
    expect(chapter17LearningQuestionConceptMappings).toHaveLength(16)
  })

  it('removes the false one-chemistry-for-all-texture-services model', () => {
    expect(source).not.toContain('all rely on the same three-stage chemistry')
    expect(source).not.toContain('All chemical texture services work on the same bond type')
    expect(source).not.toContain('All texture services permanently alter disulfide bonds')
    expect(source).toContain('Hydroxide relaxers act differently through lanthionization')
    expect(source).toContain('thio reduction/oxidation and hydroxide lanthionization')
    expect(source).toContain('Hydroxide relaxers instead require thorough removal')
  })

  it('removes unsupported fixed pH, heat, test-curl, and processing claims', () => {
    expect(source).not.toContain('pH 9.0–9.6')
    expect(source).not.toContain('pH 4.5–7.0')
    expect(source).not.toContain('usually requires heat')
    expect(source).not.toContain('at least three areas')
    expect(source).not.toContain('Porosity is the primary factor')
    expect(source).toContain('whether added heat is used depends on the specific product system')
    expect(source).toContain('manufacturer’s timing and directions')
    expect(source).toContain('complete hair analysis and manufacturer directions')
  })

  it('tightens relaxer compatibility, scalp, and post-service safety wording', () => {
    expect(source).not.toContain('When in doubt, perform a compatibility test on a small strand')
    expect(source).not.toContain('Do not rely on the client to tell you when it burns')
    expect(source).not.toContain('trip to the doctor')
    expect(source).toContain('chemically incompatible on the same previously treated hair')
    expect(source).toContain('does not override a known product-family incompatibility')
    expect(source).toContain('Stop and remove product according to safety directions if burning, pain')
    expect(source).toContain('neutralizing/pH-restoring shampoo, oxidizing neutralizer, conditioner')
  })

  it('removes medical speculation and diagnostic scalp language', () => {
    expect(source).not.toContain('Some drugs affect hair strength and reaction')
    expect(source).not.toContain('No signs of irritation, abrasion, or disease')
    expect(source).toContain('do not diagnose medication effects')
    expect(source).toContain('refer medical questions appropriately')
    expect(source).toContain('No visible irritation, abrasion, open lesions')
  })

  it('removes exam-certainty framing from the 24-section student lesson', () => {
    expect(source).not.toContain('Lock in the language the board expects')
    expect(source).not.toContain("title: 'Board Alerts'")
    expect(source).not.toContain("badge: 'Board Ready'")
    expect(source).toContain("title: 'Safety & Chemistry Checkpoints'")
    expect(source).toContain("badge: 'Sequence Drill'")
  })

  it('does not define texturizing only by processing time or prescribe a generic weaker perm', () => {
    expect(source).not.toContain('The line between texturizing and relaxing is the processing time')
    expect(source).not.toContain('Recommend a milder acid perm')
    expect(source).not.toContain('use a weaker solution with shorter processing')
    expect(source).toContain('Do not define a texturizer only by shorter processing time')
    expect(source).toContain('choose only a waving system and processing plan that the manufacturer directions and hair analysis support')
  })

  it('limits the R-R-O mnemonic to thio/permanent-wave chemistry', () => {
    expect(source).not.toContain('Remember the texture service cycle with R-R-O')
    expect(source).toContain('For thio/permanent-wave chemistry, remember R-R-O')
    expect(source).toContain('Do not apply that mnemonic to hydroxide relaxers')
  })
})
