import { describe, expect, it } from 'vitest'
import { canAccessRoute, isInstructorOrAdmin } from '@/lib/security/permissions'

describe('EXAM-COACHING-UI-QA-9 instructor route authorization', () => {
  const routes = ['/instructor/exam-center', '/instructor/answer-keys', '/instructor/answer-keys/10']
  it('denies unauthenticated and learner roles at every answer-key entrypoint', () => {
    for (const route of routes) {
      for (const role of [null, undefined, '', 'student', 'apprentice', 'unknown']) {
        expect(canAccessRoute(role, route)).toBe(false)
      }
    }
  })
  it('permits instructor and school-admin roles through canonical permissions', () => {
    for (const role of ['instructor', 'school_admin', 'admin']) {
      expect(isInstructorOrAdmin(role)).toBe(true)
      for (const route of routes) expect(canAccessRoute(role, route)).toBe(true)
    }
  })
})
