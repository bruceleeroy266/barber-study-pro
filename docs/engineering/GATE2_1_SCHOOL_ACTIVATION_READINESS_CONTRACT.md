# G2-1 — School Activation Readiness Contract

**Gate:** Gate 2 — School Onboarding  
**Purpose:** Lock the minimum conditions required before ASCYN PRO may declare a pilot school **Ready to Activate Students**.  
**Baseline:** `main` at `f8a88d9829337986f8bd5bd1d2d51419977212cf`  
**Scope:** Contract/certification only. No new features, schema changes, grading changes, curriculum changes, communications changes, H&A changes, or Gate 3 telemetry changes.

## Decision rule

A pilot school is **Ready to Activate Students** only when every required condition below is satisfied. A missing convenience feature does not block Gate 2 unless it prevents the school from safely provisioning, activating, enrolling, or supporting students.

## Required conditions

### 1. School is provisioned from an approved pilot
**Required:** GREEN

- Pilot inquiry is approved.
- Exactly one school is created from the approved inquiry.
- School settings exist.
- At least one active pilot program exists for the school.
- School creation is durable and linked back to the pilot inquiry.

**Evidence:** `pilot_inquiries`, `schools`, `school_settings`, `programs`, onboarding migration, and `tests/e2e/admin/onboarding-journey.spec.ts`.

### 2. School administrator is active and tenant-bound
**Required:** GREEN

- School-admin invitation exists.
- School admin can activate the account and set a password.
- Invitation lifecycle transitions to accepted.
- School admin is assigned to the correct school.
- School admin cannot act across another school's tenant boundary.

**Evidence:** invitation lifecycle table, `src/app/auth/set-password/page.tsx`, `src/app/auth/invitation-actions.ts`, user-management server actions, tenant-bound tests.

### 3. At least one accountable instructor is active
**Required:** GREEN

- School admin can invite an instructor.
- Instructor can activate the account and sign in.
- Instructor is assigned to the same school.
- Instructor can reach the instructor portal.
- Instructor can see students belonging to the school once they are enrolled.

**Reason:** Student activation must not begin without an accountable instructional owner.

### 4. Student identity, role, and school assignment path is safe
**Required:** GREEN

- School admin can invite a student.
- Student role is assigned correctly.
- Student is attached to the correct school.
- Duplicate/cross-school assignment protections remain enforced.
- Student activation cannot bypass school boundaries.

### 5. Student first-login path is complete
**Required:** GREEN

- Invitation opens the account-activation path.
- Student can create a valid password.
- Invitation is marked accepted.
- Student is routed to the student experience.
- Required beta/pilot agreement path is available.
- Student onboarding checklist is available.

### 6. Student can be enrolled into the active pilot program
**Required:** GREEN

- School admin can enroll the student in the provisioned program.
- Enrollment is persisted as active.
- Student and program belong to the same school.
- Instructor can see the enrolled student in the roster.

### 7. Operational support path exists
**Required:** GREEN

- Student/instructor issues have an in-product support/feedback path.
- Platform administrators can review pilot feedback.
- Production Communications remains available for pilot support.
- A failed user setup can be handled without altering student learning data, grading, or attendance records.

### 8. Gate 2 / Gate 3 boundary is preserved
**Required:** GREEN

The following are **not Gate 2 blockers** and must not be pulled into onboarding merely to close Gate 2:

- study-session/time-spent telemetry;
- quiz-attempt duration observability;
- instant-feedback practice mode;
- automated 30/60/90 reporting;
- comprehensive exam/simulator observability;
- new bulk-import tooling;
- new curriculum or grading behavior.

Those belong to later pilot-operation/activation workstreams unless a real pilot proves they are necessary for basic onboarding.

## Convenience features that are not mandatory for first-pilot readiness

The following may improve scale but are not required to activate a first pilot cohort:

- CSV/bulk student import;
- mass invitation workflows;
- automated resend/revoke dashboard enhancements;
- automated 30/60/90 reports.

For a first pilot of up to 30 students, individual invitation and enrollment is acceptable unless real operational evidence shows it is too burdensome.

## Certification evidence

Current-main already contains a deterministic pilot-onboarding certification journey that proves:

`pilot inquiry → approval → school creation → school-admin activation → instructor invitation/activation → student invitation/activation → beta agreement/checklist → program enrollment → instructor roster visibility`

The CI workflow `.github/workflows/verify.yml` includes **Pilot Onboarding Certification**, which runs `tests/e2e/admin/onboarding-journey.spec.ts` against a disposable local Supabase environment on pull requests.

PO-1A additionally confirms that the invite lifecycle, school/role assignment, tenant boundaries, login vs learning separation, feedback intake, and communications path do not need rebuilding.

## Gate 2 readiness verdict

**Contract status:** LOCKED.

A school may be declared **Ready to Activate Students** when Conditions 1–8 are GREEN for that school.

Current ASCYN PRO architecture satisfies the required Gate 2 capabilities. Remaining work is certification/operational proof, not new feature development.

## Freeze rule

Once Gate 2 is certified GREEN, freeze the onboarding architecture unless:

1. a real pilot exposes a reproducible onboarding failure;
2. a security/tenant-isolation regression appears; or
3. a required activation path becomes unavailable.

Do not reopen Gate 2 for convenience features or Gate 3 analytics.

## Next boundary

After Gate 2 certification, proceed directly into **Gate 3 — Student Activation & Measurement**, including PO-1B activity/session observability, without changing this Gate 2 contract.
