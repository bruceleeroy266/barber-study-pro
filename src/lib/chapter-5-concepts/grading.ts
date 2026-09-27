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
import type { Chapter5ConceptFamilyId } from './types'

export type Chapter5EvidenceSource = SharedEvidenceSource
export type Chapter5Difficulty = SharedDifficulty
export type Chapter5AttemptPhase = SharedAttemptPhase
export type Chapter5Confidence = SharedConfidence

export interface Chapter5EvidenceRecord {
  studentId: string
  chapterId: 'ch-5'
  conceptFamilyId: Chapter5ConceptFamilyId
  source: Chapter5EvidenceSource
  itemId: string
  difficulty: Chapter5Difficulty
  correct: boolean
  attemptPhase: Chapter5AttemptPhase
  timestamp: string
}

export type Chapter5GradeInput = SharedGradeInput
export type Chapter5GradeResult = SharedGradeResult
export type Chapter5ConceptMasteryResult = SharedConceptMasteryResult
export const CHAPTER4_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export const calculateChapter5Grade = (input: Chapter5GradeInput): Chapter5GradeResult =>
  calculateSharedGrade(input)

export const calculateChapter5ConceptMastery = (
  records: readonly Chapter5EvidenceRecord[],
  referenceTime: string,
): Chapter5ConceptMasteryResult => calculateSharedConceptMastery(records, referenceTime)
