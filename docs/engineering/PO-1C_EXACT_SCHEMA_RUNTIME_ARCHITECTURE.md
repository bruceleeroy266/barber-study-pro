# PO-1C — Exact Schema / Runtime Architecture

**Status:** LOCKED DESIGN — NO MIGRATION OR SIMULATOR UI AUTHORIZED  
**Companion contract:** `docs/engineering/PO-1C_COMPREHENSIVE_EXAM_SIMULATOR_CONTRACT.md`  
**Design baseline:** `822fef660170726b36a5e81809dc40342ac743a9`

This document turns the PO-1C behavior contract into an exact implementation architecture without creating database objects or simulator runtime code.

---

# 1. Architecture decision

The comprehensive exam is a **separate assessment domain**.

It will **not**:
- reuse `quiz_attempts` as its attempt table,
- store 110-question attempts inside chapter quiz history,
- overload PO-1B `surface_type='quiz'`,
- use legacy static HTML/localStorage exam history,
- expose question answer keys through ordinary authenticated table reads.

It will use:
- versioned exam configuration,
- an explicit certified question registry,
- immutable per-attempt question snapshots,
- server-authoritative start/expiration/finalization,
- one active attempt per student/configuration,
- a dedicated PO-1B `comprehensive_exam` telemetry surface,
- safe RPC payloads that never return scoring secrets.

---

# 2. Exact database tables

## Table A — `public.comprehensive_exam_configs`

Purpose: versioned exam configuration and activation boundary.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `slug text not null`
- `version integer not null check (version > 0)`
- `title text not null`
- `status text not null default 'draft'`
- `blueprint_version text not null`
- `question_bank_version text not null`
- `scoring_policy_version text not null`
- `time_limit_seconds integer null`
- `passing_percentage integer null`
- `scored_question_count integer not null default 100`
- `unscored_question_count integer not null default 10`
- `created_at timestamptz not null default clock_timestamp()`
- `updated_at timestamptz not null default clock_timestamp()`
- `activated_at timestamptz null`
- `retired_at timestamptz null`

Constraints:

- unique `(slug, version)`
- `status in ('draft','active','retired')`
- `time_limit_seconds is null or time_limit_seconds > 0`
- `passing_percentage is null or passing_percentage between 0 and 100`
- `scored_question_count = 100`
- `unscored_question_count = 10`
- active configuration requires:
  - non-null `time_limit_seconds`
  - non-null `passing_percentage`
  - four valid domain rows totaling 100 scored questions / 100 percent
  - enough eligible question-bank inventory.

Activation is performed only through a privileged activation function; ordinary table UPDATE does not activate configurations.

---

## Table B — `public.comprehensive_exam_config_domains`

Purpose: versioned scored-domain blueprint.

Columns:

- `config_id uuid not null references public.comprehensive_exam_configs(id) on delete cascade`
- `domain text not null`
- `weight_percent integer not null`
- `scored_question_count integer not null`
- `created_at timestamptz not null default clock_timestamp()`

Primary key:

- `(config_id, domain)`

Allowed domains:

- `scientific_concepts`
- `implements_equipment`
- `hair_care_services`
- `facial_hair_skin_care_services`

Locked standard values:

| domain | weight_percent | scored_question_count |
| --- | ---: | ---: |
| scientific_concepts | 35 | 35 |
| implements_equipment | 10 | 10 |
| hair_care_services | 40 | 40 |
| facial_hair_skin_care_services | 15 | 15 |

Cross-row totals are certified by the configuration activation function.

---

## Table C — `public.comprehensive_exam_questions`

Purpose: private authoritative exam-question registry.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `source_question_id text not null unique`
- `source_kind text not null`
- `source_chapter_id text null`
- `domain text not null`
- `prompt text not null`
- `option_a text not null`
- `option_b text not null`
- `option_c text not null`
- `option_d text not null`
- `correct_option text not null`
- `explanation text not null`
- `content_version text not null`
- `provenance jsonb not null default '{}'::jsonb`
- `status text not null default 'active'`
- `created_at timestamptz not null default clock_timestamp()`
- `updated_at timestamptz not null default clock_timestamp()`

Checks:

- same four-domain allowlist
- `correct_option in ('a','b','c','d')`
- `source_kind in ('chapter_quiz','comprehensive_bank','certified_original')`
- `status in ('active','retired')`
- `jsonb_typeof(provenance)='object'`

Rules:

- legacy static HTML is never an authoritative source kind.
- reassessment-reserve items are not implicitly eligible.
- answer key and explanation remain server-private.
- retirement never rewrites historical attempt snapshots.

---

## Table D — `public.comprehensive_exam_config_questions`

Purpose: explicit eligibility of registry questions for a specific configuration/version.

Columns:

- `config_id uuid not null references public.comprehensive_exam_configs(id) on delete cascade`
- `question_id uuid not null references public.comprehensive_exam_questions(id) on delete restrict`
- `scored_eligible boolean not null default true`
- `unscored_eligible boolean not null default true`
- `is_active boolean not null default true`
- `created_at timestamptz not null default clock_timestamp()`

Primary key:

- `(config_id, question_id)`

A question may be:
- scored eligible,
- unscored eligible,
- both,
- disabled for that configuration.

At least one eligibility flag must be true while `is_active=true`.

---

## Table E — `public.comprehensive_exam_attempts`

Purpose: authoritative attempt lifecycle and immutable finalized result.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `school_id uuid not null references public.schools(id) on delete restrict`
- `config_id uuid not null references public.comprehensive_exam_configs(id) on delete restrict`
- `config_version integer not null`
- `blueprint_version text not null`
- `question_bank_version text not null`
- `scoring_policy_version text not null`
- `status text not null default 'active'`
- `started_at timestamptz not null`
- `expires_at timestamptz not null`
- `completed_at timestamptz null`
- `completion_reason text null`
- `elapsed_seconds integer null`
- `scored_correct integer null`
- `scored_total integer not null default 100`
- `percentage integer null`
- `passed boolean null`
- `unscored_correct integer null`
- `unscored_total integer not null default 10`
- `domain_breakdown jsonb not null default '{}'::jsonb`
- `flagged_at_submit integer null`
- `unanswered_at_submit integer null`
- `attempt_number integer not null`
- `previous_attempt_id uuid null references public.comprehensive_exam_attempts(id) on delete set null`
- `study_session_id uuid not null unique references public.study_sessions(id) on delete restrict`
- `readiness_sync_status text not null default 'pending'`
- `created_at timestamptz not null default clock_timestamp()`
- `updated_at timestamptz not null default clock_timestamp()`

Checks:

- `status in ('active','completed','expired','recovered_finalized','voided')`
- `completion_reason is null or completion_reason in ('student_submit','timer_expired','recovered_finalize','administrative_void')`
- `expires_at > started_at`
- `scored_total = 100`
- `unscored_total = 10`
- nullable score fields constrained to valid ranges when present
- `percentage is null or percentage between 0 and 100`
- `elapsed_seconds is null or elapsed_seconds >= 0`
- `attempt_number > 0`
- `readiness_sync_status in ('pending','synced','failed')`
- active rows have null completion fields.
- finalized rows have non-null completion/score fields except voided attempts.

Partial unique index:

`unique (user_id, config_id) where status='active'`

This is the database-level second line of defense against duplicate active attempts.

---

## Table F — `public.comprehensive_exam_attempt_items`

Purpose: immutable generated question set plus mutable in-progress answer/flag state.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `attempt_id uuid not null references public.comprehensive_exam_attempts(id) on delete cascade`
- `question_id uuid not null references public.comprehensive_exam_questions(id) on delete restrict`
- `position smallint not null`
- `domain text not null`
- `is_scored boolean not null`
- `prompt_snapshot text not null`
- `option_a_snapshot text not null`
- `option_b_snapshot text not null`
- `option_c_snapshot text not null`
- `option_d_snapshot text not null`
- `correct_option_snapshot text not null`
- `explanation_snapshot text not null`
- `selected_option text null`
- `answered_at timestamptz null`
- `flagged boolean not null default false`
- `flag_updated_at timestamptz null`
- `created_at timestamptz not null default clock_timestamp()`
- `updated_at timestamptz not null default clock_timestamp()`

Constraints:

- unique `(attempt_id, position)`
- unique `(attempt_id, question_id)`
- `position between 1 and 110`
- same domain allowlist
- `correct_option_snapshot in ('a','b','c','d')`
- `selected_option is null or selected_option in ('a','b','c','d')`

Important:

Students **never receive direct SELECT access** to this table because it contains:
- `is_scored`,
- `correct_option_snapshot`,
- `explanation_snapshot`.

The student attempt RPC returns a safe projection only.

The question/options are snapshots so later bank edits cannot change historical attempts.

---

## Table G — `public.comprehensive_exam_attempt_events`

Purpose: append-only operational/integrity lifecycle evidence.

Columns:

- `id uuid primary key default gen_random_uuid()`
- `attempt_id uuid not null references public.comprehensive_exam_attempts(id) on delete cascade`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `school_id uuid not null references public.schools(id) on delete restrict`
- `event_type text not null`
- `item_id uuid null references public.comprehensive_exam_attempt_items(id) on delete set null`
- `received_at timestamptz not null default clock_timestamp()`
- `metadata jsonb not null default '{}'::jsonb`

Initial event allowlist:

- `attempt_started`
- `attempt_resumed`
- `answer_saved`
- `flag_set`
- `flag_cleared`
- `review_opened`
- `focus_lost`
- `focus_gained`
- `submitted`
- `expired`
- `recovered_finalized`
- `telemetry_end_failed`
- `readiness_sync_failed`
- `readiness_synced`
- `voided`

Metadata must never contain the canonical answer key.

---

# 3. Exact indexes

## Configs

- `idx_comprehensive_exam_configs_status on (status, slug, version desc)`
- unique `uq_comprehensive_exam_configs_slug_version on (slug, version)`

## Config domains

- `idx_comprehensive_exam_config_domains_config on (config_id)`

## Questions

- unique `uq_comprehensive_exam_questions_source_id on (source_question_id)`
- `idx_comprehensive_exam_questions_domain_status on (domain, status)`
- `idx_comprehensive_exam_questions_content_version on (content_version)`

## Config-question eligibility

- `idx_comprehensive_exam_config_questions_scored on (config_id, question_id) where is_active and scored_eligible`
- `idx_comprehensive_exam_config_questions_unscored on (config_id, question_id) where is_active and unscored_eligible`

## Attempts

- `idx_comprehensive_exam_attempts_user_started on (user_id, started_at desc)`
- `idx_comprehensive_exam_attempts_school_started on (school_id, started_at desc)`
- `idx_comprehensive_exam_attempts_school_user_started on (school_id, user_id, started_at desc)`
- `idx_comprehensive_exam_attempts_config_started on (config_id, started_at desc)`
- `idx_comprehensive_exam_attempts_status_expires on (status, expires_at)`
- unique partial `uq_comprehensive_exam_attempt_active_user_config on (user_id, config_id) where status='active'`
- unique `uq_comprehensive_exam_attempt_number on (user_id, config_id, attempt_number)`
- unique `uq_comprehensive_exam_attempt_study_session on (study_session_id)`

## Attempt items

- unique `uq_comprehensive_exam_attempt_items_position on (attempt_id, position)`
- unique `uq_comprehensive_exam_attempt_items_question on (attempt_id, question_id)`
- `idx_comprehensive_exam_attempt_items_attempt_flagged on (attempt_id, flagged, position)`
- `idx_comprehensive_exam_attempt_items_attempt_answered on (attempt_id, answered_at, position)`
- `idx_comprehensive_exam_attempt_items_domain on (attempt_id, domain, is_scored)`

## Attempt events

- `idx_comprehensive_exam_attempt_events_attempt_received on (attempt_id, received_at)`
- `idx_comprehensive_exam_attempt_events_user_received on (user_id, received_at desc)`
- `idx_comprehensive_exam_attempt_events_school_received on (school_id, received_at desc)`

---

# 4. RLS and grants

All seven tables have RLS enabled.

## Configuration tables

`comprehensive_exam_configs` and `comprehensive_exam_config_domains`:

- no anonymous access,
- authenticated learner does not need direct table reads,
- safe active-config summary comes from RPC/API,
- school staff may consume safe configuration summary through API,
- platform admin/service role may inspect full configuration.

## Question registry / config eligibility

`comprehensive_exam_questions` and `comprehensive_exam_config_questions`:

- **no direct authenticated SELECT** for students/instructors/school admins,
- no authenticated INSERT/UPDATE/DELETE,
- service role/platform-admin maintenance only,
- safe exam payload is produced by SECURITY DEFINER RPC after ownership checks.

This prevents answer-key leakage.

## Attempts

Authenticated SELECT:

Student:
- `auth.uid() = user_id`

Instructor/school staff:
- same-school authorization using current project helpers,
- application may narrow to assigned roster where a cross-domain roster relationship exists.

School admin:
- own school only.

Platform admin:
- `public.is_platform_admin()`

No authenticated direct INSERT/UPDATE/DELETE.

## Attempt items

No ordinary authenticated table SELECT.

All student/staff reads are safe projections through RPC/API.

No authenticated INSERT/UPDATE/DELETE.

## Attempt events

No ordinary authenticated mutation.

Student event/history access is not required for initial UI.

Authorized staff/platform admin access is through safe oversight RPCs.

## Grants

- revoke all table mutation from `anon`, `authenticated`
- no `anon` access
- `authenticated` receives EXECUTE only on approved RPCs
- service role retains operational access
- SECURITY DEFINER functions use `set search_path = public, pg_temp`
- every mutating RPC performs internal auth/tenant checks even though RLS exists.

---

# 5. PO-1B telemetry extension

PO-1C uses a **new explicit telemetry surface**:

`surface_type='comprehensive_exam'`

Required later PO-1C migration changes:

1. Extend `study_sessions.surface_type` check to include `comprehensive_exam`.
2. Extend `study_session_events.surface_type` check to include `comprehensive_exam`.
3. Extend `begin_study_session` allowlist to include `comprehensive_exam` only if ordinary callers need it.
4. Extend the TypeScript `StudySurfaceType` union later during runtime wiring.
5. Do **not** use `quiz_attempt_id` for comprehensive attempts.

Link model:

- the comprehensive attempt owns `study_session_id`,
- `study_sessions.surface_type='comprehensive_exam'`,
- `study_sessions.surface_id = comprehensive_exam_attempt.id::text`.

No circular foreign key is introduced.

Exactly one telemetry session belongs to one comprehensive attempt because `study_session_id` is UNIQUE and NOT NULL on the attempt.

### Creation order

Within one start-attempt database transaction:

1. pre-generate `attempt_id`,
2. validate/generate the complete 110-item set,
3. create PO-1B `study_sessions` row using:
   - user from `auth.uid()`,
   - authoritative school,
   - `surface_type='comprehensive_exam'`,
   - `surface_id=attempt_id::text`,
4. create comprehensive attempt with that `study_session_id`,
5. persist all 110 attempt-item snapshots,
6. append `attempt_started` event,
7. commit.

If question generation fails, none of these rows commit.

Opening/creating the attempt gives **0 PO-1B active seconds**.

Saving a real answer is a qualifying learning event.

---

# 6. Concurrency / duplicate-attempt contract

There are two independent protections.

## Protection A — advisory lock

Start/resume takes a transaction advisory lock keyed by:

- authenticated `user_id`
- `config_id`

Conceptually:

`pg_advisory_xact_lock(hash(user_id), hash(config_id))`

The clock is captured only after the lock is acquired.

## Protection B — partial unique index

The database also enforces:

`unique (user_id, config_id) where status='active'`

Therefore two tabs/devices cannot create two active attempts for the same student/configuration.

### Start behavior

Under the lock:

1. look for an active attempt.
2. If one exists and `now < expires_at`:
   - do not create another,
   - append `attempt_resumed`,
   - return the existing safe attempt payload.
3. If one exists and `now >= expires_at`:
   - finalize it as expired,
   - return the finalized attempt/result,
   - **do not silently create a retake in the same request**.
4. If none exists:
   - create a new attempt.

A new retake requires a new explicit start action after the previous attempt is finalized.

---

# 7. Timer authority

The exam wall clock is independent from PO-1B active seconds.

At start:

- `started_at = clock_timestamp()`
- `expires_at = started_at + make_interval(secs => config.time_limit_seconds)`

The client may display a countdown, but remaining time is always derived from server-authoritative `expires_at`.

Every mutating attempt RPC:

1. locks the attempt row `FOR UPDATE`,
2. captures `clock_timestamp()`,
3. checks `status`,
4. checks `now >= expires_at`,
5. if expired, finalizes through the common server finalizer before doing anything else.

Consequences:

- client-clock spoofing cannot extend the exam,
- refresh does not reset time,
- hidden/background tabs do not pause time,
- offline time still counts against the wall clock,
- a late answer cannot be written after server expiration.

Persisted `elapsed_seconds` at finalization:

`floor(extract(epoch from (least(completed_at, expires_at) - started_at)))`

For timer expiration this equals the configured limit.

---

# 8. Exact question-selection algorithm

Question generation happens server-side inside the start-attempt transaction.

## Step 1 — validate configuration

Require:

- config status = `active`,
- valid time limit,
- valid passing percentage,
- exact four-domain blueprint,
- domain scored counts = 35/10/40/15,
- totals = 100 scored,
- unscored count = 10.

## Step 2 — build eligible scored pools

Join:

- `comprehensive_exam_config_questions`
- `comprehensive_exam_questions`

Require:
- config match,
- eligibility row active,
- `scored_eligible=true`,
- question status active,
- question domain matches requested domain.

Select without replacement:

- 35 scientific concepts
- 10 implements/equipment
- 40 hair care services
- 15 facial hair/skin care services.

If any pool is short, raise and roll back. No partial attempt exists.

## Step 3 — select unscored items

From active config questions where:

- `unscored_eligible=true`,
- question status active,
- question ID not already selected among the 100 scored items.

Select exactly 10 without replacement.

The initial contract does not impose a second scored-domain weighting on these 10.

If fewer than 10 are available, raise and roll back.

## Step 4 — randomize option presentation

For every selected question:

- create a server-side permutation of A/B/C/D,
- persist the four displayed option snapshots,
- translate the canonical correct option to the displayed option letter,
- never send the canonical/original key to the browser.

## Step 5 — randomize question order

Shuffle all 110 selected items and assign immutable positions 1..110.

## Step 6 — snapshot

Persist:
- source question ID reference,
- domain,
- scored classification,
- prompt,
- shuffled displayed options,
- translated correct displayed option,
- explanation,
- position.

After commit, refresh always uses these snapshots and positions; it never regenerates the attempt.

### Randomness boundary

Randomization is used only for selection/order/presentation.

Correctness, scoring classification, blueprint counts, and duration are never random.

---

# 9. Exact RPC architecture

## RPC A — `public.get_active_comprehensive_exam_config()`

Purpose:
- return safe active configuration metadata.

Returns:
- config ID
- title
- version
- time limit
- passing threshold
- scored count = 100
- unscored count = 10
- safe domain labels/counts.

Does not return question inventory or keys.

---

## RPC B — `public.start_or_resume_comprehensive_exam(p_config_id uuid)`

Purpose:
- explicit start/resume boundary.

Security:
- authenticated approved learner only,
- server derives user/school,
- advisory lock on user+config.

Behavior:
- validate active config,
- finalize an already-expired active attempt and return its result without creating a retake,
- return live active attempt if one exists,
- otherwise generate/persist complete 110-question attempt and telemetry session atomically.

Returns safe attempt header plus safe 110-item payload.

Never returns:
- `is_scored`,
- correct answer,
- explanation,
- provenance,
- scoring key.

---

## RPC C — `public.get_comprehensive_exam_attempt(p_attempt_id uuid)`

Purpose:
- refresh/resume.

Behavior:
- owner only for student use,
- if active but expired, finalize first,
- return authoritative status and remaining-time inputs,
- for active attempt return safe ordered item projection:
  - position
  - prompt
  - option A-D
  - selected option
  - flagged
  - answered state.

For completed/expired attempt:
- return summary/result,
- do not expose reusable answer key.

---

## RPC D — `public.save_comprehensive_exam_answer(
p_attempt_id uuid,
p_position integer,
p_selected_option text
)`

Behavior:

1. auth owner check,
2. `FOR UPDATE` attempt,
3. server expiration check,
4. verify position belongs to attempt,
5. update `selected_option` and `answered_at`,
6. append `answer_saved` event,
7. record one PO-1B `qualifying_activity` against the linked study session,
8. return saved timestamp and attempt status.

The client cannot submit:
- score,
- correctness,
- scored/unscored classification,
- duration.

A PO-1B telemetry-write failure must not falsely report answer failure if the answer itself committed; implementation should isolate telemetry failure and append a telemetry fault event where appropriate.

---

## RPC E — `public.set_comprehensive_exam_flag(
p_attempt_id uuid,
p_position integer,
p_flagged boolean
)`

Behavior:

- auth owner,
- active/unexpired attempt only,
- update flag state,
- append `flag_set` or `flag_cleared`,
- no score/mastery effect.

Flagging alone is not required to grant PO-1B study seconds.

---

## RPC F — `public.record_comprehensive_exam_event(
p_attempt_id uuid,
p_event_type text
)`

Narrow accepted client event types only:

- `review_opened`
- `focus_lost`
- `focus_gained`

No arbitrary event names or metadata from the client.

Operational/integrity evidence only.

---

## RPC G — `public.submit_comprehensive_exam_attempt(p_attempt_id uuid)`

Behavior:

1. auth owner,
2. lock attempt,
3. if already finalized, return existing result idempotently,
4. if expired, finalize with `timer_expired`,
5. otherwise finalize with `student_submit`,
6. compute score from private attempt snapshots,
7. compute domain breakdown from scored items only,
8. count flags/unanswered state,
9. persist immutable result fields,
10. close PO-1B study session best-effort,
11. mark readiness sync pending,
12. append completion event,
13. return safe result.

Denominator is always 100.

---

## Internal function H — `public._finalize_comprehensive_exam_attempt(
p_attempt_id uuid,
p_reason text
)`

Not executable by ordinary authenticated users.

Shared internal finalizer for:
- student submit,
- timer expiration,
- authorized recovery.

It performs authoritative scoring exactly once.

Ordinary users cannot call it directly.

---

## Privileged RPC I — `public.recover_finalize_comprehensive_exam_attempt(p_attempt_id uuid)`

Purpose:
- support-only recovery of an interrupted attempt.

Authorized:
- platform admin or narrowly authorized server/service workflow.

It cannot change saved answers.

It only finalizes the immutable evidence already persisted.

---

## RPC J — `public.get_my_comprehensive_exam_history()`

Student-safe attempt summaries:
- attempt number/date
- status
- percentage
- scored correct / 100
- domain summary
- elapsed duration
- PO-1B active seconds
- flags/unanswered counts.

No answer key.

---

## RPC K — `public.get_staff_comprehensive_exam_history(p_student_id uuid)`

Instructor/school-admin safe view.

Checks:
- caller authorized staff,
- same school,
- student belongs to same school / authorized roster where applicable.

Returns oversight fields from the behavior contract.

No reusable answer key.

---

## RPC L — `public.get_school_comprehensive_exam_summary(...filters...)`

School-admin aggregate:
- attempt count,
- completion count,
- cohort average,
- domain averages,
- duration summary,
- active-seconds summary.

Own school only.

Platform admins use a separate privileged support query path rather than weakening tenant checks.

---

# 10. Finalization / scoring algorithm

The internal finalizer locks the attempt.

If already finalized:
- return existing result,
- do not recalculate.

For each attempt item:

Scored correctness:
- `is_scored=true`
- `selected_option = correct_option_snapshot`

Compute:

- `scored_correct`
- `scored_total=100`
- `percentage = round(scored_correct * 100.0 / 100)`
- `passed = percentage >= config.passing_percentage`

Unscored:
- compute separately only from `is_scored=false`
- never feed overall percentage/pass/readiness.

Domain breakdown:
- scored items only,
- exact JSON shape keyed by locked domain ID:
  - correct
  - total
  - percentage.

Also persist:
- flagged-at-submit count,
- unanswered-at-submit count,
- completed_at,
- elapsed_seconds,
- completion reason/status.

The finalizer does not mutate:
- question snapshots,
- saved answers,
- question positions,
- original started/expires timestamps.

---

# 11. Immutability

Once attempt status is not `active`:

Ordinary authenticated paths cannot change:
- answers,
- flags,
- score,
- percentage,
- domain breakdown,
- timing,
- question order,
- scored/unscored classification.

Recommended database enforcement in later migration:

- BEFORE UPDATE/DELETE trigger on finalized attempts/items,
- permit only narrowly defined system fields such as `readiness_sync_status` to transition through a dedicated privileged function,
- no direct authenticated DELETE.

Retakes always create a new attempt.

`previous_attempt_id` creates lineage without overwriting prior evidence.

---

# 12. Readiness integration

Finalization records the exam result first.

Readiness integration is a separate post-finalization adapter.

Sequence:

1. authoritative attempt finalizes,
2. attempt `readiness_sync_status='pending'`,
3. server adapter sends only scored-domain evidence to existing readiness/weak-area architecture,
4. success => `synced` + event,
5. failure => `failed` + event,
6. failure never rolls back or deletes valid exam history.

Unscored items are never supplied to readiness.

No new readiness formula is created in PO-1C.

---

# 13. API route architecture

All routes use the normal authenticated server Supabase client.

No routine route may use a service-role client to bypass user authorization.

## Student

### `GET /api/comprehensive-exam/config`
Calls:
- `get_active_comprehensive_exam_config()`

### `POST /api/comprehensive-exam/attempts`
Body:
- `configId`

Calls:
- `start_or_resume_comprehensive_exam(configId)`

### `GET /api/comprehensive-exam/attempts/[attemptId]`
Calls:
- `get_comprehensive_exam_attempt(attemptId)`

### `PUT /api/comprehensive-exam/attempts/[attemptId]/answers/[position]`
Body:
- `selectedOption`

Calls:
- `save_comprehensive_exam_answer(...)`

### `PUT /api/comprehensive-exam/attempts/[attemptId]/flags/[position]`
Body:
- `flagged`

Calls:
- `set_comprehensive_exam_flag(...)`

### `POST /api/comprehensive-exam/attempts/[attemptId]/events`
Body:
- allowlisted `eventType` only

Calls:
- `record_comprehensive_exam_event(...)`

### `POST /api/comprehensive-exam/attempts/[attemptId]/submit`
Calls:
- `submit_comprehensive_exam_attempt(...)`

### `GET /api/comprehensive-exam/history`
Calls:
- `get_my_comprehensive_exam_history()`

## Instructor

### `GET /api/instructor/students/[studentId]/comprehensive-exams`
Calls:
- `get_staff_comprehensive_exam_history(studentId)`

## School admin

### `GET /api/admin/comprehensive-exams`
Validated filters:
- student ID optional
- status optional
- date range optional

Calls:
- own-school safe staff/aggregate RPCs.

## Platform support

Any cross-school support endpoint must:
- verify platform-admin status server-side,
- use a dedicated privileged function,
- write/read platform audit evidence according to existing admin audit conventions.

---

# 14. Client runtime architecture for later implementation

No client files are created in this design slice.

Planned modules:

- `src/lib/comprehensive-exam/types.ts`
- `src/lib/comprehensive-exam/domain-blueprint.ts`
- `src/hooks/useComprehensiveExam.ts`
- `src/components/comprehensive-exam/ExamShell.tsx`
- `src/components/comprehensive-exam/QuestionNavigator.tsx`
- `src/components/comprehensive-exam/ExamQuestion.tsx`
- `src/components/comprehensive-exam/ReviewScreen.tsx`
- `src/components/comprehensive-exam/ExamResults.tsx`
- `src/app/(dashboard)/dashboard/exam-ready/page.tsx`
- staff oversight components/routes after student runtime persistence is certified.

The hook never calculates authoritative score or expiration.

It may:
- render countdown from server-provided `expiresAt`,
- autosave answer changes through the answer API,
- persist flags through the flag API,
- refresh the authoritative attempt after reconnect,
- show save/error state.

---

# 15. Refresh / offline recovery

On page load or reconnect:

1. fetch attempt by ID,
2. server checks expiration before response,
3. if active:
   - return immutable question order,
   - saved answers,
   - saved flags,
   - authoritative `expires_at`,
4. if expired/finalized:
   - return result state,
   - client cannot reopen active mode.

The browser never rebuilds the question set from local state.

LocalStorage may be used only for non-authoritative convenience such as remembering the last open attempt ID; it may never be the exam record.

---

# 16. Staff visibility data contract

Staff response rows contain:

- attempt ID
- student ID/name
- config/version
- attempt number
- started/completed timestamps
- status/completion reason
- scored correct / 100
- percentage/pass status
- domain breakdown
- elapsed seconds
- linked PO-1B active seconds
- flagged-at-submit
- unanswered-at-submit
- readiness sync status.

Not returned:
- correct option per question,
- explanation key,
- full reusable answer key.

A later authorized integrity-detail view may expose event counts such as focus loss without exposing answer keys.

---

# 17. H&A firewall

No comprehensive-exam table/RPC/API is allowed to reference or mutate:

- `hour_logs`
- `effective_hour_logs`
- attendance records
- `attendance_corrections`
- hour adjustments
- official approved-minute mutation functions.

Permitted time fields are strictly:

- `time_limit_seconds`
- `started_at`
- `expires_at`
- `completed_at`
- `elapsed_seconds`
- PO-1B `active_seconds`

None is an attendance-hour field.

---

# 18. Implementation slices after authorization

PO-1C should be implemented in this order.

## PO-1C.1 — Database foundation

Only:
- seven tables,
- constraints/indexes,
- RLS/grants,
- telemetry surface extension,
- config activation boundary,
- regression tests.

No simulator UI.

## PO-1C.2 — Question registry + certified inventory import

Only:
- registry adapter/import,
- eligibility mapping,
- bank sufficiency audit,
- source/provenance validation.

No student simulator UI.

## PO-1C.3 — Attempt generation + timer + persistence RPCs

Only:
- start/resume,
- selection/snapshot,
- answer save,
- flags,
- expiration/finalization,
- safe retrieval,
- concurrency tests.

Minimal test harness only; no polished student UI.

## PO-1C.4 — Student simulator UI

- exam route/shell,
- countdown,
- question navigation,
- flags,
- review,
- submit,
- reconnect/refresh recovery,
- result summary.

## PO-1C.5 — Staff oversight

- instructor history/detail,
- school-admin aggregate,
- tenant certification.

## PO-1C.6 — Readiness + PO-1B end-to-end integration

- scored-domain adapter,
- active-time reporting,
- failure isolation,
- final production certification.

---

# 19. Architecture certification checklist

Before any migration is authorized, this design locks:

- [x] separate comprehensive-attempt domain
- [x] versioned configuration
- [x] exact 35/10/40/15 scored blueprint
- [x] private question registry
- [x] explicit config eligibility
- [x] immutable attempt snapshots
- [x] exactly one active attempt per user/config
- [x] advisory-lock concurrency
- [x] partial unique-index backstop
- [x] server-authoritative expiration
- [x] refresh-safe answers/flags/order
- [x] private scored/unscored classification
- [x] no student answer-key table access
- [x] idempotent common finalizer
- [x] separate retake history
- [x] dedicated PO-1B `comprehensive_exam` surface
- [x] one telemetry session per attempt
- [x] active seconds separate from wall-clock duration
- [x] H&A firewall
- [x] readiness failure isolated from exam persistence
- [x] instructor/school-admin safe summary path
- [x] no service-role bypass in routine student APIs
- [x] no migration or UI authorized by this document.

---

# Certification statement

The **PO-1C exact schema/runtime architecture is LOCKED ON PAPER**.

No database migration, question import, simulator route, or student/staff UI has been created by this architecture slice.

The next permitted implementation step, after explicit authorization, is **PO-1C.1 — Database Foundation only**.
