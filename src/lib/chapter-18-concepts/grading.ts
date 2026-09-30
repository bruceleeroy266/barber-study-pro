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
import type { Chapter18ConceptFamilyId } from './types'

export type Chapter18EvidenceSource = SharedEvidenceSource
export type Chapter18Difficulty = SharedDifficulty
export type Chapter18AttemptPhase = SharedAttemptPhase
export type Chapter18Confidence = SharedConfidence

export interface Chapter18EvidenceRecord {
  studentId: string
  chapterId: 'ch-18'
  conceptFamilyId: Chapter18ConceptFamilyId
  source: Chapter18EvidenceSource
  itemId: string
  difficulty: Chapter18Difficulty
  correct: boolean
  attemptPhase: Chapter18AttemptPhase
  timestamp: string
}

export type Chapter18GradeInput = SharedGradeInput
export type Chapter18GradeResult = SharedGradeResult
export type Chapter18ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER18_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter18Grade(input: Chapter18GradeInput): Chapter18GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter18ConceptMastery(
  records: readonly Chapter18EvidenceRecord[],
  referenceTime: string,
): Chapter18ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
