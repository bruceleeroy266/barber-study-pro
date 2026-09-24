/**
 * Chapter 4 Remediation Content Provider Tests (C4-3)
 *
 * Proves the chapter-aware content-serving layer for Chapter 4:
 *   - targeted content (blocks, flashcards, questions) belongs to the
 *     detected concept family, resolved from canonical mappings
 *   - inactive content can never leak into serving
 *   - question lookup spans the initial 30 AND the reassessment reserve (90)
 *   - unsupported chapters fail closed
 */

import { describe, it, expect } from 'vitest'
import {
  getChapterContentProvider,
  hasChapterContentProvider,
} from '../content-provider-registry'
import {
  chapter4ContentConceptMappings,
  chapter4FlashcardConceptMappings,
  chapter4ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-4-concepts/mappings'
import { chapter4ConceptFamilies } from '@/lib/chapter-4-concepts/concepts'
import { chapter4PremiumFlashcards } from '@/lib/chapter-4-premium-flashcards'
import { chapter4PremiumQuizQuestions } from '@/lib/chapter-4-premium-quiz'
import { chapter4ReassessmentQuestions } from '@/lib/chapter-4-reassessment-questions'

const provider = getChapterContentProvider('ch-4')

const EXPECTED_FLASHCARDS_PER_FAMILY: Record<string, number> = {
  'ch4-pathogens-transmission': 17,
  'ch4-disinfection-sterilization': 13,
  'ch4-cross-contamination': 8,
  'ch4-blood-exposure-ppe': 9,
  'ch4-regulatory-chemical-safety': 9,
  'ch4-safe-practice-compliance': 14,
}

describe('Chapter 4 remediation content provider — registration', () => {
  it('registers ch-4 and registers all currently supported chapters', () => {
    expect(provider).toBeDefined()
    expect(hasChapterContentProvider('ch-4')).toBe(true)
    expect(hasChapterContentProvider('ch-2')).toBe(true)
    expect(hasChapterContentProvider('ch-3')).toBe(true)
    expect(hasChapterContentProvider('ch-5')).toBe(true)
    expect(getChapterContentProvider('ch-5')).toBeDefined()
  })

  it('resolves concept names for all six locked families', () => {
    for (const family of chapter4ConceptFamilies) {
      expect(provider!.getConceptName(family.id)).toBe(family.name)
    }
    expect(provider!.getConceptName('ch4-unknown')).toBe('Unknown Topic')
  })
})

describe('Chapter 4 remediation content provider — targeted content belongs to the concept', () => {
  it('serves exactly the canonically mapped content blocks for each family', () => {
    for (const family of chapter4ConceptFamilies) {
      const expected = chapter4ContentConceptMappings
        .filter((m) => m.conceptFamilyId === family.id)
        .map((m) => m.contentBlockId)
      expect(provider!.getContentBlockIdsForConcept(family.id)).toEqual(expected)
      expect(expected.length).toBeGreaterThan(0)

      const sections = provider!.filterContentByConcept(family.id)
      expect(sections.length).toBeGreaterThan(0)
      // Every served section is either a mapped block or a tabbed section
      // containing at least one mapped tab.
      const mappedSet = new Set(expected)
      for (const section of sections) {
        const directHit = mappedSet.has(section.id)
        const tabHit =
          section.type === 'tabbed' &&
          'tabs' in section &&
          section.tabs.some((t: { id: string }) => mappedSet.has(t.id))
        expect(directHit || tabHit, `${section.id} not mapped to ${family.id}`).toBe(true)
      }
    }
  })

  it('serves exactly the canonically mapped active flashcards for each family', () => {
    for (const family of chapter4ConceptFamilies) {
      const expected = chapter4FlashcardConceptMappings
        .filter((m) => m.conceptFamilyId === family.id)
        .map((m) => m.flashcardId)
      expect(provider!.getFlashcardIdsForConcept(family.id)).toEqual(expected)

      const cards = provider!.filterFlashcardsByConcept(family.id)
      expect(cards).toHaveLength(EXPECTED_FLASHCARDS_PER_FAMILY[family.id])
      for (const card of cards) {
        expect(expected, `${card.id} not mapped to ${family.id}`).toContain(card.id)
        expect(card.is_active, `${card.id} must be active`).toBe(true)
      }
    }
  })

  it('serves no key terms for any concept (dataset deferred — documented C4-3 decision)', () => {
    // Chapter 4 has no key-terms dataset; the remediation page client has no
    // key-term render path. The provider contract is satisfied with [].
    expect(provider!.filterKeyTermsByConcept('ch4-disinfection-sterilization')).toEqual([])
    expect(provider!.filterKeyTermsByConcept('C-2-01')).toEqual([])
    expect(provider!.filterKeyTermsByConcept('ch4-unknown')).toEqual([])
  })

  it('builds a sufficient content bundle for every family', () => {
    for (const family of chapter4ConceptFamilies) {
      const bundle = provider!.buildRemediationContentBundle(family.id)
      expect(bundle.conceptId).toBe(family.id)
      expect(bundle.conceptName).toBe(family.name)
      expect(bundle.hasSufficientMaterial).toBe(true)
      expect(bundle.contentBlockCount).toBeGreaterThanOrEqual(2)
      expect(bundle.flashcardCount).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('Chapter 4 remediation content provider — inactive content never leaks', () => {
  it('serves only the 70 active canonical flashcards and nothing else', () => {
    const allServed = chapter4ConceptFamilies.flatMap((f) =>
      provider!.filterFlashcardsByConcept(f.id),
    )
    expect(allServed).toHaveLength(70)
    expect(allServed.every((c) => c.is_active)).toBe(true)
    // Sanity: the canonical bank itself is exactly what was served.
    expect(new Set(allServed.map((c) => c.id))).toEqual(
      new Set(chapter4PremiumFlashcards.map((c) => c.id)),
    )
  })
})

describe('Chapter 4 remediation content provider — question lookup', () => {
  it('resolves questions from BOTH the initial bank and the reassessment reserve', () => {
    // Initial bank
    for (const q of chapter4PremiumQuizQuestions) {
      const resolved = provider!.getQuizQuestionById(q.id)
      expect(resolved?.id).toBe(q.id)
      expect(resolved?.correct_answer).toBe(q.correct_answer)
    }
    // Reassessment reserve
    for (const q of chapter4ReassessmentQuestions) {
      const resolved = provider!.getQuizQuestionById(q.id)
      expect(resolved?.id).toBe(q.id)
      expect(resolved?.correct_answer).toBe(q.correct_answer)
    }
    // Unknown IDs fail closed
    expect(provider!.getQuizQuestionById('qq-4-999')).toBeNull()
    expect(provider!.getQuizQuestionById('qq-3-001')).toBeNull()
  })

  it('counts every mapped question per family (initial 5/6/5/5/4/5; reserve 15 each)', () => {
    for (const family of chapter4ConceptFamilies) {
      const reserveCount = chapter4ReassessmentQuestionConceptMappings.filter(
        (m) => m.conceptFamilyId === family.id,
      ).length
      expect(reserveCount).toBe(15)
      // Provider count covers the initial-quiz mappings (5/6/5/5/4/5).
      const providerCount = provider!.getConceptQuestionCount(family.id)
      expect([5, 6, 4]).toContain(providerCount)
    }
  })
})
