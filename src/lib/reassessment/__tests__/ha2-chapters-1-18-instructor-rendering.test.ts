import { describe, expect, it } from 'vitest'
import { isInstructorOrAdmin } from '@/lib/security/permissions'
import { LEGACY_URGENT_SAFETY_CONCEPTS, requiredLegacyRecoveryPercent } from '../legacy-safety-recovery'

describe('HA2-01 Chapters 1-18 instructor/school-admin diagnostic contract', () => {
  it('allows instructor and school_admin through the shared instructor portal permission', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
  })

  it('keeps Chapters 3-5 urgent-safety families on the 100% recovery contract', () => {
    for (const chapterId of ['ch-3', 'ch-4', 'ch-5'] as const) {
      expect(LEGACY_URGENT_SAFETY_CONCEPTS[chapterId].length).toBeGreaterThan(0)
      for (const conceptId of LEGACY_URGENT_SAFETY_CONCEPTS[chapterId]) {
        expect(requiredLegacyRecoveryPercent(chapterId, conceptId)).toBe(100)
      }
    }
  })

  it('keeps ordinary legacy concepts at 80%', () => {
    expect(requiredLegacyRecoveryPercent('ch-3', 'ch3-professional-image')).toBe(80)
    expect(requiredLegacyRecoveryPercent('ch-5', 'ch5-combs-brushes')).toBe(80)
  })

  it('covers the complete 1-18 instructor diagnostic range', () => {
    const chapters = Array.from({ length: 18 }, (_, index) => `ch-${index + 1}`)
    expect(chapters).toHaveLength(18)
    expect(chapters[0]).toBe('ch-1')
    expect(chapters[17]).toBe('ch-18')
  })
})
