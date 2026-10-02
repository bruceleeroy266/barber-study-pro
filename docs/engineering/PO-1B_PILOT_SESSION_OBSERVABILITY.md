# PO-1B — Pilot Activity / Session Observability Hardening

**Workstream:** PO-1 — Pilot Operations Hardening  
**Base:** verified production `main` at `f8a88d9829337986f8bd5bd1d2d51419977212cf`  
**Status:** CONTRACT LOCKED — no migration written yet

## Goal

Add trustworthy study-session and quiz-attempt duration observability for pilot operations without changing attendance hours, grading, mastery, curriculum, or communications.

## Contract principles

1. **Study telemetry is observational only.** It may explain engagement, but it never grants attendance credit, changes a grade, changes mastery, unlocks content, or changes readiness math.
2. **Presence is not learning.** Login, page-open, or an authenticated browser session does not by itself count as study time.
3. **Server time wins.** Persisted session boundaries and durations are derived from server-received timestamps; client clocks are never authoritative.
4. **No double counting.** Concurrent tabs/devices may generate events, but only one active-counting interval per student may contribute to aggregate study duration at a time.
5. **Fail closed for duration.** When evidence is ambiguous, omit/count less time rather than manufacture study time.
6. **Keep the existing learning-recency signal.** `student_progress.last_studied_at` remains the canonical “when did meaningful learning last occur?” signal and must not be replaced by session telemetry.

## 1. What counts as study time

A study session is an authenticated student interaction window containing at least one **meaningful learning event**.

Qualifying learning events:
- lesson interaction that already advances the canonical learning-activity signal,
- flashcard review interaction,
- quiz start and answer/submit interaction,
- remediation review interaction,
- reassessment interaction,
- other future learning surfaces only after explicit registration in the telemetry allowlist.

Non-qualifying events:
- login,
- dashboard open,
- navigation alone,
- passive page load,
- instructor/admin browsing,
- messaging,
- attendance/hours pages,
- leaving a tab open without interaction,
- background browser activity.

### Session opening rule

A session record may be created when the student enters a registered learning surface, but **counted study seconds remain zero until the first qualifying learning event is received**.

The first qualifying event sets `active_started_at`.

This preserves the distinction:
- Login = account access.
- `last_studied_at` = meaningful learning recency.
- PO-1B duration = bounded active-learning time.

## 2. Active interval / heartbeat contract

Once a qualifying event occurs, the client may send a lightweight activity heartbeat while the registered learning surface remains active.

Heartbeat requirements:
- only from authenticated student learning surfaces,
- no more often than once every 60 seconds,
- sent only when the document is visible and the user has produced qualifying interaction within the active window,
- server validates student identity, surface type, and session ownership,
- server timestamps receipt.

### Idle timeout

**Locked idle timeout: 5 minutes.**

If no qualifying interaction/valid heartbeat reaches the server for 5 minutes:
- the active interval ends at the last valid activity timestamp plus at most 5 minutes,
- no further time accrues until another qualifying learning event arrives,
- a new active interval may begin inside the same logical session or a new session may be created according to implementation simplicity.

Reason:
- short enough to avoid counting a forgotten tab,
- long enough not to punish normal reading/thinking between interactions,
- conservative for pilot analytics.

## 3. Abandoned sessions

A session is considered abandoned when:
- browser/tab closes without an explicit end event,
- device loses connectivity and never resumes,
- session/auth expires,
- no valid activity is received beyond the idle timeout.

Abandoned-session rule:
- never use `now - started_at`,
- count only server-bounded active intervals,
- cap the final interval at the idle timeout,
- mark closure reason as `idle_timeout`, `explicit_end`, `auth_end`, or `recovered_abandonment` where implementation supports it.

An abandoned session is valid telemetry if it contains qualifying activity, but its unobserved tail never counts.

## 4. Duplicate tabs / devices

### Counting invariant

For one student, aggregate study duration must never count overlapping active intervals twice.

Locked behavior:
- multiple tabs/devices may hold telemetry session identifiers,
- the server treats the student as having a single active-counting lease,
- the most recent valid qualifying activity may renew/claim that lease,
- overlapping intervals are de-duplicated during persistence or aggregation,
- a second tab cannot make 10 real minutes appear as 20 minutes.

### Implementation preference

Prefer a server-side lease/interval model over client coordination such as `localStorage` or BroadcastChannel. Client coordination may reduce noise but cannot be the security/integrity boundary.

## 5. Timestamp authority

Authoritative:
- database/server `created_at`,
- server-received activity timestamps,
- server-derived interval start/end,
- server-derived duration.

Advisory only:
- client event time,
- browser performance timer,
- client timezone,
- client “elapsed seconds”.

Client timestamps may be stored only for diagnostics and must never determine billable/official/counting duration.

## 6. Quiz-duration linkage

### Existing reality

`QuizClient.tsx` already writes:
- user,
- quiz,
- score,
- total questions,
- percentage,
- answers,
- `completed_at`.

Approved quiz-access flow may also emit `quiz_access_events` with `started` and `completed`, but that flow is approval-specific and is not a universal study-duration contract.

### Locked design

Do **not** change grade semantics.

PO-1B will link quiz telemetry through the study-session/activity layer using:
- `surface_type = 'quiz'`,
- `surface_id = quiz.id`,
- optional `quiz_attempt_id` populated when the persisted attempt ID becomes known.

Quiz duration means:
> de-duplicated active seconds attributable to that quiz interaction window.

It does **not** mean:
- wall-clock time from page open,
- attendance time,
- a grading input,
- proof of effort quality.

### Attempt association

At quiz submission:
- the persisted `quiz_attempt.id` may be attached to the relevant telemetry session/event chain,
- prior telemetry is append-only / linkage-only; the quiz result itself is not rewritten,
- a retry creates a distinct attempt linkage.

## 7. Role visibility

### Student
May read:
- own session summaries,
- own quiz-duration summaries.

May not:
- read another student’s telemetry,
- set authoritative durations,
- write school/user IDs for another identity.

### Instructor
May read:
- telemetry for students in the instructor’s authorized school/roster scope.

May not:
- edit student telemetry,
- convert study duration into attendance hours.

### School admin
May read:
- telemetry for students belonging to the same school.

May not:
- edit telemetry,
- convert telemetry into official hours.

### Platform admin
May read:
- telemetry across schools for support/audit purposes.

Admin reads must remain explicit privileged server-side behavior.

### RLS rule

School membership is derived from authoritative profile/relationship data, never trusted from client-supplied `school_id`.

## 8. H&A separation — locked firewall

PO-1B has **zero write path** to:
- `hour_logs`,
- `effective_hour_logs`,
- attendance records,
- attendance corrections,
- hour adjustments,
- official approved-minute functions.

Telemetry tables/functions must not:
- contain triggers that insert/update H&A tables,
- be selected by official-hour aggregation functions,
- reuse `effective_minutes` terminology,
- expose an “approve as hours” action.

Naming rule:
- use `active_seconds`, `study_seconds`, or equivalent telemetry language.
- never call telemetry values “hours earned”, “clocked hours”, “attendance minutes”, or “approved minutes”.

## 9. Proposed logical data model — contract only

No migration is authorized yet, but implementation should target these concepts:

### study_sessions
- id
- user_id
- school_id derived/validated server-side
- surface_type
- surface_id nullable
- opened_at server timestamp
- first_active_at nullable
- last_active_at nullable
- ended_at nullable
- active_seconds default 0
- end_reason nullable
- created_at / updated_at

### study_activity_events
- id
- session_id
- user_id
- event_type from allowlist
- surface_type
- surface_id nullable
- quiz_attempt_id nullable
- received_at server timestamp
- client_event_at nullable diagnostic only
- metadata minimal JSON if needed

Alternative:
- if an interval-only model can meet all invariants with less complexity, implementation may collapse these tables, but the behavioral contract above cannot change.

## 10. Retention / aggregation contract

Raw event telemetry should be treated as operational analytics, not academic evidence.

PO-1B implementation should:
- keep raw event payloads minimal,
- avoid storing question text/answers in telemetry,
- derive summaries from timestamps and identifiers already known to the platform,
- make aggregate study duration reproducible from authoritative records.

Any retention policy change is outside this slice unless required by an existing platform privacy contract.

## 11. Required regression tests before schema merge

1. Login alone creates zero counted study seconds.
2. Dashboard browsing creates zero counted study seconds.
3. First qualifying learning event starts counting.
4. Five minutes of idle time ends accrual.
5. Abandoned tab cannot accrue indefinitely.
6. Hidden/background tab cannot keep accruing through heartbeats.
7. Two overlapping tabs cannot double-count.
8. Two devices cannot double-count overlapping intervals.
9. Client clock spoofing cannot inflate duration.
10. Quiz attempt duration links to the correct persisted attempt.
11. Retake links to a distinct attempt.
12. Duration never changes quiz score, percentage, mastery, remediation, or readiness inputs.
13. Student can read only own telemetry.
14. Instructor can read only authorized school/roster telemetry.
15. School admin can read only same-school telemetry.
16. Platform admin privileged read remains server-side.
17. Telemetry writes never touch `hour_logs` / attendance tables.
18. Existing H&A official totals are byte-for-byte/logically unchanged by telemetry records.
19. `last_studied_at` remains independent and continues to represent meaningful learning recency.
20. Invalid/duplicate heartbeat requests fail safely without manufacturing seconds.

## 12. Migration authorization gate

A migration may be written only after the implementation plan demonstrates:

- exact table/function names,
- exact RLS policies,
- exact server endpoint/action used for start/activity/end,
- exact aggregation algorithm for overlap de-duplication,
- exact quiz-attempt linkage path,
- explicit proof no H&A dependency is introduced.

## Locked decision

**PO-1B telemetry contract is LOCKED.**

Approved design:
- meaningful-event-triggered counting,
- 5-minute idle timeout,
- server-authoritative timestamps,
- abandoned-tail truncation,
- overlap de-duplication across tabs/devices,
- quiz duration linked through telemetry rather than grading semantics,
- school-scoped read visibility,
- strict H&A firewall.

No database migration has been written in this step.

## Follow-on work

Remain separately gated:
- PO-1C simulator/runtime oversight discovery,
- PO-1D instant-feedback practice mode,
- PO-1E automated 30/60/90 pilot reporting.
