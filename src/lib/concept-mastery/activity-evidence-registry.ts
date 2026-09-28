import { getChapterContent } from '../chapter-content'
import { chapterFlashcards } from '../flashcards-data'
import { chapter1ContentConceptMappings, chapter1FlashcardConceptMappings } from '../chapter-1-concepts/mappings'
import { chapter2ContentMappings, chapter2FlashcardMappings } from '../chapter-2-concepts/mappings'
import { chapter3ContentConceptMappings, chapter3FlashcardConceptMappings } from '../chapter-3-concepts/mappings'
import { chapter4ContentConceptMappings, chapter4FlashcardConceptMappings } from '../chapter-4-concepts/mappings'
import { chapter5ContentConceptMappings, chapter5FlashcardConceptMappings } from '../chapter-5-concepts/mappings'
import { chapter6ContentConceptMappings, chapter6FlashcardConceptMappings } from '../chapter-6-concepts/mappings'
import { chapter7ContentConceptMappings, chapter7FlashcardConceptMappings } from '../chapter-7-concepts/mappings'
import { chapter8ContentConceptMappings, chapter8FlashcardConceptMappings } from '../chapter-8-concepts/mappings'
import { chapter9ContentConceptMappings, chapter9FlashcardConceptMappings } from '../chapter-9-concepts/mappings'
import { chapter10ContentConceptMappings, chapter10FlashcardConceptMappings } from '../chapter-10-concepts/mappings'
import { chapter11ContentConceptMappings, chapter11FlashcardConceptMappings } from '../chapter-11-concepts/mappings'

type GenericMapping = Record<string, unknown>

function conceptId(mapping: GenericMapping): string | null {
  const value = mapping.conceptFamilyId ?? mapping.conceptId
  return typeof value === 'string' ? value : null
}

function normalizeFlashcards(rows: readonly GenericMapping[]) {
  return rows.flatMap((mapping) => {
    const id = mapping.flashcardId
    const concept = conceptId(mapping)
    return typeof id === 'string' && concept ? [{ itemId: id, conceptId: concept }] : []
  })
}

function normalizeContent(rows: readonly GenericMapping[]) {
  return rows.flatMap((mapping) => {
    const id = mapping.contentBlockId
    const concept = conceptId(mapping)
    return typeof id === 'string' && concept ? [{ sectionId: id, conceptId: concept }] : []
  })
}

const flashcardMappings: Record<string, readonly GenericMapping[]> = {
  'ch-1': chapter1FlashcardConceptMappings as readonly GenericMapping[],
  'ch-2': chapter2FlashcardMappings as readonly GenericMapping[],
  'ch-3': chapter3FlashcardConceptMappings as readonly GenericMapping[],
  'ch-4': chapter4FlashcardConceptMappings as readonly GenericMapping[],
  'ch-5': chapter5FlashcardConceptMappings as readonly GenericMapping[],
  'ch-6': chapter6FlashcardConceptMappings as readonly GenericMapping[],
  'ch-7': chapter7FlashcardConceptMappings as readonly GenericMapping[],
  'ch-8': chapter8FlashcardConceptMappings as readonly GenericMapping[],
  'ch-9': chapter9FlashcardConceptMappings as readonly GenericMapping[],
  'ch-10': chapter10FlashcardConceptMappings as readonly GenericMapping[],
  'ch-11': chapter11FlashcardConceptMappings as readonly GenericMapping[],
}

const contentMappings: Record<string, readonly GenericMapping[]> = {
  'ch-1': chapter1ContentConceptMappings as readonly GenericMapping[],
  'ch-2': chapter2ContentMappings as readonly GenericMapping[],
  'ch-3': chapter3ContentConceptMappings as readonly GenericMapping[],
  'ch-4': chapter4ContentConceptMappings as readonly GenericMapping[],
  'ch-5': chapter5ContentConceptMappings as readonly GenericMapping[],
  'ch-6': chapter6ContentConceptMappings as readonly GenericMapping[],
  'ch-7': chapter7ContentConceptMappings as readonly GenericMapping[],
  'ch-8': chapter8ContentConceptMappings as readonly GenericMapping[],
  'ch-9': chapter9ContentConceptMappings as readonly GenericMapping[],
  'ch-10': chapter10ContentConceptMappings as readonly GenericMapping[],
  'ch-11': chapter11ContentConceptMappings as readonly GenericMapping[],
}

export function getFlashcardEvidenceConcept(chapterId: string, flashcardId: string): string | null {
  return normalizeFlashcards(flashcardMappings[chapterId] ?? []).find((row) => row.itemId === flashcardId)?.conceptId ?? null
}

export function getScenarioEvidenceConcept(chapterId: string, sectionId: string): string | null {
  return normalizeContent(contentMappings[chapterId] ?? []).find((row) => row.sectionId === sectionId)?.conceptId ?? null
}

export function getFlashcardEvidenceInventory(chapterId: string): readonly string[] {
  const mapped = new Set(normalizeFlashcards(flashcardMappings[chapterId] ?? []).map((row) => row.itemId))
  return (chapterFlashcards[chapterId] ?? [])
    .filter((card) => card.is_active && mapped.has(card.id))
    .map((card) => card.id)
}

export function getScenarioEvidenceInventory(chapterId: string): readonly string[] {
  const number = Number(chapterId.replace('ch-', ''))
  if (!Number.isInteger(number) || number < 1 || number > 11) return []
  const content = getChapterContent(number)
  if (!content) return []

  return content.sections.flatMap((section) => {
    if (section.type !== 'scenarioBlock' && section.type !== 'proScenario') return []
    return section.scenarios.map((_, index) => `${section.id}:${index}`)
  })
}

export function isG7EvidenceChapter(chapterId: string): boolean {
  const number = Number(chapterId.replace('ch-', ''))
  return Number.isInteger(number) && number >= 1 && number <= 11
}
