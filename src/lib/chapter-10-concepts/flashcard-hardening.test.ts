import { describe, expect, it } from 'vitest'
import { chapter10PremiumFlashcards } from '../chapter-10-premium-flashcards'
import {
  chapter10FlashcardConceptMappings,
  getChapter10FlashcardsForConcept,
} from './mappings'
import { CHAPTER10_CONCEPT_FAMILY_IDS } from './concepts'

const flashcardsText = JSON.stringify(chapter10PremiumFlashcards)

const KEEP_IDS = new Set(["fc-10-013","fc-10-019","fc-10-021","fc-10-022","fc-10-023","fc-10-031","fc-10-032","fc-10-041","fc-10-042","fc-10-058","fc-10-060","fc-10-064","fc-10-065","fc-10-066","fc-10-067","fc-10-070","fc-10-073","fc-10-074","fc-10-090","fc-10-093","fc-10-102","fc-10-103","fc-10-115","fc-10-117"])
const REWRITE_IDS = new Set(["fc-10-007","fc-10-010","fc-10-017","fc-10-018","fc-10-029","fc-10-035","fc-10-038","fc-10-046","fc-10-072","fc-10-083","fc-10-087","fc-10-088","fc-10-091","fc-10-092","fc-10-095","fc-10-096","fc-10-097","fc-10-099","fc-10-100","fc-10-101","fc-10-106","fc-10-107","fc-10-110","fc-10-116","fc-10-118"])
const REPAIR_IDS = new Set(["fc-10-001","fc-10-002","fc-10-003","fc-10-004","fc-10-005","fc-10-006","fc-10-008","fc-10-009","fc-10-011","fc-10-012","fc-10-014","fc-10-015","fc-10-016","fc-10-020","fc-10-024","fc-10-025","fc-10-026","fc-10-027","fc-10-028","fc-10-030","fc-10-033","fc-10-034","fc-10-036","fc-10-037","fc-10-039","fc-10-040","fc-10-043","fc-10-044","fc-10-045","fc-10-047","fc-10-048","fc-10-049","fc-10-050","fc-10-051","fc-10-052","fc-10-053","fc-10-054","fc-10-055","fc-10-056","fc-10-057","fc-10-059","fc-10-061","fc-10-062","fc-10-063","fc-10-068","fc-10-069","fc-10-071","fc-10-075","fc-10-076","fc-10-077","fc-10-078","fc-10-079","fc-10-080","fc-10-081","fc-10-082","fc-10-084","fc-10-085","fc-10-086","fc-10-089","fc-10-094","fc-10-098","fc-10-104","fc-10-105","fc-10-108","fc-10-109","fc-10-111","fc-10-112","fc-10-113","fc-10-114"])

describe('C10-3 flashcard source and concept hardening', () => {
  it('audits all 118 active cards exactly once as KEEP / REPAIR / REWRITE', () => {
    const runtimeIds = chapter10PremiumFlashcards.map((card) => card.id).sort()
    const classified = [...KEEP_IDS, ...REPAIR_IDS, ...REWRITE_IDS].sort()
    expect(runtimeIds).toHaveLength(118)
    expect(new Set(runtimeIds).size).toBe(118)
    expect(classified).toEqual(runtimeIds)
    expect(new Set(classified).size).toBe(118)
    expect(KEEP_IDS.size).toBe(24)
    expect(REPAIR_IDS.size).toBe(69)
    expect(REWRITE_IDS.size).toBe(25)
  })

  it('preserves the C10-1 one-to-one concept mapping for every flashcard', () => {
    const runtimeIds = chapter10PremiumFlashcards.map((card) => card.id).sort()
    const mappedIds = chapter10FlashcardConceptMappings.map((m) => m.flashcardId).sort()
    expect(mappedIds).toEqual(runtimeIds)
    expect(new Set(mappedIds).size).toBe(118)
  })

  it('keeps every canonical concept family represented by flashcards', () => {
    for (const conceptId of CHAPTER10_CONCEPT_FAMILY_IDS) {
      expect(getChapter10FlashcardsForConcept(conceptId).length).toBeGreaterThan(0)
    }
  })

  it('blocks unsupported or overstated legacy claims found in the adversarial audit', () => {
    const banned = [
      '63 million',
      'ONE-THIRD',
      '1/3 of hair strength',
      'up to 48 HOURS',
      'This distinction is important on the state board exam',
      'early detection of skin cancers',
      'TOTAL hair loss everywhere',
      'They are the SAME condition',
      'alopecia senilis',
      'alopecia syphilitica',
      'traction alopecia',
      'telogen effluvium',
      'cicatricial',
      'LANTHIONINE',
      'EXTREME HEAT',
      'no known negative side effects',
      'weight gain and loss of sexual function',
      '3 FEET',
      '1 mm',
      'Only LICENSED SURGEONS',
      'treatments for hair loss?',
      'poor nutrition, or internal disorders',
      'scutula',
    ]
    for (const phrase of banned) expect(flashcardsText).not.toContain(phrase)
  })

  it('retains source-recorded anchors after hardening', () => {
    for (const phrase of [
      '75–100 hairs per day',
      '2,200 strands per square inch',
      'Carbon 51%',
      'Oxygen 21%',
      'Hydrogen 6%',
      'Nitrogen 17%',
      'Sulfur 5%',
      '2–10 years',
      'less than 10% of scalp hair',
      '3–6 months',
      '½ inch per month',
      'alopecia totalis',
      'alopecia universalis',
      'pityriasis',
      'Malassezia',
      'tinea barbae',
      'tinea favosa',
      'pediculosis capitis',
      'scabies',
      'porosity',
      'elasticity',
    ]) {
      expect(flashcardsText.toLowerCase()).toContain(phrase.toLowerCase())
    }
  })
})
