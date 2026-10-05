# G5-E — Bulk Onboarding Evaluation

## Decision

**Bulk onboarding is DEFERRED for the current pilot.**

CSV import, mass invitations, bulk enrollment, and bulk instructor assignment are not required to keep Gate 5 moving.

The existing self-service path is operational and already certified through G5-A through G5-D. G5-E does not authorize a second onboarding system or parallel mutation paths.

## Evidence

Current onboarding is intentionally individual:

- User Management invites one user at a time.
- The invite form closes after a successful invite and reloads the user list.
- Enrollment uses the existing per-student Enrollment modal.
- Instructor assignment uses the existing per-student Manage User flow.
- G5-D now deep-links the school admin directly into the next existing action.

For a school with 18 pilot students, the worst-case setup is roughly:

- 18 student invitations;
- 18 program enrollments;
- 18 instructor assignments;
- plus the instructor/admin setup that already exists.

That is repetitive, but it remains a bounded one-time onboarding task rather than a blocker to launch.

For the current pilot maximum of 30 students, the workload grows, but it is still within the range where we should first validate the guided single-user path with a real school before introducing import parsing, bulk validation, partial-failure recovery, duplicate handling, row-level error reporting, and bulk assignment semantics.

## Why bulk is not being built now

Building bulk onboarding before the real-world test would add meaningful risk:

- CSV schema and validation rules;
- duplicate-account and existing-invitation reconciliation;
- partial-success handling;
- enrollment/program mapping;
- instructor-assignment mapping;
- school-scoped authorization;
- retry/recovery behavior;
- additional audit and regression coverage.

Those are operationally important only if the normal path proves too slow or error-prone in practice.

Gate 5's immediate goal is repeatable, self-service onboarding — not maximum throughput.

## Reopen criteria

Reopen G5-E and authorize bulk tooling only if a real onboarding test shows one or more of these conditions:

1. A school cannot complete setup without ASCYN PRO staff performing repetitive data entry.
2. A typical school with 20–30 learners cannot complete roster onboarding in one normal administrative session.
3. Repetitive entry creates material duplicate, enrollment, or assignment errors.
4. The school explicitly provides an existing roster file and manual transcription becomes the dominant setup burden.
5. The Aaron Valles test or fresh-school test identifies bulk roster handling as a launch blocker rather than a convenience request.

## If reopened

Build the smallest justified capability first.

Preferred order:

1. CSV roster import with validation + preview, using existing invite/create-user mutations.
2. Bulk invitation dispatch only after validated roster preview.
3. Bulk enrollment into one selected active program.
4. Bulk instructor assignment only if the school has a repeated assignment pattern.

Do not introduce new account, enrollment, or assignment data models.

## Gate result

G5-E is **GREEN / DEFERRED BY EVIDENCE**.

No product code is required for this slice.

The next Gate 5 work should focus on recovery UX and real-world onboarding validation, where actual friction can determine whether this decision needs to be revisited.
