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

// Book-aligned initial-assessment distribution after the locked 14-question hardening.
// Rewritten items are mapped to the concept they now diagnose rather than their former numeric range.
const initialQuizFamilyIds: Readonly<Record<string, Chapter4ConceptFamilyId>> = {
  'qq-4-001':'ch4-pathogens-transmission',
  'qq-4-002':'ch4-pathogens-transmission',
  'qq-4-003':'ch4-pathogens-transmission',
  'qq-4-004':'ch4-pathogens-transmission',
  'qq-4-005':'ch4-pathogens-transmission',
  'qq-4-006':'ch4-disinfection-sterilization',
  'qq-4-007':'ch4-disinfection-sterilization',
  'qq-4-008':'ch4-disinfection-sterilization',
  'qq-4-009':'ch4-disinfection-sterilization',
  'qq-4-010':'ch4-disinfection-sterilization',
  'qq-4-011':'ch4-disinfection-sterilization',
  'qq-4-012':'ch4-pathogens-transmission',
  'qq-4-013':'ch4-pathogens-transmission',
  'qq-4-014':'ch4-cross-contamination',
  'qq-4-015':'ch4-pathogens-transmission',
  'qq-4-016':'ch4-cross-contamination',
  'qq-4-017':'ch4-blood-exposure-ppe',
  'qq-4-018':'ch4-blood-exposure-ppe',
  'qq-4-019':'ch4-blood-exposure-ppe',
  'qq-4-020':'ch4-safe-practice-compliance',
  'qq-4-021':'ch4-blood-exposure-ppe',
  'qq-4-022':'ch4-regulatory-chemical-safety',
  'qq-4-023':'ch4-regulatory-chemical-safety',
  'qq-4-024':'ch4-regulatory-chemical-safety',
  'qq-4-025':'ch4-regulatory-chemical-safety',
  'qq-4-026':'ch4-safe-practice-compliance',
  'qq-4-027':'ch4-safe-practice-compliance',
  'qq-4-028':'ch4-safe-practice-compliance',
  'qq-4-029':'ch4-safe-practice-compliance',
  'qq-4-030':'ch4-safe-practice-compliance',
} as const

export const chapter4QuizQuestionConceptMappings: readonly Chapter4QuizQuestionConceptMapping[] =
  Object.entries(initialQuizFamilyIds).map(([questionId, conceptFamilyId]) => ({
    questionId: questionId as Chapter4QuizQuestionConceptMapping['questionId'],
    conceptFamilyId,
  }))

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
