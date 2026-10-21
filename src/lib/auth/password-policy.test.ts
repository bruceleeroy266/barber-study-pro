import { describe, expect, it } from 'vitest'
import { isStrongPassword, MIN_PASSWORD_LENGTH, PASSWORD_REQUIREMENTS } from './password-policy'

describe('shared invitation and recovery password policy', () => {
  it('uses one minimum and public description', () => {
    expect(MIN_PASSWORD_LENGTH).toBe(8)
    expect(PASSWORD_REQUIREMENTS).toContain('uppercase')
  })
  it.each(['short1A', 'alllowercase1', 'ALLUPPERCASE1', 'NoDigitsHere', ''])('rejects weak password %s', password => {
    expect(isStrongPassword(password)).toBe(false)
  })
  it.each(['Welcome123', 'StrongPassword8', 'GoodPass4'])('accepts strong password %s', password => {
    expect(isStrongPassword(password)).toBe(true)
  })
})
