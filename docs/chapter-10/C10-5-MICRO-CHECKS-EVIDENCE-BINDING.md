# C10-5 — Micro-Checks + Immutable Evidence Binding

**Chapter:** 10 — Properties and Disorders of the Hair and Scalp  
**Branch:** `feat/c10-5-micro-check-evidence-binding`  
**Certified C10-4 baseline:** `306b9dbb69bb1b61e92701a68971c69a1d8f44a5`

## Goal

Add Chapter 10 concept-bound lesson micro-checks whose first submitted answers become immutable evidence for the already-certified shared grading/mastery engine.

C10-5 does **not** create a new grading formula.

## Micro-check architecture

Chapter 10 now has **9 micro-check placements** spanning all **9 canonical concept families**:

1. Hair anatomy & structure — after `medulla`
2. Hair chemistry & bonds — after `keratinization-cohns`
3. Pigment, wave & growth patterns — after `growth-patterns`
4. Growth cycle & hair types — after `growth-cycle`
5. Hair/scalp analysis — after `elasticity`
6. Alopecia & hair loss — after `other`
7. Hair-shaft disorders — after `non-contagious-disorders`
8. Infectious/parasitic scalp — after `contagious-disorders`
9. Service safety & referral — after `scalp-analysis-rules`

The nine checks contain **19 total questions**. Every question is `understanding`, `application`, or `scenario`; no recall-only micro-check items were added.

## Source scope

Question content is restricted to the Chapter 10 source record already hardened and certified in C10-2 through C10-4. It uses source-supported distinctions such as:

- cortex / dermal papilla structure;
- hydrogen and disulfide bond behavior;
- eumelanin / pheomelanin;
- cross-section and wave pattern;
- anagen / telogen timing and normal shedding;
- porosity and elasticity;
- alopecia totalis / universalis / areata;
- trichoptilosis / monilethrix;
- pediculosis / tinea;
- parasite, irritation, abrasion, sanitation, referral, and no-diagnosis boundaries.

C10-5 does not expand Chapter 10 with outside medical or exam-prep claims.

## Immutable evidence contract

Every stored answer uses the existing `chapter_micro_check_attempts` table.

That table already enforces:

`unique (user_id, chapter_id, question_id)`

Students have SELECT + INSERT access but no UPDATE/DELETE grant for ordinary authenticated use. Therefore:

- the first submitted answer is the evidence record;
- repeat submissions hit the existing uniqueness constraint;
- a later correct answer cannot overwrite the original miss;
- the persisted record is converted to shared evidence with:
  - `source: 'micro_check'`
  - `attemptPhase: 'initial'`
  - canonical Chapter 10 concept ID
  - original correctness and timestamp.

## Shared mastery / grading binding

`micro-check-persistence.ts` adapts Chapter 10 rows into the already-certified Chapter 10 wrapper around the shared engine.

It supplies:

- persisted first-attempt micro-check percentage to `SharedGradeInput.microCheckPercent`;
- per-concept mastery through `calculateChapter10ConceptMastery`;
- shared confidence output;
- preserved initial miss counts.

The grading weights remain the existing shared contract:

- micro-checks: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario application: 15%
- remediation reassessment: 15%

No weight or mastery formula is redefined in C10-5.

## Student lesson integration

`ChapterContent` now:

- loads persisted Chapter 10 first-attempt micro-check rows;
- renders the appropriate Chapter 10 check after its mapped lesson section;
- locks already-recorded questions;
- saves new answers through the immutable insert-only adapter;
- restores persisted state on reload.

## Guardrails

C10-5 tests verify:

- 9 checks / 9 canonical concepts;
- 19 unique non-recall questions;
- every placement references a current Chapter 10 lesson content block;
- every question stays bound to the same concept as its parent check;
- duplicate responses cannot contaminate preserved first-attempt evidence;
- initial misses remain separate from future reassessment evidence;
- persisted rows convert to `micro_check` + `initial` evidence;
- persisted accuracy feeds the existing shared grade input;
- per-concept diagnostics use the shared mastery engine;
- the canonical shared micro-check weight remains 20%.

## Explicit non-scope

C10-5 does not add:

- safety escalation rules — reserved for C10-6;
- remediation content or reassessment reserves — reserved for C10-7;
- a new grading formula;
- changes to Chapters 1–9 shared grading;
- changes to the 118 flashcards or 75-question assessment.

## Status

**Implementation complete. Exact-head Engineering Verification and Vercel Preview are required before C10-5 can be certified GREEN.**
