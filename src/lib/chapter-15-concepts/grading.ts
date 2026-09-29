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
import type { Chapter15ConceptFamilyId } from './types'

export type Chapter15EvidenceSource = SharedEvidenceSource
export type Chapter15Difficulty = SharedDifficulty
export type Chapter15AttemptPhase = SharedAttemptPhase
export type Chapter15Confidence = SharedConfidence

export interface Chapter15EvidenceRecord {
  studentId: string
  chapterId: 'ch-15'
  conceptFamilyId: Chapter15ConceptFamilyId
  source: Chapter15EvidenceSource
  itemId: string
  difficulty: Chapter15Difficulty
  correct: boolean
  attemptPhase: Chapter15AttemptPhase
  timestamp: string
}

export type Chapter15GradeInput = SharedGradeInput
export type Chapter15GradeResult = SharedGradeResult
export type Chapter15ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER15_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter15Grade(input: Chapter15GradeInput): Chapter15GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter15ConceptMastery(
  records: readonly Chapter15EvidenceRecord[],
  referenceTime: string,
): Chapter15ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
