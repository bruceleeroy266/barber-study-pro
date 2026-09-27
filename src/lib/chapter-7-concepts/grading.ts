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
import type { Chapter7ConceptFamilyId } from './types'

export type Chapter7EvidenceSource = SharedEvidenceSource
export type Chapter7Difficulty = SharedDifficulty
export type Chapter7AttemptPhase = SharedAttemptPhase
export type Chapter7Confidence = SharedConfidence

export interface Chapter7EvidenceRecord {
  studentId: string
  chapterId: 'ch-7'
  conceptFamilyId: Chapter7ConceptFamilyId
  source: Chapter7EvidenceSource
  itemId: string
  difficulty: Chapter7Difficulty
  correct: boolean
  attemptPhase: Chapter7AttemptPhase
  timestamp: string
}

export type Chapter7GradeInput = SharedGradeInput
export type Chapter7GradeResult = SharedGradeResult
export type Chapter7ConceptMasteryResult = SharedConceptMasteryResult
export const CHAPTER7_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export const calculateChapter7Grade = (input: Chapter7GradeInput): Chapter7GradeResult =>
  calculateSharedGrade(input)

export const calculateChapter7ConceptMastery = (
  records: readonly Chapter7EvidenceRecord[],
  referenceTime: string,
): Chapter7ConceptMasteryResult => calculateSharedConceptMastery(records, referenceTime)
