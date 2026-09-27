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
import type { Chapter8ConceptFamilyId } from './types'

export type Chapter8EvidenceSource = SharedEvidenceSource
export type Chapter8Difficulty = SharedDifficulty
export type Chapter8AttemptPhase = SharedAttemptPhase
export type Chapter8Confidence = SharedConfidence

export interface Chapter8EvidenceRecord {
  studentId: string
  chapterId: 'ch-8'
  conceptFamilyId: Chapter8ConceptFamilyId
  source: Chapter8EvidenceSource
  itemId: string
  difficulty: Chapter8Difficulty
  correct: boolean
  attemptPhase: Chapter8AttemptPhase
  timestamp: string
}

export type Chapter8GradeInput = SharedGradeInput
export type Chapter8GradeResult = SharedGradeResult
export type Chapter8ConceptMasteryResult = SharedConceptMasteryResult
export const CHAPTER8_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export const calculateChapter8Grade = (input: Chapter8GradeInput): Chapter8GradeResult =>
  calculateSharedGrade(input)

export const calculateChapter8ConceptMastery = (
  records: readonly Chapter8EvidenceRecord[],
  referenceTime: string,
): Chapter8ConceptMasteryResult => calculateSharedConceptMastery(records, referenceTime)
