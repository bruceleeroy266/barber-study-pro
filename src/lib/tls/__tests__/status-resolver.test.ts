import { describe, expect, it } from 'vitest'
import { resolveTLSStatus } from '../status-resolver'
import type { TLSStatusResolverInput } from '../types'

const base = (
  overrides: Partial<TLSStatusResolverInput> = {},
): TLSStatusResolverInput => ({
  chapterPerformancePercent: 88,
  evidenceSufficiency: 'sufficient',
  confidence: 'proficient',
  weaknessState: 'none',
  recoveryState: 'none',
  unresolvedSafetyRequirement: false,
  unresolvedComplianceRequirement: false,
  hasFreshIndependentPostRecoveryEvidence: false,
  freshIndependentPostRecoveryPercent: null,
  primaryFocus: null,
  additionalAreaCount: 0,
  ...overrides,
})

describe('TLS-1B.1 pure status resolver', () => {
  it('returns Strong for sufficient current evidence at or above 80 with no unresolved requirement', () => {
    expect(resolveTLSStatus(base())).toMatchObject({
      score: 88,
      status: 'strong',
      reason: 'strong_current_evidence',
      recommendedAction: 'continue_normal_learning',
    })
  })

  it('does not create a fourth status when evidence is insufficient', () => {
    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: null,
          evidenceSufficiency: 'insufficient',
          confidence: 'insufficient_evidence',
        }),
      ),
    ).toMatchObject({
      status: null,
      reason: 'not_enough_evidence',
      recommendedAction: 'keep_learning',
    })
  })

  it('lets unresolved safety override a passing score', () => {
    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: 96,
          unresolvedSafetyRequirement: true,
        }),
      ),
    ).toMatchObject({
      status: 'needs_attention',
      reason: 'unresolved_safety',
      recommendedAction: 'complete_safety_recovery',
    })
  })

  it('lets unresolved compliance override a passing score', () => {
    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: 94,
          unresolvedComplianceRequirement: true,
        }),
      ),
    ).toMatchObject({
      status: 'needs_attention',
      reason: 'unresolved_compliance',
      recommendedAction: 'complete_compliance_recovery',
    })
  })

  it('gives safety priority over compliance and all lower-priority conditions', () => {
    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: 50,
          unresolvedSafetyRequirement: true,
          unresolvedComplianceRequirement: true,
          recoveryState: 'failed',
          weaknessState: 'significant_or_repeated',
        }),
      ).reason,
    ).toBe('unresolved_safety')
  })

  it('marks a failed recovery Needs Attention without erasing the chapter score', () => {
    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: 82,
          recoveryState: 'failed',
        }),
      ),
    ).toMatchObject({
      score: 82,
      status: 'needs_attention',
      reason: 'failed_recovery',
      recommendedAction: 'restart_targeted_recovery',
    })
  })

  it('treats active recovery as Improving instead of failure', () => {
    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: 72,
          weaknessState: 'significant_or_repeated',
          recoveryState: 'in_progress',
          primaryFocus: 'Infection Control',
        }),
      ),
    ).toMatchObject({
      status: 'improving',
      reason: 'recovery_in_progress',
      recommendedAction: 'complete_targeted_recovery',
      primaryFocus: 'Infection Control',
    })
  })

  it('treats interrupted recovery as Improving and recommends resuming it', () => {
    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: 72,
          weaknessState: 'significant_or_repeated',
          recoveryState: 'interrupted',
        }),
      ),
    ).toMatchObject({
      status: 'improving',
      reason: 'recovery_in_progress',
      recommendedAction: 'resume_targeted_recovery',
    })
  })

  it('keeps successful recovery Improving until fresh independent evidence confirms Strong', () => {
    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: 86,
          recoveryState: 'recovered_awaiting_confirmation',
          hasFreshIndependentPostRecoveryEvidence: false,
        }),
      ),
    ).toMatchObject({
      status: 'improving',
      reason: 'recovered_awaiting_confirmation',
      recommendedAction: 'collect_fresh_independent_evidence',
    })
  })

  it('promotes recovered learning to Strong only after fresh independent evidence is at least 80', () => {
    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: 86,
          recoveryState: 'recovered_awaiting_confirmation',
          hasFreshIndependentPostRecoveryEvidence: true,
          freshIndependentPostRecoveryPercent: 84,
        }),
      ),
    ).toMatchObject({
      status: 'strong',
      reason: 'strong_current_evidence',
      recommendedAction: 'continue_normal_learning',
    })
  })

  it('does not promote recovered learning when fresh independent evidence is below 80', () => {
    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: 86,
          recoveryState: 'recovered_awaiting_confirmation',
          hasFreshIndependentPostRecoveryEvidence: true,
          freshIndependentPostRecoveryPercent: 76,
        }),
      ),
    ).toMatchObject({
      status: 'needs_attention',
      reason: 'below_standard',
      recommendedAction: 'review_weak_concept',
    })
  })

  it('requires repeated or significant weakness before a weakness signal alone can force Needs Attention', () => {
    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: 91,
          weaknessState: 'single_signal',
        }),
      ),
    ).toMatchObject({
      status: 'strong',
      reason: 'strong_current_evidence',
    })

    expect(
      resolveTLSStatus(
        base({
          chapterPerformancePercent: 91,
          weaknessState: 'significant_or_repeated',
        }),
      ),
    ).toMatchObject({
      status: 'needs_attention',
      reason: 'significant_or_repeated_weakness',
    })
  })

  it('uses the existing chapter percentage instead of creating a second TLS grade', () => {
    const resolved = resolveTLSStatus(
      base({
        chapterPerformancePercent: 83.5,
        primaryFocus: 'Sanitation',
        additionalAreaCount: 2,
      }),
    )

    expect(resolved.score).toBe(83.5)
    expect(resolved.primaryFocus).toBe('Sanitation')
    expect(resolved.additionalAreaCount).toBe(2)
  })

  it('is deterministic for identical inputs', () => {
    const input = base({
      chapterPerformancePercent: 79,
      weaknessState: 'significant_or_repeated',
      recoveryState: 'assigned',
      primaryFocus: 'Disinfection',
      additionalAreaCount: 3,
    })

    expect(resolveTLSStatus(input)).toEqual(resolveTLSStatus(input))
  })
})
