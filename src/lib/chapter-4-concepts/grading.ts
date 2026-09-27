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
import type { Chapter4ConceptFamilyId } from './types'

export type Chapter4EvidenceSource = SharedEvidenceSource
export type Chapter4Difficulty = SharedDifficulty
export type Chapter4AttemptPhase = SharedAttemptPhase
export type Chapter4Confidence = SharedConfidence

export interface Chapter4EvidenceRecord {
  studentId: string
  chapterId: 'ch-4'
  conceptFamilyId: Chapter4ConceptFamilyId
  source: Chapter4EvidenceSource
  itemId: string
  difficulty: Chapter4Difficulty
  correct: boolean
  attemptPhase: Chapter4AttemptPhase
  timestamp: string
}

export type Chapter4GradeInput = SharedGradeInput
export type Chapter4GradeResult = SharedGradeResult
export type Chapter4ConceptMasteryResult = SharedConceptMasteryResult
export const CHAPTER4_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export const calculateChapter4Grade = (input: Chapter4GradeInput): Chapter4GradeResult =>
  calculateSharedGrade(input)

export const calculateChapter4ConceptMastery = (
  records: readonly Chapter4EvidenceRecord[],
  referenceTime: string,
): Chapter4ConceptMasteryResult => calculateSharedConceptMastery(records, referenceTime)
