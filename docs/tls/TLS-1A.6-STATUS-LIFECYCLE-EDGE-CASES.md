# TLS-1A.6 — Status Lifecycle + Edge-Case Contract

Status: COMPLETE / LOCKED FOR PLANNING — NO RUNTIME CODE CHANGES

Baseline protected: 03bbd2f5793ca6fa5485dc1abcac0985e6f17801
Depends on: TLS-1A.1 through TLS-1A.5

## Goal

Make TLS status deterministic under messy real-world conditions without changing certified Chapters 1–21 evidence, grading, recovery, security, or history contracts.

Core rule: **derive current status from authoritative current-cycle evidence; never mutate history to make the status easier to calculate.**

## Authoritative ordering

Evidence is evaluated by:
1. learning-cycle identity;
2. authoritative persisted event/result identity;
3. evidence timestamp;
4. certified workflow state.

UI arrival/render order is never authoritative.

Duplicate/replayed events must not produce duplicate status transitions. Existing immutable/idempotent evidence contracts remain authoritative.

## Conflicting evidence

A single good event does not erase an unresolved required intervention, and a single isolated miss does not automatically erase Strong unless the certified detector establishes a new gap.

Precedence:
1. unresolved urgent bodily-safety;
2. unresolved compliance/legal;
3. open or failed required recovery;
4. sufficient current mastery below 80%;
5. successful recovery awaiting fresh confirmation;
6. sufficient current mastery >=80% with no unresolved requirement;
7. insufficient evidence.

When evidence conflicts, use this precedence rather than averaging status labels.

## Multiple simultaneous remediation cycles

Status is student/concept-context aware, but the instructor/student summary uses the highest unresolved intervention need.

Rules:
- any unresolved required cycle keeps the aggregate learning-area status at **Needs Attention**;
- successful recovery of one concept does not hide another open concept;
- urgent safety outranks compliance, which outranks ordinary recovery;
- ordinary unresolved concepts are ordered by intervention need then lowest mastery;
- default UI shows one primary focus plus **+N more areas**;
- each cycle retains its own evidence and outcome.

When every required cycle succeeds, status may become **Improving** if fresh normal confirmation is still pending.

## Interrupted or incomplete work

An interrupted normal activity:
- does not become a failure merely because it is incomplete;
- contributes only evidence the certified system validly persisted;
- may remain **Not Enough Evidence** if sufficiency is not met.

An interrupted required remediation/reassessment:
- remains an unresolved required intervention;
- therefore status remains **Needs Attention**;
- resume the certified workflow rather than creating a new TLS task.

Do not fabricate a zero for abandoned/incomplete TLS presentation state.

## Retries

Normal practice retries follow existing certified evidence semantics and must not overwrite immutable first-attempt diagnostic history.

Required recovery retries:
- do not erase earlier failed/incomplete recovery;
- use the certified recovery workflow/reserve;
- only an authoritative successful recovery closes that required cycle;
- after success, move to **Improving** unless qualifying fresh normal evidence already exists after that recovery.

TLS must not create unlimited duplicate evidence merely because a user refreshes or retries a UI action.

## Evidence arriving out of order

Status must be recomputed from authoritative persisted evidence, not from the sequence in which the client receives events.

Examples:
- a late initial miss timestamped before a successful recovery does not reopen a completed recovery by itself;
- a new authoritative miss after recovery may establish a new gap if the certified detector says so;
- delayed display of an already-consumed reassessment result must not trigger a second transition;
- duplicate network submissions must resolve idempotently under the certified persistence contracts.

When event ordering is ambiguous, do not infer a promotion. Preserve the last defensible state until authoritative evidence resolves the ambiguity.

## Successful recovery and fresh evidence race

For **Improving → Strong**, qualifying fresh normal evidence must be timestamped/ordered after the authoritative successful recovery.

Normal evidence from before recovery cannot be reused as post-recovery confirmation.

If recovery and fresh evidence are recorded nearly simultaneously, authoritative persisted ordering decides. If ordering cannot be established, remain **Improving** rather than falsely promoting.

## New gaps after recovery

If a student is Improving and a new certified gap is detected:
- **Improving → Needs Attention**.

If a student is Strong and a new certified gap/required intervention is detected:
- **Strong → Needs Attention**.

Resolved historical misses remain preserved but do not count as currently open.

## Stale evidence

Existing certified recency weighting remains unchanged.

Time alone:
- does not promote Improving;
- does not automatically demote Strong;
- does not reopen resolved remediation.

If the certified mastery engine later produces sufficient current evidence below 80% because of new/recency-weighted evidence, normal precedence applies.

Do not invent a TLS expiration timer.

## New learning-cycle boundary

A new chapter/concept learning cycle gets a new current status context.

Rules:
- prior evidence/history remains preserved;
- prior resolved intervention does not automatically carry **Improving** into the new cycle;
- prior unresolved mandatory safety/compliance/recovery cannot be silently discarded merely by starting a new cycle;
- otherwise, new-cycle insufficient evidence begins as **Not Enough Evidence**;
- current-cycle evidence then resolves normally.

Cycle boundaries must be explicit/authoritative in implementation; do not infer a reset merely from elapsed time, logout/login, page refresh, or calendar date.

## Chapter completion / revisit

Completing a chapter does not delete its final status/history.

On later review:
- historical status may be shown as historical;
- new practice evidence does not silently rewrite the original certified completion record;
- if the product intentionally opens a new learning cycle, apply the new-cycle rules above.

## Safety/compliance invariants

No edge case can bypass a required safety/compliance recovery.

A passing aggregate score, successful ordinary recovery elsewhere, stale UI state, retry, refresh, or cycle transition cannot override an unresolved mandatory requirement.

Certified thresholds remain:
- 80% ordinary recovery;
- 100% urgent bodily-safety recovery where certified;
- Chapter 19 safety exception preserved;
- Chapter 21 compliance semantics preserved.

## Status transition matrix

Allowed:
- Not Enough Evidence → Strong
- Not Enough Evidence → Needs Attention
- Strong → Needs Attention
- Needs Attention → Improving
- Improving → Strong
- Improving → Needs Attention
- Needs Attention → Strong only when the same authoritative recomputation proves recovery is satisfied **and** qualifying post-recovery normal evidence already exists; otherwise pass through Improving.

Not triggered by:
- page refresh;
- login/logout;
- duplicate event;
- client render order;
- instructor preference;
- elapsed time alone.

## Failure-safe behavior

When required data is missing, contradictory, or cannot be authoritatively ordered:
- never invent Strong;
- never fabricate a failing score;
- preserve the last defensible status when one exists;
- otherwise show **Not Enough Evidence**;
- surface a diagnostic/system issue to authorized staff if the implementation can identify one;
- do not expose internal error/security details to students.

## Audit/history

Every status shown must be reproducible from preserved authoritative evidence.

Implementation should be able to explain:
- current status;
- primary reason;
- evidence/cycle used;
- last meaningful transition;
- open required interventions.

This does not authorize a new student-facing event log.

## Invariants

- No second grade calculation.
- No TLS-only evidence generation.
- No history deletion or overwrite.
- No status based on client arrival order.
- No duplicate transition from replay.
- No incomplete normal activity treated automatically as failure.
- No bypass of unresolved safety/compliance.
- No time-based automatic promotion/demotion.
- No implicit cycle reset.
- No manual Strong override.
- Chapters 1–21 remain frozen.
- Existing authorization/privacy remains authoritative.

## Gate result

**GREEN.** The lifecycle is deterministic under conflicting, concurrent, incomplete, retried, stale, and out-of-order evidence while preserving the certified system underneath.

## Next gate

**TLS-1A.7 — Planning Certification + Implementation Boundary.**

Audit TLS-1A.1 through TLS-1A.6 as one planning chain, resolve contradictions, lock the minimum implementation surface, identify exact files/services that may be added or touched, and explicitly protect the frozen Chapters 1–21 baseline before any coding authorization.

No runtime TLS coding is authorized until TLS-1A.7 is GREEN and the user explicitly authorizes implementation.
