import type { Chapter4ConceptFamilyId, Chapter4FlashcardConceptMapping } from './types'

const ranges: readonly [start: number, end: number, conceptFamilyId: Chapter4ConceptFamilyId][] = [
  [1, 9, 'ch4-pathogens-transmission'],
  [10, 19, 'ch4-disinfection-sterilization'],
  [20, 27, 'ch4-cross-contamination'],
  [28, 36, 'ch4-blood-exposure-ppe'],
  [37, 43, 'ch4-regulatory-chemical-safety'],
  [44, 50, 'ch4-safe-practice-compliance'],
] as const

export const chapter4FlashcardConceptMappings: readonly Chapter4FlashcardConceptMapping[] = ranges.flatMap(
  ([start, end, conceptFamilyId]) => Array.from({ length: end - start + 1 }, (_, offset) => ({
    flashcardId: `fc-4-${String(start + offset).padStart(3, '0')}` as const,
    conceptFamilyId,
  })),
)

export function getChapter4ConceptForFlashcard(flashcardId: string): Chapter4ConceptFamilyId | null {
  return chapter4FlashcardConceptMappings.find((mapping) => mapping.flashcardId === flashcardId)?.conceptFamilyId ?? null
}
