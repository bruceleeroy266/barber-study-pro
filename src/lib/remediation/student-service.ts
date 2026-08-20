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

// ───────────────────────────────────────────────
// Remediation Cycle Types (from Phase 6C-2a)
// ───────────────────────────────────────────────

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

// ───────────────────────────────────────────────
// Student-Facing State Types
// ───────────────────────────────────────────────

/**
 * Student-facing remediation state derived from internal cycle state.
 * Never expose internal detection-state terminology to students.
 */
export type StudentRemediationState =
  | 'targeted_review'           // Review assigned, not yet started
  | 'review_in_progress'        // Student is reviewing materials
  | 'review_completed'          // Review done, reassessment available
  | 'reassessment_in_progress'  // Question reserved, awaiting submission
  | 'pending_evaluation'        // Answer submitted, evaluation pending
  | 'pending_more_evidence'     // Evaluation returned pending — cycle remains active
  | 'successful'                // Terminal: currently_performing_well
  | 'unsuccessful'              // Terminal: repeated_weakness
  | 'pool_exhausted'            // No unseen questions remain
  | 'already_completed'         // Cycle already terminal (successful/unsuccessful)

/**
 * Student-friendly status label mapping.
 * Never expose detection states, confidence levels, or diagnostic terms.
 */
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

/**
 * Student-friendly status descriptions.
 */
export const STUDENT_STATE_DESCRIPTIONS: Record<StudentRemediationState, string> = {
  targeted_review: 'Your instructor has identified an area to focus on. Review the materials below to get started.',
  review_in_progress: 'You are making progress through your review materials. Keep going!',
  review_completed: 'You have completed your review. A knowledge check is now available.',
  reassessment_in_progress: 'Answer the question below to demonstrate your understanding.',
  pending_evaluation: 'Your answer is being reviewed...',
  pending_more_evidence: 'You are building your foundation. Continue practicing and try another knowledge check when ready.',
  successful: 'You have demonstrated strong understanding of this topic. Well done!',
  unsuccessful: 'Your instructor will provide additional support for this topic.',
  pool_exhausted: 'You have completed all available practice questions for this topic. Your instructor has been notified and will provide additional guidance.',
  already_completed: 'This focus area has already been completed.',
} as const

// ───────────────────────────────────────────────
// Remediation Content Bundle
// ───────────────────────────────────────────────

/**
 * Content bundle for a remediation cycle, filtered by concept.
 */
export interface RemediationContentBundle {
  conceptId: ConceptId
  conceptName: string
  contentBlocks: ChapterSection[]
  flashcards: Flashcard[]
  hasSufficientMaterial: boolean
  contentBlockCount: number
  flashcardCount: number
}

// ───────────────────────────────────────────────
// Reassessment Types
// ───────────────────────────────────────────────

/**
 * Result of starting a reassessment (question reservation).
 */
export interface ReassessmentStartResult {
  success: boolean
  questionId?: QuizQuestionId
  question?: QuizQuestion
  reservationId?: string
  poolExhaustion?: PoolExhaustionState
  error?: string
}

/**
 * Result of submitting a reassessment answer.
 */
export interface ReassessmentSubmitResult {
  success: boolean
  isCorrect?: boolean
  outcome?: EvaluationOutcome
  studentState?: StudentRemediationState
  error?: string
}

// ───────────────────────────────────────────────
// Student Remediation Service Interface
// ───────────────────────────────────────────────

/**
 * Database client interface for student remediation operations.
 * Abstracts Supabase for testability.
 */
export interface IStudentRemediationDbClient {
  // Cycle operations
  getCycleById(cycleId: string): Promise<RemediationCycle | null>
  getCycleAssignments(cycleId: string): Promise<RemediationAssignment[]>
  getCycleEvents(cycleId: string): Promise<RemediationCycleEvent[]>
  updateCycleStatus(cycleId: string, status: RemediationCycleStatus, fields?: Partial<RemediationCycle>): Promise<boolean>
  recordCycleEvent(cycleId: string, eventType: string, eventData?: Record<string, unknown>): Promise<string | null>
  updateAssignmentStatus(assignmentId: string, status: 'started' | 'completed'): Promise<boolean>

  // Quiz attempt operations (for reassessment evidence)
  createQuizAttempt(userId: string, quizId: string, answersJson: Record<string, string>, score: number, totalQuestions: number): Promise<string | null>
  getQuizAttemptById(attemptId: string): Promise<{ id: string; userId: string; quizId: string; answersJson: Record<string, unknown>; completedAt: string } | null>

  // Reassessment question history
  updateReassessmentQuestionHistory(reservationId: string, isCorrect: boolean): Promise<boolean>
}

/**
 * Student Remediation Service
 *
 * Orchestrates the student-facing remediation experience using existing
 * Phase 6C-2 services. Does NOT duplicate:
 *   - Exclusion engine logic (6C-2b)
 *   - Outcome matrix logic (6C-2d)
 *   - Escalation logic (6C-2c)
 *   - Canonical mapping logic (6B-2)
 */
export class StudentRemediationService {
  constructor(
    private readonly dbClient: IStudentRemediationDbClient
  ) {}

  /**
   * Get a remediation cycle with server-side authorization.
   *
   * Security: Verifies the authenticated student owns the cycle.
   * Never trust student-supplied user IDs, concept IDs, or chapter IDs.
   */
  async getCycleForStudent(
    cycleId: string,
    authenticatedUserId: string
  ): Promise<{ cycle: RemediationCycle; assignments: RemediationAssignment[] } | { error: string }> {
    const cycle = await this.dbClient.getCycleById(cycleId)

    if (!cycle) {
      return { error: 'Remediation cycle not found' }
    }

    // Server-side authorization: student must own the cycle
    if (cycle.userId !== authenticatedUserId) {
      return { error: 'Access denied' }
    }

    const assignments = await this.dbClient.getCycleAssignments(cycleId)

    return { cycle, assignments }
  }

  /**
   * Derive the student-facing state from the internal cycle state.
   *
   * Never expose internal detection-state terminology.
   */
  deriveStudentState(
    cycle: RemediationCycle,
    poolExhaustion?: PoolExhaustionState | null
  ): StudentRemediationState {
    // Terminal states first
    if (cycle.outcome === 'successful') {
      return 'successful'
    }
    if (cycle.outcome === 'unsuccessful') {
      return 'unsuccessful'
    }

    // Pool exhaustion
    if (poolExhaustion?.isExhausted) {
      return 'pool_exhausted'
    }

    // Already evaluated (terminal)
    if (cycle.status === 'evaluated') {
      return 'already_completed'
    }

    // Reassessment in progress
    if (cycle.reassessmentStartedAt && !cycle.reassessmentCompletedAt) {
      return 'reassessment_in_progress'
    }

    // Review completed, reassessment available
    if (cycle.reviewCompletedAt) {
      return 'review_completed'
    }

    // Review in progress
    if (cycle.reviewStartedAt) {
      return 'review_in_progress'
    }

    // Default: targeted review
    return 'targeted_review'
  }

  /**
   * Start the targeted review for a cycle.
   * Records the review_started event and updates cycle status.
   */
  async startReview(cycleId: string, authenticatedUserId: string): Promise<{ success: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }

    const { cycle } = result

    // Can only start review from targeted state
    if (cycle.status !== 'targeted' && cycle.status !== 'in_review') {
      return { success: false, error: 'Review cannot be started at this time' }
    }

    // Record review started event
    await this.dbClient.recordCycleEvent(cycleId, 'review_started')

    // Update cycle status
    await this.dbClient.updateCycleStatus(cycleId, 'in_review', {
      reviewStartedAt: new Date(),
    })

    return { success: true }
  }

  /**
   * Mark a content block as viewed.
   */
  async markContentViewed(
    cycleId: string,
    authenticatedUserId: string,
    contentBlockId: string
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }

    // Record content viewed event
    await this.dbClient.recordCycleEvent(cycleId, 'content_viewed', {
      contentBlockId,
    })

    // Update assignment status if exists
    const assignment = result.assignments.find(
      (a) => a.assignmentType === 'content_block' && a.assetId === contentBlockId
    )
    if (assignment && assignment.status !== 'completed') {
      await this.dbClient.updateAssignmentStatus(assignment.id, 'completed')
    }

    return { success: true }
  }

  /**
   * Mark a flashcard as reviewed.
   */
  async markFlashcardReviewed(
    cycleId: string,
    authenticatedUserId: string,
    flashcardId: string
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }

    // Record flashcard reviewed event
    await this.dbClient.recordCycleEvent(cycleId, 'flashcard_reviewed', {
      flashcardId,
    })

    // Update assignment status if exists
    const assignment = result.assignments.find(
      (a) => a.assignmentType === 'flashcard' && a.assetId === flashcardId
    )
    if (assignment && assignment.status !== 'completed') {
      await this.dbClient.updateAssignmentStatus(assignment.id, 'completed')
    }

    return { success: true }
  }

  /**
   * Complete the targeted review.
   *
   * Policy: Targeted review is required before reassessment becomes available.
   * No clock-based cooldown — review completion is the only gate.
   */
  async completeReview(
    cycleId: string,
    authenticatedUserId: string
  ): Promise<{ success: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { success: false, error: result.error }
    }

    const { cycle, assignments } = result

    // Can only complete review from in_review or targeted state
    if (cycle.status !== 'in_review' && cycle.status !== 'targeted') {
      return { success: false, error: 'Review cannot be completed at this time' }
    }

    // Check that all assigned activities are completed
    const incompleteAssignments = assignments.filter((a) => a.status !== 'completed')
    if (incompleteAssignments.length > 0) {
      return {
        success: false,
        error: `Please complete all assigned review activities before proceeding. ${incompleteAssignments.length} remaining.`,
      }
    }

    // Record review completed event
    await this.dbClient.recordCycleEvent(cycleId, 'review_completed')

    // Update cycle status
    await this.dbClient.updateCycleStatus(cycleId, 'review_completed', {
      reviewCompletedAt: new Date(),
    })

    return { success: true }
  }

  /**
   * Check if reassessment is available for a cycle.
   *
   * Policy: Targeted review must be completed before reassessment.
   * No clock-based cooldown.
   */
  async isReassessmentAvailable(
    cycleId: string,
    authenticatedUserId: string
  ): Promise<{ available: boolean; error?: string }> {
    const result = await this.getCycleForStudent(cycleId, authenticatedUserId)
    if ('error' in result) {
      return { available: false, error: result.error }
    }

    const { cycle } = result

    // Terminal cycles cannot be reassessed
    if (cycle.outcome === 'successful' || cycle.outcome === 'unsuccessful') {
      return { available: false, error: 'This focus area has already been completed' }
    }

    // Review must be completed
    if (!cycle.reviewCompletedAt) {
      return { available: false, error: 'Please complete your review before starting the knowledge check' }
    }

    return { available: true }
  }

  /**
   * Record reassessment started event.
   */
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

  /**
   * Record reassessment completed event.
   */
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

  /**
   * Get the review progress for a cycle.
   */
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

// ───────────────────────────────────────────────
// Factory Function
// ───────────────────────────────────────────────

export function createStudentRemediationService(
  dbClient: IStudentRemediationDbClient
): StudentRemediationService {
  return new StudentRemediationService(dbClient)
}
