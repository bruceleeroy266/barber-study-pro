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

  // Certified chapter safety evaluators determine urgency chapter-wide across
  // the recent tagged safety window. For a concept's cycle, the 100% threshold
  // applies only when that concept is one of the concept families affected by
  // those urgent misses.
  const misses = tagged.filter(({ result }) => !result.isCorrect)
  const distinctItems = new Set(misses.map(({ result }) => result.questionId))
  const hazards = new Set(misses.map(({ tag }) => tag.hazard))
  const affectedConcepts = new Set(misses.map(({ tag }) => tag.conceptFamilyId))
  const chapterUrgent =
    distinctItems.size >= input.rules.urgentDistinctSafetyMisses &&
    hazards.size >= input.rules.urgentDistinctHazards
  const urgentSafety = chapterUrgent && affectedConcepts.has(input.conceptId)

  return { urgentSafety, requiredPassPercent: urgentSafety ? 100 : 80 }
}
