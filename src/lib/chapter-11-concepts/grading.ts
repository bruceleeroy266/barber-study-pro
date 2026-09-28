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
import type { Chapter11ConceptFamilyId } from './types'

export type Chapter11EvidenceSource = SharedEvidenceSource
export type Chapter11Difficulty = SharedDifficulty
export type Chapter11AttemptPhase = SharedAttemptPhase
export type Chapter11Confidence = SharedConfidence

export interface Chapter11EvidenceRecord {
  studentId: string
  chapterId: 'ch-11'
  conceptFamilyId: Chapter11ConceptFamilyId
  source: Chapter11EvidenceSource
  itemId: string
  difficulty: Chapter11Difficulty
  correct: boolean
  attemptPhase: Chapter11AttemptPhase
  timestamp: string
}

export type Chapter11GradeInput = SharedGradeInput
export type Chapter11GradeResult = SharedGradeResult
export type Chapter11ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER11_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter11Grade(input: Chapter11GradeInput): Chapter11GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter11ConceptMastery(
  records: readonly Chapter11EvidenceRecord[],
  referenceTime: string,
): Chapter11ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
