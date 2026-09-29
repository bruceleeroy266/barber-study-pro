import type { Chapter14ConceptFamilyId } from './types'

export interface Chapter14ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter14ConceptFamilyId
}

export interface Chapter14FlashcardConceptMapping {
  flashcardId: `fc-ch14-${string}`
  conceptFamilyId: Chapter14ConceptFamilyId
}

export interface Chapter14QuizQuestionConceptMapping {
  questionId: `qq-14-${string}`
  conceptFamilyId: Chapter14ConceptFamilyId
}

export interface Chapter14MicroCheckPlacement {
  id: `mc-14-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter14ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
}

export const chapter14MicroCheckPlacements: readonly Chapter14MicroCheckPlacement[] = [
  {
    id: 'mc-14-01',
    afterSectionId: 'trim-warning',
    conceptFamilyId: 'ch14-consultation-professional-design',
    plannedQuestionCount: 2,
    purpose: 'Check expectation clarification and professional consultation decisions.',
  },
  {
    id: 'mc-14-02',
    afterSectionId: 'head-sections',
    conceptFamilyId: 'ch14-facial-head-design-analysis',
    plannedQuestionCount: 2,
    purpose: 'Check design analysis using facial, profile, and head reference information.',
  },
  {
    id: 'mc-14-03',
    afterSectionId: 'tension-control',
    conceptFamilyId: 'ch14-cutting-geometry-guides',
    plannedQuestionCount: 2,
    purpose: 'Check elevation, guides, grain, tension, and geometric control decisions.',
  },
  {
    id: 'mc-14-04',
    afterSectionId: 'thinning-texturizing',
    conceptFamilyId: 'ch14-shear-clipper-razor-texturizing',
    plannedQuestionCount: 2,
    purpose: 'Check selection and application of cutting tools and techniques.',
  },
  {
    id: 'mc-14-05',
    afterSectionId: 'finish-work',
    conceptFamilyId: 'ch14-haircut-styles-procedures',
    plannedQuestionCount: 2,
    purpose: 'Check haircut procedure, style recognition, and finishing decisions.',
  },
  {
    id: 'mc-14-06',
    afterSectionId: 'cornrow-procedure',
    conceptFamilyId: 'ch14-styling-volume-locks',
    plannedQuestionCount: 2,
    purpose: 'Check styling, blowdrying, volume, cornrow, and lock concepts.',
  },
  {
    id: 'mc-14-07',
    afterSectionId: 'sharps-warning',
    conceptFamilyId: 'ch14-service-safety-sanitation',
    plannedQuestionCount: 2,
    purpose: 'Check tool, thermal, sharp-implement, sanitation, and cleanup safety decisions.',
  },
]

export const chapter14ContentConceptMappings: readonly Chapter14ContentConceptMapping[] = [
  ...['design-studio-hero','why-study-haircutting','haircutting-quote','consultation-scenario-1','consultation-fundamentals','consultation-questions','trim-warning','haircutting-level-up','board-exam-checkpoint','key-takeaways','chapter-summary']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch14-consultation-professional-design' as const })),
  ...['facial-shape-challenge','facial-shapes-intro','facial-shapes-tabbed','facial-profiles','profile-types','design-principles','neck-ear-sideburns','reference-point-explorer','head-sections']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch14-facial-head-design-analysis' as const })),
  ...['haircutting-fundamentals','design-elements','line-types','elevation-degrees','elevation-guide','guide-types','cross-checking','grain-cutting','tension-control']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch14-cutting-geometry-guides' as const })),
  ...['basic-techniques','shear-point-tapering','freehand-shear','razor-techniques','razor-taper-methods','thinning-texturizing','guards-vs-blades']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch14-shear-clipper-razor-texturizing' as const })),
  ...['preparation-steps','classic-styles','classic-cuts','haircutting-procedures','haircut-procedures','grain-reminder','finish-work']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch14-haircut-styles-procedures' as const })),
  ...['natural-styling','locks','volume-scenario','building-volume','blowdry-challenge','blowdrying-intro','blowdrying-methods','cornrow-challenge','cornrow-intro','cornrow-prep','cornrow-procedure']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch14-styling-volume-locks' as const })),
  ...['blowdry-safety','tool-maintenance','head-shave-scenario','head-shave-intro','head-shave-prep','head-shave-procedure','cleanup-scenario','cleanup-intro','cleanup-checklist','sharps-warning']
    .map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch14-service-safety-sanitation' as const })),
]

const fc = (n: number): `fc-ch14-${string}` => `fc-ch14-${String(n).padStart(3, '0')}`
const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i)

const safetyFlashcards = new Set([73, 85, 103, 110, 111])
const professionalFlashcards = new Set([76])

export const chapter14FlashcardConceptMappings: readonly Chapter14FlashcardConceptMapping[] = [
  ...range(1, 6).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch14-consultation-professional-design' as const })),
  ...range(7, 35).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch14-facial-head-design-analysis' as const })),
  ...range(36, 59).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch14-cutting-geometry-guides' as const })),
  ...range(60, 92)
    .filter((n) => !safetyFlashcards.has(n) && !professionalFlashcards.has(n))
    .map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch14-shear-clipper-razor-texturizing' as const })),
  ...range(93, 102).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch14-haircut-styles-procedures' as const })),
  ...range(104, 109).map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch14-styling-volume-locks' as const })),
  ...[73,85,103,110,111].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch14-service-safety-sanitation' as const })),
  ...[76].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch14-consultation-professional-design' as const })),
  { flashcardId: fc(112), conceptFamilyId: 'ch14-shear-clipper-razor-texturizing' },
]

const q = (n: number): `qq-14-${string}` => `qq-14-${String(n).padStart(3, '0')}`

export const chapter14QuizQuestionConceptMappings: readonly Chapter14QuizQuestionConceptMapping[] = [
  ...range(1, 5).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch14-consultation-professional-design' as const })),
  ...range(6, 22).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch14-facial-head-design-analysis' as const })),
  ...range(23, 35).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch14-cutting-geometry-guides' as const })),
  ...range(36, 56).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch14-shear-clipper-razor-texturizing' as const })),
  ...range(57, 63).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch14-haircut-styles-procedures' as const })),
  ...range(64, 69).map((n) => ({ questionId: q(n), conceptFamilyId: 'ch14-styling-volume-locks' as const })),
  { questionId: q(70), conceptFamilyId: 'ch14-service-safety-sanitation' },
]

export function getChapter14ContentBlocksForConcept(conceptFamilyId: Chapter14ConceptFamilyId) {
  return chapter14ContentConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.contentBlockId)
}

export function getChapter14FlashcardsForConcept(conceptFamilyId: Chapter14ConceptFamilyId) {
  return chapter14FlashcardConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.flashcardId)
}

export function getChapter14QuizQuestionsForConcept(conceptFamilyId: Chapter14ConceptFamilyId) {
  return chapter14QuizQuestionConceptMappings
    .filter((mapping) => mapping.conceptFamilyId === conceptFamilyId)
    .map((mapping) => mapping.questionId)
}
