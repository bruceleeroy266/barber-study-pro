import type { Chapter8ConceptFamilyId } from './types'

export interface Chapter8ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter8ConceptFamilyId
}

export interface Chapter8FlashcardConceptMapping {
  flashcardId: `fc-8-${string}`
  conceptFamilyId: Chapter8ConceptFamilyId
}

export interface Chapter8QuizQuestionConceptMapping {
  questionId: `qq-8-${string}`
  conceptFamilyId: Chapter8ConceptFamilyId
}

export const chapter8ContentConceptMappings: readonly Chapter8ContentConceptMapping[] = [
  { contentBlockId: 'command-center-welcome', conceptFamilyId: 'ch8-equipment-safety' },
  { contentBlockId: 'why-electricity-matters', conceptFamilyId: 'ch8-electricity-circuits' },
  { contentBlockId: 'why-electricity-matters', conceptFamilyId: 'ch8-equipment-safety' },
  { contentBlockId: 'why-electricity-matters', conceptFamilyId: 'ch8-light-modalities' },
  { contentBlockId: 'electrical-certification', conceptFamilyId: 'ch8-equipment-safety' },
  { contentBlockId: 'electrical-certification', conceptFamilyId: 'ch8-electrotherapy-terminology' },
  { contentBlockId: 'electrical-certification', conceptFamilyId: 'ch8-light-modalities' },

  { contentBlockId: 'what-is-electricity', conceptFamilyId: 'ch8-electricity-circuits' },
  { contentBlockId: 'conductors-insulators', conceptFamilyId: 'ch8-electricity-circuits' },
  { contentBlockId: 'conductors-insulators', conceptFamilyId: 'ch8-equipment-safety' },
  { contentBlockId: 'current-types', conceptFamilyId: 'ch8-current-conversion' },

  { contentBlockId: 'electrical-measurements', conceptFamilyId: 'ch8-electrical-measurements' },
  { contentBlockId: 'electrical-formula-foundations', conceptFamilyId: 'ch8-electrical-measurements' },
  { contentBlockId: 'four-terms-grid', conceptFamilyId: 'ch8-electrical-measurements' },
  { contentBlockId: 'three-formulas', conceptFamilyId: 'ch8-electrical-measurements' },
  { contentBlockId: 'worked-examples', conceptFamilyId: 'ch8-electrical-measurements' },

  { contentBlockId: 'barber-safety-meaning', conceptFamilyId: 'ch8-equipment-safety' },
  { contentBlockId: 'safety-devices', conceptFamilyId: 'ch8-equipment-safety' },
  { contentBlockId: 'circuit-breaker-challenge', conceptFamilyId: 'ch8-equipment-safety' },
  { contentBlockId: 'circuit-breaker-challenge', conceptFamilyId: 'ch8-electrical-measurements' },
  { contentBlockId: 'safety-rules', conceptFamilyId: 'ch8-equipment-safety' },

  { contentBlockId: 'electrotherapy-intro', conceptFamilyId: 'ch8-electrotherapy-terminology' },
  { contentBlockId: 'polarity', conceptFamilyId: 'ch8-electrotherapy-terminology' },
  { contentBlockId: 'polarity', conceptFamilyId: 'ch8-galvanic-current' },
  { contentBlockId: 'galvanic-current', conceptFamilyId: 'ch8-galvanic-current' },
  { contentBlockId: 'other-modalities', conceptFamilyId: 'ch8-microcurrent-high-frequency' },

  { contentBlockId: 'electromagnetic-spectrum', conceptFamilyId: 'ch8-electromagnetic-spectrum' },
  { contentBlockId: 'light-types', conceptFamilyId: 'ch8-electromagnetic-spectrum' },
  { contentBlockId: 'light-therapy-intro', conceptFamilyId: 'ch8-light-modalities' },
  { contentBlockId: 'light-therapy-intro', conceptFamilyId: 'ch8-light-therapy-safety' },
  { contentBlockId: 'led-therapy', conceptFamilyId: 'ch8-light-modalities' },
  { contentBlockId: 'therapeutic-lamps', conceptFamilyId: 'ch8-light-modalities' },
  { contentBlockId: 'light-therapy-safety', conceptFamilyId: 'ch8-light-therapy-safety' },
  { contentBlockId: 'lasers', conceptFamilyId: 'ch8-light-modalities' },
  { contentBlockId: 'lasers', conceptFamilyId: 'ch8-light-therapy-safety' },

  { contentBlockId: 'memory-aids', conceptFamilyId: 'ch8-electrical-measurements' },
  { contentBlockId: 'memory-aids', conceptFamilyId: 'ch8-electrotherapy-terminology' },
  { contentBlockId: 'memory-aids', conceptFamilyId: 'ch8-electromagnetic-spectrum' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch8-electricity-circuits' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch8-current-conversion' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch8-electrical-measurements' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch8-equipment-safety' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch8-electrotherapy-terminology' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch8-galvanic-current' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch8-microcurrent-high-frequency' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch8-electromagnetic-spectrum' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch8-light-modalities' },
  { contentBlockId: 'board-exam-alerts', conceptFamilyId: 'ch8-light-therapy-safety' },
  { contentBlockId: 'hazard-scenarios', conceptFamilyId: 'ch8-equipment-safety' },
  { contentBlockId: 'hazard-scenarios', conceptFamilyId: 'ch8-galvanic-current' },
  { contentBlockId: 'hazard-scenarios', conceptFamilyId: 'ch8-light-therapy-safety' },
  { contentBlockId: 'action-prompts', conceptFamilyId: 'ch8-equipment-safety' },
  { contentBlockId: 'action-prompts', conceptFamilyId: 'ch8-light-therapy-safety' },
  { contentBlockId: 'power-pledge', conceptFamilyId: 'ch8-equipment-safety' },
]

const fc = (n: number): `fc-8-${string}` => `fc-8-${String(n).padStart(3, '0')}`

export const chapter8FlashcardConceptMappings: readonly Chapter8FlashcardConceptMapping[] = [
  ...[1, 2, 3, 4].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch8-electricity-circuits' as const })),
  { flashcardId: fc(5), conceptFamilyId: 'ch8-equipment-safety' },

  ...[6, 7, 8].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch8-current-conversion' as const })),
  ...[9, 10, 11, 12, 13, 14].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch8-electrical-measurements' as const })),

  ...Array.from({ length: 10 }, (_, i) => ({ flashcardId: fc(15 + i), conceptFamilyId: 'ch8-equipment-safety' as const })),

  ...[25, 26, 27].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch8-electrotherapy-terminology' as const })),
  ...[28, 29, 30, 31, 32].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch8-galvanic-current' as const })),
  ...[33, 34].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch8-microcurrent-high-frequency' as const })),

  ...[35, 36, 37, 38, 39, 40].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch8-electromagnetic-spectrum' as const })),
  ...[41, 42, 43].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch8-light-modalities' as const })),
  { flashcardId: fc(44), conceptFamilyId: 'ch8-light-therapy-safety' },
  { flashcardId: fc(45), conceptFamilyId: 'ch8-light-modalities' },

  { flashcardId: fc(46), conceptFamilyId: 'ch8-equipment-safety' },
  { flashcardId: fc(47), conceptFamilyId: 'ch8-electrotherapy-terminology' },
  { flashcardId: fc(48), conceptFamilyId: 'ch8-equipment-safety' },
  { flashcardId: fc(49), conceptFamilyId: 'ch8-galvanic-current' },
  { flashcardId: fc(50), conceptFamilyId: 'ch8-equipment-safety' },
]

const qq = (n: number): `qq-8-${string}` => `qq-8-${String(n).padStart(3, '0')}`

export const chapter8QuizQuestionConceptMappings: readonly Chapter8QuizQuestionConceptMapping[] = [
  { questionId: qq(1), conceptFamilyId: 'ch8-electricity-circuits' },
  { questionId: qq(2), conceptFamilyId: 'ch8-electricity-circuits' },
  { questionId: qq(3), conceptFamilyId: 'ch8-electricity-circuits' },
  { questionId: qq(4), conceptFamilyId: 'ch8-current-conversion' },
  { questionId: qq(5), conceptFamilyId: 'ch8-electrical-measurements' },
  { questionId: qq(6), conceptFamilyId: 'ch8-electrical-measurements' },
  { questionId: qq(7), conceptFamilyId: 'ch8-equipment-safety' },
  { questionId: qq(8), conceptFamilyId: 'ch8-equipment-safety' },
  { questionId: qq(9), conceptFamilyId: 'ch8-electromagnetic-spectrum' },
  { questionId: qq(10), conceptFamilyId: 'ch8-light-therapy-safety' },

  { questionId: qq(11), conceptFamilyId: 'ch8-electricity-circuits' },
  { questionId: qq(12), conceptFamilyId: 'ch8-equipment-safety' },
  { questionId: qq(13), conceptFamilyId: 'ch8-current-conversion' },
  { questionId: qq(14), conceptFamilyId: 'ch8-electrical-measurements' },
  { questionId: qq(15), conceptFamilyId: 'ch8-equipment-safety' },
  { questionId: qq(16), conceptFamilyId: 'ch8-equipment-safety' },
  { questionId: qq(17), conceptFamilyId: 'ch8-electrotherapy-terminology' },
  { questionId: qq(18), conceptFamilyId: 'ch8-galvanic-current' },
  { questionId: qq(19), conceptFamilyId: 'ch8-electromagnetic-spectrum' },
  { questionId: qq(20), conceptFamilyId: 'ch8-light-modalities' },

  { questionId: qq(21), conceptFamilyId: 'ch8-electrical-measurements' },
  { questionId: qq(22), conceptFamilyId: 'ch8-current-conversion' },
  { questionId: qq(23), conceptFamilyId: 'ch8-equipment-safety' },
  { questionId: qq(24), conceptFamilyId: 'ch8-galvanic-current' },
  { questionId: qq(25), conceptFamilyId: 'ch8-galvanic-current' },
  { questionId: qq(26), conceptFamilyId: 'ch8-microcurrent-high-frequency' },
  { questionId: qq(27), conceptFamilyId: 'ch8-electromagnetic-spectrum' },
  { questionId: qq(28), conceptFamilyId: 'ch8-galvanic-current' },
  { questionId: qq(29), conceptFamilyId: 'ch8-light-modalities' },
  { questionId: qq(30), conceptFamilyId: 'ch8-light-modalities' },
]

export function getChapter8ContentBlocksForConcept(conceptFamilyId: Chapter8ConceptFamilyId) {
  return chapter8ContentConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.contentBlockId)
}

export function getChapter8FlashcardsForConcept(conceptFamilyId: Chapter8ConceptFamilyId) {
  return chapter8FlashcardConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.flashcardId)
}

export function getChapter8QuizQuestionsForConcept(conceptFamilyId: Chapter8ConceptFamilyId) {
  return chapter8QuizQuestionConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.questionId)
}
