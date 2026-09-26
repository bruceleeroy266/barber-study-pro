# Segment D1 — Admin Approval Audit

Scope: current Student Hours approval queue, official-total updates, and rejection flow.

## Current approval queue

Status: GREEN with usability gaps.

- The school-admin queue is populated only from `hour_logs` rows whose status is `pending`.
- Rows are school-scoped and loaded only for students in the administrator's school.
- Queue order inherits the existing query order: newest date first, then newest creation time.
- Each row shows student, date, category, minutes, source badge, submitter, notes, Approve, and Reject.
- Reject requires a reason in both the form and server action.
- Approval/rejection writes are race-safe and idempotent because the update is constrained to `status = pending`, and a stale/double action refreshes the current state instead of overwriting it.
- Generated-vs-manual source labels are visible in the queue.

Usability gaps for later hardening:
- No queue filters for student, date, source, or category.
- No compact audit detail showing who approved/rejected an already-reviewed row directly in the queue.

## Official-total updates

Status: GREEN.

- `Accumulated` totals use approved rows only.
- Weekly, monthly, and yearly reporting uses approved rows only.
- Pending rows are tracked separately and do not count toward official totals.
- Rejected rows do not count toward official totals or pending totals.
- Approval revalidates the school hours page, instructor hours page, school dashboard, and the affected instructor/student detail route.
- The current calculation is derived from persisted `hour_logs`, so the official total is recomputed from source rows rather than incremented by an unsafe counter.

## Rejection flow

Status: YELLOW — one important workflow gap.

What works:
- A rejection reason is mandatory.
- The reason is trimmed and limited to 500 characters.
- A rejected entry is stamped with reviewer and review time.
- A stale/double rejection does not overwrite an already-reviewed row.
- Rejected entries are excluded from official totals.

Gap:
- Attendance-generated rows use a unique `source_attendance_id`.
- The automatic generation path intentionally refuses to change any reviewed row, including a rejected row.
- Therefore, once an attendance-generated hour entry is rejected, correcting the underlying attendance and pressing Submit Day again cannot create or refresh a new pending generated entry for that same attendance record.
- The row is effectively terminal unless staff use the separate manual-hours path.

This is safe from an audit/integrity standpoint, but incomplete as a correction workflow. A rejected generated entry should have an explicit resubmission path that preserves the original rejection audit trail instead of silently requiring a new manual entry.

## D1 conclusion

- Approval queue integrity: GREEN
- Official total integrity: GREEN
- Rejection validation/idempotency: GREEN
- Rejected attendance-generated correction/resubmission: YELLOW

Recommended D2 scope: add an explicit rejected-entry correction/resubmission workflow that preserves review history, never mutates an approved record, and cannot double-count official hours.
