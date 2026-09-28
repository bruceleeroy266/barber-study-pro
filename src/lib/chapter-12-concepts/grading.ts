import {
  SHARED_GRADE_WEIGHTS,
  calculateSharedConceptMastery,
  calculateSharedGrade,
  type SharedAttemptPhase,
  type SharedConfidence,
  type SharedDifficulty,
  type SharedEvidenceSource,
  type SharedGradeInput,
  type SharedGradeResult,
  type SharedConceptMasteryResult,
} from '../concept-mastery/shared-grading'
import type { Chapter12ConceptFamilyId } from './types'

export type Chapter12EvidenceSource = SharedEvidenceSource
export type Chapter12Difficulty = SharedDifficulty
export type Chapter12AttemptPhase = SharedAttemptPhase
export type Chapter12Confidence = SharedConfidence

export interface Chapter12EvidenceRecord {
  studentId: string
  chapterId: 'ch-12'
  conceptFamilyId: Chapter12ConceptFamilyId
  source: Chapter12EvidenceSource
  itemId: string
  difficulty: Chapter12Difficulty
  correct: boolean
  attemptPhase: Chapter12AttemptPhase
  timestamp: string
}

export type Chapter12GradeInput = SharedGradeInput
export type Chapter12GradeResult = SharedGradeResult
export type Chapter12ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER12_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter12Grade(input: Chapter12GradeInput): Chapter12GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter12ConceptMastery(
  records: readonly Chapter12EvidenceRecord[],
  referenceTime: string,
): Chapter12ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
