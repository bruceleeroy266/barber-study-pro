import type { Chapter7ConceptFamilyId } from './types'

export interface Chapter7ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter7ConceptFamilyId
}

export interface Chapter7FlashcardConceptMapping {
  flashcardId: `fc-7-${string}`
  conceptFamilyId: Chapter7ConceptFamilyId
}

export interface Chapter7QuizQuestionConceptMapping {
  questionId: `qq-7-${string}`
  conceptFamilyId: Chapter7ConceptFamilyId
}

export interface Chapter7MicroCheckPlacement {
  id: `mc-7-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter7ConceptFamilyId
  plannedQuestionCount: 1 | 2 | 3
  purpose: string
}

export const chapter7ContentConceptMappings: readonly Chapter7ContentConceptMapping[] = [
  { contentBlockId: 'organic-inorganic', conceptFamilyId: 'ch7-organic-inorganic' },
  { contentBlockId: 'building-blocks', conceptFamilyId: 'ch7-matter-structure' },
  { contentBlockId: 'pure-vs-mixture', conceptFamilyId: 'ch7-matter-structure' },
  { contentBlockId: 'changes-grid', conceptFamilyId: 'ch7-properties-changes' },
  { contentBlockId: 'redox-reactions', conceptFamilyId: 'ch7-redox-reactions' },
  { contentBlockId: 'mixtures', conceptFamilyId: 'ch7-mixtures' },
  { contentBlockId: 'surfactants', conceptFamilyId: 'ch7-mixtures' },
  { contentBlockId: 'ph-mastery', conceptFamilyId: 'ch7-water-ph' },
  { contentBlockId: 'water-essentials', conceptFamilyId: 'ch7-water-ph' },
  { contentBlockId: 'shampoo-conditioner', conceptFamilyId: 'ch7-shampoos' },
  { contentBlockId: 'shampoo-types', conceptFamilyId: 'ch7-shampoos' },
  { contentBlockId: 'conditioner-types', conceptFamilyId: 'ch7-conditioners' },
  { contentBlockId: 'surfactant-types', conceptFamilyId: 'ch7-shampoos' },
  { contentBlockId: 'common-ingredients', conceptFamilyId: 'ch7-other-preparations' },
  { contentBlockId: 'other-preparations', conceptFamilyId: 'ch7-other-preparations' },
  { contentBlockId: 'common-mistakes', conceptFamilyId: 'ch7-chemical-safety' },
  { contentBlockId: 'safety', conceptFamilyId: 'ch7-chemical-safety' },
  { contentBlockId: 'chemical-safety-scenario', conceptFamilyId: 'ch7-chemical-safety' },
]

const fc = (n: number): `fc-7-${string}` => `fc-7-${String(n).padStart(3, '0')}`

export const chapter7FlashcardConceptMappings: readonly Chapter7FlashcardConceptMapping[] = [
  { flashcardId: fc(1), conceptFamilyId: 'ch7-matter-structure' },
  { flashcardId: fc(2), conceptFamilyId: 'ch7-organic-inorganic' },
  { flashcardId: fc(3), conceptFamilyId: 'ch7-organic-inorganic' },
  { flashcardId: fc(4), conceptFamilyId: 'ch7-matter-structure' },
  { flashcardId: fc(5), conceptFamilyId: 'ch7-properties-changes' },
  { flashcardId: fc(6), conceptFamilyId: 'ch7-properties-changes' },
  ...[7, 8, 9, 10].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch7-matter-structure' as const })),
  ...Array.from({ length: 8 }, (_, i) => ({ flashcardId: fc(11 + i), conceptFamilyId: 'ch7-redox-reactions' as const })),
  ...Array.from({ length: 8 }, (_, i) => ({ flashcardId: fc(19 + i), conceptFamilyId: 'ch7-mixtures' as const })),
  ...Array.from({ length: 12 }, (_, i) => ({ flashcardId: fc(27 + i), conceptFamilyId: 'ch7-water-ph' as const })),
  ...[39, 40, 41, 42, 43, 44].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch7-shampoos' as const })),
  { flashcardId: fc(45), conceptFamilyId: 'ch7-conditioners' },
  { flashcardId: fc(46), conceptFamilyId: 'ch7-conditioners' },
  ...[47, 48, 49, 50].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch7-shampoos' as const })),
  { flashcardId: fc(51), conceptFamilyId: 'ch7-other-preparations' },
  { flashcardId: fc(52), conceptFamilyId: 'ch7-redox-reactions' },
  ...[53, 54, 55, 56, 57, 58, 59].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch7-other-preparations' as const })),
  { flashcardId: fc(60), conceptFamilyId: 'ch7-chemical-safety' },
  { flashcardId: fc(61), conceptFamilyId: 'ch7-other-preparations' },
  { flashcardId: fc(62), conceptFamilyId: 'ch7-other-preparations' },
  ...Array.from({ length: 8 }, (_, i) => ({ flashcardId: fc(63 + i), conceptFamilyId: 'ch7-chemical-safety' as const })),
  { flashcardId: fc(71), conceptFamilyId: 'ch7-matter-structure' },
  { flashcardId: fc(72), conceptFamilyId: 'ch7-matter-structure' },
  { flashcardId: fc(73), conceptFamilyId: 'ch7-water-ph' },
  { flashcardId: fc(74), conceptFamilyId: 'ch7-water-ph' },
  { flashcardId: fc(75), conceptFamilyId: 'ch7-water-ph' },
  { flashcardId: fc(76), conceptFamilyId: 'ch7-properties-changes' },
  { flashcardId: fc(77), conceptFamilyId: 'ch7-water-ph' },
  { flashcardId: fc(78), conceptFamilyId: 'ch7-water-ph' },
  { flashcardId: fc(79), conceptFamilyId: 'ch7-matter-structure' },
  { flashcardId: fc(80), conceptFamilyId: 'ch7-chemical-safety' },
]

const qq = (n: number): `qq-7-${string}` => `qq-7-${String(n).padStart(3, '0')}`

export const chapter7QuizQuestionConceptMappings: readonly Chapter7QuizQuestionConceptMapping[] = [
  { questionId: qq(1), conceptFamilyId: 'ch7-matter-structure' },
  { questionId: qq(2), conceptFamilyId: 'ch7-organic-inorganic' },
  { questionId: qq(3), conceptFamilyId: 'ch7-organic-inorganic' },
  { questionId: qq(4), conceptFamilyId: 'ch7-matter-structure' },
  { questionId: qq(5), conceptFamilyId: 'ch7-properties-changes' },
  { questionId: qq(6), conceptFamilyId: 'ch7-matter-structure' },
  ...Array.from({ length: 6 }, (_, i) => ({ questionId: qq(7 + i), conceptFamilyId: 'ch7-redox-reactions' as const })),
  ...Array.from({ length: 6 }, (_, i) => ({ questionId: qq(13 + i), conceptFamilyId: 'ch7-mixtures' as const })),
  ...Array.from({ length: 8 }, (_, i) => ({ questionId: qq(19 + i), conceptFamilyId: 'ch7-water-ph' as const })),
  ...[27, 28, 29, 30, 31].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch7-shampoos' as const })),
  { questionId: qq(32), conceptFamilyId: 'ch7-conditioners' },
  { questionId: qq(33), conceptFamilyId: 'ch7-conditioners' },
  { questionId: qq(34), conceptFamilyId: 'ch7-shampoos' },
  ...[35, 37, 38, 39, 40, 41, 42].map((n) => ({ questionId: qq(n), conceptFamilyId: 'ch7-other-preparations' as const })),
  { questionId: qq(36), conceptFamilyId: 'ch7-redox-reactions' },
  ...Array.from({ length: 6 }, (_, i) => ({ questionId: qq(43 + i), conceptFamilyId: 'ch7-chemical-safety' as const })),
  { questionId: qq(49), conceptFamilyId: 'ch7-matter-structure' },
  { questionId: qq(50), conceptFamilyId: 'ch7-water-ph' },
]

export const chapter7MicroCheckPlacements: readonly Chapter7MicroCheckPlacement[] = [
  {
    id: 'mc-7-01',
    afterSectionId: 'organic-inorganic',
    conceptFamilyId: 'ch7-organic-inorganic',
    plannedQuestionCount: 2,
    purpose: 'Check classification reasoning before moving into chemical structure.',
  },
  {
    id: 'mc-7-02',
    afterSectionId: 'building-blocks',
    conceptFamilyId: 'ch7-matter-structure',
    plannedQuestionCount: 2,
    purpose: 'Check relationships among matter, atoms, molecules, elements, and compounds.',
  },
  {
    id: 'mc-7-03',
    afterSectionId: 'changes-grid',
    conceptFamilyId: 'ch7-properties-changes',
    plannedQuestionCount: 2,
    purpose: 'Distinguish physical versus chemical properties and changes using barbering examples.',
  },
  {
    id: 'mc-7-04',
    afterSectionId: 'redox-reactions',
    conceptFamilyId: 'ch7-redox-reactions',
    plannedQuestionCount: 3,
    purpose: 'Check reaction direction and application rather than vocabulary-only recall.',
  },
  {
    id: 'mc-7-05',
    afterSectionId: 'mixtures',
    conceptFamilyId: 'ch7-mixtures',
    plannedQuestionCount: 2,
    purpose: 'Differentiate solutions, suspensions, and emulsions from product behavior.',
  },
  {
    id: 'mc-7-06',
    afterSectionId: 'ph-mastery',
    conceptFamilyId: 'ch7-water-ph',
    plannedQuestionCount: 3,
    purpose: 'Check pH, acid/alkali effects, and neutralization reasoning.',
  },
  {
    id: 'mc-7-07',
    afterSectionId: 'shampoo-types',
    conceptFamilyId: 'ch7-shampoos',
    plannedQuestionCount: 2,
    purpose: 'Match shampoo chemistry and product purpose to client needs.',
  },
  {
    id: 'mc-7-08',
    afterSectionId: 'conditioner-types',
    conceptFamilyId: 'ch7-conditioners',
    plannedQuestionCount: 2,
    purpose: 'Match conditioner classification and function to hair condition.',
  },
  {
    id: 'mc-7-09',
    afterSectionId: 'other-preparations',
    conceptFamilyId: 'ch7-other-preparations',
    plannedQuestionCount: 2,
    purpose: 'Check product-purpose and ingredient reasoning without brand memorization.',
  },
  {
    id: 'mc-7-10',
    afterSectionId: 'safety',
    conceptFamilyId: 'ch7-chemical-safety',
    plannedQuestionCount: 3,
    purpose: 'Check label, interaction, exposure, and safe-response decisions.',
  },
]

export function getChapter7FlashcardsForConcept(conceptFamilyId: Chapter7ConceptFamilyId) {
  return chapter7FlashcardConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.flashcardId)
}

export function getChapter7QuizQuestionsForConcept(conceptFamilyId: Chapter7ConceptFamilyId) {
  return chapter7QuizQuestionConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.questionId)
}
