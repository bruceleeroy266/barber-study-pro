import { describe, expect, test } from 'vitest'
import { deriveModernSafetySnapshot } from '../modern-safety-snapshot'
import { hasRecoveredModernConcept } from '../modern-recovery-policy'
import { getPersistedModernSafetyCycleSnapshot } from '../modern-safety-cycle'

describe('HA-3 modern urgent-safety runtime bridge', () => {
  const tags = [
    { itemId: 'q-a', conceptFamilyId: 'concept-a', hazard: 'hazard-a' },
    { itemId: 'q-b', conceptFamilyId: 'concept-a', hazard: 'hazard-b' },
  ] as const
  const rules = { recentWindow: 5, urgentDistinctSafetyMisses: 2, urgentDistinctHazards: 2 }

  test('initial immutable evidence produces a 100-percent cycle snapshot', () => {
    const snapshot = deriveModernSafetySnapshot({
      chapterId: 'ch-18',
      conceptId: 'concept-a',
      evidence: { results: [
        { questionId: 'q-a', isCorrect: false, completedAt: '2026-01-01T00:00:00Z' },
        { questionId: 'q-b', isCorrect: false, completedAt: '2026-01-02T00:00:00Z' },
      ] },
      tags,
      rules,
    })
    expect(snapshot).toEqual({ urgentSafety: true, requiredPassPercent: 100 })
  })

  test('persisted urgent snapshot cannot clear at 4/5 but clears at 5/5', () => {
    const cycleEvidence = { ha3UrgentSafety: true, ha3RequiredRecoveryPercent: 100 }
    const snapshot = getPersistedModernSafetyCycleSnapshot('ch-18', cycleEvidence)
    expect(snapshot.urgentSafety).toBe(true)
    expect(hasRecoveredModernConcept({ correctCount: 4, questionCount: 5, urgentSafety: snapshot.urgentSafety })).toBe(false)
    expect(hasRecoveredModernConcept({ correctCount: 5, questionCount: 5, urgentSafety: snapshot.urgentSafety })).toBe(true)
  })

  test('ordinary snapshot clears at 4/5', () => {
    const snapshot = getPersistedModernSafetyCycleSnapshot('ch-18', {
      ha3UrgentSafety: false,
      ha3RequiredRecoveryPercent: 80,
    })
    expect(hasRecoveredModernConcept({ correctCount: 4, questionCount: 5, urgentSafety: snapshot.urgentSafety })).toBe(true)
  })
})
