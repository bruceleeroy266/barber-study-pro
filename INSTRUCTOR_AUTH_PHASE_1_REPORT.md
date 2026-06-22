# Instructor Authentication — Phase 1 Report

**Project:** `C:\Users\skyfl\Desktop\barber-study-pro-v2`  
**Branch:** `demo-polish-ascyn-pro`  
**Date:** 2026-06-22  
**Scope:** Add/audit safe instructor authentication for `/instructor`.

---

## 1. Existing Role/Profile System

A complete role/profile system was already in place:

- **Database schema (`supabase-schema.sql`)**
  - `profiles.role` column with a check constraint: `('student', 'instructor', 'apprentice', 'admin')`.
  - `profiles.school_id` links instructors to their school.
  - Trigger `handle_new_user()` auto-creates a `profiles` row from `auth.users` metadata, including the `role`.
  - RLS policies allow instructors to read students in the same school.

- **Types (`src/types/index.ts`)**
  - `Profile.role` is typed as `'student' | 'instructor' | 'apprentice' | 'admin'`.

- **Signup (`src/app/(auth)/signup/page.tsx`)**
  - Supports role selection: Student, Instructor, Apprentice.
  - Instructors create a school during signup.
  - Profile upsert writes `role` into `profiles`.

- **Middleware (`src/middleware.ts`)**
  - Already protected `/dashboard`, `/instructor`, `/admin`.
  - Already checked `profiles.role` for `/instructor` (instructor or admin) and `/admin` (admin only).

- **Server components**
  - `src/app/instructor/page.tsx` already re-checked role.
  - `src/app/instructor/student/[studentId]/page.tsx` already re-checked role and same-school membership.
  - `src/app/admin/page.tsx` already re-checked role.

### Audit Finding

The enforcement was already functionally correct but had two maintainability/safety gaps:

1. **Duplicated role logic** across middleware and three server components — risk of the checks drifting apart in future edits.
2. **Loose route matching** in middleware used `pathname.startsWith('/instructor')`, which could also match unintended routes such as `/instructorXYZ`.
3. **No portal navigation** in the dashboard sidebar — instructors/admins had no visible link to their portals.
4. **Demo-mode mismatch** — `demoUser.role` was `'admin'` but `demoProfile.role` was `'student'`, so the instructor portal was inaccessible in demo mode.

---

## 2. Phase 1 Changes Made

### New file: `src/lib/auth-helpers.ts`

Created centralized, typed role helpers to guarantee every enforcement point uses the exact same rule:

- `isInstructorOrAdmin(role)` → true for `instructor` or `admin`.
- `isAdmin(role)` → true for `admin`.
- `isLearner(role)` → true for `student` or `apprentice`.

### Modified: `src/middleware.ts`

- Imported helpers from `auth-helpers`.
- Added `isInstructorRoute()` and `isAdminRoute()` helpers to match exact routes (`/instructor` and `/instructor/*`, `/admin` and `/admin/*`) without false positives.
- Replaced inline role comparisons with `isInstructorOrAdmin()` and `isAdmin()`.
- Added explicit section comments:
  - `INSTRUCTOR ACCESS ENFORCEMENT (edge layer)`
  - `ADMIN ACCESS ENFORCEMENT (edge layer)`

### Modified: `src/app/instructor/page.tsx`

- Imported `isInstructorOrAdmin`.
- Replaced inline role comparison with helper.
- Added defense-in-depth comment at the enforcement point.

### Modified: `src/app/instructor/student/[studentId]/page.tsx`

- Imported `isInstructorOrAdmin`.
- Replaced inline role comparison with helper.
- Added defense-in-depth comment at the enforcement point.

### Modified: `src/app/admin/page.tsx`

- Imported `isAdmin`.
- Replaced inline role comparison with helper.
- Added defense-in-depth comment at the enforcement point.

### Modified: `src/components/DashboardNav.tsx`

- Imported role helpers and new icons (`GraduationCap`, `Shield`).
- Built nav items dynamically based on `user.role`:
  - Instructors and admins see **Instructor Portal**.
  - Admins also see **Admin Portal**.
- Preserved all existing student/apprentice navigation.

### Modified: `src/lib/demo-data.ts`

- Aligned `demoProfile.role` with `demoUser.role` (`'admin'`) so demo mode can actually test the instructor and admin portals.

---

## 3. Behavior Preserved

- Student login, signup, dashboard, progress, flashcards, and quizzes are unchanged.
- `/dashboard` still requires login but accepts any role.
- Auth-route redirect behavior (logged-in users hitting `/login` or `/signup` are redirected to `/dashboard`) is unchanged.
- Supabase-not-configured / demo-mode handling is unchanged.
- No chapter content, quiz logic, or flashcard logic was modified.

---

## 4. Access Control Matrix

| User state            | `/instructor` behavior                                | `/admin` behavior          |
| --------------------- | ----------------------------------------------------- | -------------------------- |
| Logged out            | Middleware → `/login?redirect=/instructor`            | Middleware → `/login?redirect=/admin` |
| Student / Apprentice  | Middleware → `/dashboard` (role check)                | Middleware → `/dashboard` (role check) |
| Instructor            | Allowed; server component re-verifies                 | Middleware → `/dashboard`  |
| Admin                 | Allowed; server component re-verifies                 | Allowed; server component re-verifies |

---

## 5. Manual Test Plan

### a) Logged-out user

1. Clear cookies / use an incognito window.
2. Visit `http://localhost:3000/instructor`.
3. **Expected:** Redirected to `/login?redirect=/instructor`.
4. Visit `http://localhost:3000/admin`.
5. **Expected:** Redirected to `/login?redirect=/admin`.

### b) Student user

1. Sign up or log in as a `student` role.
2. Visit `http://localhost:3000/instructor`.
3. **Expected:** Redirected to `/dashboard`.
4. Visit `http://localhost:3000/admin`.
5. **Expected:** Redirected to `/dashboard`.
6. Confirm dashboard, chapters, flashcards, and quizzes still work normally.

### c) Instructor user

1. Sign up as `instructor` (creates a school).
2. Log in.
3. **Expected:** Dashboard sidebar shows **Instructor Portal** link.
4. Click **Instructor Portal** or visit `/instructor`.
5. **Expected:** Instructor dashboard loads and shows school students/progress.
6. Visit `/admin`.
7. **Expected:** Redirected to `/dashboard`.

### d) Admin user

1. Set an existing user's `profiles.role` to `'admin'` directly in Supabase (or use the demo user in demo mode).
2. Log in as that user.
3. **Expected:** Dashboard sidebar shows **Instructor Portal** and **Admin Portal** links.
4. Visit `/instructor`.
5. **Expected:** Instructor dashboard loads.
6. Visit `/admin`.
7. **Expected:** Admin dashboard loads.

---

## 6. Validation Run

- `npx tsc --noEmit` — passed (no errors).
- `npm run lint` — no new lint errors introduced in modified files.

---

## 7. Files Changed

- `src/lib/auth-helpers.ts` — **new**
- `src/middleware.ts` — **modified**
- `src/app/instructor/page.tsx` — **modified**
- `src/app/instructor/student/[studentId]/page.tsx` — **modified**
- `src/app/admin/page.tsx` — **modified**
- `src/components/DashboardNav.tsx` — **modified**
- `src/lib/demo-data.ts` — **modified**

---

## 8. Out of Scope (Per Instructions)

- Student roster management UI
- Instructor analytics / weak-area dashboard
- Instructor notes feature
- Database migrations beyond existing schema
- Automated tests
- Commit / deployment

---

## 9. Next Steps for Future Phases

- Add a dedicated `/access-denied` page if UX wants a message instead of silent redirect.
- Add server-side role helpers for API routes if any instructor/admin API endpoints are created.
- Add RLS policy audit for any new instructor write operations.
- Consider seeding an admin user via `supabase-seed-data.sql` for local development.
