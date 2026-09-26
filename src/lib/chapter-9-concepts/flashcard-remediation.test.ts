import { describe, expect, it } from 'vitest'
import { chapter9PremiumFlashcards } from '@/lib/chapter-9-premium-flashcards'
import { chapter9FlashcardConceptMappings } from './mappings'

const allText = chapter9PremiumFlashcards
  .map((card) => `${card.front}\n${card.back}`)
  .join('\n')

describe('C9-3 flashcard remediation certification', () => {
  it('preserves exactly 50 unique active Chapter 9 flashcards', () => {
    expect(chapter9PremiumFlashcards).toHaveLength(50)
    expect(new Set(chapter9PremiumFlashcards.map((card) => card.id)).size).toBe(50)
    expect(chapter9PremiumFlashcards.every((card) => card.is_active)).toBe(true)
    expect(chapter9PremiumFlashcards.map((card) => card.order_index)).toEqual(
      Array.from({ length: 50 }, (_, index) => index + 1)
    )
  })

  it('maps every flashcard to exactly one canonical concept family', () => {
    expect(chapter9FlashcardConceptMappings).toHaveLength(50)
    const mappedIds = chapter9FlashcardConceptMappings.map((mapping) => mapping.flashcardId)
    expect(new Set(mappedIds).size).toBe(50)
    expect(new Set(mappedIds)).toEqual(new Set(chapter9PremiumFlashcards.map((card) => card.id)))
  })

  it('keeps high-risk unsupported certainty out of the bank', () => {
    const banned = [
      'BOARD EXAM ALERT',
      'EVERY board exam',
      '100% fatal',
      '99% 5-year',
      '27%',
      '80% of cases',
      '20% of cases',
      'license suspension',
      'HALF (50%)',
      'Dermatology Authority',
      'sanitation violation',
      'could save a client\'s life',
      'save their life',
    ]

    for (const phrase of banned) {
      expect(allText.toLowerCase()).not.toContain(phrase.toLowerCase())
    }
  })

  it('certifies the six rewritten cards against the locked remediation targets', () => {
    const byId = new Map(chapter9PremiumFlashcards.map((card) => [card.id, card]))

    expect(byId.get('fc-9-004')?.front).toContain('blood and lymph')
    expect(byId.get('fc-9-022')?.back).toContain('does not by itself prove a specific diagnosis')
    expect(byId.get('fc-9-034')?.back).toContain('Do not treat the terms as interchangeable')
    expect(byId.get('fc-9-042')?.back).toContain('without diagnosing or prescribing individualized medical care')
    expect(byId.get('fc-9-046')?.back).toContain('diagnosis belongs to qualified medical professionals')
    expect(byId.get('fc-9-048')?.back).toContain('not memorizing survival percentages')
  })

  it('keeps professional scope and referral boundaries explicit', () => {
    expect(allText).toContain('without diagnosing')
    expect(allText).toContain('school/state sanitation requirements')
    expect(allText).toContain('qualified medical evaluation')
    expect(allText).toContain('outside barbering scope')
  })
})
