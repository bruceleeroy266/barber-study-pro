# UM-H3 — User Identity Editing & Credential Recovery Contract

**Status:** LOCKED CONTRACT / NO RUNTIME IMPLEMENTATION YET  
**Baseline:** `main` at `fc849e3fc190baf174c7a06c3d790df537c0a257`  
**Primary scope:** `/admin/users` and existing user-management server actions  
**Non-goal:** This slice does not expose, recover, display, log, or store a user's existing plaintext password.

## 1. Goal

ASCYN PRO must let an authorized administrator correct user identity mistakes after account creation without deleting and recreating the learner, while preserving tenant boundaries, auth/profile consistency, onboarding lifecycle integrity, auditability, and existing user data.

The intended admin workflow is:

`Manage User -> Edit User -> correct name/email -> confirm -> save -> Send Fresh Setup Link if credential recovery is needed`.

## 2. Locked editable fields

UM-H3 permits editing:

- full name
- login email

UM-H3 does not add free-form editing for:

- role
- school
- instructor assignment
- approval/disabled state
- School Metrics inclusion
- historical learning data
- existing password

Those remain in their existing dedicated controls and authorization paths.

## 3. Password contract

ASCYN PRO must never display or retrieve a user's current password.

Password problems are handled by the existing secure recovery/setup flow:

- Send Fresh Setup Link
- user chooses a new password through the authenticated recovery flow

A privileged admin password override is not part of the default UM-H3 workflow.

No plaintext password may appear in:

- UI
- server logs
- audit logs
- database records
- analytics
- error messages

## 4. Authorization contract

All identity edits are server-side privileged actions.

Before any mutation, the action must:

1. authenticate the caller;
2. load the caller's canonical profile;
3. load the target user's canonical profile;
4. confirm the target is a manageable role;
5. enforce platform-admin vs school-admin scope using canonical server-side school IDs;
6. reject cross-school edits for tenant-scoped admins.

The browser-provided school ID, role, or target ownership must never be trusted as authorization evidence.

Existing UM-H1 authorization/reconciliation patterns remain authoritative unless a separately proven defect requires repair.

## 5. Email normalization and uniqueness

Before changing an email:

- trim whitespace;
- normalize casing consistently;
- validate email format;
- compare normalized old/new values;
- treat unchanged normalized email as a no-op;
- verify the requested email is not already owned by another auth user or ASCYN profile;
- reject conflicts before mutation where possible.

The final state must not permit two ASCYN identities to share the same login email.

## 6. Auth/profile synchronization

The canonical login email exists in Supabase Auth and is mirrored in `profiles.email`.

An email change is successful only when both systems agree on the same normalized value.

The server action must use the service-role/admin auth path for the auth mutation and must never expose the service key to the client.

If one side changes and the other side fails, the action must attempt deterministic rollback or reconciliation so the system does not intentionally leave Auth and `profiles` divergent.

A partial failure must return an explicit operational error and must not falsely report success.

## 7. Name update behavior

Full-name changes update the canonical profile identity only.

Name changes must not:

- recreate the user;
- change the user's ID;
- change school membership;
- alter learning history;
- alter hours, grades, attendance, assessments, messages, or assignments.

Existing references keyed by user/profile ID must remain intact.

## 8. Invitation/setup lifecycle reconciliation

ASCYN PRO currently tracks school onboarding invitations by school + email + role.

When a login email changes, UM-H3 must reconcile the matching invitation lifecycle record so onboarding state does not remain attached only to the obsolete email.

Rules:

- pending or expired onboarding records for the same canonical user/school/role must be reconciled to the corrected email;
- accepted invitation history must remain auditable and must not be silently rewritten in a way that destroys historical meaning;
- revoked invitations must not be automatically reactivated;
- duplicate lifecycle records must not be created for the same active identity;
- if reconciliation cannot be completed safely, the identity edit must fail or surface a repair-required state rather than silently drifting.

After a successful email correction, Send Fresh Setup Link must target the corrected email.

## 9. Confirmation UX

Changing a login email requires an explicit confirmation step.

The UI must clearly show:

- current login email;
- proposed login email;
- warning that the new address becomes the address used to sign in.

The save action must be disabled while submitting to prevent duplicate mutations.

No confirmation is required for a name-only change beyond the normal Save action.

## 10. Audit contract

Every successful identity mutation must produce a user-management audit event containing:

- actor ID
- actor email
- actor role
- target user ID
- target user's resulting email
- school ID
- action type
- old values
- new values
- timestamp supplied by the audit table/database

Audit values may include:

- old/new full name
- old/new email

Audit values must never include:

- current password
- new password
- password reset token
- service-role credential
- recovery URL secrets

Suggested action name: `update_user_identity`.

## 11. Failure behavior

UM-H3 must fail closed for:

- unauthorized caller;
- cross-school target;
- unsupported target role;
- invalid email;
- duplicate email;
- target auth user missing;
- profile/auth identity mismatch that cannot be reconciled safely;
- auth update failure;
- profile update failure;
- unsafe invitation reconciliation failure.

Errors shown to the admin should be actionable but must not disclose secrets or cross-tenant account details.

## 12. UI placement

The existing Manage User experience remains the control center.

Add an `Edit User` section/action to the existing user-management flow rather than creating a separate identity-management product surface.

Required parity:

- desktop user management
- mobile user management

The existing `Send fresh setup link` action remains available alongside identity editing.

## 13. Data-preservation contract

Editing name or email must preserve the user's existing canonical ID and therefore preserve:

- student/instructor domain records
- enrollments
- instructor assignments
- grades
- attendance
- hours
- assessments
- progress
- readiness evidence
- communications
- compliance records
- metrics inclusion status

UM-H3 must not solve identity mistakes by deleting and recreating users.

## 14. Required test matrix

Implementation is not certifiable until automated coverage proves at least:

1. platform admin can update an allowed user's name;
2. platform admin can correct a login email;
3. same-school school admin can correct an allowed user's identity;
4. school admin cannot edit a user from another school;
5. duplicate email is rejected;
6. invalid email is rejected;
7. normalized no-op email does not create needless auth churn;
8. auth + profile email remain synchronized on success;
9. profile failure after auth mutation triggers rollback/reconciliation behavior;
10. invitation lifecycle follows the corrected email where applicable;
11. revoked invitation is not silently reopened by an identity edit;
12. Send Fresh Setup Link uses the corrected email;
13. audit event contains old/new identity values;
14. audit event contains no password or token;
15. current password is never rendered or returned;
16. existing learning/attendance/hour/grade records remain attached to the same user ID;
17. mobile and desktop expose the same edit capability;
18. duplicate-submit protection exists.

## 15. Certification gate

UM-H3 implementation may be called GREEN only when:

- all targeted UM-H3 tests pass;
- full Engineering Verification passes on the exact unchanged PR head;
- Vercel passes on that same exact head;
- PR is mergeable;
- no existing UM-H1/UM-H2/Gate onboarding regression is introduced.

After merge:

- verify exact resulting `main` commit;
- verify exact production deployment reaches READY;
- run one production smoke using a test/non-destructive account:
  - edit name or controlled test email;
  - verify login identity/profile parity;
  - verify setup-link routing;
  - verify audit record;
  - verify existing learner data remains intact.

## 16. Explicit exclusions from UM-H3

UM-H3 does not:

- expose existing passwords;
- add password viewing;
- make role/school changes part of generic identity editing;
- bypass existing instructor assignment controls;
- delete/recreate users to repair typos;
- alter grading, TLS, H&A, Communications, Gate 5, or G6-A behavior;
- automatically edit real Elevate learner records during development or testing.

## 17. Locked implementation order

1. UM-H3.1 — contract
2. UM-H3.2 — secure identity server action + rollback/reconciliation
3. UM-H3.3 — invitation/setup lifecycle reconciliation
4. UM-H3.4 — desktop/mobile Edit User UI
5. UM-H3.5 — recovery integration and confirmation safeguards
6. UM-H3.6 — audit validation
7. UM-H3.7 — regression/security certification
8. merge + exact production verification

Any implementation that violates this contract must be treated as a regression, not as an acceptable shortcut.
