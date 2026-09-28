import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter14PremiumFlashcards } from '../chapter-14-premium-flashcards'
import {
  ACTIVE_CHAPTER14_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter14FlashcardConceptMappings,
  getChapter14FlashcardsForConcept,
} from './mappings'

const root = process.cwd()
const flashcardSource = readFileSync(join(root, 'src/lib/chapter-14-premium-flashcards.ts'), 'utf8')

describe('C14-3 flashcard audit and concept mapping', () => {
  it('retains all 112 active flashcards with stable unique IDs', () => {
    expect(chapter14PremiumFlashcards).toHaveLength(112)
    expect(chapter14PremiumFlashcards.every((card) => card.is_active)).toBe(true)

    const ids = chapter14PremiumFlashcards.map((card) => card.id)
    expect(new Set(ids).size).toBe(112)
    expect(ids[0]).toBe('fc-ch14-001')
    expect(ids[111]).toBe('fc-ch14-112')
  })

  it('maps every flashcard exactly once to a canonical Chapter 14 concept', () => {
    const ids = chapter14PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter14FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(mappedIds).toHaveLength(112)
    expect(new Set(mappedIds).size).toBe(112)
    expect([...mappedIds].sort()).toEqual([...ids].sort())

    for (const conceptId of ACTIVE_CHAPTER14_CONCEPT_FAMILY_IDS) {
      expect(getChapter14FlashcardsForConcept(conceptId).length, conceptId).toBeGreaterThan(0)
    }
  })

  it('contains no exact duplicate prompts or answers', () => {
    const fronts = chapter14PremiumFlashcards.map((card) => card.front.trim().toLowerCase())
    const backs = chapter14PremiumFlashcards.map((card) => card.back.trim().toLowerCase())

    expect(new Set(fronts).size).toBe(fronts.length)
    expect(new Set(backs).size).toBe(backs.length)
  })

  it('removes the source-sensitive and regulatory absolutes identified in C14-2', () => {
    expect(flashcardSource).not.toContain('State board exams typically require demonstrating true freehand clipper control')
    expect(flashcardSource).not.toContain('takes 6–12 months to complete and is permanent')
    expect(flashcardSource).not.toContain('Non-petroleum-based oils only')
    expect(flashcardSource).not.toContain('considered the best method for blending and tapering')
    expect(flashcardSource).not.toContain('Never cut into or above the natural hairline')
    expect(flashcardSource).not.toContain('client never leave the shop with damp hair')
    expect(flashcardSource).not.toContain('no more than ¼ inch')
    expect(flashcardSource).not.toContain('1–2 inches distributed around the head form')
    expect(flashcardSource).not.toContain('1-inch spacing rule')
  })

  it('preserves useful guard terminology while requiring current exam-rule verification', () => {
    expect(flashcardSource).toContain('detachable clipper blade sizes')
    expect(flashcardSource).toContain('Requirements vary by jurisdiction and testing provider')
    expect(flashcardSource).toContain('candidate bulletin and instructor guidance')
  })

  it('adds a real higher-complexity tier without making every card hard', () => {
    const counts = chapter14PremiumFlashcards.reduce<Record<string, number>>((acc, card) => {
      expect(card.difficulty).not.toBeNull()
      const difficulty = card.difficulty ?? 'missing'
      acc[difficulty] = (acc[difficulty] ?? 0) + 1
      return acc
    }, {})

    expect(counts.easy).toBe(75)
    expect(counts.medium).toBe(23)
    expect(counts.hard).toBe(14)
    expect(counts.hard).toBeGreaterThan(0)
    expect(counts.easy).toBeGreaterThan(counts.hard)
  })
})
