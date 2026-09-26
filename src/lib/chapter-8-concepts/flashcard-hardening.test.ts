import { describe, expect, it } from 'vitest'
import { chapter8PremiumFlashcards } from '../chapter-8-premium-flashcards'
import {
  chapter8FlashcardConceptMappings,
} from './mappings'

const serializedDeck = () => JSON.stringify(chapter8PremiumFlashcards)

describe('C8-4 hardened Chapter 8 flashcards', () => {
  it('preserves the certified 50-card baseline and every existing ID', () => {
    const ids = chapter8PremiumFlashcards.map((card) => card.id)
    expect(chapter8PremiumFlashcards).toHaveLength(50)
    expect(new Set(ids).size).toBe(50)
    expect(ids).toEqual(
      Array.from({ length: 50 }, (_, index) =>
        `fc-8-${String(index + 1).padStart(3, '0')}`,
      ),
    )
    expect(chapter8PremiumFlashcards.every((card) => card.is_active)).toBe(true)
  })

  it('removes legacy board-exam certainty and unsafe universal rules', () => {
    const deck = serializedDeck().toLowerCase()
    const banned = [
      'board exam alert',
      'every state board exam',
      'required near sinks and all water sources',
      '5 minutes or less per area',
      '30–36 inch distance',
      'approximately 30 inches',
      'absolute contraindications',
      'waiver does not protect you from liability',
      'professional negligence',
      '80% of the circuit breaker rating',
      'water turns insulators into conductors',
    ]

    for (const phrase of banned) {
      expect(deck).not.toContain(phrase)
    }
  })

  it('keeps scope, device directions, and supervision visible in the hardened deck', () => {
    const deck = serializedDeck().toLowerCase()
    expect(deck).toContain('scope')
    expect(deck).toContain('manufacturer')
    expect(deck).toContain('client')
    expect(deck).toContain('never leave the client unattended')
  })

  it('preserves exactly one primary concept mapping per current flashcard', () => {
    expect(chapter8FlashcardConceptMappings).toHaveLength(50)
    expect(new Set(chapter8FlashcardConceptMappings.map((mapping) => mapping.flashcardId)).size).toBe(50)
  })

  it('documents the remaining thin concept families before expansion', () => {
    const counts = chapter8FlashcardConceptMappings.reduce<Record<string, number>>(
      (result, mapping) => {
        result[mapping.conceptFamilyId] = (result[mapping.conceptFamilyId] ?? 0) + 1
        return result
      },
      {},
    )

    expect(counts['ch8-microcurrent-high-frequency']).toBe(2)
    expect(counts['ch8-light-therapy-safety']).toBe(1)
  })
})
