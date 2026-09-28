import type { Chapter11ConceptFamilyId } from './types'

export interface Chapter11ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter11ConceptFamilyId
}

export interface Chapter11FlashcardConceptMapping {
  flashcardId: `fc-11-${string}`
  conceptFamilyId: Chapter11ConceptFamilyId
}

export interface Chapter11QuizQuestionConceptMapping {
  questionId: `qq-11-${string}`
  conceptFamilyId: Chapter11ConceptFamilyId
}

export interface Chapter11MicroCheckPlacement {
  id: `mc-11-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter11ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
}

export const chapter11ContentConceptMappings: readonly Chapter11ContentConceptMapping[] = [
  { contentBlockId: 'treatment-sanctuary-welcome', conceptFamilyId: 'ch11-client-care-professional-practice' },
  { contentBlockId: 'draping-shampoo-service', conceptFamilyId: 'ch11-shampoo-draping-service' },
  { contentBlockId: 'why-treatment-matters', conceptFamilyId: 'ch11-scalp-hair-treatments' },
  { contentBlockId: 'treatment-certification', conceptFamilyId: 'ch11-client-care-professional-practice' },
  { contentBlockId: 'scalp-treatment-types', conceptFamilyId: 'ch11-scalp-hair-treatments' },
  { contentBlockId: 'moisturizing', conceptFamilyId: 'ch11-scalp-condition-recognition' },
  { contentBlockId: 'clarifying', conceptFamilyId: 'ch11-scalp-condition-recognition' },
  { contentBlockId: 'stimulating', conceptFamilyId: 'ch11-scalp-hair-treatments' },
  { contentBlockId: 'dandruff', conceptFamilyId: 'ch11-scalp-condition-recognition' },
  { contentBlockId: 'hair-treatment-types', conceptFamilyId: 'ch11-scalp-hair-treatments' },
  { contentBlockId: 'product-selection-system', conceptFamilyId: 'ch11-analysis-product-selection' },
  { contentBlockId: 'treatment-matching-scenarios', conceptFamilyId: 'ch11-analysis-product-selection' },
  { contentBlockId: 'treatment-procedure', conceptFamilyId: 'ch11-scalp-hair-treatments' },
  { contentBlockId: 'massage-techniques', conceptFamilyId: 'ch11-scalp-massage' },
  { contentBlockId: 'effleurage', conceptFamilyId: 'ch11-scalp-massage' },
  { contentBlockId: 'petrissage', conceptFamilyId: 'ch11-scalp-massage' },
  { contentBlockId: 'friction', conceptFamilyId: 'ch11-scalp-massage' },
  { contentBlockId: 'tapotement', conceptFamilyId: 'ch11-scalp-massage' },
  { contentBlockId: 'massage-benefits', conceptFamilyId: 'ch11-scalp-massage' },
  { contentBlockId: 'treatment-equipment-steam-hot-towels', conceptFamilyId: 'ch11-treatment-equipment' },
  { contentBlockId: 'home-care-system', conceptFamilyId: 'ch11-client-care-professional-practice' },
  { contentBlockId: 'retail-sales-mastery', conceptFamilyId: 'ch11-client-care-professional-practice' },
  { contentBlockId: 'common-confusions', conceptFamilyId: 'ch11-service-safety-referral' },
  { contentBlockId: 'memory-tricks', conceptFamilyId: 'ch11-client-care-professional-practice' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch11-service-safety-referral' },
  { contentBlockId: 'treatment-action-items', conceptFamilyId: 'ch11-client-care-professional-practice' },
  { contentBlockId: 'treatment-sanctuary-pledge', conceptFamilyId: 'ch11-client-care-professional-practice' },
]

const fc = (n: number): `fc-11-${string}` => `fc-11-${String(n).padStart(3, '0')}`

export const chapter11FlashcardConceptMappings: readonly Chapter11FlashcardConceptMapping[] = [
  ...[1,2,3,4,5,6,7,8,9,10,11,12,13,14,72,74,75,77].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch11-shampoo-draping-service' as const })),
  ...[15,16,17,18,19,20,63,64,65,66,67,68,69,70,71].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch11-analysis-product-selection' as const })),
  ...[21,22,23,24,25,26,27,28,29,30,78,79].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch11-scalp-massage' as const })),
  ...[31,32,44,52].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch11-scalp-hair-treatments' as const })),
  ...[45,46,47,48,49,50,51].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch11-treatment-equipment' as const })),
  ...[33,34,35,36,37,38,39,40,41,42,43].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch11-scalp-condition-recognition' as const })),
  ...[53,54,55,56,57,58,59,60,61,62,80].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch11-service-safety-referral' as const })),
  ...[73,76].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch11-client-care-professional-practice' as const })),
]

const q = (n: number): `qq-11-${string}` => `qq-11-${String(n).padStart(3, '0')}`

export const chapter11QuizQuestionConceptMappings: readonly Chapter11QuizQuestionConceptMapping[] = [
  ...[1,2,3,4,5,6,7,8,9,10,11].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch11-shampoo-draping-service' as const })),
  ...[13,14,15,16,17,45,46,47,48,49].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch11-analysis-product-selection' as const })),
  ...[18,19,20,21,22,23,24].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch11-scalp-massage' as const })),
  ...[25,26,32,37].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch11-scalp-hair-treatments' as const })),
  ...[33,34,35,36].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch11-treatment-equipment' as const })),
  ...[27,28,29,30,31,41].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch11-scalp-condition-recognition' as const })),
  ...[38,39,40,42,43,44,50].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch11-service-safety-referral' as const })),
  { questionId: q(12), conceptFamilyId: 'ch11-client-care-professional-practice' },
]

export const chapter11MicroCheckPlacements: readonly Chapter11MicroCheckPlacement[] = [
  { id: 'mc-11-01', afterSectionId: 'draping-shampoo-service', conceptFamilyId: 'ch11-shampoo-draping-service', plannedQuestionCount: 2, purpose: 'Check safe shampoo/draping service decisions and preparation sequence.' },
  { id: 'mc-11-02', afterSectionId: 'product-selection-system', conceptFamilyId: 'ch11-analysis-product-selection', plannedQuestionCount: 2, purpose: 'Check analysis-to-product matching from observable hair/scalp characteristics.' },
  { id: 'mc-11-03', afterSectionId: 'massage-techniques', conceptFamilyId: 'ch11-scalp-massage', plannedQuestionCount: 2, purpose: 'Check manipulation selection, sequence, pressure, and service-specific massage reasoning.' },
  { id: 'mc-11-04', afterSectionId: 'treatment-procedure', conceptFamilyId: 'ch11-scalp-hair-treatments', plannedQuestionCount: 2, purpose: 'Check treatment purpose, order, and non-medical service application.' },
  { id: 'mc-11-05', afterSectionId: 'treatment-equipment-steam-hot-towels', conceptFamilyId: 'ch11-treatment-equipment', plannedQuestionCount: 2, purpose: 'Check safe use of steam, hot towels, and electric massage equipment.' },
  { id: 'mc-11-06', afterSectionId: 'dandruff', conceptFamilyId: 'ch11-scalp-condition-recognition', plannedQuestionCount: 2, purpose: 'Check source-covered condition recognition used for service selection.' },
  { id: 'mc-11-07', afterSectionId: 'board-exam-alerts', conceptFamilyId: 'ch11-service-safety-referral', plannedQuestionCount: 3, purpose: 'Check contraindication, service-stop, sanitation, scope, and referral decisions.' },
  { id: 'mc-11-08', afterSectionId: 'home-care-system', conceptFamilyId: 'ch11-client-care-professional-practice', plannedQuestionCount: 2, purpose: 'Check client-care, communication, accommodation, and home-care decisions.' },
]

export function getChapter11ContentBlocksForConcept(conceptFamilyId: Chapter11ConceptFamilyId) {
  return chapter11ContentConceptMappings.filter((m) => m.conceptFamilyId === conceptFamilyId).map((m) => m.contentBlockId)
}

export function getChapter11FlashcardsForConcept(conceptFamilyId: Chapter11ConceptFamilyId) {
  return chapter11FlashcardConceptMappings.filter((m) => m.conceptFamilyId === conceptFamilyId).map((m) => m.flashcardId)
}

export function getChapter11QuizQuestionsForConcept(conceptFamilyId: Chapter11ConceptFamilyId) {
  return chapter11QuizQuestionConceptMappings.filter((m) => m.conceptFamilyId === conceptFamilyId).map((m) => m.questionId)
}
