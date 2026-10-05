# G5-F — Recovery UX

## Purpose

Make common school-onboarding failures recoverable by the school administrator without ASCYN PRO staff intervention.

G5-F reuses the certified invitation, setup-link, enrollment, and instructor-assignment workflows. It does not create a parallel onboarding or recovery model.

## Recovery Center

User Management now surfaces one School Setup Recovery section for accounts that need attention.

It identifies:

- pending invitations;
- expired invitations;
- revoked invitations;
- students missing active program enrollment;
- students/apprentices missing instructor assignment.

Each issue exposes the existing corrective action directly:

- invitation issue → Send fresh setup link;
- missing enrollment → open existing Enrollment modal;
- missing assignment → open existing Manage User instructor-assignment control.

## Invitation lifecycle repair

Previously, `resendUserSetupLink()` sent a recovery email but did not refresh an expired/revoked onboarding lifecycle record. That could leave the G5-B readiness resolver blocked even after the user regained access.

G5-F corrects that mismatch.

After a successful recovery email, `resendUserSetupLink()` now calls the existing `ensurePendingInvitationLifecycle()` helper. For non-accepted invitation records this:

- restores status to `pending`;
- refreshes `invited_at`;
- extends `expires_at`;
- clears revoked fields;
- keeps accepted invitations closed.

The School Dashboard and User Management routes are revalidated after recovery.

## Boundary

G5-F does not add:

- new invitation tables;
- new enrollment mutations;
- new assignment mutations;
- new readiness rules;
- bulk recovery actions.

## Certification

G5-F is GREEN only when the recovery action tests, onboarding regression suite, Engineering Verification, and exact-head Vercel preview all pass.
