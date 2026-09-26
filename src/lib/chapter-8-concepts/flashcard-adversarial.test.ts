import { describe, expect, it } from 'vitest'
import { chapter8PremiumFlashcards } from '../chapter-8-premium-flashcards'
import { chapter8FlashcardConceptMappings } from './mappings'

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

describe('C8-4 Chapter 8 flashcard adversarial audit', () => {
  it('has no duplicate fronts or backs after normalization', () => {
    const fronts = chapter8PremiumFlashcards.map((card) => normalize(card.front))
    const backs = chapter8PremiumFlashcards.map((card) => normalize(card.back))

    expect(new Set(fronts).size).toBe(fronts.length)
    expect(new Set(backs).size).toBe(backs.length)
  })

  it('keeps every active flashcard mapped exactly once', () => {
    const activeIds = chapter8PremiumFlashcards
      .filter((card) => card.is_active)
      .map((card) => card.id)
    const mappedIds = chapter8FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(activeIds).toHaveLength(57)
    expect(mappedIds).toHaveLength(57)
    expect(new Set(mappedIds).size).toBe(57)
    expect(new Set(mappedIds)).toEqual(new Set(activeIds))
  })

  it('keeps the targeted expansion difficult and concept-specific', () => {
    const expansion = chapter8PremiumFlashcards.filter((card) => Number(card.id.slice(-3)) >= 51)
    expect(expansion).toHaveLength(7)
    expect(expansion.every((card) => card.difficulty === 'hard')).toBe(true)

    const mapping = new Map<string, string>(
      chapter8FlashcardConceptMappings.map((item) => [item.flashcardId, item.conceptFamilyId]),
    )
    expect(expansion.filter((card) => mapping.get(card.id) === 'ch8-microcurrent-high-frequency')).toHaveLength(3)
    expect(expansion.filter((card) => mapping.get(card.id) === 'ch8-light-therapy-safety')).toHaveLength(4)
  })

  it('removes obvious clueing and unsafe certainty language', () => {
    const deck = JSON.stringify(chapter8PremiumFlashcards).toLowerCase()
    const banned = [
      'board exam alert',
      'every state board exam',
      'always painless and safe',
      'absolute contraindications',
      '5 minutes max',
      '30–36 inch distance',
      'waiver does not protect',
      'professional negligence',
      'required near sinks and all water sources',
    ]

    for (const phrase of banned) {
      expect(deck).not.toContain(phrase)
    }
  })

  it('avoids excessive back-side verbosity in the targeted expansion', () => {
    const expansion = chapter8PremiumFlashcards.filter((card) => Number(card.id.slice(-3)) >= 51)
    for (const card of expansion) {
      expect(card.back.split(/\s+/).length).toBeLessThanOrEqual(70)
    }
  })

  it('requires application/safety reasoning in the targeted expansion', () => {
    const expansionText = chapter8PremiumFlashcards
      .filter((card) => Number(card.id.slice(-3)) >= 51)
      .map((card) => `${card.front} ${card.back}`.toLowerCase())

    const reasoningSignals = [
      'verify',
      'before proceeding',
      'stop the service',
      'screen',
      'manufacturer',
      'scope',
      'client',
      'do not proceed',
    ]

    for (const text of expansionText) {
      expect(reasoningSignals.some((signal) => text.includes(signal))).toBe(true)
    }
  })
})
