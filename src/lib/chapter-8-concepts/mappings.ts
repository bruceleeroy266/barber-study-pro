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

export interface Chapter8MicroCheckPlacement {
  id: `mc-8-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter8ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
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
  { flashcardId: fc(51), conceptFamilyId: 'ch8-microcurrent-high-frequency' },
  { flashcardId: fc(52), conceptFamilyId: 'ch8-microcurrent-high-frequency' },
  { flashcardId: fc(53), conceptFamilyId: 'ch8-microcurrent-high-frequency' },
  { flashcardId: fc(54), conceptFamilyId: 'ch8-light-therapy-safety' },
  { flashcardId: fc(55), conceptFamilyId: 'ch8-light-therapy-safety' },
  { flashcardId: fc(56), conceptFamilyId: 'ch8-light-therapy-safety' },
  { flashcardId: fc(57), conceptFamilyId: 'ch8-light-therapy-safety' },
]

const qq = (n: number): `qq-8-${string}` => `qq-8-${String(n).padStart(3, '0')}`

export const chapter8QuizQuestionConceptMappings: readonly Chapter8QuizQuestionConceptMapping[] = [
  ...[1, 2, 3].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch8-electricity-circuits' as const })),
  ...[4, 5].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch8-current-conversion' as const })),
  ...[6, 7, 8, 14].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch8-electrical-measurements' as const })),
  ...[9, 10, 11, 12, 13, 15].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch8-equipment-safety' as const })),
  ...[16, 17].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch8-electrotherapy-terminology' as const })),
  ...[18, 19, 20].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch8-galvanic-current' as const })),
  ...[21, 22, 23].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch8-microcurrent-high-frequency' as const })),
  ...[24, 25].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch8-electromagnetic-spectrum' as const })),
  ...[27, 28].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch8-light-modalities' as const })),
  ...[26, 29, 30].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch8-light-therapy-safety' as const })),
]

export const chapter8MicroCheckPlacements: readonly Chapter8MicroCheckPlacement[] = [
  { id: 'mc-8-01', afterSectionId: 'conductors-insulators', conceptFamilyId: 'ch8-electricity-circuits', plannedQuestionCount: 2, purpose: 'Check circuit/conductor reasoning before current types.' },
  { id: 'mc-8-02', afterSectionId: 'current-types', conceptFamilyId: 'ch8-current-conversion', plannedQuestionCount: 2, purpose: 'Check DC/AC and conversion reasoning using barber equipment.' },
  { id: 'mc-8-03', afterSectionId: 'worked-examples', conceptFamilyId: 'ch8-electrical-measurements', plannedQuestionCount: 2, purpose: 'Check volts, amps, watts, and load reasoning without unsafe circuit assumptions.' },
  { id: 'mc-8-04', afterSectionId: 'safety-rules', conceptFamilyId: 'ch8-equipment-safety', plannedQuestionCount: 3, purpose: 'Check stop-use, grounding, wet-area, and repeated-trip safety decisions.' },
  { id: 'mc-8-05', afterSectionId: 'polarity', conceptFamilyId: 'ch8-electrotherapy-terminology', plannedQuestionCount: 2, purpose: 'Check polarity/electrode terminology plus scope boundaries.' },
  { id: 'mc-8-06', afterSectionId: 'galvanic-current', conceptFamilyId: 'ch8-galvanic-current', plannedQuestionCount: 2, purpose: 'Check galvanic source concepts without universal treatment claims.' },
  { id: 'mc-8-07', afterSectionId: 'other-modalities', conceptFamilyId: 'ch8-microcurrent-high-frequency', plannedQuestionCount: 2, purpose: 'Differentiate modalities and stop-service responses.' },
  { id: 'mc-8-08', afterSectionId: 'light-types', conceptFamilyId: 'ch8-electromagnetic-spectrum', plannedQuestionCount: 2, purpose: 'Check wavelength/frequency/UV distinctions without penetration shortcuts.' },
  { id: 'mc-8-09', afterSectionId: 'therapeutic-lamps', conceptFamilyId: 'ch8-light-modalities', plannedQuestionCount: 2, purpose: 'Check device-dependent light modality reasoning and scope.' },
  { id: 'mc-8-10', afterSectionId: 'light-therapy-safety', conceptFamilyId: 'ch8-light-therapy-safety', plannedQuestionCount: 3, purpose: 'Check photosensitivity, eye protection, supervision, and adverse-response decisions.' },
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
