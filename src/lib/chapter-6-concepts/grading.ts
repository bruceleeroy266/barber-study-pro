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
import type { Chapter6ConceptFamilyId } from './types'

export type Chapter6EvidenceSource = SharedEvidenceSource
export type Chapter6Difficulty = SharedDifficulty
export type Chapter6AttemptPhase = SharedAttemptPhase
export type Chapter6Confidence = SharedConfidence

export interface Chapter6EvidenceRecord {
  studentId: string
  chapterId: 'ch-6'
  conceptFamilyId: Chapter6ConceptFamilyId
  source: Chapter6EvidenceSource
  itemId: string
  difficulty: Chapter6Difficulty
  correct: boolean
  attemptPhase: Chapter6AttemptPhase
  timestamp: string
}

export type Chapter6GradeInput = SharedGradeInput
export type Chapter6GradeResult = SharedGradeResult
export type Chapter6ConceptMasteryResult = SharedConceptMasteryResult
export const CHAPTER6_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export const calculateChapter6Grade = (input: Chapter6GradeInput): Chapter6GradeResult =>
  calculateSharedGrade(input)

export const calculateChapter6ConceptMastery = (
  records: readonly Chapter6EvidenceRecord[],
  referenceTime: string,
): Chapter6ConceptMasteryResult => calculateSharedConceptMastery(records, referenceTime)
