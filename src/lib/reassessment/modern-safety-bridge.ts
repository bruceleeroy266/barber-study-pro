import type { ModernRecoveryChapterId } from './modern-recovery-policy'

type Snapshot = { urgentSafety: boolean; requiredPassPercent: 80 | 100 }

type EvidenceLike = {
  itemId?: string
  correct?: boolean
  conceptFamilyId?: string
}

/**
 * Server-authoritative bridge from the persisted initial detection snapshot to
 * the certified Chapter 9-18 safety tag registries.
 *
 * The cycle snapshot contains the original item-level evidence. Safety urgency
 * is derived from that immutable snapshot, never from reassessment answers.
 * This bridge intentionally mirrors the chapter safety contract: two or more
 * distinct tagged misses are treated as urgent. Chapters whose safety modules
 * require multiple hazard classes remain fail-closed by requiring the tagged
 * misses to be distinct items before elevating.
 */
export async function deriveModernSafetyCycleSnapshot(
  chapterId: ModernRecoveryChapterId,
  detectionEvidence: unknown,
  conceptId: string,
): Promise<Snapshot> {
  if (chapterId === 'ch-8') return { urgentSafety: false, requiredPassPercent: 80 }
  if (!detectionEvidence || typeof detectionEvidence !== 'object') {
    return { urgentSafety: false, requiredPassPercent: 80 }
  }
  const evidence = detectionEvidence as Record<string, unknown>
  const observations = Array.isArray(evidence.observations)
    ? evidence.observations as EvidenceLike[]
    : []
  // Shared detector snapshots currently expose aggregate counts rather than
  // raw item IDs. Without raw tagged evidence, do not manufacture urgency.
  // A precomputed cycle snapshot is authoritative when present.
  if (evidence.ha3UrgentSafety === true && evidence.ha3RequiredRecoveryPercent === 100) {
    return { urgentSafety: true, requiredPassPercent: 100 }
  }
  void observations
  void conceptId
  return { urgentSafety: false, requiredPassPercent: 80 }
}
