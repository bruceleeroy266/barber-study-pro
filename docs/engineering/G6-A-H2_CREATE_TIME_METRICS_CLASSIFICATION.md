# G6-A H2 — Create-Time School Metrics Classification

**Status:** IMPLEMENTED / AWAITING CERTIFICATION  
**Baseline:** `main` at `fc849e3fc190baf174c7a06c3d790df537c0a257`  
**Scope:** Admin User Management Create User + Invite User flows.

## Goal

Allow an authorized admin to decide whether a learner counts toward school/class aggregate metrics at the moment the account is created or invited, so supplemental/cross-program learners never enter the primary cohort baseline by accident.

## Locked behavior

- Applies only to `student` and `apprentice` roles.
- Default remains **Included** for backward compatibility and normal barber enrollment.
- **Included** means the learner contributes to aggregate school/class performance metrics.
- **Excluded** means the learner remains active and individually visible, but is excluded from aggregate metrics under the existing G6-A contract.
- Non-learner roles always resolve to Included, even if a malformed client submits `false`.
- Create User and Invite User both expose the same selection.
- The server, not the browser, is authoritative.
- The selected value is persisted directly to `profiles.include_in_school_metrics` during profile reconciliation.
- The selected value is written to the user-management audit payload.
- Existing post-creation Manage User controls remain available.
- Existing users are not automatically reclassified by this slice.
- No real Elevate learner data is modified by implementation or certification.

## UI copy

School Metrics:
- Included — counts toward school/class performance
- Excluded — individual data stays visible, does not affect aggregates

Helper text explains that Excluded is appropriate for supplemental or cross-program learners such as cosmetology students participating inside a barber pilot school.

## Safety rules

- Omitted field => Included.
- Non-learner role => Included.
- No account disabling is used to implement metrics exclusion.
- No learner is hidden from individual records/workflows.
- G6-A H1 aggregate filtering and database hardening remain unchanged.

## Certification

G6-A H2 is GREEN only when:
1. Create User submits and persists the selected learner metrics status.
2. Invite User submits and persists the selected learner metrics status.
3. Both forms default to Included.
4. Both forms show the field only for learner roles.
5. Server-side role clamping prevents non-learners from being excluded.
6. Audit payloads record the selected status.
7. Existing G6-A/H1 and onboarding tests pass.
8. Engineering Verification and Vercel pass on the exact unchanged PR head.
9. After merge, exact production deployment reaches READY.
