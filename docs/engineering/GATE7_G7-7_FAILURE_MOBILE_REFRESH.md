# G7-7 — Failure + Mobile Refresh Hardening

## Product Boundary
> **Product-boundary check:** PASS — this Gate complies with `docs/engineering/ASCYN_PRODUCT_BOUNDARY_CONTRACT.md` and is classified as **COEXIST**. No DO NOT BUILD capability is introduced.

**Guarded integration zone contact:** NONE. G7-7 changes communications reliability only and does not touch H&A, onboarding/roster, or Admin Reporting.

## Goal
Make communications survive mobile navigation, refreshes, delayed responses, and recoverable failures without stale UI, duplicate actions, optimistic ghost state, or loss of confirmed persisted communication.

## Locked behavior
G7-7 does not add new messaging scope. It preserves:
- existing participant permissions;
- one-to-one conversation model;
- existing archive rules;
- persisted unread/read truth;
- bulletin separation;
- no Realtime requirement.

## Failure requirements
Every state-changing communication action must:
- return a safe visible success/failure result;
- keep raw database/RLS internals out of the UI;
- preserve stable operation identity across retry where exactly-once behavior is required;
- never show failed persistence as success;
- retain enough diagnostic evidence to investigate real failures without logging private message bodies.

## Mobile navigation requirements
A delayed request must not overwrite newer UI state after the user:
- opens another conversation;
- returns to the conversation list;
- switches into compose mode;
- completes a newer navigation action.

Database persistence remains authoritative. UI request order is not authoritative.

## Refresh requirements
A full refresh must reconstruct from persisted state:
- thread list;
- archive state;
- unread counts;
- message history;
- bulletin publication/acknowledgment state.

No local-only state may be required to recover confirmed communication truth.

## Retry requirements
- message retry keeps the same operation identity until confirmed success or user changes the intent;
- bulletin retry remains exactly-once under G7-6;
- read and acknowledgment retries remain idempotent;
- retry after uncertain response must converge to the persisted result.

## Certified implementation findings
### Stale response race
The pre-G7-7 message center allowed an older asynchronous conversation load to finish after a newer mobile navigation and overwrite current selection/state.

G7-7 adds a monotonic view epoch so stale load/read responses are ignored by the UI after navigation changes. This affects display convergence only; it does not cancel or weaken database authorization/persistence.

### Failure retry recovery
The existing G7-3 idempotency keys remain stable when an unchanged send is retried after an uncertain/failing response. If the user edits the body or changes the compose recipient, the operation identity is cleared so the edited submission is treated as a new user intent rather than a mismatched retry.

### Back-navigation convergence
Late failures are only shown when the initiating view is still current. A delayed failure after the user backs out, switches conversation, or enters compose cannot overwrite the newer screen with stale error/status state. Confirmed persisted success may still update the thread list because server truth is authoritative.

### Refresh convergence
The instructor/admin and student production message routes reload `loadCommunicationThreads()` on the server. Full refresh therefore reconstructs thread/archive/unread state from Postgres rather than local browser storage.

### Diagnostic evidence
Server actions retain operation-scoped diagnostic logging while returning safe generic user-facing failures. G7-7 does not add message bodies to diagnostics and does not expose raw database/RLS errors to ordinary users.

## Non-goals
No:
- group chat;
- attachments;
- reactions;
- message editing/deleting;
- Realtime;
- SMS/email;
- broad Gate 8 redesign;
- H&A/grading/readiness/pilot changes.

## Exit criteria
G7-7 is GREEN only when:
- stale mobile responses cannot reopen/overwrite a newer view;
- failed sends preserve retry identity and do not create duplicates;
- confirmed sends survive back/refresh through persisted reload;
- archive/read/unread state converges after refresh;
- visible errors remain safe;
- diagnostic logging remains content-minimal;
- full exact-head CI and Vercel preview pass;
- any required live database verification passes;
- merged production deployment is READY.
