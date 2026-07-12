import { describe, it, expect } from 'vitest'
import { isAdmin, isInstructorOrAdmin, isLearner, isSchoolAdmin } from './auth-helpers'

describe('auth-helpers role checks', () => {
  it('isAdmin only for admin', () => {
    expect(isAdmin('admin')).toBe(true)
    expect(isAdmin('student')).toBe(false)
    expect(isAdmin('instructor')).toBe(false)
    expect(isAdmin('school_admin')).toBe(false)
    expect(isAdmin(null)).toBe(false)
  })

  it('isInstructorOrAdmin for instructor, admin, and school_admin', () => {
    expect(isInstructorOrAdmin('admin')).toBe(true)
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(isInstructorOrAdmin('student')).toBe(false)
    expect(isInstructorOrAdmin('apprentice')).toBe(false)
    expect(isInstructorOrAdmin(null)).toBe(false)
  })

  it('isLearner for student and apprentice', () => {
    expect(isLearner('student')).toBe(true)
    expect(isLearner('apprentice')).toBe(true)
    expect(isLearner('instructor')).toBe(false)
    expect(isLearner('admin')).toBe(false)
    expect(isLearner(null)).toBe(false)
  })

  it('isSchoolAdmin for school_admin and admin', () => {
    expect(isSchoolAdmin('school_admin')).toBe(true)
    expect(isSchoolAdmin('admin')).toBe(true)
    expect(isSchoolAdmin('instructor')).toBe(false)
    expect(isSchoolAdmin('student')).toBe(false)
    expect(isSchoolAdmin(null)).toBe(false)
  })
})
