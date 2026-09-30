import type { ModernRecoveryChapterId } from './modern-recovery-policy'

export interface ModernSafetyTag {
  itemId: string
  conceptFamilyId: string
  hazard: string
}

export interface ModernSafetyRules {
  recentWindow: number
  urgentDistinctSafetyMisses: number
  urgentDistinctHazards: number
}

export interface ModernSafetySnapshotInput {
  chapterId: ModernRecoveryChapterId
  conceptId: string
  evidence: {
    results?: readonly { questionId: string; isCorrect: boolean; completedAt?: string }[]
  }
  tags: readonly ModernSafetyTag[]
  rules: ModernSafetyRules
}

/**
 * Pure server-side safety bridge. It consumes the immutable item-level
 * detection snapshot and the chapter's certified safety tag registry.
 * Reassessment answers never participate in deciding whether the cycle is
 * urgent.
 */
export function deriveModernSafetySnapshot(input: ModernSafetySnapshotInput): {
  urgentSafety: boolean
  requiredPassPercent: 80 | 100
} {
  const results = [...(input.evidence.results ?? [])]
  const tagById = new Map(input.tags.map((tag) => [tag.itemId, tag]))
  const tagged = results
    .map((result) => ({ result, tag: tagById.get(result.questionId) }))
    .filter((entry): entry is { result: { questionId: string; isCorrect: boolean; completedAt?: string }; tag: ModernSafetyTag } => !!entry.tag)
    .sort((a, b) => String(a.result.completedAt ?? '').localeCompare(String(b.result.completedAt ?? '')))
    .slice(-input.rules.recentWindow)

  const misses = tagged.filter(
    ({ result, tag }) => !result.isCorrect && tag.conceptFamilyId === input.conceptId,
  )
  const distinctItems = new Set(misses.map(({ result }) => result.questionId))
  const hazards = new Set(misses.map(({ tag }) => tag.hazard))
  const urgentSafety =
    distinctItems.size >= input.rules.urgentDistinctSafetyMisses &&
    hazards.size >= input.rules.urgentDistinctHazards

  return { urgentSafety, requiredPassPercent: urgentSafety ? 100 : 80 }
}
