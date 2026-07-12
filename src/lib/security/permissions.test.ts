import { describe, it, expect } from 'vitest'
import { canAccessRoute, hasPermission, isAdmin, isInstructorOrAdmin, isLearner } from './permissions'

describe('canAccessRoute', () => {
  it('allows student to /dashboard', () => {
    expect(canAccessRoute('student', '/dashboard')).toBe(true)
  })

  it('allows apprentice to /dashboard', () => {
    expect(canAccessRoute('apprentice', '/dashboard')).toBe(true)
  })

  it('blocks student from /admin', () => {
    expect(canAccessRoute('student', '/admin')).toBe(false)
  })

  it('blocks student from /admin/sub-route', () => {
    expect(canAccessRoute('student', '/admin/users')).toBe(false)
  })

  it('blocks student from /instructor', () => {
    expect(canAccessRoute('student', '/instructor')).toBe(false)
  })

  it('blocks student from /school', () => {
    expect(canAccessRoute('student', '/school')).toBe(false)
  })

  it('allows instructor to /instructor', () => {
    expect(canAccessRoute('instructor', '/instructor')).toBe(true)
  })

  it('allows instructor to /dashboard', () => {
    expect(canAccessRoute('instructor', '/dashboard')).toBe(true)
  })

  it('allows school_admin to /instructor', () => {
    expect(canAccessRoute('school_admin', '/instructor')).toBe(true)
  })

  it('blocks instructor from /admin', () => {
    expect(canAccessRoute('instructor', '/admin')).toBe(false)
  })

  it('allows admin to /admin', () => {
    expect(canAccessRoute('admin', '/admin')).toBe(true)
  })

  it('allows admin to /dashboard and /instructor', () => {
    expect(canAccessRoute('admin', '/dashboard')).toBe(true)
    expect(canAccessRoute('admin', '/instructor')).toBe(true)
  })

  it('blocks unknown role from everything protected', () => {
    expect(canAccessRoute('hacker', '/admin')).toBe(false)
    expect(canAccessRoute('hacker', '/dashboard')).toBe(false)
    expect(canAccessRoute('hacker', '/instructor')).toBe(false)
  })

  it('blocks missing role from everything protected', () => {
    expect(canAccessRoute(null, '/admin')).toBe(false)
    expect(canAccessRoute(undefined, '/dashboard')).toBe(false)
  })
})

describe('hasPermission', () => {
  it('student has view_dashboard', () => {
    expect(hasPermission('student', 'view_dashboard')).toBe(true)
  })

  it('student does not have view_admin_dashboard', () => {
    expect(hasPermission('student', 'view_admin_dashboard')).toBe(false)
  })

  it('admin has view_admin_dashboard', () => {
    expect(hasPermission('admin', 'view_admin_dashboard')).toBe(true)
  })
})

describe('role helpers', () => {
  it('isAdmin only for admin', () => {
    expect(isAdmin('admin')).toBe(true)
    expect(isAdmin('student')).toBe(false)
    expect(isAdmin('instructor')).toBe(false)
    expect(isAdmin('school_admin')).toBe(false)
  })

  it('isInstructorOrAdmin for instructor, admin, and school_admin', () => {
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(isInstructorOrAdmin('apprentice')).toBe(false)
  })

  it('isLearner for student and apprentice', () => {
    expect(isLearner('student')).toBe(true)
    expect(isLearner('apprentice')).toBe(true)
    expect(isLearner('instructor')).toBe(false)
    expect(isLearner('admin')).toBe(false)
  })
})
