# NZD-1 — Zero-Data Platform Contract

Status: LOCKED
Scope: ASCYN PRO production analytics, readiness, compliance, risk, alerts, reporting, and instructor/school/student status surfaces.

## Core rule

**No Evidence → No Status.**

Missing evidence is not a measured zero and must not be interpreted as failure, success, risk, readiness, completion, compliance, or pace.

A domain may only emit a result-derived status when the evidence required for that domain exists.

## Required state model

Every measured domain must resolve through these states:

1. **No Data** — no qualifying evidence exists.
2. **Measured Result** — qualifying evidence exists and a metric can be computed.
3. **Result-Derived Status** — a status is derived only from a measured result.

Examples:

- No attendance rows → `No Data`; never `0%`, `Low Attendance`, or `At Risk`.
- No hour evidence/prior credit → `No Data`; never `Missing Hours` or behind-pace status.
- No quiz/progress evidence → `No Data`; never `Readiness 0`, `At Risk`, or remediation escalation.
- No grade evidence → `No Grade`; never `0%`, `Critical`, or `At Risk`.
- No assessment evidence → `No Assessments`; never `0%`, `Missing Assessments`, or failed-assessment status.
- No cross-domain tracking evidence → `Not enough data yet`; never a synthetic tracking score or negative aggregate status.

## Canonical evidence flags

Runtime models that derive performance/compliance state must expose or consume explicit evidence flags where applicable:

- `hasAttendanceEvidence`
- `hasHoursEvidence`
- `hasProgressEvidence`
- `hasReadinessEvidence`
- `hasGradeEvidence`
- `hasAssessmentEvidence`
- `hasTrackingEvidence`

A numeric value of `0` is not evidence by itself.

## Status gating

The following statuses are forbidden when the required domain evidence is absent:

- `Critical`
- `At Risk`
- `Needs Attention`
- `Low Attendance`
- `Low Readiness`
- `Missing Hours`
- `Missing Assessments`
- `Missing Practicals`
- `Graduation Risk`
- `Requirements Remaining`
- `On Track`
- `Ready`
- `Nearly Ready`

Neutral empty-state language is allowed: `No Data`, `No Grade`, `No Assessments`, `No activity yet`, `Not enough data yet`.

## Evidence definitions

- Attendance: at least one persisted attendance record for the learner.
- Hours: at least one persisted hour log or accepted prior/transfer credit greater than zero.
- Progress: at least one meaningful persisted learning-progress signal (progress > 0, completed lesson/flashcards/knowledge check/quiz) or qualifying quiz attempt.
- Readiness: canonical readiness evidence as defined by the learning metrics resolver.
- Grade: at least one non-excused grade.
- Assessment: at least one persisted assessment record.
- Tracking: any of attendance, hours, readiness/progress, grade, or assessment evidence.

## Aggregate rule

School/class aggregates must exclude no-evidence learners from metric denominators and negative-status counts. If the aggregate has no qualifying evidence rows, render a no-data state rather than `0`, `0%`, `Critical`, `At Risk`, `Needs Attention`, or `On Track`.

## Alert rule

Alerts are evidence-triggered, not requirement-default-triggered. A configured requirement alone is not evidence that a learner is behind or missing work.

## Regression requirement

Every repaired surface must include both:

- a zero-evidence test proving no negative/positive status is emitted; and
- a real-evidence test proving legitimate low/failed/behind status still emits.

This contract is platform-wide and applies to all current and future schools.
