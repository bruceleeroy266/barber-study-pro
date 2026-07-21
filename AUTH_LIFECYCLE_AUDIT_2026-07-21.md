# ASCYN PRO — Authentication & Invitation Lifecycle Audit

**Date:** 2026-07-21
**Project:** ASCYN PRO
**Repository:** `C:\AI\ACTIVE\ASCYN-PRO\02-work\app`
**Scope:** Final authentication-lifecycle audit after invitation flow

---

## PASS/FAIL Summary

| # | Checkpoint | Status | Evidence |
|---|------------|--------|----------|
| 1 | Auth-user trigger creates exactly one profile | **PASS** | `supabase/migrations/20260711180000_pilot_invite_only_access.sql` + `src/app/admin/users/actions.ts` |
| 2 | Secure Set Password page | **PASS** | `src/app/auth/set-password/page.tsx` + `page.test.tsx` |
| 3 | Instructor redirect to `/instructor` | **PASS** | `src/app/auth/callback/route.ts`, `src/app/auth/set-password/page.tsx`, `src/lib/auth-access.ts` |
| 4 | Student redirect to `/dashboard` | **PASS** | same as above |
| 5 | Invalid/expired invitation handling | **PASS** | callback code-exchange failure → `/auth/auth-code-error`; missing session → "invalid or expired" message |
| 6 | Open-redirect protection | **PASS** | `src/app/auth/callback/route.ts` `isSafeRedirectPath` + tests |
| 7 | Tests, TypeScript, lint, build | **PASS** | see Evidence section |
| 8 | Proposed two-commit file separation | **PASS** | see Proposed Commits section |

---

## Detailed Evidence

### 1. Auth-user trigger and exactly one profile

- `handle_new_user()` in `supabase/migrations/20260711180000_pilot_invite_only_access.sql` inserts a profile row on every auth user creation and uses `on conflict (id) do update`, guaranteeing one profile per user.
- `src/app/admin/users/actions.ts` `inviteUser()` calls `inviteUserByEmail()` (which fires the trigger) and then **upserts** the profile with the validated `school_id`, `approval_status`, etc. The upsert uses `onConflict: 'id'`, so it overwrites trigger defaults without creating duplicates.
- `src/app/admin/users/actions.test.ts` explicitly tests that upsert is called once and that duplicate auth emails are rejected.

### 2. Secure Set Password page

`src/app/auth/set-password/page.tsx`:
- Verifies the user has a session; otherwise shows "invalid or has expired".
- Requires password confirmation match.
- Enforces minimum 8 characters with uppercase, lowercase, and digit.
- Calls `supabase.auth.updateUser({ password })`.
- After success, fetches the profile role and routes via `getRoleBasedRedirect`.

### 3 & 4. Role-based redirects

`src/lib/auth-access.ts` `getRoleBasedRedirect`:
- `student` → `/dashboard`
- `apprentice` → `/dashboard`
- `instructor` → `/instructor`
- `admin` → `/admin`
- `school_admin` → `/school`
- missing/unknown role → `/login?error=invalid_role` (never defaults to admin)

Both the callback route and set-password page use this helper.

### 5. Invalid/expired invitation handling

- `src/app/auth/callback/route.ts`: if `exchangeCodeForSession` fails or no code is supplied, redirects to `/auth/auth-code-error`.
- `src/app/auth/set-password/page.tsx`: if the session is missing/expired, shows a clear error message.

### 6. Open-redirect protection

`src/app/auth/callback/route.ts`:
- Only accepts relative paths starting with `/dashboard`, `/instructor`, `/admin`, or `/school`.
- Rejects absolute URLs and protocol-relative URLs (`//evil.com`).
- Falls back to `/dashboard` for any unsafe `next` value.
- Tests cover external and protocol-relative attempts.

### 7. Tests, TypeScript, lint, build

| Check | Command | Result |
|-------|---------|--------|
| Unit tests | `npm test` | ✅ 24 files, 185 tests passed |
| Type check | `npx tsc --noEmit` | ✅ No errors |
| Lint | `npm run lint` | ✅ 0 errors (59 pre-existing warnings) |
| Production build | `npm run build` | ✅ Exit 0; all pages generated |

---

## Proposed Two-Commit File Separation

### Commit 1 — Backend / auth lifecycle
Focus: Supabase schema, server-side role routing, invitation action, password set endpoint.

- `supabase/migrations/20260711180000_pilot_invite_only_access.sql`
- `src/lib/auth-access.ts`
- `src/lib/auth-access.test.ts`
- `src/app/auth/callback/route.ts`
- `src/app/auth/callback/route.test.ts`
- `src/app/auth/set-password/page.tsx`
- `src/app/auth/set-password/page.test.tsx`
- `src/app/admin/users/actions.ts`
- `src/app/admin/users/actions.test.ts`

### Commit 2 — Admin UI / user-management client
Focus: Pages and React components that consume the backend actions.

- `src/app/admin/users/page.tsx`
- `src/app/admin/users/UserManagementClient.tsx`
- `src/components/admin/school-config/EnrollmentSection.tsx`
- `src/app/admin/users/UserManagementClient.test.tsx` (if added later)

This separation keeps the auth/security logic reviewable independently from the UI wiring.

---

## Notes / Blockers

- No production data was modified.
- No commit, push, or deploy was performed.
- No invitation was sent to Tessa or anyone else.
- All verification commands pass.
