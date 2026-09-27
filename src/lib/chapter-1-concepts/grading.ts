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
import type { Chapter1ConceptFamilyId } from './types'

export type Chapter1EvidenceSource = SharedEvidenceSource
export type Chapter1Difficulty = SharedDifficulty
export type Chapter1AttemptPhase = SharedAttemptPhase
export type Chapter1Confidence = SharedConfidence

export interface Chapter1EvidenceRecord {
  studentId: string
  chapterId: 'ch-1'
  conceptFamilyId: Chapter1ConceptFamilyId
  source: Chapter1EvidenceSource
  itemId: string
  difficulty: Chapter1Difficulty
  correct: boolean
  attemptPhase: Chapter1AttemptPhase
  timestamp: string
}

export type Chapter1GradeInput = SharedGradeInput
export type Chapter1GradeResult = SharedGradeResult
export type Chapter1ConceptMasteryResult = SharedConceptMasteryResult
export const CHAPTER1_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export const calculateChapter1Grade = (input: Chapter1GradeInput): Chapter1GradeResult =>
  calculateSharedGrade(input)

export const calculateChapter1ConceptMastery = (
  records: readonly Chapter1EvidenceRecord[],
  referenceTime: string,
): Chapter1ConceptMasteryResult => calculateSharedConceptMastery(records, referenceTime)
