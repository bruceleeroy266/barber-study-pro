import { describe, it, expect } from 'vitest'
import { getRoleBasedRedirect, validateLoginAccess, isSafeRedirectPath } from './auth-access'

describe('getRoleBasedRedirect', () => {
  it('routes student to /dashboard', () => {
    expect(getRoleBasedRedirect('student')).toBe('/dashboard')
  })

  it('routes apprentice to /dashboard', () => {
    expect(getRoleBasedRedirect('apprentice')).toBe('/dashboard')
  })

  it('routes instructor to /instructor', () => {
    expect(getRoleBasedRedirect('instructor')).toBe('/instructor')
  })

  it('routes admin to /admin', () => {
    expect(getRoleBasedRedirect('admin')).toBe('/admin')
  })

  it('routes school_admin to /school', () => {
    expect(getRoleBasedRedirect('school_admin')).toBe('/school')
  })

  it('never defaults missing role to /admin', () => {
    expect(getRoleBasedRedirect(null)).toBe('/login?error=invalid_role')
    expect(getRoleBasedRedirect(undefined)).toBe('/login?error=invalid_role')
    expect(getRoleBasedRedirect('')).toBe('/login?error=invalid_role')
  })

  it('never defaults unknown role to /admin', () => {
    expect(getRoleBasedRedirect('superuser')).toBe('/login?error=invalid_role')
    expect(getRoleBasedRedirect('Admin')).toBe('/login?error=invalid_role')
    expect(getRoleBasedRedirect('STUDENT')).toBe('/login?error=invalid_role')
  })
})

describe('isSafeRedirectPath', () => {
  it('allows internal dashboard paths', () => {
    expect(isSafeRedirectPath('/dashboard')).toBe(true)
    expect(isSafeRedirectPath('/dashboard/chapters/1')).toBe(true)
  })

  it('allows internal instructor paths', () => {
    expect(isSafeRedirectPath('/instructor')).toBe(true)
    expect(isSafeRedirectPath('/instructor/student/123')).toBe(true)
  })

  it('rejects external URLs', () => {
    expect(isSafeRedirectPath('https://evil.com')).toBe(false)
    expect(isSafeRedirectPath('http://localhost:3000/login')).toBe(false)
  })

  it('rejects protocol-relative URLs', () => {
    expect(isSafeRedirectPath('//evil.com')).toBe(false)
  })

  it('rejects empty or null paths', () => {
    expect(isSafeRedirectPath('')).toBe(false)
    expect(isSafeRedirectPath(null)).toBe(false)
    expect(isSafeRedirectPath(undefined)).toBe(false)
  })
})

describe('validateLoginAccess', () => {
  const approvedStudent = {
    role: 'student',
    approval_status: 'approved',
    is_disabled: false,
  }

  it('allows approved student', () => {
    expect(validateLoginAccess(approvedStudent).ok).toBe(true)
  })

  it('rejects missing profile', () => {
    const result = validateLoginAccess(null)
    expect(result.ok).toBe(false)
    expect(result.errorKey).toBe('missing_profile')
  })

  it('rejects disabled account', () => {
    const result = validateLoginAccess({ ...approvedStudent, is_disabled: true })
    expect(result.ok).toBe(false)
    expect(result.errorKey).toBe('disabled')
  })

  it('rejects pending account', () => {
    const result = validateLoginAccess({ ...approvedStudent, approval_status: 'pending' })
    expect(result.ok).toBe(false)
    expect(result.errorKey).toBe('not_approved')
  })

  it('rejects rejected account', () => {
    const result = validateLoginAccess({ ...approvedStudent, approval_status: 'rejected' })
    expect(result.ok).toBe(false)
    expect(result.errorKey).toBe('not_approved')
  })

  it('rejects unknown role', () => {
    const result = validateLoginAccess({ role: 'superuser', approval_status: 'approved', is_disabled: false })
    expect(result.ok).toBe(false)
    expect(result.errorKey).toBe('invalid_role')
  })

  it('rejects missing role', () => {
    const result = validateLoginAccess({ role: null, approval_status: 'approved', is_disabled: false })
    expect(result.ok).toBe(false)
    expect(result.errorKey).toBe('invalid_role')
  })
})
