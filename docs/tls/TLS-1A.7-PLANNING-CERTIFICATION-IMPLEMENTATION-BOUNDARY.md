# TLS-1A.7 — Planning Certification + Implementation Boundary

Status: GREEN / PLANNING CERTIFIED — NO RUNTIME TLS CODE AUTHORIZED BY THIS DOCUMENT

Protected production baseline: 03bbd2f5793ca6fa5485dc1abcac0985e6f17801
Planning chain audited: TLS-1A.1 through TLS-1A.6

## Certification purpose

Audit the six planning contracts as one system, resolve contradictions before implementation, define the smallest safe TLS implementation surface, and explicitly protect the certified Chapters 1–21 architecture.

## Chain audit

### TLS-1A.1 — status vocabulary
PASS. Strong / Improving / Needs Attention remain the only mastery statuses. Not Enough Evidence is an evidence state.

### TLS-1A.2 — content load
PASS. Existing certified evidence is sufficient. TLS adds no routine content, quiz, or assessment layer.

### TLS-1A.3 — evidence-to-status mapping
PASS WITH CLARIFICATION BELOW. Deterministic precedence and Improving → Strong rules are compatible with the certified evidence model.

### TLS-1A.4 — instructor contract
PASS. One score + one status + one reason + one action; deeper evidence is progressive disclosure.

### TLS-1A.5 — student contract
PASS. Feedback is behavioral and low-pressure; protected formal assessment answers remain protected.

### TLS-1A.6 — lifecycle/edge cases
PASS WITH CLARIFICATIONS BELOW. Authoritative persisted evidence, idempotency, cycle boundaries, and conservative ambiguous-state handling are compatible with the certified system.

## Contradictions / ambiguities resolved

### 1. Score vs concept mastery
Earlier planning text sometimes says “score/mastery” as though they are interchangeable.

LOCK:
- **Displayed score** = existing certified chapter-grade result.
- **Concept mastery** = diagnostic evidence used to explain weak concepts and intervention state.
- TLS must not substitute concept mastery for the displayed certified score.
- Status may consume certified intervention/mastery facts, but it never invents a second displayed score.

### 2. “Below 80” requires sufficient authoritative evidence
LOCK:
- below-80 only produces Needs Attention when the relevant certified result is sufficiently established;
- incomplete/missing evidence alone remains Not Enough Evidence unless a required intervention already exists.

### 3. Fresh normal evidence after recovery
LOCK:
- “fresh” means authoritative non-remediation evidence persisted after successful recovery;
- it must update the relevant certified evidence context;
- the resulting current certified result must remain >=80%;
- pre-recovery evidence cannot be reused;
- no TLS-only confirmation activity may be created.

### 4. Safety vs compliance ordering
LOCK:
- unresolved urgent bodily-safety has highest intervention priority;
- unresolved mandatory compliance/legal is next;
- both force Needs Attention while unresolved;
- each keeps its already-certified recovery semantics. TLS does not turn compliance into bodily-safety or vice versa.

### 5. New-cycle reset
LOCK:
- a cycle reset is explicit/authoritative, never inferred from time, refresh, login, or page navigation;
- unresolved mandatory recovery cannot be discarded by a new cycle;
- resolved historical evidence remains history but does not permanently force a current status.

### 6. Needs Attention → Strong direct transition
LOCK:
- normal visible lifecycle is Needs Attention → Improving → Strong;
- an atomic recomputation may resolve directly to Strong only when authoritative data already proves successful recovery plus qualifying post-recovery normal evidence. The UI need not manufacture an artificial intermediate render.

### 7. Ambiguous/out-of-order evidence
LOCK:
- persisted authoritative ordering wins;
- if ordering cannot be established, do not promote;
- preserve last defensible state, or Not Enough Evidence if none exists.

## Implementation architecture

TLS is a **derived orchestration/presentation layer**. It reads certified evidence and returns a deterministic presentation result. It does not own chapter grading, remediation creation, reassessment evaluation, or canonical content.

### New core module allowed
Preferred new namespace:
- `src/lib/tls/types.ts`
- `src/lib/tls/status-resolver.ts`
- `src/lib/tls/reason-action.ts`
- `src/lib/tls/evidence-adapter.ts`
- `src/lib/tls/__tests__/*`

Responsibilities:
- normalize read-only certified facts into a TLS input contract;
- resolve evidence state/status deterministically;
- choose one primary reason/action;
- order multiple intervention areas;
- expose explainable output for instructor/student presentation.

The resolver should be pure wherever possible.

### New presentation components allowed
Preferred:
- `src/components/tls/InstructorLearningStatus.tsx`
- `src/components/tls/StudentLearningFeedback.tsx`
- `src/components/tls/TlsStatusBadge.tsx`
- `src/components/tls/__tests__/*`

These components may render TLS output but must not calculate grades or independently decide remediation thresholds.

### Existing integration surfaces that MAY be minimally touched
Only after explicit coding authorization:
- instructor student detail / roster surfaces that need to display TLS output;
- student chapter/progress/remediation surfaces that need to display TLS feedback;
- server-side read/composition code needed to collect already-certified evidence for the TLS adapter;
- tests protecting those integrations.

Known candidate instructor surface:
- `src/app/instructor/student/[studentId]/page.tsx`

Exact student/instructor integration files must be confirmed from the implementation branch before edits; this planning document does not authorize broad page rewrites.

## Frozen / prohibited implementation surface

TLS implementation MUST NOT modify merely to make TLS work:
- `src/lib/concept-mastery/shared-grading.ts` grade weights or calculation;
- canonical Chapter 1–21 concept registries/content;
- Chapter 1–21 flashcard, lesson, assessment, micro-check, scenario, or reassessment banks;
- reassessment question mappings/reserves;
- certified recovery thresholds;
- `src/lib/remediation/detection-orchestrator.ts` detection/recovery semantics;
- server-authoritative remediation/reassessment RPC semantics;
- immutable evidence/history rules;
- same-school RLS/authorization/privacy rules;
- Chapter 19 certified urgent-safety behavior;
- Chapter 21 certified compliance behavior.

If implementation appears to require changing any frozen item, STOP and treat it as a new requirement/regression requiring a separate explicit review. Do not silently expand TLS scope.

## Database boundary

Default implementation target: **no new database table and no migration for TLS status itself.**

Status should be derived from authoritative evidence rather than persisted as a second source of truth.

A future performance cache/materialized view is outside this authorization and would require separate review with invalidation/replay rules.

## API/security boundary

- compute/compose TLS state server-side when private evidence is required;
- never send hidden answer keys or internal security fields to the client;
- preserve same-school authorization before staff TLS data is composed;
- no client-controlled status, recovery result, safety flag, or override;
- no “mark Strong” mutation endpoint.

## Minimum implementation sequence

If the user explicitly authorizes coding, implement in this order:

1. **TLS-1B.1 — Types + Pure Status Resolver**
   - no UI;
   - no DB writes;
   - table-driven tests for every TLS-1A.3/A.6 transition and precedence rule.

2. **TLS-1B.2 — Certified Evidence Adapter**
   - read-only composition of existing grade/mastery/remediation/recovery facts;
   - prove no second grade calculation;
   - prove safety/compliance precedence.

3. **TLS-1B.3 — Instructor Presentation**
   - one score/status/reason/action;
   - +N weak-area summary;
   - progressive drill-down.

4. **TLS-1B.4 — Student Feedback**
   - low-pressure state messaging;
   - no answer leakage;
   - no extra TLS work.

5. **TLS-1B.5 — Lifecycle/Adversarial Integration Tests**
   - concurrent cycles;
   - retries/replay;
   - out-of-order evidence;
   - interrupted work;
   - stale evidence;
   - new-cycle behavior;
   - Improving → Strong fresh-evidence lock.

6. **TLS-1B.6 — End-to-End Certification**
   - verify frozen Chapters 1–21 contracts unchanged;
   - Engineering Verification;
   - Vercel;
   - no merge without explicit authorization.

## Required resolver output contract

Implementation should converge on a result equivalent to:

- `displayScore: number | null`
- `evidenceState: 'sufficient' | 'not_enough_evidence'`
- `status: 'strong' | 'improving' | 'needs_attention' | null`
- `primaryReason`
- `recommendedAction`
- `primaryConcept` (learner-friendly metadata where applicable)
- `additionalAreaCount`
- `openRequiredIntervention`
- `explanation/audit metadata` server-side as needed

Exact TypeScript naming may change during implementation; semantics may not.

## Acceptance tests required before implementation can be called GREEN

At minimum prove:
- insufficient evidence never becomes Needs Attention solely from missing work;
- sufficient >=80 with no open requirement → Strong;
- sufficient <80 → Needs Attention;
- passing score + unresolved safety/compliance → Needs Attention without altering score;
- successful recovery → Improving;
- pre-recovery normal evidence cannot promote Improving → Strong;
- qualifying post-recovery normal evidence can promote Improving → Strong;
- one recovered concept cannot hide another open cycle;
- duplicate/replayed evidence cannot double-transition;
- client arrival order cannot determine status;
- time alone cannot change status;
- resolved prior-cycle miss does not permanently block Strong;
- unresolved mandatory recovery survives cycle transition;
- no manual Strong override;
- Chapters 1–21 certified grading/content/recovery invariants remain unchanged.

## Certification result

**GREEN — TLS-1A planning chain is internally consistent after the clarifications above.**

Implementation can be isolated to a new TLS resolver/adapter/presentation layer plus minimal read-only integration points. There is no identified requirement to reopen the certified Chapters 1–21 content, grading mathematics, remediation semantics, reassessment reserves, or security model.

## Authorization boundary

This certification **does not authorize runtime coding by itself**.

Next task after explicit user authorization:
**TLS-1B.1 — Types + Pure Status Resolver.**

No production merge is authorized. Every implementation stage remains subject to tests/checks, and any eventual merge requires separate explicit user authorization.
