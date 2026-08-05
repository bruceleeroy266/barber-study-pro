# `/users` Playbook — v1.1

**Version:** 1.1  
**Date:** 2026-08-04  
**Author:** Ping  
**Status:** Active  
**Supersedes:** `/users` v1.0 (informal, ad-hoc)  
**Change Summary:** Added User State Consistency Verification module based on production incident where authentication failures were caused by administrative data inconsistencies, not application defects.

---

## Table of Contents

1. [Purpose](#purpose)
2. [Scope](#scope)
3. [Prerequisites](#prerequisites)
4. [Workflow](#workflow)
5. [User State Consistency Verification](#user-state-consistency-verification)
6. [Failure Handling](#failure-handling)
7. [Output Format](#output-format)
8. [Operational Procedures](#operational-procedures)
9. [Architecture Impact](#architecture-impact)
10. [EOS Compliance](#eos-compliance)

---

## Purpose

The `/users` playbook governs all user account operations against the ASCYN PRO production environment. It covers account creation, verification, password management, role assignment, and state consistency checking.

**Core principle:** Verify before you modify. Diagnose before you repair. Never guess.

---

## Scope

### In Scope

- User account creation (students, instructors, admins)
- Password resets and credential verification
- Role and approval status management
- User state consistency verification
- Account existence verification
- Profile integrity checks
- Related record verification (beta agreements, school assignments, enrollments)

### Out of Scope

- Application code changes (use `/code` procedures)
- Database schema changes (use `/database` procedures)
- Deployment operations (use `/deploy` procedures)
- Authentication pipeline debugging (use `/auth` playbook)
- Browser automation testing (use `/playwright` playbook)

### Boundary with `/auth`

`/auth` verifies the authentication **pipeline** (middleware, redirects, session management, cookie handling). `/users` verifies **user account state** (credentials, profiles, related records). If `/users` consistency check passes and login still fails, escalate to `/auth`.

### Boundary with `/verify`

`/verify` provides the evidence standards and search protocols used by this playbook. `/users` references `/verify` for confidence levels and evidence citation format.

---

## Prerequisites

Before executing any `/users` operation:

| Requirement | How to Verify |
|-------------|---------------|
| Supabase service role key | Read from `.env.local` → `SUPABASE_SERVICE_ROLE_KEY` |
| Supabase project URL | Read from `.env.local` → `NEXT_PUBLIC_SUPABASE_URL` |
| Correct production project | Confirm project ref matches `hgyznydxepjsvbjsirpv` |
| No code modifications | `git status` shows clean working tree |
| Playwright installed | `npx playwright --version` (only needed for login verification) |

---

## Workflow

```
┌─────────────────────────────────┐
│  /users Operation Requested     │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  Step 1: Environment Check      │
│  Verify Supabase credentials    │
│  and project identity           │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  Step 2: Account Existence      │
│  Check auth.users and profiles  │
│  for target account(s)          │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  Step 3: CONSISTENCY CHECK  ◄───│── NEW in v1.1
│  Run User State Consistency     │
│  Verification (see below)       │
└─────────────┬───────────────────┘
              │
         ┌────┴────┐
         ▼         ▼
    CONSISTENT  INCONSISTENT
         │         │
         ▼         ▼
┌─────────────┐ ┌──────────────────────┐
│ Proceed to  │ │ Classify as:         │
│ requested   │ │ Administrative Data  │
│ operation   │ │ Inconsistency        │
│ (create,    │ │                      │
│ reset,      │ │ Recommend minimum    │
│ verify)     │ │ corrective action    │
└─────────────┘ └──────────────────────┘
```

---

## User State Consistency Verification

**New in v1.1.** This module runs **before** any password reset, account recreation, or application debugging is recommended.

### When to Run

- Before recommending a password reset
- Before recommending account recreation
- When a user reports login failure
- When authentication appears broken but infrastructure is verified
- As part of any user investigation

### Check 1: Authentication State

Verify the user's record in Supabase Auth.

```sql
-- Via Supabase Admin API (not raw SQL in production)
supabase.auth.admin.listUsers()
-- Filter by email (case-insensitive)
```

| Field | Expected | Action if Wrong |
|-------|----------|-----------------|
| User exists | `true` | Account does not exist — may need creation |
| `email_confirmed_at` | Not null | Email not confirmed — resend confirmation |
| `banned_until` | Null or past | Account banned — investigate why |
| `last_sign_in_at` | Recent (if active user) | Note for timeline analysis |
| `user_metadata.role` | Matches expected role | Metadata inconsistency — investigate |
| `user_metadata.requires_password_change` | `false` for normal operation | Will force redirect to `/update-password` |

### Check 2: Profile State

Verify the matching profile record.

```sql
-- Via Supabase client with service role
SELECT id, email, full_name, role, approval_status, is_disabled, 
       requires_password_change, school_id
FROM profiles
WHERE id = '<user_id>';
```

| Field | Expected | Action if Wrong |
|-------|----------|-----------------|
| Profile exists | `true` | Orphaned auth record — create profile or investigate trigger |
| `id` matches auth user ID | Exact match | ID mismatch — data integrity issue |
| `role` | Matches expected role | Role mismatch — update or investigate |
| `approval_status` | `'approved'` | User not approved — approve or investigate |
| `is_disabled` | `false` | Account disabled — investigate why |
| `requires_password_change` | `false` for normal operation | **Will force redirect to `/update-password`** |
| `school_id` | Valid school UUID | Missing school assignment |

### Check 3: Cross-Table Consistency

Compare auth state against profile state.

| Check | Consistent | Inconsistent |
|-------|-----------|-------------|
| Auth `requires_password_change` vs Profile `requires_password_change` | Both `false` or both `true` | One `true`, other `false` — **middleware reads from profile** |
| Auth `user_metadata.role` vs Profile `role` | Same value | Different values — profile takes precedence in middleware |
| Auth email vs Profile `email` | Same (case-insensitive) | Mismatch — data integrity issue |
| Auth user exists AND Profile exists | Both exist | Orphan on either side |

**Critical:** The middleware reads `requires_password_change` from the **profiles table**, not from auth user_metadata. Clearing the flag in auth metadata alone will NOT remove the `/update-password` redirect.

### Check 4: Authorization Prerequisites

Verify role-specific requirements are met.

| Role | Requirement | How to Check |
|------|------------|--------------|
| `student` | School assigned | `profiles.school_id` is not null |
| `student` | Beta agreement accepted | Record exists in `beta_agreements` for user + current version |
| `instructor` | School assigned | `profiles.school_id` is not null |
| `admin` / `school_admin` | No additional prerequisites | N/A — middleware skips beta agreement check |

### Check 5: Related Records

Verify existence of records required for the user's role.

| Record | Table | Required For | Check |
|--------|-------|-------------|-------|
| Beta agreement | `beta_agreements` | Students (role ≠ admin/instructor) | `SELECT * FROM beta_agreements WHERE user_id = '<id>' AND agreement_version = '<current>'` |
| School | `schools` | All users | `SELECT * FROM schools WHERE id = '<school_id>'` — verify school exists and is active |
| Instructor assignment | Via `school_id` | Students | Verify instructor and student share same `school_id` |

**Current beta agreement version:** Read from `src/lib/beta.ts` → `BETA_AGREEMENT_VERSION`

**Middleware behavior:** Students without a beta agreement record are redirected to `/beta-agreement?redirect=<intended_path>` on any dashboard route. Admins and instructors bypass this check.

---

## Failure Handling

### Classification

When the consistency check identifies issues, classify them:

```
Administrative Data Inconsistency
```

This classification means:
- The application code is **not** defective
- The authentication pipeline is **not** broken
- The issue is in **user account data state**
- The fix is an **administrative action**, not a code change

### Corrective Actions

| Inconsistency | Minimum Corrective Action | Do NOT |
|-------------|--------------------------|--------|
| `profiles.requires_password_change = true` but should be `false` | `UPDATE profiles SET requires_password_change = false WHERE id = '<id>'` | Do not change application code |
| Missing beta agreement | `INSERT INTO beta_agreements (user_id, tester_name, tester_email, agreement_version, accepted_at) VALUES (...)` | Do not bypass middleware |
| Orphaned auth record (no profile) | Create profile via application flow or manual insert | Do not delete auth record without investigation |
| Orphaned profile (no auth user) | Investigate — may indicate deleted auth user | Do not delete profile without investigation |
| Role mismatch between auth and profile | Update profile to match intended role | Do not modify auth metadata directly |
| Account disabled unexpectedly | Investigate why, then re-enable if appropriate | Do not enable without understanding why disabled |
| Wrong email in auth | Create new auth user with correct email, migrate profile | Do not modify auth email directly |

### Escalation Path

```
Consistency Check FAILS
        │
        ▼
┌─────────────────────┐
│ Administrative Data │
│ Inconsistency       │
│                     │
│ Apply minimum       │
│ corrective action   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ Re-run consistency  │
│ check               │
└─────────┬───────────┘
          │
     ┌────┴────┐
     ▼         ▼
  PASSES    STILL FAILS
     │         │
     ▼         ▼
┌─────────┐ ┌──────────────┐
│ Proceed │ │ Escalate to  │
│ with op │ │ /auth for    │
│         │ │ pipeline     │
│         │ │ investigation│
└─────────┘ └──────────────┘
```

---

## Output Format

### L1 Output: User Consistency Report

```text
USER CONSISTENCY

Auth
PASS | FAIL
  - User exists: YES | NO
  - Email confirmed: YES | NO
  - Account enabled: YES | NO
  - Last sign-in: <timestamp> | NEVER
  - Auth metadata role: <role>
  - Auth requires_password_change: true | false

Profile
PASS | FAIL
  - Profile exists: YES | NO
  - ID matches auth: YES | NO
  - Role: <role>
  - Approval: <status>
  - Disabled: true | false
  - Profile requires_password_change: true | false

Authorization
PASS | FAIL
  - Role prerequisites met: YES | NO
  - School assigned: YES | NO (<school_name>)
  - Beta agreement: YES | NO | N/A (role)

Related Records
PASS | FAIL
  - Beta agreement: FOUND | MISSING | N/A
  - School record: FOUND | MISSING
  - Instructor linkage: CONFIRMED | MISSING | N/A

Consistency
PASS | FAIL
  - Auth ↔ Profile password-change flag: MATCH | MISMATCH
  - Auth ↔ Profile role: MATCH | MISMATCH
  - Auth ↔ Profile email: MATCH | MISMATCH
  - No orphaned records: CONFIRMED | ORPHANS FOUND

Overall
CONSISTENT | INCONSISTENT

Inconsistencies Found: <count>
Classification: Administrative Data Inconsistency | N/A
Recommended Action: <action> | None
```

### L2 Output: Full Evidence Report

For each check, include:
- Exact query or API call used
- Raw results
- Timestamp of verification
- Confidence level (per `/verify` protocol)

---

## Operational Procedures

### Procedure: Password Reset

**Prerequisites:** Consistency check completed, user exists

**Steps:**

1. Run User State Consistency Verification
2. If INCONSISTENT → fix inconsistencies first, then proceed
3. Reset password via Supabase Admin API:
   ```javascript
   supabase.auth.admin.updateUserById(userId, {
     password: '<new_password>',
     user_metadata: { ...existing, requires_password_change: false }
   })
   ```
4. Clear profile password-change flag:
   ```javascript
   supabase.from('profiles')
     .update({ requires_password_change: false })
     .eq('id', userId)
   ```
5. Verify related records exist (beta agreement, school, etc.)
6. Run login verification via Playwright
7. Document results

**Critical:** Steps 3 AND 4 are both required. The middleware reads from the profiles table. Clearing only the auth metadata will NOT remove the `/update-password` redirect.

### Procedure: Account Creation

**Prerequisites:** Verify account does not already exist

**Steps:**

1. Check for existing account (case-insensitive email search)
2. If exists → report existing account, stop
3. Create auth user via Supabase Admin API
4. Handle auto-created profile (database trigger) or create manually
5. Configure profile (role, school, approval)
6. Create required related records (beta agreement for students)
7. Run User State Consistency Verification
8. Run login verification via Playwright
9. Document results

### Procedure: Login Verification

**Prerequisites:** User exists, password known

**Steps:**

1. Run User State Consistency Verification
2. If INCONSISTENT → fix before testing login
3. Launch Playwright browser
4. Navigate to login page
5. Enter credentials
6. Submit form
7. Record final URL
8. Verify session cookies exist
9. Verify correct dashboard reached
10. Attempt logout
11. Verify session destroyed
12. Re-login to confirm password works
13. Document results

---

## Architecture Impact

### What Changed from v1.0

| Aspect | v1.0 (informal) | v1.1 |
|--------|-----------------|------|
| Consistency checking | Not performed | Automated before any repair action |
| Password reset | Auth metadata only | Auth metadata + profiles table |
| Beta agreement | Not checked | Verified for students |
| Cross-table validation | Not performed | Auth ↔ Profile consistency verified |
| Failure classification | Generic "login failed" | Specific "Administrative Data Inconsistency" |
| Corrective action | Often code investigation first | Administrative fix first, code investigation only if consistent |

### What Did NOT Change

- No application code changes
- No database schema changes
- No new dependencies
- No changes to middleware, auth pipeline, or routing
- No changes to `/auth`, `/verify`, or `/playwright` playbooks
- Existing user operations remain identical when state is consistent

### Token Savings Estimate

| Scenario | Without v1.1 | With v1.1 | Savings |
|----------|-------------|-----------|---------|
| Login failure investigation | Full auth pipeline debug (~15K tokens) | Consistency check (~2K tokens) + targeted fix (~1K) | ~80% |
| Password reset | Reset + debug redirect loop (~10K tokens) | Reset + clear both flags (~2K tokens) | ~80% |
| Missing beta agreement | Debug middleware redirect (~8K tokens) | Detect missing record (~1K tokens) | ~87% |
| Account creation issues | Create + debug failures (~12K tokens) | Create + consistency check (~4K tokens) | ~67% |

**Estimated average savings: ~75% of investigation tokens** when the root cause is administrative data inconsistency (which today's incident demonstrated is the common case).

---

## EOS Compliance

### Governance Framework Alignment

| EOS Principle | How v1.1 Complies |
|---------------|-------------------|
| **Verify before acting** | Consistency check runs before any modification |
| **Evidence-based conclusions** | All checks produce structured PASS/FAIL with evidence |
| **Minimum intervention** | Recommends minimum corrective administrative action |
| **No unnecessary changes** | Does not modify code, schema, or unrelated records |
| **Deterministic behavior** | Same input → same checks → same output format |
| **Incremental improvement** | Adds module without changing existing behavior |
| **Traceability** | Every check documented with query, result, timestamp |
| **Separation of concerns** | `/users` handles user state, `/auth` handles pipeline, `/verify` handles evidence standards |

### Backward Compatibility

- All v1.0 operations work identically when user state is consistent
- Consistency check is additive — it runs before operations but doesn't change them
- Output format extends but doesn't replace existing reporting
- No breaking changes to any interface

---

## Lessons Learned (2026-08-04 Incident)

This enhancement is based on a real production incident where:

1. **Three pilot users couldn't log in** after a password reset because the reset only updated auth metadata, not the profiles table `requires_password_change` flag. The middleware reads from profiles, so the redirect to `/update-password` persisted.

2. **One user was redirected to `/beta-agreement`** because no beta agreement record existed. The middleware correctly enforced the requirement, but the account creation process didn't create the record.

3. **Initial investigation focused on the application** (middleware, routing, deployment) when the actual issue was administrative data state. A consistency check would have identified all three issues in minutes.

**Key insight:** Most production authentication issues are caused by inconsistent user state, not application defects. Check the data first.

---

*Version 1.1 — 2026-08-04*  
*Next review: After 30 days of production use or next significant incident*
