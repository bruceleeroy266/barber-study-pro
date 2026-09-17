import type { Chapter4ConceptFamilyId, Chapter4FlashcardConceptMapping, Chapter4QuizQuestionConceptMapping } from './types'

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
