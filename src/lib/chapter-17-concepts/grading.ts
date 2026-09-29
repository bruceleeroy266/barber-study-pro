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
import type { Chapter17ConceptFamilyId } from './types'

export type Chapter17EvidenceSource = SharedEvidenceSource
export type Chapter17Difficulty = SharedDifficulty
export type Chapter17AttemptPhase = SharedAttemptPhase
export type Chapter17Confidence = SharedConfidence

export interface Chapter17EvidenceRecord {
  studentId: string
  chapterId: 'ch-17'
  conceptFamilyId: Chapter17ConceptFamilyId
  source: Chapter17EvidenceSource
  itemId: string
  difficulty: Chapter17Difficulty
  correct: boolean
  attemptPhase: Chapter17AttemptPhase
  timestamp: string
}

export type Chapter17GradeInput = SharedGradeInput
export type Chapter17GradeResult = SharedGradeResult
export type Chapter17ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER17_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter17Grade(input: Chapter17GradeInput): Chapter17GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter17ConceptMastery(
  records: readonly Chapter17EvidenceRecord[],
  referenceTime: string,
): Chapter17ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
