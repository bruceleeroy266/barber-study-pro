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
import type { Chapter14ConceptFamilyId } from './types'

export type Chapter14EvidenceSource = SharedEvidenceSource
export type Chapter14Difficulty = SharedDifficulty
export type Chapter14AttemptPhase = SharedAttemptPhase
export type Chapter14Confidence = SharedConfidence

export interface Chapter14EvidenceRecord {
  studentId: string
  chapterId: 'ch-14'
  conceptFamilyId: Chapter14ConceptFamilyId
  source: Chapter14EvidenceSource
  itemId: string
  difficulty: Chapter14Difficulty
  correct: boolean
  attemptPhase: Chapter14AttemptPhase
  timestamp: string
}

export type Chapter14GradeInput = SharedGradeInput
export type Chapter14GradeResult = SharedGradeResult
export type Chapter14ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER14_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter14Grade(input: Chapter14GradeInput): Chapter14GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter14ConceptMastery(
  records: readonly Chapter14EvidenceRecord[],
  referenceTime: string,
): Chapter14ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
