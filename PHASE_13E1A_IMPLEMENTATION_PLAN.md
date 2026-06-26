# Phase 13E.1A Implementation Plan

## Objective
Complete the production database schema for operational tables referenced by the application but not yet created in migrations.

## Tables to Create
1. `attendance_records`
2. `attendance_notes`
3. `attendance_corrections`
4. `attendance_audit_log`
5. `grades`
6. `grade_categories`
7. `assessments`
8. `assessment_rubrics`
9. `hour_logs`
10. `instructor_notes`

## Schema Conventions
- UUID primary keys with `gen_random_uuid()` default.
- Foreign keys to `public.schools`, `public.profiles`, and where applicable `auth.users`.
- `school_id` on every operational table for RLS scoping.
- `created_at` and `updated_at` timestamps.
- Soft delete via `deleted_at` where appropriate.
- snake_case naming consistent with existing migrations.

## RLS Policy Pattern (per table)
- `select`: students read own records; instructors/admins read their school's records; platform_super_admin reads all.
- `all` (insert/update/delete): admins manage within their school; instructors manage where appropriate (attendance/notes); platform_super_admin manages all.
- Every policy uses `drop policy if exists` for idempotency.

## Indexes
- Per-table indexes on `school_id`, `student_id`/`user_id`, `instructor_id` (where applicable), and `created_at`.

## Triggers
- Reuse existing `public.update_updated_at_column()` trigger function.

## Seed Compatibility
- No new seed data required; existing demo data in `src/lib/demo-data.ts` remains the fallback.

## Validation
- Run `npx tsc --noEmit` and `npm run build` after migration creation.

## Important Note
The application code currently mixes camelCase TypeScript property names with snake_case Supabase query filters in several places (e.g., `attendance_records` expects `userId` in casts but queries `user_id`; `grades` expects `studentId` in casts but queries `student_id`). Because this phase does not modify application code, the schema will be created with snake_case columns per project conventions. A follow-up phase (13E.1B) should align application types/queries with the database columns or introduce a mapping layer.
