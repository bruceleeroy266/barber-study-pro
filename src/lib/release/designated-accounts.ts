export type DesignatedAccountKind = 'human' | 'smoke'

export interface DesignatedAccountExpectation {
  key: string
  kind: DesignatedAccountKind
  email: string
  expectedRole: 'student' | 'instructor' | 'admin' | 'school_admin'
  expectedSchoolId: string | null
  requiresSchool: boolean
  description: string
}

export const DESIGNATED_HUMAN_ACCOUNTS: DesignatedAccountExpectation[] = [
  {
    key: 'gabriel',
    kind: 'human',
    email: 'ascynproofficial@gmail.com',
    expectedRole: 'admin',
    expectedSchoolId: null,
    requiresSchool: false,
    description: 'Platform administrator account for ASCYN PRO ownership and release authority.',
  },
  {
    key: 'patty',
    kind: 'human',
    email: 'patty.pineda.drl@gmail.com',
    expectedRole: 'student',
    expectedSchoolId: '12b09747-7391-4811-bc22-db7eebbb12c1',
    requiresSchool: true,
    description: 'Designated student pilot account for Patty Pineda.',
  },
  {
    key: 'malenny',
    kind: 'human',
    email: 'malennysaenz@gmail.com',
    expectedRole: 'student',
    expectedSchoolId: '12b09747-7391-4811-bc22-db7eebbb12c1',
    requiresSchool: true,
    description: 'Designated student account for Malenny Saenz.',
  },
  {
    key: 'tessa',
    kind: 'human',
    email: 'tessamyers2911@gmail.com',
    expectedRole: 'instructor',
    expectedSchoolId: '12b09747-7391-4811-bc22-db7eebbb12c1',
    requiresSchool: true,
    description: 'Designated instructor account for Tessa Myers.',
  },
]

export const SMOKE_ACCOUNT_EXPECTATIONS: DesignatedAccountExpectation[] = [
  {
    key: 'smoke-student',
    kind: 'smoke',
    email: 'smoke-student@ascynpro.test',
    expectedRole: 'student',
    expectedSchoolId: null,
    requiresSchool: false,
    description: 'Dedicated non-human smoke account for student authentication checks.',
  },
  {
    key: 'smoke-instructor',
    kind: 'smoke',
    email: 'smoke-instructor@ascynpro.test',
    expectedRole: 'instructor',
    expectedSchoolId: null,
    requiresSchool: false,
    description: 'Dedicated non-human smoke account for instructor authentication checks.',
  },
  {
    key: 'smoke-admin',
    kind: 'smoke',
    email: 'smoke-admin@ascynpro.test',
    expectedRole: 'admin',
    expectedSchoolId: null,
    requiresSchool: false,
    description: 'Dedicated non-human smoke account for platform admin authentication checks.',
  },
  {
    key: 'smoke-school-admin',
    kind: 'smoke',
    email: 'smoke-school-admin@ascynpro.test',
    expectedRole: 'school_admin',
    expectedSchoolId: null,
    requiresSchool: false,
    description: 'Dedicated non-human smoke account for school admin authentication checks.',
  },
]

export const ALL_DESIGNATED_ACCOUNTS = [...DESIGNATED_HUMAN_ACCOUNTS, ...SMOKE_ACCOUNT_EXPECTATIONS]

export function getProtectedEmails(): string[] {
  return ALL_DESIGNATED_ACCOUNTS.map((account) => account.email)
}
