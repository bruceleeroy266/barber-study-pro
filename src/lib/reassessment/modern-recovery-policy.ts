/**
 * HA-3 runtime recovery policy for modern Chapters 8-18.
 *
 * The certified chapter modules all use five-question formal reassessments,
 * 80% ordinary recovery, and 100% urgent-safety recovery. This helper keeps
 * the API's terminal decision server-authoritative instead of relying on the
 * generic learning-gap detector to infer a recovery threshold.
 */
export type ModernRecoveryChapterId =
  | 'ch-8' | 'ch-9' | 'ch-10' | 'ch-11' | 'ch-12' | 'ch-13'
  | 'ch-14' | 'ch-15' | 'ch-16' | 'ch-17' | 'ch-18'

export function requiredModernRecoveryPercent(urgentSafety: boolean): 80 | 100 {
  return urgentSafety ? 100 : 80
}

export function hasRecoveredModernConcept(input: {
  correctCount: number
  questionCount: number
  urgentSafety: boolean
}): boolean {
  if (input.questionCount !== 5) return false
  const percent = (input.correctCount / input.questionCount) * 100
  return percent >= requiredModernRecoveryPercent(input.urgentSafety)
}
