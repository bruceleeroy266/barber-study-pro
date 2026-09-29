import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter15PremiumFlashcards } from '../chapter-15-premium-flashcards'
import { ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS } from './concepts'
import { chapter15FlashcardConceptMappings } from './mappings'
import {
  getFlashcardEvidenceConcept,
  getFlashcardEvidenceInventory,
} from '../concept-mastery/activity-evidence-registry'

const root = process.cwd()
const flashcardSource = readFileSync(join(root, 'src/lib/chapter-15-premium-flashcards.ts'), 'utf8')

describe('C15-3 flashcard source-grounding and concept certification', () => {
  it('preserves exactly 90 unique Chapter 15 flashcards with stable IDs', () => {
    const ids = chapter15PremiumFlashcards.map((card) => card.id)

    expect(ids).toHaveLength(90)
    expect(new Set(ids).size).toBe(90)
    expect(ids).toEqual(
      Array.from({ length: 90 }, (_, index) => `fc-ch15-${String(index + 1).padStart(3, '0')}`),
    )
  })

  it('preserves exact 90/90 C15-1 concept mappings', () => {
    const ids = chapter15PremiumFlashcards.map((card) => card.id)
    const mappedIds = chapter15FlashcardConceptMappings.map((mapping) => mapping.flashcardId)

    expect(mappedIds).toHaveLength(90)
    expect(new Set(mappedIds).size).toBe(90)
    expect([...mappedIds].sort()).toEqual([...ids].sort())

    for (const id of ids) {
      expect(getFlashcardEvidenceConcept('ch-15', id), id).not.toBeNull()
    }

    expect(getFlashcardEvidenceInventory('ch-15')).toHaveLength(90)
  })

  it('retains flashcard coverage for every active Chapter 15 concept family', () => {
    for (const conceptFamilyId of ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS) {
      expect(
        chapter15FlashcardConceptMappings.some((mapping) => mapping.conceptFamilyId === conceptFamilyId),
        conceptFamilyId,
      ).toBe(true)
    }
  })

  it('removes unsupported market, medical, regulatory, and exam-certainty claims', () => {
    const rejected = [
      'second fastest-growing category in barbering',
      'Moderately effective for about 50% of men after 4 months',
      'Weight gain and loss of sexual function',
      'Results can last a lifetime when performed properly',
      'Only physicians can prescribe medication',
      'State boards frequently test',
      'most frequently tested facts on state board exams',
      'Board Exam Trap:',
      'Keep release forms on file for at least three years',
    ]

    for (const phrase of rejected) {
      expect(flashcardSource, phrase).not.toContain(phrase)
    }
  })

  it('removes unsupported attachment, cure-time, maintenance, fit, and chemical-service absolutes', () => {
    const rejected = [
      'NEVER apply tape directly to lace',
      'fit perfectly, look seamless',
      'Most secure, waterproof',
      'must wait 24 to 48 hours before shampooing',
      'Clients need at least two systems for rotation',
      'Lightening (bleach) and cold-waving. These destroy the base material',
      'Use temporary color rinses only',
      'industry standard',
    ]

    for (const phrase of rejected) {
      expect(flashcardSource, phrase).not.toContain(phrase)
    }

    expect(flashcardSource).toContain('manufacturer’s cure and water-exposure instructions')
    expect(flashcardSource).toContain('A fixed 24–48-hour rule is not universal')
    expect(flashcardSource).toContain('Fiber type, base construction, prior processing, and manufacturer approval')
  })

  it('keeps medication and scope guidance referral-based and jurisdiction-aware', () => {
    expect(flashcardSource).toContain('permitted scope varies by jurisdiction')
    expect(flashcardSource).toContain('verify the scope rules where you practice')
    expect(flashcardSource).toContain('appropriate licensed healthcare professional')
    expect(flashcardSource).toContain('verified product labeling')
  })

  it('keeps flashcard hardening isolated from the 72-question assessment bank', () => {
    const quizSource = readFileSync(join(root, 'src/lib/chapter-15-premium-quiz.ts'), 'utf8')
    expect((quizSource.match(/id: 'qq-15-/g) ?? [])).toHaveLength(72)
    expect(quizSource).toContain("id: 'qq-15-072'")
  })
})
