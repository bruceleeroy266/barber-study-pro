import { describe, expect, it } from 'vitest'
import { 
  RELEASE_GATE_FAILURE_POLICY, 
  RELEASE_PIPELINE_CONTRACT,
  AUTHENTICATION_LIFECYCLE_REQUIREMENTS,
  PRODUCTION_SMOKE_ROLES,
} from '../release-gate'

describe('release-gate', () => {
  it('requires production account-integrity and auth smoke gates before release go', () => {
    expect(RELEASE_PIPELINE_CONTRACT).toContain('PRODUCTION ACCOUNT-INTEGRITY GATE')
    expect(RELEASE_PIPELINE_CONTRACT).toContain('PRODUCTION AUTHENTICATION SMOKE GATE')
    expect(RELEASE_PIPELINE_CONTRACT.indexOf('PRODUCTION ACCOUNT-INTEGRITY GATE')).toBeLessThan(
      RELEASE_PIPELINE_CONTRACT.indexOf('FINAL RELEASE GO')
    )
    expect(RELEASE_PIPELINE_CONTRACT.indexOf('PRODUCTION AUTHENTICATION SMOKE GATE')).toBeLessThan(
      RELEASE_PIPELINE_CONTRACT.indexOf('FINAL RELEASE GO')
    )
    expect(RELEASE_GATE_FAILURE_POLICY).toBe('FAIL_CLOSED')
  })

  it('requires production authentication lifecycle gate before release go', () => {
    expect(RELEASE_PIPELINE_CONTRACT).toContain('PRODUCTION AUTHENTICATION LIFECYCLE GATE')
    expect(RELEASE_PIPELINE_CONTRACT.indexOf('PRODUCTION AUTHENTICATION LIFECYCLE GATE')).toBeLessThan(
      RELEASE_PIPELINE_CONTRACT.indexOf('FINAL RELEASE GO')
    )
    expect(RELEASE_PIPELINE_CONTRACT.indexOf('PRODUCTION AUTHENTICATION LIFECYCLE GATE')).toBeGreaterThan(
      RELEASE_PIPELINE_CONTRACT.indexOf('PRODUCTION AUTHENTICATION SMOKE GATE')
    )
  })

  it('defines complete authentication lifecycle requirements', () => {
    expect(AUTHENTICATION_LIFECYCLE_REQUIREMENTS).toContain('ACCOUNT INTEGRITY')
    expect(AUTHENTICATION_LIFECYCLE_REQUIREMENTS).toContain('AUTHENTICATION SMOKE')
    expect(AUTHENTICATION_LIFECYCLE_REQUIREMENTS).toContain('LOGIN')
    expect(AUTHENTICATION_LIFECYCLE_REQUIREMENTS).toContain('PROTECTED ACCESS')
    expect(AUTHENTICATION_LIFECYCLE_REQUIREMENTS).toContain('LOGOUT')
    expect(AUTHENTICATION_LIFECYCLE_REQUIREMENTS).toContain('POST-LOGOUT DENIAL')
    expect(AUTHENTICATION_LIFECYCLE_REQUIREMENTS).toContain('RELOGIN')
    expect(AUTHENTICATION_LIFECYCLE_REQUIREMENTS).toContain('INVITATION/SETUP')
    expect(AUTHENTICATION_LIFECYCLE_REQUIREMENTS).toContain('PASSWORD RECOVERY')
  })

  it('defines required production smoke roles', () => {
    expect(PRODUCTION_SMOKE_ROLES).toContain('student')
    expect(PRODUCTION_SMOKE_ROLES).toContain('instructor')
    expect(PRODUCTION_SMOKE_ROLES).toContain('school_admin')
    expect(PRODUCTION_SMOKE_ROLES).toContain('admin')
  })
})
