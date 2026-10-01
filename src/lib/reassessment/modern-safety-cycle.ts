import type { ModernRecoveryChapterId } from './modern-recovery-policy'

export interface ModernSafetyCycleSnapshot {
  urgentSafety: boolean
  requiredPassPercent: 80 | 100
}

/**
 * Derive the live recovery requirement only from the persisted detection
 * snapshot captured when the remediation cycle was created.
 *
 * New HA-3 cycles persist these two fields in detection_evidence. Older cycles
 * without the snapshot fail closed to ordinary recovery unless their chapter
 * has a dedicated evaluator (Chapter 8).
 */
export function getPersistedModernSafetyCycleSnapshot(
  chapterId: ModernRecoveryChapterId,
  detectionEvidence: unknown,
): ModernSafetyCycleSnapshot {
  void chapterId
  if (!detectionEvidence || typeof detectionEvidence !== 'object') {
    return { urgentSafety: false, requiredPassPercent: 80 }
  }
  const record = detectionEvidence as Record<string, unknown>
  const urgentSafety = record.ha3UrgentSafety === true
  const requiredPassPercent = record.ha3RequiredRecoveryPercent === 100 ? 100 : 80
  return {
    urgentSafety: urgentSafety && requiredPassPercent === 100,
    requiredPassPercent,
  }
}
