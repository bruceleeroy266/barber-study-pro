# C8-7 — Targeted Remediation + 5-Question Reassessment Reserve

## Goal

Use preserved Chapter 8 evidence to identify the exact concept families that need remediation, then require a fresh five-question reassessment without overwriting first-attempt evidence.

## Rules implemented in the first C8-7 slice

### Ordinary concept gaps
A concept is targeted when:
- mastery is at or below 70%, or
- there are at least two preserved initial misses.

Ordinary targeted concepts use:
- 5-question formal reassessment,
- 80% pass threshold.

### Critical safety concepts
The stricter C8 safety families remain:
- `ch8-equipment-safety`
- `ch8-light-therapy-safety`

A single scenario-level miss can place the concept on targeted review/watch.

Repeated hard safety misses that reach the existing urgent escalation require:
- instructor review,
- targeted remediation,
- 5-question formal reassessment,
- 100% pass threshold.

### Evidence integrity
C8-7 never rewrites or replaces initial evidence.

Reassessment records must be added as:
- source: `remediation_reassessment`
- attempt phase: `reassessment`

The original evidence array remains unchanged and the recovery evidence is appended as a separate later phase.

## Reassessment reserve — current implementation

The reserve now contains 50 fresh questions total: five for each of the ten canonical Chapter 8 concept families.

The two critical safety families still keep their stricter 100% pass threshold; the remaining eight concept families use the ordinary 80% formal reassessment threshold.

Reserve IDs use the `r8-` namespace so they cannot collide with:
- initial chapter assessment IDs (`qq-8-`)
- micro-check IDs (`mcq-8-`)

All safety reserve questions are application/scenario level.

## C8-7 final certification — CLOSED

C8-7 is complete.

Final adversarial certification covers the full chain:
- detected Chapter 8 concept gap;
- concept-targeted lesson blocks and flashcards;
- exactly five fresh reassessment questions drawn only from the locked `r8-` reserve;
- atomic persisted reassessment attempts plus typed `remediation_reassessment` recovery evidence;
- preserved first-attempt evidence with no rewriting;
- 80% recovery threshold for ordinary concept families;
- 100% recovery threshold for the two critical safety families when a formal safety remediation cycle is required;
- fail-closed handling for incomplete five-question evidence;
- cross-concept evidence-contamination rejection;
- updated Chapter 8 concept mastery after recovery evidence is appended.

Runtime hardening completed during final certification:
- the Chapter 8 mapping provider resolves historical `qq-8-` questions semantically but exposes only `r8-` reserve questions to formal reassessment selection;
- the student reassessment submission path applies the Chapter 8 80% / 100% formal recovery policy after exactly five persisted responses;
- the shared evaluation service remains authoritative for terminal cycle persistence and idempotency;
- the shared grading formula is unchanged.

Final certified code head before this documentation closure: `84d116c0ccfdde99066e5d8c073b66e56fd62ce1`.

Engineering Verification #644:
- TypeScript: GREEN
- changed-file lint: GREEN
- unit/integrity tests: GREEN
- production build: GREEN
- Bundle Size Check: GREEN
- Pilot Onboarding Certification: GREEN
- workflow conclusion: SUCCESS

Exact-head Vercel deployment:
- deployment `dpl_9NB2625sUykXT1UJ44oDmPu9oeh9`
- state: READY

PR #79 remains intentionally unmerged until Gabriel explicitly authorizes merge.

