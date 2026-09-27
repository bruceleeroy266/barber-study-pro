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
import type { Chapter3ConceptFamilyId } from './types'

export type Chapter3EvidenceSource = SharedEvidenceSource
export type Chapter3Difficulty = SharedDifficulty
export type Chapter3AttemptPhase = SharedAttemptPhase
export type Chapter3Confidence = SharedConfidence

export interface Chapter3EvidenceRecord {
  studentId: string
  chapterId: 'ch-3'
  conceptFamilyId: Chapter3ConceptFamilyId
  source: Chapter3EvidenceSource
  itemId: string
  difficulty: Chapter3Difficulty
  correct: boolean
  attemptPhase: Chapter3AttemptPhase
  timestamp: string
}

export type Chapter3GradeInput = SharedGradeInput
export type Chapter3GradeResult = SharedGradeResult
export type Chapter3ConceptMasteryResult = SharedConceptMasteryResult
export const CHAPTER3_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export const calculateChapter3Grade = (input: Chapter3GradeInput): Chapter3GradeResult =>
  calculateSharedGrade(input)

export const calculateChapter3ConceptMastery = (
  records: readonly Chapter3EvidenceRecord[],
  referenceTime: string,
): Chapter3ConceptMasteryResult => calculateSharedConceptMastery(records, referenceTime)
