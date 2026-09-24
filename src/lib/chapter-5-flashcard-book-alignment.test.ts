import { describe, expect, it } from 'vitest'
import { chapter5PremiumFlashcards } from './chapter-5-premium-flashcards'
import { chapter5PremiumQuizQuestions } from './chapter-5-premium-quiz'
import { chapter5FlashcardConceptMappings } from './chapter-5-concepts/mappings'

describe('C5 source-book flashcard alignment', () => {
  const deck = JSON.stringify(chapter5PremiumFlashcards)

  it('locks a 90-card active deck with stable original ids and 20 appended source-alignment ids', () => {
    expect(chapter5PremiumFlashcards).toHaveLength(90)
    expect(chapter5PremiumFlashcards.every((card) => card.is_active)).toBe(true)
    expect(chapter5PremiumFlashcards[0].id).toBe('fc-5-001')
    expect(chapter5PremiumFlashcards[69].id).toBe('fc-5-070')
    expect(chapter5PremiumFlashcards[70].id).toBe('fc-5-071')
    expect(chapter5PremiumFlashcards[89].id).toBe('fc-5-090')
    expect(new Set(chapter5PremiumFlashcards.map((card) => card.id)).size).toBe(90)
    expect(new Set(chapter5PremiumFlashcards.map((card) => card.front.trim().toLowerCase())).size).toBe(90)
  })

  it('maps every served flashcard exactly once into the six-family Chapter 5 architecture', () => {
    expect(chapter5FlashcardConceptMappings).toHaveLength(90)
    expect(new Set(chapter5FlashcardConceptMappings.map((mapping) => mapping.flashcardId)).size).toBe(90)
    const served = new Set(chapter5PremiumFlashcards.map((card) => card.id))
    for (const mapping of chapter5FlashcardConceptMappings) expect(served.has(mapping.flashcardId)).toBe(true)
  })

  it('covers all 18 source-book objectives at flashcard level', () => {
    const objectiveEvidence: Record<string, string[]> = {
      LO1: ['clippers and trimmers', 'straight razor', 'blowdryer'],
      LO2: ['graphite', 'TAIL COMB', 'NATURAL BRISTLE'],
      LO3: ['FRENCH', 'GERMAN', 'moving blade, still blade, points, cutting edges, shanks'],
      LO4: ['Opposing', 'Offset', 'Crane', 'thinning/texturizing', 'blending'],
      LO5: ['ring finger', 'palming'],
      LO6: ['Clean and disinfect after use', 'protect the shears from drops'],
      LO7: ['Rotary, pivot, and magnetic', 'DETACHABLE-BLADE', 'ADJUSTABLE-BLADE'],
      LO8: ['T-blade', 'light pressure', 'cordless'],
      LO9: ['carbon-steel and ceramic', '00000', 'do not set outliner blades flush'],
      LO10: ['Changeable-blade razors', 'Head, back, shoulder, tang, handle, point, edge, blade, heel, shank, and pivot'],
      LO11: ['razor shaper/hair razor', 'texturizing or shaping hair'],
      LO12: ['shaving, honing/stropping, haircutting, and palming with a comb', 'blade can lie flat against the hone or strop'],
      LO13: ['Balance, temper, grind, finish, size, and style', '5/8 inch', '7/8 inch'],
      LO14: ['even diagonal strokes', 'gradually lighten pressure'],
      LO15: ['rolling the razor on its back', 'even diagonal strokes'],
      LO16: ['BARBER CHAIR', 'latherizer', 'electric massager', 'comedone extractors', 'tweezers'],
      LO17: ['vacuum method', 'towel wrapping should cover the working hand'],
      LO18: ['Prepare and section the hair', 'protect the scalp from contact'],
    }

    for (const [objective, evidence] of Object.entries(objectiveEvidence)) {
      for (const term of evidence) {
        expect(deck.toLowerCase(), `${objective} missing flashcard evidence: ${term}`).toContain(term.toLowerCase())
      }
    }
  })

  it('removes the audited stale or unsupported flashcard claims while preserving the 50-question quiz boundary', () => {
    const forbidden = [
      'two most durable and heat-resistant comb materials',
      'fixed blades are single-length and more powerful',
      'zero-gap means',
      '1000 -> 4000 -> 8000 grit',
      'done every 2-3 months',
      'crushes the cutting edge and ruins the blade',
      'lithium-ion batteries provide consistent power until depleted',
      'reverse freehand is the taught grip for this upper-lip scenario',
      'replace the dull blade before your next client',
      'this 5-second test',
    ]
    for (const phrase of forbidden) expect(deck.toLowerCase()).not.toContain(phrase.toLowerCase())
    expect(chapter5PremiumQuizQuestions).toHaveLength(50)
  })

  it('keeps source-aligned flashcards in ASCYN PRO wording rather than source-brand copy', () => {
    expect(deck).not.toContain('Milady')
  })
})
