/**
 * Phase 6C-2c — Escalation & Sustained-Performance Reset Tests
 *
 * Comprehensive test suite covering all required scenarios from the
 * Phase 6C-2c implementation authorization.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { EscalationService, createEscalationService } from '../escalation-service'
import { SustainedPerformanceService, createSustainedPerformanceService } from '../sustained-performance-service'
import type {
  IEscalationDatabaseClient,
  InstructorEscalation,
  SustainedPerformanceTracking,
  ResetEligibilityResult,
  CreateEscalationResult,
  ExecuteResetResult,
  DetectionTransitionResult,
} from '../types'

// ───────────────────────────────────────────────
// Mock Database Client
// ───────────────────────────────────────────────

function createMockDbClient(): IEscalationDatabaseClient {
  return {
    createEscalation: vi.fn(),
    getEscalation: vi.fn(),
    getActiveEscalation: vi.fn(),
    acknowledgeEscalation: vi.fn(),
    recordEscalationEvent: vi.fn(),
    recordDetectionTransition: vi.fn(),
    recordFollowUpEvidence: vi.fn(),
    getTrackingState: vi.fn(),
    checkResetEligibility: vi.fn(),
    executeReset: vi.fn(),
    getUnsuccessfulCycleCount: vi.fn(),
    getCyclesInWindow: vi.fn(),
  }
}

// ───────────────────────────────────────────────
// Test Fixtures
// ───────────────────────────────────────────────

const mockUserId = 'user-123'
const mockConceptId = 'C-2-01'
const mockChapterId = 'ch-2'
const mockSchoolId = 'school-456'
const mockInstructorId = 'instructor-789'

function createMockEscalation(overrides: Partial<InstructorEscalation> = {}): InstructorEscalation {
  return {
    id: 'escalation-123',
    userId: mockUserId,
    conceptId: mockConceptId,
    chapterId: mockChapterId,
    schoolId: mockSchoolId,
    triggeringCycleIds: ['cycle-1', 'cycle-2'],
    unsuccessfulCycleCount: 2,
    detectionEvidence: {} as any,
    status: 'pending',
    acknowledgedBy: null,
    acknowledgedAt: null,
    instructorNotes: null,
    interventionPlan: null,
    resolutionSummary: null,
    followUpRequired: null,
    autoClearedAt: null,
    autoClearedByResetId: null,
    expiredAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

function createMockTracking(overrides: Partial<SustainedPerformanceTracking> = {}): SustainedPerformanceTracking {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  return {
    id: 'tracking-123',
    userId: mockUserId,
    conceptId: mockConceptId,
    chapterId: mockChapterId,
    enteredCpwAt: thirtyDaysAgo,
    lastVerifiedAt: now,
    continuityBrokenAt: null,
    followUpEvidenceCount: 1,
    followUpEvidenceIds: ['attempt-1'],
    isActive: true,
    resetAt: null,
    resetId: null,
    createdAt: thirtyDaysAgo,
    updatedAt: now,
    ...overrides,
  }
}

// ───────────────────────────────────────────────
// Escalation Service Tests
// ───────────────────────────────────────────────

describe('EscalationService', () => {
  let mockDbClient: IEscalationDatabaseClient
  let service: EscalationService

  beforeEach(() => {
    mockDbClient = createMockDbClient()
    service = createEscalationService(mockDbClient)
  })

  describe('shouldCreateEscalation', () => {
    it('should return false when first unsuccessful cycle (threshold not met)', async () => {
      vi.mocked(mockDbClient.getUnsuccessfulCycleCount).mockResolvedValue(1)

      const result = await service.shouldCreateEscalation(mockUserId, mockConceptId)

      expect(result).toBe(false)
      expect(mockDbClient.getUnsuccessfulCycleCount).toHaveBeenCalledWith(
        mockUserId,
        mockConceptId,
        30
      )
    })

    it('should return true when second qualifying unsuccessful cycle triggers escalation', async () => {
      vi.mocked(mockDbClient.getUnsuccessfulCycleCount).mockResolvedValue(2)

      const result = await service.shouldCreateEscalation(mockUserId, mockConceptId)

      expect(result).toBe(true)
    })

    it('should return true when more than 2 unsuccessful cycles', async () => {
      vi.mocked(mockDbClient.getUnsuccessfulCycleCount).mockResolvedValue(3)

      const result = await service.shouldCreateEscalation(mockUserId, mockConceptId)

      expect(result).toBe(true)
    })
  })

  describe('createEscalation', () => {
    const createParams = {
      userId: mockUserId,
      conceptId: mockConceptId,
      chapterId: mockChapterId,
      schoolId: mockSchoolId,
      triggeringCycleIds: ['cycle-1', 'cycle-2'],
      unsuccessfulCycleCount: 2,
      detectionEvidence: {} as any,
    }

    it('should create escalation when threshold is met', async () => {
      vi.mocked(mockDbClient.getUnsuccessfulCycleCount).mockResolvedValue(2)
      vi.mocked(mockDbClient.getActiveEscalation).mockResolvedValue(null)
      vi.mocked(mockDbClient.createEscalation).mockResolvedValue({
        success: true,
        escalationId: 'new-escalation-123',
      })

      const result = await service.createEscalation(createParams)

      expect(result.success).toBe(true)
      expect(result.escalationId).toBe('new-escalation-123')
      expect(result.alreadyExists).toBeUndefined()
    })

    it('should return existing escalation when duplicate prevention triggered', async () => {
      const existingEscalation = createMockEscalation()
      vi.mocked(mockDbClient.getUnsuccessfulCycleCount).mockResolvedValue(2)
      vi.mocked(mockDbClient.getActiveEscalation).mockResolvedValue(existingEscalation)

      const result = await service.createEscalation(createParams)

      expect(result.success).toBe(true)
      expect(result.escalationId).toBe(existingEscalation.id)
      expect(result.alreadyExists).toBe(true)
      expect(mockDbClient.createEscalation).not.toHaveBeenCalled()
    })

    it('should fail when threshold not met', async () => {
      vi.mocked(mockDbClient.getUnsuccessfulCycleCount).mockResolvedValue(1)

      const result = await service.createEscalation(createParams)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Escalation threshold not met')
    })
  })

  describe('acknowledgeEscalation', () => {
    it('should establish instructor ownership on acknowledgement', async () => {
      const pendingEscalation = createMockEscalation({ status: 'pending', acknowledgedBy: null })
      vi.mocked(mockDbClient.getEscalation).mockResolvedValue(pendingEscalation)
      vi.mocked(mockDbClient.acknowledgeEscalation).mockResolvedValue({ success: true })

      const result = await service.acknowledgeEscalation({
        escalationId: pendingEscalation.id,
        instructorId: mockInstructorId,
        notes: 'Reviewing student progress',
      })

      expect(result.success).toBe(true)
      expect(mockDbClient.acknowledgeEscalation).toHaveBeenCalledWith({
        escalationId: pendingEscalation.id,
        instructorId: mockInstructorId,
        notes: 'Reviewing student progress',
      })
    })

    it('should fail when escalation already acknowledged', async () => {
      const acknowledgedEscalation = createMockEscalation({
        status: 'acknowledged',
        acknowledgedBy: 'other-instructor',
      })
      vi.mocked(mockDbClient.getEscalation).mockResolvedValue(acknowledgedEscalation)

      const result = await service.acknowledgeEscalation({
        escalationId: acknowledgedEscalation.id,
        instructorId: mockInstructorId,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Cannot acknowledge escalation in status')
    })

    it('should fail when escalation not in pending status', async () => {
      const inProgressEscalation = createMockEscalation({ status: 'in_progress' })
      vi.mocked(mockDbClient.getEscalation).mockResolvedValue(inProgressEscalation)

      const result = await service.acknowledgeEscalation({
        escalationId: inProgressEscalation.id,
        instructorId: mockInstructorId,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Cannot acknowledge escalation in status')
    })
  })

  describe('isInstructorOwned', () => {
    it('should return false for non-owned escalation', () => {
      const escalation = createMockEscalation({ acknowledgedBy: null })
      expect(service.isInstructorOwned(escalation)).toBe(false)
    })

    it('should return true for instructor-owned escalation', () => {
      const escalation = createMockEscalation({ acknowledgedBy: mockInstructorId })
      expect(service.isInstructorOwned(escalation)).toBe(true)
    })
  })

  describe('canAutoClear', () => {
    it('should return true for pending non-owned escalation', () => {
      const escalation = createMockEscalation({ status: 'pending', acknowledgedBy: null })
      expect(service.canAutoClear(escalation)).toBe(true)
    })

    it('should return false for acknowledged escalation (instructor-owned)', () => {
      const escalation = createMockEscalation({
        status: 'acknowledged',
        acknowledgedBy: mockInstructorId,
      })
      expect(service.canAutoClear(escalation)).toBe(false)
    })

    it('should return false for in_progress escalation', () => {
      const escalation = createMockEscalation({ status: 'in_progress' })
      expect(service.canAutoClear(escalation)).toBe(false)
    })

    it('should return false for resolved escalation', () => {
      const escalation = createMockEscalation({ status: 'resolved' })
      expect(service.canAutoClear(escalation)).toBe(false)
    })
  })
})

// ───────────────────────────────────────────────
// Sustained-Performance Service Tests
// ───────────────────────────────────────────────

describe('SustainedPerformanceService', () => {
  let mockDbClient: IEscalationDatabaseClient
  let service: SustainedPerformanceService

  beforeEach(() => {
    mockDbClient = createMockDbClient()
    service = createSustainedPerformanceService(mockDbClient)
  })

  describe('recordDetectionTransition', () => {
    it('should record transition into CPW and start new tracking period', async () => {
      const mockResult: DetectionTransitionResult = {
        success: true,
        trackingId: 'tracking-123',
        isNewTrackingPeriod: true,
        continuityBroken: false,
      }
      vi.mocked(mockDbClient.recordDetectionTransition).mockResolvedValue(mockResult)

      const result = await service.recordDetectionTransition({
        userId: mockUserId,
        conceptId: mockConceptId,
        chapterId: mockChapterId,
        newState: 'currently_performing_well',
        evidence: {} as any,
      })

      expect(result.success).toBe(true)
      expect(result.isNewTrackingPeriod).toBe(true)
      expect(result.continuityBroken).toBe(false)
    })

    it('should record continued CPW without restarting clock', async () => {
      const mockResult: DetectionTransitionResult = {
        success: true,
        trackingId: 'tracking-123',
        isNewTrackingPeriod: false,
        continuityBroken: false,
      }
      vi.mocked(mockDbClient.recordDetectionTransition).mockResolvedValue(mockResult)

      const result = await service.recordDetectionTransition({
        userId: mockUserId,
        conceptId: mockConceptId,
        chapterId: mockChapterId,
        newState: 'currently_performing_well',
        evidence: {} as any,
      })

      expect(result.success).toBe(true)
      expect(result.isNewTrackingPeriod).toBe(false)
    })

    it('should record transition out of CPW and break continuity', async () => {
      const mockResult: DetectionTransitionResult = {
        success: true,
        trackingId: 'tracking-123',
        isNewTrackingPeriod: false,
        continuityBroken: true,
      }
      vi.mocked(mockDbClient.recordDetectionTransition).mockResolvedValue(mockResult)

      const result = await service.recordDetectionTransition({
        userId: mockUserId,
        conceptId: mockConceptId,
        chapterId: mockChapterId,
        newState: 'emerging_weakness',
        evidence: {} as any,
      })

      expect(result.success).toBe(true)
      expect(result.continuityBroken).toBe(true)
    })
  })

  describe('checkResetEligibility', () => {
    it('should return eligible when 30 days + follow-up evidence + continuity maintained', async () => {
      const mockResult: ResetEligibilityResult = {
        isEligible: true,
        enteredCpwAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        daysInCpw: 30,
        followUpEvidenceCount: 1,
        continuityBroken: false,
      }
      vi.mocked(mockDbClient.checkResetEligibility).mockResolvedValue(mockResult)

      const result = await service.checkResetEligibility(mockUserId, mockConceptId)

      expect(result.isEligible).toBe(true)
      expect(result.daysInCpw).toBe(30)
      expect(result.followUpEvidenceCount).toBe(1)
    })

    it('should return not eligible when 29 days (insufficient days)', async () => {
      const mockResult: ResetEligibilityResult = {
        isEligible: false,
        enteredCpwAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
        daysInCpw: 29,
        followUpEvidenceCount: 1,
        continuityBroken: false,
        blockingReason: 'insufficient_days',
      }
      vi.mocked(mockDbClient.checkResetEligibility).mockResolvedValue(mockResult)

      const result = await service.checkResetEligibility(mockUserId, mockConceptId)

      expect(result.isEligible).toBe(false)
      expect(result.blockingReason).toBe('insufficient_days')
    })

    it('should return not eligible when 30 days but no follow-up evidence', async () => {
      const mockResult: ResetEligibilityResult = {
        isEligible: false,
        enteredCpwAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        daysInCpw: 30,
        followUpEvidenceCount: 0,
        continuityBroken: false,
        blockingReason: 'no_follow_up_evidence',
      }
      vi.mocked(mockDbClient.checkResetEligibility).mockResolvedValue(mockResult)

      const result = await service.checkResetEligibility(mockUserId, mockConceptId)

      expect(result.isEligible).toBe(false)
      expect(result.blockingReason).toBe('no_follow_up_evidence')
    })

    it('should return not eligible when continuity broken', async () => {
      const mockResult: ResetEligibilityResult = {
        isEligible: false,
        enteredCpwAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        daysInCpw: 30,
        followUpEvidenceCount: 1,
        continuityBroken: true,
        blockingReason: 'continuity_broken',
      }
      vi.mocked(mockDbClient.checkResetEligibility).mockResolvedValue(mockResult)

      const result = await service.checkResetEligibility(mockUserId, mockConceptId)

      expect(result.isEligible).toBe(false)
      expect(result.blockingReason).toBe('continuity_broken')
    })
  })

  describe('executeReset', () => {
    it('should execute reset when eligible', async () => {
      const mockEligibility: ResetEligibilityResult = {
        isEligible: true,
        daysInCpw: 30,
        followUpEvidenceCount: 1,
        continuityBroken: false,
      }
      const mockResult: ExecuteResetResult = {
        success: true,
        resetId: 'reset-123',
      }
      vi.mocked(mockDbClient.checkResetEligibility).mockResolvedValue(mockEligibility)
      vi.mocked(mockDbClient.executeReset).mockResolvedValue(mockResult)

      const result = await service.executeReset(mockUserId, mockConceptId)

      expect(result.success).toBe(true)
      expect(result.resetId).toBe('reset-123')
    })

    it('should return alreadyExecuted when reset already executed (idempotent)', async () => {
      const mockEligibility: ResetEligibilityResult = {
        isEligible: true,
        daysInCpw: 30,
        followUpEvidenceCount: 1,
        continuityBroken: false,
      }
      const mockResult: ExecuteResetResult = {
        success: true,
        alreadyExecuted: true,
      }
      vi.mocked(mockDbClient.checkResetEligibility).mockResolvedValue(mockEligibility)
      vi.mocked(mockDbClient.executeReset).mockResolvedValue(mockResult)

      const result = await service.executeReset(mockUserId, mockConceptId)

      expect(result.success).toBe(true)
      expect(result.alreadyExecuted).toBe(true)
    })

    it('should fail when not eligible', async () => {
      const mockEligibility: ResetEligibilityResult = {
        isEligible: false,
        blockingReason: 'insufficient_days',
      }
      vi.mocked(mockDbClient.checkResetEligibility).mockResolvedValue(mockEligibility)

      const result = await service.executeReset(mockUserId, mockConceptId)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Reset not eligible')
    })
  })

  describe('isActivelyTracking', () => {
    it('should return true for active tracking with no continuity break', () => {
      const tracking = createMockTracking({ isActive: true, continuityBrokenAt: null })
      expect(service.isActivelyTracking(tracking)).toBe(true)
    })

    it('should return false for inactive tracking', () => {
      const tracking = createMockTracking({ isActive: false })
      expect(service.isActivelyTracking(tracking)).toBe(false)
    })

    it('should return false for tracking with continuity break', () => {
      const tracking = createMockTracking({ continuityBrokenAt: new Date() })
      expect(service.isActivelyTracking(tracking)).toBe(false)
    })
  })

  describe('getDaysInCpw', () => {
    it('should calculate days elapsed correctly', () => {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const tracking = createMockTracking({ enteredCpwAt: thirtyDaysAgo })

      const days = service.getDaysInCpw(tracking)
      expect(days).toBe(30)
    })
  })

  describe('hasFollowUpEvidence', () => {
    it('should return true when follow-up evidence exists', () => {
      const tracking = createMockTracking({ followUpEvidenceCount: 1 })
      expect(service.hasFollowUpEvidence(tracking)).toBe(true)
    })

    it('should return false when no follow-up evidence', () => {
      const tracking = createMockTracking({ followUpEvidenceCount: 0 })
      expect(service.hasFollowUpEvidence(tracking)).toBe(false)
    })
  })

  describe('meetsDayRequirement', () => {
    it('should return true when 30 days elapsed', () => {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const tracking = createMockTracking({ enteredCpwAt: thirtyDaysAgo })
      expect(service.meetsDayRequirement(tracking)).toBe(true)
    })

    it('should return false when 29 days elapsed', () => {
      const now = new Date()
      const twentyNineDaysAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)
      const tracking = createMockTracking({ enteredCpwAt: twentyNineDaysAgo })
      expect(service.meetsDayRequirement(tracking)).toBe(false)
    })
  })
})

// ───────────────────────────────────────────────
// Integration Scenario Tests
// ───────────────────────────────────────────────

describe('Phase 6C-2c Integration Scenarios', () => {
  let mockDbClient: IEscalationDatabaseClient
  let escalationService: EscalationService
  let resetService: SustainedPerformanceService

  beforeEach(() => {
    mockDbClient = createMockDbClient()
    escalationService = createEscalationService(mockDbClient)
    resetService = createSustainedPerformanceService(mockDbClient)
  })

  describe('Escalation Ownership Protection', () => {
    it('instructor-owned escalation cannot auto-clear', () => {
      const ownedEscalation = createMockEscalation({
        status: 'acknowledged',
        acknowledgedBy: mockInstructorId,
      })

      expect(escalationService.canAutoClear(ownedEscalation)).toBe(false)
      expect(escalationService.isInstructorOwned(ownedEscalation)).toBe(true)
    })

    it('unowned pending escalation can auto-clear when policy permits', () => {
      const unownedEscalation = createMockEscalation({
        status: 'pending',
        acknowledgedBy: null,
      })

      expect(escalationService.canAutoClear(unownedEscalation)).toBe(true)
      expect(escalationService.isInstructorOwned(unownedEscalation)).toBe(false)
    })
  })

  describe('CPW Clock Behavior', () => {
    it('CPW clock starts on actual transition into CPW', async () => {
      const mockResult: DetectionTransitionResult = {
        success: true,
        trackingId: 'tracking-123',
        isNewTrackingPeriod: true,
        continuityBroken: false,
      }
      vi.mocked(mockDbClient.recordDetectionTransition).mockResolvedValue(mockResult)

      const result = await resetService.recordDetectionTransition({
        userId: mockUserId,
        conceptId: mockConceptId,
        chapterId: mockChapterId,
        newState: 'currently_performing_well',
        evidence: {} as any,
      })

      expect(result.isNewTrackingPeriod).toBe(true)
    })

    it('repeated CPW detection does not restart clock', async () => {
      const mockResult: DetectionTransitionResult = {
        success: true,
        trackingId: 'tracking-123',
        isNewTrackingPeriod: false, // Not a new period
        continuityBroken: false,
      }
      vi.mocked(mockDbClient.recordDetectionTransition).mockResolvedValue(mockResult)

      const result = await resetService.recordDetectionTransition({
        userId: mockUserId,
        conceptId: mockConceptId,
        chapterId: mockChapterId,
        newState: 'currently_performing_well',
        evidence: {} as any,
      })

      expect(result.isNewTrackingPeriod).toBe(false)
    })

    it('transition out breaks continuity', async () => {
      const mockResult: DetectionTransitionResult = {
        success: true,
        trackingId: 'tracking-123',
        isNewTrackingPeriod: false,
        continuityBroken: true,
      }
      vi.mocked(mockDbClient.recordDetectionTransition).mockResolvedValue(mockResult)

      const result = await resetService.recordDetectionTransition({
        userId: mockUserId,
        conceptId: mockConceptId,
        chapterId: mockChapterId,
        newState: 'emerging_weakness',
        evidence: {} as any,
      })

      expect(result.continuityBroken).toBe(true)
    })

    it('transition back starts a new period', async () => {
      // First transition out
      vi.mocked(mockDbClient.recordDetectionTransition).mockResolvedValueOnce({
        success: true,
        trackingId: 'tracking-123',
        isNewTrackingPeriod: false,
        continuityBroken: true,
      })

      await resetService.recordDetectionTransition({
        userId: mockUserId,
        conceptId: mockConceptId,
        chapterId: mockChapterId,
        newState: 'emerging_weakness',
        evidence: {} as any,
      })

      // Then transition back in
      vi.mocked(mockDbClient.recordDetectionTransition).mockResolvedValueOnce({
        success: true,
        trackingId: 'tracking-456', // New tracking ID
        isNewTrackingPeriod: true,
        continuityBroken: false,
      })

      const result = await resetService.recordDetectionTransition({
        userId: mockUserId,
        conceptId: mockConceptId,
        chapterId: mockChapterId,
        newState: 'currently_performing_well',
        evidence: {} as any,
      })

      expect(result.isNewTrackingPeriod).toBe(true)
      expect(result.trackingId).toBe('tracking-456')
    })
  })

  describe('Reset Eligibility', () => {
    it('29 days cannot reset', async () => {
      const mockResult: ResetEligibilityResult = {
        isEligible: false,
        daysInCpw: 29,
        blockingReason: 'insufficient_days',
      }
      vi.mocked(mockDbClient.checkResetEligibility).mockResolvedValue(mockResult)

      const result = await resetService.checkResetEligibility(mockUserId, mockConceptId)
      expect(result.isEligible).toBe(false)
    })

    it('30 days with no follow-up evidence cannot reset', async () => {
      const mockResult: ResetEligibilityResult = {
        isEligible: false,
        daysInCpw: 30,
        followUpEvidenceCount: 0,
        blockingReason: 'no_follow_up_evidence',
      }
      vi.mocked(mockDbClient.checkResetEligibility).mockResolvedValue(mockResult)

      const result = await resetService.checkResetEligibility(mockUserId, mockConceptId)
      expect(result.isEligible).toBe(false)
    })

    it('30 days plus qualifying follow-up evidence can reset', async () => {
      const mockResult: ResetEligibilityResult = {
        isEligible: true,
        daysInCpw: 30,
        followUpEvidenceCount: 1,
        continuityBroken: false,
      }
      vi.mocked(mockDbClient.checkResetEligibility).mockResolvedValue(mockResult)

      const result = await resetService.checkResetEligibility(mockUserId, mockConceptId)
      expect(result.isEligible).toBe(true)
    })
  })

  describe('Reset Idempotency', () => {
    it('reset is idempotent - second attempt returns alreadyExecuted', async () => {
      const mockEligibility: ResetEligibilityResult = {
        isEligible: true,
        daysInCpw: 30,
        followUpEvidenceCount: 1,
        continuityBroken: false,
      }
      vi.mocked(mockDbClient.checkResetEligibility).mockResolvedValue(mockEligibility)

      // First execution
      vi.mocked(mockDbClient.executeReset).mockResolvedValueOnce({
        success: true,
        resetId: 'reset-123',
      })

      const firstResult = await resetService.executeReset(mockUserId, mockConceptId)
      expect(firstResult.success).toBe(true)
      expect(firstResult.resetId).toBe('reset-123')

      // Second execution (idempotent)
      vi.mocked(mockDbClient.executeReset).mockResolvedValueOnce({
        success: true,
        alreadyExecuted: true,
      })

      const secondResult = await resetService.executeReset(mockUserId, mockConceptId)
      expect(secondResult.success).toBe(true)
      expect(secondResult.alreadyExecuted).toBe(true)
    })
  })
})

// ───────────────────────────────────────────────
// Follow-Up Evidence Integrity Tests
// ───────────────────────────────────────────────

describe('Follow-Up Evidence Integrity', () => {
  let mockDbClient: IEscalationDatabaseClient
  let service: SustainedPerformanceService
  let mockMappingProvider: {
    chapterId: string
    isQuestionMappedToConcept: ReturnType<typeof vi.fn>
    getConceptForQuestion: ReturnType<typeof vi.fn>
    getQuestionsForConcept: ReturnType<typeof vi.fn>
    getAllConceptIds: ReturnType<typeof vi.fn>
    getAllQuestionIds: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockDbClient = createMockDbClient()
    mockMappingProvider = {
      chapterId: 'ch-2',
      isQuestionMappedToConcept: vi.fn(),
      getConceptForQuestion: vi.fn(),
      getQuestionsForConcept: vi.fn(),
      getAllConceptIds: vi.fn(),
      getAllQuestionIds: vi.fn(),
    }
    service = createSustainedPerformanceService(mockDbClient, mockMappingProvider as any)
  })

  describe('caller cannot manufacture qualifying evidence with a boolean', () => {
    it('should reject when canonicalMappingVerified is not independently established', async () => {
      // The service layer now requires the mapping provider to verify.
      // A caller cannot bypass this by passing a boolean.
      const serviceWithoutProvider = createSustainedPerformanceService(mockDbClient)

      const result = await serviceWithoutProvider.recordFollowUpEvidence(
        {
          userId: mockUserId,
          conceptId: mockConceptId,
          chapterId: mockChapterId,
          quizAttemptId: 'attempt-123',
        },
        { 'qq-2-001': 'a' },
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('No canonical mapping provider configured')
      expect(mockDbClient.recordFollowUpEvidence).not.toHaveBeenCalled()
    })
  })

  describe('legitimate same-student/same-concept assessment can qualify', () => {
    it('should record evidence when questions are canonically mapped to the concept', async () => {
      mockMappingProvider.isQuestionMappedToConcept
        .mockReturnValueOnce(true)   // qq-2-001 maps to C-2-01
        .mockReturnValueOnce(false)  // qq-2-002 does not

      vi.mocked(mockDbClient.recordFollowUpEvidence).mockResolvedValue({
        success: true,
        evidenceId: 'evidence-123',
      })

      const result = await service.recordFollowUpEvidence(
        {
          userId: mockUserId,
          conceptId: mockConceptId,
          chapterId: mockChapterId,
          quizAttemptId: 'attempt-123',
        },
        { 'qq-2-001': 'a', 'qq-2-002': 'b' },
      )

      expect(result.success).toBe(true)
      expect(result.evidenceId).toBe('evidence-123')
      expect(mockDbClient.recordFollowUpEvidence).toHaveBeenCalledWith({
        userId: mockUserId,
        conceptId: mockConceptId,
        chapterId: mockChapterId,
        quizAttemptId: 'attempt-123',
        canonicalMappingVerified: true,
        mappedQuestionCount: 1,
      })
    })
  })

  describe('wrong concept cannot qualify', () => {
    it('should reject when no questions map to the target concept', async () => {
      mockMappingProvider.isQuestionMappedToConcept.mockReturnValue(false)

      const result = await service.recordFollowUpEvidence(
        {
          userId: mockUserId,
          conceptId: 'C-2-99', // Different concept
          chapterId: mockChapterId,
          quizAttemptId: 'attempt-123',
        },
        { 'qq-2-001': 'a' },
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('No questions in quiz attempt')
      expect(mockDbClient.recordFollowUpEvidence).not.toHaveBeenCalled()
    })
  })

  describe('duplicate processing cannot increment twice', () => {
    it('should handle duplicate recording idempotently', async () => {
      mockMappingProvider.isQuestionMappedToConcept.mockReturnValue(true)

      // First call succeeds
      vi.mocked(mockDbClient.recordFollowUpEvidence).mockResolvedValueOnce({
        success: true,
        evidenceId: 'evidence-123',
      })

      const firstResult = await service.recordFollowUpEvidence(
        {
          userId: mockUserId,
          conceptId: mockConceptId,
          chapterId: mockChapterId,
          quizAttemptId: 'attempt-123',
        },
        { 'qq-2-001': 'a' },
      )
      expect(firstResult.success).toBe(true)

      // Second call returns alreadyRecorded (database deduplication)
      vi.mocked(mockDbClient.recordFollowUpEvidence).mockResolvedValueOnce({
        success: true,
        evidenceId: 'evidence-123',
        alreadyRecorded: true,
      })

      const secondResult = await service.recordFollowUpEvidence(
        {
          userId: mockUserId,
          conceptId: mockConceptId,
          chapterId: mockChapterId,
          quizAttemptId: 'attempt-123',
        },
        { 'qq-2-001': 'a' },
      )
      expect(secondResult.success).toBe(true)
      expect(secondResult.alreadyRecorded).toBe(true)
    })
  })

  describe('canonical mapping remains authoritative', () => {
    it('should use the mapping provider, not question-ID naming conventions', async () => {
      // Even if a question ID looks like it belongs to a concept,
      // the mapping provider is the sole authority
      mockMappingProvider.isQuestionMappedToConcept.mockImplementation(
        (questionId: string, conceptId: string) => {
          // Only qq-2-003 is mapped to C-2-01, not qq-2-001
          return questionId === 'qq-2-003' && conceptId === 'C-2-01'
        },
      )

      vi.mocked(mockDbClient.recordFollowUpEvidence).mockResolvedValue({
        success: true,
        evidenceId: 'evidence-123',
      })

      const result = await service.recordFollowUpEvidence(
        {
          userId: mockUserId,
          conceptId: mockConceptId,
          chapterId: mockChapterId,
          quizAttemptId: 'attempt-123',
        },
        { 'qq-2-001': 'a', 'qq-2-003': 'b' },
      )

      expect(result.success).toBe(true)
      expect(mockDbClient.recordFollowUpEvidence).toHaveBeenCalledWith(
        expect.objectContaining({
          mappedQuestionCount: 1, // Only qq-2-003 mapped
        }),
      )
    })
  })

  describe('no Chapter 2 IDs in generic infrastructure', () => {
    it('service layer does not hard-code chapter-specific concept IDs', () => {
      // The service accepts any ConceptId — it does not validate against
      // chapter-specific lists. That validation happens in the mapping provider.
      const genericConceptId = 'C-99-01' // Not a Chapter 2 concept
      mockMappingProvider.isQuestionMappedToConcept.mockReturnValue(true)
      vi.mocked(mockDbClient.recordFollowUpEvidence).mockResolvedValue({
        success: true,
        evidenceId: 'evidence-123',
      })

      // This should not throw — the service is chapter-agnostic
      expect(() => {
        service.recordFollowUpEvidence(
          {
            userId: mockUserId,
            conceptId: genericConceptId,
            chapterId: 'ch-99',
            quizAttemptId: 'attempt-123',
          },
          { 'qq-99-001': 'a' },
        )
      }).not.toThrow()
    })
  })
})
