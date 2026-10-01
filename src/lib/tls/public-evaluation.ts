import type { TLSChapterEvidenceSnapshot } from './evidence-adapter'
import { evaluateTLSChapter } from './evaluation-pipeline'
import type { TLSAudience } from './presentation-model'
import { buildTLSPresentation } from './presentation-model'
import type { TLSPublicSnapshot } from './public-contract'
import { toTLSPublicSnapshot } from './public-contract'

export interface TLSPublicEvaluationRequest {
  audience: TLSAudience
  evidence: TLSChapterEvidenceSnapshot
}

/**
 * TLS-1B.6 single public evaluation entry point.
 *
 * Composes the certified pure TLS layers:
 * canonical evidence snapshot -> evaluation -> audience presentation -> public snapshot.
 *
 * This function does not query storage, mutate evidence, render UI,
 * recalculate chapter grades, or expose internal resolver structures.
 */
export function evaluateTLSPublicSnapshot(
  request: TLSPublicEvaluationRequest,
): TLSPublicSnapshot {
  const evaluation = evaluateTLSChapter(request.evidence)
  const presentation = buildTLSPresentation(evaluation, request.audience)
  return toTLSPublicSnapshot(presentation)
}
