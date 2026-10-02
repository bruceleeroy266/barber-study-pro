# PO-1B — Pilot Activity / Session Observability Hardening

**Workstream:** PO-1 — Pilot Operations Hardening  
**Base:** verified production `main` at `f8a88d9829337986f8bd5bd1d2d51419977212cf`  
**Status:** AUTHORIZED / STARTED

## Goal

Add trustworthy study-session and quiz-attempt duration observability for pilot operations without changing attendance hours, grading, mastery, curriculum, or communications.

## Hard boundaries

PO-1B MAY:
- add a minimal study-session / activity-event contract,
- record server-authoritative session start/end where practical,
- distinguish active study from login-only presence,
- link quiz attempt start/end or duration to persisted attempts,
- expose school-scoped instructor/admin read visibility,
- add tenant-safe RLS and regression coverage.

PO-1B MUST NOT:
- write to H&A attendance-hour totals,
- infer attendance from study duration,
- alter grading/mastery percentages,
- modify chapter content,
- modify Production Communications,
- implement instant-feedback practice mode,
- implement 30/60/90 reporting,
- weaken existing tenant isolation.

## Required design decisions before schema write

1. Define what counts as a study session.
2. Define idle timeout / abandoned-session behavior.
3. Decide whether quiz duration belongs in:
   - a dedicated activity/session table,
   - attempt-specific columns,
   - or a linked event table.
4. Define server vs client timestamp authority.
5. Define duplicate-tab / duplicate-session behavior.
6. Define visibility for instructor, school_admin, and platform admin.
7. Prove H&A separation in code and tests.

## Certification requirements

Before merge:
- migration/schema contract reviewed,
- RLS tenant isolation tested,
- login-only activity does not count as study time,
- inactive/abandoned sessions handled predictably,
- duplicate session behavior tested,
- quiz duration cannot alter grades/mastery,
- H&A totals remain unchanged,
- Engineering Verification GREEN,
- Vercel GREEN.

## Follow-on work

PO-1C / PO-1D / PO-1E remain separately gated:
- simulator/runtime oversight discovery,
- instant-feedback practice mode,
- 30/60/90 pilot reporting.
