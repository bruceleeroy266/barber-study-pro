import { describe, expect, it } from 'vitest'
import { chapter4PremiumFlashcards } from './chapter-4-premium-flashcards'
import { chapter4PremiumQuizQuestions } from './chapter-4-premium-quiz'
import { chapter4ReassessmentQuestions } from './chapter-4-reassessment-questions'
import { chapter4FlashcardConceptMappings } from './chapter-4-concepts/mappings'

describe('C4 source-book flashcard alignment', () => {
  const deck = JSON.stringify(chapter4PremiumFlashcards)

  it('locks a 70-card active deck with stable original ids and 20 appended ids', () => {
    expect(chapter4PremiumFlashcards).toHaveLength(70)
    expect(chapter4PremiumFlashcards.every((card) => card.is_active)).toBe(true)
    expect(chapter4PremiumFlashcards[0].id).toBe('fc-4-001')
    expect(chapter4PremiumFlashcards[49].id).toBe('fc-4-050')
    expect(chapter4PremiumFlashcards[50].id).toBe('fc-4-051')
    expect(chapter4PremiumFlashcards[69].id).toBe('fc-4-070')
    expect(new Set(chapter4PremiumFlashcards.map((card) => card.id)).size).toBe(70)
    expect(new Set(chapter4PremiumFlashcards.map((card) => card.front.trim().toLowerCase())).size).toBe(70)
  })

  it('maps every served flashcard exactly once across the six canonical families', () => {
    expect(chapter4FlashcardConceptMappings).toHaveLength(70)
    expect(new Set(chapter4FlashcardConceptMappings.map((m) => m.flashcardId)).size).toBe(70)
    const served = new Set(chapter4PremiumFlashcards.map((card) => card.id))
    for (const mapping of chapter4FlashcardConceptMappings) expect(served.has(mapping.flashcardId)).toBe(true)
  })

  it('covers all eight source-book learning objectives at flashcard level', () => {
    const objectiveEvidence: Record<string, string[]> = {
      LO1: ['OSHA', 'EPA', 'state agencies or boards', '16 sections', 'GHS'],
      LO2: ['Cocci are round', 'bacilli are rod-shaped', 'spirilla are spiral', 'binary fission', 'resistant spores'],
      LO3: ['direct and indirect transmission', 'Hepatitis B, hepatitis C, and HIV', 'Natural immunity', 'asymptomatic'],
      LO4: ['Cleaning removes visible soil', 'does not destroy bacterial spores', 'autoclave sterilizes compatible items'],
      LO5: ['Hospital disinfectants', 'tuberculocidal', 'quats', 'phenolics', 'antiseptic'],
      LO6: ['Standard Precautions', 'exposure incident', 'sharps container', 'handwashing'],
      LO7: ['GFCI', 'test water temperature', 'damaged equipment', 'ventilation', 'supportive footwear'],
      LO8: ['current Oklahoma rules', 'current authoritative requirement', 'multiuse products', 'cape neckband'],
    }

    for (const [objective, evidence] of Object.entries(objectiveEvidence)) {
      for (const term of evidence) {
        expect(deck.toLowerCase(), `${objective} missing flashcard evidence: ${term}`).toContain(term.toLowerCase())
      }
    }
  })

  it('removes the seven audited weak framings', () => {
    const forbidden = [
      'why should blood-exposure training avoid memorizing an outdated exam script',
      'a barber wipes a dropped clipper guard on a towel and wants to continue',
      'when is sterilization different from routine barber-tool disinfection',
      'why must work surfaces be addressed between clients',
      'why is an exposure-control plan important',
    ]
    for (const phrase of forbidden) expect(deck.toLowerCase()).not.toContain(phrase)
  })

  it('keeps the initial quiz and reassessment reserve unchanged during flashcard hardening', () => {
    expect(chapter4PremiumQuizQuestions).toHaveLength(30)
    expect(chapter4ReassessmentQuestions).toHaveLength(90)
  })

  it('keeps source-aligned flashcards in original ASCYN PRO wording', () => {
    expect(deck).not.toContain('Milady')
  })
})
