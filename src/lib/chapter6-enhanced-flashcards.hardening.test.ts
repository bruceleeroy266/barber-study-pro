import { describe, expect, it } from 'vitest'
import { chapter6AllEnhanced } from './chapter6-enhanced-flashcards'
import { ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS } from './chapter-6-concepts/concepts'
import { getChapter6ConceptForFlashcard, getChapter6FlashcardEvidenceCount } from './chapter-6-concepts/mappings'

describe('Chapter 6 C6-4 flashcard hardening', () => {
  it('locks the deck at exactly 105 cards', () => {
    expect(chapter6AllEnhanced).toHaveLength(105)
  })

  it('removes easy recall-only cards', () => {
    expect(chapter6AllEnhanced.some((card) => card.difficulty === 'easy')).toBe(false)
    const applicationCue = /\b(BEST|MOST|PRIMARY|Which|Why|How|What should|A client|A barber|A student|A question|During|What is the BEST)\b/
    for (const card of chapter6AllEnhanced) expect(card.front).toMatch(applicationCue)
  })

  it('keeps every concept family represented with diagnostic depth', () => {
    for (const id of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS) {
      expect(getChapter6FlashcardEvidenceCount(id)).toBeGreaterThanOrEqual(7)
    }
    for (let index = 0; index < chapter6AllEnhanced.length; index++) {
      const id = `fc-6-${String(index + 1).padStart(3, '0')}`
      expect(getChapter6ConceptForFlashcard(id)).not.toBeNull()
    }
  })

  it('prevents known legacy content defects from returning', () => {
    const serialized = JSON.stringify(chapter6AllEnhanced)
    const forbidden = [
      'What are the 14 bones of the face that barbers should know?',
      'epicranius (occipitofrontalis) consists of four muscles',
      'coordinate to open and close the mouth',
      'healthy protoplasm means healthy skin and hair cells',
      'heat (opens pores and increases cell metabolism)',
      'recognize nerve-related conditions',
      'Every square inch of skin contains thousands',
      'Skin health reflects kidney function',
      'controls all other endocrine glands',
    ]
    for (const phrase of forbidden) expect(serialized).not.toContain(phrase)
  })

  it('preserves scope-safe referral language in higher-risk concepts', () => {
    const serialized = JSON.stringify(chapter6AllEnhanced)
    expect(serialized).toContain('avoid diagnosis')
    expect(serialized).toContain('recommend appropriate medical evaluation')
    expect(serialized).toContain('do not diagnose')
  })
})
