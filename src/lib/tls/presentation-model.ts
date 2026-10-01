import type { TLSEvaluationSnapshot } from './evaluation-pipeline'
import type { TLSRecommendedAction, TLSStatus } from './types'

export type TLSAudience = 'student' | 'instructor'

export type TLSDisplayStatus =
  | 'Strong'
  | 'Improving'
  | 'Needs Attention'
  | 'Keep Learning'

export interface TLSPresentationModel {
  audience: TLSAudience
  score: number | null
  status: TLSStatus | null
  statusLabel: TLSDisplayStatus
  action: TLSRecommendedAction
  actionLabel: string
  primaryFocus: string | null
  additionalAreaCount: number
  supportingText: string
}

const statusLabel = (status: TLSStatus | null): TLSDisplayStatus => {
  if (status === 'strong') return 'Strong'
  if (status === 'improving') return 'Improving'
  if (status === 'needs_attention') return 'Needs Attention'
  return 'Keep Learning'
}

const studentActionLabel: Record<TLSRecommendedAction, string> = {
  keep_learning: 'Keep learning',
  complete_safety_recovery: 'Complete your safety review',
  complete_compliance_recovery: 'Complete your required review',
  restart_targeted_recovery: 'Review this topic again',
  complete_targeted_recovery: 'Finish your focused review',
  resume_targeted_recovery: 'Continue your focused review',
  review_weak_concept: 'Review your focus area',
  collect_fresh_independent_evidence: 'Try a fresh practice check',
  continue_normal_learning: 'Continue to the next learning activity',
}

const instructorActionLabel: Record<TLSRecommendedAction, string> = {
  keep_learning: 'Allow more evidence to accumulate',
  complete_safety_recovery: 'Require safety recovery before progression',
  complete_compliance_recovery: 'Require compliance recovery before progression',
  restart_targeted_recovery: 'Restart targeted remediation',
  complete_targeted_recovery: 'Have the student complete targeted remediation',
  resume_targeted_recovery: 'Have the student resume targeted remediation',
  review_weak_concept: 'Intervene on the primary weak concept',
  collect_fresh_independent_evidence: 'Collect fresh independent evidence',
  continue_normal_learning: 'Continue normal instruction',
}

const studentSupportingText = (
  evaluation: TLSEvaluationSnapshot,
): string => {
  const { result } = evaluation

  if (result.status == null) {
    return 'There is not enough evidence yet to determine a learning status. Keep working so ASCYN PRO can build a clearer picture.'
  }

  if (result.status === 'strong') {
    return 'Your current learning evidence is strong. Keep using the same habits as you continue.'
  }

  if (result.status === 'improving') {
    return 'You are making progress. Complete the recommended next step so your understanding can be confirmed with fresh work.'
  }

  return 'This area needs more attention right now. Focus on the recommended next step before moving on.'
}

const instructorSupportingText = (
  evaluation: TLSEvaluationSnapshot,
): string => {
  const { input, result } = evaluation

  if (result.status == null) {
    return 'Evidence is currently insufficient for a mastery status. Continue instruction and collect additional normal learning evidence.'
  }

  if (result.reason === 'unresolved_safety') {
    return 'An unresolved safety requirement takes priority over the current chapter percentage.'
  }

  if (result.reason === 'unresolved_compliance') {
    return 'An unresolved compliance requirement takes priority over the current chapter percentage.'
  }

  if (result.status === 'improving') {
    return input.recoveryState === 'recovered_awaiting_confirmation'
      ? 'Recovery evidence is positive, but fresh independent evidence is still required before Strong can be shown.'
      : 'The student is actively working through a targeted recovery step.'
  }

  if (result.status === 'needs_attention') {
    return result.primaryFocus
      ? `Current evidence indicates a meaningful weakness centered on ${result.primaryFocus}.`
      : 'Current evidence indicates a meaningful weakness that needs instructor attention.'
  }

  return 'Current evidence supports normal progression without an additional TLS intervention.'
}

/**
 * TLS-1B.4 pure presentation builder.
 *
 * Converts the certified evaluation snapshot into an audience-safe view model.
 * It does not query data, mutate evidence, calculate a second score, or render UI.
 */
export function buildTLSPresentation(
  evaluation: TLSEvaluationSnapshot,
  audience: TLSAudience,
): TLSPresentationModel {
  const { result } = evaluation

  return {
    audience,
    score: result.score,
    status: result.status,
    statusLabel: statusLabel(result.status),
    action: result.recommendedAction,
    actionLabel:
      audience === 'student'
        ? studentActionLabel[result.recommendedAction]
        : instructorActionLabel[result.recommendedAction],
    primaryFocus: audience === 'instructor' ? result.primaryFocus : null,
    additionalAreaCount:
      audience === 'instructor' ? result.additionalAreaCount : 0,
    supportingText:
      audience === 'student'
        ? studentSupportingText(evaluation)
        : instructorSupportingText(evaluation),
  }
}
