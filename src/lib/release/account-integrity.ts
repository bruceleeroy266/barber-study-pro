import { DESIGNATED_HUMAN_ACCOUNTS, SMOKE_ACCOUNT_EXPECTATIONS } from './designated-accounts'

export interface AccountIntegrityCheckInput {
  email: string
  authExists: boolean
  profileExists: boolean
  emailConfirmed: boolean
  invitePending: boolean
  banned: boolean
  disabled: boolean
  role: string | null
  approvalStatus: string | null
  schoolId: string | null
}

export interface AccountIntegrityCheckResult {
  key: string
  email: string
  pass: boolean
  failures: string[]
}

export function evaluateDesignatedAccountIntegrity(input: AccountIntegrityCheckInput): AccountIntegrityCheckResult {
  const expectation = [...DESIGNATED_HUMAN_ACCOUNTS, ...SMOKE_ACCOUNT_EXPECTATIONS].find(
    (account) => account.email === input.email
  )

  if (!expectation) {
    return {
      key: 'unknown',
      email: input.email,
      pass: false,
      failures: ['No designated account expectation found for email'],
    }
  }

  const failures: string[] = []

  if (!input.authExists) failures.push('Missing auth user')
  if (!input.profileExists) failures.push('Missing profile')
  if (!input.emailConfirmed && !input.invitePending) failures.push('Email not confirmed')
  if (input.banned) failures.push('Auth user is banned')
  if (input.disabled) failures.push('Profile is disabled')
  if (input.role !== expectation.expectedRole) failures.push(`Role mismatch: expected ${expectation.expectedRole}, received ${input.role ?? 'null'}`)
  if (input.approvalStatus !== 'approved') failures.push(`Approval status mismatch: expected approved, received ${input.approvalStatus ?? 'null'}`)

  if (expectation.requiresSchool) {
    if (!input.schoolId) failures.push('Missing required school assignment')
    if (expectation.expectedSchoolId && input.schoolId !== expectation.expectedSchoolId) {
      failures.push(`School mismatch: expected ${expectation.expectedSchoolId}, received ${input.schoolId ?? 'null'}`)
    }
  } else if (input.schoolId !== expectation.expectedSchoolId) {
    failures.push(`Unexpected school assignment: expected ${expectation.expectedSchoolId ?? 'null'}, received ${input.schoolId ?? 'null'}`)
  }

  return {
    key: expectation.key,
    email: input.email,
    pass: failures.length === 0,
    failures,
  }
}
