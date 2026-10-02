# COM-1E — Final Communications Certification

Status: IN PROGRESS

Base production main at start:
`1e4b27c615ec42de017c9e8dedb85cd955cb68b0`

COM-1D.7 Realtime decision: DEFERRED FOR PILOT.

## Certification scope

COM-1E certifies the complete production communications chain against the locked COM-1A contract.

### Messaging
- assigned student ↔ instructor only
- same-school isolation
- thread open/reply/history
- Inbox / Unread / Archived organization
- unread counts from immutable messages + read receipts
- idempotent read behavior
- instructor archive control
- archived threads non-sendable
- duplicate interaction protection
- loading/error/empty behavior
- mobile layout
- accessibility
- no Realtime

### Bulletins
- instructor/admin authoring boundaries
- school/program/student audience rules
- priority, pinning, scheduling, expiration
- student delivery authorization
- acknowledgment behavior
- manager acknowledgment visibility
- archive behavior
- no bulletin replies/comments/reactions

### Permissions and privacy
- same-school isolation
- assigned-pair enforcement for private messaging
- no student-to-student messaging
- no unrelated instructor access
- no private-message browsing by admin/school_admin
- ordinary clients cannot write communication audit rows directly
- no service-role bypass in communication runtime

### Audit behavior
- assignment_created
- assignment_ended
- thread_archived
- bulletin_created
- bulletin_published
- bulletin_updated
- bulletin_archived
- append-only audit table for ordinary clients
- private trigger helpers not directly executable by ordinary roles

### Production certification
- exact-head Engineering Verification
- exact-head Vercel
- exact merged-main production deployment
- live route protection
- production RLS/privilege smoke
- production runtime-error check
- rollback leaves no certification data

## Current evidence entering COM-1E

- COM-1D.4 production bulletin smoke: passed.
- COM-1D.5 production audit-event/privilege smoke: passed.
- COM-1D.6 production messaging smoke: passed.
- Exact COM-1D.6 merged production deployment is READY.
- Messaging production runtime errors in the final D.6 smoke: none.
- Realtime: intentionally deferred.

COM-1E is not GREEN until the complete cross-feature certification is run together against one exact current head.
