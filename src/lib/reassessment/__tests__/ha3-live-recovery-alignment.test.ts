import {
  hasRecoveredLegacyConcept,
  requiredLegacyRecoveryPercent,
} from '../legacy-safety-recovery'

describe('HA-3 Chapters 1-7 live recovery contract', () => {
  test.each([
    ['ch-1', 'ordinary', 80],
    ['ch-2', 'ordinary', 80],
    ['ch-3', 'ch3-ergonomics', 100],
    ['ch-4', 'ch4-blood-exposure-ppe', 100],
    ['ch-5', 'ch5-razors', 100],
    ['ch-6', 'ordinary', 80],
    ['ch-7', 'ch7-chemical-safety', 100],
  ] as const)('%s %s requires %i percent', (chapterId, conceptId, required) => {
    expect(requiredLegacyRecoveryPercent(chapterId, conceptId)).toBe(required)
  })

  test('ordinary recovery clears at 80 but not 79', () => {
    expect(hasRecoveredLegacyConcept({ chapterId: 'ch-5', conceptId: 'ch5-combs-brushes', reassessmentPercent: 79 })).toBe(false)
    expect(hasRecoveredLegacyConcept({ chapterId: 'ch-5', conceptId: 'ch5-combs-brushes', reassessmentPercent: 80 })).toBe(true)
  })

  test('urgent safety stays uncleared at 99 and clears only at 100', () => {
    expect(hasRecoveredLegacyConcept({ chapterId: 'ch-7', conceptId: 'ch7-chemical-safety', reassessmentPercent: 99 })).toBe(false)
    expect(hasRecoveredLegacyConcept({ chapterId: 'ch-7', conceptId: 'ch7-chemical-safety', reassessmentPercent: 100 })).toBe(true)
  })
})
