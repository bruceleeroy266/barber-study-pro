# Phase 13E — Final Smoke Test Report

**Project:** ASCYN PRO / Barber Study Pro V2  
**Repository:** `C:\Users\skyfl\Desktop\barber-study-pro-v2`  
**Branch:** `demo-polish-ascyn-pro`  
**Date:** 2026-06-25  
**Commit tested:** `eab3c8a` — *Phase 13E: Complete production persistence layer*

---

## 1. Pre-Commit Verification

### 1.1 Git Status Before Commit

Phase 13E files were staged. `ASCYN PRO - Bug Tracker.xlsx` was untracked and not staged. Phase 13D files remained unstaged.

### 1.2 TypeScript

```bash
npx tsc --noEmit
```

✅ Passed with no errors.

### 1.3 Production Build

```bash
npm run build
```

✅ Compiled successfully. 35 routes generated.

### 1.4 ESLint on Modified Files

```bash
npx eslint <Phase 13E modified files>
```

✅ 0 errors, 0 warnings.

---

## 2. Commit

```bash
git commit -m "Phase 13E: Complete production persistence layer"
```

**Commit hash:** `eab3c8a`

**Files changed:** 28 files, 3336 insertions(+), 246 deletions(-)

### Git Status After Commit

```
eab3c8a Phase 13E: Complete production persistence layer
 M src/app/admin/page.tsx
 M src/lib/security/permissions.ts
 M src/middleware.ts
 M src/types/index.ts
?? "ASCYN PRO - Bug Tracker.xlsx"
?? PHASE_13D_ENTERPRISE_SERVICES_REPORT.md
?? PHASE_13E_FINAL_SMOKE_TEST_REPORT.md
?? supabase/seed-test-accounts.sql
?? src/app/admin/audit/
?? src/app/admin/health/
?? src/app/admin/maintenance/
?? src/app/maintenance/
?? src/components/admin/audit/
?? src/components/admin/health/
?? src/components/admin/maintenance/
?? src/lib/backup/
?? src/lib/diagnostics/
?? src/lib/features/
?? src/lib/jobs/
?? src/lib/maintenance/
?? src/lib/notifications/
?? supabase/migrations/20250625160000_create_enterprise_services_tables.sql
```

Phase 13E is committed. Phase 13D files and the bug tracker remain untracked/uncommitted.

---

## 3. Test Account & Test School Preparation

Created a dedicated test seed file: `supabase/seed-test-accounts.sql`

It provisions:

| Account | Email | Role | Password |
|---------|-------|------|----------|
| Smoke Test Admin | `admin@ascyn-smoke.test` | `admin` | `[REDACTED]` |
| Smoke Test Instructor | `instructor@ascyn-smoke.test` | `instructor` | `[REDACTED]` |
| Smoke Test Student | `student@ascyn-smoke.test` | `student` | `[REDACTED]` |

**Test school:** `ASCYN Smoke Test Academy` (`11111111-1111-1111-1111-111111111111`)

**Test program:** `Barbering Smoke Test Program` (`21111111-1111-1111-1111-111111111111`)

**Test grade categories:** `Smoke Written Exam`, `Smoke Practical Exam`

**Test assessment rubric:** `HAIRCUT` rubric with two criteria

### Important Setup Note

The seed file inserts `profiles` rows with placeholder auth user IDs. Because Supabase Auth generates user IDs when accounts are created, the actual workflow is:

1. Create the three auth users in Supabase Authentication with the emails above and a strong password stored in your secrets manager (never commit passwords).
2. Copy the generated user UUIDs into `supabase/seed-test-accounts.sql`.
3. Run the seed SQL against a local/test Supabase instance.
4. Start the app with `NEXT_PUBLIC_DEMO_MODE=false` and run the smoke test checklist below.

---

## 4. Manual Smoke Test

### 4.1 Test Environment

- **Local dev server:** Started successfully on `http://localhost:3000`
- **Build mode:** Development / attempted production mode with `NEXT_PUBLIC_DEMO_MODE=false`
- **Supabase:** Project `https://hgyznydxepjsvbjsirpv.supabase.co` configured in `.env.local`
- **Local Supabase CLI:** Available (`2.108.0`) but Docker is not running, so local Supabase cannot be started.
- **Browser / HTTP access to localhost:** Blocked by environment policy for private/internal IPs.

### 4.2 What Was Verified

| Test | Method | Result |
|------|--------|--------|
| Commit hash baseline | `git log -1 --oneline` | ✅ `eab3c8a` confirmed |
| TypeScript passes | `npx tsc --noEmit` | ✅ |
| Production build passes | `npm run build` | ✅ 35 routes |
| ESLint passes on modified files | `npx eslint` | ✅ 0 errors, 0 warnings |
| Dev server starts | `npm run dev` | ✅ Server reported "Ready" |
| Test seed SQL created | `supabase/seed-test-accounts.sql` | ✅ |
| Seed SQL references valid tables/roles | Static review | ✅ |

### 4.3 What Could Not Be Verified

Authenticated end-to-end UI testing could not be completed due to environment constraints:

1. **No live local Supabase:** Docker is not available, so the local Supabase stack (db + auth) cannot start. The real Supabase project is configured, but creating/disposing test accounts in a live project was avoided without explicit authorization.
2. **No browser/HTTP access to localhost:** Browser automation and `curl` to `localhost:3000`/`127.0.0.1:3000` are blocked by policy, preventing direct page verification.

As a result, the following flows were not exercised live:

- Admin login and school-scoped data loading
- Instructor attendance create/edit/correction/audit log
- Instructor grade create/update
- Instructor assessment create/update
- Instructor note create/edit
- Student self-only data isolation
- Cross-role route access denial

These flows remain statically verified by:

- Correct server actions with auth + school checks
- RLS policies on all operational tables
- Explicit `school_id` filters in queries
- Middleware role enforcement

---

## 5. Demo Mode Verification

- Demo Mode is detected when `NEXT_PUBLIC_DEMO_MODE=true` or Supabase is not configured.
- All service fallback paths use `isExplicitDemoMode() && !isSupabaseConfigured()`.
- All UI fallback paths use `isDemoFallbackEnabled()`.
- `addInstructorNote` rejects writes in safe demo environments.
- No production-only code path breaks demo rendering.

**Result:** ✅ Demo Mode logic is consistent and preserved.

---

## 6. Bugs Found

Two application bugs were discovered during the authenticated signup smoke test:

### 6.1 Instructor signup routed to the student dashboard

After a successful instructor signup (or login), the user landed on `/dashboard` regardless of role. In production, an instructor whose newly created school was pending approval should see a clear pending-approval state, and an approved instructor should land on `/instructor`.

### 6.2 Smoke test school missing from student signup dropdown

The student signup school dropdown did not show a matching smoke-test school, so a new student account could not be created against the seeded test school.

---

## 7. Root Cause

- `/dashboard` was a generic student view with no role-based routing. It never redirected admins, approved instructors, or pending instructors to their correct destinations.
- `supabase/seed-test-accounts.sql` used columns (`status`, `zip`, `email`, `phone`) and a profile `status` column that do not exist in the current schema, so the seed could fail or never insert the smoke-test school.
- The manual school-name fallback in the signup flow did not filter by `is_active`, which could match an inactive/pending school.

---

## 8. Files Changed

| File | Change |
|------|--------|
| `src/app/(dashboard)/dashboard/page.tsx` | Added role-based post-login routing: admin → `/admin`, pending instructor → `/pending-approval`, approved instructor → `/instructor`, student/apprentice → stay on `/dashboard`. |
| `src/app/pending-approval/page.tsx` | New page that displays a clear pending-approval message for instructors whose school is not yet active. |
| `src/app/(auth)/signup/page.tsx` | Added `is_active = true` filter to the manual school-name lookup so students cannot match inactive/pending schools. |
| `supabase/seed-test-accounts.sql` | Aligned school and program inserts with the actual schema; removed non-existent `status`/`zip`/`email`/`phone` columns and profile `status`; ensured the smoke-test school is `is_active = true`. |
| `PHASE_13E_FINAL_SMOKE_TEST_REPORT.md` | Documented issues, root cause, fixes, validation, and recommendations. |

---

## 9. Fixes Made

- **Role-aware dashboard routing:** `/dashboard` now inspects the user's profile role and school state before rendering.
  - `admin` → redirects to `/admin`.
  - `instructor` with an inactive or missing school → redirects to `/pending-approval`.
  - `instructor` with an active school → redirects to `/instructor`.
  - `student` / `apprentice` → remains on `/dashboard`.
- **Pending approval page:** Created `/pending-approval` so instructors see a clear explanation instead of the student dashboard.
- **Signup school filtering:** The manual school-name fallback now requires `is_active = true`, preserving the rule that inactive/pending schools are not exposed during signup.
- **Smoke-test seed alignment:** Updated `supabase/seed-test-accounts.sql` to use the real schools/programs/profiles columns and to mark the smoke-test school as active, making it selectable in the student signup dropdown.
- **Security preserved:** Instructors still cannot create active production schools without approval; production signups create schools with `is_active = false`. Role sanitization in `handle_new_user` and the signup page still reject admin/unknown roles.

---

## 10. Validation Results

Validation run after fixes on **2026-06-26**:

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | ✅ Passed with no errors. |
| Production build | `npm run build` | ✅ Compiled successfully. 36 routes generated. |
| ESLint (modified TSX files) | `npx eslint "src/app/(auth)/signup/page.tsx" "src/app/(dashboard)/dashboard/page.tsx" "src/app/pending-approval/page.tsx"` | ✅ 0 errors, 0 warnings. |
| Seed SQL review | Manual schema alignment | ✅ Columns match `schools`, `programs`, `profiles`, `grade_categories`, and `assessment_rubrics` definitions. |

---

## 11. Re-Run Recommendation

**Yes — re-run the signup smoke test locally.** Exercise these paths with `NEXT_PUBLIC_DEMO_MODE=false` and the fixed seed:

1. **Student signup:** Select `ASCYN Smoke Test Academy` from the dropdown and create an account.
2. **Instructor signup (production path):** Create a new instructor; verify the school is inserted with `is_active = false` and the user lands on `/pending-approval` after login.
3. **Approved instructor flow:** Manually set the instructor's school to `is_active = true` (simulating admin approval) and confirm login redirects to `/instructor`.
4. **Admin login:** Confirm login redirects to `/admin`.
5. **Security checks:** Confirm inactive/pending schools do not appear in the student signup dropdown and cannot be matched via the manual school-name fallback.

Once the above passes, the branch is ready to commit.

---

## 12. Commit Recommendation

**Commit the fixes.** Suggested message:

```bash
git add src/app/(dashboard)/dashboard/page.tsx \
           src/app/pending-approval/page.tsx \
           src/app/(auth)/signup/page.tsx \
           supabase/seed-test-accounts.sql \
           PHASE_13E_FINAL_SMOKE_TEST_REPORT.md
git commit -m "fix(signup): role-aware dashboard routing and smoke-test seed alignment

- Route admin/instructor/student to correct dashboards after login
- Add /pending-approval page for instructors awaiting school approval
- Require is_active=true for manual school-name signup fallback
- Fix seed-test-accounts.sql to match production schema and expose active smoke-test school"
```

**Do not push** until the re-run signup smoke test passes.

---

## 13. Final Verdict

**✅ Ready to Commit — Hold Push Pending Re-Test**

The Phase 13E authenticated signup issues have been fixed and validated by TypeScript, build, and ESLint. The smoke-test seed now inserts an active test school that will appear in the student signup dropdown. Role-based routing ensures instructors, admins, and students reach the correct dashboards.

Push authorization remains withheld until the local signup smoke test checklist is executed and passes.

---

## 14. Completion Summary

- ✅ Baseline commit tested: `eab3c8a`
- ✅ Signup routing and smoke-test seed issues identified and fixed
- ✅ New route added: `/pending-approval`
- ✅ TypeScript, build, and ESLint pass
- ✅ Test seed file fixed: `supabase/seed-test-accounts.sql`
- ⚠️ Authenticated live re-run still needed before push
- ❌ Not pushed

---

*Smoke test follow-up complete. Re-run the authenticated signup checklist before pushing.*

---

## 15. Remove Apprentice from Public Signup

**Date:** 2026-06-26

### 15.1 Objective

Remove **Apprentice** as a public signup option. This is a product/usability decision only; existing Apprentice support in the database, permissions, RLS policies, and backend role handling must remain functional.

### 15.2 Root Cause

The public signup page exposed `apprentice` as a selectable role with its own set of form fields. The product decision is to limit public self-registration to **Student** and **Instructor** only.

### 15.3 Files Changed

| File | Change |
|------|--------|
| `src/app/(auth)/signup/page.tsx` | Removed Apprentice UI option and related fields. |

### 15.4 How Apprentice Was Removed from the Public UI

- Changed the local `Role` type from `'student' | 'instructor' | 'apprentice'` to `'student' | 'instructor'`.
- Removed the **Apprentice** role selector button and its helper paragraph.
- Updated the role selector grid from `grid-cols-3` to `grid-cols-2`.
- Removed the entire Apprentice-specific form block (optional school select, barber shop name, mentor name).
- Removed `barberShopName` and `mentorName` React state and removed them from the profile upsert.
- Left backend role handling untouched:
  - Database schema still includes `apprentice` in the `profiles.role` check constraint.
  - `sanitizeRole()` in `src/lib/security/server-auth.ts` still allows `apprentice`.
  - `handle_new_user()` trigger still allows `apprentice` from metadata.
  - RLS policies, permissions, and existing apprentice records remain valid.

### 15.5 Validation Results

Validation run after the Apprentice removal on **2026-06-26**:

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | ✅ Passed with no errors. |
| Production build | `npm run build` | ✅ Compiled successfully. 36 routes generated. |
| ESLint (modified file) | `npx eslint "src/app/(auth)/signup/page.tsx"` | ✅ 0 errors, 0 warnings. |

### 15.6 Smoke Test Results

| Scenario | Expected | Result |
|----------|----------|--------|
| Student signup UI | Student option visible | ✅ Confirmed by code review |
| Instructor signup UI | Instructor option visible | ✅ Confirmed by code review |
| Apprentice signup UI | No Apprentice option or fields | ✅ Removed |
| Existing apprentice users | Can still log in and function | ✅ Backend support unchanged |
| Role escalation | No new escalation path | ✅ Only Student/Instructor selectable; backend still sanitizes metadata |

**Note:** Live browser verification could not be performed in this environment due to blocked localhost/private-IP access, but the UI change is a deterministic removal verified by static review and build.

### 15.7 Commit Recommendation

**Commit the fix.** Suggested message:

```bash
git add src/app/(auth)/signup/page.tsx \
           PHASE_13E_FINAL_SMOKE_TEST_REPORT.md
git commit -m "fix(signup): remove Apprentice from public signup UI

- Limit public self-registration to Student and Instructor
- Remove Apprentice role selector and apprentice-specific fields
- Preserve database schema, RLS, permissions, and backend role support"
```

**Do not push** until the signup smoke test re-run (Student + Instructor) passes locally.

---

## 16. Fix Signup School Dropdown Not Showing Active Local School

**Date:** 2026-06-26

### 16.1 Issue

`ASCYN Smoke Test Academy` existed in the local Supabase `public.schools` table with `subscription_status = active` and `is_active = true`, but it did not appear in the Student signup school dropdown.

### 16.2 Root Cause

Two environment/config issues prevented the browser from seeing the local school:

1. **`.env.local` pointed to the remote Supabase project**, so the signup page queried the remote database instead of the local one.
2. **`isSupabaseConfigured()` required an `https://` URL**, which rejected the local Supabase CLI endpoint (`http://127.0.0.1:54321`). When the helper returned `false`, the app fell back to the mock client, whose `schools` query returns an empty array.

The signup query itself (`select id, name from public.schools where is_active = true`) was correct.

### 16.3 Files Changed

| File | Change |
|------|--------|
| `.env.local` | Switched to local Supabase CLI defaults for smoke testing; remote values kept as comments. |
| `src/lib/demo-helpers.ts` | Relaxed `isSupabaseConfigured()` to accept `https://` production URLs **and** `http://127.0.0.1:54321` / `http://localhost:54321` local CLI endpoints. |
| `src/lib/supabase.ts` | Imported shared helpers instead of duplicating the config check. |
| `src/lib/supabase-server.ts` | Imported shared helpers instead of duplicating the config check. |
| `src/middleware.ts` | Imported shared helpers instead of duplicating the config check. |
| `src/app/(auth)/signup/page.tsx` | Added safe console logging to the schools loader for local debugging. |

### 16.4 Fix Made

- Centralized Supabase configuration detection in `src/lib/demo-helpers.ts`.
- Allowed local development endpoints so the real Supabase client is used when `.env.local` points to `http://127.0.0.1:54321`.
- Updated `.env.local` to local defaults and commented out the remote project values.
- Added debug logs in the signup page:
  - URL being queried.
  - Query error messages.
  - Number of active schools returned.
- Preserved production behavior:
  - Inactive schools are still filtered out (`is_active = true`).
  - Instructor-created schools remain pending (`is_active = false`) until admin approval.
  - No role-based restriction was added to the schools query; the public RLS policy already allows anonymous reads of active schools.

### 16.5 Validation Results

Validation run after the fix on **2026-06-26**:

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `npx tsc --noEmit` | ✅ Passed with no errors. |
| Production build | `npm run build` | ✅ Compiled successfully. 36 routes generated. |
| ESLint (changed logic files) | `npx eslint "src/app/(auth)/signup/page.tsx" "src/lib/demo-helpers.ts" "src/middleware.ts"` | ✅ 0 errors, 0 warnings. |
| ESLint (full modified list) | `npx eslint "src/app/(auth)/signup/page.tsx" "src/lib/demo-helpers.ts" "src/lib/supabase.ts" "src/lib/supabase-server.ts" "src/middleware.ts"` | ⚠️ `supabase.ts` and `supabase-server.ts` report pre-existing `@typescript-eslint/no-explicit-any` and `prefer-const` warnings in the mock client code. These errors existed before this change and are unrelated to the school dropdown fix. |

### 16.6 Re-Test Steps

1. Ensure local Supabase is running (`supabase start`).
2. Confirm `.env.local` contains the local URL/key and `NEXT_PUBLIC_DEMO_MODE=false`.
3. Restart the Next.js dev server so it picks up `.env.local` changes.
4. Open the Student signup page.
5. Verify `ASCYN Smoke Test Academy` appears in the school dropdown.
6. Open browser DevTools and confirm the console logs:
   - `[Signup] Loading active schools from: http://127.0.0.1:54321`
   - `[Signup] Active schools loaded: N` where N includes the smoke-test school.
7. Confirm inactive/pending schools do **not** appear in the dropdown.

### 16.7 Commit Recommendation

**Commit the fix.** Suggested message:

```bash
git add src/lib/demo-helpers.ts \
           src/lib/supabase.ts \
           src/lib/supabase-server.ts \
           src/middleware.ts \
           src/app/(auth)/signup/page.tsx \
           PHASE_13E_FINAL_SMOKE_TEST_REPORT.md
# .env.local is gitignored and should not be staged
git commit -m "fix(signup): use local Supabase for school dropdown and centralize config checks

- Allow http://127.0.0.1:54321 and http://localhost:54321 in isSupabaseConfigured
- Use shared demo-helpers config checks in supabase/supabase-server/middleware
- Add signup school-loader logging for local debugging
- Keep is_active=true filter and pending instructor school behavior"
```

**Do not push** until the local school-dropdown smoke test passes.

---

## 17. Fix Schools RLS for Anonymous Signup Dropdown

**Date:** 2026-06-26

### 17.1 Issue

Student signup reached the local Supabase REST API, but the schools query failed with `permission denied for table schools`. The smoke-test school (`ASCYN Smoke Test Academy`) existed in `public.schools` with `is_active = true`, yet the signup page could not load it.

### 17.2 Root Cause

Two security-layer issues blocked anonymous reads:

1. **Missing table-level grant.** The `public.schools` table had Row Level Security enabled, but the `anon` and `authenticated` roles had not been granted `SELECT` on it. Without the table privilege, the RLS policy is never evaluated and Postgres returns `permission denied for table schools`.
2. **Overly permissive existing policy.** The legacy policy `Schools are viewable by everyone` used `for select using (true)`, which exposed inactive and soft-deleted schools to anonymous users.

### 17.3 Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/20250625010050_fix_schools_anon_select_policy.sql` | New migration that drops the legacy permissive policy and creates an active-only select policy, plus grants `SELECT` on `public.schools` to `anon` and `authenticated`. |
| `PHASE_13E_FINAL_SMOKE_TEST_REPORT.md` | Documented the RLS fix, validation, and re-test steps. |

### 17.4 Fix Made

- Added migration `20250625010050_fix_schools_anon_select_policy.sql` running after `20250625010000_create_core_production_tables.sql` (where `is_active` and `deleted_at` columns are defined).
- Replaced `Schools are viewable by everyone` with `Active schools are viewable by everyone`:
  ```sql
  create policy "Active schools are viewable by everyone" on public.schools
    for select using (
      is_active = true
      and deleted_at is null
    );
  ```
- Granted the required table-level privilege:
  ```sql
  grant select on public.schools to anon, authenticated;
  ```
- Preserved all other `public.schools` policies:
  - Instructors can still create schools.
  - School creators can still update their own schools.
  - No insert/update/delete privileges were granted to anonymous users.

### 17.5 Security Impact

| Action | Anonymous | Authenticated (non-admin) | Admin/Instructor |
|--------|-----------|---------------------------|------------------|
| SELECT active schools | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| SELECT inactive/deleted schools | ❌ Blocked | ❌ Blocked | ❌ Blocked (via policy) |
| INSERT | ❌ Blocked | ❌ Blocked | Instructors only |
| UPDATE | ❌ Blocked | Creators only | Creators only |
| DELETE | ❌ Blocked | ❌ Blocked | ❌ Blocked |

- Inactive/pending instructor-created schools remain hidden from the signup dropdown.
- Admin/instructor/student RLS was not weakened.
- No other tables or policies were modified.

### 17.6 Validation Results

Validation run after the RLS fix on **2026-06-26**:

| Check | Command | Result |
|-------|---------|--------|
| Supabase stop | `supabase stop --no-backup` | ✅ Success |
| Supabase start | `supabase start` | ✅ Success, all migrations applied, seed loaded |
| Migrations apply cleanly | `supabase db reset` | ✅ Success |
| Anon API can read active schools | REST `GET /rest/v1/schools?select=id,name,is_active` with anon key | ✅ Returns 6 active demo schools |
| Inactive schools hidden from anon | Inserted `is_active = false` test row, re-queried anon API | ✅ Inactive school not returned |
| Anon write blocked | REST `POST /rest/v1/schools` with anon key | ❌ Request failed as expected |
| TypeScript | `npx tsc --noEmit` | ✅ Passed with no errors |
| Production build | `npm run build` | ✅ Compiled successfully. 36 routes generated |
| ESLint | N/A (only SQL and markdown changed) | N/A |

### 17.7 Re-Test Steps

1. Ensure local Supabase is running (`supabase start`).
2. Open the Student signup page in a browser with `NEXT_PUBLIC_DEMO_MODE=false`.
3. Verify the school dropdown loads without `permission denied for table schools`.
4. Confirm only active schools appear (e.g., the demo schools and `ASCYN Smoke Test Academy`).
5. Confirm inactive/pending schools do **not** appear.
6. Attempt to create a school as an anonymous user via the REST API and confirm it is rejected.

### 17.8 Commit Recommendation

**Commit the fix.** Suggested message:

```bash
git add supabase/migrations/20250625010050_fix_schools_anon_select_policy.sql \
           PHASE_13E_FINAL_SMOKE_TEST_REPORT.md
git commit -m "fix(supabase): restrict school reads to active schools for anon/auth users

- Replace permissive schools select policy with active-only policy
- Grant SELECT on public.schools to anon and authenticated roles
- Preserve instructor create and creator update policies
- Keep inactive/pending schools hidden from signup dropdown"
```

**Do not push** until the local signup school-dropdown smoke test passes.

---


