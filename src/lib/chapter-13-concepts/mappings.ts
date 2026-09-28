import type { Chapter13ConceptFamilyId } from './types'

export interface Chapter13ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter13ConceptFamilyId
}

export interface Chapter13FlashcardConceptMapping {
  flashcardId: `fc-ch13-${string}`
  conceptFamilyId: Chapter13ConceptFamilyId
}

export interface Chapter13QuizQuestionConceptMapping {
  questionId: `qq-13-${string}`
  conceptFamilyId: Chapter13ConceptFamilyId
}

export interface Chapter13MicroCheckPlacement {
  id: `mc-13-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter13ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
}

export const chapter13ContentConceptMappings: readonly Chapter13ContentConceptMapping[] = [
  { contentBlockId: 'shaving-fundamentals', conceptFamilyId: 'ch13-consultation-service-preparation' },
  { contentBlockId: 'preparation', conceptFamilyId: 'ch13-consultation-service-preparation' },

  { contentBlockId: 'hair-type-considerations', conceptFamilyId: 'ch13-hair-growth-ingrown-prevention' },
  { contentBlockId: 'ingrown-hair-info', conceptFamilyId: 'ch13-hair-growth-ingrown-prevention' },
  { contentBlockId: 'hair-growth-grain', conceptFamilyId: 'ch13-hair-growth-ingrown-prevention' },
  { contentBlockId: 'grain-terms', conceptFamilyId: 'ch13-hair-growth-ingrown-prevention' },

  { contentBlockId: 'fourteen-areas', conceptFamilyId: 'ch13-shaving-areas-body-positioning' },
  { contentBlockId: 'shaving-areas-tabbed', conceptFamilyId: 'ch13-shaving-areas-body-positioning' },
  { contentBlockId: 'freehand-areas', conceptFamilyId: 'ch13-shaving-areas-body-positioning' },
  { contentBlockId: 'backhand-areas', conceptFamilyId: 'ch13-shaving-areas-body-positioning' },
  { contentBlockId: 'reverse-freehand-areas', conceptFamilyId: 'ch13-shaving-areas-body-positioning' },
  { contentBlockId: 'body-positioning', conceptFamilyId: 'ch13-shaving-areas-body-positioning' },
  { contentBlockId: 'body-positions', conceptFamilyId: 'ch13-shaving-areas-body-positioning' },

  { contentBlockId: 'razor-positions-intro', conceptFamilyId: 'ch13-razor-handling-stretching-technique' },
  { contentBlockId: 'razor-positions', conceptFamilyId: 'ch13-razor-handling-stretching-technique' },
  { contentBlockId: 'skin-stretching', conceptFamilyId: 'ch13-razor-handling-stretching-technique' },
  { contentBlockId: 'skin-stretching-tips', conceptFamilyId: 'ch13-razor-handling-stretching-technique' },
  { contentBlockId: 'shaving', conceptFamilyId: 'ch13-razor-handling-stretching-technique' },
  { contentBlockId: 'razor-anatomy', conceptFamilyId: 'ch13-razor-handling-stretching-technique' },
  { contentBlockId: 'razor-parts', conceptFamilyId: 'ch13-razor-handling-stretching-technique' },

  { contentBlockId: 'professional-shave', conceptFamilyId: 'ch13-professional-shave-procedure' },
  { contentBlockId: 'shave-steps', conceptFamilyId: 'ch13-professional-shave-procedure' },
  { contentBlockId: 'finishing', conceptFamilyId: 'ch13-professional-shave-procedure' },
  { contentBlockId: 'types-of-shaves', conceptFamilyId: 'ch13-professional-shave-procedure' },
  { contentBlockId: 'shave-types', conceptFamilyId: 'ch13-professional-shave-procedure' },
  { contentBlockId: 'neck-outline', conceptFamilyId: 'ch13-professional-shave-procedure' },

  { contentBlockId: 'mustache-design', conceptFamilyId: 'ch13-facial-hair-design' },
  { contentBlockId: 'mustache-factors', conceptFamilyId: 'ch13-facial-hair-design' },
  { contentBlockId: 'facial-features', conceptFamilyId: 'ch13-facial-hair-design' },
  { contentBlockId: 'design-guidelines', conceptFamilyId: 'ch13-facial-hair-design' },
  { contentBlockId: 'beard-design', conceptFamilyId: 'ch13-facial-hair-design' },
  { contentBlockId: 'beard-tips', conceptFamilyId: 'ch13-facial-hair-design' },

  { contentBlockId: 'shaving-dos-donts', conceptFamilyId: 'ch13-infection-control-service-safety' },
  { contentBlockId: 'infection-control', conceptFamilyId: 'ch13-infection-control-service-safety' },
  { contentBlockId: 'safety-precautions', conceptFamilyId: 'ch13-infection-control-service-safety' },
  { contentBlockId: 'state-alert', conceptFamilyId: 'ch13-infection-control-service-safety' },
  { contentBlockId: 'styptic-info', conceptFamilyId: 'ch13-infection-control-service-safety' },

  { contentBlockId: 'why-study-shaving', conceptFamilyId: 'ch13-client-care-professional-practice' },
  { contentBlockId: 'shaving-quote', conceptFamilyId: 'ch13-client-care-professional-practice' },
  { contentBlockId: 'customer-satisfaction', conceptFamilyId: 'ch13-client-care-professional-practice' },
  { contentBlockId: 'satisfaction-factors', conceptFamilyId: 'ch13-client-care-professional-practice' },
  { contentBlockId: 'shaving-application-scenarios', conceptFamilyId: 'ch13-client-care-professional-practice' },
]

const fc = (n: number): `fc-ch13-${string}` => `fc-ch13-${String(n).padStart(3, '0')}`

export const chapter13FlashcardConceptMappings: readonly Chapter13FlashcardConceptMapping[] = [
  ...[2,3,4,8,9,57,58,59].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch13-consultation-service-preparation' as const })),
  ...[11,12,13,14,15,16,17,18].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch13-hair-growth-ingrown-prevention' as const })),
  ...[19,20,33,34,35,36,37,38].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch13-shaving-areas-body-positioning' as const })),
  ...[21,22,23,24,25,26,27,28,29,30,31,32,39,40,41,42,43,44,45,46,47,48,49,78,79,80,81,82,87,88].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch13-razor-handling-stretching-technique' as const })),
  ...[50,51,52,53,54,55,56].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch13-professional-shave-procedure' as const })),
  ...[10,60,61,62,63,64,65,66,67,68,69,70,89].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch13-facial-hair-design' as const })),
  ...[5,6,7,71,72,73,74,75,76,83,84,85,86].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch13-infection-control-service-safety' as const })),
  ...[1,77,90].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch13-client-care-professional-practice' as const })),
]

const q = (n: number): `qq-13-${string}` => `qq-13-${String(n).padStart(3, '0')}`

export const chapter13QuizQuestionConceptMappings: readonly Chapter13QuizQuestionConceptMapping[] = [
  ...[5,8,9].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch13-consultation-service-preparation' as const })),
  ...[11,12,13,14,15,16,17,18].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch13-hair-growth-ingrown-prevention' as const })),
  ...[19,20,27,28].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch13-shaving-areas-body-positioning' as const })),
  ...[21,22,23,24,25,26,29,30,31,32,33,34,35,36,37].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch13-razor-handling-stretching-technique' as const })),
  ...[2,3,38,39,40,41,42].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch13-professional-shave-procedure' as const })),
  ...[43,44,45].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch13-facial-hair-design' as const })),
  ...[6,7,10].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch13-infection-control-service-safety' as const })),
  ...[1,4].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch13-client-care-professional-practice' as const })),
]

export const chapter13MicroCheckPlacements: readonly Chapter13MicroCheckPlacement[] = [
  { id: 'mc-13-01', afterSectionId: 'shaving-fundamentals', conceptFamilyId: 'ch13-consultation-service-preparation', plannedQuestionCount: 2, purpose: 'Check consultation, observable analysis, preparation, and product-selection decisions.' },
  { id: 'mc-13-02', afterSectionId: 'grain-terms', conceptFamilyId: 'ch13-hair-growth-ingrown-prevention', plannedQuestionCount: 2, purpose: 'Check grain analysis and ingrown-hair risk decisions.' },
  { id: 'mc-13-03', afterSectionId: 'body-positions', conceptFamilyId: 'ch13-shaving-areas-body-positioning', plannedQuestionCount: 2, purpose: 'Check shaving-area and barber-position selection.' },
  { id: 'mc-13-04', afterSectionId: 'skin-stretching-tips', conceptFamilyId: 'ch13-razor-handling-stretching-technique', plannedQuestionCount: 2, purpose: 'Check razor control, stretching, and stroke-technique application.' },
  { id: 'mc-13-05', afterSectionId: 'shave-types', conceptFamilyId: 'ch13-professional-shave-procedure', plannedQuestionCount: 2, purpose: 'Check service sequence and shave-type decisions.' },
  { id: 'mc-13-06', afterSectionId: 'beard-tips', conceptFamilyId: 'ch13-facial-hair-design', plannedQuestionCount: 2, purpose: 'Check mustache/beard design decisions from facial features and natural growth.' },
  { id: 'mc-13-07', afterSectionId: 'safety-precautions', conceptFamilyId: 'ch13-infection-control-service-safety', plannedQuestionCount: 2, purpose: 'Check infection-control, blade, cut/nick, contraindication, and service-safety decisions.' },
  { id: 'mc-13-08', afterSectionId: 'satisfaction-factors', conceptFamilyId: 'ch13-client-care-professional-practice', plannedQuestionCount: 2, purpose: 'Check client-care, communication, comfort, and professional-practice decisions.' },
]

export function getChapter13ContentBlocksForConcept(conceptFamilyId: Chapter13ConceptFamilyId) {
  return chapter13ContentConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).map((mapping) => mapping.contentBlockId)
}

export function getChapter13FlashcardsForConcept(conceptFamilyId: Chapter13ConceptFamilyId) {
  return chapter13FlashcardConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).map((mapping) => mapping.flashcardId)
}

export function getChapter13QuizQuestionsForConcept(conceptFamilyId: Chapter13ConceptFamilyId) {
  return chapter13QuizQuestionConceptMappings.filter((mapping) => mapping.conceptFamilyId === conceptFamilyId).map((mapping) => mapping.questionId)
}
