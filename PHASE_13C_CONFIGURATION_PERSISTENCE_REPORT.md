# Phase 13C — Configuration Persistence

## 1. Executive Summary

Phase 13C connects the Phase 12B School Configuration workspace to the `school_settings` table created in Phase 13A. School owners and administrators can now load their school's configuration from Supabase, save changes, reset to the last saved state, and continue to use Demo Mode when Supabase is unavailable. All Phase 13B security protections remain in place, and configuration changes are audit-logged.

---

## 2. Files Created

- `src/lib/school-config/defaults.ts` — Production-safe default configuration builder used when no saved settings exist yet.

## 3. Files Modified

- `src/app/admin/school/configuration/page.tsx`
  - Loads the current admin's school and saved settings from Supabase.
  - Rejects users without `school_id`.
  - Falls back to demo configuration only in Demo Mode.
  - Handles missing `school_settings` table gracefully.

- `src/app/admin/school/configuration/actions.ts`
  - Persists settings to `school_settings.settings` and normalized columns.
  - Computes and audits changed fields.
  - Returns the saved configuration to the client.
  - Handles missing tables and demo mode clearly.

- `src/components/admin/school-config/SchoolConfigurationClient.tsx`
  - Tracks both working config and last-saved config.
  - Updates saved baseline after a successful save.
  - Reset returns the form to the last saved settings.
  - Preserves sticky save/reset bar, validation errors, feedback banner, unsaved-changes indicator, and accessibility attributes.

## 4. Loading Behavior

On page load:

1. The server verifies authentication and admin role.
2. The server rejects admins with a null `school_id`.
3. In Demo Mode, `demoSchoolConfiguration` is returned immediately.
4. In production, the server queries `schools` and `school_settings` for the admin's assigned `school_id`.
5. If a saved `settings` JSONB value exists and validates, it is loaded.
6. If no saved settings exist, `createDefaultSchoolConfiguration(school)` generates a production-safe default using the real school record.
7. If the `school_settings` table is missing, a safe console error is emitted and the page falls back to demo mode so the admin is not blocked.

## 5. Save Behavior

The `saveSchoolConfiguration` server action:

1. Re-authenticates the user.
2. Verifies admin role and rejects non-admins with an audit log entry.
3. Requires a non-null `school_id`; never accepts a school id from the client.
4. Validates the configuration.
5. In Demo Mode or when Supabase is unconfigured, returns a preview-only success message (changes are not persisted).
6. Loads the existing settings row to compute changed fields.
7. Upserts the new settings into `school_settings`:
   - `school_id`
   - `settings` (full JSONB config)
   - `name`, `primary_color`, `contact_email` (normalized columns)
   - `updated_at`, `updated_by`
8. Logs the change via `logSensitiveConfigChange` with the list of changed fields.
9. Returns `{ success, message, savedConfig }`; the client uses `savedConfig` to update its saved baseline and clear unsaved-changes state.

## 6. Reset Behavior

- The client stores the last successfully loaded or saved configuration in `savedConfig` state.
- Clicking **Reset Changes** reverts `config` to `savedConfig`, clears validation errors, clears feedback, and removes the unsaved-changes indicator.
- In Demo Mode, the saved baseline is the demo configuration, so reset returns demo defaults.

## 7. Demo Mode Behavior

- Demo Mode is detected with `isDemoFallbackEnabled()`.
- In Demo Mode the page shows `demoSchoolConfiguration` and the client displays the existing demo warning.
- Save requests in Demo Mode return a preview-only success message; no data is persisted.
- Demo Mode does not bypass role or `school_id` checks.

## 8. Security Review

| Requirement | Status |
|---|---|
| Admins can only edit their own school settings | ✅ Enforced by `profile.school_id` server-side |
| School owners can only edit their own school settings | ✅ Same admin/school-owner role gate |
| Instructors and students cannot access this workflow | ✅ Middleware + server role check rejects non-admins |
| Users with null `school_id` are rejected | ✅ Redirect to `/dashboard` before data loads |
| Demo Mode does not bypass production security | ✅ Role and `school_id` checks run before demo fallback |
| Cross-school updates prevented | ✅ Client-provided school id is never used |

## 9. Audit Logging

Configuration saves are logged through the Phase 13B audit logger:

- Event type: `sensitive_config_change`
- Logged fields: `userId`, `email`, `role`, `schoolId`, `resourceId`, `action`, `metadata.changedFields`
- No secrets, credentials, or raw settings payloads are logged.
- Demo-mode saves are not persisted, so they are not audit-logged to the database (console log may still occur).

## 10. Validation Results

| Check | Command | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | ✅ Passed |
| Production Build | `npm run build` | ✅ Passed (31 routes) |
| ESLint (modified files) | `npx eslint src/app/admin/school/configuration src/components/admin/school-config/SchoolConfigurationClient.tsx src/lib/school-config/defaults.ts` | ✅ Passed |

## 11. Known Limitations

- Production default settings are generated from the school record and neutral policy defaults. They are not seeded from real program/instructor data.
- The normalized `school_settings` columns (`name`, `primary_color`, `contact_email`) are updated, but other normalized columns introduced in Phase 13A are not populated from the JSONB payload.
- If the `schools` record for the admin's `school_id` is missing, the page falls back to Demo Mode rather than showing a dedicated error UI.
- The audit log currently records top-level changed fields only (e.g., `attendancePolicy`), not nested field diffs.

## 12. Recommended Phase 13D

1. Populate all normalized `school_settings` columns from the JSONB payload on save.
2. Add a dedicated "no school assigned" error page instead of redirecting to `/dashboard`.
3. Add server-side diffing for nested configuration fields in audit logs.
4. Seed real program/instructor data into production defaults when available.
5. Add integration tests for load/save/reset flows in both Demo Mode and production.
