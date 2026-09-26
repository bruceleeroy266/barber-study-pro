import type { Chapter8EvidenceRecord } from './grading'
import { chapter8ReassessmentReserve } from './reassessment-reserve'
import type { Chapter8ConceptFamilyId } from './types'

export interface Chapter8PersistedReassessmentEventData {
  attemptId: string
  questionId: string
  conceptFamilyId: Chapter8ConceptFamilyId
  difficulty: Chapter8EvidenceRecord['difficulty']
  correct: boolean
  source: 'remediation_reassessment'
  attemptPhase: 'reassessment'
  answeredAt: string
}

export function buildChapter8PersistedReassessmentEvent(args: {
  attemptId: string
  questionId: string
  conceptFamilyId: Chapter8ConceptFamilyId
  correct: boolean
  answeredAt: string
}): Chapter8PersistedReassessmentEventData {
  const question = chapter8ReassessmentReserve.find((item) => item.id === args.questionId)
  if (!question) {
    throw new Error(`Unknown Chapter 8 reassessment reserve question: ${args.questionId}`)
  }
  if (question.conceptFamilyId !== args.conceptFamilyId) {
    throw new Error('Chapter 8 reassessment question is not mapped to the supplied concept family.')
  }

  return {
    attemptId: args.attemptId,
    questionId: question.id,
    conceptFamilyId: question.conceptFamilyId,
    difficulty: question.difficulty,
    correct: args.correct,
    source: 'remediation_reassessment',
    attemptPhase: 'reassessment',
    answeredAt: args.answeredAt,
  }
}

export function chapter8PersistedEventToEvidence(
  studentId: string,
  event: Chapter8PersistedReassessmentEventData,
): Chapter8EvidenceRecord {
  return {
    studentId,
    chapterId: 'ch-8',
    conceptFamilyId: event.conceptFamilyId,
    source: event.source,
    itemId: event.questionId,
    difficulty: event.difficulty,
    correct: event.correct,
    attemptPhase: event.attemptPhase,
    timestamp: event.answeredAt,
  }
}
