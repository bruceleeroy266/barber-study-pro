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
import type { Chapter9ConceptFamilyId } from './types'

export type Chapter9EvidenceSource = SharedEvidenceSource
export type Chapter9Difficulty = SharedDifficulty
export type Chapter9AttemptPhase = SharedAttemptPhase
export type Chapter9Confidence = SharedConfidence

export interface Chapter9EvidenceRecord {
  studentId: string
  chapterId: 'ch-9'
  conceptFamilyId: Chapter9ConceptFamilyId
  source: Chapter9EvidenceSource
  itemId: string
  difficulty: Chapter9Difficulty
  correct: boolean
  attemptPhase: Chapter9AttemptPhase
  timestamp: string
}

export type Chapter9GradeInput = SharedGradeInput
export type Chapter9GradeResult = SharedGradeResult
export type Chapter9ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER9_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter9Grade(input: Chapter9GradeInput): Chapter9GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter9ConceptMastery(
  records: readonly Chapter9EvidenceRecord[],
  referenceTime: string,
): Chapter9ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
