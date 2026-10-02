# UM-H2 — Mobile User Management Redesign Contract

Status: PLANNING / NO UI IMPLEMENTATION YET
Scope: `/admin/users`
Backend rule: UM-H1 production logic is frozen. UM-H2 may consume existing server actions but must not alter their authorization, reconciliation, rollback, or database semantics unless a real defect is independently proven.

## 1. Current-state audit

The current implementation is desktop-first and degrades poorly on phones:

- User list is a 9-column table with `min-w-[1100px]`.
- Mobile users must horizontally scroll to reach role, school, status, password state, created date, and actions.
- Role, school, approval status, and enabled/disabled state mutate directly from row controls.
- Password reset uses the browser-native `prompt()`.
- Generic `handleAction()` has no per-user mutation lock, so rapid repeated taps can submit duplicate actions.
- Create User and Invite User have no dedicated submit-pending state.
- Create/Invite school selects are `required` while also rendering an empty `No school` option.
- Delete already uses an explicit confirmation modal and should remain the model for destructive actions.
- Enrollment already uses a proper modal and has its own loading/submitting states.
- Search is the only top-level control currently using a transition/loading state.
- The shared Modal component already provides Escape handling, focus trapping, scroll locking, and focus restoration.

## 2. Responsive layout contract

### Mobile: < 768px
Do not render the wide user table.

Render:
1. Search/filter panel.
2. Create User / Invite User actions.
3. Result count.
4. One stacked `UserCard` per user.
5. Pagination controls.
6. Existing modals/action dialogs.

No horizontal page scrolling is allowed.

### Desktop/tablet: >= 768px
Keep the current dense table pattern as the primary presentation, but use the same action-confirmation and pending-state rules as mobile.

The desktop view must not lose any existing fields or actions.

## 3. Mobile UserCard information hierarchy

Each card must show, in this order:

### Header
- Full name
- Email
- Role badge
- Approval-status badge

### Account summary
- School name, or `No school`
- Account state: Enabled / Disabled
- Password state: Reset required / No reset required
- Created date
- For students: active enrollment count when available

### Primary action
- One full-width `Manage user` button

The card must not expose role/school/status selects directly on its collapsed surface.

## 4. Manage User interaction contract

Tapping `Manage user` opens a modal using the existing shared `Modal` component.

Modal title:
`Manage — {full_name}`

Identity summary at top:
- full name
- email
- current role
- current school

Sections appear in this exact order:

### A. Access
- Send setup link
- Require password reset
- Reset temporary password

Reset temporary password must use an in-app password field, never browser `prompt()`.

### B. Status
- Approval status
- Enabled / Disabled

Approval/status mutations require explicit Save/Confirm interaction rather than firing immediately when a select changes.

### C. Role & School
- Role selector
- School selector, platform admin only

Changing role or school is high impact:
- selecting a new value alone must not mutate data;
- user must press `Save role` or `Save school`;
- confirmation copy must state the current value and proposed value;
- while saving, the affected control and confirmation action are disabled.

School admins never receive platform-only school reassignment controls.

### D. Enrollment
Student role only:
- display current enrollment count
- `Manage enrollment` opens the existing EnrollmentModal

### E. Danger zone
- Delete user
- Disabled for the current signed-in user's own account
- Existing explicit delete confirmation remains required

## 5. Mutation/pending-state contract

Use per-user/per-action pending state. A mutation key should identify both user and action, for example:
`{userId}:role`
`{userId}:school`
`{userId}:status`
`{userId}:disabled`
`{userId}:setup-link`
`{userId}:require-password-reset`
`{userId}:password-reset`

Rules:
- Only the affected action is locked while pending.
- Repeated taps cannot submit duplicate mutations.
- Pending action displays a clear progress label such as `Saving…` or `Sending…`.
- On success, reload the current result page and preserve active filters.
- On failure, keep the modal open and display the server error.
- Never optimistically display a security-sensitive role/school/status change before server success.

Create User and Invite User each get their own submit-pending state and disabled submit button.

## 6. Create User / Invite User mobile contract

On mobile:
- single-column layout;
- full-width fields and submit button;
- buttons/fields maintain minimum comfortable touch target height;
- forms must not cause horizontal overflow.

School-field rules:
- Student and Instructor require a school.
- Platform-level Admin may use `No school`.
- School Admin requires a school.
- Apprentice behavior remains consistent with current backend rules; UI must not invent a stricter rule without backend confirmation.
- School-admin callers remain locked to their own school.

The UI must not render an empty `No school` choice as a valid option while simultaneously marking the field required in a way that prevents an otherwise-valid platform-admin submission.

## 7. Search/filter contract

Mobile order:
1. Search name/email
2. Role
3. Approval status
4. School, platform admin only
5. Search button

Controls stack vertically on narrow screens and may move to two columns when width allows.

Search/loading state must disable the Search button and preserve entered filters.

## 8. Accessibility contract

- All interactive controls must have accessible names.
- Status/role badges are descriptive, not interactive.
- Modals retain focus trap, Escape close, body-scroll lock, and focus restoration.
- Confirmation dialogs identify the target user's name and the exact change.
- Error/success messages use live-region semantics.
- No action may depend on color alone to communicate state.

## 9. Test contract before merge

UM-H2 implementation is not certifiable until automated coverage proves:

1. Mobile presentation renders cards and hides the 1100px table below the md breakpoint.
2. Desktop presentation retains the table.
3. UserCard contains name, email, role, status, school, account state, password state, and created date.
4. Manage User modal opens for the correct user.
5. Role change does not call the server action until explicit confirmation.
6. School move does not call the server action until explicit confirmation.
7. Status/disable mutation cannot double-submit while pending.
8. Password reset uses an in-app field and never calls `window.prompt`.
9. Create/Invite submits disable while pending.
10. Student enrollment remains reachable.
11. Current user cannot delete self.
12. School-admin view never exposes cross-school reassignment.
13. Active filters survive post-action refresh.
14. Empty-state and pagination behavior remain functional.
15. No UM-H1 server-action/database code is modified by the mobile slice.

## 10. Implementation boundary

Expected files allowed to change in UM-H2 implementation:
- `src/app/admin/users/UserManagementClient.tsx`
- new colocated presentational components under `src/app/admin/users/`
- `src/app/admin/users/UserManagementClient.test.tsx`
- new focused UI tests if useful

Expected files protected from routine UM-H2 changes:
- `src/app/admin/users/actions.ts`
- UM-H1 Supabase migration/function
- Auth/RLS policies
- unrelated admin pages

If implementation reveals a backend defect, stop and open a separate hardening slice rather than silently modifying UM-H1.

## 11. Acceptance definition

UM-H2 is GREEN only when:
- mobile requires no horizontal scrolling;
- the most important user identity/status information is readable without opening a modal;
- high-impact mutations require explicit confirmation;
- duplicate-tap protection exists;
- Create/Invite are usable on phone;
- enrollment remains accessible;
- desktop functionality is preserved;
- exact-head Engineering Verification and Vercel both pass.
