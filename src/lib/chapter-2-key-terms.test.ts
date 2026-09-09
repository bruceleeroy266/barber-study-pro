/**
 * ASCYN PRO — Chapter 2 Key Terms Dataset Tests (Phase 2B)
 *
 * Guards the founder-approved 37-term inventory:
 *   - exact count, unique stable IDs
 *   - concept/LO references resolve (C-2-22 rejected)
 *   - term-level provenance valid; approved framework provenance preserved
 *   - definitions non-empty and original-structure (no publisher/board prose)
 *   - helper behavior (concept/LO/id/grouping)
 *   - rejected legacy terms and removed/merged entries stay out
 *   - all 25 active concepts and all 14 LOs represented
 */

import { describe, it, expect } from 'vitest'
import {
  chapter2KeyTerms,
  chapterKeyTerms,
  getKeyTermsForConcept,
  getKeyTermsForLO,
  getKeyTermById,
  groupKeyTermsByConcept,
} from './chapter-2-key-terms'
import {
  chapter2Concepts,
  ACTIVE_CONCEPT_IDS,
  LEARNING_OBJECTIVE_IDS,
} from './chapter-2-concepts/concepts'

const VALID_PROVENANCE = new Set([
  'TEXTBOOK_DERIVED',
  'MILADY_SUPPORTED_EXPANSION',
  'ASCYN_ORIGINAL',
])

const termNames = chapter2KeyTerms.map((t) => t.term)

describe('Chapter 2 Key Terms — inventory', () => {
  it('contains exactly 37 terms', () => {
    expect(chapter2KeyTerms).toHaveLength(37)
  })

  it('registers ch-2 in the chapter registry', () => {
    expect(chapterKeyTerms['ch-2']).toBe(chapter2KeyTerms)
    expect(chapterKeyTerms['ch-2']).toHaveLength(37)
  })

  it('uses unique stable IDs in kt-2-### format', () => {
    const ids = chapter2KeyTerms.map((t) => t.id)
    expect(new Set(ids).size).toBe(37)
    for (const id of ids) {
      expect(id).toMatch(/^kt-2-\d{3}$/)
    }
  })

  it('has no duplicate term names', () => {
    expect(new Set(termNames).size).toBe(37)
  })
})

describe('Chapter 2 Key Terms — references', () => {
  it('every conceptId resolves to an ACTIVE Chapter 2 concept', () => {
    for (const t of chapter2KeyTerms) {
      expect(ACTIVE_CONCEPT_IDS).toContain(t.conceptId)
    }
  })

  it('retired concept C-2-22 holds no terms', () => {
    expect(chapter2KeyTerms.some((t) => t.conceptId === 'C-2-22')).toBe(false)
  })

  it('every learningObjectiveId resolves to a valid LO', () => {
    for (const t of chapter2KeyTerms) {
      expect(LEARNING_OBJECTIVE_IDS).toContain(t.learningObjectiveId)
    }
  })

  it('all 25 active concepts are represented', () => {
    const covered = new Set(chapter2KeyTerms.map((t) => t.conceptId))
    expect(covered.size).toBe(25)
    for (const id of ACTIVE_CONCEPT_IDS) {
      expect(covered.has(id)).toBe(true)
    }
  })

  it('all 14 learning objectives are represented', () => {
    const covered = new Set(chapter2KeyTerms.map((t) => t.learningObjectiveId))
    expect(covered.size).toBe(14)
    for (const id of LEARNING_OBJECTIVE_IDS) {
      expect(covered.has(id)).toBe(true)
    }
  })
})

describe('Chapter 2 Key Terms — provenance', () => {
  it('every term carries a valid term-level provenance class', () => {
    for (const t of chapter2KeyTerms) {
      expect(VALID_PROVENANCE.has(t.sourceProvenance)).toBe(true)
    }
  })

  it('approved named-framework provenance is preserved', () => {
    const byTerm = new Map(chapter2KeyTerms.map((t) => [t.term, t.sourceProvenance]))
    // MILADY-SUPPORTED ASCYN EXPANSION
    expect(byTerm.get('SMART Goals')).toBe('MILADY_SUPPORTED_EXPANSION')
    expect(byTerm.get('Spaced Repetition')).toBe('MILADY_SUPPORTED_EXPANSION')
    // ASCYN ENRICHMENT — named external frameworks are never DIRECT MILADY
    expect(byTerm.get('2-Minute Rule')).toBe('ASCYN_ORIGINAL')
    expect(byTerm.get('Pomodoro Technique')).toBe('ASCYN_ORIGINAL')
    expect(byTerm.get('Service Recovery Paradox')).toBe('ASCYN_ORIGINAL')
    expect(byTerm.get('50/30/20 Budget Rule')).toBe('ASCYN_ORIGINAL')
  })

  it('enrichment concepts carry ASCYN_ORIGINAL terms', () => {
    for (const t of chapter2KeyTerms) {
      if (t.conceptId === 'C-2-20' || t.conceptId === 'C-2-21' || t.conceptId === 'C-2-25') {
        expect(t.sourceProvenance).toBe('ASCYN_ORIGINAL')
        expect(t.priority).toBe('ENRICHMENT')
      }
    }
  })

  it('provenance counts match the approved curation (15 DIRECT / 14 EXPANSION / 8 ENRICHMENT)', () => {
    const counts = { TEXTBOOK_DERIVED: 0, MILADY_SUPPORTED_EXPANSION: 0, ASCYN_ORIGINAL: 0 }
    for (const t of chapter2KeyTerms) {
      counts[t.sourceProvenance as keyof typeof counts] += 1
    }
    expect(counts.TEXTBOOK_DERIVED).toBe(15)
    expect(counts.MILADY_SUPPORTED_EXPANSION).toBe(14)
    expect(counts.ASCYN_ORIGINAL).toBe(8)
  })
})

describe('Chapter 2 Key Terms — definitions', () => {
  it('every definition is non-empty and substantive', () => {
    for (const t of chapter2KeyTerms) {
      expect(t.definition.trim().length).toBeGreaterThanOrEqual(40)
    }
  })

  it('definitions contain no publisher references or board-exam claims', () => {
    for (const t of chapter2KeyTerms) {
      expect(t.definition).not.toMatch(/milady|cengage/i)
      expect(t.definition).not.toMatch(/board exam|state board|licensing exam/i)
    }
  })

  it('definitions are original ASCYN structure (term name is not the whole definition)', () => {
    for (const t of chapter2KeyTerms) {
      expect(t.definition.trim().toLowerCase()).not.toBe(t.term.trim().toLowerCase())
      // Sentence-like content, not a bare fragment or placeholder
      expect(t.definition).not.toMatch(/TODO|TBD|placeholder|lorem/i)
    }
  })
})

describe('Chapter 2 Key Terms — exclusions', () => {
  it('contains none of the six rejected legacy terms', () => {
    const rejected = ['Affect', 'Aptitude', 'Body Language', 'Competence', 'Constructive Criticism', 'Emotional Intelligence']
    for (const r of rejected) {
      expect(termNames).not.toContain(r)
    }
  })

  it('does not restore removed/merged entries as separate terms', () => {
    const removed = [
      'Goal Tracking',
      'Study System',
      'Complaint Recovery System',
      'Three Components of Effective Communication',
      'Booth Renter Tax Set-Aside',
      'Inclusive Service Practices',
    ]
    for (const r of removed) {
      expect(termNames).not.toContain(r)
    }
  })
})

describe('Chapter 2 Key Terms — helpers', () => {
  it('getKeyTermsForConcept returns only that concept\'s terms', () => {
    const terms = getKeyTermsForConcept('C-2-21')
    expect(terms.map((t) => t.term).sort()).toEqual(['50/30/20 Budget Rule', 'Emergency Fund'])
    for (const t of terms) {
      expect(t.conceptId).toBe('C-2-21')
    }
  })

  it('getKeyTermsForConcept returns [] for retired C-2-22', () => {
    expect(getKeyTermsForConcept('C-2-22')).toEqual([])
  })

  it('getKeyTermsForLO returns only that LO\'s terms', () => {
    const terms = getKeyTermsForLO('LO-2-11')
    expect(terms.length).toBe(2)
    for (const t of terms) {
      expect(t.learningObjectiveId).toBe('LO-2-11')
    }
  })

  it('getKeyTermById finds and misses correctly', () => {
    expect(getKeyTermById('kt-2-001')?.term).toBe('Life Skills')
    expect(getKeyTermById('kt-2-999')).toBeUndefined()
  })

  it('groupKeyTermsByConcept covers all 37 terms in canonical LO order', () => {
    const groups = groupKeyTermsByConcept()
    const grouped = groups.flatMap((g) => g.terms)
    expect(grouped).toHaveLength(37)
    // Group order follows LO order: first group is LO-2-01's concept
    expect(groups[0].conceptId).toBe('C-2-01')
    expect(groups[0].conceptName).toBe('Life Skills Foundations')
    // Every group resolves a real concept name
    const conceptNames = new Set(chapter2Concepts.map((c) => c.name))
    for (const g of groups) {
      expect(conceptNames.has(g.conceptName)).toBe(true)
    }
  })
})
