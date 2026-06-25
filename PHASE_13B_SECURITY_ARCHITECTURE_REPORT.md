# Phase 13B — Security & Multi-School Architecture

## 1. Executive Summary

Phase 13B hardens ASCYN PRO for production multi-tenant use. It introduces a centralized RBAC module, a security audit logging foundation, server-side authorization helpers, and fixes the most critical authorization gaps found during the pre-implementation review.

Key fixes:
- Eliminated signup role escalation (users could previously self-register as `admin` via crafted metadata).
- Scoped the School Owner Dashboard to the admin’s assigned school.
- Enforced same-school validation in the `addInstructorNote` server action.
- Restricted `saveSchoolConfiguration` to the admin’s own school.
- Added security audit logging for permission denials, unauthorized access, failed logins, sensitive config changes, and logouts.
- Hardened Phase 13A migration policies to be idempotent.
- Created a new `security_logs` table and a sanitized `handle_new_user` trigger.

Demo Mode is fully preserved. No user-facing features were added.

---

## 2. Security Review

### Existing Strengths
- Middleware already enforces authentication on `/dashboard`, `/instructor`, and `/admin`.
- Middleware already enforces role-based access to `/instructor` (instructor/admin) and `/admin` (admin only).
- Server components generally fetch the current user and role-check before rendering data.
- Student-facing pages generally scope data to `user.id`.
- Instructor pages generally filter students by `school_id`.

### Vulnerabilities Found
1. **Signup role escalation** — `handle_new_user` copied `role` from `raw_user_meta_data` with no validation, allowing self-registration as `admin`.
2. **Cross-school data exposure** — School Owner Dashboard loaded all students, instructors, and records without `school_id` filters.
3. **IDOR in instructor notes** — `addInstructorNote` accepted any `studentId` without verifying the student belonged to the instructor’s school.
4. **School-setting takeover** — `saveSchoolConfiguration` allowed writing to `config.school.id` when the admin had no `school_id`.
5. **Non-idempotent RLS policies** — Phase 13A migrations used bare `create policy` statements that fail on replay.
6. **Missing school scoping** — Student gradebook pages queried `grade_categories` across all schools.
7. **No centralized RBAC** — Role checks were scattered and could drift.
8. **No security logging** — No structured audit trail existed.

---

## 3. Authorization Review

### Pages Audited

| Page | Existing Check | Gap | Status After Phase 13B |
|---|---|---|---|
| `/dashboard/*` | Requires login | Grade categories unscoped | Fixed |
| `/dashboard/compliance` | Requires login | Grade categories unscoped | Fixed |
| `/dashboard/grades` | Requires login | Grade categories unscoped | Fixed |
| `/instructor` | Middleware + server role check | None critical | Verified |
| `/instructor/attendance` | Server role check | None critical | Verified |
| `/instructor/compliance` | Server role check | None critical | Verified |
| `/instructor/gradebook` | Client role check | Could add server defense | Documented |
| `/instructor/messages` | Server role check | None critical | Verified |
| `/instructor/student/[id]` | Server role + same-school check | None critical | Verified |
| `/admin` | Middleware + server role check | None critical | Verified |
| `/admin/school` | Server role check | No school isolation | Fixed |
| `/admin/school/configuration` | Server role check | Could write to any school | Fixed |

### Missing Checks (documented for Phase 13C)
- Client-side instructor gradebook should be backed by a server action that re-validates role and school.
- Signup school creation by instructors should require email verification or admin approval.

---

## 4. RBAC Review

### New Centralized Module: `src/lib/security/permissions.ts`

- Defines all active roles (`student`, `apprentice`, `instructor`, `admin`).
- Defines future roles (`admissions`, `compliance_officer`, `financial_office`, `receptionist`, `teaching_assistant`, `platform_super_admin`).
- Defines permissions: `view_dashboard`, `manage_students`, `manage_attendance`, `manage_settings`, etc.
- Maps every role to its permissions.
- Provides helpers:
  - `hasPermission(role, permission)`
  - `hasAnyPermission(role, permissions)`
  - `hasAllPermissions(role, permissions)`
  - `canAccessRoute(role, route)`
  - `isInstructorOrAdmin(role)` / `isAdmin(role)` / `isLearner(role)`
  - `getRoleDisplayName(role)`

### Backward Compatibility
- `src/lib/auth-helpers.ts` now re-exports the canonical helpers from `permissions.ts`.
- Existing imports from `@/lib/auth-helpers` continue to work unchanged.

### Permission Matrix

| Permission | Student | Apprentice | Instructor | Admin | Future Roles |
|---|---|---|---|---|---|
| `view_dashboard` | ✅ | ✅ | ✅ | ✅ | — |
| `view_own_*` | ✅ | ✅ | — | — | — |
| `view_instructor_portal` | — | — | ✅ | ✅ | TBD |
| `view_school_*` | — | — | ✅ | ✅ | TBD |
| `manage_students` | — | — | ✅ | ✅ | admissions, TA |
| `manage_instructors` | — | — | — | ✅ | — |
| `manage_attendance` | — | — | ✅ | ✅ | receptionist, TA |
| `manage_gradebook` | — | — | ✅ | ✅ | TA |
| `manage_assessments` | — | — | ✅ | ✅ | — |
| `manage_compliance` | — | — | ✅ | ✅ | compliance_officer |
| `manage_messaging` | — | — | ✅ | ✅ | — |
| `manage_settings` | — | — | — | ✅ | — |
| `view_admin_dashboard` | — | — | — | ✅ | platform_super_admin |

---

## 5. Multi-School Isolation Review

### Principle
Every production query must be scoped to the user’s assigned `school_id`, except where the user is explicitly unassigned (e.g., an apprentice without a school) and only global/demo data should be visible.

### Fixes Applied
- **School Owner Dashboard** (`/admin/school`): all queries now filter by `profile.school_id`. Derived records are filtered to school user IDs.
- **`saveSchoolConfiguration`**: rejects admins with no `school_id`; persists only to `profile.school_id`.
- **`addInstructorNote`**: verifies the target student belongs to the instructor/admin’s school.
- **Student grade categories**: scoped to the student’s school or global (`school_id is null`).
- **Demo fallback data**: filtered to the current user’s school so demo mode cannot leak cross-school demo records.

### Remaining Gaps
- Tables referenced in code but not yet created (`attendance_records`, `hour_logs`, `grades`, `grade_categories`, `assessments`, `notifications`, `messages`) rely on application-level filters today. RLS policies for these tables will be added when the tables are created in Phase 13C/14.

---

## 6. RLS Review

### Phase 13A Policies Reviewed
All policies in `supabase/migrations/20250625010*` were reviewed:
- Table coverage: `programs`, `instructors`, `students`, `enrollments`, `school_settings`.
- Access model: school-scoped reads, admin-only mutations, self-read where applicable.
- Privilege escalation: policies require `role in ('instructor','admin')` and matching `school_id`.
- Public access: no policies grant unauthenticated access.

### Hardening Applied
- Added `drop policy if exists ...` before every `create policy` so migrations are idempotent and safe to replay.
- Created a new security migration: `20250625020000_security_hardening.sql`.
- Created `public.security_logs` table with RLS (users read own logs).
- Replaced `public.handle_new_user()` trigger with a sanitized version that never grants `admin` or future platform roles during self-registration.
- Added `public.current_user_school_id()` helper for future RLS policies.

### Legacy Schema Files
- Updated `supabase-schema.sql` and `supabase-schema-minimal.sql` `handle_new_user` triggers to match the sanitized migration version, reducing drift.

---

## 7. Route Protection Review

### Middleware (`src/middleware.ts`)
- Authentication enforced for `/dashboard`, `/instructor`, `/admin`.
- Role enforcement for `/instructor` (instructor/admin) and `/admin` (admin only).
- Demo mode bypass preserved when `NEXT_PUBLIC_DEMO_MODE=true` and Supabase is unconfigured.
- Added structured console warnings for unauthorized route attempts.

### Server Components
- `/admin/school`, `/admin/school/configuration`, `/instructor/*`, `/instructor/student/[id]` all re-verify role after middleware.
- Defense-in-depth: middleware is the first gate; server components are the second gate.

### Client Components
- `/instructor/gradebook` performs client-side role verification. A server-side action or API layer should be added in Phase 13C for defense-in-depth.

---

## 8. Session Security Review

### Authentication Flow
- Supabase SSR client used in middleware and server components.
- Browser client used in client components.
- Email verification checked on login.
- Password reset and update-password flows exist and validate password length.

### Session Handling
- Sessions are cookie-managed by `@supabase/ssr`.
- `createClient()` in `src/lib/supabase-server.ts` returns a mock client in demo mode or when unconfigured, preserving app stability.

### Improvements
- Added failed-login audit logging via `src/app/(auth)/actions.ts`.
- Added logout audit logging helper (ready for logout UI wiring).

---

## 9. Security Logging

### Foundation Module: `src/lib/security/audit-logger.ts`
- Structured security event types: `failed_login`, `permission_denied`, `unauthorized_page_access`, `role_change`, `sensitive_config_change`, `school_isolation_violation`, `data_export`, `session_expired`, `logout`.
- `logSecurityEvent()` writes to console and attempts to insert into `public.security_logs`.
- Logging failures are swallowed so they cannot break auth flows.
- Convenience helpers: `logPermissionDenied`, `logUnauthorizedAccess`, `logRoleChange`, `logSensitiveConfigChange`.

### Events Now Logged
- Permission denied in `saveSchoolConfiguration`.
- Unauthorized school-scoped access in `addInstructorNote`.
- Successful school settings save in `saveSchoolConfiguration`.
- Failed login attempts in `login/page.tsx`.
- Unauthorized route attempts in middleware (console).

### Security Logs Table
- `public.security_logs` with indexes on `user_id`, `type`, `school_id`, and `created_at`.
- RLS policy allows users to read their own logs.

---

## 10. Validation Results

| Check | Command | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ Passed |
| Production Build | `npm run build` | ✅ Passed (31 routes generated) |
| ESLint (modified files) | `npx eslint src/lib/security src/app/admin/school src/app/instructor/student "src/app/(auth)" src/middleware.ts src/lib/auth-helpers.ts` | ✅ Passed |

---

## 11. Known Limitations

- **Client-side gradebook**: authorization is currently client-side. A server-side validation layer is recommended in Phase 13C.
- **Instructor school creation**: instructors can still create a school during signup. This is acceptable for early production but should be gated by email verification or admin approval in a future phase.
- **Missing operational tables**: `attendance_records`, `hour_logs`, `grades`, `grade_categories`, `assessments`, `notifications`, `messages` do not exist in migrations yet. RLS policies for these tables are deferred to Phase 13C/14.
- **Security log persistence**: the logger attempts to write to `security_logs` but ignores failures. This is intentional for the foundation; a future phase can add retries or external SIEM routing.
- **Demo mode mock client**: the mock Supabase client in demo mode does not enforce RLS. This is acceptable because demo mode is explicitly a safe sandbox.

---

## 12. Recommendations for Phase 13C

1. **Create operational tables** (`attendance_records`, `hour_logs`, `grades`, `grade_categories`, `assessments`, `notifications`, `messages`) with full RLS policies and `school_id` columns.
2. **Add server-side gradebook actions** that re-validate role and school before mutating grades.
3. **Introduce email verification gating** for instructors who create schools.
4. **Add admin user-management UI** with role-change auditing using `logRoleChange`.
5. **Add platform_super_admin support** in middleware and RLS for cross-school platform analytics.
6. **Create `supabase/config.toml`** to enable CLI migration deployment.
7. **Add integration tests** for multi-school isolation (e.g., instructor A cannot read instructor B’s students).
8. **Review and remove** legacy `supabase-schema.sql` and `supabase-schema-minimal.sql` once the migration-based workflow is adopted.
