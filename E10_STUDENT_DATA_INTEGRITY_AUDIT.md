# E10 — Student Data Integrity Audit

## Scope

This audit verifies that student attendance, hour logs, approval state, schedule linkage, and official totals remain internally consistent across ASCYN PRO.

## Production database checks

Checked the live ASCYN PRO Supabase project on 2026-09-26.

All audited anomaly counts were zero:

- duplicate attendance rows for the same school/student/date: 0
- invalid approval provenance (approved without reviewer/time, or pending with reviewer/time): 0
- attendance-generated hour mismatches against source attendance: 0
- multiple active pending/approved rows for one attendance source: 0
- simultaneous approved + pending rows for one attendance source: 0
- zero/negative hour minutes: 0
- hour-log/profile school mismatches: 0
- attendance/profile school mismatches: 0
- overlapping active student schedule profiles: 0
- invalid resubmission links: 0
- attendance-generated rows without source attendance: 0
- manual rows incorrectly carrying attendance source IDs: 0

## Code-path invariants

- Student official totals count approved rows only.
- Pending rows stay separate from official totals.
- Single and bulk admin review are school-scoped and pending-only.
- Reviewed rows retain reviewer/time provenance.
- Attendance-generated hour rows must match source attendance school, student, date, and minutes.
- Only one active pending/approved hour row may exist per attendance source.
- Rejected rows remain historical evidence and corrected submissions link back to the rejected revision.
- Period totals exclude pending and rejected revisions.

## Audit observation

The live data is currently clean. The remaining structural risk is that several UI/reporting surfaces independently calculate approved totals. E10 should keep certifying that every surface uses the same approved-only rule so later feature work cannot silently create drift.

## Status

E10 baseline audit started and production data is GREEN. CI certification is added on branch `e10-student-data-integrity-audit`.
