# G5-B — School Onboarding Status Resolver

## Purpose

Provide one canonical school onboarding status result that later Gate 5 UI can consume without duplicating readiness rules across dashboards or forms.

## Inputs reused

G5-B reads existing production sources only:

- schools
- school_settings
- programs
- profiles
- school_onboarding_invitations
- students
- enrollments
- student_instructor_assignments

No new onboarding table is introduced.

## Required launch checks

The resolver evaluates eight steps:

1. School profile and settings available.
2. At least one active academic program.
3. At least one active school administrator.
4. At least one active instructor.
5. At least one active learner.
6. No unresolved pending/expired/revoked onboarding invitations.
7. Every active learner has an active program enrollment.
8. Every active learner has an active instructor assignment.

## Output contract

The resolver returns:

- readyToLaunch
- progressPercent
- completedSteps / totalSteps
- per-step completion
- plain-language blockers
- one canonical nextAction
- counts for instructors, learners, pending invitations, incomplete enrollments, and unassigned learners
- sourceErrors

## Safety rules

- Source query failures fail closed: Ready to Launch cannot become true if the resolver cannot verify required data.
- Enrollment uses canonical students.id records.
- Instructor assignment follows the existing student_instructor_assignments relationship, whose student_id is the learner profile id in the certified assignment architecture.
- The resolver is read-only and does not mutate users, invitations, enrollment, assignments, school settings, or programs.
- Later Gate 5 UI should consume this resolver rather than recreate setup/readiness logic.

## Certification boundary

G5-B is GREEN only when:

1. resolver regression tests pass;
2. Engineering Verification passes on the exact PR head;
3. Vercel preview is READY on the exact same PR head;
4. the head remains unchanged before merge.

After merge, exact production main and production Vercel must be verified before G5-B is formally closed.
