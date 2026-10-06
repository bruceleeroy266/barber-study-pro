# STUDENT-HOURS-1 — Adaptive Student Hours Contract

Status: Contract implementation slice. No UI changes.

## Purpose

ASCYN PRO must support students who do not begin an enrollment at zero hours or who have a documented student-specific total-hour requirement, without changing the school's program requirement for every student and without fabricating attendance/hour-log history.

## Canonical data model

The program requirement remains authoritative at `programs.required_hours`.

Enrollment-specific exceptions live in `enrollment_hour_contracts`:

- `prior_credit_minutes`: official school-accepted transfer/prior credit.
- `requirement_override_minutes`: optional total requirement for this enrollment only.
- `version`: optimistic-concurrency version.

Every accepted change creates an immutable `enrollment_hour_contract_events` row containing:

- old and new prior credit;
- old and new requirement override;
- change type;
- reason;
- optional source/reference;
- actor;
- timestamp;
- contract version.

Prior credit is never inserted into `hour_logs`, `attendance_records`, or `hour_adjustments`.

## Official calculation

All persisted values use integer minutes.

```
program_required_minutes = programs.required_hours * 60

effective_required_minutes =
  requirement_override_minutes ?? program_required_minutes

earned_approved_minutes =
  sum(official values from effective_hour_logs)

credited_and_earned_minutes =
  prior_credit_minutes + earned_approved_minutes

remaining_minutes =
  max(0, effective_required_minutes - credited_and_earned_minutes)

completion_percentage =
  effective_required_minutes > 0
    ? min(100, round(credited_and_earned_minutes / effective_required_minutes * 100))
    : 0
```

Pending and rejected hours never contribute. Invalid approved-hour adjustment chains continue to fail closed through the existing H&A resolver.

## Permission boundary

For this contract slice, only an active approved:

- same-school `admin` or `school_admin`;
- platform `admin` with no school assignment; or
- `platform_super_admin`

may make an official contract change.

Instructors do not directly mutate the official contract. A later UI/workflow slice may add an instructor submission/approval path without weakening this mutation boundary.

## Atomic mutation

All official mutation goes through:

`set_enrollment_hour_contract(...)`

The RPC:

1. authenticates and authorizes the actor;
2. locks the enrollment;
3. derives student, school, and program from authoritative rows;
4. validates school/program/student integrity;
5. locks the current contract;
6. validates the expected version;
7. writes the immutable audit event;
8. updates/creates the current-state contract atomically.

Authenticated users have no direct INSERT/UPDATE/DELETE grants on either contract table.

## Canonical read contract

`effective_enrollment_hour_contracts` resolves:

- program required hours/minutes;
- prior credit;
- optional enrollment override;
- effective required minutes;
- requirement source (`program` or `student_override`);
- contract version.

It intentionally does not aggregate earned hours. Earned official hours stay owned by `effective_hour_logs`, preserving the existing H&A boundary.

The TypeScript calculation contract is:

`src/lib/hours/adaptive-student-hours.ts`

Downstream UI/report integrations are intentionally deferred until this contract is certified.
