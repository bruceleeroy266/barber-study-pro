import { describe, expect, it } from 'vitest'
import { chapter11PremiumFlashcards } from '../chapter-11-premium-flashcards'
import { chapter11FlashcardConceptMappings } from './mappings'
import {
  CHAPTER11_FLASHCARD_HARDENING_CLASSIFICATION,
  CHAPTER11_FLASHCARD_KEEP,
  CHAPTER11_FLASHCARD_REPAIR,
  CHAPTER11_FLASHCARD_REWRITE,
} from './flashcard-hardening'

describe('C11-3 flashcard source & concept hardening', () => {
  it('classifies all 80 cards exactly once as KEEP / REPAIR / REWRITE', () => {
    expect(CHAPTER11_FLASHCARD_KEEP).toHaveLength(20)
    expect(CHAPTER11_FLASHCARD_REPAIR).toHaveLength(22)
    expect(CHAPTER11_FLASHCARD_REWRITE).toHaveLength(38)

    const classified = [
      ...CHAPTER11_FLASHCARD_KEEP,
      ...CHAPTER11_FLASHCARD_REPAIR,
      ...CHAPTER11_FLASHCARD_REWRITE,
    ]
    expect(classified).toHaveLength(80)
    expect(new Set(classified).size).toBe(80)
    expect(Object.keys(CHAPTER11_FLASHCARD_HARDENING_CLASSIFICATION)).toHaveLength(80)
    expect(new Set(classified)).toEqual(new Set(chapter11PremiumFlashcards.map((card) => card.id)))
  })

  it('preserves stable IDs, order, active state, and one canonical concept mapping per card', () => {
    expect(chapter11PremiumFlashcards).toHaveLength(80)
    expect(chapter11PremiumFlashcards.map((card) => card.id)).toEqual(
      Array.from({ length: 80 }, (_, index) => `fc-11-${String(index + 1).padStart(3, '0')}`),
    )
    expect(chapter11PremiumFlashcards.map((card) => card.order_index)).toEqual(
      Array.from({ length: 80 }, (_, index) => index + 1),
    )
    expect(chapter11PremiumFlashcards.every((card) => card.is_active)).toBe(true)

    expect(chapter11FlashcardConceptMappings).toHaveLength(80)
    expect(new Set(chapter11FlashcardConceptMappings.map((mapping) => mapping.flashcardId)).size).toBe(80)
    expect(new Set(chapter11FlashcardConceptMappings.map((mapping) => mapping.flashcardId))).toEqual(
      new Set(chapter11PremiumFlashcards.map((card) => card.id)),
    )
  })

  it('removes unsupported carryover and overbroad claims from the hardened deck', () => {
    const runtime = JSON.stringify(chapter11PremiumFlashcards).toLowerCase()

    for (const phrase of [
      '4.5 to 7.5',
      '3.0 to 5.5',
      'medicinal product',
      'pyrithione zinc',
      'selenium sulfide',
      'ketoconazole',
      'pityriasis capitis simplex',
      'pityriasis steatoides',
      'seborrheic dermatitis',
      'skin cancer',
      'hypertrophy',
      'current research has determined dandruff is not contagious',
      'tinea',
      'gloves as a precautionary measure',
      'five senses used during hair and scalp analysis',
      'approximately 100,000',
      '140,000 strands',
      '80,000 strands',
      'out-of-shop services',
      'liquid-dry or powder shampoos',
      'refer the client to a physician or pharmacist',
    ]) {
      expect(runtime).not.toContain(phrase)
    }
  })

  it('retains the Chapter 11 source anchors needed for the eight concept families', () => {
    const runtime = JSON.stringify(chapter11PremiumFlashcards).toLowerCase()

    for (const phrase of [
      'waterproof shampoo cape',
      'reclined method',
      'inclined method',
      'water temperature',
      'texture',
      'density',
      'porosity',
      'elasticity',
      'rotary movement',
      'sliding movement',
      'back-and-forth movement',
      'blood and lymph flow',
      'cleanliness and stimulation',
      'malassezia',
      'scalp steam',
      'hot towel',
      'electric massager',
      'intensity',
      'duration',
      'once a week for several weeks',
      'parasitic infestations',
      'staphylococcal infections',
      'refer the client to a physician',
      'wheelchair-bound client',
    ]) {
      expect(runtime).toContain(phrase)
    }
  })
})
