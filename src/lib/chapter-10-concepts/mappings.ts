import type { Chapter10ConceptFamilyId } from './types'

export interface Chapter10ContentConceptMapping {
  contentBlockId: string
  conceptFamilyId: Chapter10ConceptFamilyId
}

export interface Chapter10FlashcardConceptMapping {
  flashcardId: `fc-10-${string}`
  conceptFamilyId: Chapter10ConceptFamilyId
}

export interface Chapter10QuizQuestionConceptMapping {
  questionId: `qq-10-${string}`
  conceptFamilyId: Chapter10ConceptFamilyId
}

export interface Chapter10MicroCheckPlacement {
  id: `mc-10-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter10ConceptFamilyId
  plannedQuestionCount: number
  purpose: string
}

export const chapter10ContentConceptMappings: readonly Chapter10ContentConceptMapping[] = [
  ...['hair-lab-welcome','why-trichology-matters','trichology-certification','decision-framework','scalp-analysis-rules','memory-aids','confusions','mnemonics','safety','board-exam-alerts','diagnostic-scenarios','action-prompts','hair-lab-pledge'].map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch10-service-safety-referral' as const })),
  ...['hair-structure-intro','root-structures','follicle','bulb','papilla','arrector','sebaceous','shaft-layers','cuticle','cortex','medulla'].map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch10-hair-anatomy-structure' as const })),
  ...['peptide-bonds','side-bonds','keratinization-cohns'].map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch10-hair-chemistry-bonds' as const })),
  ...['pigment-wave','melanin','wave','growth-patterns'].map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch10-pigment-wave-growth-patterns' as const })),
  { contentBlockId: 'growth-cycle', conceptFamilyId: 'ch10-growth-cycle-hair-types' },
  ...['hair-analysis-protocol','analysis-factors','texture','density','porosity','elasticity'].map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch10-analysis-properties' as const })),
  ...['alopecia-intro','alopecia-types','androgenic','areata','other'].map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch10-alopecia-hair-loss' as const })),
  ...['hair-disorders','service-boundary-observation','non-contagious-disorders'].map((contentBlockId) => ({ contentBlockId, conceptFamilyId: 'ch10-hair-shaft-disorders' as const })),
  { contentBlockId: 'contagious-disorders', conceptFamilyId: 'ch10-infectious-parasitic-scalp' },
]

const fc = (n: number): `fc-10-${string}` => `fc-10-${String(n).padStart(3, '0')}`

export const chapter10FlashcardConceptMappings: readonly Chapter10FlashcardConceptMapping[] = [
  ...[39,40,41,42,48,58,59,60,69,70,71,72,111,112,118].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch10-hair-anatomy-structure' as const })),
  ...[46,49,50,51,52,61,73,74,75,76,77,78,106,110,113,117].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch10-hair-chemistry-bonds' as const })),
  ...[43,44,45,64,65,66,67,68,83,84,85,86,114,115].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch10-pigment-wave-growth-patterns' as const })),
  ...[87,88,89,90,92,93].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch10-growth-cycle-hair-types' as const })),
  ...[6,7,8,9,12,15,18,19,20,21,22,23,24,25,31,32,103,104,105,108,109].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch10-analysis-properties' as const })),
  ...[1,2,3,13,16,17,79,80,81,91,94,95,96,97,98,99,100].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch10-alopecia-hair-loss' as const })),
  ...[26,27,28,29,30,33,36,82].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch10-hair-shaft-disorders' as const })),
  ...[4,5,10,14,34,35,37,47,53,54,55,62,107,116].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch10-infectious-parasitic-scalp' as const })),
  ...[11,38,56,57,63,101,102].map((n) => ({ flashcardId: fc(n), conceptFamilyId: 'ch10-service-safety-referral' as const })),
]

const q = (n: number): `qq-10-${string}` => `qq-10-${String(n).padStart(3, '0')}`

export const chapter10QuizQuestionConceptMappings: readonly Chapter10QuizQuestionConceptMapping[] = [
  ...[21,22,23,29,30,65,69,71,72].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch10-hair-anatomy-structure' as const })),
  ...[24,25,26,27,28].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch10-hair-chemistry-bonds' as const })),
  ...[56,57,58,59,60,61,62,64,74].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch10-pigment-wave-growth-patterns' as const })),
  ...[49,50,51,52,53,54,55].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch10-growth-cycle-hair-types' as const })),
  ...[11,12,13,14,15,16,17,18,19,20,68].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch10-analysis-properties' as const })),
  ...[1,2,3,6,7,8,9,10].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch10-alopecia-hair-loss' as const })),
  ...[37,38,41,42,43,44,45,46,47,48,63,73].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch10-hair-shaft-disorders' as const })),
  ...[4,5,31,32,33,36,39,70,75].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch10-infectious-parasitic-scalp' as const })),
  ...[34,35,40,66,67].map((n) => ({ questionId: q(n), conceptFamilyId: 'ch10-service-safety-referral' as const })),
]

export const chapter10MicroCheckPlacements: readonly Chapter10MicroCheckPlacement[] = [
  { id: 'mc-10-01', afterSectionId: 'medulla', conceptFamilyId: 'ch10-hair-anatomy-structure', plannedQuestionCount: 2, purpose: 'Check root/shaft structure discrimination before chemistry and service behavior.' },
  { id: 'mc-10-02', afterSectionId: 'keratinization-cohns', conceptFamilyId: 'ch10-hair-chemistry-bonds', plannedQuestionCount: 2, purpose: 'Check peptide/side-bond reasoning and service-relevant bond behavior.' },
  { id: 'mc-10-03', afterSectionId: 'growth-patterns', conceptFamilyId: 'ch10-pigment-wave-growth-patterns', plannedQuestionCount: 2, purpose: 'Check pigment, cross-section, and directional-growth pattern reasoning.' },
  { id: 'mc-10-04', afterSectionId: 'growth-cycle', conceptFamilyId: 'ch10-growth-cycle-hair-types', plannedQuestionCount: 2, purpose: 'Check growth-cycle sequence, duration, and normal shedding distinctions.' },
  { id: 'mc-10-05', afterSectionId: 'elasticity', conceptFamilyId: 'ch10-analysis-properties', plannedQuestionCount: 2, purpose: 'Check texture, density, porosity, elasticity, and pre-service analysis application.' },
  { id: 'mc-10-06', afterSectionId: 'other', conceptFamilyId: 'ch10-alopecia-hair-loss', plannedQuestionCount: 2, purpose: 'Check source-supported alopecia terminology without diagnosis or treatment overreach.' },
  { id: 'mc-10-07', afterSectionId: 'non-contagious-disorders', conceptFamilyId: 'ch10-hair-shaft-disorders', plannedQuestionCount: 2, purpose: 'Check hair-shaft disorder recognition from observable features.' },
  { id: 'mc-10-08', afterSectionId: 'contagious-disorders', conceptFamilyId: 'ch10-infectious-parasitic-scalp', plannedQuestionCount: 2, purpose: 'Check contagious/parasitic recognition and sanitation-aware service decisions.' },
  { id: 'mc-10-09', afterSectionId: 'scalp-analysis-rules', conceptFamilyId: 'ch10-service-safety-referral', plannedQuestionCount: 3, purpose: 'Check observation, service pause, sanitation, referral, and no-diagnosis boundaries.' },
]

export function getChapter10ContentBlocksForConcept(conceptFamilyId: Chapter10ConceptFamilyId) {
  return chapter10ContentConceptMappings.filter((m) => m.conceptFamilyId === conceptFamilyId).map((m) => m.contentBlockId)
}
export function getChapter10FlashcardsForConcept(conceptFamilyId: Chapter10ConceptFamilyId) {
  return chapter10FlashcardConceptMappings.filter((m) => m.conceptFamilyId === conceptFamilyId).map((m) => m.flashcardId)
}
export function getChapter10QuizQuestionsForConcept(conceptFamilyId: Chapter10ConceptFamilyId) {
  return chapter10QuizQuestionConceptMappings.filter((m) => m.conceptFamilyId === conceptFamilyId).map((m) => m.questionId)
}
