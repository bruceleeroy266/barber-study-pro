import type { Chapter15ConceptFamilyId } from './types'

export interface Chapter15ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter15ConceptFamilyId
}

export interface Chapter15FlashcardConceptMapping {
  flashcardId: `fc-ch15-${string}`
  conceptFamilyId: Chapter15ConceptFamilyId
}

export interface Chapter15QuizQuestionConceptMapping {
  questionId: `qq-15-${string}`
  conceptFamilyId: Chapter15ConceptFamilyId
}

export interface Chapter15MicroCheckPlacement {
  id: `mc-15-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter15ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
}

export const chapter15MicroCheckPlacements: readonly Chapter15MicroCheckPlacement[] = [
  {
    id: 'mc-15-01',
    afterSectionId: 'marketing-challenge',
    conceptFamilyId: 'ch15-client-consultation-ethics-marketing',
    plannedQuestionCount: 2,
    purpose: 'Check professional terminology, consultation privacy, expectation setting, ethics, and marketing decisions.',
  },
  {
    id: 'mc-15-02',
    afterSectionId: 'scope-scenario',
    conceptFamilyId: 'ch15-alternatives-scope-referral',
    plannedQuestionCount: 2,
    purpose: 'Check alternative-treatment distinctions, scope boundaries, and medical-referral decisions.',
  },
  {
    id: 'mc-15-03',
    afterSectionId: 'manufacturer-evaluation',
    conceptFamilyId: 'ch15-hair-materials-base-construction',
    plannedQuestionCount: 2,
    purpose: 'Check hair-material, base-construction, knotting, and manufacturer-selection concepts.',
  },
  {
    id: 'mc-15-04',
    afterSectionId: 'template-creation',
    conceptFamilyId: 'ch15-system-selection-measurement-template',
    plannedQuestionCount: 2,
    purpose: 'Check stock/custom selection, measurements, supplies, and template planning.',
  },
  {
    id: 'mc-15-05',
    afterSectionId: 'attachment-scenario',
    conceptFamilyId: 'ch15-attachment-methods-bonding',
    plannedQuestionCount: 2,
    purpose: 'Check attachment-method selection, bonding, lace handling, and cure-control decisions.',
  },
  {
    id: 'mc-15-06',
    afterSectionId: 'memory-anchor-floating',
    conceptFamilyId: 'ch15-cleaning-maintenance-chemical-care',
    plannedQuestionCount: 2,
    purpose: 'Check cleaning, storage, maintenance, rotation, and chemical-care limits.',
  },
  {
    id: 'mc-15-07',
    afterSectionId: 'common-mistakes',
    conceptFamilyId: 'ch15-cutting-blending-customization',
    plannedQuestionCount: 2,
    purpose: 'Check cutting sequence, blending, thinning, slide cutting, and conservative customization.',
  },
]

export const chapter15ContentConceptMappings: readonly Chapter15ContentConceptMapping[] = [
  ...['restoration-studio-hero','why-study-replacement','replacement-quote','history-intro','terminology-evolution','memory-anchor-terms','consultation-scenario-1','consultation-fundamentals','consultation-topics','consultation-ethics','consultation-scenario-2','marketing-intro','marketing-channels','sample-system-care','model-release-checklist','marketing-challenge','key-takeaways','chapter-summary']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch15-client-consultation-ethics-marketing' as const })),
  ...['alternatives-intro','alternative-treatments','scope-of-practice','scope-scenario','exam-traps','board-exam-checkpoint']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch15-alternatives-scope-referral' as const })),
  ...['materials-level-up','hair-materials-intro','hair-types','base-construction','base-types','knotting-methods','manufacturer-evaluation']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch15-hair-materials-base-construction' as const })),
  ...['stock-vs-custom','stock-custom-comparison','stock-custom-scenario','supplies-intro','supplies-checklist','measurement-process','template-creation']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch15-system-selection-measurement-template' as const })),
  ...['attachment-intro','attachment-methods','bonding-cure-time','attachment-scenario']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch15-attachment-methods-bonding' as const })),
  ...['cleaning-intro','cleaning-methods','basic-care-guidelines','maintenance-schedule','perm-color-systems','memory-anchor-floating']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch15-cleaning-maintenance-chemical-care' as const })),
  ...['cutting-intro','cutting-procedure','slide-cutting','customizing-stock','blending-challenge','common-mistakes']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch15-cutting-blending-customization' as const })),
]

const fc = (n: number): `fc-ch15-${string}` => `fc-ch15-${String(n).padStart(3, '0')}`
const q = (n: number): `qq-15-${string}` => `qq-15-${String(n).padStart(3, '0')}`
const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i)

export const chapter15FlashcardConceptMappings: readonly Chapter15FlashcardConceptMapping[] = [
  ...range(1, 12).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-client-consultation-ethics-marketing' as const })),
  ...range(13, 20).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-alternatives-scope-referral' as const })),
  ...range(21, 35).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-hair-materials-base-construction' as const })),
  ...range(36, 42).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-system-selection-measurement-template' as const })),
  ...range(43, 48).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-attachment-methods-bonding' as const })),
  ...range(49, 57).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-cleaning-maintenance-chemical-care' as const })),
  ...range(58, 62).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-cutting-blending-customization' as const })),
  ...[63,68,75,89].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-alternatives-scope-referral' as const })),
  ...[64,65,69,70,81,85].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-cleaning-maintenance-chemical-care' as const })),
  ...[66,67,74,78,82,90].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-attachment-methods-bonding' as const })),
  ...[71,72,87].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-client-consultation-ethics-marketing' as const })),
  ...[73,77,80].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-system-selection-measurement-template' as const })),
  ...[76,79].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-hair-materials-base-construction' as const })),
  ...[83,84,86,88].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch15-cutting-blending-customization' as const })),
]

export const chapter15QuizQuestionConceptMappings: readonly Chapter15QuizQuestionConceptMapping[] = [
  ...range(1, 12).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-client-consultation-ethics-marketing' as const })),
  ...range(13, 20).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-alternatives-scope-referral' as const })),
  ...range(21, 30).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-hair-materials-base-construction' as const })),
  ...range(31, 36).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-system-selection-measurement-template' as const })),
  ...range(37, 41).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-attachment-methods-bonding' as const })),
  ...range(42, 49).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-cleaning-maintenance-chemical-care' as const })),
  ...range(50, 55).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-cutting-blending-customization' as const })),
  ...[56,60,72].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-alternatives-scope-referral' as const })),
  ...[57,62,66].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-cleaning-maintenance-chemical-care' as const })),
  ...[58,59,68].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-attachment-methods-bonding' as const })),
  ...[61,63].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-hair-materials-base-construction' as const })),
  { questionId: q(64), conceptFamilyId: 'ch15-system-selection-measurement-template' },
  ...[65,70,71].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-client-consultation-ethics-marketing' as const })),
  ...[67,69].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch15-cutting-blending-customization' as const })),
]

export function getChapter15ContentBlocksForConcept(conceptFamilyId: Chapter15ConceptFamilyId) {
  return chapter15ContentConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.contentBlockId)
}

export function getChapter15FlashcardsForConcept(conceptFamilyId: Chapter15ConceptFamilyId) {
  return chapter15FlashcardConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.flashcardId)
}

export function getChapter15QuizQuestionsForConcept(conceptFamilyId: Chapter15ConceptFamilyId) {
  return chapter15QuizQuestionConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.questionId)
}
