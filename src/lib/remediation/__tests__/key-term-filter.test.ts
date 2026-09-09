/**
 * Phase 2B — Key-Term Concept Filter Tests (remediation thin wrapper)
 *
 * Boundary: key terms are a study aid only. The helper exposes data by
 * concept; it does NOT join RemediationContentBundle and does NOT change
 * 6C detection, reassessment, or outcome evaluation.
 */

import { describe, it, expect } from 'vitest'
import {
  filterKeyTermsByConcept,
  buildRemediationContentBundle,
} from '../content-filter'
import { chapter2KeyTerms } from '../../chapter-2-key-terms'
import { ACTIVE_CONCEPT_IDS } from '../../chapter-2-concepts/concepts'
import type { ConceptId } from '../../chapter-2-concepts/types'

describe('filterKeyTermsByConcept', () => {
  it('returns only terms mapped to the requested active concept', () => {
    const terms = filterKeyTermsByConcept('C-2-21')
    expect(terms).toHaveLength(2)
    expect(terms.map((t) => t.term).sort()).toEqual(['50/30/20 Budget Rule', 'Emergency Fund'])
    for (const t of terms) {
      expect(t.conceptId).toBe('C-2-21')
    }
  })

  it('returns every dataset term across all active concepts exactly once', () => {
    const seen = new Set<string>()
    for (const conceptId of ACTIVE_CONCEPT_IDS) {
      for (const t of filterKeyTermsByConcept(conceptId)) {
        expect(seen.has(t.id)).toBe(false)
        seen.add(t.id)
      }
    }
    expect(seen.size).toBe(chapter2KeyTerms.length)
  })

  it('returns [] for the retired concept C-2-22', () => {
    expect(filterKeyTermsByConcept('C-2-22')).toEqual([])
  })

  it('returns [] for unknown concept IDs', () => {
    expect(filterKeyTermsByConcept('C-2-99' as ConceptId)).toEqual([])
    expect(filterKeyTermsByConcept('bogus' as unknown as ConceptId)).toEqual([])
  })

  it('does not mutate the canonical dataset', () => {
    const before = chapter2KeyTerms.map((t) => t.id)
    filterKeyTermsByConcept('C-2-08')
    expect(chapter2KeyTerms.map((t) => t.id)).toEqual(before)
  })
})

describe('remediation bundle boundary (Phase 2B)', () => {
  it('RemediationContentBundle does NOT include key terms', () => {
    const bundle = buildRemediationContentBundle('C-2-08')
    expect(bundle).not.toHaveProperty('keyTerms')
    expect(Object.keys(bundle)).not.toContain('keyTerms')
  })
})
