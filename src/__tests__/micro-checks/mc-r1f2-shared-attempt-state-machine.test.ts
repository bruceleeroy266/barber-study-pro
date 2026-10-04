import { describe, expect, it } from 'vitest'
import {
  INITIAL_MICRO_CHECK_ATTEMPT,
  microCheckAttemptAllowsExplanation,
  microCheckAttemptAllowsHint,
  microCheckAttemptAllowsInitialSubmission,
  microCheckAttemptAllowsRemediationSubmission,
  microCheckAttemptEvidencePhases,
  microCheckAttemptIsTerminal,
  reduceMicroCheckAttempt,
} from '@/lib/micro-checks/attempt-state'

describe('MC-R1F.2 shared attempt state machine', () => {
  it('starts with initial submission enabled and no hint or explanation', () => {
    expect(INITIAL_MICRO_CHECK_ATTEMPT.state).toBe('initial_active')
    expect(microCheckAttemptAllowsInitialSubmission(INITIAL_MICRO_CHECK_ATTEMPT)).toBe(true)
    expect(microCheckAttemptAllowsHint(INITIAL_MICRO_CHECK_ATTEMPT)).toBe(false)
    expect(microCheckAttemptAllowsExplanation(INITIAL_MICRO_CHECK_ATTEMPT)).toBe(false)
    expect(microCheckAttemptAllowsRemediationSubmission(INITIAL_MICRO_CHECK_ATTEMPT)).toBe(false)
  })

  it('ends immediately after a correct initial submission', () => {
    const next = reduceMicroCheckAttempt(INITIAL_MICRO_CHECK_ATTEMPT, {
      type: 'SUBMIT_INITIAL',
      correct: true,
    })

    expect(next).toEqual({
      state: 'initial_correct',
      initialCorrect: true,
      remediationCorrect: null,
    })
    expect(microCheckAttemptIsTerminal(next)).toBe(true)
    expect(microCheckAttemptAllowsHint(next)).toBe(false)
    expect(microCheckAttemptAllowsExplanation(next)).toBe(true)
    expect(microCheckAttemptEvidencePhases(next)).toEqual(['initial'])
  })

  it('moves an incorrect initial submission into hint state without revealing explanation', () => {
    const next = reduceMicroCheckAttempt(INITIAL_MICRO_CHECK_ATTEMPT, {
      type: 'SUBMIT_INITIAL',
      correct: false,
    })

    expect(next).toEqual({
      state: 'initial_incorrect_hint',
      initialCorrect: false,
      remediationCorrect: null,
    })
    expect(microCheckAttemptAllowsHint(next)).toBe(true)
    expect(microCheckAttemptAllowsExplanation(next)).toBe(false)
    expect(microCheckAttemptEvidencePhases(next)).toEqual(['initial'])
  })

  it('requires an explicit remediation start before a second submission', () => {
    const missed = reduceMicroCheckAttempt(INITIAL_MICRO_CHECK_ATTEMPT, {
      type: 'SUBMIT_INITIAL',
      correct: false,
    })
    const retry = reduceMicroCheckAttempt(missed, {
      type: 'START_REMEDIATION',
    })

    expect(retry.state).toBe('remediation_active')
    expect(microCheckAttemptAllowsHint(retry)).toBe(true)
    expect(microCheckAttemptAllowsRemediationSubmission(retry)).toBe(true)
    expect(microCheckAttemptAllowsExplanation(retry)).toBe(false)
  })

  it('records remediation separately and preserves the original initial miss', () => {
    const missed = reduceMicroCheckAttempt(INITIAL_MICRO_CHECK_ATTEMPT, {
      type: 'SUBMIT_INITIAL',
      correct: false,
    })
    const retry = reduceMicroCheckAttempt(missed, {
      type: 'START_REMEDIATION',
    })
    const completed = reduceMicroCheckAttempt(retry, {
      type: 'SUBMIT_REMEDIATION',
      correct: true,
    })

    expect(completed).toEqual({
      state: 'remediation_complete',
      initialCorrect: false,
      remediationCorrect: true,
    })
    expect(microCheckAttemptEvidencePhases(completed)).toEqual([
      'initial',
      'remediation',
    ])
    expect(microCheckAttemptAllowsExplanation(completed)).toBe(true)
    expect(microCheckAttemptIsTerminal(completed)).toBe(true)
  })

  it('supports a failed remediation without reopening the initial attempt', () => {
    const missed = reduceMicroCheckAttempt(INITIAL_MICRO_CHECK_ATTEMPT, {
      type: 'SUBMIT_INITIAL',
      correct: false,
    })
    const retry = reduceMicroCheckAttempt(missed, {
      type: 'START_REMEDIATION',
    })
    const completed = reduceMicroCheckAttempt(retry, {
      type: 'SUBMIT_REMEDIATION',
      correct: false,
    })

    expect(completed.initialCorrect).toBe(false)
    expect(completed.remediationCorrect).toBe(false)
    expect(completed.state).toBe('remediation_complete')
    expect(microCheckAttemptAllowsInitialSubmission(completed)).toBe(false)
  })

  it('rejects duplicate initial submissions', () => {
    const missed = reduceMicroCheckAttempt(INITIAL_MICRO_CHECK_ATTEMPT, {
      type: 'SUBMIT_INITIAL',
      correct: false,
    })

    expect(() =>
      reduceMicroCheckAttempt(missed, {
        type: 'SUBMIT_INITIAL',
        correct: true,
      }),
    ).toThrow('Invalid micro-check attempt transition')
  })

  it('rejects remediation before an initial miss', () => {
    expect(() =>
      reduceMicroCheckAttempt(INITIAL_MICRO_CHECK_ATTEMPT, {
        type: 'START_REMEDIATION',
      }),
    ).toThrow('Invalid micro-check attempt transition')
  })

  it('rejects repeated remediation after completion', () => {
    const missed = reduceMicroCheckAttempt(INITIAL_MICRO_CHECK_ATTEMPT, {
      type: 'SUBMIT_INITIAL',
      correct: false,
    })
    const retry = reduceMicroCheckAttempt(missed, {
      type: 'START_REMEDIATION',
    })
    const completed = reduceMicroCheckAttempt(retry, {
      type: 'SUBMIT_REMEDIATION',
      correct: true,
    })

    expect(() =>
      reduceMicroCheckAttempt(completed, {
        type: 'START_REMEDIATION',
      }),
    ).toThrow('Invalid micro-check attempt transition')
  })
})
