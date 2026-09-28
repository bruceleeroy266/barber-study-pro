import { describe, expect, it } from 'vitest'
import { chapter13PremiumFlashcards } from '../chapter-13-premium-flashcards'
import { chapter13PremiumQuizQuestions } from '../chapter-13-premium-quiz'
import { chapter13FlashcardConceptMappings } from './mappings'

const serialized = JSON.stringify(chapter13PremiumFlashcards)

describe('C13-3 90-flashcard source + concept hardening', () => {
  it('preserves all 90 active stable IDs and order indexes', () => {
    expect(chapter13PremiumFlashcards).toHaveLength(90)
    expect(chapter13PremiumFlashcards.every((card) => card.is_active)).toBe(true)
    expect(new Set(chapter13PremiumFlashcards.map((card) => card.id)).size).toBe(90)
    expect(chapter13PremiumFlashcards.map((card) => card.order_index)).toEqual(
      Array.from({ length: 90 }, (_, index) => index + 1),
    )
  })

  it('preserves one canonical concept mapping per flashcard', () => {
    expect(chapter13FlashcardConceptMappings).toHaveLength(90)
    expect(new Set(chapter13FlashcardConceptMappings.map((mapping) => mapping.flashcardId)).size).toBe(90)
    expect(new Set(chapter13FlashcardConceptMappings.map((mapping) => mapping.flashcardId))).toEqual(
      new Set(chapter13PremiumFlashcards.map((card) => card.id)),
    )
  })

  it('has no duplicate fronts or backs', () => {
    expect(new Set(chapter13PremiumFlashcards.map((card) => card.front)).size).toBe(90)
    expect(new Set(chapter13PremiumFlashcards.map((card) => card.back)).size).toBe(90)
  })

  it('adds application and safety difficulty without inflating the bank', () => {
    const difficulty = chapter13PremiumFlashcards.reduce<Record<string, number>>((acc, card) => {
      acc[card.difficulty] = (acc[card.difficulty] ?? 0) + 1
      return acc
    }, {})
    expect(difficulty).toEqual({ easy: 52, medium: 30, hard: 8 })
  })

  it('removes the high-risk medical, legal, and source-proximate wording flagged in C13-3', () => {
    const forbidden = [
      'if ingrown hairs are left untreated',
      'initiate a keloid condition',
      'lead to infection or ingrown hairs',
      'some states prohibit the use of conventional straight razors',
      'antihemorrhagic',
      'minimize less desirable ones',
      'camouflage flaws',
      'shaving requires careful attention, skill, and practice to perfect',
      'the term used to describe the correct angle of cutting with a razor',
    ]
    for (const phrase of forbidden) expect(serialized.toLowerCase()).not.toContain(phrase.toLowerCase())
  })

  it('keeps barbering scope and jurisdiction variability explicit', () => {
    expect(serialized).toContain('should not diagnose a medical condition')
    expect(serialized).toContain('outside barbering scope')
    expect(serialized).toContain('vary by jurisdiction')
    expect(serialized).toContain('rather than assuming one national rule')
  })

  it('retains source-supported high-value shaving concepts in original ASCYN wording', () => {
    expect(serialized).toContain('14 shaving areas')
    expect(serialized).toContain('Freehand, backhand, reverse freehand, and reverse backhand')
    expect(serialized).toContain('about 30 degrees or less')
    expect(serialized).toContain('roughly 1 to 3 inches')
    expect(serialized).toContain('approved sharps container')
    expect(serialized).toContain('standard precautions')
  })

  it('does not alter the 45-question assessment during the flashcard-only phase', () => {
    expect(chapter13PremiumQuizQuestions).toHaveLength(45)
    expect(chapter13PremiumQuizQuestions.reduce<Record<string, number>>((acc, question) => {
      acc[question.correct_answer] = (acc[question.correct_answer] ?? 0) + 1
      return acc
    }, {})).toEqual({ a: 45 })
  })
})
