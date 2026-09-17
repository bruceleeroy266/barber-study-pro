/**
 * Chapter 3 Remediation Content Provider Tests (C3-3 Stage 1)
 *
 * Proves the chapter-aware content-serving layer for Chapter 3:
 *   - targeted content (blocks, flashcards, key terms, questions) belongs to
 *     the detected concept family, resolved from canonical mappings
 *   - inactive / enrichment / retired content can never leak into serving
 *   - question lookup spans the initial 30 AND the reassessment reserve
 *   - unsupported chapters fail closed
 */

import { describe, it, expect } from 'vitest'
import {
  getChapterContentProvider,
  hasChapterContentProvider,
} from '../content-provider-registry'
import {
  chapter3ContentConceptMappings,
  chapter3FlashcardConceptMappings,
  chapter3ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-3-concepts/mappings'
import { chapter3ConceptFamilies } from '@/lib/chapter-3-concepts/concepts'
import {
  chapter3PremiumFlashcards,
  chapter3EnrichmentFlashcards,
  chapter3RetiredFlashcards,
} from '@/lib/chapter-3-premium-flashcards'
import { chapter3PremiumQuizQuestions } from '@/lib/chapter-3-premium-quiz'
import { chapter3ReassessmentQuestions } from '@/lib/chapter-3-reassessment-questions'
import { chapter3KeyTerms } from '@/lib/chapter-3-key-terms'

const provider = getChapterContentProvider('ch-3')

describe('Chapter 3 remediation content provider — registration', () => {
  it('registers ch-3 and fails closed for unsupported chapters', () => {
    expect(provider).toBeDefined()
    expect(hasChapterContentProvider('ch-3')).toBe(true)
    expect(hasChapterContentProvider('ch-2')).toBe(true)
    expect(hasChapterContentProvider('ch-5')).toBe(false)
    expect(getChapterContentProvider('ch-5')).toBeUndefined()
  })

  it('resolves concept names for all four locked families', () => {
    for (const family of chapter3ConceptFamilies) {
      expect(provider!.getConceptName(family.id)).toBe(family.name)
    }
    expect(provider!.getConceptName('ch3-unknown')).toBe('Unknown Topic')
  })
})

describe('Chapter 3 remediation content provider — targeted content belongs to the concept', () => {
  it('serves exactly the canonically mapped content blocks for each family', () => {
    for (const family of chapter3ConceptFamilies) {
      const expected = chapter3ContentConceptMappings
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

  it('serves exactly the canonically mapped active flashcards for each family (12 each)', () => {
    for (const family of chapter3ConceptFamilies) {
      const expected = chapter3FlashcardConceptMappings
        .filter((m) => m.conceptFamilyId === family.id)
        .map((m) => m.flashcardId)
      expect(provider!.getFlashcardIdsForConcept(family.id)).toEqual(expected)

      const cards = provider!.filterFlashcardsByConcept(family.id)
      expect(cards).toHaveLength(12)
      for (const card of cards) {
        expect(expected, `${card.id} not mapped to ${family.id}`).toContain(card.id)
        expect(card.is_active, `${card.id} must be active`).toBe(true)
      }
    }
  })

  it('serves key terms bound to each family and none outside it', () => {
    const ergonomicsTerms = provider!.filterKeyTermsByConcept('ch3-ergonomics')
    const expected = chapter3KeyTerms.filter((t) => t.conceptId === 'ch3-ergonomics')
    expect(ergonomicsTerms.map((t) => t.id)).toEqual(expected.map((t) => t.id))
    expect(ergonomicsTerms.length).toBe(2) // Physical Presentation + Ergonomics

    // Unknown/foreign concepts return nothing.
    expect(provider!.filterKeyTermsByConcept('C-2-01')).toEqual([])
    expect(provider!.filterKeyTermsByConcept('ch3-unknown')).toEqual([])
  })

  it('builds a sufficient content bundle for every family', () => {
    for (const family of chapter3ConceptFamilies) {
      const bundle = provider!.buildRemediationContentBundle(family.id)
      expect(bundle.conceptId).toBe(family.id)
      expect(bundle.conceptName).toBe(family.name)
      expect(bundle.hasSufficientMaterial).toBe(true)
      expect(bundle.contentBlockCount).toBeGreaterThanOrEqual(2)
      expect(bundle.flashcardCount).toBe(12)
    }
  })
})

describe('Chapter 3 remediation content provider — inactive/enrichment/retired never leak', () => {
  it('serves only the 48 active core flashcards and nothing else', () => {
    const allServed = chapter3ConceptFamilies.flatMap((f) =>
      provider!.filterFlashcardsByConcept(f.id),
    )
    expect(allServed).toHaveLength(48)
    expect(allServed.every((c) => c.is_active)).toBe(true)

    const servedIds = new Set(allServed.map((c) => c.id))
    for (const card of [...chapter3EnrichmentFlashcards, ...chapter3RetiredFlashcards]) {
      expect(servedIds.has(card.id), `${card.id} leaked into remediation serving`).toBe(false)
    }
    // Sanity: the canonical core bank itself is exactly what was served.
    expect(new Set(chapter3PremiumFlashcards.map((c) => c.id))).toEqual(servedIds)
  })
})

describe('Chapter 3 remediation content provider — question lookup', () => {
  it('resolves questions from BOTH the initial bank and the reassessment reserve', () => {
    // Initial bank
    for (const q of chapter3PremiumQuizQuestions) {
      const resolved = provider!.getQuizQuestionById(q.id)
      expect(resolved?.id).toBe(q.id)
      expect(resolved?.correct_answer).toBe(q.correct_answer)
    }
    // Reassessment reserve
    for (const q of chapter3ReassessmentQuestions) {
      const resolved = provider!.getQuizQuestionById(q.id)
      expect(resolved?.id).toBe(q.id)
      expect(resolved?.correct_answer).toBe(q.correct_answer)
    }
    // Unknown IDs fail closed
    expect(provider!.getQuizQuestionById('qq-3-999')).toBeNull()
    expect(provider!.getQuizQuestionById('qq-2-001')).toBeNull()
  })

  it('counts every mapped question per family (30 initial + 15 reserve each)', () => {
    for (const family of chapter3ConceptFamilies) {
      const initialCount = chapter3ReassessmentQuestionConceptMappings.filter(
        (m) => m.conceptFamilyId === family.id,
      ).length
      expect(initialCount).toBe(15)
      // Provider count covers the initial-quiz mappings (8/7/8/7 per LO).
      const providerCount = provider!.getConceptQuestionCount(family.id)
      expect([8, 7]).toContain(providerCount)
    }
  })
})
