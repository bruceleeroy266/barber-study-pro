# C10-1 — Canonical Concept Architecture + Shared Evidence Binding

**Chapter:** 10 — Properties and Disorders of the Hair and Scalp  
**Branch:** `feat/c10-1-canonical-concepts`  
**Baseline:** C10-0 head `588a19499653d82cce578e8f07701d0274dc440d`, itself based on the locked post-G6 production baseline `6e6cc1660a895f4d154771951f81462bb1c70de6`.

## Scope

C10-1 establishes the Chapter 10 concept/evidence architecture without changing lesson wording, flashcard wording, quiz wording, answer keys, or student-facing runtime behavior.

The shared Chapters 1–9 grading architecture remains locked. Chapter 10 binds to the existing shared grading engine rather than defining a new formula.

## Canonical learning objectives

C10-1 defines nine architecture-level learning objectives from the current Chapter 10 runtime structure:

1. Hair anatomy, root structures, follicle, bulb, papilla, sebaceous gland, and shaft layers.
2. Keratinization, protein chemistry, peptide bonds, and side bonds.
3. Pigment, wave pattern, and natural hair-growth patterns.
4. Hair types, normal growth rate, and the anagen/catagen/telogen cycle.
5. Hair/scalp analysis: texture, density, porosity, elasticity, and service readiness.
6. Alopecia and hair-loss pattern recognition.
7. Hair-shaft disorders and noninfectious abnormalities.
8. Infectious, contagious, and parasitic scalp conditions.
9. Professional observation, sanitation, service-pause, communication, and referral boundaries.

These objectives are architecture definitions based on current runtime content and repository Chapter 10 reports. C10-1 does not promote any objective to independently source-verified exam relevance.

## Canonical concept families

C10-1 defines nine stable concept families:

- `ch10-hair-anatomy-structure`
- `ch10-hair-chemistry-bonds`
- `ch10-pigment-wave-growth-patterns`
- `ch10-growth-cycle-hair-types`
- `ch10-analysis-properties`
- `ch10-alopecia-hair-loss`
- `ch10-hair-shaft-disorders`
- `ch10-infectious-parasitic-scalp`
- `ch10-service-safety-referral`

The service-safety/referral family is deliberately separate so later C10 safety hardening can distinguish observation and safe service decisions from medical diagnosis/treatment.

## Complete current-runtime mappings

C10-1 maps every active current runtime asset exactly once to a primary concept:

- **47 lesson sections**
- **118 flashcards**
- **75 assessment questions**

Existing IDs are preserved:
- flashcards stay `fc-10-###`
- assessment items stay `qq-10-###`

Integrity tests compare mappings directly with the current runtime exports so additions, deletions, duplicate IDs, or unmapped assets fail loudly.

## Shared evidence/grading binding

Chapter 10 now exposes typed evidence records using:

- chapter ID `ch-10`
- canonical Chapter 10 concept-family IDs
- shared evidence source semantics
- shared difficulty semantics
- shared attempt-phase semantics
- shared confidence semantics

Chapter 10 calls `calculateSharedGrade` and `calculateSharedConceptMastery` from the canonical shared engine.

`CHAPTER10_GRADE_WEIGHTS` is a direct alias of `SHARED_GRADE_WEIGHTS`. C10-1 does not create, copy, or modify a Chapter 10 grading formula.

## Guardrails

C10-1 intentionally does **not**:

- harden or rewrite Chapter 10 lesson content;
- change any of the 118 flashcards;
- change any of the 75 assessment items;
- add micro-checks yet;
- add a reassessment reserve yet;
- add safety escalation yet;
- create a parallel grading system;
- reopen Chapters 1–9 grading.

All concept families remain `INDIRECT_REFERENCE_ONLY` until later source/blueprint verification justifies stronger attribution.

## Exit criteria

C10-1 is complete when:

- 9 learning objectives and 9 stable concept families compile;
- all 47 lesson sections map exactly once;
- all 118 flashcards map exactly once;
- all 75 assessment items map exactly once;
- every concept has lesson, flashcard, and assessment coverage;
- Chapter 10 grading is bound to the shared grading engine;
- Engineering Verification passes on the exact head;
- exact-head Vercel Preview reaches READY.

## Status

**Implementation complete; verification pending.**
