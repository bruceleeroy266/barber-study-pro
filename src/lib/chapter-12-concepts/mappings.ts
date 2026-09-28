import type { Chapter12ConceptFamilyId } from './types'

export interface Chapter12ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter12ConceptFamilyId
}

export interface Chapter12FlashcardConceptMapping {
  flashcardId: `fc-ch12-${string}`
  conceptFamilyId: Chapter12ConceptFamilyId
}

export interface Chapter12QuizQuestionConceptMapping {
  questionId: `qq-12-${string}`
  conceptFamilyId: Chapter12ConceptFamilyId
}

export const chapter12ContentConceptMappings: readonly Chapter12ContentConceptMapping[] = [
  { contentBlockId: 'gentlemans-atelier-welcome', conceptFamilyId: 'ch12-client-care-professional-practice' },
  { contentBlockId: 'why-facial-massage-matters', conceptFamilyId: 'ch12-massage-principles-manipulations' },
  { contentBlockId: 'massage-certification', conceptFamilyId: 'ch12-client-care-professional-practice' },
  { contentBlockId: 'massage-movements', conceptFamilyId: 'ch12-massage-principles-manipulations' },
  { contentBlockId: 'facial-massage-procedure', conceptFamilyId: 'ch12-facial-treatment-procedures' },
  { contentBlockId: 'sanitation-infection-control', conceptFamilyId: 'ch12-sanitation-infection-control' },
  { contentBlockId: 'client-consultation', conceptFamilyId: 'ch12-client-care-professional-practice' },
  { contentBlockId: 'facial-treatments-masks', conceptFamilyId: 'ch12-facial-treatment-procedures' },
  { contentBlockId: 'cleansers-toners-astringents', conceptFamilyId: 'ch12-skin-analysis-product-selection' },
  { contentBlockId: 'product-selection-skin-type', conceptFamilyId: 'ch12-skin-analysis-product-selection' },
  { contentBlockId: 'beard-mustache-treatments', conceptFamilyId: 'ch12-facial-treatment-procedures' },
  { contentBlockId: 'contraindications-safety', conceptFamilyId: 'ch12-contraindications-service-safety' },
  { contentBlockId: 'absolute-contraindications', conceptFamilyId: 'ch12-contraindications-service-safety' },
  { contentBlockId: 'hot-towel-safety', conceptFamilyId: 'ch12-contraindications-service-safety' },
  { contentBlockId: 'memory-tricks', conceptFamilyId: 'ch12-client-care-professional-practice' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch12-contraindications-service-safety' },
  { contentBlockId: 'facial-action-items', conceptFamilyId: 'ch12-client-care-professional-practice' },
  { contentBlockId: 'gentlemans-atelier-pledge', conceptFamilyId: 'ch12-client-care-professional-practice' },
]

const fc = (n: number): `fc-ch12-${string}` => `fc-ch12-${String(n).padStart(3, '0')}`

export const chapter12FlashcardConceptMappings: readonly Chapter12FlashcardConceptMapping[] = [
  ...[1,2,111,112,115].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-client-care-professional-practice' as const })),
  ...Array.from({ length: 33 }, (_, i) => i + 3).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-facial-anatomy-neurovascular' as const })),
  ...Array.from({ length: 14 }, (_, i) => i + 36).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-massage-principles-manipulations' as const })),
  ...[52,53,55,57,58,59,60,61,62,63,64,65,67,68,69,70,71,72,73,74,75,76,77,78,109,110].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-equipment-electrotherapy' as const })),
  ...Array.from({ length: 19 }, (_, i) => i + 82).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-skin-analysis-product-selection' as const })),
  ...[51,101,102,103,104,105,106,107,108].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-facial-treatment-procedures' as const })),
  ...[113,114].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-sanitation-infection-control' as const })),
  ...[50,54,56,66,79,80,81].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-contraindications-service-safety' as const })),
]

const q = (n: number): `qq-12-${string}` => `qq-12-${String(n).padStart(3, '0')}`

export const chapter12QuizQuestionConceptMappings: readonly Chapter12QuizQuestionConceptMapping[] = [
  ...[1,2,3].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-client-care-professional-practice' as const })),
  ...Array.from({ length: 20 }, (_, i) => i + 4).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-facial-anatomy-neurovascular' as const })),
  ...Array.from({ length: 11 }, (_, i) => i + 24).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-massage-principles-manipulations' as const })),
  { questionId: q(35), conceptFamilyId: 'ch12-contraindications-service-safety' },
  ...Array.from({ length: 8 }, (_, i) => i + 36).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-equipment-electrotherapy' as const })),
  ...[44,45].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-skin-analysis-product-selection' as const })),
]

export function getChapter12ContentBlocksForConcept(conceptFamilyId: Chapter12ConceptFamilyId) {
  return chapter12ContentConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.contentBlockId)
}

export function getChapter12FlashcardsForConcept(conceptFamilyId: Chapter12ConceptFamilyId) {
  return chapter12FlashcardConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.flashcardId)
}

export function getChapter12QuizQuestionsForConcept(conceptFamilyId: Chapter12ConceptFamilyId) {
  return chapter12QuizQuestionConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.questionId)
}
