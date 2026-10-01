import type {
  TLSRecommendedAction,
  TLSStatusResolverInput,
  TLSStatusResolverResult,
} from './types'

const STRONG_THRESHOLD = 80

const normalizePercent = (value: number | null | undefined): number | null => {
  if (value == null || !Number.isFinite(value)) return null
  return Math.max(0, Math.min(100, value))
}

const result = (
  input: TLSStatusResolverInput,
  partial: Omit<
    TLSStatusResolverResult,
    'score' | 'evidenceSufficiency' | 'primaryFocus' | 'additionalAreaCount'
  >,
): TLSStatusResolverResult => ({
  ...partial,
  score: normalizePercent(input.chapterPerformancePercent),
  evidenceSufficiency: input.evidenceSufficiency,
  primaryFocus: input.primaryFocus ?? null,
  additionalAreaCount: Math.max(0, Math.floor(input.additionalAreaCount ?? 0)),
})

const recoveryAction = (
  state: TLSStatusResolverInput['recoveryState'],
): TLSRecommendedAction => {
  if (state === 'interrupted') return 'resume_targeted_recovery'
  return 'complete_targeted_recovery'
}

/**
 * Pure TLS status resolver.
 *
 * Contract:
 * - Reads certified chapter evidence/state; never mutates it.
 * - Preserves the authoritative chapter percentage as the one displayed score.
 * - Safety > compliance > failed recovery > significant weakness > score.
 * - Successful recovery remains Improving until fresh independent evidence
 *   confirms current performance at or above the Strong threshold.
 * - One wrong answer / single signal cannot independently force Needs Attention.
 * - Incomplete/interrupted work is not treated as failure.
 * - "Not Enough Evidence" is not a fourth mastery status.
 */
export function resolveTLSStatus(
  input: TLSStatusResolverInput,
): TLSStatusResolverResult {
  const score = normalizePercent(input.chapterPerformancePercent)
  const freshPostRecovery = normalizePercent(
    input.freshIndependentPostRecoveryPercent,
  )

  if (input.evidenceSufficiency === 'insufficient' || score == null) {
    return result(input, {
      status: null,
      reason: 'not_enough_evidence',
      recommendedAction: 'keep_learning',
    })
  }

  if (input.unresolvedSafetyRequirement) {
    return result(input, {
      status: 'needs_attention',
      reason: 'unresolved_safety',
      recommendedAction: 'complete_safety_recovery',
    })
  }

  if (input.unresolvedComplianceRequirement) {
    return result(input, {
      status: 'needs_attention',
      reason: 'unresolved_compliance',
      recommendedAction: 'complete_compliance_recovery',
    })
  }

  if (input.recoveryState === 'failed') {
    return result(input, {
      status: 'needs_attention',
      reason: 'failed_recovery',
      recommendedAction: 'restart_targeted_recovery',
    })
  }

  if (input.weaknessState === 'significant_or_repeated') {
    if (
      input.recoveryState === 'assigned' ||
      input.recoveryState === 'in_progress' ||
      input.recoveryState === 'interrupted'
    ) {
      return result(input, {
        status: 'improving',
        reason: 'recovery_in_progress',
        recommendedAction: recoveryAction(input.recoveryState),
      })
    }

    if (input.recoveryState === 'recovered_awaiting_confirmation') {
      return result(input, {
        status: 'improving',
        reason: 'recovered_awaiting_confirmation',
        recommendedAction: 'collect_fresh_independent_evidence',
      })
    }

    return result(input, {
      status: 'needs_attention',
      reason: 'significant_or_repeated_weakness',
      recommendedAction: 'review_weak_concept',
    })
  }

  if (
    input.recoveryState === 'assigned' ||
    input.recoveryState === 'in_progress' ||
    input.recoveryState === 'interrupted'
  ) {
    return result(input, {
      status: 'improving',
      reason: 'recovery_in_progress',
      recommendedAction: recoveryAction(input.recoveryState),
    })
  }

  if (input.recoveryState === 'recovered_awaiting_confirmation') {
    if (
      input.hasFreshIndependentPostRecoveryEvidence &&
      freshPostRecovery != null
    ) {
      if (freshPostRecovery >= STRONG_THRESHOLD && score >= STRONG_THRESHOLD) {
        return result(input, {
          status: 'strong',
          reason: 'strong_current_evidence',
          recommendedAction: 'continue_normal_learning',
        })
      }

      return result(input, {
        status: 'needs_attention',
        reason: 'below_standard',
        recommendedAction: 'review_weak_concept',
      })
    }

    return result(input, {
      status: 'improving',
      reason: 'recovered_awaiting_confirmation',
      recommendedAction: 'collect_fresh_independent_evidence',
    })
  }

  if (score < STRONG_THRESHOLD) {
    return result(input, {
      status: 'needs_attention',
      reason: 'below_standard',
      recommendedAction: 'review_weak_concept',
    })
  }

  return result(input, {
    status: 'strong',
    reason: 'strong_current_evidence',
    recommendedAction: 'continue_normal_learning',
  })
}
