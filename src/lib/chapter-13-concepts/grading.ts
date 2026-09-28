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
import type { Chapter13ConceptFamilyId } from './types'

export type Chapter13EvidenceSource = SharedEvidenceSource
export type Chapter13Difficulty = SharedDifficulty
export type Chapter13AttemptPhase = SharedAttemptPhase
export type Chapter13Confidence = SharedConfidence

export interface Chapter13EvidenceRecord {
  studentId: string
  chapterId: 'ch-13'
  conceptFamilyId: Chapter13ConceptFamilyId
  source: Chapter13EvidenceSource
  itemId: string
  difficulty: Chapter13Difficulty
  correct: boolean
  attemptPhase: Chapter13AttemptPhase
  timestamp: string
}

export type Chapter13GradeInput = SharedGradeInput
export type Chapter13GradeResult = SharedGradeResult
export type Chapter13ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER13_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter13Grade(input: Chapter13GradeInput): Chapter13GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter13ConceptMastery(
  records: readonly Chapter13EvidenceRecord[],
  referenceTime: string,
): Chapter13ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
