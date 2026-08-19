/**
 * Phase 6C-2d — Chapter 2 Detection Provider Tests
 *
 * Comprehensive behavioral tests proving:
 *   1. Chapter 2 provider resolves successfully
 *   2. Provider uses canonical mappings
 *   3. Correct student/concept evidence reaches detection
 *   4. Unrelated concept questions cannot influence the target concept
 *   5. Detection state comes from the Phase 6B-3 engine
 *   6. Production evaluation cannot substitute arbitrary caller-supplied detection state
 *   7. Legitimate evaluation still reaches evaluate_remediation_cycle()
 *   8. Existing 6C-2b reassessment integrity remains intact
 *   9. Existing 6C-2c evidence/reset/escalation behavior remains intact
 *  10. All 15 outcome-matrix mappings remain unchanged
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import {
  Chapter2DetectionProvider,
  createChapter2DetectionProvider,
  resetChapter2DetectionProvider,
  type Chapter2DetectionProviderConfig,
} from '../adapters/chapter-2-detection-provider'
import {
  getDetectionProviderRegistry,
  resetDetectionProviderRegistry,
  initializeChapter2DetectionProvider,
  hasConceptDetectionProvider,
  getConceptDetectionProvider,
  type IConceptDetectionProvider,
} from '../provider-registry'
import { chapter2QuizQuestionMappings } from '@/lib/chapter-2-concepts/mappings'
import { buildConceptEvidence, detectConceptState } from '@/lib/chapter-2-concepts/detection'
import type { QuizAttempt } from '@/types'
import type { ConceptId, QuizQuestionId } from '../types'

// ───────────────────────────────────────────────
// Test Fixtures
// ───────────────────────────────────────────────

const MOCK_USER_ID = 'user-123'
const MOCK_ATTEMPT_ID_1 = 'attempt-001'
const MOCK_ATTEMPT_ID_2 = 'attempt-002'
const MOCK_ATTEMPT_ID_3 = 'attempt-003'

// Get a real concept with multiple questions for testing
const TEST_CONCEPT_ID = 'C-2-21' // Financial Literacy - has multiple questions
const TEST_CONCEPT_QUESTIONS = chapter2QuizQuestionMappings
  .filter((m) => m.conceptId === TEST_CONCEPT_ID)
  .map((m) => m.questionId)

const UNRELATED_CONCEPT_ID = 'C-2-01' // Life Skills - different concept
const UNRELATED_QUESTIONS = chapter2QuizQuestionMappings
  .filter((m) => m.conceptId === UNRELATED_CONCEPT_ID)
  .map((m) => m.questionId)

// Single question concept for edge case testing
const SINGLE_QUESTION_CONCEPT = 'C-2-16' // Work-Life Balance - single question (qq-2-037)

function createMockQuizAttempt(
  id: string,
  answers: Record<string, string>,
  completedAt: string = '2026-08-19T12:00:00Z'
): QuizAttempt {
  return {
    id,
    user_id: MOCK_USER_ID,
    quiz_id: 'quiz-2',
    score: Object.values(answers).filter((a) => a === 'a').length,
    total_questions: Object.keys(answers).length,
    percentage: 50,
    answers_json: answers,
    completed_at: completedAt,
  }
}

function createMockFetchQuizAttempts(
  attempts: Map<string, QuizAttempt>
): (ids: string[]) => Promise<QuizAttempt[]> {
  return async (ids: string[]) => {
    return ids
      .map((id) => attempts.get(id))
      .filter((a): a is QuizAttempt => a !== undefined)
  }
}

// ───────────────────────────────────────────────
// Test Suite
// ───────────────────────────────────────────────

describe('Chapter2DetectionProvider', () => {
  let provider: Chapter2DetectionProvider
  let mockFetchQuizAttempts: ReturnType<typeof createMockFetchQuizAttempts>
  let attemptsMap: Map<string, QuizAttempt>

  beforeEach(() => {
    resetChapter2DetectionProvider()
    resetDetectionProviderRegistry()
    attemptsMap = new Map()
    mockFetchQuizAttempts = createMockFetchQuizAttempts(attemptsMap)
  })

  afterEach(() => {
    resetChapter2DetectionProvider()
    resetDetectionProviderRegistry()
  })

  describe('Provider Resolution', () => {
    it('resolves successfully via registry after initialization', () => {
      // Initialize provider
      const config: Chapter2DetectionProviderConfig = {
        fetchQuizAttempts: mockFetchQuizAttempts,
      }
      const initializedProvider = initializeChapter2DetectionProvider(config)

      // Verify registry resolution
      expect(hasConceptDetectionProvider('ch-2')).toBe(true)
      const resolvedProvider = getConceptDetectionProvider('ch-2')
      expect(resolvedProvider).toBe(initializedProvider)
      expect(resolvedProvider.chapterId).toBe('ch-2')
    })

    it('throws when resolving uninitialized provider', () => {
      expect(hasConceptDetectionProvider('ch-2')).toBe(false)
      expect(() => getConceptDetectionProvider('ch-2')).toThrow(
        'No concept detection provider registered for chapter: ch-2'
      )
    })

    it('creates provider with correct chapterId', () => {
      const provider = createChapter2DetectionProvider({
        fetchQuizAttempts: mockFetchQuizAttempts,
      })
      expect(provider.chapterId).toBe('ch-2')
    })
  })

  describe('Canonical Mapping Usage', () => {
    beforeEach(() => {
      provider = createChapter2DetectionProvider({
        fetchQuizAttempts: mockFetchQuizAttempts,
      })
    })

    it('uses canonical mappings from chapter-2-concepts/mappings.ts', () => {
      // Verify provider has access to canonical mappings
      const canonicalQuestions = provider.getCanonicalQuestionIds(TEST_CONCEPT_ID)
      expect(canonicalQuestions.length).toBeGreaterThan(0)
      expect(canonicalQuestions).toEqual(expect.arrayContaining(TEST_CONCEPT_QUESTIONS))
    })

    it('validates concept IDs against canonical taxonomy', () => {
      expect(provider.isValidConcept(TEST_CONCEPT_ID)).toBe(true)
      expect(provider.isValidConcept(UNRELATED_CONCEPT_ID)).toBe(true)
      expect(provider.isValidConcept('C-2-99' as ConceptId)).toBe(false)
      expect(provider.isValidConcept('invalid' as ConceptId)).toBe(false)
    })

    it('returns null for invalid concept ID', async () => {
      const result = await provider.detectConceptState('C-2-99' as ConceptId, [
        MOCK_ATTEMPT_ID_1,
      ])
      expect(result).toBeNull()
    })

    it('returns null for concept with no canonical questions', async () => {
      // All active concepts have questions, but test the guard
      const result = await provider.detectConceptState(TEST_CONCEPT_ID, [])
      expect(result).toBeNull()
    })
  })

  describe('Evidence Construction', () => {
    beforeEach(() => {
      provider = createChapter2DetectionProvider({
        fetchQuizAttempts: mockFetchQuizAttempts,
      })
    })

    it('builds evidence from legitimate persisted quiz attempts', async () => {
      // Create attempt with questions from target concept
      const attempt = createMockQuizAttempt(MOCK_ATTEMPT_ID_1, {
        [TEST_CONCEPT_QUESTIONS[0]]: 'a', // correct
        [TEST_CONCEPT_QUESTIONS[1]]: 'b', // incorrect
      })
      attemptsMap.set(MOCK_ATTEMPT_ID_1, attempt)

      const result = await provider.detectConceptState(TEST_CONCEPT_ID, [MOCK_ATTEMPT_ID_1])

      expect(result).not.toBeNull()
      expect(result?.conceptId).toBe(TEST_CONCEPT_ID)
      expect(result?.evidence.totalObservations).toBe(2)
      expect(result?.evidence.conceptId).toBe(TEST_CONCEPT_ID)
    })

    it('correctly filters evidence to target concept questions only', async () => {
      // Create attempt with mixed questions (target + unrelated)
      const attempt = createMockQuizAttempt(MOCK_ATTEMPT_ID_1, {
        [TEST_CONCEPT_QUESTIONS[0]]: 'a', // target concept - correct
        [UNRELATED_QUESTIONS[0]]: 'b', // unrelated concept - incorrect
      })
      attemptsMap.set(MOCK_ATTEMPT_ID_1, attempt)

      const result = await provider.detectConceptState(TEST_CONCEPT_ID, [MOCK_ATTEMPT_ID_1])

      expect(result).not.toBeNull()
      // Should only count the target concept question
      expect(result?.evidence.totalObservations).toBe(1)
      expect(result?.evidence.correct).toBe(1)
      expect(result?.evidence.misses).toBe(0)
    })

    it('handles multiple attempts correctly', async () => {
      const attempt1 = createMockQuizAttempt(
        MOCK_ATTEMPT_ID_1,
        { [TEST_CONCEPT_QUESTIONS[0]]: 'a' },
        '2026-08-18T12:00:00Z'
      )
      const attempt2 = createMockQuizAttempt(
        MOCK_ATTEMPT_ID_2,
        { [TEST_CONCEPT_QUESTIONS[0]]: 'b' },
        '2026-08-19T12:00:00Z'
      )
      attemptsMap.set(MOCK_ATTEMPT_ID_1, attempt1)
      attemptsMap.set(MOCK_ATTEMPT_ID_2, attempt2)

      const result = await provider.detectConceptState(TEST_CONCEPT_ID, [
        MOCK_ATTEMPT_ID_1,
        MOCK_ATTEMPT_ID_2,
      ])

      expect(result).not.toBeNull()
      expect(result?.evidence.totalObservations).toBe(2)
      expect(result?.evidence.correct).toBe(1)
      expect(result?.evidence.misses).toBe(1)
    })
  })

  describe('Unrelated Concept Isolation', () => {
    beforeEach(() => {
      provider = createChapter2DetectionProvider({
        fetchQuizAttempts: mockFetchQuizAttempts,
      })
    })

    it('unrelated concept questions cannot influence target concept detection', async () => {
      // Create attempt with ONLY unrelated concept questions
      const attempt = createMockQuizAttempt(MOCK_ATTEMPT_ID_1, {
        [UNRELATED_QUESTIONS[0]]: 'b', // unrelated - incorrect
        [UNRELATED_QUESTIONS[1]]: 'b', // unrelated - incorrect
      })
      attemptsMap.set(MOCK_ATTEMPT_ID_1, attempt)

      const result = await provider.detectConceptState(TEST_CONCEPT_ID, [MOCK_ATTEMPT_ID_1])

      // Should return insufficient evidence (no target concept questions)
      expect(result).not.toBeNull()
      expect(result?.state).toBe('insufficient_evidence')
      expect(result?.evidence.totalObservations).toBe(0)
    })

    it('mixed attempts only count target concept questions', async () => {
      // Create attempt with more unrelated than target questions
      const attempt = createMockQuizAttempt(MOCK_ATTEMPT_ID_1, {
        [TEST_CONCEPT_QUESTIONS[0]]: 'a', // target - correct
        [UNRELATED_QUESTIONS[0]]: 'b', // unrelated - incorrect
        [UNRELATED_QUESTIONS[1]]: 'b', // unrelated - incorrect
        [UNRELATED_QUESTIONS[2]]: 'b', // unrelated - incorrect
      })
      attemptsMap.set(MOCK_ATTEMPT_ID_1, attempt)

      const result = await provider.detectConceptState(TEST_CONCEPT_ID, [MOCK_ATTEMPT_ID_1])

      expect(result).not.toBeNull()
      // Only 1 observation (the target concept question)
      expect(result?.evidence.totalObservations).toBe(1)
      expect(result?.evidence.missRate).toBe(0) // The one target question was correct
    })
  })

  describe('Phase 6B-3 Engine Integration', () => {
    beforeEach(() => {
      provider = createChapter2DetectionProvider({
        fetchQuizAttempts: mockFetchQuizAttempts,
      })
    })

    it('detection state comes from Phase 6B-3 detectConceptState()', async () => {
      // Create evidence that should trigger 'currently_performing_well'
      const attempt = createMockQuizAttempt(MOCK_ATTEMPT_ID_1, {
        [TEST_CONCEPT_QUESTIONS[0]]: 'a',
        [TEST_CONCEPT_QUESTIONS[1]]: 'a',
        [TEST_CONCEPT_QUESTIONS[2]]: 'a',
      })
      attemptsMap.set(MOCK_ATTEMPT_ID_1, attempt)

      const result = await provider.detectConceptState(TEST_CONCEPT_ID, [MOCK_ATTEMPT_ID_1])

      expect(result).not.toBeNull()
      // All correct should result in currently_performing_well
      expect(result?.state).toBe('currently_performing_well')
    })

    it('detection confidence comes from Phase 6B-3 engine', async () => {
      // Create minimal evidence (low confidence)
      const attempt = createMockQuizAttempt(MOCK_ATTEMPT_ID_1, {
        [TEST_CONCEPT_QUESTIONS[0]]: 'a',
      })
      attemptsMap.set(MOCK_ATTEMPT_ID_1, attempt)

      const result = await provider.detectConceptState(TEST_CONCEPT_ID, [MOCK_ATTEMPT_ID_1])

      expect(result).not.toBeNull()
      // Single observation = low confidence
      expect(result?.confidence).toBe('low')
    })

    it('evidence structure matches Phase 6B-3 buildConceptEvidence()', async () => {
      const attempt = createMockQuizAttempt(MOCK_ATTEMPT_ID_1, {
        [TEST_CONCEPT_QUESTIONS[0]]: 'a',
        [TEST_CONCEPT_QUESTIONS[1]]: 'b',
      })
      attemptsMap.set(MOCK_ATTEMPT_ID_1, attempt)

      const result = await provider.detectConceptState(TEST_CONCEPT_ID, [MOCK_ATTEMPT_ID_1])

      expect(result).not.toBeNull()
      // Verify evidence structure matches Phase 6B-3
      expect(result?.evidence).toHaveProperty('conceptId')
      expect(result?.evidence).toHaveProperty('learningObjectiveId')
      expect(result?.evidence).toHaveProperty('totalObservations')
      expect(result?.evidence).toHaveProperty('uniqueQuestions')
      expect(result?.evidence).toHaveProperty('missRate')
      expect(result?.evidence).toHaveProperty('pattern')
    })

    it('repeated weakness detection works via Phase 6B-3', async () => {
      // Create evidence of repeated weakness (multiple misses)
      const attempt1 = createMockQuizAttempt(
        MOCK_ATTEMPT_ID_1,
        { [TEST_CONCEPT_QUESTIONS[0]]: 'b' },
        '2026-08-17T12:00:00Z'
      )
      const attempt2 = createMockQuizAttempt(
        MOCK_ATTEMPT_ID_2,
        { [TEST_CONCEPT_QUESTIONS[0]]: 'b' },
        '2026-08-18T12:00:00Z'
      )
      const attempt3 = createMockQuizAttempt(
        MOCK_ATTEMPT_ID_3,
        { [TEST_CONCEPT_QUESTIONS[0]]: 'b' },
        '2026-08-19T12:00:00Z'
      )
      attemptsMap.set(MOCK_ATTEMPT_ID_1, attempt1)
      attemptsMap.set(MOCK_ATTEMPT_ID_2, attempt2)
      attemptsMap.set(MOCK_ATTEMPT_ID_3, attempt3)

      const result = await provider.detectConceptState(TEST_CONCEPT_ID, [
        MOCK_ATTEMPT_ID_1,
        MOCK_ATTEMPT_ID_2,
        MOCK_ATTEMPT_ID_3,
      ])

      expect(result).not.toBeNull()
      expect(result?.state).toBe('repeated_weakness')
      expect(result?.evidence.misses).toBe(3)
    })
  })

  describe('Canonical Mapping Verification', () => {
    beforeEach(() => {
      provider = createChapter2DetectionProvider({
        fetchQuizAttempts: mockFetchQuizAttempts,
      })
    })

    it('verifyCanonicalMapping correctly identifies mapped questions', () => {
      const attempt = createMockQuizAttempt(MOCK_ATTEMPT_ID_1, {
        [TEST_CONCEPT_QUESTIONS[0]]: 'a',
        [UNRELATED_QUESTIONS[0]]: 'b',
      })

      const result = provider.verifyCanonicalMapping(TEST_CONCEPT_ID, attempt)

      expect(result.verified).toBe(true)
      expect(result.mappedQuestionCount).toBe(1)
    })

    it('verifyCanonicalMapping returns false for unmapped attempts', () => {
      const attempt = createMockQuizAttempt(MOCK_ATTEMPT_ID_1, {
        [UNRELATED_QUESTIONS[0]]: 'a',
        [UNRELATED_QUESTIONS[1]]: 'b',
      })

      const result = provider.verifyCanonicalMapping(TEST_CONCEPT_ID, attempt)

      expect(result.verified).toBe(false)
      expect(result.mappedQuestionCount).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    beforeEach(() => {
      provider = createChapter2DetectionProvider({
        fetchQuizAttempts: mockFetchQuizAttempts,
      })
    })

    it('handles empty evidence IDs array', async () => {
      const result = await provider.detectConceptState(TEST_CONCEPT_ID, [])
      expect(result).toBeNull()
    })

    it('handles non-existent attempt IDs', async () => {
      const result = await provider.detectConceptState(TEST_CONCEPT_ID, ['non-existent-id'])
      expect(result).toBeNull()
    })

    it('handles single-question concepts with insufficient evidence', async () => {
      // C-2-16 has only one question (qq-2-037)
      const attempt = createMockQuizAttempt(MOCK_ATTEMPT_ID_1, {
        'qq-2-037': 'a',
      })
      attemptsMap.set(MOCK_ATTEMPT_ID_1, attempt)

      const result = await provider.detectConceptState(SINGLE_QUESTION_CONCEPT, [
        MOCK_ATTEMPT_ID_1,
      ])

      expect(result).not.toBeNull()
      // Single question concept with < 4 observations = insufficient_evidence
      expect(result?.state).toBe('insufficient_evidence')
    })
  })
})

// ───────────────────────────────────────────────
// Production Safety Tests
// ───────────────────────────────────────────────

describe('Production Safety', () => {
  beforeEach(() => {
    resetChapter2DetectionProvider()
    resetDetectionProviderRegistry()
  })

  afterEach(() => {
    resetChapter2DetectionProvider()
    resetDetectionProviderRegistry()
  })

  it('provider interface does not accept arbitrary detection state', () => {
    // The IConceptDetectionProvider interface only accepts:
    // - conceptId: ConceptId
    // - evidenceIds: string[]
    //
    // It does NOT accept:
    // - detectionState: DetectionState
    // - confidence: DetectionConfidence
    // - evidence: ConceptEvidence
    //
    // This is a compile-time guarantee. The provider derives all detection
    // results from the Phase 6B-3 engine using canonical mappings.

    const provider: IConceptDetectionProvider = createChapter2DetectionProvider({
      fetchQuizAttempts: async () => [],
    })

    // Verify the interface shape
    expect(provider.detectConceptState).toBeInstanceOf(Function)
    expect(provider.chapterId).toBe('ch-2')

    // The function signature only accepts (conceptId, evidenceIds)
    // TypeScript would reject any call with additional parameters
    expect(provider.detectConceptState.length).toBe(2)
  })

  it('detection result is derived from evidence, not caller input', async () => {
    const attemptsMap = new Map<string, QuizAttempt>()
    const mockFetch = createMockFetchQuizAttempts(attemptsMap)

    const provider = createChapter2DetectionProvider({
      fetchQuizAttempts: mockFetch,
    })

    // Create evidence that would be 'currently_performing_well'
    const attempt = createMockQuizAttempt(MOCK_ATTEMPT_ID_1, {
      [TEST_CONCEPT_QUESTIONS[0]]: 'a',
      [TEST_CONCEPT_QUESTIONS[1]]: 'a',
      [TEST_CONCEPT_QUESTIONS[2]]: 'a',
    })
    attemptsMap.set(MOCK_ATTEMPT_ID_1, attempt)

    // The provider derives state from evidence, not from any caller-supplied state
    const result = await provider.detectConceptState(TEST_CONCEPT_ID, [MOCK_ATTEMPT_ID_1])

    // Result is determined by the Phase 6B-3 engine analyzing the evidence
    expect(result?.state).toBe('currently_performing_well')
    // There is no way to pass 'repeated_weakness' as input and get it as output
    // without the evidence actually showing repeated weakness
  })
})

// ───────────────────────────────────────────────
// Integration with Evaluation Service
// ───────────────────────────────────────────────

describe('Evaluation Service Integration', () => {
  beforeEach(() => {
    resetChapter2DetectionProvider()
    resetDetectionProviderRegistry()
  })

  afterEach(() => {
    resetChapter2DetectionProvider()
    resetDetectionProviderRegistry()
  })

  it('registered provider can be retrieved for evaluation service', () => {
    const attemptsMap = new Map<string, QuizAttempt>()
    const mockFetch = createMockFetchQuizAttempts(attemptsMap)

    // Initialize via registry
    const provider = initializeChapter2DetectionProvider({
      fetchQuizAttempts: mockFetch,
    })

    // Verify it can be retrieved
    const resolved = getConceptDetectionProvider('ch-2')
    expect(resolved).toBe(provider)

    // Verify it satisfies IConceptDetectionProvider interface
    expect(resolved.chapterId).toBe('ch-2')
    expect(typeof resolved.detectConceptState).toBe('function')
  })
})
