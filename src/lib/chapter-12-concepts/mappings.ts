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

export interface Chapter12MicroCheckPlacement {
  id: `mc-12-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter12ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
}

export const chapter12MicroCheckPlacements: readonly Chapter12MicroCheckPlacement[] = [
  {
    id: 'mc-12-01',
    afterSectionId: 'memory-tricks',
    conceptFamilyId: 'ch12-facial-anatomy-neurovascular',
    plannedQuestionCount: 2,
    purpose: 'Check application of facial anatomy and neurovascular structures.',
  },
  {
    id: 'mc-12-02',
    afterSectionId: 'massage-movements',
    conceptFamilyId: 'ch12-massage-principles-manipulations',
    plannedQuestionCount: 2,
    purpose: 'Check manipulation recognition and safe massage decisions.',
  },
  {
    id: 'mc-12-03',
    afterSectionId: 'hot-towel-safety',
    conceptFamilyId: 'ch12-equipment-electrotherapy',
    plannedQuestionCount: 2,
    purpose: 'Check equipment settings, contraindications, and deferral decisions.',
  },
  {
    id: 'mc-12-04',
    afterSectionId: 'product-selection-skin-type',
    conceptFamilyId: 'ch12-skin-analysis-product-selection',
    plannedQuestionCount: 2,
    purpose: 'Check cosmetic analysis and product-selection decisions.',
  },
  {
    id: 'mc-12-05',
    afterSectionId: 'facial-treatments-masks',
    conceptFamilyId: 'ch12-facial-treatment-procedures',
    plannedQuestionCount: 2,
    purpose: 'Check treatment sequence and cosmetic service boundaries.',
  },
  {
    id: 'mc-12-06',
    afterSectionId: 'sanitation-infection-control',
    conceptFamilyId: 'ch12-sanitation-infection-control',
    plannedQuestionCount: 2,
    purpose: 'Check contamination prevention and exposure-control decisions.',
  },
  {
    id: 'mc-12-07',
    afterSectionId: 'absolute-contraindications',
    conceptFamilyId: 'ch12-contraindications-service-safety',
    plannedQuestionCount: 2,
    purpose: 'Check service-stop, deferral, and scope-boundary decisions.',
  },
  {
    id: 'mc-12-08',
    afterSectionId: 'client-consultation',
    conceptFamilyId: 'ch12-client-care-professional-practice',
    plannedQuestionCount: 2,
    purpose: 'Check consultation and professional-practice decisions.',
  },
]

export const chapter12ContentConceptMappings: readonly Chapter12ContentConceptMapping[] = [
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch12-facial-anatomy-neurovascular' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch12-equipment-electrotherapy' },
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
  ...[52,53,55,57,58,59,60,61,62,63,64,65,67,68,69,70,71,72,73,74,75,76,77,78,103,104,109,110].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-equipment-electrotherapy' as const })),
  ...[...Array.from({ length: 19 }, (_, i) => i + 82),105,106].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-skin-analysis-product-selection' as const })),
  ...[51,101,102,108].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-facial-treatment-procedures' as const })),
  ...[113,114].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-sanitation-infection-control' as const })),
  ...[50,54,56,66,79,80,81,107].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch12-contraindications-service-safety' as const })),
]

const q = (n: number): `qq-12-${string}` => `qq-12-${String(n).padStart(3, '0')}`

export const chapter12QuizQuestionConceptMappings: readonly Chapter12QuizQuestionConceptMapping[] = [
  ...Array.from({ length: 4 }, (_, i) => i + 1).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-client-care-professional-practice' as const })),
  ...Array.from({ length: 10 }, (_, i) => i + 5).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-facial-anatomy-neurovascular' as const })),
  ...Array.from({ length: 8 }, (_, i) => i + 15).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-massage-principles-manipulations' as const })),
  ...Array.from({ length: 7 }, (_, i) => i + 23).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-equipment-electrotherapy' as const })),
  ...Array.from({ length: 6 }, (_, i) => i + 30).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-skin-analysis-product-selection' as const })),
  ...Array.from({ length: 4 }, (_, i) => i + 36).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-facial-treatment-procedures' as const })),
  ...Array.from({ length: 3 }, (_, i) => i + 40).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-sanitation-infection-control' as const })),
  ...Array.from({ length: 3 }, (_, i) => i + 43).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch12-contraindications-service-safety' as const })),
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
