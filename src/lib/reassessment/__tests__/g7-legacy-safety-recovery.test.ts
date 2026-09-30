import { describe, expect, it } from 'vitest'
import {
  LEGACY_URGENT_SAFETY_CONCEPTS,
  hasRecoveredLegacyConcept,
  preserveLegacyRecoveryEvidence,
  requiredLegacyRecoveryPercent,
} from '../legacy-safety-recovery'

describe('G7 Chapters 1-7 legacy safety/recovery alignment', () => {
  it('locks the reviewed urgent-safety family set', () => {
    expect(LEGACY_URGENT_SAFETY_CONCEPTS).toEqual({
      'ch-1': [],
      'ch-2': [],
      'ch-3': ['ch3-ergonomics'],
      'ch-4': [
        'ch4-pathogens-transmission','ch4-disinfection-sterilization','ch4-cross-contamination',
        'ch4-blood-exposure-ppe','ch4-regulatory-chemical-safety','ch4-safe-practice-compliance',
      ],
      'ch-5': ['ch5-shears-cutting','ch5-clippers-trimmers','ch5-razors','ch5-thermal-electrical','ch5-equipment-safety'],
      'ch-6': [],
      'ch-7': ['ch7-chemical-safety'],
    })
  })

  it('keeps ordinary recovery at 80 percent', () => {
    expect(requiredLegacyRecoveryPercent('ch-1','ch1-origins-culture')).toBe(80)
    expect(requiredLegacyRecoveryPercent('ch-2','C-2-12')).toBe(80)
    expect(requiredLegacyRecoveryPercent('ch-6','ch6-nervous')).toBe(80)
    expect(hasRecoveredLegacyConcept({chapterId:'ch-1',conceptId:'ch1-origins-culture',reassessmentPercent:80})).toBe(true)
    expect(hasRecoveredLegacyConcept({chapterId:'ch-1',conceptId:'ch1-origins-culture',reassessmentPercent:79})).toBe(false)
  })

  it('requires 100 percent for urgent safety recovery', () => {
    for (const [chapterId, concepts] of Object.entries(LEGACY_URGENT_SAFETY_CONCEPTS)) {
      for (const conceptId of concepts) {
        expect(requiredLegacyRecoveryPercent(chapterId as keyof typeof LEGACY_URGENT_SAFETY_CONCEPTS,conceptId)).toBe(100)
        expect(hasRecoveredLegacyConcept({chapterId:chapterId as keyof typeof LEGACY_URGENT_SAFETY_CONCEPTS,conceptId,reassessmentPercent:99})).toBe(false)
        expect(hasRecoveredLegacyConcept({chapterId:chapterId as keyof typeof LEGACY_URGENT_SAFETY_CONCEPTS,conceptId,reassessmentPercent:100})).toBe(true)
      }
    }
  })

  it('preserves initial misses when recovery evidence is appended', () => {
    const initial=[{itemId:'initial-1',correct:false,source:'initial' as const}]
    const recovery=[{itemId:'fresh-1',correct:true,source:'reassessment' as const}]
    const combined=preserveLegacyRecoveryEvidence(initial,recovery)
    expect(combined).toHaveLength(2)
    expect(combined[0]).toEqual(initial[0])
    expect(combined[1]).toEqual(recovery[0])
    expect(initial).toEqual([{itemId:'initial-1',correct:false,source:'initial'}])
  })
})
