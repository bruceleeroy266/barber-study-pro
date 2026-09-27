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
import type { Chapter10ConceptFamilyId } from './types'

export type Chapter10EvidenceSource = SharedEvidenceSource
export type Chapter10Difficulty = SharedDifficulty
export type Chapter10AttemptPhase = SharedAttemptPhase
export type Chapter10Confidence = SharedConfidence

export interface Chapter10EvidenceRecord {
  studentId: string
  chapterId: 'ch-10'
  conceptFamilyId: Chapter10ConceptFamilyId
  source: Chapter10EvidenceSource
  itemId: string
  difficulty: Chapter10Difficulty
  correct: boolean
  attemptPhase: Chapter10AttemptPhase
  timestamp: string
}

export type Chapter10GradeInput = SharedGradeInput
export type Chapter10GradeResult = SharedGradeResult
export type Chapter10ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER10_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter10Grade(input: Chapter10GradeInput): Chapter10GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter10ConceptMastery(
  records: readonly Chapter10EvidenceRecord[],
  referenceTime: string,
): Chapter10ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
