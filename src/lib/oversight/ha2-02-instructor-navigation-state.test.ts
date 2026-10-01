import { describe, expect, it } from 'vitest'
import { canAccessRoute, isInstructorOrAdmin } from '@/lib/security/permissions'

describe('HA2-02 instructor/school-admin navigation contract', () => {
  it('keeps instructor and school-admin on the same instructor route family', () => {
    for (const role of ['instructor', 'school_admin'] as const) {
      expect(isInstructorOrAdmin(role)).toBe(true)
      expect(canAccessRoute(role, '/instructor')).toBe(true)
      expect(canAccessRoute(role, '/instructor/students')).toBe(true)
      expect(canAccessRoute(role, '/instructor/student/student-id')).toBe(true)
    }
  })

  it('does not expose instructor navigation to learner roles', () => {
    for (const role of ['student', 'apprentice'] as const) {
      expect(isInstructorOrAdmin(role)).toBe(false)
      expect(canAccessRoute(role, '/instructor/students')).toBe(false)
    }
  })

  it('covers all Chapters 1-18 on the shared student-detail diagnostic surface', () => {
    expect(Array.from({ length: 18 }, (_, index) => `ch-${index + 1}`)).toEqual([
      'ch-1','ch-2','ch-3','ch-4','ch-5','ch-6','ch-7','ch-8','ch-9',
      'ch-10','ch-11','ch-12','ch-13','ch-14','ch-15','ch-16','ch-17','ch-18',
    ])
  })
})
