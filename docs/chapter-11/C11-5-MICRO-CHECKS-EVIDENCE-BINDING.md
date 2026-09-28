# C11-5 — Micro-Checks + Immutable Evidence Binding

**Baseline:** C11-4 exact certified head `261d524b298bbb9b8d4a7f3270a62da3d3d01d8e`

## Objective

Bring Chapter 11 lesson micro-checks onto the same first-attempt evidence model already used by Chapters 1–10, while keeping the shared grading/mastery engine unchanged.

## Micro-check architecture

Chapter 11 now has **8 micro-check placements** spanning all **8 canonical concept families**:

1. Draping & shampoo service — after `draping-shampoo-service`
2. Analysis & product selection — after `product-selection-system`
3. Scalp massage — after `massage-techniques`
4. Hair/scalp treatments — after `treatment-procedure`
5. Treatment equipment — after `treatment-equipment-steam-hot-towels`
6. Scalp-condition recognition — after `dandruff`
7. Service safety & referral — after `board-exam-alerts`
8. Client care & professional practice — after `home-care-system`

The eight checks contain **17 total questions**. Every question is understanding, application, or scenario level; no recall-only micro-check item was added.

## Source scope

Micro-check content is restricted to the Chapter 11 source record already hardened in C11-2 through C11-4:

- waterproof draping;
- reclined/inclined shampoo service and client accommodation;
- water-temperature and service preparation;
- condition/texture/density/porosity/elasticity analysis;
- source-supported product matching;
- rotary, sliding, and back-and-forth massage;
- cleanliness/stimulation;
- hair-tonic sequence;
- steam/hot towels/electric massage;
- dandruff/Malassezia and oily scalp;
- parasitic/staphylococcal referral boundaries;
- professional cosmetic-service scope.

## Immutable evidence contract

Chapter 11 reuses the existing `chapter_micro_check_attempts` table.

The already-deployed table enforces:

`unique (user_id, chapter_id, question_id)`

Authenticated students have SELECT + INSERT access but no ordinary UPDATE/DELETE grant. Therefore:

- the first submitted answer becomes the persisted evidence;
- repeat submissions cannot overwrite it;
- a later correct response cannot erase an initial miss;
- every persisted row converts to:
  - `source: 'micro_check'`
  - `attemptPhase: 'initial'`
  - canonical Chapter 11 concept ID
  - original correctness and timestamp.

No schema migration is needed because the existing table is chapter-generic.

## Shared grading/mastery binding

`micro-check-persistence.ts` adapts Chapter 11 rows into the existing Chapter 11 wrapper around the shared engine.

It provides:

- persisted micro-check accuracy to `SharedGradeInput.microCheckPercent`;
- per-concept mastery through `calculateChapter11ConceptMastery`;
- shared confidence output;
- preserved initial-miss evidence.

The shared weights remain unchanged:

- micro-checks: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation reassessment: 15%

## Runtime integration

`ChapterContent` now:

- loads persisted Chapter 11 micro-check rows;
- renders each Chapter 11 check after its mapped lesson block;
- locks previously recorded first attempts;
- inserts new answers through the same immutable table;
- restores persisted answers on reload.

`Chapter11MicroCheckCard` intentionally does not implement the C11-6 safety-escalation UX yet. C11-5 records the safety evidence; C11-6 will classify/escalate it.

## Certification guardrails

Tests prove:

- 8 checks / 8 canonical concepts;
- 17 unique non-recall questions;
- every placement references a current lesson block;
- every question matches its parent concept;
- duplicate in-memory evidence cannot overwrite the first attempt;
- initial misses remain separate from future reassessment evidence;
- persisted rows normalize to shared `micro_check` + `initial` evidence;
- diagnostics cover all 8 concepts;
- persisted accuracy feeds the existing grade input;
- the shared 20/10/40/15/15 weights remain unchanged.

## Explicit non-scope

C11-5 does not add:

- safety escalation rules — C11-6;
- remediation content or reassessment reserves — C11-7;
- a new grading formula;
- changes to Chapter 11 lesson, flashcards, or 50-question assessment.

## Source limitation

The Chapter 11 content basis remains the repository `CHAPTER-11-MATERIAL-SUMMARY.md` (Milady Chapter 11 pages 276–285 summary), not a fresh independent page-by-page Milady transcription.

## Next phase

**C11-6 — Safety Escalation.**


Verification trigger: PR #129 is tested against `main`; no merge authorization is implied.
