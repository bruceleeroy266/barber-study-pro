# G7-1 — Gate 7 Communications Reliability Contract

**Project:** ASCYN PRO  
**Gate:** Gate 7 — Communications Reliability  
**Slice:** G7-1 — Contract Lock  
**Status:** CONTRACT ONLY — NO RUNTIME OR SCHEMA CHANGE  
**Baseline:** `main` at `6c562065d134ae24abd2c157b0d80697e825ebe6`  
**Authoritative roadmap goal:** Messaging and bulletins survive normal messy human behavior without duplicate state, unread drift, archive confusion, cross-user confusion, or silent communication loss.

## 1. Gate 7 goal

Gate 7 certifies **reliability**, not new communications scope.

The current COM-1/COM-2 authorization model remains authoritative unless a later Gate 7 slice proves that a reliability repair requires a narrowly-scoped compatibility change.

Gate 7 is GREEN only when:
- duplicate sends and duplicate reads are prevented where appropriate;
- unread state is dependable;
- archive behavior is predictable;
- mobile use and refreshes do not corrupt state;
- multiple authorized users can interact without confusing message state;
- failures do not silently lose communication.

## 2. Existing behavior that is frozen

Gate 7 MUST preserve the current certified permissions and product separation:

### Direct messaging
- student/apprentice → assigned instructor: allowed;
- student/apprentice → same-school school admin/admin: allowed;
- instructor → assigned student/apprentice: allowed;
- instructor → same-school school admin/admin: allowed;
- school admin/admin → same-school student/apprentice: allowed;
- school admin/admin → same-school instructor: allowed;
- student → student: denied;
- student → unassigned instructor: denied;
- instructor → unrelated student: denied;
- cross-school messaging: denied;
- deactivated/ineligible recipient: denied;
- manually injected unauthorized recipient/thread IDs: denied.

### Bulletins
- remain separate from direct-message threads;
- retain current school/program/student targeting rules;
- retain one-way announcement semantics;
- retain acknowledgment semantics;
- no bulletin comments/replies/reactions are introduced by Gate 7.

### Privacy
- no unrestricted platform-admin browsing of private conversations;
- no cross-school visibility;
- no service-role shortcut in ordinary messaging runtime;
- immutable communication evidence is not hard-deleted by ordinary users.

## 3. Source-of-truth rule

Postgres persistence is authoritative.

Browser state, optimistic UI, React state, refresh timing, network retries, and future Realtime notifications MUST NOT become the source of truth for:
- whether a message exists;
- whether a message is read;
- thread unread count;
- thread archive state;
- bulletin publication state;
- bulletin acknowledgment state.

Gate 7 remains compatible with the existing decision to defer Supabase Realtime for the pilot.

Realtime is **not required** to close Gate 7.

## 4. Message-send reliability contract

### G7-M1 — Exactly-once user intent

One intentional send action must create at most one persisted message.

Normal retry conditions must not create duplicate message rows:
- rapid double tap/click;
- browser retry;
- server-action retry;
- mobile connection interruption after persistence but before response;
- user refresh after uncertain send result;
- two near-simultaneous submissions carrying the same operation identity.

UI locks such as `sendLockedRef` are useful UX protections but are **not sufficient** for Gate 7.

The authoritative send path must support server/database idempotency.

### G7-M2 — Idempotency identity

Implementation must use a stable client operation/message key or an equivalently strong database-safe mechanism.

Requirements:
- operation identity is scoped so one user's legitimate later message is not suppressed;
- the database enforces uniqueness for the idempotency identity;
- retrying the same operation returns/recognizes the already-persisted message instead of inserting another row;
- idempotency does not weaken sender/thread authorization.

### G7-M3 — No false success

A UI success state may be shown only after persistence is confirmed or an idempotent retry confirms that the intended row already exists.

If persistence fails:
- return a visible safe error;
- preserve the user's draft where practical;
- do not show the failed message as successfully sent;
- log enough server-side evidence to investigate the failure without exposing private message bodies unnecessarily.

## 5. Thread creation reliability contract

### G7-T1 — One active conversation per authorized pair

For the current one-to-one conversation model, concurrent attempts to open the same active authorized pair must not create duplicate active threads.

The rule applies regardless of participant order:
- A→B
- B→A

The current lookup-then-insert flow alone is not sufficient under concurrency.

Implementation must use a database-enforced canonical pair uniqueness rule, transactional/RPC protection, or an equivalently strong concurrency-safe mechanism.

### G7-T2 — Authorization is rechecked authoritatively

A stale recipient picker or stale browser tab must not create a thread if the relationship is no longer authorized.

Thread creation must re-evaluate:
- school;
- account status;
- role;
- assignment where applicable;
- current recipient eligibility.

## 6. Read / unread contract

### G7-R1 — Read evidence is idempotent

For each message and authorized recipient:
- at most one read receipt exists;
- retries/concurrent reads are harmless;
- sender cannot mark their own message as recipient-read evidence;
- another user cannot create the receipt on the recipient's behalf.

The existing `unique(message_id, reader_id)` design remains the basis of this invariant.

### G7-R2 — Unread count definition

For an actor and thread:

> unread count = persisted incoming messages visible to that actor − persisted read receipts by that actor for those messages.

Unread is never inferred only from:
- last-open time;
- local storage;
- current browser session;
- visual selection state.

### G7-R3 — Unread state must converge

After refresh/reload/navigation, unread state must converge to the same persisted result across:
- desktop;
- mobile;
- multiple tabs;
- repeated reads;
- switching Inbox / Unread / Archived filters.

Unread count must never:
- become negative;
- count the actor's own messages;
- remain stale after confirmed read persistence;
- disappear because a request failed silently.

## 7. Archive contract

Gate 7 locks the current archive model as a **persisted thread state**, not a browser-only hide action.

### G7-A1 — Archived means non-sendable

When a thread is archived:
- history remains readable by currently authorized participants subject to retention/access rules;
- ordinary sends into the archived thread are rejected at both runtime and authoritative database enforcement;
- refresh/mobile navigation must continue to show the same archived state;
- archived state must not be lost by a new session.

### G7-A2 — Archive transition is idempotent

Repeated archive attempts must not corrupt the thread or create misleading duplicate state.

### G7-A3 — No silent unarchive

Gate 7 does not introduce an unarchive/reopen feature unless a separately approved reliability slice proves it is required.

Opening a new authorized conversation after an archived conversation must follow one explicit implementation rule:
- either reopen through a separately authorized transition; or
- create/use the next active thread under a concurrency-safe pair rule.

The implementation slice must choose exactly one behavior and test it. It must not happen accidentally through race conditions.

## 8. Relationship-change contract

Authorization for **new actions** always uses current canonical relationships.

### Assignment removed
- new messages requiring the removed assignment must be rejected;
- historical rows are preserved;
- historical access must not become an accidental ongoing-send permission.

### User moved to another school
- no new cross-school message/thread path survives because of old history;
- old rows remain isolated according to certified retention/access policy.

### Account disabled/rejected
- user cannot start new communication;
- disabled/ineligible recipient cannot receive a new conversation/message;
- historical evidence is not silently deleted.

## 9. Multi-user / concurrency contract

Gate 7 must explicitly test messy simultaneous behavior.

Required cases:
- both participants open the same conversation at the same time;
- both attempt to initiate the same pair at nearly the same time;
- sender sends while recipient marks prior messages read;
- two recipient tabs mark the same messages read;
- archive races with send;
- assignment/eligibility changes race with send;
- mobile refresh occurs immediately after send/read/archive;
- a request returns after the user navigated away.

Correctness must come from persisted constraints/authorization, not request ordering luck.

## 10. Bulletin reliability contract

### G7-B1 — Publish is deterministic
A bulletin must not be duplicated by repeat publish submission.

### G7-B2 — Acknowledgment is exactly-once evidence
- one student may produce at most one acknowledgment per bulletin;
- retry/double tap is harmless;
- another user cannot acknowledge on that student's behalf;
- acknowledgment count reflects persisted unique acknowledgments.

### G7-B3 — Audience remains authoritative
Refresh or delayed requests must not expose a bulletin to a user who is outside its resolved authorized audience.

### G7-B4 — Schedule/expiration state is consistent
A bulletin must not oscillate between active/inactive because of client clock assumptions. Server/database timestamps are authoritative for publication and expiration eligibility.

## 11. Failure visibility contract

Gate 7 must remove silent communication failure modes.

For each state-changing operation:
- thread create;
- message send;
- mark read;
- archive;
- bulletin create/update/publish/archive;
- bulletin acknowledgment;

the system must provide:
1. a safe user-visible success/failure result;
2. deterministic persisted outcome;
3. support-diagnostic evidence for genuine failures;
4. no raw RLS/database internals exposed to ordinary users.

Logging must avoid unnecessary private message-body content.

## 12. Refresh and mobile contract

Gate 7 is not the full Gate 8 mobile/accessibility program, but communications reliability must survive ordinary mobile behavior.

Required:
- back navigation does not discard a confirmed persisted message;
- refresh returns the same persisted thread/read/archive state;
- tapping Send twice does not duplicate a message;
- temporary loading state does not permit duplicate action;
- screen rotation/responsive rerender does not alter persisted state;
- stale UI is refreshed after confirmed mutations;
- no browser-local state is required to reconstruct unread/archive truth.

Deep mobile/accessibility certification beyond communication-state reliability remains Gate 8.

## 13. Audit/event contract

Existing immutable rows remain primary evidence for message/read/ack events.

Administrative/support audit evidence must remain available for:
- thread creation;
- archive transitions;
- authorization-related failures when useful for investigation;
- bulletin state changes.

Gate 7 SHOULD add an explicit idempotency/retry diagnostic signal where needed, but it must not duplicate private content into logs.

## 14. Explicit non-goals

Gate 7 does NOT authorize:
- student-to-student messaging;
- group chat;
- attachments;
- reactions;
- bulletin comments/replies;
- social/community feeds;
- unrestricted directory browsing;
- cross-school messaging;
- casual platform-admin private-message browsing;
- external SMS/email delivery;
- Realtime as a closure requirement;
- read typing indicators/presence;
- message editing/deleting;
- H&A changes;
- grading/readiness changes;
- curriculum changes;
- pilot-measurement changes;
- broad Gate 8 redesign.

Anything outside reliability goes to backlog unless it fixes a production blocker/security/data-integrity defect.

## 15. Required adversarial certification matrix

Gate 7 cannot close without automated and production-safe evidence for at least:

### Duplicate / retry
- double-click same send → one message;
- identical operation retry after simulated response loss → one message;
- two concurrent same-pair thread opens → one active thread;
- repeated mark-read → one receipt/message/reader;
- repeated bulletin acknowledgment → one acknowledgment/student/bulletin;
- repeat publish request → one published bulletin state.

### Unread
- incoming unread increments once;
- sender's own message does not increment own unread;
- mark read clears persisted unread correctly;
- refresh preserves the correct count;
- second tab converges;
- archived filter does not change underlying unread math.

### Archive
- archive persists after refresh;
- archived thread rejects send;
- concurrent archive/send resolves deterministically with no lost/ghost message;
- repeated archive is harmless;
- historical messages remain intact.

### Authorization under stale state
- assignment removed after UI load → send denied;
- user disabled after UI load → send denied;
- school move after UI load → send denied;
- injected thread/recipient ID → denied;
- cross-school access → denied.

### Failure
- DB rejection produces visible failure, not fake success;
- network/server failure does not create optimistic ghost state;
- retry after uncertain response resolves idempotently;
- diagnostic evidence exists without leaking private bodies.

### Bulletins
- publish retry does not duplicate;
- acknowledgment retry does not duplicate;
- expiration/scheduling follows server time;
- unauthorized audience cannot read/acknowledge.

## 16. Gate 7 implementation sequence

Implementation begins only after this G7-1 contract is merged and certified.

### Product Boundary requirement beginning with G7-6

Every Gate 7 slice from **G7-6 forward** must include this statement in its contract/certification document before implementation may be certified:

> **Product-boundary check:** PASS — this Gate complies with `docs/engineering/ASCYN_PRODUCT_BOUNDARY_CONTRACT.md` and is classified as **COEXIST**. No DO NOT BUILD capability is introduced.

The slice must also identify whether it touches a guarded integration zone. Gate 7 Communications normally does not; any exception requires explicit architecture review.

### G7-2 — Reliability collision audit
Inventory schema, runtime, UI and tests against every invariant above. Produce a finding matrix before changing behavior.

### G7-3 — Message + thread idempotency foundation
Add authoritative concurrency-safe send identity and active-pair thread protection. Preserve current permissions.

### G7-4 — Read/unread convergence hardening
Stress concurrent reads, multi-tab refresh, unread recomputation and safe retries.

### G7-5 — Archive + relationship-race hardening
Certify archive/send races, stale assignments, disabled users, school moves and historical access.

### G7-6 — Bulletin reliability hardening
Certify publish/ack idempotency, audience boundaries, scheduling/expiration and retry behavior.

### G7-7 — Failure/mobile refresh hardening
Certify visible failures, retry recovery, mobile refresh/back behavior and diagnostic evidence.

### G7-8 — Final adversarial certification
Run full COM-1 + COM-2 permission regression plus Gate 7 reliability matrix, live Supabase RLS/constraint verification, Engineering Verification, exact-head Vercel preview, merge, exact-production main, and production READY verification.

## 17. Gate 7 GREEN decision rule

Gate 7 is GREEN only when all are true:
- duplicate user intent cannot create duplicate persisted communication evidence where uniqueness is required;
- one-to-one thread creation is concurrency safe;
- read receipts are idempotent;
- unread counts are persisted-evidence correct after refresh and multi-tab use;
- archive behavior is deterministic and persisted;
- stale authorization cannot send;
- bulletins publish/acknowledge reliably;
- mobile refresh/navigation does not corrupt state;
- failures are visible and diagnosable;
- COM-1/COM-2 permission boundaries still pass;
- no cross-school leakage exists;
- production schema/RLS/constraints match the certified contract;
- exact merged production deployment is READY.

## 18. Stop rule

After G7-8 is GREEN:
- freeze Gate 7;
- do not add messaging features merely because they are convenient;
- move to Gate 8 only after reporting Gate 7 findings, limitations and production evidence.

Any later communications change must either:
1. repair a real production defect/security/data-integrity issue; or
2. be explicitly assigned to a future approved workstream.
