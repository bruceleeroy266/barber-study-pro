import type { ModernRecoveryChapterId } from './modern-recovery-policy'
import { deriveModernSafetySnapshot, type ModernSafetyRules, type ModernSafetyTag } from './modern-safety-snapshot'

type ChapterSafetyConfig = { tags: readonly ModernSafetyTag[]; rules: ModernSafetyRules }

export async function getModernChapterSafetyConfig(
  chapterId: ModernRecoveryChapterId,
): Promise<ChapterSafetyConfig | null> {
  switch (chapterId) {
    case 'ch-9': {
      const m = await import('../chapter-9-concepts/safety-intervention')
      return { tags: m.chapter9SafetyTaggedItems, rules: m.CHAPTER9_SAFETY_RULES }
    }
    case 'ch-10': { const m = await import('../chapter-10-concepts/safety-intervention'); return { tags: m.chapter10SafetyTaggedItems, rules: m.CHAPTER10_SAFETY_RULES } }
    case 'ch-11': { const m = await import('../chapter-11-concepts/safety-intervention'); return { tags: m.chapter11SafetyTaggedItems, rules: m.CHAPTER11_SAFETY_RULES } }
    case 'ch-12': { const m = await import('../chapter-12-concepts/safety-intervention'); return { tags: m.chapter12SafetyTaggedItems, rules: m.CHAPTER12_SAFETY_RULES } }
    case 'ch-13': { const m = await import('../chapter-13-concepts/safety-intervention'); return { tags: m.chapter13SafetyTaggedItems, rules: m.CHAPTER13_SAFETY_RULES } }
    case 'ch-14': { const m = await import('../chapter-14-concepts/safety-intervention'); return { tags: m.chapter14SafetyTaggedItems, rules: m.CHAPTER14_SAFETY_RULES } }
    case 'ch-15': { const m = await import('../chapter-15-concepts/safety-intervention'); return { tags: m.chapter15SafetyTaggedItems, rules: m.CHAPTER15_SAFETY_RULES } }
    case 'ch-16': { const m = await import('../chapter-16-concepts/safety-intervention'); return { tags: m.chapter16SafetyTaggedItems, rules: m.CHAPTER16_SAFETY_RULES } }
    case 'ch-17': { const m = await import('../chapter-17-concepts/safety-intervention'); return { tags: m.chapter17SafetyTaggedItems, rules: m.CHAPTER17_SAFETY_RULES } }
    case 'ch-18': { const m = await import('../chapter-18-concepts/safety-intervention'); return { tags: m.chapter18SafetyTaggedItems, rules: m.CHAPTER18_SAFETY_RULES } }
    default: return null
  }
}

export async function deriveModernCycleRecoveryRequirement(input: {
  chapterId: ModernRecoveryChapterId
  conceptId: string
  detectionEvidence: unknown
}): Promise<{ urgentSafety: boolean; requiredPassPercent: 80 | 100 }> {
  const config = await getModernChapterSafetyConfig(input.chapterId)
  if (!config) return { urgentSafety: false, requiredPassPercent: 80 }
  const evidence = (input.detectionEvidence && typeof input.detectionEvidence === 'object')
    ? input.detectionEvidence as { results?: readonly { questionId: string; isCorrect: boolean; completedAt?: string }[] }
    : {}
  return deriveModernSafetySnapshot({
    chapterId: input.chapterId,
    conceptId: input.conceptId,
    evidence,
    tags: config.tags,
    rules: config.rules,
  })
}
