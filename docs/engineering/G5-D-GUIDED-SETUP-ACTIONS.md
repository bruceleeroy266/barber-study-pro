# G5-D — Guided Setup Actions

## Purpose

Turn the G5-C School Setup Center from a status display into an actionable onboarding guide without duplicating any certified onboarding behavior.

G5-D routes each blocker into the existing school configuration or user-management workflow.

## Guided routes

- Missing school profile/settings → existing School Configuration
- Missing active program → existing School Configuration
- Missing instructor → existing Invite User flow with Instructor preselected
- Missing students → existing Invite User flow with Student preselected
- Pending/problem invitations → existing User Management recovery path
- Missing enrollment → existing Enrollment modal for the first active student needing enrollment
- Missing instructor assignment → existing Manage User modal for the first active learner needing assignment
- Source verification issue → return to School Dashboard and rerun the setup check

## Architecture boundary

G5-D adds navigation and presentation behavior only.

It does **not**:

- create a second invitation workflow;
- create new enrollment mutations;
- create new student-to-instructor assignment mutations;
- create new onboarding tables;
- change the frozen G5-B readiness rules.

The Setup Center resolves a blocker into a guided destination, while User Management uses the optional `setup` query parameter to open the existing action surface.

## Recovery limitation

Invitation recovery remains based on the existing Manage User → Resend setup link capability. G5-D guides the admin to that surface; broader invitation-status recovery UI remains a later Gate 5 recovery slice.

## Certification

G5-D is GREEN only when:

1. guided-action certification tests pass;
2. existing onboarding/user-management tests remain green;
3. Engineering Verification passes on the exact PR head;
4. Vercel preview is READY on the exact same PR head;
5. the exact head remains unchanged before merge.

After merge, production main and production Vercel must be verified before G5-D is formally closed.
