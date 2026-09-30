# C20-7 — Fresh Reassessment Reserve + Mastery Recovery

## Parent head
C20-7 is stacked on C20-6 head `0d24ebff9cd585b901df9c518805593847b3ef42`.

## Fresh reserve
Chapter 20 now has exactly **30 fresh reassessment questions**:

- 5 per each of the 6 canonical concept families;
- dedicated `r20-*` IDs;
- no reuse of `qq-20-*` initial-assessment IDs;
- no reuse of `mcq-20-*` micro-check IDs;
- no duplicated assessment or micro-check prompt;
- no recall-only recovery items.

The reserve is distributed as:

- `r20-transition-001..005`
- `r20-teamwork-001..005`
- `r20-classification-001..005`
- `r20-finance-001..005`
- `r20-selling-001..005`
- `r20-retention-001..005`

## Recovery threshold
Chapter 20 has no bodily-safety recovery pathway.

Both ordinary and compliance remediation use:

- exactly 5 fresh questions;
- 80% pass threshold;
- 4 of 5 correct passes.

Classification, tax/reporting, and client-consent compliance issues do **not** inherit a 100% urgent-safety threshold.

## Immutable diagnostic history
Reassessment evidence is appended as:

- chapter: `ch-20`;
- source: `remediation_reassessment`;
- phase: `reassessment`;
- stable `r20-*` item ID.

Original assessment, micro-check, flashcard, and scenario/application evidence is not rewritten.

Duplicate reassessment evidence with the same student/chapter/source/phase/item identity is ignored rather than replacing the original row.

The certification proves a successful five-question reassessment can raise current concept mastery while the original initial misses remain preserved and counted in diagnostic history.

## Replay protection
The selector accepts an exclusion set and fails closed when fewer than five unused reserve questions remain.

This prevents an already-attempted reserve item from silently being represented as fresh.

## Shared reassessment runtime
C20-7 adds and registers:

- `Chapter20MappingProvider`;
- `Chapter20DetectionProvider`;
- Chapter 20 in the shared reassessment mapping registry;
- Chapter 20 reassessment detection initialization;
- the `r20-*` reserve in the shared remediation-content provider.

The mapping provider resolves both original `qq-20-*` questions and `r20-*` reserve questions canonically, while reassessment selection returns only the five reserve questions for the target concept.

## Preserved architecture
C20-7 preserves:

- six canonical concept families;
- 60 hardened flashcards;
- 17 hardened initial-assessment questions;
- 12 immutable micro-check questions;
- C20-6 combined evidence detection;
- C20-6 compliance-vs-safety separation;
- shared 20/10/40/15/15 grading.

## Certification target
C20-7 is GREEN only when the exact final head passes:

1. 30-question / 5-per-family reserve certification;
2. namespace and prompt freshness;
3. exclusion/replay protection;
4. ordinary 80% recovery;
5. compliance 80% recovery;
6. immutable original-miss preservation;
7. positive mastery recovery;
8. shared mapping/detection provider registration;
9. shared remediation-content reserve lookup;
10. all prior C20-1 through C20-6 certification tests;
11. TypeScript/unit/build Engineering Verification;
12. exact-head Vercel deployment.

## Next phase
**C20-8 — Instructor / School-Admin Diagnostics + Final Visibility Integration:** expose Chapter 20 mastery, weak concepts, preserved initial misses, compliance-escalation state, latest reassessment and recovery, and targeted-remediation status to authorized instructor and school-admin views while preserving same-school authorization and student privacy.
