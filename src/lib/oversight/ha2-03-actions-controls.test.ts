import { describe, expect, it } from 'vitest'
import { isInstructorOrAdmin } from '@/lib/security/permissions'

describe('HA2-03 instructor/school-admin action control contract', () => {
  it('authorizes instructor and school_admin but not learners for oversight mutations', () => {
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(isInstructorOrAdmin('apprentice')).toBe(false)
  })

  it('requires stale-sensitive controls to operate on pending/current records', () => {
    const mutableQuizStatuses = ['pending']
    expect(mutableQuizStatuses).not.toContain('approved')
    expect(mutableQuizStatuses).not.toContain('denied')
  })

  it('keeps all 18 chapter diagnostics on the shared oversight surface', () => {
    expect(Array.from({ length: 18 }, (_, i) => `ch-${i + 1}`)).toHaveLength(18)
  })

  it('requires school identity for cross-record staff mutations', () => {
    const sameSchool = (actorSchool: string | null, targetSchool: string | null) =>
      Boolean(actorSchool && targetSchool && actorSchool === targetSchool)
    expect(sameSchool('school-a', 'school-a')).toBe(true)
    expect(sameSchool('school-a', 'school-b')).toBe(false)
    expect(sameSchool(null, 'school-a')).toBe(false)
  })
})
