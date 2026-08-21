# ASCYN PRO — PHASE 7A SLICE 0: TENANT-BOUNDARY SECURITY CORRECTION REPORT

**Date:** 2026-08-21
**Author:** Ping (AI Development Partner)
**Status:** CORRECTION IMPLEMENTED — AWAITING ADVERSARIAL RE-VERIFICATION

---

## 1. Root Cause Confirmed

### Vulnerability

The RLS policy `"Profiles: users update own"` (migration `20260714010000_fix_quiz_progress_missed_rls.sql`, lines 133–136) grants authenticated users unrestricted UPDATE access to **all columns** on their own profile row:

```sql
create policy "Profiles: users update own" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

Combined with the table-level grant:

```sql
grant select, insert, update, delete on public.profiles to authenticated;
```

This allows any authenticated user to execute:

```sql
UPDATE profiles SET
  school_id = '<any-school-uuid>',
  role = 'admin',
  approval_status = 'approved',
  is_disabled = false
WHERE id = auth.uid();
```

### Impact

- **Privilege escalation:** Any student can promote themselves to `instructor`, `school_admin`, or `admin`.
- **Cross-school tenant escape:** Any user can change their `school_id` to access another school's data.
- **Self-approval:** Pending users can set `approval_status = 'approved'` to bypass the approval workflow.
- **Self-re-enablement:** Disabled users can set `is_disabled = false` to regain access.
- **Approval forgery:** Users can forge `approved_by` and `approved_at` to fabricate approval provenance.

### Why This Is Exploitable

Downstream RLS helper functions (`current_user_school_id()`, `current_user_role()`, `is_school_staff()`, `is_school_admin()`) trust the values stored in `profiles`. An attacker who modifies their own `school_id` or `role` immediately gains the privileges those functions confer — including reading other schools' student data, managing users, and accessing admin dashboards.

---

## 2. Exact Correction Implemented

### Approach: Database Trigger (BEFORE UPDATE)

A PostgreSQL trigger function `enforce_profile_protected_columns()` fires `BEFORE UPDATE` on the `profiles` table. When the calling PostgreSQL role is `authenticated` (i.e., a regular Supabase JS client session), the trigger **silently reverts** all security-sensitive columns to their original (`OLD`) values. The UPDATE succeeds for non-protected columns only.

**Why silent stripping instead of raising an error:**
- Prevents information leakage about which columns are protected
- Allows ORM/client updates that include all columns to succeed for the safe subset
- Avoids breaking legitimate update flows (e.g., `update-password` clearing `requires_password_change`)

**Privileged role bypass:**
- `service_role` — used by all admin server actions via `createServiceRoleClient()`
- `postgres` — superuser, used by migrations and database administration
- `supabase_admin` — Supabase internal admin role

### Protected Columns (6)

| Column | Protection Rationale |
|--------|---------------------|
| `school_id` | Prevents cross-school tenant escape |
| `role` | Prevents privilege escalation |
| `approval_status` | Prevents self-approval |
| `is_disabled` | Prevents self-re-enablement |
| `approved_by` | Prevents forging approval provenance |
| `approved_at` | Prevents forging approval timestamp |

### Unprotected (Safe) Columns

| Column | Why Safe |
|--------|----------|
| `full_name` | Display name only; no security impact |
| `email` | Managed by Supabase Auth; profile email is informational |
| `avatar_url` | Cosmetic; no security impact |
| `barber_shop_name` | Informational; no security impact |
| `mentor_name` | Informational; no security impact |
| `requires_password_change` | Needed by `update-password` flow to clear the flag |
| `updated_at` | Managed by `update_updated_at_column()` trigger |
| `created_at` | Set at insert; not typically updated |

---

## 3. Files Created or Modified

### Created

| File | Purpose |
|------|---------|
| `supabase/migrations/20260821000000_phase_7a_slice0_tenant_boundary_security.sql` | Database migration: trigger function + trigger attachment + execution restrictions |
| `src/__tests__/migrations/phase-7a-slice0-tenant-boundary-security.test.ts` | 50 structural validation tests covering migration correctness, protected-column coverage, adversarial vectors, legitimate-update preservation, and RLS compatibility |
| `ASCYN_PRO_PHASE7A_SLICE0_TENANT_BOUNDARY_SECURITY_CORRECTION_REPORT.md` | This report |

### Modified

No existing files were modified. The correction is purely additive (new migration + new test file).

---

## 4. Before/After Authorization Model

### BEFORE (Vulnerable)

```
Authenticated User → Supabase JS Client → PostgREST → RLS Policy Check
                                                      │
                                                      ▼
                                              "Profiles: users update own"
                                              USING: auth.uid() = id ✓
                                              WITH CHECK: auth.uid() = id ✓
                                                      │
                                                      ▼
                                              UPDATE profiles SET
                                                school_id = '<attacker-choice>',  ← ALLOWED
                                                role = 'admin',                   ← ALLOWED
                                                approval_status = 'approved',     ← ALLOWED
                                                is_disabled = false               ← ALLOWED
                                              WHERE id = auth.uid()
```

### AFTER (Corrected)

```
Authenticated User → Supabase JS Client → PostgREST → RLS Policy Check
                                                      │
                                                      ▼
                                              "Profiles: users update own"
                                              USING: auth.uid() = id ✓
                                              WITH CHECK: auth.uid() = id ✓
                                                      │
                                                      ▼
                                              BEFORE UPDATE TRIGGER
                                              enforce_profile_protected_columns()
                                              │
                                              ├─ current_user = 'authenticated'
                                              │   ├─ new.school_id := old.school_id        ← REVERTED
                                              │   ├─ new.role := old.role                  ← REVERTED
                                              │   ├─ new.approval_status := old.approval_status ← REVERTED
                                              │   ├─ new.is_disabled := old.is_disabled    ← REVERTED
                                              │   ├─ new.approved_by := old.approved_by    ← REVERTED
                                              │   └─ new.approved_at := old.approved_at    ← REVERTED
                                              │
                                              ▼
                                              UPDATE succeeds for safe columns only

service_role → Supabase JS Client (service key) → PostgREST → RLS bypassed
                                                      │
                                                      ▼
                                              BEFORE UPDATE TRIGGER
                                              enforce_profile_protected_columns()
                                              │
                                              ├─ current_user = 'service_role'
                                              │   └─ return new;  ← BYPASS, all columns allowed
                                              │
                                              ▼
                                              UPDATE succeeds for all columns
```

---

## 5. Protected-Column Matrix

| Column | Student Self-Update | Instructor Self-Update | Admin (service_role) | school_admin (service_role) |
|--------|--------------------|-----------------------|---------------------|---------------------------|
| `school_id` | ❌ BLOCKED | ❌ BLOCKED | ✅ ALLOWED | ✅ ALLOWED |
| `role` | ❌ BLOCKED | ❌ BLOCKED | ✅ ALLOWED | ✅ ALLOWED |
| `approval_status` | ❌ BLOCKED | ❌ BLOCKED | ✅ ALLOWED | ✅ ALLOWED |
| `is_disabled` | ❌ BLOCKED | ❌ BLOCKED | ✅ ALLOWED | ✅ ALLOWED |
| `approved_by` | ❌ BLOCKED | ❌ BLOCKED | ✅ ALLOWED | ✅ ALLOWED |
| `approved_at` | ❌ BLOCKED | ❌ BLOCKED | ✅ ALLOWED | ✅ ALLOWED |
| `full_name` | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED |
| `email` | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED |
| `avatar_url` | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED |
| `barber_shop_name` | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED |
| `mentor_name` | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED |
| `requires_password_change` | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED | ✅ ALLOWED |

**Note:** Admin and school_admin server actions use `createServiceRoleClient()` which connects as the `service_role` PostgreSQL role. The trigger bypasses column protection for this role. Application-layer authorization (role checks, school scoping) is enforced in the server actions before the database call.

---

## 6. Adversarial Test Results

All 11 adversarial attack vectors are covered by structural assertions in the test file:

| # | Attack Vector | Test | Result |
|---|--------------|------|--------|
| ADV-1 | Student changes own `school_id` | `new.school_id := old.school_id` present in trigger | ✅ PROTECTED |
| ADV-2 | Student changes own `role` | `new.role := old.role` present in trigger | ✅ PROTECTED |
| ADV-3 | Student promotes to `instructor` | `role` column protected — any change reverted | ✅ PROTECTED |
| ADV-4 | Student promotes to `school_admin` | `role` column protected — any change reverted | ✅ PROTECTED |
| ADV-5 | Student promotes to `admin` | `role` column protected — any change reverted | ✅ PROTECTED |
| ADV-6 | Student changes `approval_status` | `new.approval_status := old.approval_status` present | ✅ PROTECTED |
| ADV-7 | Student re-enables via `is_disabled` | `new.is_disabled := old.is_disabled` present | ✅ PROTECTED |
| ADV-8 | Combined `school_id` + `role` tenant escape | Both columns independently protected | ✅ PROTECTED |
| ADV-9 | Direct Supabase client bypass | Trigger fires at database level regardless of client | ✅ PROTECTED |
| ADV-10 | Forge `approved_by` provenance | `new.approved_by := old.approved_by` present | ✅ PROTECTED |
| ADV-11 | Forge `approved_at` timestamp | `new.approved_at := old.approved_at` present | ✅ PROTECTED |

**Note:** These are structural (migration content) tests. Live-database adversarial testing requires a running Supabase instance and should be performed during the adversarial security re-verification phase.

---

## 7. Application-Layer vs Database-Authoritative Guarantees

### Database-Authoritative (This Correction)

| Guarantee | Mechanism | Strength |
|-----------|-----------|----------|
| Protected columns cannot be modified by `authenticated` role | BEFORE UPDATE trigger | **Absolute** — cannot be bypassed by any client |
| `service_role` can modify all columns | Trigger bypass via `current_user` check | **Absolute** — controlled by PostgreSQL role system |
| Trigger function cannot be called directly | REVOKE EXECUTE from public/authenticated/anon | **Absolute** — only fires via trigger |

### Application-Layer (Existing, Unchanged)

| Guarantee | Mechanism | Strength |
|-----------|-----------|----------|
| Admin actions require admin/school_admin role | `getCurrentAdmin()` in server actions | **Strong** — but bypassable if attacker escalates role |
| School admins scoped to own school | `admin.schoolId` check in server actions | **Strong** — but bypassable if attacker changes school_id |
| Role validation on create/invite | `isKnownRole()` + `MANAGEABLE_ROLES` | **Strong** — but only at creation time |

**Key insight:** The application-layer checks were already correct. The vulnerability existed because the database layer trusted the `profiles` row values without verifying they hadn't been tampered with. This correction closes that gap at the database layer.

---

## 8. Regression Results

### Existing Functionality Preserved

| Flow | Status | Evidence |
|------|--------|----------|
| User login | ✅ Preserved | No changes to auth flow; middleware reads profiles (SELECT only) |
| Profile page display | ✅ Preserved | Read-only page; no UPDATE calls |
| Update password | ✅ Preserved | `requires_password_change` is NOT a protected column |
| Admin user management | ✅ Preserved | All admin actions use `service_role` (bypasses trigger) |
| Admin create user | ✅ Preserved | Uses `service_role` INSERT |
| Admin invite user | ✅ Preserved | Uses `service_role` UPSERT |
| Admin update status | ✅ Preserved | Uses `service_role` UPDATE |
| Admin toggle disabled | ✅ Preserved | Uses `service_role` UPDATE |
| Admin change role | ✅ Preserved | Uses `service_role` UPDATE |
| Admin assign school | ✅ Preserved | Uses `service_role` UPDATE |
| Admin delete user | ✅ Preserved | Uses `service_role` DELETE |
| Admin reset password | ✅ Preserved | Uses `service_role` UPDATE |
| School-scoped RLS | ✅ Preserved | No RLS policies modified |
| Instructor flows | ✅ Preserved | No instructor-facing UPDATE to profiles |
| Student flows | ✅ Preserved | No student-facing UPDATE to profiles |

### Test Suite Impact

- **No existing tests broken.** All 65 test files pass (1187 tests).
- **50 new tests added** covering the migration structure, protected columns, adversarial vectors, legitimate updates, and RLS compatibility.

---

## 9. Validation Results

| Check | Result | Details |
|-------|--------|---------|
| TypeScript compilation | ✅ PASS | Zero errors (`npx tsc --noEmit`) |
| Full test suite | ✅ PASS | 1187/1187 tests, 65/65 test files |
| Production build | ✅ PASS | 40+ routes generated, zero errors |
| New migration tests | ✅ PASS | 50/50 tests |
| Existing migration tests | ✅ PASS | All Phase 6C migration tests pass |

---

## 10. Exact Git Status

### New Files (Untracked — Part of This Correction)

```
?? supabase/migrations/20260821000000_phase_7a_slice0_tenant_boundary_security.sql
?? src/__tests__/migrations/phase-7a-slice0-tenant-boundary-security.test.ts
?? ASCYN_PRO_PHASE7A_SLICE0_TENANT_BOUNDARY_SECURITY_CORRECTION_REPORT.md
```

### Pre-Existing Changes (NOT Part of This Correction)

```
 M supabase/config.toml
 M supabase/migrations/20260727150000_backfill_missing_profiles.sql
 D textbook-images/chapter-6/*.jpg (63 deleted image files)
?? ASCYN_PRO_CH02_PHASE5_FINAL_CLOSEOUT.md
?? ASCYN_PRO_CH02_PHASE6C1_REMEDIATION_CYCLE_POLICY.md
?? ASCYN_PRO_CH02_PHASE6C2B_HISTORICAL_EXCLUSION_IMPLEMENTATION.md
?? ASCYN_PRO_CH02_PHASE6C2B_REASSESSMENT_INTEGRITY_REVIEW.md
?? ASCYN_PRO_CH02_PHASE6C2D_REASSESSMENT_EVALUATION_ARCHITECTURE_REVIEW.md
?? ASCYN_PRO_CH02_PHASE6C4_SAFEGUARDS_POLISH_ARCHITECTURE_REVIEW.md
?? ASCYN_PRO_CH02_PHASE6C5_INTEGRATION_ARCHITECTURE_REVIEW.md
?? ASCYN_PRO_CH02_PHASE6C5_RELEASE_BLOCKER_CORRECTION_REPORT.md
?? ASCYN_PRO_CH02_PHASE6C_TARGETED_REMEDIATION_ARCHITECTURE_REVIEW.md
?? docs/research/licensing-intelligence/* (5 files)
?? supabase/migrations/20260816000000_google_connections.sql
?? supabase/migrations/20260816000001_oauth_states.sql
```

---

## 11. Exact Proposed Commit Scope

**Only these 3 files should be committed for Slice 0:**

```
supabase/migrations/20260821000000_phase_7a_slice0_tenant_boundary_security.sql
src/__tests__/migrations/phase-7a-slice0-tenant-boundary-security.test.ts
ASCYN_PRO_PHASE7A_SLICE0_TENANT_BOUNDARY_SECURITY_CORRECTION_REPORT.md
```

**Suggested commit message:**

```
fix(security): Phase 7A Slice 0 tenant-boundary security correction

Add BEFORE UPDATE trigger on profiles table that prevents authenticated
users from modifying security-sensitive columns (school_id, role,
approval_status, is_disabled, approved_by, approved_at).

The trigger silently reverts protected columns to their original values
for non-privileged roles while allowing service_role full access for
admin workflows.

Closes the privilege escalation and cross-school tenant escape
vulnerability confirmed in Phase 7A Tenant-Boundary Security Verification.
```

---

## 12. Remaining Security Concerns

### Addressed by This Correction

- ✅ Authenticated users can no longer modify `school_id` on their own profile
- ✅ Authenticated users can no longer modify `role` on their own profile
- ✅ Authenticated users can no longer modify `approval_status` on their own profile
- ✅ Authenticated users can no longer modify `is_disabled` on their own profile
- ✅ Authenticated users can no longer forge `approved_by` or `approved_at`

### Not Addressed (Out of Scope for Slice 0)

| Concern | Severity | Notes |
|---------|----------|-------|
| `handle_new_user()` trigger allows self-registration with `instructor` role | Medium | Signup metadata can request `instructor` role. Still requires admin approval, but the role is set at creation. Consider restricting self-registration to `student` only. |
| `requires_password_change` is user-modifiable | Low | Users can clear this flag themselves. This is intentional (the update-password flow needs it), but a user could clear it without changing their password. Mitigated by the fact that the flag is set by admins and the flow is user-initiated. |
| No rate limiting on profile updates | Low | An authenticated user could spam UPDATE requests. Mitigated by Supabase connection limits and the fact that protected columns are silently reverted. |
| `email` column is user-modifiable via direct client | Low | Users could change their profile email to mismatch their auth email. This is cosmetic; auth identity is managed by Supabase Auth. |
| No database-level audit trail for profile changes | Medium | The `user_management_audit_logs` table only captures admin actions. Direct client updates to safe columns are not audited. Consider adding a database-level audit trigger for all profile changes. |
| `platform_super_admin` role referenced in RLS but not in CHECK constraint | Low | The `is_platform_super_admin()` function checks for `role = 'platform_super_admin'` but the CHECK constraint only allows `('student', 'apprentice', 'instructor', 'admin', 'school_admin')`. This role cannot be assigned through normal flows. |

---

## 13. Final Verdict

**READY FOR PHASE 7A SLICE 0 ADVERSARIAL SECURITY RE-VERIFICATION**

The tenant-boundary security correction has been implemented at the database authorization layer using a BEFORE UPDATE trigger. All 50 structural validation tests pass. TypeScript compiles cleanly. The full test suite (1187 tests) passes. The production build succeeds. No existing functionality is broken.

The correction is minimal, targeted, and purely additive. It does not modify any existing RLS policies, table structures, or application code. It adds a single trigger function and trigger to the profiles table, plus comprehensive test coverage.

**Awaiting authorization for adversarial security re-verification against a live database.**

---

*Report generated 2026-08-21 by Ping.*
