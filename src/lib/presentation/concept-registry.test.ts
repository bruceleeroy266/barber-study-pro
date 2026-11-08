import { describe, expect, it } from 'vitest'
import { isChapter3PresentationConcept, resolvePresentationConceptName } from './concept-registry'
import { chapter1ConceptFamilies } from '@/lib/chapter-1-concepts/concepts'
import { chapter2Concepts, RETIRED_CONCEPT_IDS } from '@/lib/chapter-2-concepts/concepts'
import { chapter3ConceptFamilies } from '@/lib/chapter-3-concepts/concepts'
import { chapter4ConceptFamilies } from '@/lib/chapter-4-concepts/concepts'
import { chapter5ConceptFamilies } from '@/lib/chapter-5-concepts/concepts'
import { chapter6ConceptFamilies } from '@/lib/chapter-6-concepts/concepts'
import { chapter7ConceptFamilies } from '@/lib/chapter-7-concepts/concepts'
import { chapter8ConceptFamilies } from '@/lib/chapter-8-concepts/concepts'
import { chapter9ConceptFamilies } from '@/lib/chapter-9-concepts/concepts'
import { chapter10ConceptFamilies } from '@/lib/chapter-10-concepts/concepts'
import { chapter11ConceptFamilies } from '@/lib/chapter-11-concepts/concepts'
import { chapter12ConceptFamilies } from '@/lib/chapter-12-concepts/concepts'
import { chapter13ConceptFamilies } from '@/lib/chapter-13-concepts/concepts'
import { chapter14ConceptFamilies } from '@/lib/chapter-14-concepts/concepts'
import { chapter15ConceptFamilies } from '@/lib/chapter-15-concepts/concepts'
import { chapter16ConceptFamilies } from '@/lib/chapter-16-concepts/concepts'
import { chapter17ConceptFamilies } from '@/lib/chapter-17-concepts/concepts'
import { chapter18ConceptFamilies } from '@/lib/chapter-18-concepts/concepts'
import { chapter19ConceptFamilies } from '@/lib/chapter-19-concepts/concepts'
import { chapter20ConceptFamilies } from '@/lib/chapter-20-concepts/concepts'
import { chapter21ConceptFamilies } from '@/lib/chapter-21-concepts/concepts'

describe('concept presentation registry', () => {
  it('resolves all four locked Chapter 3 concept families', () => {
    expect(resolvePresentationConceptName('ch3-healthful-habits')).toBe('Healthful Habits')
    expect(resolvePresentationConceptName('ch3-professional-image')).toBe('Professional Image & Grooming')
    expect(resolvePresentationConceptName('ch3-ergonomics')).toBe('Ergonomics & Body Mechanics')
    expect(resolvePresentationConceptName('ch3-human-relations')).toBe('Human Relations & Communication')
  })

  it('identifies Chapter 3 presentation concepts without treating unknown IDs as Chapter 3', () => {
    expect(isChapter3PresentationConcept('ch3-ergonomics')).toBe(true)
    expect(isChapter3PresentationConcept('unknown-concept')).toBe(false)
  })

  it('fails visibly rather than inventing a name for unknown concepts', () => {
    expect(resolvePresentationConceptName('future-concept')).toBe('Unknown concept (future-concept)')
  })
})

describe('concept presentation registry — 21-chapter coverage (ASCYN-QUIZ-ANALYTICS-08)', () => {
  const sources: Array<[number, ReadonlyArray<{ id: string; name: string }>]> = [
    [1, chapter1ConceptFamilies],
    [2, chapter2Concepts],
    [3, chapter3ConceptFamilies],
    [4, chapter4ConceptFamilies],
    [5, chapter5ConceptFamilies],
    [6, chapter6ConceptFamilies],
    [7, chapter7ConceptFamilies],
    [8, chapter8ConceptFamilies],
    [9, chapter9ConceptFamilies],
    [10, chapter10ConceptFamilies],
    [11, chapter11ConceptFamilies],
    [12, chapter12ConceptFamilies],
    [13, chapter13ConceptFamilies],
    [14, chapter14ConceptFamilies],
    [15, chapter15ConceptFamilies],
    [16, chapter16ConceptFamilies],
    [17, chapter17ConceptFamilies],
    [18, chapter18ConceptFamilies],
    [19, chapter19ConceptFamilies],
    [20, chapter20ConceptFamilies],
    [21, chapter21ConceptFamilies],
  ]

  it('resolves every chapter’s concept IDs to their authoritative names', () => {
    const retired = new Set(RETIRED_CONCEPT_IDS as readonly string[])
    let checked = 0
    for (const [chapter, concepts] of sources) {
      expect(concepts.length, `chapter ${chapter} exports no concepts`).toBeGreaterThan(0)
      for (const concept of concepts) {
        const expected = retired.has(concept.id) ? `${concept.name} (retired concept)` : concept.name
        expect(
          resolvePresentationConceptName(concept.id),
          `chapter ${chapter} concept ${concept.id} did not resolve to its authoritative name`
        ).toBe(expected)
        checked++
      }
    }
    expect(checked).toBeGreaterThan(150)
  })

  it('has no duplicate concept identifiers across chapters', () => {
    const seen = new Map<string, number>()
    for (const [chapter, concepts] of sources) {
      for (const concept of concepts) {
        expect(
          seen.has(concept.id),
          `duplicate concept id ${concept.id} (chapter ${seen.get(concept.id)} and chapter ${chapter})`
        ).toBe(false)
        seen.set(concept.id, chapter)
      }
    }
  })

  it('has no ambiguous mappings (one ID never maps to two different names)', () => {
    const nameById = new Map<string, string>()
    for (const [, concepts] of sources) {
      for (const concept of concepts) {
        const existing = nameById.get(concept.id)
        if (existing !== undefined) {
          expect(existing, `ambiguous mapping for ${concept.id}`).toBe(concept.name)
        }
        nameById.set(concept.id, concept.name)
      }
    }
  })

  it('still returns an explicit unresolved result for genuinely unknown identifiers', () => {
    expect(resolvePresentationConceptName('not-a-real-concept')).toBe('Unknown concept (not-a-real-concept)')
  })

  it('keeps Chapter 2 retired-concept labeling intact', () => {
    const retired = RETIRED_CONCEPT_IDS as readonly string[]
    if (retired.length > 0) {
      const base = chapter2Concepts.find((concept) => concept.id === retired[0])
      if (base) {
        expect(resolvePresentationConceptName(retired[0])).toBe(`${base.name} (retired concept)`)
      }
    }
  })
})
