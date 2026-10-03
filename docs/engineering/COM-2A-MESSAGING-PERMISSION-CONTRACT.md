# COM-2A — Messaging Permission Contract

**Workstream:** ASCYN PRO Communications Expansion (COM-2)  
**Slice:** COM-2A — Messaging Permission Contract  
**Status:** CONTRACT / NO PRODUCTION BEHAVIOR CHANGE  
**Base:** `main` at `e250b19f8d0f67f5b27e5076b9038e8c0cd4b898`  
**Scope:** Direct-message authorization, recipient visibility, role boundaries, school isolation, and simplicity rules only.

## 1. Goal

Expand ASCYN PRO direct messaging so authorized school users can reach the right person without turning the platform into an unrestricted chat system.

The experience must be simple enough that a first-time user can send the correct message without training or contacting ASCYN PRO support.

Guiding principle:

> **Show only the people the user is allowed to message. Keep the interaction simple, restricted, and obvious.**

## 2. Core Communication Hierarchy

### Student
A student may initiate direct messages only to:
- the student's currently assigned instructor(s), subject to existing assignment authorization; and
- authorized school-admin users within the student's own school.

A student may never initiate or participate in a direct student-to-student conversation.

### Instructor
An instructor may initiate direct messages to:
- students the instructor is authorized to serve through the existing assignment model; and
- authorized school-admin users within the instructor's own school.

An instructor may not initiate messages to unrelated students or users in another school.

### School Admin
A school admin may initiate direct messages to:
- students within the admin's own school; and
- instructors within the admin's own school.

A school admin may not initiate messages to users belonging to another school.

### ASCYN Admin
ASCYN-level administrative/support access must remain explicitly authorized and auditable.

ASCYN admin access does not automatically mean unrestricted participation in every school conversation. Any support or oversight pathway added later must be intentionally defined, permission-checked, and recorded.

## 3. Required Allow / Deny Matrix

| Sender | Recipient | Result |
| --- | --- | --- |
| Student | Assigned instructor | ALLOW |
| Student | School admin in same school | ALLOW |
| Student | Another student | DENY |
| Student | Unassigned instructor | DENY |
| Student | User in another school | DENY |
| Instructor | Assigned/authorized student | ALLOW |
| Instructor | School admin in same school | ALLOW |
| Instructor | Unassigned/unrelated student | DENY |
| Instructor | Instructor in another school | DENY unless separately authorized in a future contract |
| Instructor | User in another school | DENY |
| School admin | Student in same school | ALLOW |
| School admin | Instructor in same school | ALLOW |
| School admin | User in another school | DENY |
| Any role | Deactivated/ineligible recipient | DENY |
| Any role | Manually injected unauthorized recipient ID | DENY |

This matrix is the minimum contract. Future expansion requires a new explicit authorization decision; it must not be inferred from UI convenience.

## 4. Student Bottleneck Rule

Students are the intentionally restricted role.

Students can message **upward**, not **sideways**.

They may contact:
- their assigned instructor; and
- their school admin.

They may not:
- browse classmates;
- search classmates;
- start student group chats;
- message another student through a guessed ID;
- message random instructors;
- cross school boundaries.

Student-to-student direct messaging is prohibited at both the UI and database authorization layers.

## 5. Recipient Visibility Contract

The recipient picker must never behave like a universal directory.

The application must calculate the authorized recipient set before rendering choices.

### Student recipient picker
Show only:
- assigned instructor(s);
- authorized school admin(s).

### Instructor recipient picker
Show only:
- assigned/authorized students;
- authorized school admin(s).

### School-admin recipient picker
Show only:
- active students in the admin's school;
- active instructors in the admin's school.

Search, filtering, and typeahead must operate only within this already-authorized set.

If a user cannot message someone, that person should not appear in the picker.

## 6. Simplicity Contract

The primary workflow must remain:

`Messages → New Message → Pick Person → Type → Send`

Do not require users to understand:
- RLS;
- assignments;
- tenant boundaries;
- participant IDs;
- thread IDs;
- authorization rules;
- database errors.

The product handles those rules invisibly.

### Recipient presentation
Every selectable recipient must show:
- person's display name;
- plain-language role label;
- school context only when needed to avoid ambiguity.

Examples:
- `Sarah Johnson — Instructor`
- `Aaron Valles — School Admin`

Do not expose internal role slugs such as `school_admin`.

## 7. Inbox Simplicity Contract

Keep the primary organization limited to:
- Inbox
- Unread
- Archived

Each conversation should show:
- recipient/other participant name;
- role;
- latest-message preview;
- timestamp;
- unread state.

Do not add unnecessary messaging modes or administrative controls to the primary user flow.

## 8. Direct Messages vs Bulletins

Direct messages and bulletins must remain distinct.

### Direct Message
Private, targeted person-to-person communication.

### Bulletin
Announcement-style communication to an authorized audience.

Do not merge bulletin feeds into direct-message threads.

Do not silently convert a direct message into a broadcast.

## 9. Conversation Purpose Labels

Purpose labels may be offered only if they do not make the basic flow harder.

Approved simple labels for future implementation:
- General
- Student Progress
- Attendance
- School Question
- Technical Help

These should be optional unless a later operational requirement proves otherwise.

The user must still be able to send a normal message without navigating extra mandatory classification screens.

## 10. Authorization Enforcement

UI restrictions are not security controls.

The server/database authorization layer must independently reject:
- student-to-student messaging;
- cross-school messaging;
- instructor-to-unassigned-student messaging;
- manually injected recipient IDs;
- unauthorized thread reads;
- unauthorized replies;
- thread creation involving inactive/ineligible users.

A hidden UI control is insufficient. The same relationship rules must be enforced at the authoritative backend/RLS/runtime layer.

## 11. Existing COM-1 Behavior That Must Be Preserved

COM-2 may expand allowed relationships, but it must not regress the certified COM-1 behavior:

- thread organization;
- read/unread tracking;
- unread counts;
- archive behavior;
- duplicate-send protection;
- duplicate-read protection;
- bulletin delivery;
- bulletin acknowledgment;
- audit-event behavior;
- mobile usability;
- current assignment-based student/instructor controls.

No COM-2 slice may weaken cross-school isolation.

## 12. Inactive / Removed / Changed Relationships

### Deactivated user
A deactivated/ineligible user must not appear as a new-message recipient.

Existing history should remain readable only where authorized by retention and current access rules.

### Instructor assignment removed
Removing an instructor assignment must prevent creation of new student↔instructor conversations unless another valid authorization path exists.

Existing historical messages must not automatically grant ongoing authorization.

### School move
When a user moves schools, new-message eligibility must resolve from the current canonical school relationship.

Historical data must never create a cross-school messaging path.

## 13. Failure UX

Technical permission language should not be shown to ordinary users.

Avoid:
- `RLS policy violation`
- `Unauthorized recipient relationship`
- raw database errors

Use plain messages such as:
- `You can't message this person.`
- `This person is no longer available for new messages.`
- `Your message couldn't be sent. Try again.`

The strongest UX remains preventing invalid recipients from appearing in the first place.

## 14. Audit Requirements

Important communication authorization events should be traceable.

Future implementation should preserve or add auditable evidence for:
- thread created;
- sender identity;
- recipient identity;
- sender/recipient roles at creation;
- school relationship used for authorization;
- assignment relationship when relevant;
- message sent;
- message read;
- archive action;
- rejected unauthorized creation attempt, where appropriate for security/support diagnostics.

Audit data is primarily for support, accountability, and investigation—not for cluttering normal messaging screens.

## 15. Accessibility and Mobile Requirements

The final implementation must support:
- keyboard navigation;
- visible focus;
- screen-reader labels;
- readable role labels;
- large mobile touch targets;
- clear back navigation;
- no color-only unread indicator;
- no horizontal scrolling for normal messaging;
- simple empty states.

Example student empty state:

> **No messages yet.**  
> Select **New Message** to contact your instructor or school admin.

## 16. Explicit Non-Goals

COM-2 does not authorize:
- student-to-student chat;
- student group chat;
- unrestricted school directory browsing;
- social feeds;
- cross-school messaging;
- public chat rooms;
- instructor access to unrelated students;
- silent ASCYN staff access to private conversations;
- replacing Bulletins;
- adding realtime as a requirement;
- adding unrelated communications features.

## 17. Planned COM-2 Slices

### COM-2A — Messaging Permission Contract
This document. No production behavior change.

### COM-2B — Authorized Recipient Model
Create a canonical server-side recipient resolver using existing role, school, and assignment evidence.

### COM-2C — Database / RLS Enforcement
Enforce the same matrix against thread creation, reads, replies, and recipient injection.

### COM-2D — New Message UX
Implement the simple recipient picker and `Pick Person → Type → Send` flow.

### COM-2E — Admin / Instructor Expansion
Enable same-school admin↔instructor and authorized admin↔student relationships.

### COM-2F — Student Upward Messaging
Enable student→school-admin while preserving student→assigned-instructor and blocking student→student.

### COM-2G — Inbox / Conversation Simplicity
Verify Inbox / Unread / Archived, role labels, back flow, empty states, and errors.

### COM-2H — Audit / Failure Hardening
Verify authorization failures, audit events, duplicate protections, relationship changes, deactivation, and school moves.

### COM-2I — Mobile / Accessibility
Verify mobile flow, keyboard/focus, screen readers, touch targets, labels, and non-color unread semantics.

### COM-2J — Final Certification
Run full permission-matrix regression, Engineering Verification, exact-head verification, Vercel preview, post-merge exact-main production verification, and representative user smokes.

**After COM-2J passes, STOP. Do not automatically begin another workstream. Review results and explicitly plan the next move.**

## 18. COM-2 Completion Standard

COM-2 may be certified GREEN only when all of the following are proven:

- student→assigned instructor works;
- student→same-school admin works;
- student→student is blocked;
- student→unassigned instructor is blocked;
- instructor→assigned student works;
- instructor→same-school admin works;
- admin→same-school instructor works;
- admin→same-school student works;
- cross-school messaging is blocked;
- injected unauthorized recipient IDs are blocked;
- old authorized conversations still behave correctly;
- unread/archive/duplicate protections remain correct;
- Bulletins remain unaffected;
- mobile and accessibility requirements pass;
- production deployment is verified on the exact merged main commit.

## 19. Stop Rule

ASCYN PRO development must not roll directly from COM-2 final certification into a new feature or workstream.

At the end of COM-2:
1. report exactly what was completed;
2. report any remaining limitations;
3. freeze COM-2 unless a real production issue appears;
4. review active gates and pilot evidence;
5. explicitly choose and plan the next move before coding begins.
