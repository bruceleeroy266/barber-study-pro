import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter12PremiumFlashcards } from '../chapter-12-premium-flashcards'
import {
  chapter12FlashcardConceptMappings,
} from './mappings'
import {
  ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS,
} from './concepts'

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

describe('C12-3 flashcard audit and concept-mapping hardening', () => {
  it('retains all 115 stable active Chapter 12 flashcards', () => {
    expect(chapter12PremiumFlashcards).toHaveLength(115)
    expect(chapter12PremiumFlashcards.filter((card) => card.is_active)).toHaveLength(115)
    const ids = chapter12PremiumFlashcards.map((card) => card.id)
    expect(new Set(ids).size).toBe(115)
    expect(ids[0]).toBe('fc-ch12-001')
    expect(ids[114]).toBe('fc-ch12-115')
  })

  it('maps every active card exactly once to a canonical Chapter 12 concept', () => {
    const ids = chapter12PremiumFlashcards.map((card) => card.id)
    const mapped = chapter12FlashcardConceptMappings.map((mapping) => mapping.flashcardId)
    expect(mapped).toHaveLength(115)
    expect(new Set(mapped).size).toBe(115)
    expect([...mapped].sort()).toEqual([...ids].sort())

    const canonical = new Set(ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS)
    for (const mapping of chapter12FlashcardConceptMappings) {
      expect(canonical.has(mapping.conceptFamilyId), mapping.flashcardId).toBe(true)
    }
  })

  it('has no duplicate card fronts or backs', () => {
    const fronts = chapter12PremiumFlashcards.map((card) => normalize(card.front))
    const backs = chapter12PremiumFlashcards.map((card) => normalize(card.back))
    expect(new Set(fronts).size).toBe(115)
    expect(new Set(backs).size).toBe(115)
  })

  it('does not reintroduce rejected unsupported certainty, numeric, or medical-service claims', () => {
    const bank = chapter12PremiumFlashcards
      .map((card) => `${card.front}\n${card.back}`)
      .join('\n')

    const rejected = [
      'approximately 25% thicker',
      '120-140°F',
      '1000x its weight',
      'removes toxins',
      'therapy your clients will pay for',
      'appear on every state board exam',
      'Miss them, and you fail',
      'Diabetes is a relative contraindication',
      'Accutane (isotretinoin) — skin is extremely thin and sensitive',
      'Uncontrolled high blood pressure — massage can elevate it further',
      'deep pore cleansing',
      'calming and germicidal',
    ]

    for (const phrase of rejected) {
      expect(bank, phrase).not.toContain(phrase)
    }
  })

  it('keeps safety, equipment, and product-selection evidence in their correct primary concepts', () => {
    const map = new Map(
      chapter12FlashcardConceptMappings.map((mapping) => [
        mapping.flashcardId,
        mapping.conceptFamilyId,
      ]),
    )

    expect(map.get('fc-ch12-103')).toBe('ch12-equipment-electrotherapy')
    expect(map.get('fc-ch12-104')).toBe('ch12-equipment-electrotherapy')
    expect(map.get('fc-ch12-105')).toBe('ch12-skin-analysis-product-selection')
    expect(map.get('fc-ch12-106')).toBe('ch12-skin-analysis-product-selection')
    expect(map.get('fc-ch12-107')).toBe('ch12-contraindications-service-safety')

    const safetyIds = [
      'fc-ch12-050',
      'fc-ch12-054',
      'fc-ch12-056',
      'fc-ch12-066',
      'fc-ch12-079',
      'fc-ch12-081',
    ] as const

    for (const id of safetyIds) {
      expect(map.get(id), id).toBe('ch12-contraindications-service-safety')
    }
  })

  it('keeps the flashcard bank source limitation explicit', () => {
    const text = readFileSync(
      join(process.cwd(), 'src/lib/chapter-12-premium-flashcards.ts'),
      'utf8',
    )
    expect(text).toContain('not a fresh page-by-page textbook verification')
    expect(text).not.toContain('Created strictly from Chapter 12 textbook images')
  })
})
