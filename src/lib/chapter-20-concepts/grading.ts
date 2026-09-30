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
import type { Chapter20ConceptFamilyId } from './types'

export type Chapter20EvidenceSource = SharedEvidenceSource
export type Chapter20Difficulty = SharedDifficulty
export type Chapter20AttemptPhase = SharedAttemptPhase
export type Chapter20Confidence = SharedConfidence

export interface Chapter20EvidenceRecord {
  studentId: string
  chapterId: 'ch-20'
  conceptFamilyId: Chapter20ConceptFamilyId
  source: Chapter20EvidenceSource
  itemId: string
  difficulty: Chapter20Difficulty
  correct: boolean
  attemptPhase: Chapter20AttemptPhase
  timestamp: string
}

export type Chapter20GradeInput = SharedGradeInput
export type Chapter20GradeResult = SharedGradeResult
export type Chapter20ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER20_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter20Grade(input: Chapter20GradeInput): Chapter20GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter20ConceptMastery(
  records: readonly Chapter20EvidenceRecord[],
  referenceTime: string,
): Chapter20ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
