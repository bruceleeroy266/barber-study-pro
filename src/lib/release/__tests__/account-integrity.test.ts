import { describe, expect, it } from 'vitest'
import { evaluateDesignatedAccountIntegrity } from '../account-integrity'
import { DESIGNATED_HUMAN_ACCOUNTS, SMOKE_ACCOUNT_EXPECTATIONS } from '../designated-accounts'

describe('account-integrity', () => {
  it('passes a healthy platform admin account', () => {
    const result = evaluateDesignatedAccountIntegrity({
      email: 'ascynproofficial@gmail.com',
      authExists: true,
      profileExists: true,
      emailConfirmed: true,
      invitePending: false,
      banned: false,
      disabled: false,
      role: 'admin',
      approvalStatus: 'approved',
      schoolId: null,
    })

    expect(result.pass).toBe(true)
    expect(result.failures).toEqual([])
  })

  it('passes an invited account awaiting password setup', () => {
    const result = evaluateDesignatedAccountIntegrity({
      email: 'ascynproofficial@gmail.com',
      authExists: true,
      profileExists: true,
      emailConfirmed: false,
      invitePending: true,
      banned: false,
      disabled: false,
      role: 'admin',
      approvalStatus: 'approved',
      schoolId: null,
    })

    expect(result.pass).toBe(true)
    expect(result.failures).toEqual([])
  })

  it('fails when a designated account is missing profile integrity', () => {
    const result = evaluateDesignatedAccountIntegrity({
      email: DESIGNATED_HUMAN_ACCOUNTS[1].email,
      authExists: true,
      profileExists: false,
      emailConfirmed: true,
      invitePending: false,
      banned: false,
      disabled: false,
      role: 'student',
      approvalStatus: 'approved',
      schoolId: DESIGNATED_HUMAN_ACCOUNTS[1].expectedSchoolId,
    })

    expect(result.pass).toBe(false)
    expect(result.failures).toContain('Missing profile')
  })

  it('fails when a smoke account has an unexpected role', () => {
    const smoke = SMOKE_ACCOUNT_EXPECTATIONS[2]
    const result = evaluateDesignatedAccountIntegrity({
      email: smoke.email,
      authExists: true,
      profileExists: true,
      emailConfirmed: true,
      invitePending: false,
      banned: false,
      disabled: false,
      role: 'student',
      approvalStatus: 'approved',
      schoolId: null,
    })

    expect(result.pass).toBe(false)
    expect(result.failures.some((failure) => failure.includes('Role mismatch'))).toBe(true)
  })
})
