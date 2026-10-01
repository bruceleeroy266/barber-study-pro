import type {
  TLSAudience,
  TLSPresentationModel,
} from './presentation-model'

export const TLS_PUBLIC_CONTRACT_VERSION = '1' as const

export type TLSPublicStatus =
  | 'strong'
  | 'improving'
  | 'needs_attention'
  | 'keep_learning'

export type TLSPublicAction =
  | 'keep_learning'
  | 'complete_safety_review'
  | 'complete_required_review'
  | 'restart_focused_review'
  | 'finish_focused_review'
  | 'continue_focused_review'
  | 'review_focus_area'
  | 'complete_fresh_check'
  | 'continue_learning'

export interface TLSStudentPublicSnapshot {
  version: typeof TLS_PUBLIC_CONTRACT_VERSION
  audience: 'student'
  score: number | null
  status: TLSPublicStatus
  statusLabel: string
  action: TLSPublicAction
  actionLabel: string
  supportingText: string
}

export interface TLSInstructorPublicSnapshot {
  version: typeof TLS_PUBLIC_CONTRACT_VERSION
  audience: 'instructor'
  score: number | null
  status: TLSPublicStatus
  statusLabel: string
  action: TLSPublicAction
  actionLabel: string
  supportingText: string
  primaryFocus: string | null
  additionalAreaCount: number
}

export type TLSPublicSnapshot =
  | TLSStudentPublicSnapshot
  | TLSInstructorPublicSnapshot

const publicStatus = (
  presentation: TLSPresentationModel,
): TLSPublicStatus => {
  if (presentation.status === 'strong') return 'strong'
  if (presentation.status === 'improving') return 'improving'
  if (presentation.status === 'needs_attention') return 'needs_attention'
  return 'keep_learning'
}

const publicAction: Record<TLSPresentationModel['action'], TLSPublicAction> = {
  keep_learning: 'keep_learning',
  complete_safety_recovery: 'complete_safety_review',
  complete_compliance_recovery: 'complete_required_review',
  restart_targeted_recovery: 'restart_focused_review',
  complete_targeted_recovery: 'finish_focused_review',
  resume_targeted_recovery: 'continue_focused_review',
  review_weak_concept: 'review_focus_area',
  collect_fresh_independent_evidence: 'complete_fresh_check',
  continue_normal_learning: 'continue_learning',
}

/**
 * TLS-1B.5 stable public contract.
 *
 * This is the only payload shape future TLS UI/API layers should consume.
 * It intentionally strips resolver input, reason codes, confidence, recovery
 * state, raw evidence, and all chapter-specific identifiers.
 */
export function toTLSPublicSnapshot(
  presentation: TLSPresentationModel,
): TLSPublicSnapshot {
  const common = {
    version: TLS_PUBLIC_CONTRACT_VERSION,
    score: presentation.score,
    status: publicStatus(presentation),
    statusLabel: presentation.statusLabel,
    action: publicAction[presentation.action],
    actionLabel: presentation.actionLabel,
    supportingText: presentation.supportingText,
  } as const

  if (presentation.audience === 'student') {
    return {
      ...common,
      audience: 'student',
    }
  }

  return {
    ...common,
    audience: 'instructor',
    primaryFocus: presentation.primaryFocus,
    additionalAreaCount: presentation.additionalAreaCount,
  }
}

export function isTLSPublicSnapshotForAudience<
  T extends TLSAudience,
>(
  snapshot: TLSPublicSnapshot,
  audience: T,
): snapshot is T extends 'student'
  ? TLSStudentPublicSnapshot
  : TLSInstructorPublicSnapshot {
  return snapshot.audience === audience
}
