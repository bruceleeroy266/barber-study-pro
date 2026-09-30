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
import type { Chapter16ConceptFamilyId } from './types'

export type Chapter16EvidenceSource = SharedEvidenceSource
export type Chapter16Difficulty = SharedDifficulty
export type Chapter16AttemptPhase = SharedAttemptPhase
export type Chapter16Confidence = SharedConfidence

export interface Chapter16EvidenceRecord {
  studentId: string
  chapterId: 'ch-16'
  conceptFamilyId: Chapter16ConceptFamilyId
  source: Chapter16EvidenceSource
  itemId: string
  difficulty: Chapter16Difficulty
  correct: boolean
  attemptPhase: Chapter16AttemptPhase
  timestamp: string
}

export type Chapter16GradeInput = SharedGradeInput
export type Chapter16GradeResult = SharedGradeResult
export type Chapter16ConceptMasteryResult = SharedConceptMasteryResult

export const CHAPTER16_GRADE_WEIGHTS = SHARED_GRADE_WEIGHTS

export function calculateChapter16Grade(input: Chapter16GradeInput): Chapter16GradeResult {
  return calculateSharedGrade(input)
}

export function calculateChapter16ConceptMastery(
  records: readonly Chapter16EvidenceRecord[],
  referenceTime: string,
): Chapter16ConceptMasteryResult {
  return calculateSharedConceptMastery(records, referenceTime)
}
