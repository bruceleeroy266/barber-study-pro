# ASCYN PRO — PHASE 7A SLICE 7
## Integration/Adversarial Validation Environment Preparation Report

**Date:** 2026-08-22  
**Authorized By:** Gabriel Arcaina  
**Repository:** `C:\Users\gabeb\Projects\barber-study-pro`  
**Baseline Commit:** `606f88a3d9b46ff2c4129005861dfb93f786bc08`  
**Baseline State:** 1,505/1,505 tests passing | TypeScript: zero errors | Build: PASS

---

## 1. INFRASTRUCTURE DISCOVERED

### 1.1 Existing Test Infrastructure

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| **Vitest** | ✅ Active | `vitest.config.ts` | 73 test files, 1,505 tests passing |
| **Playwright** | ✅ Active | `playwright.config.ts` | E2E framework with fixtures, POM, multi-browser |
| **Test Fixtures** | ✅ Active | `tests/fixtures/test-fixtures.ts` | studentPage, instructorPage, adminPage, cleanPage |
| **Page Object Model** | ✅ Active | `tests/pages/` | base-page, login-page, dashboard-page, etc. |
| **Test Utilities** | ✅ Active | `tests/utilities/` | auth.ts, assertions.ts, browser.ts |
| **Migration Tests** | ✅ Active | `src/__tests__/migrations/` | Structural SQL validation (no live DB) |
| **Unit Tests** | ✅ Active | `src/**/*.test.ts` | Mocked Supabase clients |

### 1.2 Existing E2E Test Coverage

| Category | Files | Coverage |
|----------|-------|----------|
| Authentication | 6 files | Login, logout, session, password reset |
| Student | 12 files | Dashboard, chapters, flashcards, quizzes, remediation |
| Instructor | 12 files | Dashboard, roster, analytics, reports |
| Admin | 0 files | ❌ **NO E2E COVERAGE** |
| Smoke/Regression | 4 files | Basic smoke tests |

**Critical Gap:** No E2E tests exist for admin onboarding workflows (pilot inquiry → school creation → user invitation).

### 1.3 Supabase Configuration

| Component | Status | Details |
|-----------|--------|---------|
| **Local Dev Config** | ✅ Present | `supabase/config.toml` — full local stack configured |
| **Docker** | ✅ Available | Docker 29.6.2 installed |
| **Supabase CLI** | ✅ Available | v2.109.1 installed |
| **Migrations** | ✅ 24 files | All Phase 7A migrations present |
| **Seed Data** | ✅ Present | `seed.sql` (demo schools), `seed-test-accounts.sql` |
| **Local SMTP** | ✅ Configured | Port 54324 for email testing |
| **Auth** | ✅ Configured | Local auth with invite support |

### 1.4 Environment Files

| File | Purpose | Status |
|------|---------|--------|
| `.env.example` | Template | ✅ Present |
| `.env.local` | Local development | ✅ Present (gitignored) |
| `.env.production` | Production | ✅ Present (gitignored) |
| `.env.vercel.production` | Vercel production | ✅ Present |

### 1.5 Existing Test Scripts

| Script | Purpose |
|--------|---------|
| `scripts/create-admin-user.ts` | Create platform admin via service role |
| `scripts/create-pilot-users.ts` | Create student/instructor test accounts |
| `scripts/setup-pilot-school.ts` | School setup utility |

---

## 2. ENVIRONMENT CHOSEN

### 2.1 Selected Environment: **Local Supabase Instance**

**Rationale:**
- Full PostgreSQL with real RLS enforcement
- Real Auth with invitation lifecycle
- No production data risk
- Supports all required test scenarios
- Can be reset to clean state between test runs

**Configuration:**
- API Port: 54321
- DB Port: 54322
- Studio Port: 54323
- SMTP Port: 54324 (Inbucket email testing)
- Auth: Enabled with invite support
- Storage: Enabled

### 2.2 Alternative Considered: Dedicated Test Project

**Rejected because:**
- Requires additional Supabase project setup
- Network latency for test runs
- Potential cost implications
- Local instance provides faster iteration

### 2.3 Production Safety

| Control | Status |
|---------|--------|
| Production URL/keys | ❌ NOT used in tests |
| Production data | ❌ NOT touched |
| Production migrations | ❌ NOT run |
| Local-only env vars | ✅ Required for tests |

---

## 3. LOCAL/TEST DATABASE STATUS

### 3.1 Current State

| Item | Status | Notes |
|------|--------|-------|
| Docker | ✅ Running | Docker 29.6.2 |
| Supabase CLI | ✅ Installed | v2.109.1 |
| Local Supabase | ⚠️ **NOT STARTED** | Requires `supabase start` |
| Migrations | ⚠️ **NOT APPLIED** | Will apply on `supabase start` |
| Seed Data | ⚠️ **NOT LOADED** | Will load on `supabase start` |

### 3.2 Required Startup Sequence

```bash
# 1. Start local Supabase (applies migrations, loads seed)
supabase start

# 2. Verify local instance
supabase status

# 3. Create test-specific env file
cp .env.example .env.test.local

# 4. Update .env.test.local with local Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
# SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key>
```

### 3.3 Migration Status

All 24 migrations will be applied automatically on `supabase start`:

| Migration | Phase | Status |
|-----------|-------|--------|
| `20250625009900_create_legacy_core_tables` | Legacy | Pending |
| `20250625010000_create_core_production_tables` | Core | Pending |
| `20250625010050_fix_schools_anon_select_policy` | Core | Pending |
| `20250625010100_create_school_settings` | Core | Pending |
| `20250625010200_production_indexes_and_rls` | Core | Pending |
| `20250625020000_security_hardening` | Security | Pending |
| `20250625160000_create_enterprise_services_tables` | Enterprise | Pending |
| `20250625180000_create_operational_tables` | Operational | Pending |
| `20250628000000_fix_schools_select_rls` | Security | Pending |
| `20250701100000_create_beta_agreements_table` | Beta | Pending |
| `20250705210000_create_beta_feedback_table` | Beta | Pending |
| `20250706091600_align_schools_schema` | Schools | Pending |
| `20250706120500_complete_schools_schema` | Schools | Pending |
| `20250711180000_pilot_invite_only_access` | Pilot | Pending |
| `20250712030000_admin_user_management` | Admin | Pending |
| `20250712140000_create_missed_questions_table` | Quiz | Pending |
| `20250713100000_create_pilot_inquiries_table` | Pilot | Pending |
| `20250713140000_add_pilot_inquiry_columns` | Pilot | Pending |
| `20250714010000_fix_quiz_progress_missed_rls` | Security | Pending |
| `20250715141000_convert_missed_questions_question_id_to_text` | Quiz | Pending |
| `20250715142000_add_missing_table_grants` | Security | Pending |
| `20250722010000_create_owner_notifications` | Notifications | Pending |
| `20250727150000_backfill_missing_profiles` | Data | Pending |
| `20250805000000_extend_school_settings_phase10` | Settings | Pending |
| `20250809_ai_platform` | AI | Pending |
| `20260816000000_google_connections` | OAuth | Pending |
| `20260816000001_oauth_states` | OAuth | Pending |
| `20260816230000_drop_google_integration` | OAuth | Pending |
| `20260818000000_phase_6c2a_remediation_foundation` | 6C-2A | Pending |
| `20260818000001_phase_6c2b_reassessment_integrity` | 6C-2B | Pending |
| `20260819000000_phase_6c2c_escalation_reset` | 6C-2C | Pending |
| `20260819000001_phase_6c2c_follow_up_evidence_integrity` | 6C-2C | Pending |
| `20260819000002_phase_6c2d_reassessment_evaluation` | 6C-2D | Pending |
| `20260820000000_phase_6c3_submission_integrity` | 6C-3 | Pending |
| `20260821000000_phase_6c5_atomic_cycle_creation` | 6C-5 | Pending |
| `20260821000000_phase_7a_slice0_tenant_boundary_security` | **7A-0** | Pending |
| `20260822000000_phase_7a_school_onboarding` | **7A-1** | Pending |
| `20260822000001_phase_7a_slice_5_5_onboarding_blockers` | **7A-5.5** | Pending |

---

## 4. TEST ACTOR STRATEGY

### 4.1 Required Test Actors

| Actor | Role | School | Purpose |
|-------|------|--------|---------|
| **Platform Admin** | `admin` | NULL | Platform-level administration |
| **School Admin A** | `school_admin` | School A | School A administration |
| **Instructor A** | `instructor` | School A | School A instruction |
| **Student A** | `student` | School A | School A learning |
| **School Admin B** | `school_admin` | School B | School B administration |
| **Instructor B** | `instructor` | School B | School B instruction |
| **Student B** | `student` | School B | School B learning |

### 4.2 Actor Creation Strategy

**Approach:** Database seeding + Supabase Auth admin API

```typescript
// Test actor creation flow:
// 1. Create auth users via supabase.auth.admin.createUser()
// 2. Create profiles via service role client
// 3. Create domain records (students/instructors) via service role
// 4. Create school associations
```

**File to Create:** `tests/integration/setup/test-actors.ts`

```typescript
export interface TestActor {
  id: string
  email: string
  password: string
  role: AppRole
  schoolId: string | null
  profileId: string
  domainId?: string // student_id or instructor_id
}

export interface TestSchool {
  id: string
  name: string
  slug: string
}

export const TEST_SCHOOLS: Record<string, TestSchool> = {
  SCHOOL_A: {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name: 'Test Academy Alpha',
    slug: 'test-academy-alpha',
  },
  SCHOOL_B: {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name: 'Test Academy Beta',
    slug: 'test-academy-beta',
  },
}

export const TEST_ACTORS: Record<string, TestActor> = {
  PLATFORM_ADMIN: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'platform-admin@ascyn-test.local',
    password: 'Test1234!',
    role: 'admin',
    schoolId: null,
    profileId: '00000000-0000-0000-0000-000000000001',
  },
  SCHOOL_ADMIN_A: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'school-admin-a@ascyn-test.local',
    password: 'Test1234!',
    role: 'school_admin',
    schoolId: TEST_SCHOOLS.SCHOOL_A.id,
    profileId: '11111111-1111-1111-1111-111111111111',
  },
  INSTRUCTOR_A: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'instructor-a@ascyn-test.local',
    password: 'Test1234!',
    role: 'instructor',
    schoolId: TEST_SCHOOLS.SCHOOL_A.id,
    profileId: '22222222-2222-2222-2222-222222222222',
    domainId: '22222222-2222-2222-2222-222222222222',
  },
  STUDENT_A: {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'student-a@ascyn-test.local',
    password: 'Test1234!',
    role: 'student',
    schoolId: TEST_SCHOOLS.SCHOOL_A.id,
    profileId: '33333333-3333-3333-3333-333333333333',
    domainId: '33333333-3333-3333-3333-333333333333',
  },
  SCHOOL_ADMIN_B: {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'school-admin-b@ascyn-test.local',
    password: 'Test1234!',
    role: 'school_admin',
    schoolId: TEST_SCHOOLS.SCHOOL_B.id,
    profileId: '44444444-4444-4444-4444-444444444444',
  },
  INSTRUCTOR_B: {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'instructor-b@ascyn-test.local',
    password: 'Test1234!',
    role: 'instructor',
    schoolId: TEST_SCHOOLS.SCHOOL_B.id,
    profileId: '55555555-5555-5555-5555-555555555555',
    domainId: '55555555-5555-5555-5555-555555555555',
  },
  STUDENT_B: {
    id: '66666666-6666-6666-6666-666666666666',
    email: 'student-b@ascyn-test.local',
    password: 'Test1234!',
    role: 'student',
    schoolId: TEST_SCHOOLS.SCHOOL_B.id,
    profileId: '66666666-6666-6666-6666-666666666666',
    domainId: '66666666-6666-6666-6666-666666666666',
  },
}
```

### 4.3 Actor Lifecycle Management

| Phase | Action |
|-------|--------|
| **Setup** | Create schools, auth users, profiles, domain records |
| **Test** | Use actors for authentication and authorization tests |
| **Teardown** | Delete test data (or rely on `supabase db reset`) |

---

## 5. AUTH TESTING STRATEGY

### 5.1 Invitation Lifecycle Testing

**Challenge:** Supabase local instance sends emails to Inbucket (local SMTP), not real email.

**Solution:** Direct token generation and validation via Supabase Auth Admin API.

```typescript
// Strategy: Bypass email delivery, test token lifecycle directly

// 1. Create invitation via admin API
const { data, error } = await supabase.auth.admin.inviteUserByEmail(
  'new-user@ascyn-test.local',
  {
    data: { full_name: 'New User', role: 'student' },
    redirectTo: 'http://localhost:3000/auth/callback',
  }
)

// 2. Extract token from invitation (via service role or direct DB query)
// 3. Test token acceptance via /auth/callback
// 4. Test token expiration
// 5. Test token replay
```

### 5.2 Test Scenarios

| Scenario | Method | Validation |
|----------|--------|------------|
| Valid invitation | Admin API → Token → Accept | User created, profile linked |
| Duplicate invitation | Admin API × 2 | Second fails or updates |
| Existing account invitation | Admin API for existing user | Proper error or merge |
| Expired invitation | Manipulate `expires_at` | Token rejected |
| Invitation replay | Reuse same token | Token rejected |
| Wrong user/token | Mismatched token | Access denied |
| Cross-school invitation | Invite to School B, use for School A | Access denied |

### 5.3 Files to Create

| File | Purpose |
|------|---------|
| `tests/integration/auth/invitation-lifecycle.test.ts` | Invitation flow tests |
| `tests/integration/auth/token-validation.test.ts` | Token security tests |
| `tests/integration/setup/auth-helpers.ts` | Auth test utilities |

---

## 6. RLS TESTING STRATEGY

### 6.1 Core Principle

**Test actual runtime behavior, not just RLS policy definitions.**

### 6.2 Test Architecture

```typescript
// RLS Test Pattern:
// 1. Authenticate as Actor A (School A)
// 2. Attempt to access/modify School B data
// 3. Verify access denied or data filtered
// 4. Attempt privilege escalation
// 5. Verify blocked by trigger/RLS
```

### 6.3 Test Scenarios

| Attack Vector | Actor | Target | Expected Result |
|-------------|-------|--------|-----------------|
| Cross-school read | Student A | School B students | Empty result or error |
| Cross-school read | Instructor A | School B students | Empty result or error |
| Cross-school read | School Admin A | School B data | Empty result or error |
| Cross-school write | School Admin A | School B programs | Error or no change |
| Cross-school write | Instructor A | School B students | Error or no change |
| Role escalation | Student A | Become instructor | Blocked by trigger |
| Role escalation | Instructor A | Become school_admin | Blocked by trigger |
| School escape | Student A | Change school_id | Blocked by trigger |
| Direct RPC | Any | Call admin functions | Error (not authorized) |
| SQL injection | Any | Malicious input | Parameterized queries block |

### 6.4 Implementation Approach

**File:** `tests/integration/rls/tenant-isolation.test.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { TEST_ACTORS, TEST_SCHOOLS } from '../setup/test-actors'

describe('RLS Tenant Isolation', () => {
  // Create authenticated clients for each actor
  const createAuthenticatedClient = async (actor: TestActor) => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { error } = await client.auth.signInWithPassword({
      email: actor.email,
      password: actor.password,
    })
    
    if (error) throw error
    return client
  }

  test('Student A cannot read School B students', async () => {
    const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
    
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)
    
    // Should return empty or error due to RLS
    expect(data).toEqual([])
  })

  test('School Admin A cannot modify School B programs', async () => {
    const client = await createAuthenticatedClient(TEST_ACTORS.SCHOOL_ADMIN_A)
    
    const { error } = await client
      .from('programs')
      .update({ name: 'Hacked Program' })
      .eq('school_id', TEST_SCHOOLS.SCHOOL_B.id)
    
    // Should fail or affect 0 rows
    expect(error).not.toBeNull()
  })

  test('Student cannot escalate to instructor role', async () => {
    const client = await createAuthenticatedClient(TEST_ACTORS.STUDENT_A)
    
    // Attempt to update own role
    const { error } = await client
      .from('profiles')
      .update({ role: 'instructor' })
      .eq('id', TEST_ACTORS.STUDENT_A.profileId)
    
    // Trigger should silently revert role change
    // Verify role is still 'student'
    const { data } = await client
      .from('profiles')
      .select('role')
      .eq('id', TEST_ACTORS.STUDENT_A.profileId)
      .single()
    
    expect(data.role).toBe('student')
  })
})
```

### 6.5 Files to Create

| File | Purpose |
|------|---------|
| `tests/integration/rls/tenant-isolation.test.ts` | Cross-school access tests |
| `tests/integration/rls/role-escalation.test.ts` | Privilege escalation tests |
| `tests/integration/rls/direct-rpc.test.ts` | RPC authorization tests |
| `tests/integration/rls/sql-injection.test.ts` | Injection prevention tests |

---

## 7. E2E STRATEGY

### 7.1 Complete Onboarding Journey

**Journey to Test:**

```
Pilot Inquiry
  → Admin Approval
    → School Creation
      → School Admin Invitation
        → Invitation Acceptance
          → Password/Auth Setup
            → School Dashboard
              → Program Configuration
                → Instructor Invitation
                  → Student Invitation
                    → Instructor/Student Domain Records
                      → Student Enrollment
                        → Normal School Administration
```

### 7.2 E2E Test Structure

**File:** `tests/e2e/admin/onboarding-journey.spec.ts`

```typescript
import { test, expect } from '../../fixtures/test-fixtures'
import { TEST_ACTORS, TEST_SCHOOLS } from '../../integration/setup/test-actors'

test.describe('Phase 7A: Complete Onboarding Journey', () => {
  test('Platform admin can approve inquiry and create school', async ({ adminPage }) => {
    // 1. Navigate to pilot inquiries
    await adminPage.goto('/admin/pilot-inquiries')
    
    // 2. Find and approve test inquiry
    await adminPage.click('[data-testid="approve-inquiry"]')
    await adminPage.click('[data-testid="confirm-approve"]')
    
    // 3. Create school from approved inquiry
    await adminPage.click('[data-testid="create-school"]')
    await adminPage.click('[data-testid="confirm-create"]')
    
    // 4. Verify school created
    await expect(adminPage.locator('text=School Created')).toBeVisible()
  })

  test('School admin can accept invitation and access dashboard', async ({ cleanPage }) => {
    // 1. Simulate invitation acceptance (via direct URL with token)
    // 2. Set password
    // 3. Verify redirect to school dashboard
    // 4. Verify school data visible
  })

  test('School admin can invite instructor', async ({ schoolAdminPage }) => {
    // 1. Navigate to user management
    // 2. Send instructor invitation
    // 3. Verify invitation recorded
  })

  test('Instructor can accept invitation and access portal', async ({ cleanPage }) => {
    // 1. Accept invitation
    // 2. Set password
    // 3. Verify instructor dashboard
  })

  test('Complete flow: inquiry to enrolled student', async ({ adminPage, cleanPage }) => {
    // Full end-to-end validation
  })
})
```

### 7.3 New Page Objects Required

| Page Object | Purpose |
|-------------|---------|
| `AdminPilotInquiriesPage` | Pilot inquiry management |
| `AdminUsersPage` | User management |
| `SchoolDashboardPage` | School admin dashboard |
| `InvitationAcceptPage` | Invitation acceptance flow |
| `SetPasswordPage` | Password setup |

### 7.4 Files to Create

| File | Purpose |
|------|---------|
| `tests/e2e/admin/onboarding-journey.spec.ts` | Complete journey tests |
| `tests/e2e/admin/pilot-inquiries.spec.ts` | Inquiry management tests |
| `tests/e2e/admin/user-invitations.spec.ts` | Invitation tests |
| `tests/pages/admin-pilot-inquiries-page.ts` | Page object |
| `tests/pages/admin-users-page.ts` | Page object |
| `tests/pages/school-dashboard-page.ts` | Page object |

---

## 8. AUDIT-TESTING STRATEGY

### 8.1 Current Audit Logging

**Implementation:** `src/lib/security/audit-logger.ts`

- Structured console logging
- Optional database persistence via service role
- Event types: `failed_login`, `permission_denied`, `role_change`, etc.

### 8.2 Audit Test Strategy

**Approach:** Query actual audit log table (if persisted) or capture console output.

```typescript
// Strategy 1: Database verification (if audit_logs table exists)
const { data: logs } = await serviceClient
  .from('security_logs')
  .select('*')
  .eq('type', 'permission_denied')
  .eq('user_id', TEST_ACTORS.STUDENT_A.id)

expect(logs.length).toBeGreaterThan(0)

// Strategy 2: Console capture (for non-persisted logs)
const consoleSpy = vi.spyOn(console, 'log')
// ... perform action ...
expect(consoleSpy).toHaveBeenCalledWith(
  expect.stringContaining('[SECURITY]')
)
```

### 8.3 Test Scenarios

| Event | Trigger | Validation |
|-------|---------|------------|
| Failed login | Invalid credentials | `failed_login` event logged |
| Permission denied | Cross-school access attempt | `permission_denied` event |
| Role change attempt | Privilege escalation | `role_change` + `denied` |
| School isolation violation | Cross-school write | `school_isolation_violation` |
| Sensitive config change | School settings update | `sensitive_config_change` |

### 8.4 Files to Create

| File | Purpose |
|------|---------|
| `tests/integration/audit/security-logging.test.ts` | Audit log validation |
| `tests/integration/setup/audit-helpers.ts` | Audit test utilities |

---

## 9. DATA-INTEGRITY TESTS

### 9.1 Test Scenarios

| Scenario | Validation |
|----------|------------|
| Duplicate school creation | Second creation fails or is idempotent |
| Concurrent school creation | Race condition handled gracefully |
| Duplicate enrollment | Second enrollment fails or is idempotent |
| Incorrect program/school association | FK constraint prevents invalid link |
| Incorrect student/school association | FK constraint prevents invalid link |
| Program deactivation with enrollment | Historical enrollment preserved |
| School creation atomicity | Partial creation rolls back |
| School creation idempotency | Retry produces same result |

### 9.2 Implementation

**File:** `tests/integration/data-integrity/constraints.test.ts`

```typescript
describe('Data Integrity Constraints', () => {
  test('duplicate school creation is prevented', async () => {
    // Attempt to create school with same pilot_inquiry_id twice
    // Verify UNIQUE constraint prevents duplicate
  })

  test('duplicate enrollment is prevented', async () => {
    // Attempt to enroll same student in same program twice
    // Verify UNIQUE constraint prevents duplicate
  })

  test('cross-school program association is prevented', async () => {
    // Attempt to create program with mismatched school_id
    // Verify FK constraint or RLS prevents
  })

  test('school creation is atomic', async () => {
    // Simulate failure during school creation
    // Verify no partial records remain
  })
})
```

---

## 10. TEST ARCHITECTURE

### 10.1 Test Suite Organization

```
tests/
├── integration/                    # NEW: Integration tests
│   ├── setup/
│   │   ├── test-actors.ts          # Test actor definitions
│   │   ├── test-schools.ts         # Test school definitions
│   │   ├── auth-helpers.ts         # Auth utilities
│   │   ├── db-helpers.ts           # Database utilities
│   │   └── audit-helpers.ts        # Audit utilities
│   ├── auth/
│   │   ├── invitation-lifecycle.test.ts
│   │   └── token-validation.test.ts
│   ├── rls/
│   │   ├── tenant-isolation.test.ts
│   │   ├── role-escalation.test.ts
│   │   ├── direct-rpc.test.ts
│   │   └── sql-injection.test.ts
│   ├── audit/
│   │   └── security-logging.test.ts
│   ├── data-integrity/
│   │   └── constraints.test.ts
│   └── onboarding/
│       ├── school-creation.test.ts
│       ├── user-invitation.test.ts
│       └── enrollment.test.ts
├── e2e/
│   ├── admin/                      # NEW: Admin E2E tests
│   │   ├── onboarding-journey.spec.ts
│   │   ├── pilot-inquiries.spec.ts
│   │   └── user-invitations.spec.ts
│   └── ... (existing)
└── pages/                          # NEW: Admin page objects
    ├── admin-pilot-inquiries-page.ts
    ├── admin-users-page.ts
    └── school-dashboard-page.ts
```

### 10.2 Test Categories

| Category | Framework | Database | Purpose |
|----------|-----------|----------|---------|
| **A. Unit Tests** | Vitest | Mocked | Component logic (existing) |
| **B. Database Integration** | Vitest + Supabase | Real (local) | RLS, constraints, triggers |
| **C. RLS Adversarial** | Vitest + Supabase | Real (local) | Cross-tenant attacks |
| **D. Auth Integration** | Vitest + Supabase | Real (local) | Invitation lifecycle |
| **E. E2E Journey** | Playwright | Real (local) | Complete user flows |
| **F. Manual** | N/A | N/A | Edge cases, UX validation |

### 10.3 Test Execution Order

```bash
# 1. Start local Supabase
supabase start

# 2. Run database integration tests
npm run test:integration

# 3. Run RLS adversarial tests
npm run test:rls

# 4. Run auth integration tests
npm run test:auth

# 5. Run E2E journey tests
npm run test:e2e:admin

# 6. Full validation
npm run verify:full
```

---

## 11. FILES TO CREATE/MODIFY

### 11.1 New Files to Create

| File | Purpose | Priority |
|------|---------|----------|
| `tests/integration/setup/test-actors.ts` | Test actor definitions | P0 |
| `tests/integration/setup/test-schools.ts` | Test school definitions | P0 |
| `tests/integration/setup/auth-helpers.ts` | Auth utilities | P0 |
| `tests/integration/setup/db-helpers.ts` | Database utilities | P0 |
| `tests/integration/setup/audit-helpers.ts` | Audit utilities | P1 |
| `tests/integration/auth/invitation-lifecycle.test.ts` | Invitation tests | P0 |
| `tests/integration/auth/token-validation.test.ts` | Token tests | P0 |
| `tests/integration/rls/tenant-isolation.test.ts` | Cross-school tests | P0 |
| `tests/integration/rls/role-escalation.test.ts` | Privilege tests | P0 |
| `tests/integration/rls/direct-rpc.test.ts` | RPC tests | P1 |
| `tests/integration/rls/sql-injection.test.ts` | Injection tests | P2 |
| `tests/integration/audit/security-logging.test.ts` | Audit tests | P1 |
| `tests/integration/data-integrity/constraints.test.ts` | Constraint tests | P0 |
| `tests/integration/onboarding/school-creation.test.ts` | School creation tests | P0 |
| `tests/integration/onboarding/user-invitation.test.ts` | Invitation tests | P0 |
| `tests/integration/onboarding/enrollment.test.ts` | Enrollment tests | P0 |
| `tests/e2e/admin/onboarding-journey.spec.ts` | E2E journey | P0 |
| `tests/e2e/admin/pilot-inquiries.spec.ts` | Inquiry E2E | P1 |
| `tests/e2e/admin/user-invitations.spec.ts` | Invitation E2E | P1 |
| `tests/pages/admin-pilot-inquiries-page.ts` | Page object | P1 |
| `tests/pages/admin-users-page.ts` | Page object | P1 |
| `tests/pages/school-dashboard-page.ts` | Page object | P1 |
| `.env.test.local.example` | Test env template | P0 |
| `supabase/seed-test-actors.sql` | Test actor seed | P0 |

### 11.2 Existing Files to Modify

| File | Modification | Priority |
|------|--------------|----------|
| `package.json` | Add test scripts | P0 |
| `vitest.config.ts` | Add integration test config | P0 |
| `playwright.config.ts` | Add admin test project | P1 |
| `tests/index.ts` | Export new utilities | P1 |
| `tests/config/environment.ts` | Add test env vars | P0 |

### 11.3 Package.json Script Additions

```json
{
  "scripts": {
    "test:integration": "vitest run tests/integration",
    "test:rls": "vitest run tests/integration/rls",
    "test:auth": "vitest run tests/integration/auth",
    "test:e2e:admin": "playwright test tests/e2e/admin",
    "test:slice7": "npm run test:integration && npm run test:e2e:admin",
    "supabase:start": "supabase start",
    "supabase:stop": "supabase stop",
    "supabase:reset": "supabase db reset",
    "supabase:status": "supabase status"
  }
}
```

---

## 12. RISKS/LIMITATIONS

### 12.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Local Supabase startup failure | High | Document troubleshooting, provide fallback |
| Migration conflicts | Medium | Test on clean instance, document resolution |
| Auth token extraction complexity | Medium | Use Admin API, document approach |
| Email testing limitations | Low | Use Inbucket, document token extraction |
| Test data cleanup | Medium | Use `supabase db reset` between runs |

### 12.2 Security Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Test credentials in code | High | Use env vars, never commit |
| Service role key exposure | Critical | Local only, gitignore |
| Production data access | Critical | Explicit local URL only |
| RLS bypass in tests | High | Use authenticated clients, not service role |

### 12.3 Operational Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Test flakiness | Medium | Retry logic, explicit waits |
| Port conflicts | Low | Configurable ports |
| Docker resource usage | Low | Document requirements |
| CI/CD integration | Medium | Document CI setup |

---

## 13. BLOCKERS

### 13.1 Current Blockers

| Blocker | Severity | Resolution |
|---------|----------|------------|
| Local Supabase not started | **P0** | Run `supabase start` |
| Test environment not configured | **P0** | Create `.env.test.local` |
| Test actors not defined | **P0** | Create seed script |
| No admin E2E tests | **P0** | Create test files |
| No integration test infrastructure | **P0** | Create test setup |

### 13.2 Potential Blockers

| Blocker | Severity | Resolution |
|---------|----------|------------|
| Docker not running | P0 | Start Docker Desktop |
| Port conflicts | P1 | Change ports in config |
| Migration failures | P1 | Debug and fix migrations |
| Auth configuration issues | P1 | Verify local auth settings |

---

## 14. EXACT EXECUTION PLAN

### Phase 1: Environment Setup (30 minutes)

```bash
# 1. Verify Docker is running
docker --version

# 2. Start local Supabase
cd C:\Users\gabeb\Projects\barber-study-pro
supabase start

# 3. Verify status
supabase status

# 4. Note the local credentials:
#    API URL: http://127.0.0.1:54321
#    anon key: <from status output>
#    service_role key: <from status output>
#    DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

### Phase 2: Test Configuration (30 minutes)

```bash
# 1. Create test environment file
cp .env.example .env.test.local

# 2. Edit .env.test.local with local Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<local-anon-key>
# SUPABASE_SERVICE_ROLE_KEY=<local-service-role-key>

# 3. Create test actor seed
# File: supabase/seed-test-actors.sql

# 4. Apply test seed
supabase db reset  # Applies migrations + seed
```

### Phase 3: Test Infrastructure (2 hours)

1. Create `tests/integration/setup/` files
2. Create `tests/integration/auth/` tests
3. Create `tests/integration/rls/` tests
4. Create `tests/integration/data-integrity/` tests
5. Create `tests/integration/onboarding/` tests
6. Update `package.json` scripts
7. Update `vitest.config.ts`

### Phase 4: E2E Infrastructure (2 hours)

1. Create `tests/pages/admin-*-page.ts` page objects
2. Create `tests/e2e/admin/` test files
3. Update `playwright.config.ts`
4. Update `tests/index.ts` exports

### Phase 5: Validation (1 hour)

```bash
# 1. Run integration tests
npm run test:integration

# 2. Run E2E admin tests
npm run test:e2e:admin

# 3. Run full validation
npm run verify:full

# 4. Document results
```

### Phase 6: Reporting (30 minutes)

1. Document test results
2. Document any failures
3. Classify issues (P0/P1/P2/P3)
4. Create final report

---

## 15. VERDICT

### Current Status: **SLICE 7 ENVIRONMENT NOT READY — BLOCKERS REQUIRE RESOLUTION**

**Blockers:**
1. Local Supabase instance not started
2. Test environment configuration not created
3. Test actors not defined
4. Integration test infrastructure not created
5. Admin E2E tests not created

**Required Actions:**
1. Start local Supabase (`supabase start`)
2. Create test environment configuration
3. Create test actor seed data
4. Create integration test infrastructure
5. Create admin E2E test files

**Estimated Time to Ready:** 6-8 hours

---

## 16. NEXT STEPS

**Immediate (Next Session):**
1. Start local Supabase instance
2. Verify all migrations apply successfully
3. Create test environment configuration
4. Create test actor seed data

**Short-term:**
1. Implement integration test infrastructure
2. Implement RLS adversarial tests
3. Implement auth integration tests
4. Implement E2E admin tests

**Authorization Required:**
- Proceed with test implementation
- Modify `package.json` and config files
- Create new test files

---

**Report Prepared By:** Ping  
**Date:** 2026-08-22  
**Status:** Awaiting authorization to proceed with environment setup
