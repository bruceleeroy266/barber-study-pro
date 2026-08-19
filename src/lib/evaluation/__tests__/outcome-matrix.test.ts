/**
 * Phase 6C-2d — Outcome Matrix Tests
 *
 * Comprehensive tests for all 15 detection-state × confidence combinations.
 * Verifies the deterministic outcome matrix is correctly implemented.
 */

import { describe, it, expect } from 'vitest'
import {
  mapDetectionToOutcome,
  isPendingOutcome,
  isUnsuccessfulOutcome,
  isSuccessfulOutcome,
  isLegitimateOutcome,
  getAllOutcomeMatrixEntries,
  OUTCOME_MATRIX,
} from '../outcome-mapper'
import type { DetectionState, DetectionConfidence, EvaluationOutcome } from '../types'

// ───────────────────────────────────────────────
// Outcome Matrix Tests (All 15 Combinations)
// ───────────────────────────────────────────────

describe('Phase 6C-2d Outcome Matrix', () => {
  describe('mapDetectionToOutcome', () => {
    // Test all 15 combinations explicitly
    const testCases: Array<{
      detectionState: DetectionState
      confidence: DetectionConfidence
      expectedOutcome: EvaluationOutcome
    }> = [
      // insufficient_evidence → pending (all confidence levels)
      { detectionState: 'insufficient_evidence', confidence: 'low', expectedOutcome: 'pending' },
      { detectionState: 'insufficient_evidence', confidence: 'medium', expectedOutcome: 'pending' },
      { detectionState: 'insufficient_evidence', confidence: 'high', expectedOutcome: 'pending' },

      // emerging_weakness → pending (all confidence levels)
      { detectionState: 'emerging_weakness', confidence: 'low', expectedOutcome: 'pending' },
      { detectionState: 'emerging_weakness', confidence: 'medium', expectedOutcome: 'pending' },
      { detectionState: 'emerging_weakness', confidence: 'high', expectedOutcome: 'pending' },

      // repeated_weakness → unsuccessful (all confidence levels)
      { detectionState: 'repeated_weakness', confidence: 'low', expectedOutcome: 'unsuccessful' },
      { detectionState: 'repeated_weakness', confidence: 'medium', expectedOutcome: 'unsuccessful' },
      { detectionState: 'repeated_weakness', confidence: 'high', expectedOutcome: 'unsuccessful' },

      // improving → pending (all confidence levels)
      { detectionState: 'improving', confidence: 'low', expectedOutcome: 'pending' },
      { detectionState: 'improving', confidence: 'medium', expectedOutcome: 'pending' },
      { detectionState: 'improving', confidence: 'high', expectedOutcome: 'pending' },

      // currently_performing_well → successful (all confidence levels)
      { detectionState: 'currently_performing_well', confidence: 'low', expectedOutcome: 'successful' },
      { detectionState: 'currently_performing_well', confidence: 'medium', expectedOutcome: 'successful' },
      { detectionState: 'currently_performing_well', confidence: 'high', expectedOutcome: 'successful' },
    ]

    it.each(testCases)(
      'maps $detectionState + $confidence → $expectedOutcome',
      ({ detectionState, confidence, expectedOutcome }) => {
        const outcome = mapDetectionToOutcome(detectionState, confidence)
        expect(outcome).toBe(expectedOutcome)
      }
    )

    it('covers all 15 combinations', () => {
      const entries = getAllOutcomeMatrixEntries()
      expect(entries).toHaveLength(15)
    })

    it('throws for invalid detection state', () => {
      expect(() => mapDetectionToOutcome('invalid_state' as DetectionState, 'low')).toThrow(
        'Invalid detection state'
      )
    })

    it('throws for invalid confidence', () => {
      expect(() => mapDetectionToOutcome('repeated_weakness', 'invalid' as DetectionConfidence)).toThrow(
        'Invalid confidence level'
      )
    })
  })

  describe('OUTCOME_MATRIX constant', () => {
    it('has correct structure for all detection states', () => {
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

    it('only repeated_weakness produces unsuccessful', () => {
      const states: DetectionState[] = [
        'insufficient_evidence',
        'emerging_weakness',
        'repeated_weakness',
        'improving',
        'currently_performing_well',
      ]

      for (const state of states) {
        for (const confidence of ['low', 'medium', 'high'] as const) {
          const outcome = OUTCOME_MATRIX[state][confidence]
          if (state === 'repeated_weakness') {
            expect(outcome).toBe('unsuccessful')
          } else {
            expect(outcome).not.toBe('unsuccessful')
          }
        }
      }
    })

    it('only currently_performing_well produces successful', () => {
      const states: DetectionState[] = [
        'insufficient_evidence',
        'emerging_weakness',
        'repeated_weakness',
        'improving',
        'currently_performing_well',
      ]

      for (const state of states) {
        for (const confidence of ['low', 'medium', 'high'] as const) {
          const outcome = OUTCOME_MATRIX[state][confidence]
          if (state === 'currently_performing_well') {
            expect(outcome).toBe('successful')
          } else {
            expect(outcome).not.toBe('successful')
          }
        }
      }
    })
  })

  describe('Outcome Predicates', () => {
    it('isPendingOutcome identifies pending outcomes', () => {
      expect(isPendingOutcome('pending')).toBe(true)
      expect(isPendingOutcome('unsuccessful')).toBe(false)
      expect(isPendingOutcome('successful')).toBe(false)
    })

    it('isUnsuccessfulOutcome identifies unsuccessful outcomes', () => {
      expect(isUnsuccessfulOutcome('pending')).toBe(false)
      expect(isUnsuccessfulOutcome('unsuccessful')).toBe(true)
      expect(isUnsuccessfulOutcome('successful')).toBe(false)
    })

    it('isSuccessfulOutcome identifies successful outcomes', () => {
      expect(isSuccessfulOutcome('pending')).toBe(false)
      expect(isSuccessfulOutcome('unsuccessful')).toBe(false)
      expect(isSuccessfulOutcome('successful')).toBe(true)
    })
  })

  describe('isLegitimateOutcome', () => {
    it('validates unsuccessful only from repeated_weakness', () => {
      expect(isLegitimateOutcome('unsuccessful', 'repeated_weakness')).toBe(true)
      expect(isLegitimateOutcome('unsuccessful', 'emerging_weakness')).toBe(false)
      expect(isLegitimateOutcome('unsuccessful', 'insufficient_evidence')).toBe(false)
      expect(isLegitimateOutcome('unsuccessful', 'improving')).toBe(false)
      expect(isLegitimateOutcome('unsuccessful', 'currently_performing_well')).toBe(false)
    })

    it('validates successful only from currently_performing_well', () => {
      expect(isLegitimateOutcome('successful', 'currently_performing_well')).toBe(true)
      expect(isLegitimateOutcome('successful', 'repeated_weakness')).toBe(false)
      expect(isLegitimateOutcome('successful', 'emerging_weakness')).toBe(false)
      expect(isLegitimateOutcome('successful', 'insufficient_evidence')).toBe(false)
      expect(isLegitimateOutcome('successful', 'improving')).toBe(false)
    })

    it('validates pending from non-terminal states', () => {
      expect(isLegitimateOutcome('pending', 'insufficient_evidence')).toBe(true)
      expect(isLegitimateOutcome('pending', 'emerging_weakness')).toBe(true)
      expect(isLegitimateOutcome('pending', 'improving')).toBe(true)
      expect(isLegitimateOutcome('pending', 'repeated_weakness')).toBe(false)
      expect(isLegitimateOutcome('pending', 'currently_performing_well')).toBe(false)
    })
  })
})

// ───────────────────────────────────────────────
// Pending Outcome Behavior Tests
// ───────────────────────────────────────────────

describe('Pending Outcome Behavior', () => {
  it('pending does not increment unsuccessful-cycle counts', () => {
    // This is a semantic test - pending outcomes should not be counted
    // as unsuccessful in escalation logic
    const outcome: EvaluationOutcome = 'pending'
    expect(isUnsuccessfulOutcome(outcome)).toBe(false)
  })

  it('pending does not trigger instructor escalation', () => {
    // Pending outcomes should not contribute to escalation threshold
    const outcome: EvaluationOutcome = 'pending'
    expect(isUnsuccessfulOutcome(outcome)).toBe(false)
  })

  it('pending is not treated as successful', () => {
    const outcome: EvaluationOutcome = 'pending'
    expect(isSuccessfulOutcome(outcome)).toBe(false)
  })

  it('pending preserves cycle for future evaluation', () => {
    // Pending is a non-terminal state - the cycle remains open
    const outcome: EvaluationOutcome = 'pending'
    expect(isPendingOutcome(outcome)).toBe(true)
    expect(isUnsuccessfulOutcome(outcome)).toBe(false)
    expect(isSuccessfulOutcome(outcome)).toBe(false)
  })
})
