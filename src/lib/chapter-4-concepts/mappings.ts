import type { Chapter4ConceptFamilyId, Chapter4ContentConceptMapping, Chapter4FlashcardConceptMapping, Chapter4QuizQuestionConceptMapping } from './types'

const flashcardRanges: readonly [start: number, end: number, conceptFamilyId: Chapter4ConceptFamilyId][] = [
  [1,9,'ch4-pathogens-transmission'], [10,19,'ch4-disinfection-sterilization'], [20,27,'ch4-cross-contamination'],
  [28,36,'ch4-blood-exposure-ppe'], [37,43,'ch4-regulatory-chemical-safety'], [44,50,'ch4-safe-practice-compliance'],
] as const
export const chapter4FlashcardConceptMappings: readonly Chapter4FlashcardConceptMapping[] = [
  ...flashcardRanges.flatMap(([start,end,conceptFamilyId]) => Array.from({length:end-start+1},(_,offset)=>({flashcardId:`fc-4-${String(start+offset).padStart(3,'0')}` as const,conceptFamilyId}))),
  ...[51,52].map((n)=>({flashcardId:`fc-4-${String(n).padStart(3,'0')}` as const,conceptFamilyId:'ch4-regulatory-chemical-safety' as const})),
  ...Array.from({length:8},(_,i)=>53+i).map((n)=>({flashcardId:`fc-4-${String(n).padStart(3,'0')}` as const,conceptFamilyId:'ch4-pathogens-transmission' as const})),
  ...[61,62,63].map((n)=>({flashcardId:`fc-4-${String(n).padStart(3,'0')}` as const,conceptFamilyId:'ch4-disinfection-sterilization' as const})),
  ...Array.from({length:7},(_,i)=>64+i).map((n)=>({flashcardId:`fc-4-${String(n).padStart(3,'0')}` as const,conceptFamilyId:'ch4-safe-practice-compliance' as const})),
].sort((a,b)=>a.flashcardId.localeCompare(b.flashcardId))

// Locked initial-assessment distribution: 5 / 6 / 5 / 5 / 4 / 5 = 30.
const quizRanges: readonly [start: number, end: number, conceptFamilyId: Chapter4ConceptFamilyId][] = [
  [1,5,'ch4-pathogens-transmission'], [6,11,'ch4-disinfection-sterilization'], [12,16,'ch4-cross-contamination'],
  [17,21,'ch4-blood-exposure-ppe'], [22,25,'ch4-regulatory-chemical-safety'], [26,30,'ch4-safe-practice-compliance'],
] as const
export const chapter4QuizQuestionConceptMappings: readonly Chapter4QuizQuestionConceptMapping[] = quizRanges.flatMap(([start,end,conceptFamilyId]) => Array.from({length:end-start+1},(_,offset)=>({questionId:`qq-4-${String(start+offset).padStart(3,'0')}` as const,conceptFamilyId})))

// Locked reassessment-reserve distribution (C4-3): 15 per family = 90.
// Reserve IDs continue the sequence at qq-4-031; the pool can never
// legitimately exhaust (5-question check × 3 DB-capped cycles per family).
const reassessmentRanges: readonly [start: number, end: number, conceptFamilyId: Chapter4ConceptFamilyId][] = [
  [31,45,'ch4-pathogens-transmission'], [46,60,'ch4-disinfection-sterilization'], [61,75,'ch4-cross-contamination'],
  [76,90,'ch4-blood-exposure-ppe'], [91,105,'ch4-regulatory-chemical-safety'], [106,120,'ch4-safe-practice-compliance'],
] as const
export const chapter4ReassessmentQuestionConceptMappings: readonly Chapter4QuizQuestionConceptMapping[] = reassessmentRanges.flatMap(([start,end,conceptFamilyId]) => Array.from({length:end-start+1},(_,offset)=>({questionId:`qq-4-${String(start+offset).padStart(3,'0')}` as const,conceptFamilyId})))

export function getChapter4ConceptForFlashcard(flashcardId:string):Chapter4ConceptFamilyId|null { return chapter4FlashcardConceptMappings.find(m=>m.flashcardId===flashcardId)?.conceptFamilyId ?? null }
export function getChapter4ConceptForQuizQuestion(questionId:string):Chapter4ConceptFamilyId|null { return chapter4QuizQuestionConceptMappings.find(m=>m.questionId===questionId)?.conceptFamilyId ?? null }

// ───────────────────────────────────────────────
// Content Section → Concept (C4-2)
// ───────────────────────────────────────────────

/**
 * Maps the REAL content section ids served by chapter-4-premium.ts to the six
 * canonical concept families. These drive PRIMARY content_block remediation
 * assignments; flashcards remain supplementary. Every id below must resolve
 * to a section in chapter4PremiumContent.sections — enforced by the integrity
 * tests. No section ids are invented.
 */
export const chapter4ContentConceptMappings: readonly Chapter4ContentConceptMapping[] = [
  // Pathogens, Infection & Transmission
  { contentBlockId: 'infection-principles-source-detail', conceptFamilyId: 'ch4-pathogens-transmission' },
  { contentBlockId: 'pathogen-threat-matrix', conceptFamilyId: 'ch4-pathogens-transmission' },
  { contentBlockId: 'disease-recognition', conceptFamilyId: 'ch4-pathogens-transmission' },
  { contentBlockId: 'transmission-sim', conceptFamilyId: 'ch4-pathogens-transmission' },

  // Cleaning, Disinfection & Sterilization
  { contentBlockId: 'processing-source-detail', conceptFamilyId: 'ch4-disinfection-sterilization' },
  { contentBlockId: 'disinfectant-antiseptic-source-detail', conceptFamilyId: 'ch4-disinfection-sterilization' },
  { contentBlockId: 'disinfection-protocol', conceptFamilyId: 'ch4-disinfection-sterilization' },
  { contentBlockId: 'protocol-warning', conceptFamilyId: 'ch4-disinfection-sterilization' },

  // Contamination & Cross-Contamination (3)
  { contentBlockId: 'contamination-sim-1', conceptFamilyId: 'ch4-cross-contamination' },
  { contentBlockId: 'spot-violation-1', conceptFamilyId: 'ch4-cross-contamination' },
  { contentBlockId: 'infection-timeline', conceptFamilyId: 'ch4-cross-contamination' },

  // Blood Exposure, PPE & Standard Precautions
  { contentBlockId: 'standard-precautions-source-detail', conceptFamilyId: 'ch4-blood-exposure-ppe' },
  { contentBlockId: 'blood-spill-response', conceptFamilyId: 'ch4-blood-exposure-ppe' },
  { contentBlockId: 'ppe-mastery', conceptFamilyId: 'ch4-blood-exposure-ppe' },

  // Regulatory & Chemical Safety
  { contentBlockId: 'regulatory-source-detail', conceptFamilyId: 'ch4-regulatory-chemical-safety' },
  { contentBlockId: 'osha-compliance', conceptFamilyId: 'ch4-regulatory-chemical-safety' },
  { contentBlockId: 'sds-mastery', conceptFamilyId: 'ch4-regulatory-chemical-safety' },

  // Safe Barbering Practice & Compliance
  { contentBlockId: 'safe-work-practices-source-detail', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'professional-responsibilities-source-detail', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'safety-command-center', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'real-stakes', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'board-exam-critical', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'sanitation-scorecard', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'safety-levels', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'safety-pledge', conceptFamilyId: 'ch4-safe-practice-compliance' },
] as const

export function getChapter4ConceptForContentBlock(contentBlockId:string):Chapter4ConceptFamilyId|null { return chapter4ContentConceptMappings.find(m=>m.contentBlockId===contentBlockId)?.conceptFamilyId ?? null }
