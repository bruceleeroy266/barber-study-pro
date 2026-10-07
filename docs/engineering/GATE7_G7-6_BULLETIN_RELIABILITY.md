# G7-6 — Bulletin Reliability Hardening

## Product Boundary
> **Product-boundary check:** PASS — this Gate complies with `docs/engineering/ASCYN_PRODUCT_BOUNDARY_CONTRACT.md` and is classified as **COEXIST**. No DO NOT BUILD capability is introduced.

**Guarded integration zone contact:** NONE. G7-6 changes bulletin reliability only and does not touch H&A, onboarding/roster, or Admin Reporting.

## Goal
Make bulletin publication exactly-once, transactional, audience-authorized, and deterministic around publish/expiration time.

## Publish reliability
Publication now occurs in one SECURITY INVOKER PostgreSQL function:
1. validate actor eligibility and inputs;
2. compute canonical audience payload + request fingerprint;
3. reserve one author/operation identity;
4. create the draft;
5. create all audience rows;
6. publish the bulletin;
7. commit all changes together.

Any failure rolls the entire call back. No partial draft/audience/publish state survives.

## Retry identity
- one stable browser UUID represents one unchanged publish intent;
- unique partial index: `(author_id, client_operation_id)`;
- retry with same payload returns the persisted bulletin;
- operation reuse with different content/audiences is rejected;
- editing the draft/audience clears the operation identity;
- confirmed success clears it.

## Audience authorization
The atomic function is SECURITY INVOKER, not SECURITY DEFINER. Existing bulletin/audience RLS remains authoritative:
- instructors: only actively assigned students;
- school admins/admins: valid same-school school/program/student audiences;
- cross-school/injected targets fail the transaction.

## Acknowledgments
Acknowledgment remains append-only and unique on `(bulletin_id, student_id)`. Runtime uses conflict-safe upsert/ignore-duplicates so repeated taps and concurrent retries converge to one row.

## Time authority
Visibility and acknowledgment eligibility continue to use PostgreSQL `now()` in RLS:
- visible when publish_at is null or <= server time;
- expired when expires_at <= server time;
- client clock cannot make a bulletin early-visible or extend its acknowledgment window.

## Actor eligibility
Bulletin actions require approved, non-disabled profiles in their current school.

## Non-goals
No Realtime, replies, comments, reactions, SMS/email delivery, permission expansion, or Gate 8 UI redesign.

## Exit criteria
G7-6 is GREEN only after full exact-head CI, disposable-Supabase certification, exact-head Vercel READY, live migration apply, live function/index/grant/security verification, merge, and exact production READY.
