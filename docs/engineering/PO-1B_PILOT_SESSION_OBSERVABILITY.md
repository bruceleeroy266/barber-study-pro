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


# PO-1B Exact Migration / Schema Plan

**Planning state:** LOCKED FOR IMPLEMENTATION DESIGN ONLY.  
**Migration state:** NOT WRITTEN / NOT APPLIED.

## Existing system discovered and disposition

Current production already contains:

- `public.study_activity_days`
- `public.record_study_activity(integer, text)`
- `src/components/StudyActivityTracker.tsx`
- global learner-dashboard mounting in `src/app/(dashboard)/layout.tsx`
- multi-tab de-duplication hardening in `20260922064500_harden_study_activity_tracking.sql`

This existing system is useful as a **daily aggregate**, but it is not sufficient as the PO-1B source of truth because the client tracker is mounted across the entire learner dashboard and treats generic pointer/keyboard/scroll/touch activity as study activity.

### Locked disposition

1. **Keep `study_activity_days`** as a backward-compatible daily rollup/read model.
2. **Stop using generic dashboard activity as authoritative study input.**
3. **Introduce session/event source-of-truth tables.**
4. **New server functions update both source records and the existing daily rollup atomically.**
5. **Deprecate direct client use of `record_study_activity(integer,text)` after the new path is wired.**
6. Do not delete the legacy aggregate table in PO-1B.

---

## 1. Exact new tables

### A. `public.study_sessions`

Purpose: one logical learning-surface session.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `school_id uuid not null references public.schools(id) on delete cascade`
- `surface_type text not null`
- `surface_id text null`
- `opened_at timestamptz not null default clock_timestamp()`
- `first_active_at timestamptz null`
- `last_active_at timestamptz null`
- `last_credited_at timestamptz null`
- `ended_at timestamptz null`
- `active_seconds integer not null default 0 check (active_seconds >= 0)`
- `end_reason text null`
- `quiz_attempt_id uuid null references public.quiz_attempts(id) on delete set null`
- `created_at timestamptz not null default clock_timestamp()`
- `updated_at timestamptz not null default clock_timestamp()`

Checks:

- `surface_type in ('lesson','flashcards','quiz','remediation','reassessment')`
- `end_reason is null or end_reason in ('explicit_end','idle_timeout','auth_end','recovered_abandonment')`
- `ended_at is null or ended_at >= opened_at`
- `first_active_at is null or first_active_at >= opened_at`
- `last_active_at is null or first_active_at is not null`
- `quiz_attempt_id is null or surface_type = 'quiz'`

No client-supplied `school_id` is accepted by any RPC; it is derived from the authenticated profile.

### B. `public.study_session_events`

Purpose: append-only operational evidence for session activity and quiz linkage.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `session_id uuid not null references public.study_sessions(id) on delete cascade`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `school_id uuid not null references public.schools(id) on delete cascade`
- `event_type text not null`
- `surface_type text not null`
- `surface_id text null`
- `quiz_attempt_id uuid null references public.quiz_attempts(id) on delete set null`
- `received_at timestamptz not null default clock_timestamp()`
- `client_event_at timestamptz null`
- `credited_seconds integer not null default 0 check (credited_seconds between 0 and 300)`
- `metadata jsonb not null default '{}'::jsonb`

Checks:

- `event_type in ('qualifying_activity','heartbeat','explicit_end','quiz_attempt_linked')`
- same `surface_type` allowlist as `study_sessions`
- `jsonb_typeof(metadata) = 'object'`

Telemetry metadata must never contain quiz answers, question text, grades, attendance minutes, or message content.

---

## 2. Existing `study_activity_days` role

`study_activity_days` remains:

- daily aggregate by student/date,
- used for historical compatibility,
- read-only to ordinary clients through RLS.

Its `active_seconds` will be incremented only by the new authoritative server function after overlap de-duplication.

The old `record_study_activity(integer,text)` RPC will be **deprecated from application use**.

Implementation migration should:

- revoke authenticated execute on legacy `record_study_activity(integer,text)` only after the new runtime is switched,
- retain service-role/postgres access temporarily for rollback compatibility if required,
- add a comment marking it deprecated,
- never let both old and new client paths run simultaneously in production.

---

## 3. Exact indexes

### `study_sessions`

- `idx_study_sessions_user_opened on (user_id, opened_at desc)`
- `idx_study_sessions_school_user_opened on (school_id, user_id, opened_at desc)`
- `idx_study_sessions_active_user on (user_id, last_active_at desc) where ended_at is null`
- `idx_study_sessions_quiz_attempt on (quiz_attempt_id) where quiz_attempt_id is not null`
- `idx_study_sessions_surface on (user_id, surface_type, surface_id, opened_at desc)`

### `study_session_events`

- `idx_study_session_events_session_received on (session_id, received_at)`
- `idx_study_session_events_user_received on (user_id, received_at desc)`
- `idx_study_session_events_school_received on (school_id, received_at desc)`
- `idx_study_session_events_quiz_attempt on (quiz_attempt_id) where quiz_attempt_id is not null`

No index references H&A tables.

---

## 4. Exact RLS plan

Enable RLS on both new tables.

### `study_sessions` SELECT

Student:
- `auth.uid() = user_id`

Instructor:
- current role = `instructor`
- current user's school = row `school_id`
- row student must still belong to that school
- if the existing instructor-assignment model is available for this page, application queries additionally restrict to authorized roster; database minimum remains same-school.

School admin:
- current role = `school_admin`
- `current_user_school_id() = school_id`

Platform admin:
- `is_platform_admin()`

### `study_session_events` SELECT

Same visibility rules as parent session.

### Direct INSERT / UPDATE / DELETE

For authenticated clients:

- **no direct INSERT**
- **no direct UPDATE**
- **no direct DELETE**

All mutation occurs through narrowly granted security-definer RPCs.

Grants:

- authenticated: SELECT subject to RLS
- authenticated: EXECUTE only on approved telemetry RPCs
- service_role: operational access
- no anon access

---

## 5. Exact server/database functions

### A. `public.begin_study_session(p_surface_type text, p_surface_id text default null)`

Returns: `uuid` session ID.

Behavior:

1. require `auth.uid()`.
2. resolve profile from authoritative `profiles`.
3. require learner role (`student` or `apprentice`) and non-null school.
4. validate surface allowlist.
5. create `study_sessions` row with server timestamp.
6. active time remains zero.
7. no `study_activity_days` increment.
8. return new session ID.

Security:
- SECURITY DEFINER
- fixed `search_path = public, pg_temp`
- revoke PUBLIC/anon
- grant authenticated

### B. `public.record_learning_activity(
  p_session_id uuid,
  p_event_type text,
  p_client_event_at timestamptz default null
)`

Returns structured result:
- `credited_seconds integer`
- `active_seconds integer`
- `last_active_at timestamptz`

Accepted event types:
- `qualifying_activity`
- `heartbeat`

Behavior under per-user advisory transaction lock:

1. authenticate caller.
2. load session; require `session.user_id = auth.uid()`.
3. require session not explicitly ended.
4. re-derive current profile school and ensure it equals session school.
5. take advisory lock keyed by user ID.
6. set `v_now = clock_timestamp()`.
7. find global `max(last_credited_at)` across the user's sessions.
8. first-ever qualifying activity:
   - set `first_active_at = v_now`
   - set `last_active_at = v_now`
   - set `last_credited_at = v_now`
   - credit 0 seconds.
9. subsequent accepted activity:
   - `elapsed = floor(v_now - global_last_credited_at)`
   - `credited = greatest(0, least(elapsed, 300))`
   - if elapsed > 300, the excess is discarded as idle/abandoned time.
10. update the target session:
   - add `credited` to `active_seconds`
   - `last_active_at = v_now`
   - `last_credited_at = v_now`
11. append event with `credited_seconds`.
12. atomically add `credited` to `study_activity_days` for the user's timezone/date.
13. return credit/result.

Critical rule:
- `p_client_event_at` may be stored diagnostically but is never used in the credit calculation.

### C. `public.end_study_session(p_session_id uuid, p_reason text default 'explicit_end')`

Behavior:

1. authenticate owner.
2. accept only `explicit_end` from ordinary client calls.
3. set `ended_at = clock_timestamp()`.
4. set `end_reason`.
5. append zero-credit end event.
6. idempotent: repeated end calls do not add time.

Idle timeout is normally represented implicitly by the 300-second cap; a maintenance/recovery process may later mark stale rows `idle_timeout`, but PO-1B does not require a cron job to count duration correctly.

### D. `public.link_study_quiz_attempt(p_session_id uuid, p_quiz_attempt_id uuid)`

Behavior:

1. authenticate owner.
2. require session belongs to caller.
3. require session `surface_type = 'quiz'`.
4. load `quiz_attempts` row.
5. require attempt `user_id = auth.uid()`.
6. require session `surface_id = quiz_attempt.quiz_id`.
7. refuse relinking a session to a different attempt.
8. set `study_sessions.quiz_attempt_id`.
9. append `quiz_attempt_linked` event.
10. never update score, percentage, answers, mastery, readiness, or remediation state.

---

## 6. Application endpoint / action plan

Use server route handlers rather than direct browser table writes.

Exact proposed routes:

- `POST /api/study-sessions/start`
- `POST /api/study-sessions/activity`
- `POST /api/study-sessions/end`
- `POST /api/study-sessions/link-quiz-attempt`

Each route:

- obtains authenticated Supabase server client,
- performs no service-role bypass for ordinary student writes,
- calls the corresponding RPC,
- validates input with strict allowlists,
- returns minimal JSON,
- rate-limits/rejects malformed duplicate spam at application level where practical,
- relies on RPC/database invariants as the authority.

No endpoint accepts arbitrary `user_id` or `school_id`.

### Client architecture

Remove the global authoritative role of `StudyActivityTracker` from the learner dashboard layout.

Replace with a scoped hook/component, proposed:

- `src/lib/study-telemetry/surfaces.ts`
- `src/hooks/useStudySession.ts`

Only registered learning surfaces invoke it.

Registered initial surfaces:
- lesson shell,
- flashcard client,
- quiz client,
- remediation/reassessment runtime.

Generic dashboard, messages, hours, attendance, settings, and navigation do not mount a counting tracker.

---

## 7. Overlap de-duplication algorithm

### Database invariant

A student has one global elapsed-time budget regardless of tabs/devices.

Algorithm:

1. acquire `pg_advisory_xact_lock` scoped to authenticated user.
2. capture `clock_timestamp()` after acquiring lock.
3. query the greatest `last_credited_at` across that user's session rows.
4. calculate elapsed seconds since that globally newest credit boundary.
5. cap credit at 300 seconds.
6. apply that credit to only the session that supplied the accepted event.
7. persist event and rollup in the same transaction.

Consequences:

- tab A and tab B heartbeats arriving together serialize;
- first receives available elapsed budget;
- second sees near-zero elapsed and receives zero/negligible credit;
- different devices behave identically;
- midnight/timezone changes do not create a second elapsed budget;
- client-supplied requested seconds cannot inflate duration because the new RPC does not accept a seconds parameter.

This supersedes the old client-supplied `p_seconds` model.

---

## 8. Quiz-attempt linkage runtime

### Quiz start

When `QuizClient` starts:
- create/open a study session with:
  - `surface_type='quiz'`
  - `surface_id=quiz.id`
- qualifying answer interactions call activity endpoint.

### During quiz

Accepted learning events:
- first answer selection/submit action,
- subsequent answer submissions,
- heartbeat only while visible and inside the five-minute active window.

Do not reveal correctness; PO-1D remains separate.

### Quiz completion

Current quiz save order remains:

1. insert `quiz_attempts`;
2. receive persisted attempt ID;
3. call `link_study_quiz_attempt(sessionId, persistedAttemptId)`;
4. end telemetry session;
5. continue existing progress/remediation behavior.

Telemetry-link failure:
- logs visibly/operationally,
- does not invalidate the saved quiz result,
- does not retry by rewriting the attempt.

Retake:
- new telemetry session,
- new `quiz_attempt`,
- unique linkage.

---

## 9. Daily rollup rules

Existing `study_activity_days` is updated only with **credited seconds** from the new authoritative RPC.

Timezone handling:
- retain valid IANA timezone for the daily bucket if needed for student-facing day grouping,
- timezone affects date bucketing only,
- timezone never affects elapsed duration.

If timezone is invalid:
- fall back to UTC for bucketing,
- do not reject otherwise valid learning telemetry.

---

## 10. H&A non-interference proof plan

Migration tests must assert the PO-1B migration contains no:

- `insert into public.hour_logs`
- `update public.hour_logs`
- `effective_hour_logs`
- `attendance_records`
- `attendance_corrections`
- `hour_adjustments`
- calls to approved-hour mutation functions.

Application tests must assert telemetry modules do not import hours/attendance mutation modules.

Existing H&A tests run unchanged as regression gates.

Telemetry field naming remains `active_seconds`; no official-hour terminology.

---

## 11. Implementation file plan

Migration, when authorized:
- `supabase/migrations/<timestamp>_po1b_session_observability.sql`

Database tests:
- `src/__tests__/migrations/po1b-session-observability.test.ts`

Runtime:
- `src/app/api/study-sessions/start/route.ts`
- `src/app/api/study-sessions/activity/route.ts`
- `src/app/api/study-sessions/end/route.ts`
- `src/app/api/study-sessions/link-quiz-attempt/route.ts`
- `src/hooks/useStudySession.ts`
- `src/lib/study-telemetry/surfaces.ts`

Integration changes:
- remove/global-disable `StudyActivityTracker` from `src/app/(dashboard)/layout.tsx`
- wire approved learning surfaces only
- wire `QuizClient.tsx` attempt linkage

Instructor/admin read UI is a later PO-1B sub-slice after persistence is certified; schema/RLS supports it from day one.

---

## 12. Migration gate verdict

The exact migration/schema plan is now **LOCKED**.

No migration has been created or applied in this planning step.

The implementation migration must preserve:
- existing `study_activity_days` data,
- existing H&A isolation,
- existing grades/mastery/remediation,
- existing `last_studied_at`,
- existing tenant boundaries.

