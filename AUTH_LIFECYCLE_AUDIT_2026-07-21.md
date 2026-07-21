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

## Production Callback Blocker — 2026-07-21

### Observed failure
- Controlled invitation to `arkmariah@gmail.com` was sent and delivered.
- Clicking **Accept invitation** reached `https://ascynpro.com` but showed **404 — This page could not be found**.
- Sanitized Vercel logs showed the request path sequence:
  - `GET /auth/callback` → `307`
  - `GET /auth/auth-code-error` → `404`

### Root cause
The server-side `/auth/callback` route immediately called `supabase.auth.exchangeCodeForSession(code)` on every GET. Email security scanners and client pre-fetchers follow the confirmation link and consume the single-use auth code before the actual user clicks. When the user then clicks the same link, the code is already used/expired, so the route redirected to `/auth/auth-code-error` — a route that did not exist, producing the observed 404.

Evidence from the controlled test user (`arkmariah@gmail.com`):
- `email_confirmed_at` and `last_sign_in_at` were both set within the same second as the first `/auth/callback` hit, confirming a session was created by an automated fetch rather than the user’s browser.
- Subsequent `/auth/callback` hits all redirected to `/auth/auth-code-error`.

### Fix implemented
- Replaced the server-side `src/app/auth/callback/route.ts` with a client page `src/app/auth/callback/page.tsx`.
- The page renders a **“Complete your account setup”** button and only calls `supabase.auth.exchangeCodeForSession(code)` after the user clicks it. Pre-fetchers that load the page cannot consume the code.
- Preserved flow logic: `type=recovery` → `/auth/update-password`; `type=invite` → `/auth/set-password`; other callbacks route by profile role via `getRoleBasedRedirect`.
- Preserved open-redirect protection by moving `isSafeRedirectPath` to `src/lib/auth-access.ts` and validating the `next` param before use.
- Created `src/app/auth/auth-code-error/page.tsx` as a safe fallback for invalid, used, or expired links.
- Added/updated tests in `src/app/auth/callback/page.test.tsx` and `src/lib/auth-access.test.ts`.

### Files changed
- Deleted: `src/app/auth/callback/route.ts`
- Deleted: `src/app/auth/callback/route.test.ts`
- Added: `src/app/auth/callback/page.tsx`
- Added: `src/app/auth/callback/page.test.tsx`
- Added: `src/app/auth/auth-code-error/page.tsx`
- Modified: `src/lib/auth-access.ts` (exported `isSafeRedirectPath` as type predicate)
- Modified: `src/lib/auth-access.test.ts` (added `isSafeRedirectPath` tests)
- Modified: `BETA_PHASE_1_QA_CHECKLIST.md`

### Verification after fix
- `npm test`: 24 files, 187 tests passed
- `npx tsc --noEmit`: no errors
- `npm run lint`: 0 errors (59 pre-existing warnings)
- `npm run build`: exit 0; `/auth/callback` and `/auth/auth-code-error` both appear in the route manifest

## Notes / Blockers

- No production data was modified.
- No commit, push, or deploy was performed.
- No invitation was sent to Tessa or anyone else.
- All verification commands pass.
