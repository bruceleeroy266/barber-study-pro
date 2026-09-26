# E11 — Final End-to-End Student Hours & Attendance Certification

## Production baseline
- E10 production deployment is READY on commit fdcb9a61792a22216696ba6aa76272a992a78cb6.
- Production aliases include ascynpro.com and www.ascynpro.com.
- Live ASCYN PRO program rows currently use 1200 required hours.
- Live hour-log provenance check is clean: approved rows have review provenance and pending rows do not carry review provenance.

## Certification chain
E11 certifies:
1. student schedule/attendance evidence
2. instructor attendance/manual hour submission
3. attendance-generated pending hours
4. school-admin approve/reject
5. stale/double-review safety
6. rejected correction/resubmission history
7. approved-only week/month/year/overall totals
8. student, instructor, and school-admin consistency
9. individual and group PDF exports
10. per-student required-hour calculation
11. school/tenant isolation
12. production regression after merge

## Defect found at E11 baseline
The shared program-requirements fallback was still 1500 hours while the staff hours surface used a 1200-hour fallback. This could cause student/staff disagreement if no configured program resolved.

Repair started on this branch:
- shared fallback changed to 1200
- E11 certification coverage added

## Remaining schema risk
The historical programs-table schema default is still 1500 in the original migration. Current production program rows are 1200, so live data is not presently inconsistent. Before final E11 certification, the future-row database default must be reconciled through a proper migration so a newly created program cannot silently default back to 1500.

## Status
E11 baseline: YELLOW — application fallback repaired and certification coverage added; schema-default reconciliation and full Quality Gate remain.
