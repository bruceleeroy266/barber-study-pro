# Phase 13C.1 — Integration Security Repairs

## 1. Executive Summary

Phase 13C.1 addresses the five integration blockers identified in the Phase 13.5 System Integration & Functional Audit. The fixes harden multi-school isolation, prevent demo data from leaking into production sessions, stop fake production success states, and add governance around instructor-created schools.

No commit or push was performed per instructions.

---

## 2. Files Changed

| File | Change |
|---|---|
| `src/lib/demo-helpers.ts` | Split explicit demo mode from unconfigured-Supabase fallback. |
| `src/app/(auth)/login/page.tsx` | Demo auth bypass only in safe demo environment. |
| `src/app/(auth)/signup/page.tsx` | Active-school filter for student dropdown; production instructors create pending schools. |
| `src/app/admin/page.tsx` | School-scoped metrics; platform-wide metrics require `platform_super_admin` permission. |
| `src/app/(dashboard)/dashboard/messages/page.tsx` | Production messaging disabled; demo only in safe demo mode. |
| `src/app/instructor/messages/page.tsx` | Production messaging disabled; demo only in safe demo mode. |
| `src/lib/attendance/attendance-service.ts` | Fixed `schoolId` → `school_id` query column. |
| `src/components/messaging/ProductionMessagingPlaceholder.tsx` | New shared disabled-state placeholder. |

---

## 3. Fixes Made

### 3.1 Admin Dashboard Data Leak

**Problem:** `/admin` counted all `profiles` and all `schools`, exposing platform-wide totals to every school admin.

**Fix:**
- Fetches the admin's `school_id`.
- Checks `hasPermission(profile.role, 'view_platform_analytics')` (mapped to the future `platform_super_admin` role in `permissions.ts`).
- Regular admins see:
  - Users in their school only.
  - `Your School` count of 1.
  - School name in the subtitle.
- Platform super admins see total platform users/schools.

### 3.2 Messaging Production Status

**Problem:** Student and instructor messaging pages rendered only demo threads/notifications, creating fake success states in production.

**Fix:**
- Added `isExplicitDemoMode()` and `isSupabaseConfigured()` checks.
- Messaging UI is rendered only when `isExplicitDemoMode() && !isSupabaseConfigured()` (safe local demo environment).
- In production (Supabase configured), both pages render `ProductionMessagingPlaceholder` explaining that school-scoped messaging is coming soon.
- No messages can be sent or received in production.

### 3.3 Demo Mode Hardening

**Problem:** `isDemoFallbackEnabled()` returned true both when demo mode was enabled AND when Supabase was simply unconfigured. This allowed demo data to mix into real sessions and enabled credential-free login whenever `NEXT_PUBLIC_DEMO_MODE` was set, even with a real Supabase project configured.

**Fix:**
- `isExplicitDemoMode()`: returns true only when `NEXT_PUBLIC_DEMO_MODE === 'true'`.
- `isSupabaseConfigured()`: checks for real, non-placeholder URL/key.
- `isDemoFallbackEnabled()`: now returns explicit demo mode only.
- `isSafeDemoEnvironment()`: true only when explicit demo mode is enabled AND Supabase is not configured.
- Login page bypasses auth only in `isSafeDemoEnvironment()`.
- If demo mode is enabled but Supabase is configured, login falls back to real authentication and logs a warning.

### 3.4 Instructor School Creation Governance

**Problem:** Self-registered instructors could create active production schools without approval.

**Fix:**
- Safe local demo: instructors still create active schools immediately.
- Production (or misconfigured demo + real Supabase): instructors create schools with `is_active: false`.
- School selection dropdown on signup filters to `is_active = true`, so pending schools cannot accept students.
- Instructor signup success screen shows a pending-approval message when the school is inactive.

### 3.5 Attendance Service Column Mismatch

**Problem:** `attendance-service.ts` queried `.eq('schoolId', ...)` while the database schema uses `school_id`.

**Fix:**
- Changed query to `.eq('school_id', filters.schoolId)`.
- Updated `isDemoFallback()` to use the new safe-demo helper.

---

## 4. Security Impact

| Risk | Before | After |
|---|---|---|
| Cross-school admin data leak | Admin saw all users/schools | Admin sees only their school unless platform super admin |
| Fake messaging in production | Demo threads/notifications shown | Production shows disabled placeholder |
| Demo auth bypass with real Supabase | Credentials skipped if demo flag set | Credentials required unless safe demo env |
| Demo data in production sessions | Unconfigured Supabase triggered demo fallback | Unconfigured Supabase is an error state, no demo fallback |
| Unauthorized school creation | Instructors created active schools | Production schools created inactive/pending |
| Attendance query wrong column | `schoolId` (camelCase) | `school_id` (snake_case) |

---

## 5. Demo Mode Behavior

Demo mode is preserved when explicitly enabled AND Supabase is not configured:

- Login bypass still works.
- Demo students/instructors see demo data.
- Instructor-created schools are active in demo mode.
- Messaging renders demo threads and notifications.

If `NEXT_PUBLIC_DEMO_MODE` is enabled but a real Supabase project is configured, the app treats it as a misconfiguration and enforces real authentication and production restrictions.

---

## 6. Validation Results

| Check | Command | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ Passed |
| Production Build | `npm run build` | ✅ Passed (31 routes) |
| ESLint (modified files) | `npx eslint <modified files>` | ✅ Passed (0 errors, 0 warnings) |

---

## 7. Remaining Known Issues

- `attendance_records` table/columns may still need a migration to align with the service expectations.
- There is no admin UI to approve pending instructor-created schools.
- Admin "Users", "Content", and other management cards remain "Coming soon" placeholders.
- Repo-wide ESLint still reports 62 errors and 61 warnings in unmodified files.
- `supabase-server.ts` still returns a mock client when Supabase is unconfigured to prevent build/runtime crashes; this should eventually fail loudly with a configuration error page.

---

## 8. Commit Recommendation

**Recommended commit message:**

```
fix: Phase 13C.1 integration security repairs

- Scope admin dashboard metrics to school_id
- Require platform_super_admin permission for platform-wide analytics
- Lock production messaging behind coming-soon placeholder
- Separate explicit demo mode from unconfigured Supabase fallback
- Prevent demo auth bypass when Supabase is configured
- Create instructor schools as pending/inactive in production
- Fix attendance service schoolId -> school_id column mismatch
```

**Files to include:**

- `src/lib/demo-helpers.ts`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/signup/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/(dashboard)/dashboard/messages/page.tsx`
- `src/app/instructor/messages/page.tsx`
- `src/lib/attendance/attendance-service.ts`
- `src/components/messaging/ProductionMessagingPlaceholder.tsx`
- `PHASE_13C1_INTEGRATION_SECURITY_REPAIRS_REPORT.md`

**Do not include:** `ASCYN PRO - Bug Tracker.xlsx`
