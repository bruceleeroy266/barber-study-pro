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

/** Every chapter's concept record carries at least id + name. */
type ConceptNameSource = ReadonlyArray<{ id: string; name: string }>

/**
 * All 21 chapters' authoritative concept definitions, in registration order.
 * Chapters 2–6 keep their original order and precedence; the builder is
 * first-write-wins, so a later chapter can never silently reassign an
 * existing chapter's concept ID. (Verified 2026-11-02: 177 distinct IDs,
 * zero cross-chapter collisions.)
 */
const CONCEPT_SOURCES: readonly ConceptNameSource[] = [
  chapter2Concepts,
  chapter3ConceptFamilies,
  chapter4ConceptFamilies,
  chapter5ConceptFamilies,
  chapter6ConceptFamilies,
  chapter1ConceptFamilies,
  chapter7ConceptFamilies,
  chapter8ConceptFamilies,
  chapter9ConceptFamilies,
  chapter10ConceptFamilies,
  chapter11ConceptFamilies,
  chapter12ConceptFamilies,
  chapter13ConceptFamilies,
  chapter14ConceptFamilies,
  chapter15ConceptFamilies,
  chapter16ConceptFamilies,
  chapter17ConceptFamilies,
  chapter18ConceptFamilies,
  chapter19ConceptFamilies,
  chapter20ConceptFamilies,
  chapter21ConceptFamilies,
]

function buildConceptNameMap(sources: readonly ConceptNameSource[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const source of sources) {
    for (const concept of source) {
      if (!map.has(concept.id)) map.set(concept.id, concept.name)
    }
  }
  return map
}

const conceptNameById = buildConceptNameMap(CONCEPT_SOURCES)

const retiredConceptIds = new Set<string>(RETIRED_CONCEPT_IDS as readonly string[])

/** Chapter-aware concept name resolution for student and instructor presentation. */
export function resolvePresentationConceptName(conceptId: string): string {
  const name = conceptNameById.get(conceptId)
  if (!name) return `Unknown concept (${conceptId})`
  if (retiredConceptIds.has(conceptId)) return `${name} (retired concept)`
  return name
}

export function isChapter3PresentationConcept(conceptId: string): boolean {
  return chapter3ConceptFamilies.some((concept) => concept.id === conceptId)
}

export function isChapter4PresentationConcept(conceptId: string): boolean {
  return chapter4ConceptFamilies.some((concept) => concept.id === conceptId)
}

export function isChapter5PresentationConcept(conceptId: string): boolean {
  return chapter5ConceptFamilies.some((concept) => concept.id === conceptId)
}

export function isChapter6PresentationConcept(conceptId: string): boolean {
  return chapter6ConceptFamilies.some((concept) => concept.id === conceptId)
}
