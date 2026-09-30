/**
 * G7 Legacy Safety/Recovery Alignment — Chapters 1–7
 *
 * Central policy for legacy chapters so recovery semantics are explicit and
 * testable without duplicating their canonical concept architectures.
 *
 * Only concept families whose canonical scope directly involves preventing
 * physical injury, infection/exposure, hazardous chemical use, or unsafe tool
 * operation are urgent-safety families. Professionalism, history, wellness,
 * anatomy knowledge, and general theory remain ordinary recovery.
 */
export const LEGACY_URGENT_SAFETY_CONCEPTS = {
  'ch-1': [],
  'ch-2': [],
  'ch-3': ['ch3-ergonomics'],
  'ch-4': [
    'ch4-pathogens-transmission',
    'ch4-disinfection-sterilization',
    'ch4-cross-contamination',
    'ch4-blood-exposure-ppe',
    'ch4-regulatory-chemical-safety',
    'ch4-safe-practice-compliance',
  ],
  'ch-5': [
    'ch5-shears-cutting',
    'ch5-clippers-trimmers',
    'ch5-razors',
    'ch5-thermal-electrical',
    'ch5-equipment-safety',
  ],
  'ch-6': [],
  'ch-7': ['ch7-chemical-safety'],
} as const

export const LEGACY_ORDINARY_RECOVERY_PERCENT = 80
export const LEGACY_URGENT_SAFETY_RECOVERY_PERCENT = 100

export type LegacyChapterId = keyof typeof LEGACY_URGENT_SAFETY_CONCEPTS

export function isLegacyUrgentSafetyConcept(chapterId: LegacyChapterId, conceptId: string): boolean {
  return (LEGACY_URGENT_SAFETY_CONCEPTS[chapterId] as readonly string[]).includes(conceptId)
}

export function requiredLegacyRecoveryPercent(chapterId: LegacyChapterId, conceptId: string): 80 | 100 {
  return isLegacyUrgentSafetyConcept(chapterId, conceptId)
    ? LEGACY_URGENT_SAFETY_RECOVERY_PERCENT
    : LEGACY_ORDINARY_RECOVERY_PERCENT
}

export function hasRecoveredLegacyConcept(input: {
  chapterId: LegacyChapterId
  conceptId: string
  reassessmentPercent: number
}): boolean {
  return input.reassessmentPercent >= requiredLegacyRecoveryPercent(input.chapterId, input.conceptId)
}

/**
 * Recovery appends evidence; it never rewrites/removes the original miss.
 * Callers should persist both records and derive current mastery from the
 * complete evidence stream.
 */
export function preserveLegacyRecoveryEvidence<TInitial, TRecovery>(
  initialEvidence: readonly TInitial[],
  recoveryEvidence: readonly TRecovery[],
): readonly (TInitial | TRecovery)[] {
  return [...initialEvidence, ...recoveryEvidence]
}
