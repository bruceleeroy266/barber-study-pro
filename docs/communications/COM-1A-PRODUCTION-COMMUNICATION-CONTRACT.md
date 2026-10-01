# COM-1A — Production Communication Contract + Exact Schema

**Project:** ASCYN PRO  
**Slice:** COM-1A  
**Status:** Planning contract only — no production schema or runtime changes  
**Baseline:** `main` at the start of this planning slice  
**Purpose:** Lock the production rules and database shape for instructor↔student messaging plus student bulletin acknowledgments before implementation.

---

## 1. Scope Boundary

COM-1A defines the production contract only.

This slice MUST NOT:
- create production tables
- change RLS in production
- enable production messaging
- alter certified chapter/TLS logic
- alter attendance/hours, grades, assessments, remediation, or learning evidence
- merge demo messaging behavior directly into production

Implementation begins only in a later authorized slice.

---

## 2. Product Contract

ASCYN PRO Communications contains two distinct systems behind one instructor-facing parent destination:

`Instructor → Communications → Messages | Bulletins`

They may share navigation and notification infrastructure, but their authorization rules remain separate.

### 2.1 Messages

Messages are private, two-party instructor↔student communication.

Allowed:
- assigned instructor → assigned student
- assigned student → assigned instructor
- replies inside an authorized thread

Forbidden:
- student → student
- student → unassigned instructor
- student → another school
- instructor → unassigned student
- cross-school messaging
- open user directory
- group chat in V1
- deleting messages from the audit record
- production use of demo-only message state

### 2.2 Bulletins

Bulletins are one-way announcements. They are not chat threads.

Allowed:
- instructor → their assigned students
- school admin/admin → authorized school audiences
- student → view targeted bulletins
- student → acknowledge a bulletin

Forbidden:
- student comments
- student replies to bulletins
- emoji reaction sets
- student-created bulletins
- cross-school bulletin visibility
- altering another student's acknowledgment

---

## 3. Assignment Contract

Current ASCYN PRO operational access is primarily school-scoped. That remains unchanged for attendance, hours, grades, assessments, chapters, and other certified systems.

Communications adds an explicit assignment relationship solely to enforce "student can only message their instructor."

### Locked rule

A student may have **one active primary instructor assignment** for Communications V1.

Reassignment preserves history by closing the old assignment and creating a new active assignment.

No existing operational table is rewritten to use this assignment in COM-1.

---

## 4. Role Contract

### Student

Can:
- read their own active instructor assignment
- create/read authorized message threads with their active assigned instructor
- send messages in those threads
- read messages in those threads
- mark received messages as read
- view bulletins whose audience resolves to them
- acknowledge a bulletin once

Cannot:
- select arbitrary recipients
- discover other students through messaging
- message another student
- message an unassigned instructor
- access another student's thread
- view another student's acknowledgment status
- publish/edit/archive bulletins
- create or alter instructor assignments

### Instructor

Can:
- read their active assigned students
- create/read threads only with assigned students
- send/reply to assigned students
- see read status for messages they sent
- create bulletins for their assigned students
- see acknowledgment state for students included in their authorized bulletin audience
- archive their own view of completed threads without deleting records

Cannot:
- message students not assigned to them
- access another school's communication data
- impersonate another sender
- delete message evidence
- alter student acknowledgments

### School Admin / Admin

Can:
- create, close, and replace active instructor assignments within their school
- publish bulletins to school-wide, program, or selected-student audiences within their school
- view bulletin acknowledgment status within their school
- perform authorized communication administration

Private message content is not exposed through an ordinary "browse all private conversations" workflow by default. Any future compliance/incident access must be separately designed and audited.

### Platform administration

Ordinary application access does not grant casual access to private school conversations. Any future exceptional support/compliance access requires a separate explicitly audited privileged path.

---

## 5. Message Lifecycle Contract

1. User authenticates.
2. Server/database resolves the actor's profile and school.
3. The active student↔instructor assignment is verified.
4. Thread access is authorized.
5. Message is persisted.
6. Persistence is the source of truth.
7. Realtime may notify subscribed authorized clients after persistence.
8. Recipient may create a read receipt.
9. Message records are not hard-deleted in V1.

Realtime is transport/UX enhancement, not authority or storage.

---

## 6. Bulletin Lifecycle Contract

Bulletin states:

- `draft`
- `published`
- `archived`

A published bulletin may have:
- priority: `normal | important | urgent`
- optional publish time
- optional expiration time
- pinned state
- acknowledgment required flag

Expiration removes a bulletin from the active student feed but does not erase history.

Acknowledgment means "I have seen this bulletin." It does not mean agreement.

---

## 7. Exact Production Schema

The implementation slice will create the following tables unless a later implementation audit finds a naming collision.

### 7.1 `student_instructor_assignments`

Purpose: authoritative Communications assignment.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `school_id uuid not null references public.schools(id) on delete cascade`
- `student_id uuid not null references public.profiles(id) on delete cascade`
- `instructor_id uuid not null references public.profiles(id) on delete cascade`
- `is_active boolean not null default true`
- `assigned_by uuid references public.profiles(id) on delete set null`
- `assigned_at timestamptz not null default now()`
- `ended_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:
- student and instructor must differ
- active assignment requires `ended_at is null`
- inactive assignment requires `ended_at is not null`

Indexes:
- `(school_id, instructor_id, is_active)`
- `(school_id, student_id, is_active)`
- partial unique index enforcing one active assignment per student:
  `unique(student_id) where is_active = true`

Implementation validation must also verify:
- student profile role is `student` or `apprentice`
- instructor profile role is `instructor`
- both profiles belong to `school_id`

Those cross-row validations should be server/database enforced through the safest current ASCYN PRO pattern rather than trusting client values.

---

### 7.2 `communication_threads`

Purpose: private two-party conversation container.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `school_id uuid not null references public.schools(id) on delete cascade`
- `student_id uuid not null references public.profiles(id) on delete cascade`
- `instructor_id uuid not null references public.profiles(id) on delete cascade`
- `subject text not null`
- `status text not null default 'active'`
- `created_by uuid not null references public.profiles(id) on delete restrict`
- `last_message_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Checks:
- trimmed subject length: 1–160
- `status in ('active','archived')`

Indexes:
- `(school_id, student_id, last_message_at desc)`
- `(school_id, instructor_id, last_message_at desc)`
- `(status)`

A thread is valid only when its student/instructor pair corresponds to an authorized assignment when the thread is created. Reassignment does not erase old threads; access to historical threads must be handled explicitly in the implementation policy.

---

### 7.3 `communication_messages`

Purpose: immutable message evidence.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `thread_id uuid not null references public.communication_threads(id) on delete restrict`
- `school_id uuid not null references public.schools(id) on delete cascade`
- `sender_id uuid not null references public.profiles(id) on delete restrict`
- `body text not null`
- `sent_at timestamptz not null default now()`
- `created_at timestamptz not null default now()`

Checks:
- trimmed body length: 1–4000

Indexes:
- `(thread_id, sent_at)`
- `(school_id, sent_at desc)`
- `(sender_id, sent_at desc)`

V1 contract:
- no user-facing edit
- no hard delete
- sender must be one of the thread's two authorized participants

---

### 7.4 `communication_message_reads`

Purpose: append-only recipient read evidence.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `message_id uuid not null references public.communication_messages(id) on delete cascade`
- `reader_id uuid not null references public.profiles(id) on delete cascade`
- `read_at timestamptz not null default now()`

Constraint:
- `unique(message_id, reader_id)`

Index:
- `(reader_id, read_at desc)`

Only the non-sender authorized thread participant may create the read receipt.

---

### 7.5 `bulletins`

Purpose: announcement record.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `school_id uuid not null references public.schools(id) on delete cascade`
- `author_id uuid not null references public.profiles(id) on delete restrict`
- `title text not null`
- `body text not null`
- `priority text not null default 'normal'`
- `status text not null default 'draft'`
- `is_pinned boolean not null default false`
- `acknowledgment_required boolean not null default false`
- `publish_at timestamptz null`
- `expires_at timestamptz null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Checks:
- trimmed title length: 1–160
- trimmed body length: 1–10000
- `priority in ('normal','important','urgent')`
- `status in ('draft','published','archived')`
- if both timestamps exist, `expires_at > publish_at`

Indexes:
- `(school_id, status, publish_at desc)`
- `(school_id, is_pinned, publish_at desc)`

No hard delete in V1 after publication. Draft deletion may be considered in implementation, but published history must remain auditable.

---

### 7.6 `bulletin_audiences`

Purpose: normalized targeting.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `bulletin_id uuid not null references public.bulletins(id) on delete cascade`
- `school_id uuid not null references public.schools(id) on delete cascade`
- `audience_type text not null`
- `program_id uuid null references public.programs(id) on delete cascade`
- `student_id uuid null references public.profiles(id) on delete cascade`
- `created_at timestamptz not null default now()`

Audience types:
- `school`
- `program`
- `student`

Check contract:
- `school` => `program_id is null and student_id is null`
- `program` => `program_id is not null and student_id is null`
- `student` => `student_id is not null and program_id is null`

Deduplication:
- school audience unique per bulletin
- program audience unique per bulletin/program
- student audience unique per bulletin/student

Authorization:
- instructors may target only their actively assigned students in V1
- school admin/admin may target authorized school, program, or selected students

---

### 7.7 `bulletin_acknowledgments`

Purpose: student acknowledgment evidence.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `bulletin_id uuid not null references public.bulletins(id) on delete cascade`
- `school_id uuid not null references public.schools(id) on delete cascade`
- `student_id uuid not null references public.profiles(id) on delete cascade`
- `acknowledged_at timestamptz not null default now()`

Constraint:
- `unique(bulletin_id, student_id)`

Indexes:
- `(bulletin_id, acknowledged_at)`
- `(student_id, acknowledged_at desc)`

Only the authenticated student may acknowledge for themselves, and only when the bulletin audience resolves to that student.

V1 acknowledgment is append-only. No toggle-off behavior.

---

### 7.8 `communication_audit_events`

Purpose: append-only administrative/accountability trail for state-changing communication actions that are not already self-evident from immutable rows.

Columns:
- `id uuid primary key default gen_random_uuid()`
- `school_id uuid not null references public.schools(id) on delete cascade`
- `actor_id uuid references public.profiles(id) on delete set null`
- `entity_type text not null`
- `entity_id uuid not null`
- `event_type text not null`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`

Initial event families:
- assignment_created
- assignment_ended
- thread_archived
- bulletin_created
- bulletin_published
- bulletin_updated
- bulletin_archived

This table is not a substitute for RLS. It records authorized changes after authorization succeeds.

---

## 8. RLS Contract

Every new public table must have RLS enabled before authenticated access is granted.

Policies must be school-scoped and identity-scoped. `TO authenticated` alone is explicitly insufficient.

### Assignment RLS
- student: SELECT own active/history rows
- instructor: SELECT rows where `instructor_id = auth.uid()`
- school admin/admin: manage rows only in their own school
- student/instructor: no direct assignment INSERT/UPDATE/DELETE

### Thread RLS
SELECT allowed only when:
- `student_id = auth.uid()`, or
- `instructor_id = auth.uid()`
and current user school matches `school_id`.

Creation must additionally validate the authorized active assignment.

### Message RLS
SELECT allowed only through authorized thread membership.
INSERT allowed only when:
- actor is a thread participant
- actor remains authorized for the operation
- `sender_id = auth.uid()`
- `school_id` matches the thread

No authenticated UPDATE/DELETE in V1.

### Read receipt RLS
INSERT only for authenticated reader matching `reader_id` and authorized as the recipient in the referenced thread.
SELECT only by authorized thread participants as needed for UI.

### Bulletin RLS
Student SELECT only when:
- bulletin is published
- publish time has arrived
- not archived
- not expired for active-feed reads
- audience resolves to student
- school matches

Instructor writes limited to their authorized scope.
School admin/admin writes limited to own school.

### Acknowledgment RLS
Student INSERT only when:
- `student_id = auth.uid()`
- bulletin is visible to them
- school matches

Student SELECT own acknowledgment only.
Authorized instructor/admin may SELECT acknowledgment rows for bulletins they are permitted to manage.

No authenticated UPDATE/DELETE in V1.

---

## 9. Realtime Contract

Production Realtime must use private authorization.

Preferred flow:

`authorized DB write → persisted row → private Realtime notification → authorized client refresh/update`

Realtime must never be the only place a message or acknowledgment exists.

Channel topics should be scoped to stable identifiers, for example:
- `thread:<thread_id>:messages`
- `school:<school_id>:bulletins`

Private channel authorization must not broaden the underlying database permissions.

---

## 10. UI Contract

### Instructor

Navigation:
`Communications`

Tabs:
- Messages
- Bulletins

Messages:
- assigned students only
- inbox/thread layout may reuse existing messaging components
- unread state
- archive
- no group chat V1

Bulletins:
- create/edit drafts
- publish
- priority
- pin
- publish/expiration timestamps
- acknowledgment required
- acknowledgment counts

### Student

Messages:
- assigned instructor only
- no classmates language
- no recipient directory
- no student-to-student path

Bulletin Board:
- targeted active bulletins
- pinned/important presentation
- `Acknowledge` action when enabled
- own acknowledgment state only

---

## 11. Explicit Non-Goals for V1

Not in COM V1:
- student-to-student messaging
- group chat
- comments on bulletins
- reactions beyond acknowledgment
- GIFs/stickers
- audio/video calls
- disappearing messages
- unrestricted file attachments
- external SMS/email delivery
- automated LLM messages sent without instructor action
- broad platform-admin browsing of private conversations

---

## 12. Required Implementation Test Matrix

Later implementation cannot be certified GREEN without proving at minimum:

### Positive
- assigned student can message assigned instructor
- assigned instructor can message assigned student
- both can read their authorized thread
- read receipt records once
- authorized student can view targeted bulletin
- authorized student can acknowledge once
- instructor/admin acknowledgment counts are accurate

### Negative/security
- student cannot message another student
- student cannot message unassigned instructor
- instructor cannot message unassigned student
- cross-school thread access denied
- cross-school bulletin access denied
- student cannot acknowledge for another student
- student cannot read another student's acknowledgment
- client-modified `school_id`, `student_id`, `instructor_id`, or `sender_id` cannot bypass authorization
- published message evidence cannot be deleted by ordinary authenticated users

### Lifecycle
- reassignment closes previous assignment
- new assignment becomes active
- old communication history is preserved
- expiration removes bulletin from active feed
- archive preserves bulletin history
- duplicate acknowledgment prevented

---

## 13. Compatibility Contract

COM implementation must preserve:
- Chapters 1–21 certified learning architecture
- TLS runtime and status mapping
- attendance/hours workflows
- gradebook/assessment workflows
- existing school-scoped authorization outside Communications
- production demo-safety boundary until the real backend is fully certified

No existing certified system may be rewritten merely to support messaging.

---

## 14. COM-1A Certification

COM-1A is GREEN when:
- allowed and forbidden communication paths are unambiguous
- explicit student↔instructor assignment is locked
- exact production table responsibilities are defined
- acknowledgment semantics are locked
- RLS boundaries are defined
- realtime is explicitly subordinate to database authorization
- implementation test requirements are defined
- no production behavior has changed

**COM-1A result: GREEN — planning contract locked, pending implementation slices.**
