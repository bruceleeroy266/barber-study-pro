# COM-2C — Database / RLS Enforcement

## Purpose

COM-2C makes the database enforce the same direct-message allow/deny rules locked in COM-2A and modeled in COM-2B.

## Structural change

The original COM-1 `communication_threads` table could represent only a student/instructor pair.

COM-2C adds:

- `participant_one_id`
- `participant_two_id`

Existing COM-1 rows are backfilled from `student_id` + `instructor_id`.

A compatibility trigger automatically fills the generic participant columns for the existing COM-1 runtime, so this slice does not require a UI/runtime cutover.

The legacy `student_id` and `instructor_id` columns remain present for existing threads and current runtime compatibility, but become nullable so future admin-related threads can use the generic participant pair.

## Canonical database rule

`public.communication_pair_authorized(actor, recipient, school)` permits only:

- student/apprentice ↔ actively assigned instructor
- student/apprentice ↔ same-school admin/school_admin
- instructor ↔ same-school admin/school_admin

It rejects:

- student ↔ student
- instructor ↔ unrelated learner
- instructor ↔ instructor
- admin ↔ admin
- cross-school pairs
- disabled accounts
- pending/rejected accounts
- school-less accounts
- self messaging
- ended/inactive assignments for learner/instructor pairs

A platform admin with no school is not eligible for private-message pairs.

## RLS behavior

Thread SELECT remains participant-only so authorized historical conversations remain readable.

Thread INSERT requires:

- same-school context
- creator is the authenticated user
- creator is one of the two participants
- the canonical pair helper returns true

Message INSERT rechecks the canonical pair helper every time. This means assignment removal, account disabling, approval changes, or school moves prevent new sends without deleting historical evidence.

Read receipts remain participant-only and can only be added by the authenticated recipient for an incoming message.

## Compatibility

COM-2C intentionally does not:

- change the recipient picker
- activate admin messaging UI
- change current COM-1 server actions
- alter Bulletins
- add Realtime
- delete historical threads

The later COM-2D/2E/2F slices can use the generic participant model after this database boundary is certified.
