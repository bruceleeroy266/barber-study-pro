/**
 * Phase 6C-3 — Student Remediation Service
 *
 * Application-layer service for the student-facing remediation experience.
 * Orchestrates existing Phase 6C-2 services without duplicating their logic.
 *
 * Binding Rules:
 *   - Server-side authorization: authenticated student must own the cycle
 *   - Cycle/concept/chapter relationships come from persisted state only
 *   - Targeted review completion required before reassessment
 *   - No clock-based cooldown
 *   - Reservation before presentation (selectAndReserveQuestion)
 *   - Never reinterpret the locked 6C-2d outcome matrix
 */

import type {
  ConceptId,
  ChapterId,
  QuizQuestionId,
  PoolExhaustionState,
} from '../reassessment/types'
import type {
  DetectionState,
  DetectionConfidence,
  ConceptEvidence,
} from '../chapter-2-concepts/detection'
import type { EvaluationOutcome } from '../evaluation/types'
import type { Flashcard, QuizQuestion } from '@/types'
import type { ChapterSection } from '../chapter-content'

export type RemediationCycleStatus =
  | 'targeted'
  | 'in_review'
  | 'review_completed'
  | 'reassessed'
  | 'evaluated'

export interface RemediationCycle {
  id: string
  userId: string
  conceptId: ConceptId
  chapterId: ChapterId
  cycleNumber: number
  detectionState: DetectionState
  detectionConfidence: DetectionConfidence
  detectionEvidence: ConceptEvidence
  status: RemediationCycleStatus
  targetedAt: Date
  reviewStartedAt: Date | null
  reviewCompletedAt: Date | null
  reassessmentStartedAt: Date | null
  reassessmentCompletedAt: Date | null
  evaluatedAt: Date | null
  outcome: EvaluationOutcome | null
  postRemediationState: string | null
  createdAt: Date
  updatedAt: Date
}

export interface RemediationAssignment {
  id: string
  cycleId: string
  assignmentType: 'content_block' | 'flashcard'
  assetId: string
  priority: number
  isPrimary: boolean
  status: 'assigned' | 'started' | 'completed'
  startedAt: Date | null
  completedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface RemediationCycleEvent {
  id: string
  cycleId: string
  eventType: string
  eventData: Record<string, unknown>
  createdAt: Date
}

export type StudentRemediationState =
  | 'targeted_review'
  | 'review_in_progress'
  | 'review_completed'
  | 'reassessment_in_progress'
  | 'pending_evaluation'
  | 'pending_more_evidence'
  | 'successful'
  | 'unsuccessful'
  | 'pool_exhausted'
  | 'already_completed'

export const STUDENT_STATE_LABELS: Record<StudentRemediationState, string> = {
  targeted_review: 'Getting Started',
  review_in_progress: 'Reviewing Materials',
  review_completed: 'Ready for Knowledge Check',
  reassessment_in_progress: 'Knowledge Check in Progress',
  pending_evaluation: 'Checking Your Answer',
  pending_more_evidence: 'Keep Practicing',
  successful: 'Great Progress!',
  unsuccessful: 'Additional Support Available',
  pool_exhausted: 'Additional Practice Recommended',
  already_completed: 'Completed',
} as const

export const STUDENT_STATE_DESCRIPTIONS: Record<StudentRemediationState, string> = {
  targeted_review: 'Your instructor has identified an area to focus on. Review the materials below to get started.',
  review_in_progress: 'You are making progress through your review materials. Keep going!',
  review_completed: 'You have completed your review. A knowledge check is now available.',
  reassessment_in_progress: 'Answer the question below to demonstrate your understanding.',
  pending_evaluation: 'Your answer is being reviewed...',
  pending_more_evidence: 'You are building your foundation. Continue practicing and try another knowledge check when ready.',
  successful: 'You have demonstrated strong understanding of this topic. Well done!',
  unsuccessful: 'This topic still needs attention. Continue reviewing the study materials and check in with your instructor for additional support.',
  pool_exhausted: 'You have completed all available practice questions for this topic. Continue reviewing the study materials and check in with your instructor for additional guidance.',
  already_completed: 'This focus area has already been completed.',
} as const

export interface RemediationContentBundle {
  conceptId: ConceptId
  conceptName: string
  contentBlocks: ChapterSection[]
  flashcards: Flashcard[]
  hasSufficientMaterial: boolean
  contentBlockCount: number
  flashcardCount: number
}

export interface ReassessmentStartResult {
  success: boolean
  questionId?: QuizQuestionId
  question?: QuizQuestion
  reservationId?: string
  poolExhaustion?: PoolExhaustionState
  error?: string
}

export interface ReassessmentSubmitResult {
  success: boolean
  isCorrect?: boolean
  outcome?: EvaluationOutcome
  studentState?: StudentRemediationState
  error?: string
}

export interface IStudentRemediationDbClient {
  getCycleById(cycleId: string): Promise<RemediationCycle | null>
  getCycleAssignments(cycleId: string): Promise<RemediationAssignment[]>
  getCycleEvents(cycleId: string): Promise<RemediationCycleEvent[]>
  updateCycleStatus(cycleId: string, status: RemediationCycleStatus, fields?: Partial<RemediationCycle>): Promise<boolean>
  recordCycleEvent(cycleId: string, eventType: string, eventData?: Record<string, unknown>): Promise<string | null>
  updateAssignmentStatus(assignmentId: string, status: 'started' | 'completed'): Promise<boolean>
  createQuizAttempt(userId: string, quizId: string, answersJson: Record<string, string>, score: number, totalQuestions: number): Promise<string | null>
  getQuizAttemptById(attemptId: string): Promise<{ id: string; userId: string; quizId: string; answersJson: Record<string, unknown>; completedAt: string } | null>
  updateReassessmentQuestionHistory(reservationId: string, isCorrect: boolean): Promise<boolean>
}

export class StudentRemediationService {
  constructor(
    private readonly dbClient: IStudentRemediationDbClient
  ) {}

  async getCycleForStudent(
    cycleId: string,
    authenticatedUserId: string
  ): Promise<{ cycle: RemediationCycle; assignments: RemediationAssignment[] } | { error: string }> {
    const cycle = await this.dbClient.getCycleById(cycleId)

    if (!cycle) {
      return { error: 'Remediation cycle not found' }
    }

    if (cycle.userId !== authenticatedUserId) {
      return { error: 'Access denied' }
    }

    const assignments = await this.dbClient.getCycleAssignments(cycleId)

    return { cycle, assignments }
  }

  deriveStudentState(
    cycle: RemediationCycle,
    poolExhaustion?: PoolExhaustionState | null
  ): StudentRemediationState {
    if (cycle.outcome === 'successful') {
      return 'successful'
    }
    if (cycle.outcome === 'unsuccessful') {
      return 'unsuccessful'
    }

    if (poolExhaustion?.isExhausted) {
      return 'pool_exhausted'
    }

    if (cycle.status === 'evaluated') {
      return 'already_completed'
    }

    if (cycle.reassessmentStartedAt && !cycle.reassessmentCompletedAt) {
      return 'reassessment_in_progress'
    }

    if (cycle.reviewCompletedAt) {
      return 'review_completed'
    }

    if (cycle.reviewStartedAt) {
      return 'review_in_progress'
    }

    return 'targeted_review'
  }

  async startReview(cycleId: string, authenticatedUserId: string): Promise<{ success: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }

    const { cycle } = result

    if (cycle.status !== 'targeted' && cycle.status !== 'in_review') {
      return { success: false, error: 'Review cannot be started at this time' }
    }

    await this.dbClient.recordCycleEvent(cycleId, 'review_started')

    await this.dbClient.updateCycleStatus(cycleId, 'in_review', {
      reviewStartedAt: new Date(),
    })

    return { success: true }
  }

  async markContentViewed(
    cycleId: string,
    authenticatedUserId: string,
    contentBlockId: string
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }

    await this.dbClient.recordCycleEvent(cycleId, 'content_viewed', {
      contentBlockId,
    })

    const assignment = result.assignments.find(
      (a) => a.assignmentType === 'content_block' && a.assetId === contentBlockId
    )
    if (assignment && assignment.status !== 'completed') {
      await this.dbClient.updateAssignmentStatus(assignment.id, 'completed')
    }

    return { success: true }
  }

  async markFlashcardReviewed(
    cycleId: string,
    authenticatedUserId: string,
    flashcardId: string
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }

    await this.dbClient.recordCycleEvent(cycleId, 'flashcard_reviewed', {
      flashcardId,
    })

    const assignment = result.assignments.find(
      (a) => a.assignmentType === 'flashcard' && a.assetId === flashcardId
    )
    if (assignment && assignment.status !== 'completed') {
      await this.dbClient.updateAssignmentStatus(assignment.id, 'completed')
    }

    return { success: true }
  }

  async completeReview(
    cycleId: string,
    authenticatedUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }

    const { cycle, assignments } = result

    if (cycle.status !== 'in_review' && cycle.status !== 'targeted') {
      return { success: false, error: 'Review cannot be completed at this time' }
    }

    const incompleteAssignments = assignments.filter((a) => a.status !== 'completed')
    if (incompleteAssignments.length > 0) {
      return {
        success: false,
        error: `Please complete all assigned review activities before proceeding. ${incompleteAssignments.length} remaining.`,
      }
    }

    await this.dbClient.recordCycleEvent(cycleId, 'review_completed')

    await this.dbClient.updateCycleStatus(cycleId, 'review_completed', {
      reviewCompletedAt: new Date(),
    })

    return { success: true }
  }

  async isReassessmentAvailable(
    cycleId: string,
    authenticatedUserId: string
  ): Promise<{ available: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { available: false, error: result.error }
    }

    const { cycle } = result

    if (cycle.outcome === 'successful' || cycle.outcome === 'unsuccessful') {
      return { available: false, error: 'This focus area has already been completed' }
    }

    if (!cycle.reviewCompletedAt) {
      return { available: false, error: 'Please complete your review before starting the knowledge check' }
    }

    return { available: true }
  }

  async recordReassessmentStarted(
    cycleId: string,
    authenticatedUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }

    await this.dbClient.recordCycleEvent(cycleId, 'reassessment_started')
    await this.dbClient.updateCycleStatus(cycleId, 'reassessed', {
      reassessmentStartedAt: new Date(),
    })

    return { success: true }
  }

  async recordReassessmentCompleted(
    cycleId: string,
    authenticatedUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }

    await this.dbClient.recordCycleEvent(cycleId, 'reassessment_completed')
    await this.dbClient.updateCycleStatus(cycleId, 'reassessed', {
      reassessmentCompletedAt: new Date(),
    })

    return { success: true }
  }

  async getReviewProgress(
    cycleId: string,
    authenticatedUserId: string
  ): Promise<{ completed: number; total: number; percentage: number } | { error: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { error: result.error }
    }

    const { assignments } = result
    const total = assignments.length
    const completed = assignments.filter((a) => a.status === 'completed').length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, percentage }
  }
}

export function createStudentRemediationService(
  dbClient: IStudentRemediationDbClient
): StudentRemediationService {
  return new StudentRemediationService(dbClient)
}
