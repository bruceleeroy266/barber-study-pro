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
import type { Chapter19ConceptFamilyId } from './types'

export type Chapter19EvidenceSource = SharedEvidenceSource
export type Chapter19Difficulty = SharedDifficulty
export type Chapter19AttemptPhase = SharedAttemptPhase
export type Chapter19Confidence = SharedConfidence

export interface Chapter19EvidenceRecord {
  studentId: string
  chapterId: 'ch-19'
  conceptFamilyId: Chapter19ConceptFamilyId
  source: Chapter19EvidenceSource
  itemId: string
  difficulty: Chapter19Difficulty
  correct: boolean
  attemptPhase: Chapter19AttemptPhase
  timestamp: string
}

export type Chapter19GradeInput = SharedGradeInput
export type Chapter19GradeResult = SharedGradeResult
export type Chapter19ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER19_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter19Grade(input: Chapter19GradeInput): Chapter19GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter19ConceptMastery(
  records: readonly Chapter19EvidenceRecord[],
  referenceTime: string,
): Chapter19ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
