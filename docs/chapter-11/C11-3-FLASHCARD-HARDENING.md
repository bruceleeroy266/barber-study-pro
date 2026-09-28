# C11-3 — Flashcard Source & Concept Hardening

**Baseline:** C11-2 exact certified head `ade4c752f33a71996b1e4b4b868be491e51f96ad`

## Objective

Independently review all 80 Chapter 11 flashcards against the repository Chapter 11 material summary, preserve stable IDs/order, remove unsupported or overbroad material, and keep every card bound to the canonical C11-1 concept architecture.

## Source limitation

This pass is grounded in `CHAPTER-11-MATERIAL-SUMMARY.md` (Milady Chapter 11 pages 276–285 summary) plus the C11-2 hardened lesson. It does **not** claim fresh independent page-by-page Milady verification.

## Classification

Every card was classified exactly once:

- **KEEP — 20**
  - fc-11-008, 010, 013, 015, 021–026, 028, 031–032, 045, 048–050, 052, 075, 079
- **REPAIR — 22**
  - fc-11-001, 005, 009, 011–012, 014, 016–019, 027, 033, 035–036, 038, 044, 046, 051, 054, 072, 074, 080
- **REWRITE — 38**
  - fc-11-002–004, 006–007, 020, 029–030, 034, 037, 039–043, 047, 053, 055–062, 063–071, 073, 076–078

## What was removed or replaced

The audit removed unsupported or cross-chapter carryover such as:

- shampoo/conditioner numeric pH ranges not present in the Chapter 11 source summary;
- medicinal-treatment wording;
- antifungal ingredient lists and dosing;
- pityriasis subtype / seborrheic-dermatitis detail not supported by this Chapter 11 source summary;
- skin-cancer and hypertrophy material carried over from another chapter;
- tinea-specific transmission and treatment detail not present in the Chapter 11 summary;
- unsupported dandruff-glove guidance;
- Chapter 10-style five-senses and detailed texture/porosity/elasticity tests;
- hair-density population numbers by hair color;
- out-of-shop documentation;
- retail-display claims;
- powder/liquid-dry shampoo content absent from the source summary.

Those cards were rewritten around source-supported Chapter 11 material while preserving their stable IDs and order.

## Source-supported coverage retained

The hardened 80-card deck now covers:

- draping and cape selection;
- reclined and inclined shampoo methods;
- special-needs shampoo positioning;
- water-temperature testing and shampoo-service faults;
- consultation and hair/scalp analysis;
- product matching for fine, medium, coarse, wavy/curly, and dry/damaged hair;
- rotary, sliding, and back-and-forth massage;
- massage sequence and source-listed effects;
- dry/oily scalp and dandruff/Malassezia;
- cleanliness and stimulation;
- scalp treatment services;
- scalp steam and hot towels;
- electric massage controls;
- treatment series;
- hair-tonic treatment sequence;
- parasitic/staphylococcal treatment prohibition and physician referral.

## Integrity

- 80/80 cards remain active.
- IDs remain `fc-11-001` through `fc-11-080`.
- order_index remains 1 through 80.
- 80/80 cards retain exactly one canonical Chapter 11 concept mapping.
- shared grading is untouched.
- assessment content is untouched.

## Next phase

**C11-4 — Assessment Source & Adversarial Hardening.**
