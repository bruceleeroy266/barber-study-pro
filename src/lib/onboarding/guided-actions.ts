import type { OnboardingBlocker } from './status-resolver'

export interface GuidedOnboardingAction {
  href: string
  label: string
  guidance: string
}

const GUIDED_ACTIONS: Record<string, GuidedOnboardingAction> = {
  school_profile_incomplete: {
    href: '/admin/school/configuration',
    label: 'Review school settings',
    guidance: 'Open School Settings and complete the missing school information.',
  },
  program_missing: {
    href: '/admin/school/configuration',
    label: 'Configure program',
    guidance: 'Open School Settings and add or activate the school program.',
  },
  admin_missing: {
    href: '/admin/users?setup=manage-admins',
    label: 'Manage school admins',
    guidance: 'Review the school administrator accounts and activate the required admin.',
  },
  instructor_missing: {
    href: '/admin/users?setup=invite-instructor',
    label: 'Add instructor',
    guidance: 'The instructor invitation form will open with Instructor selected.',
  },
  students_missing: {
    href: '/admin/users?setup=invite-student',
    label: 'Add students',
    guidance: 'The student invitation form will open with Student selected.',
  },
  invitations_pending: {
    href: '/admin/users?setup=review-invitations',
    label: 'Review invitations',
    guidance: 'Review onboarding accounts and resend setup links where needed.',
  },
  invitations_problem: {
    href: '/admin/users?setup=recover-invitations',
    label: 'Fix invitations',
    guidance: 'Review onboarding accounts and use the existing setup-link recovery action.',
  },
  enrollment_incomplete: {
    href: '/admin/users?setup=enrollment',
    label: 'Complete enrollments',
    guidance: 'ASCYN PRO will take you to the first active student who still needs program enrollment.',
  },
  assignment_incomplete: {
    href: '/admin/users?setup=assignment',
    label: 'Assign instructors',
    guidance: 'ASCYN PRO will take you to the first active learner who still needs an instructor assignment.',
  },
  source_data_unavailable: {
    href: '/school',
    label: 'Retry setup check',
    guidance: 'Reload the School Dashboard so ASCYN PRO can verify the onboarding data again.',
  },
}

export function resolveGuidedOnboardingAction(
  blocker: OnboardingBlocker
): GuidedOnboardingAction {
  return GUIDED_ACTIONS[blocker.code] ?? {
    href: blocker.href,
    label: blocker.action,
    guidance: blocker.message,
  }
}
