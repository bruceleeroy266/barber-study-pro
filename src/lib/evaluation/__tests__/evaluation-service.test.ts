/**
 * Phase 6C-2d — Evaluation Service Tests (CORRECTED)
 *
 * Comprehensive tests for the evaluation service including:
 * - CORRECTION 1: Evidence authority validation
 * - CORRECTION 2: Pending cycle re-evaluatability
 * - Idempotency and concurrency safety
 * - Integration with escalation logic
 * - Pending/non-escalation behavior
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { EvaluationService, createEvaluationService } from '../evaluation-service'
import type {
  IEvaluationDatabaseClient,
  EvaluateCycleParams,
  EvaluateCycleResult,
  RemediationCycleEvaluation,
  EvidenceValidationResult,
} from '../types'
import type { IConceptDetectionProvider, ConceptDetectionResult } from '../../reassessment/provider-registry'
import type { DetectionState, DetectionConfidence, ConceptEvidence } from '../../chapter-2-concepts/detection'

// ───────────────────────────────────────────────
// Mock Database Client
// ───────────────────────────────────────────────

function createMockDbClient(): IEvaluationDatabaseClient {
  return {
    evaluateCycle: vi.fn(),
    getEvaluation: vi.fn(),
    getTerminalEvaluationByCycleId: vi.fn(),
    getAllEvaluationsByCycleId: vi.fn(),
    isCycleTerminallyEvaluated: vi.fn(),
    getEvaluationByIdempotencyKey: vi.fn(),
    validateEvidence: vi.fn(),
  }
}

function createMockDetectionProvider(): IConceptDetectionProvider {
  return {
    chapterId: 'ch-2',
    detectConceptState: vi.fn(),
  }
}

// ───────────────────────────────────────────────
// Test Fixtures
// ───────────────────────────────────────────────

const mockCycleId = 'cycle-123'
const mockConceptId = 'C-2-01'
const mockUserId = 'user-456'
const mockEvidenceIds = ['attempt-1', 'attempt-2']

function createMockConceptEvidence(overrides: Partial<ConceptEvidence> = {}): ConceptEvidence {
  return {
    conceptId: mockConceptId,
    learningObjectiveId: 'LO-2-1',
    totalObservations: 5,
    uniqueQuestions: 3,
    uniqueQuestionsMissed: 2,
    misses: 3,
    correct: 2,
    missRate: 0.6,
    consecutiveRecentCorrect: 0,
    consecutiveRecentMisses: 2,
    pattern: 'consistent',
    hasHistoricalWeakness: true,
    firstAttemptAt: '2026-08-01T00:00:00Z',
    lastAttemptAt: '2026-08-19T00:00:00Z',
    ...overrides,
  }
}

function createMockEvaluation(overrides: Partial<RemediationCycleEvaluation> = {}): RemediationCycleEvaluation {
  return {
    id: 'evaluation-123',
    cycleId: mockCycleId,
    evaluationConfidence: 'medium',
    evaluationEvidenceIds: mockEvidenceIds,
    evaluationIdempotencyKey: 'cycle-123:repeated_weakness:medium:abc123',
    evaluationVersion: 1,
    detectionState: 'repeated_weakness',
    outcome: 'unsuccessful',
    conceptEvidence: createMockConceptEvidence(),
    evaluatedAt: new Date(),
    createdAt: new Date(),
    ...overrides,
  }
}

function createMockEvidenceValidationResult(
  evidenceId: string,
  isValid: boolean,
  failureReason?: string
): EvidenceValidationResult {
  return {
    evidenceId,
    isValid,
    failureReason,
  }
}

// ───────────────────────────────────────────────
// Evaluation Service Tests
// ───────────────────────────────────────────────

describe('EvaluationService', () => {
  let mockDbClient: IEvaluationDatabaseClient
  let mockDetectionProvider: IConceptDetectionProvider
  let service: EvaluationService

  beforeEach(() => {
    mockDbClient = createMockDbClient()
    mockDetectionProvider = createMockDetectionProvider()
    service = new EvaluationService(mockDbClient, mockDetectionProvider)
  })

  describe('evaluateCycle', () => {
    it('evaluates a cycle with valid parameters', async () => {
      const params: EvaluateCycleParams = {
        cycleId: mockCycleId,
        detectionState: 'repeated_weakness',
        confidence: 'medium',
        conceptEvidence: createMockConceptEvidence(),
        evidenceIds: mockEvidenceIds,
        idempotencyKey: 'test-key',
      }

      const mockResult: EvaluateCycleResult = {
        success: true,
        evaluationId: 'evaluation-123',
        outcome: 'unsuccessful',
        alreadyEvaluated: false,
      }

      vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(mockResult)

      const result = await service.evaluateCycle(params)

      expect(result.success).toBe(true)
      expect(result.evaluationId).toBe('evaluation-123')
      expect(result.outcome).toBe('unsuccessful')
      expect(mockDbClient.evaluateCycle).toHaveBeenCalledWith(params)
    })

    it('rejects invalid detection state', async () => {
      const params: EvaluateCycleParams = {
        cycleId: mockCycleId,
        detectionState: 'invalid_state' as DetectionState,
        confidence: 'medium',
        conceptEvidence: createMockConceptEvidence(),
        evidenceIds: mockEvidenceIds,
        idempotencyKey: 'test-key',
      }

      const result = await service.evaluateCycle(params)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid detection state')
    })

    it('rejects invalid confidence', async () => {
      const params: EvaluateCycleParams = {
        cycleId: mockCycleId,
        detectionState: 'repeated_weakness',
        confidence: 'invalid' as DetectionConfidence,
        conceptEvidence: createMockConceptEvidence(),
        evidenceIds: mockEvidenceIds,
        idempotencyKey: 'test-key',
      }

      const result = await service.evaluateCycle(params)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid confidence level')
    })

    it('generates idempotency key if not provided', async () => {
      const params: EvaluateCycleParams = {
        cycleId: mockCycleId,
        detectionState: 'repeated_weakness',
        confidence: 'medium',
        conceptEvidence: createMockConceptEvidence(),
        evidenceIds: mockEvidenceIds,
        idempotencyKey: '', // Empty - should be generated
      }

      const mockResult: EvaluateCycleResult = {
        success: true,
        evaluationId: 'evaluation-123',
        outcome: 'unsuccessful',
        alreadyEvaluated: false,
      }

      vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(mockResult)

      await service.evaluateCycle(params)

      // Verify the key was generated
      const callArgs = vi.mocked(mockDbClient.evaluateCycle).mock.calls[0][0]
      expect(callArgs.idempotencyKey).toBeTruthy()
      expect(callArgs.idempotencyKey).toContain(mockCycleId)
      expect(callArgs.idempotencyKey).toContain('repeated_weakness')
      expect(callArgs.idempotencyKey).toContain('medium')
    })

    it('handles evidence validation failure (CORRECTION 1)', async () => {
      const params: EvaluateCycleParams = {
        cycleId: mockCycleId,
        detectionState: 'repeated_weakness',
        confidence: 'medium',
        conceptEvidence: createMockConceptEvidence(),
        evidenceIds: mockEvidenceIds,
        idempotencyKey: 'test-key',
      }

      const mockResult: EvaluateCycleResult = {
        success: false,
        error: 'Evidence validation failed: Evidence belongs to different student',
      }

      vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(mockResult)

      const result = await service.evaluateCycle(params)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Evidence validation failed')
    })

    it('handles terminal outcome already exists (CORRECTION 2)', async () => {
      const params: EvaluateCycleParams = {
        cycleId: mockCycleId,
        detectionState: 'currently_performing_well',
        confidence: 'high',
        conceptEvidence: createMockConceptEvidence(),
        evidenceIds: mockEvidenceIds,
        idempotencyKey: 'test-key-2',
      }

      const mockResult: EvaluateCycleResult = {
        success: false,
        error: 'Cycle already has terminal outcome: unsuccessful',
      }

      vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(mockResult)

      const result = await service.evaluateCycle(params)

      expect(result.success).toBe(false)
      expect(result.error).toContain('already has terminal outcome')
    })
  })

  describe('evaluateCycleWithDetection', () => {
    it('evaluates using detection provider', async () => {
      const mockDetectionResult: ConceptDetectionResult = {
        conceptId: mockConceptId,
        state: 'repeated_weakness',
        confidence: 'high',
        evidence: createMockConceptEvidence(),
      }

      vi.mocked(mockDetectionProvider.detectConceptState).mockResolvedValue(mockDetectionResult)

      const mockResult: EvaluateCycleResult = {
        success: true,
        evaluationId: 'evaluation-123',
        outcome: 'unsuccessful',
        alreadyEvaluated: false,
      }

      vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(mockResult)

      const result = await service.evaluateCycleWithDetection(
        mockCycleId,
        mockConceptId,
        mockEvidenceIds
      )

      expect(result.success).toBe(true)
      expect(mockDetectionProvider.detectConceptState).toHaveBeenCalledWith(
        mockConceptId,
        mockEvidenceIds
      )
    })

    it('returns error when no detection provider configured', async () => {
      const serviceWithoutProvider = new EvaluationService(mockDbClient)

      const result = await serviceWithoutProvider.evaluateCycleWithDetection(
        mockCycleId,
        mockConceptId,
        mockEvidenceIds
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('No detection provider configured')
    })

    it('returns error when detection provider returns null', async () => {
      vi.mocked(mockDetectionProvider.detectConceptState).mockResolvedValue(null)

      const result = await service.evaluateCycleWithDetection(
        mockCycleId,
        mockConceptId,
        mockEvidenceIds
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('Detection provider returned no result')
    })
  })

  // CORRECTION 2: New methods for terminal vs pending evaluation
  describe('getTerminalEvaluationByCycleId', () => {
    it('returns terminal evaluation for evaluated cycle', async () => {
      const mockEvaluation = createMockEvaluation({ outcome: 'unsuccessful' })
      vi.mocked(mockDbClient.getTerminalEvaluationByCycleId).mockResolvedValue(mockEvaluation)

      const result = await service.getTerminalEvaluationByCycleId(mockCycleId)

      expect(result).toEqual(mockEvaluation)
      expect(result?.outcome).toBe('unsuccessful')
    })

    it('returns null for cycle with only pending evaluations', async () => {
      vi.mocked(mockDbClient.getTerminalEvaluationByCycleId).mockResolvedValue(null)

      const result = await service.getTerminalEvaluationByCycleId(mockCycleId)

      expect(result).toBeNull()
    })
  })

  describe('getAllEvaluationsByCycleId', () => {
    it('returns all evaluations including pending', async () => {
      const mockPendingEvaluation = createMockEvaluation({
        id: 'evaluation-pending',
        outcome: 'pending',
        detectionState: 'emerging_weakness',
      })
      const mockTerminalEvaluation = createMockEvaluation({
        id: 'evaluation-terminal',
        outcome: 'unsuccessful',
        detectionState: 'repeated_weakness',
      })

      vi.mocked(mockDbClient.getAllEvaluationsByCycleId).mockResolvedValue([
        mockPendingEvaluation,
        mockTerminalEvaluation,
      ])

      const result = await service.getAllEvaluationsByCycleId(mockCycleId)

      expect(result).toHaveLength(2)
      expect(result[0].outcome).toBe('pending')
      expect(result[1].outcome).toBe('unsuccessful')
    })

    it('returns empty array for unevaluated cycle', async () => {
      vi.mocked(mockDbClient.getAllEvaluationsByCycleId).mockResolvedValue([])

      const result = await service.getAllEvaluationsByCycleId(mockCycleId)

      expect(result).toEqual([])
    })
  })

  describe('isCycleTerminallyEvaluated', () => {
    it('returns true for cycle with terminal outcome', async () => {
      vi.mocked(mockDbClient.isCycleTerminallyEvaluated).mockResolvedValue(true)

      const result = await service.isCycleTerminallyEvaluated(mockCycleId)

      expect(result).toBe(true)
    })

    it('returns false for cycle with only pending evaluations', async () => {
      vi.mocked(mockDbClient.isCycleTerminallyEvaluated).mockResolvedValue(false)

      const result = await service.isCycleTerminallyEvaluated(mockCycleId)

      expect(result).toBe(false)
    })
  })

  // CORRECTION 1: Evidence validation
  describe('validateEvidence', () => {
    it('validates evidence items against authoritative persisted data', async () => {
      const mockValidationResults: EvidenceValidationResult[] = [
        createMockEvidenceValidationResult('attempt-1', true),
        createMockEvidenceValidationResult('attempt-2', true),
      ]

      vi.mocked(mockDbClient.validateEvidence).mockResolvedValue(mockValidationResults)

      const result = await service.validateEvidence(mockCycleId, mockEvidenceIds)

      expect(result).toHaveLength(2)
      expect(result[0].isValid).toBe(true)
      expect(result[1].isValid).toBe(true)
      expect(mockDbClient.validateEvidence).toHaveBeenCalledWith(mockCycleId, mockEvidenceIds)
    })

    it('returns validation failures for invalid evidence', async () => {
      const mockValidationResults: EvidenceValidationResult[] = [
        createMockEvidenceValidationResult('attempt-1', true),
        createMockEvidenceValidationResult('attempt-2', false, 'Evidence belongs to different student'),
      ]

      vi.mocked(mockDbClient.validateEvidence).mockResolvedValue(mockValidationResults)

      const result = await service.validateEvidence(mockCycleId, mockEvidenceIds)

      expect(result).toHaveLength(2)
      expect(result[0].isValid).toBe(true)
      expect(result[1].isValid).toBe(false)
      expect(result[1].failureReason).toContain('different student')
    })
  })

  describe('validateOutcomeLegitimacy', () => {
    it('validates unsuccessful only from repeated_weakness', () => {
      expect(service.validateOutcomeLegitimacy('unsuccessful', 'repeated_weakness')).toBe(true)
      expect(service.validateOutcomeLegitimacy('unsuccessful', 'emerging_weakness')).toBe(false)
      expect(service.validateOutcomeLegitimacy('unsuccessful', 'currently_performing_well')).toBe(false)
    })

    it('validates successful only from currently_performing_well', () => {
      expect(service.validateOutcomeLegitimacy('successful', 'currently_performing_well')).toBe(true)
      expect(service.validateOutcomeLegitimacy('successful', 'repeated_weakness')).toBe(false)
      expect(service.validateOutcomeLegitimacy('successful', 'improving')).toBe(false)
    })

    it('validates pending from non-terminal states', () => {
      expect(service.validateOutcomeLegitimacy('pending', 'insufficient_evidence')).toBe(true)
      expect(service.validateOutcomeLegitimacy('pending', 'emerging_weakness')).toBe(true)
      expect(service.validateOutcomeLegitimacy('pending', 'improving')).toBe(true)
    })
  })
})

// ───────────────────────────────────────────────
// CORRECTION 2: Pending Cycle Re-evaluatability Tests
// ───────────────────────────────────────────────

describe('CORRECTION 2: Pending Cycle Re-evaluatability', () => {
  let mockDbClient: IEvaluationDatabaseClient
  let service: EvaluationService

  beforeEach(() => {
    mockDbClient = createMockDbClient()
    service = new EvaluationService(mockDbClient)
  })

  it('pending → additional legitimate evidence → pending again', async () => {
    // First pending evaluation
    const firstPendingResult: EvaluateCycleResult = {
      success: true,
      evaluationId: 'evaluation-pending-1',
      outcome: 'pending',
      alreadyEvaluated: false,
    }

    // Second pending evaluation with different evidence
    const secondPendingResult: EvaluateCycleResult = {
      success: true,
      evaluationId: 'evaluation-pending-2',
      outcome: 'pending',
      alreadyEvaluated: false,
    }

    vi.mocked(mockDbClient.evaluateCycle)
      .mockResolvedValueOnce(firstPendingResult)
      .mockResolvedValueOnce(secondPendingResult)

    // First evaluation
    const result1 = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'emerging_weakness',
      confidence: 'low',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['attempt-1'],
      idempotencyKey: 'key-1',
    })

    // Second evaluation with different evidence
    const result2 = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'insufficient_evidence',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['attempt-2'],
      idempotencyKey: 'key-2',
    })

    expect(result1.success).toBe(true)
    expect(result1.outcome).toBe('pending')
    expect(result2.success).toBe(true)
    expect(result2.outcome).toBe('pending')
    expect(result2.evaluationId).not.toBe(result1.evaluationId)
  })

  it('pending → additional legitimate evidence → successful', async () => {
    // First pending evaluation
    const pendingResult: EvaluateCycleResult = {
      success: true,
      evaluationId: 'evaluation-pending',
      outcome: 'pending',
      alreadyEvaluated: false,
    }

    // Then successful evaluation with new evidence
    const successfulResult: EvaluateCycleResult = {
      success: true,
      evaluationId: 'evaluation-successful',
      outcome: 'successful',
      alreadyEvaluated: false,
    }

    vi.mocked(mockDbClient.evaluateCycle)
      .mockResolvedValueOnce(pendingResult)
      .mockResolvedValueOnce(successfulResult)

    // First evaluation (pending)
    const result1 = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'improving',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['attempt-1'],
      idempotencyKey: 'key-1',
    })

    // Second evaluation (successful) with different evidence
    const result2 = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'currently_performing_well',
      confidence: 'high',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['attempt-2', 'attempt-3'],
      idempotencyKey: 'key-2',
    })

    expect(result1.outcome).toBe('pending')
    expect(result2.outcome).toBe('successful')
  })

  it('pending → additional legitimate evidence → unsuccessful', async () => {
    // First pending evaluation
    const pendingResult: EvaluateCycleResult = {
      success: true,
      evaluationId: 'evaluation-pending',
      outcome: 'pending',
      alreadyEvaluated: false,
    }

    // Then unsuccessful evaluation with new evidence
    const unsuccessfulResult: EvaluateCycleResult = {
      success: true,
      evaluationId: 'evaluation-unsuccessful',
      outcome: 'unsuccessful',
      alreadyEvaluated: false,
    }

    vi.mocked(mockDbClient.evaluateCycle)
      .mockResolvedValueOnce(pendingResult)
      .mockResolvedValueOnce(unsuccessfulResult)

    // First evaluation (pending)
    const result1 = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'emerging_weakness',
      confidence: 'low',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['attempt-1'],
      idempotencyKey: 'key-1',
    })

    // Second evaluation (unsuccessful) with different evidence
    const result2 = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'high',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['attempt-2', 'attempt-3'],
      idempotencyKey: 'key-2',
    })

    expect(result1.outcome).toBe('pending')
    expect(result2.outcome).toBe('unsuccessful')
  })

  it('repeated identical pending evaluation is idempotent', async () => {
    const idempotencyKey = 'cycle-123:emerging_weakness:medium:abc123'

    // First call creates evaluation
    vi.mocked(mockDbClient.evaluateCycle)
      .mockResolvedValueOnce({
        success: true,
        evaluationId: 'evaluation-123',
        outcome: 'pending',
        alreadyEvaluated: false,
      })
      // Second call returns existing (idempotent)
      .mockResolvedValueOnce({
        success: true,
        evaluationId: 'evaluation-123',
        outcome: 'pending',
        alreadyEvaluated: true,
      })

    const params: EvaluateCycleParams = {
      cycleId: mockCycleId,
      detectionState: 'emerging_weakness',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: mockEvidenceIds,
      idempotencyKey,
    }

    // First call
    const result1 = await service.evaluateCycle(params)
    // Second call with same key
    const result2 = await service.evaluateCycle(params)

    expect(result1.success).toBe(true)
    expect(result1.alreadyEvaluated).toBe(false)
    expect(result2.success).toBe(true)
    expect(result2.alreadyEvaluated).toBe(true)
    expect(result2.evaluationId).toBe(result1.evaluationId)
  })

  it('multiple pending evaluations remain auditable', async () => {
    const pendingEval1 = createMockEvaluation({
      id: 'evaluation-pending-1',
      outcome: 'pending',
      detectionState: 'emerging_weakness',
      evaluatedAt: new Date('2026-08-19T10:00:00Z'),
    })
    const pendingEval2 = createMockEvaluation({
      id: 'evaluation-pending-2',
      outcome: 'pending',
      detectionState: 'insufficient_evidence',
      evaluatedAt: new Date('2026-08-19T11:00:00Z'),
    })

    vi.mocked(mockDbClient.getAllEvaluationsByCycleId).mockResolvedValue([
      pendingEval1,
      pendingEval2,
    ])

    const result = await service.getAllEvaluationsByCycleId(mockCycleId)

    expect(result).toHaveLength(2)
    expect(result[0].outcome).toBe('pending')
    expect(result[1].outcome).toBe('pending')
    // Both should be preserved for auditability
    expect(result[0].id).not.toBe(result[1].id)
  })

  it('only one terminal evaluation can exist', async () => {
    // Simulate database-level protection against two terminal evaluations
    const terminalResult: EvaluateCycleResult = {
      success: false,
      error: 'Cycle already has terminal outcome: unsuccessful',
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(terminalResult)

    // Try to evaluate a cycle that already has terminal outcome
    const result = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'currently_performing_well',
      confidence: 'high',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['attempt-3'],
      idempotencyKey: 'key-3',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('already has terminal outcome')
  })

  it('evaluation after terminal successful is rejected/no-op', async () => {
    const terminalResult: EvaluateCycleResult = {
      success: false,
      error: 'Cycle already has terminal outcome: successful',
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(terminalResult)

    const result = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'high',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['attempt-3'],
      idempotencyKey: 'key-3',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('already has terminal outcome')
  })

  it('evaluation after terminal unsuccessful is rejected/no-op', async () => {
    const terminalResult: EvaluateCycleResult = {
      success: false,
      error: 'Cycle already has terminal outcome: unsuccessful',
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(terminalResult)

    const result = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'currently_performing_well',
      confidence: 'high',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['attempt-3'],
      idempotencyKey: 'key-3',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('already has terminal outcome')
  })
})

// ───────────────────────────────────────────────
// CORRECTION 1: Evidence Validation Tests
// ───────────────────────────────────────────────

describe('CORRECTION 1: Evidence Validation', () => {
  let mockDbClient: IEvaluationDatabaseClient
  let service: EvaluationService

  beforeEach(() => {
    mockDbClient = createMockDbClient()
    service = new EvaluationService(mockDbClient)
  })

  it('fabricated evidence ID rejected', async () => {
    const validationResult: EvaluateCycleResult = {
      success: false,
      error: 'Evidence validation failed: Evidence item not found in quiz_attempts: fake-attempt-id',
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(validationResult)

    const result = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['fake-attempt-id'],
      idempotencyKey: 'key-1',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('not found in quiz_attempts')
  })

  it('another student\'s evidence rejected', async () => {
    const validationResult: EvaluateCycleResult = {
      success: false,
      error: 'Evidence validation failed: Evidence belongs to different student',
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(validationResult)

    const result = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['other-student-attempt'],
      idempotencyKey: 'key-1',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('different student')
  })

  it('another cycle\'s evidence rejected', async () => {
    const validationResult: EvaluateCycleResult = {
      success: false,
      error: 'Evidence validation failed: Reassessment evidence belongs to different cycle',
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(validationResult)

    const result = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['other-cycle-attempt'],
      idempotencyKey: 'key-1',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('different cycle')
  })

  it('incomplete/non-legitimate assessment evidence rejected', async () => {
    const validationResult: EvaluateCycleResult = {
      success: false,
      error: 'Evidence validation failed: Evidence is not a completed assessment',
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(validationResult)

    const result = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['incomplete-attempt'],
      idempotencyKey: 'key-1',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('not a completed assessment')
  })

  it('concept mismatch rejected', async () => {
    const validationResult: EvaluateCycleResult = {
      success: false,
      error: 'Evidence validation failed: Reassessment target_concept_id mismatch',
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(validationResult)

    const result = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['wrong-concept-attempt'],
      idempotencyKey: 'key-1',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('target_concept_id mismatch')
  })

  it('legitimate reassessment evidence accepted', async () => {
    const successResult: EvaluateCycleResult = {
      success: true,
      evaluationId: 'evaluation-123',
      outcome: 'unsuccessful',
      alreadyEvaluated: false,
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(successResult)

    const result = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'high',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: ['legitimate-attempt-1', 'legitimate-attempt-2'],
      idempotencyKey: 'key-1',
    })

    expect(result.success).toBe(true)
    expect(result.outcome).toBe('unsuccessful')
  })
})

// ───────────────────────────────────────────────
// Escalation Behavior Tests (CORRECTION 2)
// ───────────────────────────────────────────────

describe('Escalation Behavior (CORRECTION 2)', () => {
  let mockDbClient: IEvaluationDatabaseClient
  let service: EvaluationService

  beforeEach(() => {
    mockDbClient = createMockDbClient()
    service = new EvaluationService(mockDbClient)
  })

  it('pending evaluations never contribute to escalation', async () => {
    // Pending outcome should not trigger escalation
    const pendingResult: EvaluateCycleResult = {
      success: true,
      evaluationId: 'evaluation-pending',
      outcome: 'pending',
      alreadyEvaluated: false,
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(pendingResult)

    const result = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'emerging_weakness',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: mockEvidenceIds,
      idempotencyKey: 'key-1',
    })

    expect(result.success).toBe(true)
    expect(result.outcome).toBe('pending')
    // Escalation logic is in the database function, but we verify
    // that pending outcomes are returned correctly
  })

  it('two legitimate unsuccessful cycles, not evaluations, trigger escalation', async () => {
    // This is tested at the database level, but we verify the service
    // correctly passes unsuccessful outcomes
    const unsuccessfulResult: EvaluateCycleResult = {
      success: true,
      evaluationId: 'evaluation-unsuccessful',
      outcome: 'unsuccessful',
      alreadyEvaluated: false,
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(unsuccessfulResult)

    const result = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'high',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: mockEvidenceIds,
      idempotencyKey: 'key-1',
    })

    expect(result.success).toBe(true)
    expect(result.outcome).toBe('unsuccessful')
  })
})

// ───────────────────────────────────────────────
// Idempotency and Concurrency Tests
// ───────────────────────────────────────────────

describe('Idempotency and Concurrency Safety', () => {
  let mockDbClient: IEvaluationDatabaseClient
  let service: EvaluationService

  beforeEach(() => {
    mockDbClient = createMockDbClient()
    service = new EvaluationService(mockDbClient)
  })

  it('handles idempotent evaluation (already evaluated)', async () => {
    const mockResult: EvaluateCycleResult = {
      success: true,
      evaluationId: 'evaluation-123',
      outcome: 'unsuccessful',
      alreadyEvaluated: true,
    }

    vi.mocked(mockDbClient.evaluateCycle).mockResolvedValue(mockResult)

    const params: EvaluateCycleParams = {
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: mockEvidenceIds,
      idempotencyKey: 'test-key',
    }

    const result = await service.evaluateCycle(params)

    expect(result.success).toBe(true)
    expect(result.alreadyEvaluated).toBe(true)
  })

  it('same idempotency key produces same result', async () => {
    const idempotencyKey = 'cycle-123:repeated_weakness:medium:abc123'

    // Mock evaluateCycle to return success with alreadyEvaluated for second call
    vi.mocked(mockDbClient.evaluateCycle)
      .mockResolvedValueOnce({
        success: true,
        evaluationId: 'evaluation-123',
        outcome: 'unsuccessful',
        alreadyEvaluated: false,
      })
      .mockResolvedValueOnce({
        success: true,
        evaluationId: 'evaluation-123',
        outcome: 'unsuccessful',
        alreadyEvaluated: true,
      })

    // First call
    const result1 = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: mockEvidenceIds,
      idempotencyKey,
    })

    // Second call with same key
    const result2 = await service.evaluateCycle({
      cycleId: mockCycleId,
      detectionState: 'repeated_weakness',
      confidence: 'medium',
      conceptEvidence: createMockConceptEvidence(),
      evidenceIds: mockEvidenceIds,
      idempotencyKey,
    })

    // Both should succeed (idempotent)
    expect(result1.success).toBe(true)
    expect(result2.success).toBe(true)
    expect(result2.alreadyEvaluated).toBe(true)
  })

  it('concurrent terminal evaluation safety', async () => {
    // Simulate concurrent requests where one wins and the other gets idempotent return
    const idempotencyKey = 'cycle-123:repeated_weakness:high:xyz789'

    vi.mocked(mockDbClient.evaluateCycle)
      .mockResolvedValueOnce({
        success: true,
        evaluationId: 'evaluation-123',
        outcome: 'unsuccessful',
        alreadyEvaluated: false,
      })
      .mockResolvedValueOnce({
        success: true,
        evaluationId: 'evaluation-123',
        outcome: 'unsuccessful',
        alreadyEvaluated: true,
      })

    // Simulate concurrent calls
    const [result1, result2] = await Promise.all([
      service.evaluateCycle({
        cycleId: mockCycleId,
        detectionState: 'repeated_weakness',
        confidence: 'high',
        conceptEvidence: createMockConceptEvidence(),
        evidenceIds: mockEvidenceIds,
        idempotencyKey,
      }),
      service.evaluateCycle({
        cycleId: mockCycleId,
        detectionState: 'repeated_weakness',
        confidence: 'high',
        conceptEvidence: createMockConceptEvidence(),
        evidenceIds: mockEvidenceIds,
        idempotencyKey,
      }),
    ])

    // Both should succeed, one as new, one as idempotent
    expect(result1.success).toBe(true)
    expect(result2.success).toBe(true)
    // At least one should be idempotent
    expect(result1.alreadyEvaluated || result2.alreadyEvaluated).toBe(true)
  })
})

// ───────────────────────────────────────────────
// Factory Function Tests
// ───────────────────────────────────────────────

describe('createEvaluationService', () => {
  it('creates service with database client', () => {
    const mockDbClient = createMockDbClient()
    const service = createEvaluationService(mockDbClient)

    expect(service).toBeInstanceOf(EvaluationService)
  })

  it('creates service with optional detection provider', () => {
    const mockDbClient = createMockDbClient()
    const mockProvider = createMockDetectionProvider()
    const service = createEvaluationService(mockDbClient, mockProvider)

    expect(service).toBeInstanceOf(EvaluationService)
  })
})
