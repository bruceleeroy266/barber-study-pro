# Phase 12B — Configuration Persistence & Validation

## Executive Summary

Phase 12B upgrades the School Configuration workspace from a state-only preview to a behaviorally complete admin settings panel. It adds sticky save/reset controls, real-time and server-side validation, visible error messaging, success/error feedback, an unsaved-changes indicator, and accessibility improvements. Persistence wiring for real Supabase mode is in place using a server action; demo mode clearly explains that changes are preview-only.

All validation passed: TypeScript, production build, and ESLint are green.

---

## Files Created

| Path | Purpose |
|---|---|
| `src/lib/school-config/validation.ts` | Shared validation logic for the SchoolConfiguration object |
| `src/app/admin/school/configuration/actions.ts` | Server action that validates, authorizes, and saves (or previews) configuration |

## Files Modified

| Path | Change |
|---|---|
| `src/components/admin/school-config/SchoolConfigurationClient.tsx` | Added dirty-state tracking, validation, save/reset handlers, sticky footer, feedback banner, unsaved indicator, and tab ARIA attributes |
| `src/components/admin/school-config/SchoolProfileSection.tsx` | Added `htmlFor`/`id` labels, `aria-invalid`, and error messages for school name and email |
| `src/components/admin/school-config/AttendancePolicySection.tsx` | Added validation display for target attendance %, auto-excuse limit, and tardy threshold |
| `src/components/admin/school-config/HoursPolicySection.tsx` | Added validation display for required hours |
| `src/components/admin/school-config/GradebookConfigSection.tsx` | Added validation display for passing percentage |
| `src/components/admin/school-config/AssessmentDefaultsSection.tsx` | Added validation display for passing percentage and disabled explanations |

---

## Features Implemented

1. **Sticky Save Changes / Reset Changes controls** — Bottom bar fixed near viewport bottom; disabled when there are no unsaved changes or while saving.
2. **Real-time validation** — Runs on every config change and surfaces errors immediately.
3. **Server-side validation** — Repeated in the save action before any persistence attempt.
4. **Visible validation errors** — Red error text below each invalid field with `aria-invalid` and `aria-describedby`.
5. **Success/error feedback messages** — Banner with `role="status"` and `aria-live="polite"`.
6. **Unsaved changes indicator** — Header badge and sticky-bar text change when config diverges from initial state.
7. **Demo-mode explanation** — Persistent banner plus sticky-bar note that changes are preview-only and lost on refresh.
8. **Real Supabase persistence flow** — `saveSchoolConfiguration` server action authorizes admins, validates input, and attempts an `upsert` into a `school_settings` table. It returns a clear message if the table is missing.
9. **Accessibility improvements** — Tabs use `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, and `aria-labelledby`; feedback region is live; disabled inputs have `aria-disabled` and `title` explanations.
10. **Preserved Phase 12 sections** — All 10 configuration sections remain unchanged in scope and behavior.

---

## Validation Rules

| Field | Rule |
|---|---|
| School name | Required, non-empty |
| Contact email | Valid email format if provided |
| Target attendance % | 0–100 |
| Auto-excuse limit | 0 or greater |
| Tardy threshold | 0 or greater |
| Required hours | 0 or greater |
| Gradebook passing % | 0–100 |
| Assessment passing % | 0–100 |

---

## Persistence Behavior

### Demo Mode

- Client-side state updates freely.
- Save action returns success with message: "Settings are valid, but changes are preview-only in demo mode and will not persist."
- UI explains that settings are lost on refresh.

### Real Supabase Mode (production-ready wiring)

- Save action checks admin role again server-side.
- Validates configuration server-side.
- Attempts `upsert` into `school_settings` on `school_id` conflict.
- If the table does not exist, returns a clear backend-not-configured message.
- Once the `school_settings` table exists, no client changes are required.

---

## Integration Points

- Reuses `isAdmin` and `createClient` from existing auth patterns.
- Reuses `isDemoFallbackEnabled` / Supabase-configured detection from `addInstructorNote` pattern.
- Extends Phase 12 types without schema changes.
- Keeps navigation and admin dashboard links from Phase 12 unchanged.

---

## Validation Results

| Check | Command | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ Passed |
| Production Build | `npm run build` | ✅ Passed (31 routes generated) |
| ESLint (Phase 12 files) | `npx eslint src/app/admin/school/configuration src/components/admin/school-config src/lib/school-config src/types/index.ts src/lib/demo-data.ts src/components/DashboardNav.tsx src/app/admin/page.tsx --ext .ts,.tsx --max-warnings 0` | ✅ Passed (0 errors, 0 warnings) |

---

## Known Limitations

- **Backend table not created:** The `school_settings` table does not exist yet, so real persistence will report "not configured" until the migration is added.
- **Brand color / logo / rubric / category management:** Remains read-only, as in Phase 12.
- **No optimistic UI:** Save is synchronous server action; loading state is shown but no optimistic updates.
- **No discard-changes confirmation:** Reset immediately reverts state without a modal.

---

## Recommended Next Phase

**Phase 12C — Database Schema & Production Persistence**

- Add a `school_settings` table with `school_id`, `settings` (JSONB), `updated_at`, `updated_by`.
- Add Row Level Security so admins can only update their own school's settings.
- Update the `/admin/school/configuration/page.tsx` server component to load real settings from Supabase, falling back to defaults when absent.
- Wire the save action to the real table and remove the not-configured fallback.
