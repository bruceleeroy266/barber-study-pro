export type TLSStatus = 'strong' | 'improving' | 'needs_attention'

export type TLSEvidenceSufficiency = 'sufficient' | 'insufficient'

export type TLSRecoveryState =
  | 'none'
  | 'assigned'
  | 'in_progress'
  | 'interrupted'
  | 'failed'
  | 'recovered_awaiting_confirmation'
  | 'completed'

export type TLSWeaknessState =
  | 'none'
  | 'single_signal'
  | 'significant_or_repeated'

export type TLSPrimaryReason =
  | 'not_enough_evidence'
  | 'unresolved_safety'
  | 'unresolved_compliance'
  | 'failed_recovery'
  | 'significant_or_repeated_weakness'
  | 'below_standard'
  | 'recovery_in_progress'
  | 'recovered_awaiting_confirmation'
  | 'strong_current_evidence'

export type TLSRecommendedAction =
  | 'keep_learning'
  | 'complete_safety_recovery'
  | 'complete_compliance_recovery'
  | 'restart_targeted_recovery'
  | 'complete_targeted_recovery'
  | 'resume_targeted_recovery'
  | 'review_weak_concept'
  | 'collect_fresh_independent_evidence'
  | 'continue_normal_learning'

export interface TLSStatusResolverInput {
  /**
   * The authoritative existing chapter percentage. TLS never recalculates or
   * replaces the certified chapter grade.
   */
  chapterPerformancePercent: number | null

  evidenceSufficiency: TLSEvidenceSufficiency

  /**
   * Certified confidence from the shared evidence system. Carried through for
   * presentation and future policy work; it is not allowed to override safety,
   * compliance, or recovery requirements.
   */
  confidence:
    | 'insufficient_evidence'
    | 'emerging'
    | 'developing'
    | 'proficient'
    | 'strong'

  weaknessState: TLSWeaknessState
  recoveryState: TLSRecoveryState

  unresolvedSafetyRequirement: boolean
  unresolvedComplianceRequirement: boolean

  /**
   * True only when fresh, normal, independent post-recovery evidence exists.
   * Assisted practice, hints, explanations, and remediation practice do not
   * satisfy this confirmation requirement.
   */
  hasFreshIndependentPostRecoveryEvidence: boolean

  /**
   * Optional current score from that fresh independent evidence. This is not a
   * second grade and is used only to confirm whether a recovered learner can
   * transition to Strong.
   */
  freshIndependentPostRecoveryPercent?: number | null

  primaryFocus?: string | null
  additionalAreaCount?: number
}

export interface TLSStatusResolverResult {
  /**
   * Null means the learner does not yet have enough evidence for a mastery
   * status. "Not Enough Evidence" is deliberately not modeled as a fourth TLS
   * status.
   */
  status: TLSStatus | null
  score: number | null
  evidenceSufficiency: TLSEvidenceSufficiency
  reason: TLSPrimaryReason
  recommendedAction: TLSRecommendedAction
  primaryFocus: string | null
  additionalAreaCount: number
}
