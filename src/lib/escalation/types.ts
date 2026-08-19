/**
 * Phase 6C-2c — Escalation & Sustained-Performance Reset Types
 *
 * Chapter-agnostic type definitions for instructor escalation and
 * sustained-performance reset services.
 */

import type { ChapterId, ConceptId } from '../reassessment/types'
import type { DetectionState, ConceptEvidence } from '../chapter-2-concepts/detection'

// ───────────────────────────────────────────────
// Re-export for convenience
// ───────────────────────────────────────────────

export type { ChapterId, ConceptId }
export type { DetectionState, ConceptEvidence }

// ───────────────────────────────────────────────
// Escalation Types
// ───────────────────────────────────────────────

export type EscalationStatus =
  | 'pending'
  | 'acknowledged'
  | 'in_progress'
  | 'resolved'
  | 'auto_cleared'
  | 'expired'

export type EscalationEventType =
  | 'created'
  | 'acknowledged'
  | 'in_progress'
  | 'resolved'
  | 'auto_cleared'
  | 'auto_clear_aborted'
  | 'expired'
  | 'notes_updated'

export interface InstructorEscalation {
  id: string
  userId: string
  conceptId: ConceptId
  chapterId: ChapterId
  schoolId: string
  triggeringCycleIds: string[]
  unsuccessfulCycleCount: number
  detectionEvidence: ConceptEvidence
  status: EscalationStatus
  acknowledgedBy: string | null
  acknowledgedAt: Date | null
  instructorNotes: string | null
  interventionPlan: string | null
  resolutionSummary: string | null
  followUpRequired: boolean | null
  autoClearedAt: Date | null
  autoClearedByResetId: string | null
  expiredAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface InstructorEscalationEvent {
  id: string
  escalationId: string
  eventType: EscalationEventType
  eventData: Record<string, unknown>
  actorId: string | null
  createdAt: Date
}

export interface CreateEscalationParams {
  userId: string
  conceptId: ConceptId
  chapterId: ChapterId
  schoolId: string
  triggeringCycleIds: string[]
  unsuccessfulCycleCount: number
  detectionEvidence: ConceptEvidence
}

export interface CreateEscalationResult {
  success: boolean
  escalationId?: string
  alreadyExists?: boolean
  error?: string
}

export interface AcknowledgeEscalationParams {
  escalationId: string
  instructorId: string
  notes?: string
}

export interface AcknowledgeEscalationResult {
  success: boolean
  error?: string
}

// ───────────────────────────────────────────────
// Sustained-Performance Tracking Types
// ───────────────────────────────────────────────

export interface SustainedPerformanceTracking {
  id: string
  userId: string
  conceptId: ConceptId
  chapterId: ChapterId
  enteredCpwAt: Date
  lastVerifiedAt: Date
  continuityBrokenAt: Date | null
  followUpEvidenceCount: number
  followUpEvidenceIds: string[]
  isActive: boolean
  resetAt: Date | null
  resetId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface SustainedPerformanceReset {
  id: string
  userId: string
  conceptId: ConceptId
  chapterId: ChapterId
  trackingId: string
  enteredCpwAt: Date
  followUpEvidenceCount: number
  followUpEvidenceIds: string[]
  detectionEvidence: ConceptEvidence
  previousCycleCount: number
  previousUnsuccessfulCount: number
  previousLockoutActive: boolean
  escalationAutoCleared: boolean
  escalationId: string | null
  executedAt: Date
  executedBy: string | null
}

export interface ResetEligibilityResult {
  isEligible: boolean
  enteredCpwAt?: Date
  daysInCpw?: number
  followUpEvidenceCount?: number
  continuityBroken?: boolean
  blockingReason?: 'continuity_broken' | 'insufficient_days' | 'no_follow_up_evidence'
}

export interface ExecuteResetResult {
  success: boolean
  resetId?: string
  alreadyExecuted?: boolean
  error?: string
}

// ───────────────────────────────────────────────
// Detection Integration Types
// ───────────────────────────────────────────────

export interface DetectionTransitionParams {
  userId: string
  conceptId: ConceptId
  chapterId: ChapterId
  newState: DetectionState
  evidence: ConceptEvidence
}

export interface DetectionTransitionResult {
  success: boolean
  trackingId?: string
  isNewTrackingPeriod?: boolean
  continuityBroken?: boolean
  error?: string
}

// ───────────────────────────────────────────────
// Follow-Up Evidence Types
// ───────────────────────────────────────────────

/**
 * Parameters for recording verified follow-up assessment evidence.
 *
 * The application layer MUST verify canonical question→concept mapping
 * before calling recordFollowUpEvidence(). The canonicalMappingVerified
 * flag and mappedQuestionCount record that this verification occurred.
 */
export interface RecordFollowUpEvidenceParams {
  userId: string
  conceptId: ConceptId
  chapterId: ChapterId
  quizAttemptId: string
  /** Must be true — confirms application layer verified canonical mapping */
  canonicalMappingVerified: boolean
  /** Number of questions in the attempt canonically mapped to the concept (must be >= 1) */
  mappedQuestionCount: number
}

export interface RecordFollowUpEvidenceResult {
  success: boolean
  evidenceId?: string
  alreadyRecorded?: boolean
  error?: string
}

/**
 * A persisted follow-up evidence record from the immutable ledger.
 */
export interface FollowUpEvidence {
  id: string
  trackingId: string
  userId: string
  conceptId: ConceptId
  chapterId: ChapterId
  quizAttemptId: string
  canonicalMappingVerified: boolean
  mappedQuestionCount: number
  attemptCompletedAt: Date
  recordedAt: Date
}

// ───────────────────────────────────────────────
// Database Client Interface
// ───────────────────────────────────────────────

export interface IEscalationDatabaseClient {
  // Escalation operations
  createEscalation(params: CreateEscalationParams): Promise<CreateEscalationResult>
  getEscalation(escalationId: string): Promise<InstructorEscalation | null>
  getActiveEscalation(userId: string, conceptId: ConceptId): Promise<InstructorEscalation | null>
  acknowledgeEscalation(params: AcknowledgeEscalationParams): Promise<AcknowledgeEscalationResult>
  recordEscalationEvent(escalationId: string, eventType: EscalationEventType, eventData: Record<string, unknown>, actorId?: string): Promise<void>

  // Sustained-performance operations
  recordDetectionTransition(params: DetectionTransitionParams): Promise<DetectionTransitionResult>
  recordFollowUpEvidence(params: RecordFollowUpEvidenceParams): Promise<RecordFollowUpEvidenceResult>
  getTrackingState(userId: string, conceptId: ConceptId): Promise<SustainedPerformanceTracking | null>
  checkResetEligibility(userId: string, conceptId: ConceptId): Promise<ResetEligibilityResult>
  executeReset(userId: string, conceptId: ConceptId, executedBy?: string): Promise<ExecuteResetResult>

  // Cycle queries
  getUnsuccessfulCycleCount(userId: string, conceptId: ConceptId, windowDays?: number): Promise<number>
  getCyclesInWindow(userId: string, conceptId: ConceptId, windowDays?: number): Promise<Array<{ id: string; outcome: string | null; evaluatedAt: Date | null }>>
}
