import type {
  OnboardingStepId,
  SchoolOnboardingStatus,
} from './status-resolver'

export interface SchoolLaunchPreflightCheck {
  id: OnboardingStepId
  title: string
  passed: boolean
  detail: string
}

export interface SchoolLaunchPreflight {
  authorized: boolean
  decision: 'authorized' | 'locked'
  checks: SchoolLaunchPreflightCheck[]
  failedChecks: SchoolLaunchPreflightCheck[]
  blockerCount: number
  sourceErrorCount: number
  summary: string
}

const REQUIRED_PREFLIGHT_STEPS: OnboardingStepId[] = [
  'school_profile',
  'program',
  'school_admin',
  'instructor',
  'students',
  'accounts',
  'enrollment',
  'assignment',
]

export function buildSchoolLaunchPreflight(
  status: SchoolOnboardingStatus
): SchoolLaunchPreflight {
  const checks = REQUIRED_PREFLIGHT_STEPS.map((id) => {
    const existing = status.steps.find((step) => step.id === id)

    return {
      id,
      title: existing?.title ?? id,
      passed: existing?.complete === true,
      detail: existing?.detail ?? 'ASCYN PRO could not verify this required setup check.',
    }
  })

  const failedChecks = checks.filter((check) => !check.passed)
  const sourceErrorCount = status.sourceErrors.length
  const blockerCount = status.blockers.length
  const authorized =
    status.readyToLaunch &&
    sourceErrorCount === 0 &&
    blockerCount === 0 &&
    failedChecks.length === 0

  return {
    authorized,
    decision: authorized ? 'authorized' : 'locked',
    checks,
    failedChecks,
    blockerCount,
    sourceErrorCount,
    summary: authorized
      ? 'All required setup checks passed. School launch is authorized.'
      : 'School launch is locked until every required setup check passes.',
  }
}
