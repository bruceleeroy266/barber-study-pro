import type { Chapter9ConceptFamilyId } from './types'

export interface Chapter9ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter9ConceptFamilyId
}

export interface Chapter9FlashcardConceptMapping {
  flashcardId: `fc-9-${string}`
  conceptFamilyId: Chapter9ConceptFamilyId
}

export interface Chapter9QuizQuestionConceptMapping {
  questionId: `q9-${string}`
  conceptFamilyId: Chapter9ConceptFamilyId
}

export const chapter9ContentConceptMappings: readonly Chapter9ContentConceptMapping[] = [
  { contentBlockId: 'academy-welcome', conceptFamilyId: 'ch9-service-safety-referral' },
  { contentBlockId: 'why-study-skin', conceptFamilyId: 'ch9-service-safety-referral' },
  { contentBlockId: 'skin-certification', conceptFamilyId: 'ch9-service-safety-referral' },
  { contentBlockId: 'key-definitions', conceptFamilyId: 'ch9-service-safety-referral' },
  { contentBlockId: 'learning-objectives', conceptFamilyId: 'ch9-service-safety-referral' },

  { contentBlockId: 'skin-basics', conceptFamilyId: 'ch9-epidermis-skin-barrier' },
  { contentBlockId: 'skin-divisions', conceptFamilyId: 'ch9-epidermis-skin-barrier' },
  { contentBlockId: 'epidermis-layers', conceptFamilyId: 'ch9-epidermis-skin-barrier' },
  { contentBlockId: 'melanin', conceptFamilyId: 'ch9-pigmentation-hypertrophies' },

  { contentBlockId: 'skin-fluids', conceptFamilyId: 'ch9-dermis-subcutaneous-support' },
  { contentBlockId: 'skin-nerves', conceptFamilyId: 'ch9-dermis-subcutaneous-support' },
  { contentBlockId: 'skin-characteristics', conceptFamilyId: 'ch9-dermis-subcutaneous-support' },

  { contentBlockId: 'skin-glands', conceptFamilyId: 'ch9-skin-functions-glands' },
  { contentBlockId: 'skin-absorption', conceptFamilyId: 'ch9-skin-functions-glands' },
  { contentBlockId: 'skin-functions', conceptFamilyId: 'ch9-skin-functions-glands' },

  { contentBlockId: 'lesion-definition', conceptFamilyId: 'ch9-primary-lesions' },
  { contentBlockId: 'primary-lesions', conceptFamilyId: 'ch9-primary-lesions' },
  { contentBlockId: 'secondary-lesions', conceptFamilyId: 'ch9-secondary-lesions' },
  { contentBlockId: 'referral-caution', conceptFamilyId: 'ch9-service-safety-referral' },

  { contentBlockId: 'sebaceous-disorders', conceptFamilyId: 'ch9-sebaceous-sudoriferous-disorders' },
  { contentBlockId: 'sudoriferous-disorders', conceptFamilyId: 'ch9-sebaceous-sudoriferous-disorders' },
  { contentBlockId: 'inflammations', conceptFamilyId: 'ch9-inflammatory-infectious-conditions' },
  { contentBlockId: 'pigment-disorders', conceptFamilyId: 'ch9-pigmentation-hypertrophies' },
  { contentBlockId: 'hypertrophies', conceptFamilyId: 'ch9-pigmentation-hypertrophies' },

  { contentBlockId: 'skin-cancer', conceptFamilyId: 'ch9-skin-cancer-recognition' },
  { contentBlockId: 'abcde-melanoma', conceptFamilyId: 'ch9-skin-cancer-recognition' },
  { contentBlockId: 'skin-health', conceptFamilyId: 'ch9-service-safety-referral' },
  { contentBlockId: 'memory-aids', conceptFamilyId: 'ch9-service-safety-referral' },

  { contentBlockId: 'board-exam-structure', conceptFamilyId: 'ch9-epidermis-skin-barrier' },
  { contentBlockId: 'board-exam-glands', conceptFamilyId: 'ch9-skin-functions-glands' },
  { contentBlockId: 'board-exam-lesions', conceptFamilyId: 'ch9-primary-lesions' },
  { contentBlockId: 'board-exam-cancer', conceptFamilyId: 'ch9-skin-cancer-recognition' },
  { contentBlockId: 'board-exam-safety', conceptFamilyId: 'ch9-service-safety-referral' },
  { contentBlockId: 'board-exam-traps', conceptFamilyId: 'ch9-service-safety-referral' },
  { contentBlockId: 'skin-scenario', conceptFamilyId: 'ch9-service-safety-referral' },
  { contentBlockId: 'action-prompts', conceptFamilyId: 'ch9-service-safety-referral' },
  { contentBlockId: 'practice-questions', conceptFamilyId: 'ch9-service-safety-referral' },
  { contentBlockId: 'academy-pledge', conceptFamilyId: 'ch9-service-safety-referral' },
]

const fc = (n: number): `fc-9-${string}` => `fc-9-${String(n).padStart(3, '0')}`

export const chapter9FlashcardConceptMappings: readonly Chapter9FlashcardConceptMapping[] = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
    flashcardId: fc(n),
    conceptFamilyId: 'ch9-epidermis-skin-barrier' as const,
  })),
  ...[11, 12, 13, 14, 15].map((n) => ({
    flashcardId: fc(n),
    conceptFamilyId: 'ch9-dermis-subcutaneous-support' as const,
  })),
  ...[16, 17, 18, 19].map((n) => ({
    flashcardId: fc(n),
    conceptFamilyId: 'ch9-skin-functions-glands' as const,
  })),
  { flashcardId: fc(20), conceptFamilyId: 'ch9-pigmentation-hypertrophies' },

  ...[21, 22, 23, 24, 25].map((n) => ({
    flashcardId: fc(n),
    conceptFamilyId: 'ch9-primary-lesions' as const,
  })),
  ...[26, 27, 28, 29, 30].map((n) => ({
    flashcardId: fc(n),
    conceptFamilyId: 'ch9-secondary-lesions' as const,
  })),

  ...[31, 34, 35, 36, 40].map((n) => ({
    flashcardId: fc(n),
    conceptFamilyId: 'ch9-sebaceous-sudoriferous-disorders' as const,
  })),
  ...[32, 33, 37, 38, 39].map((n) => ({
    flashcardId: fc(n),
    conceptFamilyId: 'ch9-inflammatory-infectious-conditions' as const,
  })),

  ...[41, 42, 43, 44, 45].map((n) => ({
    flashcardId: fc(n),
    conceptFamilyId: 'ch9-pigmentation-hypertrophies' as const,
  })),
  ...[46, 47, 48].map((n) => ({
    flashcardId: fc(n),
    conceptFamilyId: 'ch9-skin-cancer-recognition' as const,
  })),
  ...[49, 50].map((n) => ({
    flashcardId: fc(n),
    conceptFamilyId: 'ch9-service-safety-referral' as const,
  })),
]

const q = (n: number): `q9-${string}` => `q9-${String(n).padStart(3, '0')}`

export const chapter9QuizQuestionConceptMappings: readonly Chapter9QuizQuestionConceptMapping[] = [
  ...[1, 2, 3, 4, 5, 6].map((n) => ({
    questionId: q(n),
    conceptFamilyId: 'ch9-epidermis-skin-barrier' as const,
  })),
  ...[7, 8, 9].map((n) => ({
    questionId: q(n),
    conceptFamilyId: 'ch9-dermis-subcutaneous-support' as const,
  })),
  ...[10, 11, 12].map((n) => ({
    questionId: q(n),
    conceptFamilyId: 'ch9-skin-functions-glands' as const,
  })),
  ...[13, 14, 15].map((n) => ({
    questionId: q(n),
    conceptFamilyId: 'ch9-primary-lesions' as const,
  })),
  ...[16, 17, 18].map((n) => ({
    questionId: q(n),
    conceptFamilyId: 'ch9-secondary-lesions' as const,
  })),
  ...[19, 20, 22].map((n) => ({
    questionId: q(n),
    conceptFamilyId: 'ch9-sebaceous-sudoriferous-disorders' as const,
  })),
  ...[21, 23, 24].map((n) => ({
    questionId: q(n),
    conceptFamilyId: 'ch9-inflammatory-infectious-conditions' as const,
  })),
  ...[25, 26, 27].map((n) => ({
    questionId: q(n),
    conceptFamilyId: 'ch9-pigmentation-hypertrophies' as const,
  })),
  ...[28, 29].map((n) => ({
    questionId: q(n),
    conceptFamilyId: 'ch9-skin-cancer-recognition' as const,
  })),
  { questionId: q(30), conceptFamilyId: 'ch9-service-safety-referral' },
]

export function getChapter9ContentBlocksForConcept(conceptFamilyId: Chapter9ConceptFamilyId) {
  return chapter9ContentConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.contentBlockId)
}

export function getChapter9FlashcardsForConcept(conceptFamilyId: Chapter9ConceptFamilyId) {
  return chapter9FlashcardConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.flashcardId)
}

export function getChapter9QuizQuestionsForConcept(conceptFamilyId: Chapter9ConceptFamilyId) {
  return chapter9QuizQuestionConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.questionId)
}
