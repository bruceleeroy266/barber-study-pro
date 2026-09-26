# E11 — Final End-to-End Student Hours & Attendance Certification

## Production baseline
- E10 production deployment is READY on commit `fdcb9a61792a22216696ba6aa76272a992a78cb6`.
- Production aliases include `ascynpro.com` and `www.ascynpro.com`.
- Live ASCYN PRO active Barbering program rows use 1200 required hours.

## E11 repairs
1. Shared application fallback changed from 1500 to 1200 hours.
2. Supabase migration `20260926223803_set_program_required_hours_default_1200` changed the database `programs.required_hours` default to 1200.
3. Compliance defaults now use `DEFAULT_REQUIRED_HOURS` from the shared program-requirements module instead of an independent hard-coded 1500.
4. Legacy tests across program resolution, compliance, school analytics, notifications, and RISE parity were aligned to the 1200-hour contract.
5. E11 certification coverage verifies that application, compliance, and database migration share the same 1200-hour fallback.

## End-to-end certification chain
E11 verifies:
1. student schedule and attendance evidence remain read-only on the student surface
2. instructors submit manual and attendance-generated hours as pending
3. attendance-generated rows retain source attendance provenance
4. school administrators approve or reject pending hours
5. stale/double-review actions remain idempotent
6. approved decisions cannot be silently overwritten by attendance regeneration
7. rejected correction/resubmission history is preserved
8. pending and rejected rows never count toward official totals
9. week/month/year/overall totals use approved rows only
10. student, instructor, and school-admin views resolve the same per-student requirement
11. individual and group PDF exports use approved detail rows and resolved student requirements
12. hour, attendance, and schedule access remains school/tenant scoped
13. unauthenticated hours routes remain protected behind login

## Live production integrity
Final read-only production checks:
- database `programs.required_hours` default: 1200
- active non-1200 program rows: 0
- approved hour rows missing review provenance: 0
- pending rows carrying review provenance: 0
- non-positive hour rows: 0
- prior E11 integrity sweep also returned 0 for school/profile mismatches, generated-source mismatches, manual rows with attendance source IDs, duplicate active attendance-source rows, negative attendance minutes, and overlapping active schedule profiles.

## Verification gates
Engineering Verification #683 on commit `f05e2c7dc11172d6153e157e939e8126cb81ece2` passed:
- TypeScript: GREEN
- lint: GREEN
- unit tests: GREEN
- production build: GREEN
- Bundle Size Check: GREEN
- Pilot Onboarding Certification: GREEN

Vercel preview `dpl_FgrohtyzoRCthMg9iTmP56M2HxBy` reached READY on the same commit with no alias error.

## Merge status
PR #101 remains intentionally unmerged. This certification document and the final source-of-truth test are the last E11 documentation/guardrail changes and must receive one final exact-head Engineering Verification + Vercel Preview before merge authorization.

## Status
E11: YELLOW pending final exact-head gate only. Functional/data certification is otherwise GREEN.
