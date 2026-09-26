import {
  CHAPTER8_CRITICAL_SAFETY_CONCEPT_IDS,
} from './safety-mastery'
import type { Chapter8ConceptFamilyId } from './types'

export type Chapter8FormalReassessmentPassPercent = 80 | 100

export interface Chapter8FormalReassessmentOutcome {
  conceptFamilyId: Chapter8ConceptFamilyId
  correctCount: number
  questionCount: 5
  percent: number
  passPercent: Chapter8FormalReassessmentPassPercent
  passed: boolean
  detectionState: 'currently_performing_well' | 'repeated_weakness'
  confidence: 'medium'
}

export function getChapter8FormalReassessmentPassPercent(
  conceptFamilyId: Chapter8ConceptFamilyId,
): Chapter8FormalReassessmentPassPercent {
  return (CHAPTER8_CRITICAL_SAFETY_CONCEPT_IDS as readonly string[]).includes(conceptFamilyId)
    ? 100
    : 80
}

export function evaluateChapter8FormalReassessment(args: {
  conceptFamilyId: Chapter8ConceptFamilyId
  correctCount: number
  questionCount: number
}): Chapter8FormalReassessmentOutcome {
  if (args.questionCount !== 5) {
    throw new Error('Chapter 8 formal reassessment requires exactly five completed questions.')
  }
  if (!Number.isInteger(args.correctCount) || args.correctCount < 0 || args.correctCount > 5) {
    throw new Error('Chapter 8 reassessment correctCount must be an integer from 0 through 5.')
  }

  const passPercent = getChapter8FormalReassessmentPassPercent(args.conceptFamilyId)
  const percent = Math.round((args.correctCount / 5) * 10000) / 100
  const passed = percent >= passPercent

  return {
    conceptFamilyId: args.conceptFamilyId,
    correctCount: args.correctCount,
    questionCount: 5,
    percent,
    passPercent,
    passed,
    detectionState: passed ? 'currently_performing_well' : 'repeated_weakness',
    confidence: 'medium',
  }
}
