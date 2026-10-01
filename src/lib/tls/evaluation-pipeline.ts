import { buildTLSStatusInput, type TLSChapterEvidenceSnapshot } from './evidence-adapter'
import { resolveTLSStatus } from './status-resolver'
import type { TLSStatusResolverInput, TLSStatusResolverResult } from './types'

export interface TLSEvaluationSnapshot {
  input: TLSStatusResolverInput
  result: TLSStatusResolverResult
}

/**
 * TLS-1B.3 evaluation pipeline.
 *
 * This is the single pure entry point that composes the certified evidence
 * adapter with the certified status resolver. It performs no database access,
 * no chapter-specific branching, no evidence mutation, and no UI formatting.
 */
export function evaluateTLSChapter(
  snapshot: TLSChapterEvidenceSnapshot,
): TLSEvaluationSnapshot {
  const input = buildTLSStatusInput(snapshot)
  const result = resolveTLSStatus(input)

  return { input, result }
}
