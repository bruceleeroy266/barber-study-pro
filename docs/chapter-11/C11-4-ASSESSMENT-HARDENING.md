# C11-4 — Assessment Source & Adversarial Hardening

**Baseline:** C11-3 exact certified head `61aa5e685336dc82683e7f67e523756bb72f9b9c`

## Objective

Audit all 50 Chapter 11 assessment questions, preserve stable IDs/order, verify each answer key and explanation, remove unsupported or cross-chapter carryover, eliminate exploitable answer-position bias, and increase application/scenario demand where the Chapter 11 source supports it.

## Source limitation

This pass is grounded in `CHAPTER-11-MATERIAL-SUMMARY.md` (Milady Chapter 11 pages 276–285 summary) plus the C11-2 lesson and C11-3 flashcard hardening. It does **not** claim fresh independent page-by-page Milady verification.

## Classification

Every question was classified exactly once:

- **KEEP — 18**
  - qq-11-001, 005, 007, 013, 018–023, 025–026, 032–035, 037, 050
- **REPAIR — 14**
  - qq-11-008–011, 014–016, 024, 027, 029, 036, 038–040
- **REWRITE — 18**
  - qq-11-002–004, 006, 012, 017, 028, 030–031, 041–049

KEEP means the underlying tested fact/concept was source-supported; answer placement/distractors could still be hardened to eliminate the original all-A pattern.

## Answer-position defect repaired

Before C11-4:

- A = 50
- B = 0
- C = 0
- D = 0

After C11-4:

- A = 12
- B = 13
- C = 13
- D = 12

No answer position differs from another by more than one question.

## Difficulty / adversarial change

Before C11-4:

- Easy = 21
- Medium = 24
- Hard = 5

After C11-4:

- Easy = 15
- Medium = 23
- Hard = 12

Harder items were created by adding source-supported application decisions, including draping selection, client accommodation, product matching, massage-area movement selection, scope/referral decisions, and analysis-to-treatment reasoning. Difficulty was not increased by introducing unsupported facts.

## Key and explanation verification

All 50 expected answer keys are explicitly locked in `assessment-hardening.ts`.

Certification tests require:

- every runtime key to match the independently recorded expected key;
- every keyed answer to contain actual answer text;
- every explanation to be present and substantive;
- all 50 stable IDs and order indexes to remain unchanged.

## Unsupported / cross-chapter material removed

The assessment no longer relies on:

- shampoo/conditioner numeric pH ranges absent from the Chapter 11 summary;
- medicinal scalp-conditioner claims;
- antidandruff ingredient lists/dosing absent from the source summary;
- pityriasis subtype and seborrheic-dermatitis detail absent from this source summary;
- tinea-specific transmission/treatment detail;
- unsupported dandruff-glove guidance;
- detailed Chapter 10 hair-analysis tests and density statistics;
- universal state-law claims.

## Source-supported coverage retained

The 50-question bank now tests:

- draping and cape selection;
- reclined/inclined shampoo methods;
- special-needs client positioning;
- water-temperature and shampoo-service faults;
- consultation and analysis;
- product matching;
- rotary/sliding/back-and-forth massage;
- massage sequence and regional application;
- cleanliness/stimulation;
- dry/oily scalp and dandruff/Malassezia;
- treatment services;
- scalp steam / hot towels;
- electric massage;
- hair-tonic sequence;
- parasitic/staphylococcal referral boundaries;
- professional scope.

## Integrity

- 50/50 IDs preserved.
- order_index remains 1–50.
- 50/50 canonical concept mappings preserved.
- shared grading untouched.
- Chapter 11 flashcards untouched in C11-4.

## Next phase

**C11-5 — Micro-Checks + Immutable Evidence Binding.**


Verification trigger: PR #128 is tested against `main`; no merge authorization is implied.
