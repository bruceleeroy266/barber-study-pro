import type { Chapter4ConceptFamilyId, Chapter4ContentConceptMapping, Chapter4FlashcardConceptMapping, Chapter4QuizQuestionConceptMapping } from './types'

const flashcardRanges: readonly [start: number, end: number, conceptFamilyId: Chapter4ConceptFamilyId][] = [
  [1,9,'ch4-pathogens-transmission'], [10,19,'ch4-disinfection-sterilization'], [20,27,'ch4-cross-contamination'],
  [28,36,'ch4-blood-exposure-ppe'], [37,43,'ch4-regulatory-chemical-safety'], [44,50,'ch4-safe-practice-compliance'],
] as const
export const chapter4FlashcardConceptMappings: readonly Chapter4FlashcardConceptMapping[] = flashcardRanges.flatMap(([start,end,conceptFamilyId]) => Array.from({length:end-start+1},(_,offset)=>({flashcardId:`fc-4-${String(start+offset).padStart(3,'0')}` as const,conceptFamilyId})))

// Locked initial-assessment distribution: 5 / 6 / 5 / 5 / 4 / 5 = 30.
const quizRanges: readonly [start: number, end: number, conceptFamilyId: Chapter4ConceptFamilyId][] = [
  [1,5,'ch4-pathogens-transmission'], [6,11,'ch4-disinfection-sterilization'], [12,16,'ch4-cross-contamination'],
  [17,21,'ch4-blood-exposure-ppe'], [22,25,'ch4-regulatory-chemical-safety'], [26,30,'ch4-safe-practice-compliance'],
] as const
export const chapter4QuizQuestionConceptMappings: readonly Chapter4QuizQuestionConceptMapping[] = quizRanges.flatMap(([start,end,conceptFamilyId]) => Array.from({length:end-start+1},(_,offset)=>({questionId:`qq-4-${String(start+offset).padStart(3,'0')}` as const,conceptFamilyId})))

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
  // Pathogens, Infection & Transmission (3)
  { contentBlockId: 'pathogen-threat-matrix', conceptFamilyId: 'ch4-pathogens-transmission' },
  { contentBlockId: 'disease-recognition', conceptFamilyId: 'ch4-pathogens-transmission' },
  { contentBlockId: 'transmission-sim', conceptFamilyId: 'ch4-pathogens-transmission' },

  // Cleaning, Disinfection & Sterilization (2)
  { contentBlockId: 'disinfection-protocol', conceptFamilyId: 'ch4-disinfection-sterilization' },
  { contentBlockId: 'protocol-warning', conceptFamilyId: 'ch4-disinfection-sterilization' },

  // Contamination & Cross-Contamination (3)
  { contentBlockId: 'contamination-sim-1', conceptFamilyId: 'ch4-cross-contamination' },
  { contentBlockId: 'spot-violation-1', conceptFamilyId: 'ch4-cross-contamination' },
  { contentBlockId: 'infection-timeline', conceptFamilyId: 'ch4-cross-contamination' },

  // Blood Exposure, PPE & Standard Precautions (2)
  { contentBlockId: 'blood-spill-response', conceptFamilyId: 'ch4-blood-exposure-ppe' },
  { contentBlockId: 'ppe-mastery', conceptFamilyId: 'ch4-blood-exposure-ppe' },

  // Regulatory & Chemical Safety (2)
  { contentBlockId: 'osha-compliance', conceptFamilyId: 'ch4-regulatory-chemical-safety' },
  { contentBlockId: 'sds-mastery', conceptFamilyId: 'ch4-regulatory-chemical-safety' },

  // Safe Barbering Practice & Compliance (6)
  { contentBlockId: 'safety-command-center', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'real-stakes', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'board-exam-critical', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'sanitation-scorecard', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'safety-levels', conceptFamilyId: 'ch4-safe-practice-compliance' },
  { contentBlockId: 'safety-pledge', conceptFamilyId: 'ch4-safe-practice-compliance' },
] as const

export function getChapter4ConceptForContentBlock(contentBlockId:string):Chapter4ConceptFamilyId|null { return chapter4ContentConceptMappings.find(m=>m.contentBlockId===contentBlockId)?.conceptFamilyId ?? null }
