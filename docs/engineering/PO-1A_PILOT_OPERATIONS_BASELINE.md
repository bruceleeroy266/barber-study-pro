# PO-1A — Pilot Operations Baseline Audit

**Workstream:** PO-1 — Pilot Operations Hardening  
**Baseline:** production `main` at `498545ff388ce5049b2a5fd0a2098f6142bfd088`  
**Status:** In progress  
**Rule:** Audit first. Do not add overlapping pilot systems until current capabilities and gaps are proven.

## Why this is next

The curriculum, TLS, H&A, user-management hardening, Production Communications, and Chapter 2 provenance workstreams have current production certification. The next operational risk is not another chapter change; it is whether a real pilot school can be onboarded, observed, supported, and evaluated without manual guesswork.

Existing production code already contains:
- invite-based first-login onboarding,
- a production beta/pilot checklist,
- instructor-visible Last Login,
- a distinct Last Learning Activity signal,
- student progress and assessment data,
- production communications.

PO-1 therefore starts by proving the current pilot contract instead of duplicating those systems.

## PO-1A audit contract

Audit current production behavior for:

1. **Account onboarding**
   - school-admin invite
   - instructor invite
   - student invite
   - password activation
   - role/school assignment
   - first successful login

2. **Pilot access boundaries**
   - student sees only permitted learning/test surfaces
   - instructor sees only assigned/school-scoped students
   - school-admin visibility remains tenant-scoped
   - admin oversight does not bypass data-isolation rules in user-facing runtime

3. **Student activity visibility**
   - Last Login remains distinct from Last Learning Activity
   - identify whether session/time-spent tracking exists
   - identify whether attempt duration is persisted
   - identify whether instructors/admins can distinguish login from actual learning work

4. **Exam/pilot measurement**
   - assessment scores and attempts
   - weak-area / readiness signals
   - attempt timestamps
   - exam history
   - determine whether a separate instant-feedback practice mode already exists or is genuinely missing

5. **Operational support**
   - pilot checklist completion
   - issue/feedback capture
   - production error visibility
   - communications path
   - 30/60/90-day measurement inputs

## Non-goals for PO-1A

- No curriculum edits.
- No grading or mastery formula changes.
- No Communications changes.
- No H&A changes.
- No Chapter 2 provenance changes.
- No database migration until a concrete missing requirement is proven.
- No new “time spent” metric that can be confused with attendance hours.
- No duplicate login tracking if the existing Auth signal is sufficient.

## Required outputs

PO-1A must end with a current-main evidence matrix marking each pilot requirement:

- **GREEN** — implemented and production-usable.
- **YELLOW** — implemented but incomplete or not visible to the required role.
- **RED** — genuinely missing or unsafe.

Each YELLOW/RED item must include:
- exact existing code/data path,
- exact operational impact,
- smallest safe repair,
- whether a database migration is required,
- regression tests required.

## Decision gate

Do not begin PO-1B implementation until PO-1A proves the gap.

Expected likely follow-on slices, only if evidence supports them:

- **PO-1B:** pilot activity/session observability hardening
- **PO-1C:** exam-only / pilot learning-surface controls
- **PO-1D:** separate instant-feedback practice mode
- **PO-1E:** pilot metrics + 30/60/90 reporting
- **PO-1F:** final end-to-end pilot certification

## Freeze boundaries

The following remain frozen unless PO-1A finds a real regression:
- Production Communications
- CH2-PROV
- TLS certified core
- H&A certified runtime
- Chapters 1–21 certified learning architecture
