# Phase 12 — Administrative & School Configuration Suite

## Executive Summary

Phase 12 introduces a dedicated school configuration workspace that lets school administrators manage their school's identity, academic programs, enrollment rules, attendance and hours policies, gradebook and assessment defaults, messaging preferences, school-wide notifications, and role-based permissions. The suite is built as a tabbed, client-side configuration page and integrates with existing admin navigation, the demo fallback system, and TypeScript types shared across Phases 4A–11.

All validation passed: TypeScript, production build, and ESLint (zero warnings on Phase 12 files). The feature is demo-ready; changes are held in local React state and are not persisted to a backend until a `school_settings` table or API is added in a future phase.

---

## Files Created

| Path | Purpose |
|---|---|
| `src/app/admin/school/configuration/page.tsx` | Server-side admin-guarded entry point for the configuration page |
| `src/components/admin/school-config/SchoolConfigurationClient.tsx` | Tabbed client shell with shared state and demo banner |
| `src/components/admin/school-config/SchoolProfileSection.tsx` | School name, address, email, brand color preview, subscription status |
| `src/components/admin/school-config/ProgramsSection.tsx` | Academic programs table with active/inactive toggles |
| `src/components/admin/school-config/InstructorsSection.tsx` | Instructor roster cards for the school |
| `src/components/admin/school-config/EnrollmentSection.tsx` | Open enrollment, self-registration, default program |
| `src/components/admin/school-config/AttendancePolicySection.tsx` | Target attendance %, excuse limit, tardy threshold, clock-event tracking |
| `src/components/admin/school-config/HoursPolicySection.tsx` | Required hours, tracked categories, instructor approval toggle |
| `src/components/admin/school-config/GradebookConfigSection.tsx` | Passing %, grading scale, grade category list |
| `src/components/admin/school-config/AssessmentDefaultsSection.tsx` | Passing %, allowed assessment types, default rubric placeholder |
| `src/components/admin/school-config/MessagingPreferencesSection.tsx` | Student-to-student, moderation, auto-reply toggles |
| `src/components/admin/school-config/NotificationSettingsSection.tsx` | School-wide notification type/priority toggles |
| `src/components/admin/school-config/RolePermissionsSection.tsx` | Role-based permission matrix (demo-ready) |
| `src/lib/school-config/index.ts` | Permission helpers, default permissions, and permission catalog |

## Files Modified

| Path | Change |
|---|---|
| `src/types/index.ts` | Added `AppRole` type and Phase 12 configuration types: `SchoolBranding`, `AcademicProgram`, `AttendancePolicy`, `HoursPolicy`, `GradebookConfig`, `AssessmentDefaults`, `MessagingPreferences`, `SchoolNotificationSetting`, `RolePermission`, `Permission`, and `SchoolConfiguration` |
| `src/lib/demo-data.ts` | Added demo configuration objects: `demoAcademicPrograms`, `demoAttendancePolicy`, `demoHoursPolicy`, `demoGradebookConfig`, `demoAssessmentDefaults`, `demoMessagingPreferences`, `demoNotificationSettings`, `demoRolePermissions`, and `demoSchoolConfiguration` |
| `src/components/DashboardNav.tsx` | Added "School Settings" nav item under admin role linking to `/admin/school/configuration` |
| `src/app/admin/page.tsx` | Replaced placeholder Schools card with a live "School Settings" card linking to the configuration page |

---

## Features Implemented

1. **School Profile & Branding** — Display and edit school name, address, contact email, brand color preview, and subscription status.
2. **Academic Programs Management** — Toggle programs active/inactive; view required hours, assessments, and practicals.
3. **Instructor Management** — View assigned instructors with avatar initials, email, and role badges.
4. **Student Enrollment Settings** — Toggle open enrollment, self-registration, and select a default program.
5. **Attendance & Hours Policies** — Configure target attendance percentage, auto-excuse limit, tardy threshold, clock-event tracking, required hours, tracked categories, and instructor approval.
6. **Gradebook Configuration** — Set passing percentage, grading scale, and view grade categories.
7. **Assessment Defaults** — Set default passing percentage and toggle allowed assessment types.
8. **Messaging Preferences** — Toggle student-to-student messaging, moderation, and auto-reply.
9. **School-wide Notifications** — Enable/disable notification types with priority badges.
10. **Role & Permission Management (demo-ready)** — Interactive permission matrix for each app role.

---

## Integration Points

- **Authentication & Authorization:** Reuses `isAdmin` from `src/lib/auth-helpers` and the Supabase server client pattern used by `/admin` and `/admin/school`.
- **Navigation:** Added to `DashboardNav` and to the `/admin` dashboard so the configuration page is reachable from existing admin surfaces.
- **Demo Mode:** Configuration state is sourced from `demoSchoolConfiguration` when the demo fallback is enabled, matching the pattern used by the School Owner Dashboard and Instructor Portal.
- **Types:** New types extend existing domain types (`School`, `Profile`, `GradeCategory`, `AssessmentType`, `NotificationPriority`, `NotificationType`, `HourCategory`) rather than duplicating them.
- **Reusable Helpers:** `src/lib/school-config/index.ts` centralizes permission lookup, role checks, and the canonical permission list for reuse by UI and future authorization logic.

---

## Validation Results

| Check | Command | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ Passed |
| Production Build | `npm run build` | ✅ Passed (31 routes generated, including `/admin/school/configuration`) |
| ESLint (Phase 12 files) | `npx eslint src/app/admin/school/configuration src/components/admin/school-config src/lib/school-config src/types/index.ts src/lib/demo-data.ts src/components/DashboardNav.tsx src/app/admin/page.tsx --ext .ts,.tsx --max-warnings 0` | ✅ Passed (0 errors, 0 warnings) |

---

## Known Limitations

- **Persistence:** Configuration changes are held only in React state. A backend table or API is required to persist edits.
- **Brand color upload:** Logo/favicon upload and brand color editing are displayed as read-only placeholders.
- **Instructor management:** Full onboarding, editing, and role assignment for instructors is out of scope; the section currently shows the existing roster.
- **Grade categories / rubrics:** Category and rubric editing are read-only; management of those objects belongs to the gradebook and assessment modules.
- **School-scoped data:** The page currently loads demo configuration for all schools. Multi-tenant loading based on `school_id` will be needed for production.

---

## Recommended Next Phase

**Phase 13 — Backend Persistence & Multi-Tenant Settings API**

- Create a `school_settings` table (or JSONB column on `schools`) scoped by `school_id`.
- Add server actions for reading/updating configuration with row-level security.
- Wire the configuration client to save changes to Supabase.
- Add role-based UI authorization using the `Permission` system introduced in Phase 12.
- Add audit logging for configuration changes.
