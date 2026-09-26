import { describe, expect, it } from 'vitest'
import { chapter7PremiumFlashcards } from '../chapter-7-premium-flashcards'
import { chapter7FlashcardConceptMappings } from './mappings'

function deckText() {
  return JSON.stringify(chapter7PremiumFlashcards)
}

describe('Chapter 7 hardened flashcard deck', () => {
  it('preserves exactly 80 active cards with unique IDs', () => {
    const active = chapter7PremiumFlashcards.filter((card) => card.is_active)
    const ids = active.map((card) => card.id)
    expect(active).toHaveLength(80)
    expect(new Set(ids).size).toBe(80)
  })

  it('preserves one canonical concept mapping per active card', () => {
    const activeIds = chapter7PremiumFlashcards.filter((card) => card.is_active).map((card) => card.id).sort()
    const mappedIds = chapter7FlashcardConceptMappings.map((mapping) => mapping.flashcardId).sort()
    expect(mappedIds).toEqual(activeIds)
    expect(new Set(mappedIds).size).toBe(80)
  })

  it('removes legacy unsafe chemistry shortcuts', () => {
    const text = deckText()
    expect(text).not.toContain('living or once-living')
    expect(text).not.toContain('Organic substances burn')
    expect(text).not.toContain('Inorganic substances do NOT burn')
    expect(text).not.toContain('Chemical changes are permanent')
    expect(text).not.toContain('Physical changes are reversible')
  })

  it('keeps acid-alkali neutralization separate from permanent-wave oxidation neutralization', () => {
    const text = deckText()
    expect(text).not.toContain('neutralizing shampoo restores')
    expect(text).not.toContain('stops the chemical reaction')
    expect(text).toContain('oxidation neutralization')
    expect(text).toContain('different chemical processes')
  })

  it('removes universal shampoo schedules and universal pH prescriptions', () => {
    const text = deckText()
    expect(text).not.toContain('Use weekly, not daily')
    expect(text).not.toContain('ideal pH for shampoo')
    expect(text).not.toContain('must never touch the scalp')
  })

  it('removes unsupported universal patch-test and label requirements', () => {
    const text = deckText()
    expect(text).not.toContain('Required before haircolor, relaxers, perms, and depilatories')
    expect(text).not.toContain('must be on every professional product label')
    expect(text).toContain('product label')
    expect(text).toContain('manufacturer directions')
  })

  it('removes unverified BOARD EXAM labels from the deck', () => {
    expect(deckText()).not.toContain('BOARD EXAM')
  })

  it('does not expose the textbook publisher in runtime card copy', () => {
    expect(deckText().toLowerCase()).not.toContain('milady')
  })
})
