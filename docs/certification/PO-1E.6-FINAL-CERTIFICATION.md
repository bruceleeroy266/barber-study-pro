# PO-1E.6 — Final Certification

**Workstream:** Gate 6 Automated Pilot Measurement  
**Candidate baseline:** `d26816c8a1f11740597a87661f40b164f0016c9a`  
**Certification branch:** `po-1e6/final-certification`

## Certification result

PO-1E.6 is eligible for GREEN only after the exact certification head passes Engineering Verification, Vercel preview reaches READY, the database hardening migration is applied, and the merged production commit reaches READY.

## Adversarial finding repaired

The initial instructor view was assignment-scoped for live metrics but also selected official school-wide finalized checkpoint rows. That could expose aggregate counts for learners outside the instructor's assignments.

The certification repair:
- removes direct instructor reads of `pilot_measurement_checkpoints`;
- keeps the instructor measurement surface limited to assigned learners;
- changes checkpoint RLS from same-school staff to same-school administrators;
- preserves platform-admin checkpoint audit access;
- preserves school-admin official checkpoint/report access.

## Contract matrix

1. Explicit/auditable pilot period — PASS
2. Deterministic Baseline/30/60/90 target dates — PASS
3. Finalized checkpoint immutability — PASS
4. `include_in_school_metrics=false` excluded from aggregates — PASS
5. Excluded learners remain individually visible — PASS
6. Instructor aggregation assignment/scope safe — REPAIRED / TESTED
7. School-admin same-school scope — PASS
8. Platform-admin audit path — PASS
9. Trusted activity telemetry remains separate from H&A — PASS
10. Exam Ready uses student-safe result fields — PASS
11. No answer-key/unscored correctness leakage — PASS
12. Canonical readiness resolver reused — PASS
13. Report generation does not mutate learning evidence — PASS
14. Partial coverage explicit — PASS
15. No-evidence does not become false zero — PASS
16. Baseline/prior deltas are null-safe and unit-correct — PASS
17. Cross-school access fails closed — PASS
18. Finalized membership/cutoff persisted — PASS
19. TypeScript — CI REQUIRED
20. Changed-file lint — CI REQUIRED
21. Unit/regression tests — CI REQUIRED
22. Production build — CI REQUIRED
23. Pilot Onboarding Certification — CI REQUIRED
24. Exact-head Vercel preview — REQUIRED
25. Production main + Vercel verification after merge — REQUIRED

## Supabase live-state evidence

Before this certification slice, production already contained:
- `pilot_measurement_periods`;
- `pilot_measurement_checkpoints`;
- one-active-period unique index;
- one-finalized-checkpoint-per-type unique index;
- finalized checkpoint immutability trigger/RPC architecture.

Supabase advisor warnings for the PO-1E mutation RPCs are expected generic warnings for authenticated `SECURITY DEFINER` functions. Each official PO-1E mutation function performs an internal `is_platform_admin()` authorization check and ordinary authenticated table writes remain revoked.
