import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter17PremiumContent } from '../chapter-17-premium'
import { chapter17PremiumFlashcards } from '../chapter-17-premium-flashcards'
import { chapter17PremiumQuizQuestions, chapter17LearningQuestions } from '../chapter-17-premium-quiz'
import {
  chapter17FlashcardConceptMappings,
  chapter17ContentConceptMappings,
  chapter17QuizQuestionConceptMappings,
  chapter17LearningQuestionConceptMappings,
} from './mappings'
import { ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS } from './concepts'
import {
  getFlashcardEvidenceConcept,
  getFlashcardEvidenceInventory,
} from '../concept-mastery/activity-evidence-registry'

const source = readFileSync(join(process.cwd(), 'src/lib/chapter-17-premium-flashcards.ts'), 'utf8')

describe('C17-3 flashcard source-grounding and concept certification', () => {
  it('preserves the certified Chapter 17 inventories and architecture', () => {
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

  it('preserves all 60 stable flashcard IDs exactly once and keeps shared evidence resolution intact', () => {
    const ids = chapter17PremiumFlashcards.map((card) => card.id)
    const expected = Array.from({ length: 60 }, (_, index) =>
      `fc-ch17-${String(index + 1).padStart(3, '0')}`,
    )

    expect(ids).toEqual(expected)
    expect(new Set(ids).size).toBe(60)
    expect(chapter17FlashcardConceptMappings.map((mapping) => mapping.flashcardId)).toEqual(expected)
    expect(getFlashcardEvidenceInventory('ch-17')).toEqual(expected)
    expect(ids.every((id) => getFlashcardEvidenceConcept('ch-17', id) !== null)).toBe(true)
  })

  it('preserves concept coverage for all seven canonical families', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER17_CONCEPT_FAMILY_IDS) {
      expect(
        chapter17FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('removes one-chemistry-for-all-texture-service flashcard wording', () => {
    expect(source).not.toContain('The waving or relaxing solution breaks disulfide bonds, changing cystine to cysteine.')
    expect(source).not.toContain('The neutralizer rebuilds disulfide bonds in the new shape')
    expect(source).not.toContain('To permanently change the natural wave pattern of hair by altering disulfide bonds in the cortex.')
    expect(source).toContain('hydroxide relaxers use different chemistry')
    expect(source).toContain('hydroxide relaxers use a different finishing process')
    expect(source).toContain('straightens through lanthionization')
  })

  it('removes fixed pH, blanket heat, stronger-solution, and universal timing claims', () => {
    expect(source).not.toContain('pH of 9.0–9.6')
    expect(source).not.toContain('pH of 4.5–7.0')
    expect(source).not.toContain('usually requires heat to process')
    expect(source).not.toContain('often needing stronger solution or longer time')
    expect(source).not.toContain('Avoid shampooing for 48 hours')
    expect(source).not.toContain('a milder acid perm and careful strand testing are needed')
    expect(source).toContain('timing and heat use are product-specific')
    expect(source).toContain('manufacturer instructions rather than using one universal waiting period')
    expect(source).toContain('manufacturer guidance to determine whether and how to proceed')
  })

  it('hardens hydroxide/thio compatibility and does not use a strand test to override known incompatibility', () => {
    expect(source).not.toContain('Perform a compatibility strand test; hydroxide may still be present')
    expect(source).not.toContain('compatible with thio perms')
    expect(source).toContain('a strand test does not override a known incompatibility')
    expect(source).toContain('chemically incompatible unless verified product-system guidance explicitly supports the service')
    expect(source).toContain('do not assume other chemical services are compatible')
  })

  it('removes medical speculation and diagnostic scalp wording', () => {
    expect(source).not.toContain('Some medications change hair strength or scalp sensitivity')
    expect(source).not.toContain('abrasion, infection, or disease')
    expect(source).toContain('avoid diagnosing medication effects')
    expect(source).toContain('refer medical questions appropriately')
    expect(source).toContain('visibly irritated, abraded, open, or otherwise compromised')
  })

  it('does not define texturizers or chemical blowouts by a generic mild-formula/short-time rule', () => {
    expect(source).not.toContain('A mild relaxer formula that loosens curl pattern')
    expect(source).not.toContain('A mild relaxing service that loosens curl enough')
    expect(source).not.toContain('uses a milder formula and shorter processing')
    expect(source).toContain('do not define the difference only by shorter processing time')
    expect(source).toContain('product choice and processing follow the specific system')
    expect(source).toContain('exact chemistry and procedure depend on the selected product system')
  })

  it('removes student-facing board-certainty labels from the flashcard deck', () => {
    expect(source).not.toContain("category: 'Board Essential'")
    expect(source).not.toContain('BOARD ESSENTIAL')
    expect(source).not.toContain('38 Board Essential')
    expect(chapter17PremiumFlashcards.slice(0, 38).every((card) => card.category === 'Core Knowledge')).toBe(true)
  })

  it('keeps all flashcards structurally valid after the hardening pass', () => {
    for (const card of chapter17PremiumFlashcards) {
      expect(card.front.trim().length, card.id).toBeGreaterThan(0)
      expect(card.back.trim().length, card.id).toBeGreaterThan(0)
      expect(card.competency_id?.startsWith('CH17-C'), card.id).toBe(true)
      expect(card.chapter_id, card.id).toBe('ch-17')
      expect(card.is_active, card.id).toBe(true)
    }
  })
})
