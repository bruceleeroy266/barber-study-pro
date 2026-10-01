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
import type { Chapter21ConceptFamilyId } from './types'

export type Chapter21EvidenceSource = SharedEvidenceSource
export type Chapter21Difficulty = SharedDifficulty
export type Chapter21AttemptPhase = SharedAttemptPhase
export type Chapter21Confidence = SharedConfidence

export interface Chapter21EvidenceRecord {
  studentId: string
  chapterId: 'ch-21'
  conceptFamilyId: Chapter21ConceptFamilyId
  source: Chapter21EvidenceSource
  itemId: string
  difficulty: Chapter21Difficulty
  correct: boolean
  attemptPhase: Chapter21AttemptPhase
  timestamp: string
}

export type Chapter21GradeInput = SharedGradeInput
export type Chapter21GradeResult = SharedGradeResult
export type Chapter21ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER21_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter21Grade(input: Chapter21GradeInput): Chapter21GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter21ConceptMastery(
  records: readonly Chapter21EvidenceRecord[],
  referenceTime: string,
): Chapter21ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
