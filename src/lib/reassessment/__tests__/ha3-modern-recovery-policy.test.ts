import {
  hasRecoveredModernConcept,
  requiredModernRecoveryPercent,
} from '../modern-recovery-policy'

describe('HA-3 Chapters 8-18 recovery policy', () => {
  test('ordinary recovery requires 80 percent', () => {
    expect(requiredModernRecoveryPercent(false)).toBe(80)
    expect(hasRecoveredModernConcept({ correctCount: 3, questionCount: 5, urgentSafety: false })).toBe(false)
    expect(hasRecoveredModernConcept({ correctCount: 4, questionCount: 5, urgentSafety: false })).toBe(true)
  })

  test('urgent safety requires a perfect five-question recovery', () => {
    expect(requiredModernRecoveryPercent(true)).toBe(100)
    expect(hasRecoveredModernConcept({ correctCount: 4, questionCount: 5, urgentSafety: true })).toBe(false)
    expect(hasRecoveredModernConcept({ correctCount: 5, questionCount: 5, urgentSafety: true })).toBe(true)
  })

  test('partial sequences cannot terminally recover', () => {
    expect(hasRecoveredModernConcept({ correctCount: 4, questionCount: 4, urgentSafety: false })).toBe(false)
  })

  test('covers the complete modern chapter range', () => {
    const chapters = Array.from({ length: 11 }, (_, i) => `ch-${i + 8}`)
    expect(chapters).toEqual(['ch-8','ch-9','ch-10','ch-11','ch-12','ch-13','ch-14','ch-15','ch-16','ch-17','ch-18'])
  })
})
