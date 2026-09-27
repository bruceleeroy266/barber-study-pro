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
import type { ConceptId } from './types'

export type Chapter2EvidenceSource = SharedEvidenceSource
export type Chapter2Difficulty = SharedDifficulty
export type Chapter2AttemptPhase = SharedAttemptPhase
export type Chapter2Confidence = SharedConfidence

export interface Chapter2EvidenceRecord {
  studentId: string
  chapterId: 'ch-2'
  conceptId: ConceptId
  source: Chapter2EvidenceSource
  itemId: string
  difficulty: Chapter2Difficulty
  correct: boolean
  attemptPhase: Chapter2AttemptPhase
  timestamp: string
}

export type Chapter2GradeInput = SharedGradeInput
export type Chapter2GradeResult = SharedGradeResult
export type Chapter2ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER2_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter2Grade(input: Chapter2GradeInput): Chapter2GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter2ConceptMastery(
  records: readonly Chapter2EvidenceRecord[],
  referenceTime: string,
): Chapter2ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
