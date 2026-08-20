/**
 * Phase 6C-3 — Student Remediation Service Tests
 *
 * Tests for the student-facing remediation experience service.
 * Covers authorization, state derivation, review gating, and progress tracking.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  StudentRemediationService,
  createStudentRemediationService,
  type IStudentRemediationDbClient,
  type RemediationCycle,
  type RemediationAssignment,
  type StudentRemediationState,
} from '../student-service'
import type { ConceptId, ChapterId } from '../../reassessment/types'
import type { DetectionState, DetectionConfidence, ConceptEvidence } from '../../chapter-2-concepts/detection'

// ───────────────────────────────────────────────
// Test Fixtures
// ───────────────────────────────────────────────

const mockConceptId = 'C-2-05' as ConceptId
const mockChapterId = 'ch-2' as ChapterId
const mockUserId = 'user-123'
const mockCycleId = 'cycle-456'

const createMockCycle = (overrides: Partial<RemediationCycle> = {}): RemediationCycle => ({
  id: mockCycleId,
  userId: mockUserId,
  conceptId: mockConceptId,
  chapterId: mockChapterId,
  cycleNumber: 1,
  detectionState: 'emerging_weakness' as DetectionState,
  detectionConfidence: 'medium' as DetectionConfidence,
  detectionEvidence: {} as ConceptEvidence,
  status: 'targeted',
  targetedAt: new Date('2026-08-20T00:00:00Z'),
  reviewStartedAt: null,
  reviewCompletedAt: null,
  reassessmentStartedAt: null,
  reassessmentCompletedAt: null,
  evaluatedAt: null,
  outcome: null,
  postRemediationState: null,
  createdAt: new Date('2026-08-20T00:00:00Z'),
  updatedAt: new Date('2026-08-20T00:00:00Z'),
  ...overrides,
})

const createMockAssignment = (overrides: Partial<RemediationAssignment> = {}): RemediationAssignment => ({
  id: 'assignment-1',
  cycleId: mockCycleId,
  assignmentType: 'content_block',
  assetId: 'content-1',
  priority: 1,
  isPrimary: true,
  status: 'assigned',
  startedAt: null,
  completedAt: null,
  createdAt: new Date('2026-08-20T00:00:00Z'),
  updatedAt: new Date('2026-08-20T00:00:00Z'),
  ...overrides,
})

// ───────────────────────────────────────────────
// Mock Database Client
// ───────────────────────────────────────────────

const createMockDbClient = (): IStudentRemediationDbClient => ({
  getCycleById: vi.fn(),
  getCycleAssignments: vi.fn(),
  getCycleEvents: vi.fn(),
  updateCycleStatus: vi.fn(),
  recordCycleEvent: vi.fn(),
  updateAssignmentStatus: vi.fn(),
  createQuizAttempt: vi.fn(),
  getQuizAttemptById: vi.fn(),
  updateReassessmentQuestionHistory: vi.fn(),
})

// ───────────────────────────────────────────────
// Tests
// ───────────────────────────────────────────────

describe('StudentRemediationService', () => {
  let service: StudentRemediationService
  let mockDbClient: IStudentRemediationDbClient

  beforeEach(() => {
    mockDbClient = createMockDbClient()
    service = createStudentRemediationService(mockDbClient)
  })

  describe('getCycleForStudent', () => {
    it('should return cycle and assignments for authorized student', async () => {
      const mockCycle = createMockCycle()
      const mockAssignments = [createMockAssignment()]

      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue(mockAssignments)

      const result = await service.getCycleForStudent(mockCycleId, mockUserId)

      expect(result).toEqual({ cycle: mockCycle, assignments: mockAssignments })
      expect(mockDbClient.getCycleById).toHaveBeenCalledWith(mockCycleId)
    })

    it('should return error for non-existent cycle', async () => {
      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(null)

      const result = await service.getCycleForStudent(mockCycleId, mockUserId)

      expect(result).toEqual({ error: 'Remediation cycle not found' })
    })

    it('should return error for unauthorized access (cross-student)', async () => {
      const mockCycle = createMockCycle({ userId: 'other-user' })
      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)

      const result = await service.getCycleForStudent(mockCycleId, mockUserId)

      expect(result).toEqual({ error: 'Access denied' })
    })
  })

  describe('deriveStudentState', () => {
    it('should return successful for successful outcome', () => {
      const cycle = createMockCycle({ outcome: 'successful' })
      const state = service.deriveStudentState(cycle)
      expect(state).toBe('successful')
    })

    it('should return unsuccessful for unsuccessful outcome', () => {
      const cycle = createMockCycle({ outcome: 'unsuccessful' })
      const state = service.deriveStudentState(cycle)
      expect(state).toBe('unsuccessful')
    })

    it('should return pool_exhausted when pool is exhausted', () => {
      const cycle = createMockCycle()
      const poolExhaustion = { isExhausted: true, totalQuestionsInPool: 5, attemptedQuestionCount: 5, attemptedQuestionIds: [], availableQuestionIds: [] }
      const state = service.deriveStudentState(cycle, poolExhaustion)
      expect(state).toBe('pool_exhausted')
    })

    it('should return already_completed for evaluated status', () => {
      const cycle = createMockCycle({ status: 'evaluated' })
      const state = service.deriveStudentState(cycle)
      expect(state).toBe('already_completed')
    })

    it('should return reassessment_in_progress when reassessment started but not completed', () => {
      const cycle = createMockCycle({
        reassessmentStartedAt: new Date(),
        reassessmentCompletedAt: null,
      })
      const state = service.deriveStudentState(cycle)
      expect(state).toBe('reassessment_in_progress')
    })

    it('should return review_completed when review is done', () => {
      const cycle = createMockCycle({
        reviewCompletedAt: new Date(),
      })
      const state = service.deriveStudentState(cycle)
      expect(state).toBe('review_completed')
    })

    it('should return review_in_progress when review started', () => {
      const cycle = createMockCycle({
        reviewStartedAt: new Date(),
      })
      const state = service.deriveStudentState(cycle)
      expect(state).toBe('review_in_progress')
    })

    it('should return targeted_review by default', () => {
      const cycle = createMockCycle()
      const state = service.deriveStudentState(cycle)
      expect(state).toBe('targeted_review')
    })
  })

  describe('startReview', () => {
    it('should start review for targeted cycle', async () => {
      const mockCycle = createMockCycle({ status: 'targeted' })
      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue([])
      vi.mocked(mockDbClient.recordCycleEvent).mockResolvedValue('event-1')
      vi.mocked(mockDbClient.updateCycleStatus).mockResolvedValue(true)

      const result = await service.startReview(mockCycleId, mockUserId)

      expect(result.success).toBe(true)
      expect(mockDbClient.recordCycleEvent).toHaveBeenCalledWith(mockCycleId, 'review_started')
      expect(mockDbClient.updateCycleStatus).toHaveBeenCalledWith(
        mockCycleId,
        'in_review',
        expect.objectContaining({ reviewStartedAt: expect.any(Date) })
      )
    })

    it('should reject start review for completed cycle', async () => {
      const mockCycle = createMockCycle({ status: 'evaluated' })
      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue([])

      const result = await service.startReview(mockCycleId, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Review cannot be started at this time')
    })
  })

  describe('completeReview', () => {
    it('should complete review when all assignments are done', async () => {
      const mockCycle = createMockCycle({ status: 'in_review' })
      const mockAssignments = [
        createMockAssignment({ status: 'completed' }),
        createMockAssignment({ id: 'assignment-2', status: 'completed' }),
      ]

      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue(mockAssignments)
      vi.mocked(mockDbClient.recordCycleEvent).mockResolvedValue('event-1')
      vi.mocked(mockDbClient.updateCycleStatus).mockResolvedValue(true)

      const result = await service.completeReview(mockCycleId, mockUserId)

      expect(result.success).toBe(true)
      expect(mockDbClient.recordCycleEvent).toHaveBeenCalledWith(mockCycleId, 'review_completed')
    })

    it('should reject complete review with incomplete assignments', async () => {
      const mockCycle = createMockCycle({ status: 'in_review' })
      const mockAssignments = [
        createMockAssignment({ status: 'completed' }),
        createMockAssignment({ id: 'assignment-2', status: 'assigned' }),
      ]

      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue(mockAssignments)

      const result = await service.completeReview(mockCycleId, mockUserId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Please complete all assigned review activities')
    })
  })

  describe('isReassessmentAvailable', () => {
    it('should return available when review is completed', async () => {
      const mockCycle = createMockCycle({
        reviewCompletedAt: new Date(),
        outcome: null,
      })
      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue([])

      const result = await service.isReassessmentAvailable(mockCycleId, mockUserId)

      expect(result.available).toBe(true)
    })

    it('should return not available when review not completed', async () => {
      const mockCycle = createMockCycle({ reviewCompletedAt: null })
      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue([])

      const result = await service.isReassessmentAvailable(mockCycleId, mockUserId)

      expect(result.available).toBe(false)
      expect(result.error).toContain('Please complete your review')
    })

    it('should return not available for terminal cycle', async () => {
      const mockCycle = createMockCycle({
        reviewCompletedAt: new Date(),
        outcome: 'successful',
      })
      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue([])

      const result = await service.isReassessmentAvailable(mockCycleId, mockUserId)

      expect(result.available).toBe(false)
      expect(result.error).toContain('already been completed')
    })
  })

  describe('getReviewProgress', () => {
    it('should calculate progress correctly', async () => {
      const mockCycle = createMockCycle()
      const mockAssignments = [
        createMockAssignment({ status: 'completed' }),
        createMockAssignment({ id: 'assignment-2', status: 'completed' }),
        createMockAssignment({ id: 'assignment-3', status: 'assigned' }),
      ]

      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue(mockAssignments)

      const result = await service.getReviewProgress(mockCycleId, mockUserId)

      expect(result).toEqual({
        completed: 2,
        total: 3,
        percentage: 67,
      })
    })

    it('should return zero progress for no assignments', async () => {
      const mockCycle = createMockCycle()
      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue([])

      const result = await service.getReviewProgress(mockCycleId, mockUserId)

      expect(result).toEqual({
        completed: 0,
        total: 0,
        percentage: 0,
      })
    })
  })

  describe('markContentViewed', () => {
    it('should record content viewed event and update assignment', async () => {
      const mockCycle = createMockCycle()
      const mockAssignments = [
        createMockAssignment({ assetId: 'content-1', status: 'assigned' }),
      ]

      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue(mockAssignments)
      vi.mocked(mockDbClient.recordCycleEvent).mockResolvedValue('event-1')
      vi.mocked(mockDbClient.updateAssignmentStatus).mockResolvedValue(true)

      const result = await service.markContentViewed(mockCycleId, mockUserId, 'content-1')

      expect(result.success).toBe(true)
      expect(mockDbClient.recordCycleEvent).toHaveBeenCalledWith(
        mockCycleId,
        'content_viewed',
        { contentBlockId: 'content-1' }
      )
      expect(mockDbClient.updateAssignmentStatus).toHaveBeenCalledWith('assignment-1', 'completed')
    })
  })

  describe('markFlashcardReviewed', () => {
    it('should record flashcard reviewed event and update assignment', async () => {
      const mockCycle = createMockCycle()
      const mockAssignments = [
        createMockAssignment({
          assignmentType: 'flashcard',
          assetId: 'fc-2-001',
          status: 'assigned',
        }),
      ]

      vi.mocked(mockDbClient.getCycleById).mockResolvedValue(mockCycle)
      vi.mocked(mockDbClient.getCycleAssignments).mockResolvedValue(mockAssignments)
      vi.mocked(mockDbClient.recordCycleEvent).mockResolvedValue('event-1')
      vi.mocked(mockDbClient.updateAssignmentStatus).mockResolvedValue(true)

      const result = await service.markFlashcardReviewed(mockCycleId, mockUserId, 'fc-2-001')

      expect(result.success).toBe(true)
      expect(mockDbClient.recordCycleEvent).toHaveBeenCalledWith(
        mockCycleId,
        'flashcard_reviewed',
        { flashcardId: 'fc-2-001' }
      )
    })
  })
})
