import { chapter2Concepts, RETIRED_CONCEPT_IDS } from '@/lib/chapter-2-concepts/concepts'
import { chapter3ConceptFamilies } from '@/lib/chapter-3-concepts/concepts'
import { chapter4ConceptFamilies } from '@/lib/chapter-4-concepts/concepts'
import { chapter5ConceptFamilies } from '@/lib/chapter-5-concepts/concepts'

const conceptNameById = new Map<string, string>([
  ...chapter2Concepts.map((concept) => [concept.id as string, concept.name] as const),
  ...chapter3ConceptFamilies.map((concept) => [concept.id as string, concept.name] as const),
  ...chapter4ConceptFamilies.map((concept) => [concept.id as string, concept.name] as const),
  ...chapter5ConceptFamilies.map((concept) => [concept.id as string, concept.name] as const),
])

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
