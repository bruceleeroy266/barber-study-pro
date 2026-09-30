# C20-5 — Micro-Checks + Immutable Evidence

## Parent head
C20-5 is stacked on C20-4 head `5c57838af739112bd3777d277b235daeb61e74e2`.

## Scope
C20-5 adds exactly 12 fresh Chapter 20 micro-check questions and binds them to the shared immutable first-attempt evidence architecture.

It does not change:

- the six canonical concept families;
- the 60-card flashcard bank;
- the 17-question initial assessment;
- the 80% chapter-assessment threshold;
- the shared 20/10/40/15/15 grading weights;
- remediation or reassessment behavior.

## Micro-check inventory
Exactly two fresh questions are created for each canonical family:

- mcq-20-001..002 — professional transition/workplace expectations
- mcq-20-003..004 — teamwork/workplace relationships
- mcq-20-005..006 — employment classification/compensation
- mcq-20-007..008 — financial responsibility/income reporting
- mcq-20-009..010 — ethical selling/retailing
- mcq-20-011..012 — client retention/marketing/consent

The six placements remain exactly where C20-2 reserved them:

- after ch20-lo1
- after ch20-lo2
- after ch20-lo3
- after ch20-lo4
- after ch20-lo5
- after ch20-lo6

## Namespace separation
Micro-check IDs use `mcq-20-###` and never reuse `qq-20-##` assessment IDs.

No micro-check prompt duplicates an initial-assessment prompt.

## Immutable first-attempt evidence
The live UI submits to `/api/chapter-20/micro-check`.

The server:

1. authenticates the current user;
2. resolves the canonical question from the server-side bank;
3. derives concept, difficulty, and correctness server-side;
4. inserts into the shared `chapter_micro_check_attempts` table;
5. on the unique-first-attempt conflict, returns the already-preserved row rather than overwriting it.

The client never sends a user ID, concept ID, correctness value, or difficulty as authority.

## Evidence binding
Persisted rows adapt into shared evidence with:

- chapterId: ch-20
- source: micro_check
- attemptPhase: initial
- canonical concept family
- real answered_at timestamp
- persisted correctness

The 20% micro-check grade input is derived from persisted rows.

## Completion integrity
Chapter 20 already contains scenario/application knowledge-check sections.

C20-5 prevents those scenario sections from marking the chapter's knowledge-check signal complete by themselves.

For Chapter 20, knowledge-check completion now requires:

- all existing scenario/application sections complete, when present; and
- all 12 immutable micro-check first attempts persisted.

This closes a completion bypass that would otherwise allow the new micro-check requirement to be skipped.

## Criticality boundary
C20-5 creates evidence only.

Chapter 20 still has no bodily-safety family. Compliance escalation for employment classification, income reporting, and client consent belongs to C20-6 and is not fabricated here.

## Certification target
C20-5 is GREEN only when the exact final head passes:

1. all prior C20-1 through C20-4 certification tests;
2. C20-5 micro-check/evidence certification;
3. TypeScript/unit/build Engineering Verification;
4. exact-head Vercel deployment.

## Next phase
**C20-6 — Gap Detection + Compliance Escalation + Targeted Remediation:** combine initial assessment, immutable micro-check, flashcard, and real scenario/application evidence into canonical concept-gap detection; implement compliance escalation without inventing bodily-safety escalation; and route weak concepts into targeted remediation.
