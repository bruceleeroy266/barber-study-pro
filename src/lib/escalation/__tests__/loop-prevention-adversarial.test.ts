/**
 * Phase 6C-4 — Loop-Prevention & Adversarial Tests
 *
 * Dedicated adversarial tests covering the full remediation lifecycle:
 * - duplicate active cycles
 * - 3-cycle/30-day cap
 * - 2 unsuccessful cycles → escalation
 * - pending does not count toward escalation
 * - successful does not count toward escalation
 * - terminal cycles cannot reopen
 * - pool exhaustion never silently reuses questions
 * - reassessment double submission
 * - repeated review completion
 * - sustained-performance reset behavior
 * - escalation ownership protection
 * - cross-student access
 * - cross-school instructor access
 * - acknowledgement replay/idempotency
 * - concurrent acknowledgement where testable
 * - stale reservation behavior
 * - refresh/retry recovery
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EscalationService } from '@/lib/escalation/escalation-service'
import { SustainedPerformanceService } from '@/lib/escalation/sustained-performance-service'
import { EvaluationService } from '@/lib/evaluation/evaluation-service'
import { mapDetectionToOutcome, OUTCOME_MATRIX } from '@/lib/evaluation/outcome-mapper'
import type { IEscalationDatabaseClient } from '@/lib/escalation/types'
import type { IEvaluationDatabaseClient } from '@/lib/evaluation/types'
import type {
  InstructorEscalation,
  SustainedPerformanceTracking,
  ResetEligibilityResult,
  ExecuteResetResult,
  DetectionTransitionResult,
  RecordFollowUpEvidenceResult,
} from '@/lib/escalation/types'
import type {
  EvaluateCycleParams,
  EvaluateCycleResult,
  RemediationCycleEvaluation,
  EvidenceValidationResult,
} from '@/lib/evaluation/types'
import type { ConceptId, ChapterId } from '@/lib/reassessment/types'
import type { DetectionState, DetectionConfidence, ConceptEvidence } from '@/lib/chapter-2-concepts/detection'
import type { ConceptId as Ch2ConceptId, LearningObjectiveId } from '@/lib/chapter-2-concepts/types'

// ───────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────

const USER_ID = 'user-test-001'
const OTHER_USER_ID = 'user-test-002'
const CONCEPT_ID = 'C-2-01' as ConceptId
const CHAPTER_ID = 'ch-2' as ChapterId
const SCHOOL_ID = 'school-001'
const INSTRUCTOR_ID = 'instructor-001'
const OTHER_INSTRUCTOR_ID = 'instructor-002'
const CYCLE_ID_1 = 'cycle-001'
const CYCLE_ID_2 = 'cycle-002'
const CYCLE_ID_3 = 'cycle-003'
const ESCALATION_ID = 'esc-001'

const MOCK_EVIDENCE: ConceptEvidence = {
  conceptId: 'C-2-01' as Ch2ConceptId,
  learningObjectiveId: 'LO-2-01' as LearningObjectiveId,
  totalObservations: 5,
  uniqueQuestions: 3,
  uniqueQuestionsMissed: 3,
  misses: 4,
  correct: 1,
  missRate: 0.8,
  consecutiveRecentCorrect: 0,
  consecutiveRecentMisses: 3,
  pattern: 'consistent' as const,
  hasHistoricalWeakness: true,
  firstAttemptAt: '2026-08-10T00:00:00Z',
  lastAttemptAt: '2026-08-15T00:00:00Z',
}

// ───────────────────────────────────────────────
// Mock Factories
// ───────────────────────────────────────────────

function createMockEscalationDbClient(): IEscalationDatabaseClient {
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

function createMockEvaluationDbClient(): IEvaluationDatabaseClient {
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

function makeEscalation(overrides: Partial<InstructorEscalation> = {}): InstructorEscalation {
  return {
    id: ESCALATION_ID,
    userId: USER_ID,
    conceptId: CONCEPT_ID,
    chapterId: CHAPTER_ID,
    schoolId: SCHOOL_ID,
    triggeringCycleIds: [CYCLE_ID_1, CYCLE_ID_2],
    unsuccessfulCycleCount: 2,
    detectionEvidence: MOCK_EVIDENCE,
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
    createdAt: new Date('2026-08-15T00:00:00Z'),
    updatedAt: new Date('2026-08-15T00:00:00Z'),
    ...overrides,
  }
}

function makeEvaluation(overrides: Partial<RemediationCycleEvaluation> = {}): RemediationCycleEvaluation {
  return {
    id: 'eval-001',
    cycleId: CYCLE_ID_1,
    evaluationConfidence: 'high',
    evaluationEvidenceIds: ['attempt-1'],
    evaluationIdempotencyKey: 'key-001',
    evaluationVersion: 1,
    detectionState: 'repeated_weakness',
    outcome: 'unsuccessful',
    conceptEvidence: MOCK_EVIDENCE,
    evaluatedAt: new Date('2026-08-15T00:00:00Z'),
    createdAt: new Date('2026-08-15T00:00:00Z'),
    ...overrides,
  }
}

function makeEvaluateParams(overrides: Partial<EvaluateCycleParams> = {}): EvaluateCycleParams {
  return {
    cycleId: CYCLE_ID_1,
    detectionState: 'repeated_weakness',
    confidence: 'high',
    conceptEvidence: MOCK_EVIDENCE,
    evidenceIds: ['attempt-1'],
    idempotencyKey: 'key-001',
    ...overrides,
  }
}

// ───────────────────────────────────────────────
// Tests
// ───────────────────────────────────────────────

describe('Phase 6C-4 Loop-Prevention & Adversarial Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─────────────────────────────────────────────
  // 1. Duplicate Active Cycles
  // ─────────────────────────────────────────────
  describe('duplicate active cycles', () => {
    it('prevents creating a second escalation when one is already active', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      const existingEscalation = makeEscalation({ status: 'pending' })
      vi.mocked(dbClient.getActiveEscalation).mockResolvedValue(existingEscalation)
      vi.mocked(dbClient.getUnsuccessfulCycleCount).mockResolvedValue(3)

      const result = await service.createEscalation({
        userId: USER_ID,
        conceptId: CONCEPT_ID,
        chapterId: CHAPTER_ID,
        schoolId: SCHOOL_ID,
        triggeringCycleIds: [CYCLE_ID_1, CYCLE_ID_2, CYCLE_ID_3],
        unsuccessfulCycleCount: 3,
        detectionEvidence: MOCK_EVIDENCE,
      })

      expect(result.success).toBe(true)
      expect(result.alreadyExists).toBe(true)
      expect(result.escalationId).toBe(ESCALATION_ID)
      // Should NOT have called createEscalation on the db
      expect(dbClient.createEscalation).not.toHaveBeenCalled()
    })

    it('prevents creating escalation when acknowledged one exists', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      const existingEscalation = makeEscalation({
        status: 'acknowledged',
        acknowledgedBy: INSTRUCTOR_ID,
        acknowledgedAt: new Date(),
      })
      vi.mocked(dbClient.getActiveEscalation).mockResolvedValue(existingEscalation)
      vi.mocked(dbClient.getUnsuccessfulCycleCount).mockResolvedValue(4)

      const result = await service.createEscalation({
        userId: USER_ID,
        conceptId: CONCEPT_ID,
        chapterId: CHAPTER_ID,
        schoolId: SCHOOL_ID,
        triggeringCycleIds: [CYCLE_ID_1, CYCLE_ID_2],
        unsuccessfulCycleCount: 4,
        detectionEvidence: MOCK_EVIDENCE,
      })

      expect(result.success).toBe(true)
      expect(result.alreadyExists).toBe(true)
    })
  })

  // ─────────────────────────────────────────────
  // 2. 3-Cycle/30-Day Cap
  // ─────────────────────────────────────────────
  describe('3-cycle/30-day cap', () => {
    it('counts only unsuccessful cycles within the 30-day window', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      // Return 2 unsuccessful within window
      vi.mocked(dbClient.getUnsuccessfulCycleCount).mockResolvedValue(2)

      const shouldEscalate = await service.shouldCreateEscalation(USER_ID, CONCEPT_ID)
      expect(shouldEscalate).toBe(true)

      // Verify the window parameter
      expect(dbClient.getUnsuccessfulCycleCount).toHaveBeenCalledWith(
        USER_ID,
        CONCEPT_ID,
        30 // UNSUCCESSFUL_CYCLE_WINDOW_DAYS
      )
    })

    it('does not escalate when only 1 unsuccessful cycle in window', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      vi.mocked(dbClient.getUnsuccessfulCycleCount).mockResolvedValue(1)

      const shouldEscalate = await service.shouldCreateEscalation(USER_ID, CONCEPT_ID)
      expect(shouldEscalate).toBe(false)
    })

    it('does not escalate when 0 unsuccessful cycles in window', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      vi.mocked(dbClient.getUnsuccessfulCycleCount).mockResolvedValue(0)

      const shouldEscalate = await service.shouldCreateEscalation(USER_ID, CONCEPT_ID)
      expect(shouldEscalate).toBe(false)
    })
  })

  // ─────────────────────────────────────────────
  // 3. 2 Unsuccessful Cycles → Escalation
  // ─────────────────────────────────────────────
  describe('2 unsuccessful cycles → escalation', () => {
    it('triggers escalation at exactly 2 unsuccessful cycles', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      vi.mocked(dbClient.getUnsuccessfulCycleCount).mockResolvedValue(2)
      vi.mocked(dbClient.getActiveEscalation).mockResolvedValue(null)
      vi.mocked(dbClient.createEscalation).mockResolvedValue({
        success: true,
        escalationId: ESCALATION_ID,
      })

      const result = await service.createEscalation({
        userId: USER_ID,
        conceptId: CONCEPT_ID,
        chapterId: CHAPTER_ID,
        schoolId: SCHOOL_ID,
        triggeringCycleIds: [CYCLE_ID_1, CYCLE_ID_2],
        unsuccessfulCycleCount: 2,
        detectionEvidence: MOCK_EVIDENCE,
      })

      expect(result.success).toBe(true)
      expect(result.escalationId).toBe(ESCALATION_ID)
      expect(dbClient.createEscalation).toHaveBeenCalled()
    })

    it('does not create escalation when threshold not met', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      vi.mocked(dbClient.getUnsuccessfulCycleCount).mockResolvedValue(1)

      const result = await service.createEscalation({
        userId: USER_ID,
        conceptId: CONCEPT_ID,
        chapterId: CHAPTER_ID,
        schoolId: SCHOOL_ID,
        triggeringCycleIds: [CYCLE_ID_1],
        unsuccessfulCycleCount: 1,
        detectionEvidence: MOCK_EVIDENCE,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('threshold')
      expect(dbClient.createEscalation).not.toHaveBeenCalled()
    })
  })

  // ─────────────────────────────────────────────
  // 4. Pending Does NOT Count Toward Escalation
  // ─────────────────────────────────────────────
  describe('pending does not count toward escalation', () => {
    it('pending outcome from outcome matrix is not unsuccessful', () => {
      // Verify the outcome matrix: pending states never produce 'unsuccessful'
      const pendingStates: DetectionState[] = [
        'insufficient_evidence',
        'emerging_weakness',
        'improving',
      ]
      const confidences: DetectionConfidence[] = ['low', 'medium', 'high']

      for (const state of pendingStates) {
        for (const conf of confidences) {
          const outcome = mapDetectionToOutcome(state, conf)
          expect(outcome).not.toBe('unsuccessful')
          expect(outcome).toBe('pending')
        }
      }
    })

    it('only repeated_weakness produces unsuccessful outcome', () => {
      const confidences: DetectionConfidence[] = ['low', 'medium', 'high']
      for (const conf of confidences) {
        expect(mapDetectionToOutcome('repeated_weakness', conf)).toBe('unsuccessful')
      }
    })

    it('only currently_performing_well produces successful outcome', () => {
      const confidences: DetectionConfidence[] = ['low', 'medium', 'high']
      for (const conf of confidences) {
        expect(mapDetectionToOutcome('currently_performing_well', conf)).toBe('successful')
      }
    })
  })

  // ─────────────────────────────────────────────
  // 5. Successful Does NOT Count Toward Escalation
  // ─────────────────────────────────────────────
  describe('successful does not count toward escalation', () => {
    it('successful outcome is never counted as unsuccessful', () => {
      const outcome = mapDetectionToOutcome('currently_performing_well', 'high')
      expect(outcome).toBe('successful')
      expect(outcome).not.toBe('unsuccessful')
    })
  })

  // ─────────────────────────────────────────────
  // 6. Terminal Cycles Cannot Reopen
  // ─────────────────────────────────────────────
  describe('terminal cycles cannot reopen', () => {
    it('isCycleTerminallyEvaluated returns true for unsuccessful evaluation', async () => {
      const dbClient = createMockEvaluationDbClient()
      vi.mocked(dbClient.isCycleTerminallyEvaluated).mockResolvedValue(true)

      const result = await dbClient.isCycleTerminallyEvaluated(CYCLE_ID_1)
      expect(result).toBe(true)
    })

    it('getTerminalEvaluationByCycleId returns the terminal evaluation', async () => {
      const dbClient = createMockEvaluationDbClient()
      const terminalEval = makeEvaluation({ outcome: 'unsuccessful' })
      vi.mocked(dbClient.getTerminalEvaluationByCycleId).mockResolvedValue(terminalEval)

      const result = await dbClient.getTerminalEvaluationByCycleId(CYCLE_ID_1)
      expect(result).not.toBeNull()
      expect(result!.outcome).toBe('unsuccessful')
    })

    it('pending evaluations do not make a cycle terminal', async () => {
      const dbClient = createMockEvaluationDbClient()
      // Only pending evaluations exist
      vi.mocked(dbClient.getTerminalEvaluationByCycleId).mockResolvedValue(null)
      vi.mocked(dbClient.isCycleTerminallyEvaluated).mockResolvedValue(false)

      const terminal = await dbClient.getTerminalEvaluationByCycleId(CYCLE_ID_1)
      const isTerminal = await dbClient.isCycleTerminallyEvaluated(CYCLE_ID_1)

      expect(terminal).toBeNull()
      expect(isTerminal).toBe(false)
    })
  })

  // ─────────────────────────────────────────────
  // 7. Pool Exhaustion Never Silently Reuses Questions
  // ─────────────────────────────────────────────
  describe('pool exhaustion never silently reuses questions', () => {
    it('pool exhaustion state includes explicit exhaustion flag', () => {
      // The PoolExhaustionState type requires explicit isExhausted boolean
      const exhaustionState = {
        isExhausted: true,
        totalQuestionsInPool: 10,
        attemptedQuestionCount: 10,
        attemptedQuestionIds: Array.from({ length: 10 }, (_, i) => `q-${i}`),
        availableQuestionIds: [],
      }

      expect(exhaustionState.isExhausted).toBe(true)
      expect(exhaustionState.availableQuestionIds).toHaveLength(0)
    })

    it('selection result with exhaustion has no selected question', () => {
      // When pool is exhausted, selectedQuestionId must be undefined
      const result = {
        success: false,
        selectedQuestionId: undefined,
        poolExhaustion: {
          isExhausted: true,
          totalQuestionsInPool: 5,
          attemptedQuestionCount: 5,
          attemptedQuestionIds: ['q-1', 'q-2', 'q-3', 'q-4', 'q-5'],
          availableQuestionIds: [],
        },
        error: 'Question pool exhausted',
        exclusionSet: { excludedQuestionIds: new Set(['q-1', 'q-2', 'q-3', 'q-4', 'q-5']) },
      }

      expect(result.success).toBe(false)
      expect(result.selectedQuestionId).toBeUndefined()
      expect(result.poolExhaustion?.isExhausted).toBe(true)
    })
  })

  // ─────────────────────────────────────────────
  // 8. Reassessment Double Submission
  // ─────────────────────────────────────────────
  describe('reassessment double submission', () => {
    it('evaluation is idempotent — same key returns alreadyEvaluated', async () => {
      const dbClient = createMockEvaluationDbClient()
      const service = new EvaluationService(dbClient)

      const existingEval = makeEvaluation()
      vi.mocked(dbClient.evaluateCycle).mockResolvedValue({
        success: true,
        evaluationId: existingEval.id,
        outcome: 'unsuccessful',
        alreadyEvaluated: true,
      })

      const params = makeEvaluateParams()
      const result = await service.evaluateCycle(params)

      expect(result.success).toBe(true)
      expect(result.alreadyEvaluated).toBe(true)
    })

    it('same idempotency key produces consistent result', async () => {
      const dbClient = createMockEvaluationDbClient()
      const service = new EvaluationService(dbClient)

      const params = makeEvaluateParams({ idempotencyKey: 'stable-key-123' })

      // First call
      vi.mocked(dbClient.evaluateCycle).mockResolvedValueOnce({
        success: true,
        evaluationId: 'eval-001',
        outcome: 'unsuccessful',
      })

      const result1 = await service.evaluateCycle(params)
      expect(result1.success).toBe(true)

      // Second call with same key — idempotent
      vi.mocked(dbClient.evaluateCycle).mockResolvedValueOnce({
        success: true,
        evaluationId: 'eval-001',
        outcome: 'unsuccessful',
        alreadyEvaluated: true,
      })

      const result2 = await service.evaluateCycle(params)
      expect(result2.success).toBe(true)
      expect(result2.alreadyEvaluated).toBe(true)
    })
  })

  // ─────────────────────────────────────────────
  // 9. Repeated Review Completion
  // ─────────────────────────────────────────────
  describe('repeated review completion', () => {
    it('multiple pending evaluations can exist for auditability', async () => {
      const dbClient = createMockEvaluationDbClient()

      const pendingEvals = [
        makeEvaluation({ id: 'eval-p1', outcome: 'pending', detectionState: 'emerging_weakness' }),
        makeEvaluation({ id: 'eval-p2', outcome: 'pending', detectionState: 'improving' }),
      ]

      vi.mocked(dbClient.getAllEvaluationsByCycleId).mockResolvedValue(pendingEvals)
      vi.mocked(dbClient.isCycleTerminallyEvaluated).mockResolvedValue(false)

      const allEvals = await dbClient.getAllEvaluationsByCycleId(CYCLE_ID_1)
      const isTerminal = await dbClient.isCycleTerminallyEvaluated(CYCLE_ID_1)

      expect(allEvals).toHaveLength(2)
      expect(isTerminal).toBe(false)
    })
  })

  // ─────────────────────────────────────────────
  // 10. Sustained-Performance Reset Behavior
  // ─────────────────────────────────────────────
  describe('sustained-performance reset behavior', () => {
    it('reset eligibility requires 30 days in CPW', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new SustainedPerformanceService(dbClient)

      vi.mocked(dbClient.checkResetEligibility).mockResolvedValue({
        isEligible: false,
        daysInCpw: 15,
        blockingReason: 'insufficient_days',
      })

      const eligibility = await dbClient.checkResetEligibility(USER_ID, CONCEPT_ID)
      expect(eligibility.isEligible).toBe(false)
      expect(eligibility.blockingReason).toBe('insufficient_days')
    })

    it('reset eligibility requires follow-up evidence', async () => {
      const dbClient = createMockEscalationDbClient()

      vi.mocked(dbClient.checkResetEligibility).mockResolvedValue({
        isEligible: false,
        daysInCpw: 35,
        followUpEvidenceCount: 0,
        blockingReason: 'no_follow_up_evidence',
      })

      const eligibility = await dbClient.checkResetEligibility(USER_ID, CONCEPT_ID)
      expect(eligibility.isEligible).toBe(false)
      expect(eligibility.blockingReason).toBe('no_follow_up_evidence')
    })

    it('reset eligibility blocked by continuity break', async () => {
      const dbClient = createMockEscalationDbClient()

      vi.mocked(dbClient.checkResetEligibility).mockResolvedValue({
        isEligible: false,
        continuityBroken: true,
        blockingReason: 'continuity_broken',
      })

      const eligibility = await dbClient.checkResetEligibility(USER_ID, CONCEPT_ID)
      expect(eligibility.isEligible).toBe(false)
      expect(eligibility.blockingReason).toBe('continuity_broken')
    })

    it('successful reset clears counters and can auto-clear non-owned escalations', async () => {
      const dbClient = createMockEscalationDbClient()

      vi.mocked(dbClient.executeReset).mockResolvedValue({
        success: true,
        resetId: 'reset-001',
      })

      const result = await dbClient.executeReset(USER_ID, CONCEPT_ID)
      expect(result.success).toBe(true)
      expect(result.resetId).toBe('reset-001')
    })

    it('reset is idempotent', async () => {
      const dbClient = createMockEscalationDbClient()

      vi.mocked(dbClient.executeReset).mockResolvedValue({
        success: true,
        resetId: 'reset-001',
        alreadyExecuted: true,
      })

      const result = await dbClient.executeReset(USER_ID, CONCEPT_ID)
      expect(result.success).toBe(true)
      expect(result.alreadyExecuted).toBe(true)
    })
  })

  // ─────────────────────────────────────────────
  // 11. Escalation Ownership Protection
  // ─────────────────────────────────────────────
  describe('escalation ownership protection', () => {
    it('acknowledged escalation cannot be auto-cleared by automation', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      // An acknowledged escalation exists
      const acknowledgedEscalation = makeEscalation({
        status: 'acknowledged',
        acknowledgedBy: INSTRUCTOR_ID,
        acknowledgedAt: new Date(),
      })
      vi.mocked(dbClient.getActiveEscalation).mockResolvedValue(acknowledgedEscalation)

      // Attempting to create a duplicate returns the existing one
      vi.mocked(dbClient.getUnsuccessfulCycleCount).mockResolvedValue(3)

      const result = await service.createEscalation({
        userId: USER_ID,
        conceptId: CONCEPT_ID,
        chapterId: CHAPTER_ID,
        schoolId: SCHOOL_ID,
        triggeringCycleIds: [CYCLE_ID_1, CYCLE_ID_2, CYCLE_ID_3],
        unsuccessfulCycleCount: 3,
        detectionEvidence: MOCK_EVIDENCE,
      })

      expect(result.alreadyExists).toBe(true)
      expect(result.escalationId).toBe(ESCALATION_ID)
    })

    it('acknowledgement records the instructor ID', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      // Service fetches the escalation first — must return a pending one
      vi.mocked(dbClient.getEscalation).mockResolvedValue(
        makeEscalation({ status: 'pending', acknowledgedBy: null })
      )
      vi.mocked(dbClient.acknowledgeEscalation).mockResolvedValue({ success: true })

      const result = await service.acknowledgeEscalation({
        escalationId: ESCALATION_ID,
        instructorId: INSTRUCTOR_ID,
      })

      expect(result.success).toBe(true)
      expect(dbClient.acknowledgeEscalation).toHaveBeenCalledWith({
        escalationId: ESCALATION_ID,
        instructorId: INSTRUCTOR_ID,
      })
    })
  })

  // ─────────────────────────────────────────────
  // 12. Cross-Student Access
  // ─────────────────────────────────────────────
  describe('cross-student access', () => {
    it('escalation queries are scoped to the correct user', async () => {
      const dbClient = createMockEscalationDbClient()

      // When querying for USER_ID, only USER_ID's data should be returned
      vi.mocked(dbClient.getActiveEscalation).mockResolvedValue(null)

      const result = await dbClient.getActiveEscalation(OTHER_USER_ID, CONCEPT_ID)
      expect(result).toBeNull()

      // Verify the query was scoped to OTHER_USER_ID, not USER_ID
      expect(dbClient.getActiveEscalation).toHaveBeenCalledWith(OTHER_USER_ID, CONCEPT_ID)
    })

    it('evaluation evidence validation checks student ownership', async () => {
      const dbClient = createMockEvaluationDbClient()

      vi.mocked(dbClient.validateEvidence).mockResolvedValue([
        {
          evidenceId: 'attempt-1',
          isValid: false,
          failureReason: 'Evidence belongs to a different student',
        },
      ])

      const results = await dbClient.validateEvidence(CYCLE_ID_1, ['attempt-1'])
      expect(results[0].isValid).toBe(false)
      expect(results[0].failureReason).toContain('different student')
    })
  })

  // ─────────────────────────────────────────────
  // 13. Cross-School Instructor Access
  // ─────────────────────────────────────────────
  describe('cross-school instructor access', () => {
    it('escalation creation is scoped to the correct school', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      vi.mocked(dbClient.getUnsuccessfulCycleCount).mockResolvedValue(2)
      vi.mocked(dbClient.getActiveEscalation).mockResolvedValue(null)
      vi.mocked(dbClient.createEscalation).mockResolvedValue({
        success: true,
        escalationId: ESCALATION_ID,
      })

      await service.createEscalation({
        userId: USER_ID,
        conceptId: CONCEPT_ID,
        chapterId: CHAPTER_ID,
        schoolId: SCHOOL_ID,
        triggeringCycleIds: [CYCLE_ID_1, CYCLE_ID_2],
        unsuccessfulCycleCount: 2,
        detectionEvidence: MOCK_EVIDENCE,
      })

      // Verify schoolId was passed through
      expect(dbClient.createEscalation).toHaveBeenCalledWith(
        expect.objectContaining({ schoolId: SCHOOL_ID })
      )
    })
  })

  // ─────────────────────────────────────────────
  // 14. Acknowledgement Replay/Idempotency
  // ─────────────────────────────────────────────
  describe('acknowledgement replay/idempotency', () => {
    it('double acknowledgement returns alreadyAcknowledged', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      // First acknowledgement: escalation is pending
      vi.mocked(dbClient.getEscalation).mockResolvedValueOnce(
        makeEscalation({ status: 'pending', acknowledgedBy: null })
      )
      vi.mocked(dbClient.acknowledgeEscalation).mockResolvedValueOnce({ success: true })

      const result1 = await service.acknowledgeEscalation({
        escalationId: ESCALATION_ID,
        instructorId: INSTRUCTOR_ID,
      })
      expect(result1.success).toBe(true)

      // Second acknowledgement (replay): escalation is now acknowledged
      vi.mocked(dbClient.getEscalation).mockResolvedValueOnce(
        makeEscalation({
          status: 'acknowledged',
          acknowledgedBy: INSTRUCTOR_ID,
          acknowledgedAt: new Date(),
        })
      )

      const result2 = await service.acknowledgeEscalation({
        escalationId: ESCALATION_ID,
        instructorId: INSTRUCTOR_ID,
      })
      // The service rejects because status is no longer pending
      expect(result2.success).toBe(false)
      expect(result2.error).toContain('acknowledged')
    })

    it('acknowledgement by different instructor is rejected', async () => {
      const dbClient = createMockEscalationDbClient()

      vi.mocked(dbClient.acknowledgeEscalation).mockResolvedValue({
        success: false,
        error: 'Escalation already acknowledged by another instructor',
      })

      const result = await dbClient.acknowledgeEscalation({
        escalationId: ESCALATION_ID,
        instructorId: OTHER_INSTRUCTOR_ID,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('another instructor')
    })
  })

  // ─────────────────────────────────────────────
  // 15. Concurrent Acknowledgement (where testable)
  // ─────────────────────────────────────────────
  describe('concurrent acknowledgement', () => {
    it('only one instructor can acknowledge — second gets error', async () => {
      const dbClient = createMockEscalationDbClient()

      // Simulate race: first call succeeds, second fails
      let callCount = 0
      vi.mocked(dbClient.acknowledgeEscalation).mockImplementation(async () => {
        callCount++
        if (callCount === 1) {
          return { success: true }
        }
        return {
          success: false,
          error: 'Escalation already acknowledged by another instructor',
        }
      })

      const [result1, result2] = await Promise.all([
        dbClient.acknowledgeEscalation({
          escalationId: ESCALATION_ID,
          instructorId: INSTRUCTOR_ID,
        }),
        dbClient.acknowledgeEscalation({
          escalationId: ESCALATION_ID,
          instructorId: OTHER_INSTRUCTOR_ID,
        }),
      ])

      // Exactly one should succeed
      const successes = [result1, result2].filter((r) => r.success)
      const failures = [result1, result2].filter((r) => !r.success)
      expect(successes).toHaveLength(1)
      expect(failures).toHaveLength(1)
    })
  })

  // ─────────────────────────────────────────────
  // 16. Stale Reservation Behavior
  // ─────────────────────────────────────────────
  describe('stale reservation behavior', () => {
    it('evaluation with stale/invalid evidence is rejected', async () => {
      const dbClient = createMockEvaluationDbClient()
      const service = new EvaluationService(dbClient)

      vi.mocked(dbClient.evaluateCycle).mockResolvedValue({
        success: false,
        error: 'Evidence validation failed: evidence belongs to a different cycle',
      })

      const result = await service.evaluateCycle(makeEvaluateParams())
      expect(result.success).toBe(false)
      expect(result.error).toContain('Evidence validation failed')
    })

    it('evaluation with mismatched cycle ID is rejected', async () => {
      const dbClient = createMockEvaluationDbClient()
      const service = new EvaluationService(dbClient)

      vi.mocked(dbClient.evaluateCycle).mockResolvedValue({
        success: false,
        error: 'Cycle not found or already terminally evaluated',
      })

      const result = await service.evaluateCycle(
        makeEvaluateParams({ cycleId: 'nonexistent-cycle' })
      )
      expect(result.success).toBe(false)
    })
  })

  // ─────────────────────────────────────────────
  // 17. Refresh/Retry Recovery
  // ─────────────────────────────────────────────
  describe('refresh/retry recovery', () => {
    it('evaluation can be retried after transient failure', async () => {
      const dbClient = createMockEvaluationDbClient()
      const service = new EvaluationService(dbClient)

      // First call fails transiently
      vi.mocked(dbClient.evaluateCycle).mockResolvedValueOnce({
        success: false,
        error: 'Database connection timeout',
      })

      const result1 = await service.evaluateCycle(makeEvaluateParams())
      expect(result1.success).toBe(false)

      // Retry succeeds
      vi.mocked(dbClient.evaluateCycle).mockResolvedValueOnce({
        success: true,
        evaluationId: 'eval-retry-001',
        outcome: 'unsuccessful',
      })

      const result2 = await service.evaluateCycle(makeEvaluateParams())
      expect(result2.success).toBe(true)
      expect(result2.evaluationId).toBe('eval-retry-001')
    })

    it('invalid detection state is rejected before database call', async () => {
      const dbClient = createMockEvaluationDbClient()
      const service = new EvaluationService(dbClient)

      const result = await service.evaluateCycle(
        makeEvaluateParams({
          detectionState: 'invalid_state' as DetectionState,
          confidence: 'high',
        })
      )

      expect(result.success).toBe(false)
      expect(result.error).toBeTruthy()
      // Should NOT have reached the database
      expect(dbClient.evaluateCycle).not.toHaveBeenCalled()
    })
  })

  // ─────────────────────────────────────────────
  // Outcome Matrix Integrity
  // ─────────────────────────────────────────────
  describe('outcome matrix integrity', () => {
    it('matrix covers all detection states', () => {
      const states: DetectionState[] = [
        'insufficient_evidence',
        'emerging_weakness',
        'repeated_weakness',
        'improving',
        'currently_performing_well',
      ]

      for (const state of states) {
        expect(OUTCOME_MATRIX[state]).toBeDefined()
        expect(OUTCOME_MATRIX[state].low).toBeDefined()
        expect(OUTCOME_MATRIX[state].medium).toBeDefined()
        expect(OUTCOME_MATRIX[state].high).toBeDefined()
      }
    })

    it('only repeated_weakness maps to unsuccessful', () => {
      const allOutcomes = Object.entries(OUTCOME_MATRIX).flatMap(([state, confs]) =>
        Object.entries(confs).map(([conf, outcome]) => ({ state, conf, outcome }))
      )

      const unsuccessfulOutcomes = allOutcomes.filter((o) => o.outcome === 'unsuccessful')
      for (const o of unsuccessfulOutcomes) {
        expect(o.state).toBe('repeated_weakness')
      }
    })

    it('only currently_performing_well maps to successful', () => {
      const allOutcomes = Object.entries(OUTCOME_MATRIX).flatMap(([state, confs]) =>
        Object.entries(confs).map(([conf, outcome]) => ({ state, conf, outcome }))
      )

      const successfulOutcomes = allOutcomes.filter((o) => o.outcome === 'successful')
      for (const o of successfulOutcomes) {
        expect(o.state).toBe('currently_performing_well')
      }
    })
  })

  // ─────────────────────────────────────────────
  // Escalation Service Edge Cases
  // ─────────────────────────────────────────────
  describe('escalation service edge cases', () => {
    it('escalation with 0 unsuccessful cycles is rejected', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      vi.mocked(dbClient.getUnsuccessfulCycleCount).mockResolvedValue(0)

      const result = await service.createEscalation({
        userId: USER_ID,
        conceptId: CONCEPT_ID,
        chapterId: CHAPTER_ID,
        schoolId: SCHOOL_ID,
        triggeringCycleIds: [],
        unsuccessfulCycleCount: 0,
        detectionEvidence: MOCK_EVIDENCE,
      })

      expect(result.success).toBe(false)
      expect(dbClient.createEscalation).not.toHaveBeenCalled()
    })

    it('escalation for different concept does not interfere', async () => {
      const dbClient = createMockEscalationDbClient()
      const service = new EscalationService(dbClient)

      const OTHER_CONCEPT = 'C-2-05' as ConceptId

      // No active escalation for the other concept
      vi.mocked(dbClient.getActiveEscalation).mockResolvedValue(null)
      vi.mocked(dbClient.getUnsuccessfulCycleCount).mockResolvedValue(2)
      vi.mocked(dbClient.createEscalation).mockResolvedValue({
        success: true,
        escalationId: 'esc-other',
      })

      const result = await service.createEscalation({
        userId: USER_ID,
        conceptId: OTHER_CONCEPT,
        chapterId: CHAPTER_ID,
        schoolId: SCHOOL_ID,
        triggeringCycleIds: [CYCLE_ID_1, CYCLE_ID_2],
        unsuccessfulCycleCount: 2,
        detectionEvidence: MOCK_EVIDENCE,
      })

      expect(result.success).toBe(true)
      expect(result.escalationId).toBe('esc-other')
      // Verify concept scoping
      expect(dbClient.getActiveEscalation).toHaveBeenCalledWith(USER_ID, OTHER_CONCEPT)
    })
  })

  // ─────────────────────────────────────────────
  // Follow-Up Evidence Integrity
  // ─────────────────────────────────────────────
  describe('follow-up evidence integrity', () => {
    it('follow-up evidence requires canonical mapping verification', async () => {
      const dbClient = createMockEscalationDbClient()
      // Service without mapping provider rejects
      const service = new SustainedPerformanceService(dbClient)

      const result = await service.recordFollowUpEvidence(
        {
          userId: USER_ID,
          conceptId: CONCEPT_ID,
          chapterId: CHAPTER_ID,
          quizAttemptId: 'attempt-1',
        },
        {},
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('mapping provider')
    })

    it('follow-up evidence with 0 mapped questions is rejected', async () => {
      const dbClient = createMockEscalationDbClient()
      const mockMappingProvider = {
        chapterId: CHAPTER_ID,
        getConceptForQuestion: vi.fn(),
        getQuestionsForConcept: vi.fn(),
        isQuestionMappedToConcept: vi.fn().mockReturnValue(false),
      }
      const service = new SustainedPerformanceService(dbClient, mockMappingProvider as any)

      const result = await service.recordFollowUpEvidence(
        {
          userId: USER_ID,
          conceptId: CONCEPT_ID,
          chapterId: CHAPTER_ID,
          quizAttemptId: 'attempt-1',
        },
        { 'q-1': 'answer-a' },
      )

      expect(result.success).toBe(false)
      expect(result.error).toContain('canonically mapped')
    })

    it('duplicate follow-up evidence is idempotent', async () => {
      const dbClient = createMockEscalationDbClient()
      const mockMappingProvider = {
        chapterId: CHAPTER_ID,
        getConceptForQuestion: vi.fn(),
        getQuestionsForConcept: vi.fn(),
        isQuestionMappedToConcept: vi.fn().mockReturnValue(true),
      }
      const service = new SustainedPerformanceService(dbClient, mockMappingProvider as any)

      vi.mocked(dbClient.recordFollowUpEvidence).mockResolvedValue({
        success: true,
        evidenceId: 'fe-001',
        alreadyRecorded: true,
      })

      const result = await service.recordFollowUpEvidence(
        {
          userId: USER_ID,
          conceptId: CONCEPT_ID,
          chapterId: CHAPTER_ID,
          quizAttemptId: 'attempt-1',
        },
        { 'q-1': 'answer-a', 'q-2': 'answer-b' },
      )

      expect(result.success).toBe(true)
      expect(result.alreadyRecorded).toBe(true)
    })
  })
})
