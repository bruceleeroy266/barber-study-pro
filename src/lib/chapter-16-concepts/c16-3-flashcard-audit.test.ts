import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter16PremiumFlashcards } from '../chapter-16-premium-flashcards'
import { ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS } from './concepts'
import {
  chapter16FlashcardConceptMappings,
  getChapter16FlashcardsForConcept,
} from './mappings'

const root = process.cwd()
const flashcardSource = readFileSync(join(root, 'src/lib/chapter-16-premium-flashcards.ts'), 'utf8')

describe('C16-3 flashcard audit and hardening', () => {
  it('retains all 68 active flashcards with stable unique IDs and order', () => {
    expect(chapter16PremiumFlashcards).toHaveLength(68)
    expect(chapter16PremiumFlashcards.every((card) => card.is_active)).toBe(true)

    const ids = chapter16PremiumFlashcards.map((card) => card.id)
    expect(new Set(ids).size).toBe(68)
    expect(ids[0]).toBe('fc-ch16-001')
    expect(ids[67]).toBe('fc-ch16-068')
    expect(chapter16PremiumFlashcards.map((card) => card.order_index)).toEqual(
      Array.from({ length: 68 }, (_, index) => index + 1),
    )
  })

  it('preserves the 43 Board Essential / 25 Professional Essential inventory split', () => {
    const counts = chapter16PremiumFlashcards.reduce<Record<string, number>>((acc, card) => {
      acc[card.category] = (acc[card.category] ?? 0) + 1
      return acc
    }, {})

    expect(counts['Board Essential']).toBe(43)
    expect(counts['Professional Essential']).toBe(25)
  })

  it('maps every flashcard exactly once to a canonical Chapter 16 concept', () => {
    const ids = chapter16PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter16FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(mappedIds).toHaveLength(68)
    expect(new Set(mappedIds).size).toBe(68)
    expect([...mappedIds].sort()).toEqual([...ids].sort())

    for (const conceptId of ACTIVE_CHAPTER16_CONCEPT_FAMILY_IDS) {
      expect(getChapter16FlashcardsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)
    }
  })

  it('contains no exact duplicate prompts or answers', () => {
    const fronts = chapter16PremiumFlashcards.map((card) => card.front.trim().toLowerCase())
    const backs = chapter16PremiumFlashcards.map((card) => card.back.trim().toLowerCase())

    expect(new Set(fronts).size).toBe(fronts.length)
    expect(new Set(backs).size).toBe(backs.length)
  })

  it('removes source-sensitive absolutes identified by the C16-2 lesson hardening', () => {
    expect(flashcardSource).not.toContain('which hair types is it inappropriate')
    expect(flashcardSource).not.toContain('It is not appropriate for fine, fragile, or highly porous hair')
    expect(flashcardSource).not.toContain('Why must **heat protectant** be applied')
    expect(flashcardSource).not.toContain('thermal tools never be applied to damp hair')
    expect(flashcardSource).not.toContain('healthy, coarse hair can tolerate more')
    expect(flashcardSource).not.toContain('When is a **blunt cut** the best choice')
    expect(flashcardSource).not.toContain('When is a **graduated cut** the best design choice')
    expect(flashcardSource).not.toContain('When is a **uniform-layered cut** the best choice')
    expect(flashcardSource).not.toContain('Hair wrapping smooths the cuticle')
    expect(flashcardSource).not.toContain('Airflow directed upward at the roots creates volume')
    expect(flashcardSource).not.toContain('Using them without a clear plan damages balance and design')
  })

  it('uses individualized and manufacturer-aware safety wording where C16-2 requires it', () => {
    expect(flashcardSource).toContain('The amount varies by client and curl pattern')
    expect(flashcardSource).toContain('Suitability depends on hair condition, texture, density, desired finish')
    expect(flashcardSource).toContain("follow the manufacturer's directions")
    expect(flashcardSource).toContain('lowest effective temperature')
    expect(flashcardSource).toContain('designed and labeled for damp or wet use')
    expect(flashcardSource).toContain('applicable rules, product directions, and school or shop procedures')
  })

  it('preserves the existing difficulty labels while keeping a real hard tier', () => {
    const counts = chapter16PremiumFlashcards.reduce<Record<string, number>>((acc, card) => {
      const difficulty = card.difficulty ?? 'missing'
      acc[difficulty] = (acc[difficulty] ?? 0) + 1
      return acc
    }, {})

    expect(counts.easy).toBe(26)
    expect(counts.medium).toBe(39)
    expect(counts.hard).toBe(3)
  })
})
