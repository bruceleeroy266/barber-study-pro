# Phase 13E.1B — Persistence Mapping & Service Integration Report

**Project:** ASCYN PRO / Barber Study Pro V2  
**Repository:** `C:\Users\skyfl\Desktop\barber-study-pro-v2`  
**Branch:** `demo-polish-ascyn-pro`  
**Date:** 2026-06-25  
**Status:** ✅ Complete — awaiting review before Git operations

---

## 1. Executive Summary

Phase 13E.1A completed the production database schema for operational features (attendance, grades, assessments, rubrics, hour logs, instructor notes), but left a critical runtime gap: the application TypeScript types and casts expected `camelCase` property names while the new Supabase columns use `snake_case`.

Phase 13E.1B closed that gap by:

1. Creating a reusable, explicit mapping layer between `snake_case` DB rows and `camelCase` app objects.
2. Wiring real Supabase persistence for the **gradebook** and **assessments** flows.
3. Verifying and completing **instructor notes** persistence with proper school isolation.
4. Updating the **attendance**, **correction**, **audit**, and **hour log** services to query `snake_case` columns and return mapped app types.
5. Removing unsafe `as unknown as Type` production casts for operational data.
6. Preserving Demo Mode behavior and security/school-scoping rules.

All validations pass:

- `npx tsc --noEmit` ✅
- `npm run build` ✅ (35 routes)
- `npx eslint` on modified files ✅ (0 errors, 0 warnings)

No commits or pushes were performed.

---

## 2. Files Created

| File | Purpose |
|------|---------|
| `src/lib/mappers/operational-data-mappers.ts` | Reusable `snake_case ↔ camelCase` mappers for attendance, notes, corrections, audit logs, grades, grade categories, assessments, rubrics, hour logs, and instructor notes. |
| `src/app/instructor/gradebook/actions.ts` | Secure server action `saveGrade` for gradebook persistence. |
| `src/app/instructor/assessments/actions.ts` | Secure server action `saveAssessment` for assessment persistence. |

---

## 3. Files Modified

### Service Layer

- `src/lib/attendance/attendance-service.ts`
- `src/lib/attendance/attendance-correction.ts`
- `src/lib/attendance/attendance-audit.ts`

### Server Actions / Pages

- `src/app/instructor/gradebook/page.tsx`
- `src/app/instructor/assessments/page.tsx`
- `src/app/instructor/student/[studentId]/actions.ts`
- `src/app/instructor/student/[studentId]/page.tsx`
- `src/hooks/useAttendance.ts`

### Dashboard / Admin / Instructor Pages (cast replacements)

- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/dashboard/assessments/page.tsx`
- `src/app/(dashboard)/dashboard/compliance/page.tsx`
- `src/app/(dashboard)/dashboard/grades/page.tsx`
- `src/app/(dashboard)/dashboard/progress/page.tsx`
- `src/app/admin/school/page.tsx`
- `src/app/instructor/page.tsx`
- `src/app/instructor/compliance/page.tsx`
- `src/app/instructor/attendance/page.tsx`
- `src/app/instructor/rubrics/page.tsx`

---

## 4. Mapping Layer Summary

`src/lib/mappers/operational-data-mappers.ts` provides:

- Typed `DbRow` interfaces for every operational table.
- `map<Type>FromDb(row)` for single-row deserialization.
- `map<Type>sFromDb(rows)` for array deserialization.
- `map<Type>ToDb(object)` for `camelCase` → `snake_case` insert/update payloads.
- Runtime-safe helpers (`toString`, `toNumber`, `toIsoString`, `isObject`) so malformed rows degrade to empty/default values instead of throwing.

Mapped entities:

- `AttendanceRecord`
- `InstructorAttendanceNote`
- `AttendanceCorrection`
- `AttendanceAuditEntry`
- `GradeCategory`
- `Grade`
- `AssessmentRubric`
- `Assessment`
- `HourLog`
- `InstructorNote`

The mappers replace every unsafe `as unknown as Type` cast on operational data fetched from Supabase.

---

## 5. Gradebook Persistence

Created `src/app/instructor/gradebook/actions.ts` with `saveGrade(formData)`:

- Verifies the actor is authenticated via `requireAuth()`.
- Enforces actor `school_id` ownership; rejects client-provided `school_id`.
- Looks up the student and confirms the student belongs to the actor's school.
- Looks up the grade category and confirms it belongs to the actor's school.
- Computes `percentage` from `score / maxScore * 100`.
- Inserts or upserts using `snake_case` keys.
- Returns the mapped `Grade` object.
- Throws clear errors instead of faking success in production.

Updated `src/app/instructor/gradebook/page.tsx`:

- Calls `saveGrade` in production/demo-table-present scenarios.
- Uses `mapGradesFromDb` and `mapGradeCategoriesFromDb` on fetched rows.
- Falls back to local demo behavior when Demo Mode is active.

---

## 6. Assessment Persistence

Created `src/app/instructor/assessments/actions.ts` with `saveAssessment(formData)`:

- Verifies the actor is authenticated.
- Validates actor school access.
- Confirms related student belongs to actor's school.
- Confirms related rubric belongs to actor's school (when provided).
- Inserts/updates using `snake_case` columns.
- Maps the returned row back to the `Assessment` app type.
- Preserves Demo Mode local behavior.

Updated `src/app/instructor/assessments/page.tsx`:

- Calls `saveAssessment` for real persistence.
- Uses `mapAssessmentsFromDb` and `mapAssessmentRubricsFromDb`.

---

## 7. Instructor Notes Persistence

Updated `src/app/instructor/student/[studentId]/actions.ts`:

- Queries the `instructor_notes` table using `snake_case` columns.
- Filters by `student_id` and `school_id`.
- Maps returned rows with `mapInstructorNotesFromDb`.
- Preserves existing school isolation.

Updated `src/app/instructor/student/[studentId]/page.tsx`:

- Uses the mapped notes instead of unsafe casts.

---

## 8. Attendance / Hour Log Mapping

Updated the attendance service files to use `snake_case` columns and return mapped app types:

- `src/lib/attendance/attendance-service.ts`
- `src/lib/attendance/attendance-correction.ts`
- `src/lib/attendance/attendance-audit.ts`

Changes include:

- Supabase `.select()` and `.eq()` calls use `school_id`, `user_id`, `attendance_record_id`, `record_id`, `corrected_by`, etc.
- Returned rows pass through `mapAttendanceRecordsFromDb`, `mapAttendanceCorrectionsFromDb`, `mapAttendanceAuditEntriesFromDb`, `mapAttendanceNotesFromDb`.
- Insert/update payloads are built with `mapAttendanceRecordToDb`, `mapAttendanceCorrectionToDb`, `mapAttendanceAuditEntryToDb`.
- `useAttendance.ts` now passes the caller's `schoolId` into `submitCorrection` to satisfy the new server-side school isolation requirement.

Hour log fetches in dashboard/instructor pages now route through `mapHourLogsFromDb`.

---

## 9. Unsafe Casts Removed

Replaced the following unsafe patterns across dashboard, admin, and instructor pages:

- `as unknown as Grade[]` → `mapGradesFromDb(...)`
- `as unknown as GradeCategory[]` → `mapGradeCategoriesFromDb(...)`
- `as unknown as Assessment[]` → `mapAssessmentsFromDb(...)`
- `as unknown as AssessmentRubric[]` → `mapAssessmentRubricsFromDb(...)`
- `as unknown as AttendanceRecord[]` → `mapAttendanceRecordsFromDb(...)`
- `as unknown as HourLog[]` → `mapHourLogsFromDb(...)`
- `as unknown as InstructorNote[]` → `mapInstructorNotesFromDb(...)`
- `as unknown as InstructorAttendanceNote[]` → `mapAttendanceNotesFromDb(...)`

The mapper file itself still uses `(row as unknown as DbRow)` internally to bridge `Record<string, unknown>` runtime validation to typed row shapes; this is intentional and contained inside the mapping layer rather than scattered across the app.

---

## 10. Security Review

| Requirement | Status |
|-------------|--------|
| Actor authenticated | ✅ `requireAuth()` / `getCurrentUser()` in all new server actions |
| Actor school-scoped | ✅ Writes use the actor's own `school_id` |
| No client-provided `school_id` | ✅ `school_id` is read from the authenticated profile, never from form data |
| Student belongs to actor's school | ✅ Verified before grade/assessment/note writes |
| Grade category / rubric school-scoped | ✅ Verified before use |
| Instructor note authorization | ✅ Existing IDOR fix preserved; school isolation enforced |
| Platform Super Admin rules | ✅ Unchanged; still managed by existing helpers |
| No cross-school reads | ✅ Queries filter by actor's `school_id` |

---

## 11. Demo Mode Review

| Requirement | Status |
|-------------|--------|
| Demo Mode still works | ✅ Demo branches unchanged; local/demo data still renders |
| Production does not fake success | ✅ Server actions throw real errors when DB operations fail |
| Missing tables return clear errors | ✅ Supabase errors propagate instead of being swallowed |
| Demo data does not mix into real sessions | ✅ Demo paths and production paths remain separate |

---

## 12. Validation Results

### TypeScript

```bash
npx tsc --noEmit
```

✅ Passed with no errors.

### Production Build

```bash
npm run build
```

✅ Compiled successfully. 35 routes generated.

Build output includes two pre-existing warnings unrelated to this phase:

- `turbopack.root should be absolute`
- `"middleware" file convention is deprecated. Please use "proxy" instead.`

### ESLint (modified files only)

```bash
npx eslint <modified files>
```

✅ 0 errors, 0 warnings on all Phase 13E.1B modified files.

Repo-wide ESLint still reports 62 errors / 60 warnings in unmodified files, which is outside the scope of this focused phase.

---

## 13. Remaining Known Issues

1. **Repo-wide ESLint debt** — 62 errors / 60 warnings remain in unmodified files. Should be addressed in a dedicated cleanup pass.
2. **Middleware deprecation** — Next.js recommends migrating from `middleware` to `proxy` convention.
3. **Turbopack root warning** — `turbopack.root` should be absolute.
4. **profiles_role_check constraint** — still excludes `platform_super_admin` until that role is formally introduced.
5. **Seed data** — grade categories, rubrics, and sample assessments should be seeded for end-to-end testing.
6. **Admin UI for pending instructor-created schools** — not yet built.
7. **Type/interface normalization** — `HourLog` and `InstructorNote` app interfaces still use `snake_case` property names. A future refactor should align them to `camelCase` with mappers, or align the DB columns to the app types.

---

## 14. Recommendations for Phase 13E.1C

1. **End-to-end operational testing** — create seed data and run real instructor/student workflows against the new tables.
2. **Align `HourLog` / `InstructorNote` app types** to `camelCase` and update their mappers/consumers for full consistency.
3. **Add row-level integration tests** for `saveGrade`, `saveAssessment`, and instructor note creation.
4. **Address repo-wide ESLint errors** in a standalone cleanup pass.
5. **Migrate `middleware.ts` to the Next.js `proxy` convention** when the project is ready for that breaking change.
6. **Introduce `platform_super_admin` role** and update the `profiles_role_check` constraint if that persona is required for Founder Alpha.

---

## 15. Definition of Done Checklist

- ✅ Mapping layer created
- ✅ `snake_case` → `camelCase` mapping implemented
- ✅ `camelCase` → `snake_case` mapping implemented
- ✅ Gradebook persistence wired
- ✅ Assessment persistence wired
- ✅ Instructor notes persistence verified
- ✅ Attendance mappings fixed
- ✅ Hour log mappings fixed
- ✅ Unsafe production casts removed where relevant
- ✅ Security preserved
- ✅ Demo Mode preserved
- ✅ TypeScript passes
- ✅ Build passes
- ✅ ESLint passes on modified files
- ✅ Report created
- ✅ No commits
- ✅ No pushes

---

*Phase 13E.1B is complete and ready for review.*
