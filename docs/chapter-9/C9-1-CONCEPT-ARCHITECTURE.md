# C9-1 — Canonical Concept Architecture + Shared Grading/Evidence Model

## Status

C9-1 establishes the Chapter 9 mastery architecture without changing the Chapter 9 lesson text, flashcard text, quiz text, or student-facing grading behavior.

## Canonical learning objectives

C9-1 preserves the eight learning objectives already present in the current Chapter 9 lesson:

1. Describe the structure and divisions of the skin.
2. List the functions of the skin.
3. Identify and describe common primary and secondary skin lesions.
4. Describe common skin inflammations and infections.
5. List and describe disorders of the sebaceous and sudoriferous glands.
6. List and describe types of skin pigmentations.
7. Identify common skin hypertrophies.
8. Identify and describe types of skin cancer.

The objective wording is grounded in the current Chapter 9 source in the repository. C9-1 does not claim that these objectives have yet been independently reverified against the underlying source pages or current exam blueprint.

## Canonical concept families

C9-1 defines ten stable concept families:

- `ch9-epidermis-skin-barrier`
- `ch9-dermis-subcutaneous-support`
- `ch9-skin-functions-glands`
- `ch9-primary-lesions`
- `ch9-secondary-lesions`
- `ch9-sebaceous-sudoriferous-disorders`
- `ch9-inflammatory-infectious-conditions`
- `ch9-pigmentation-hypertrophies`
- `ch9-skin-cancer-recognition`
- `ch9-service-safety-referral`

The service-safety/referral family intentionally captures professional decisions that cross more than one content category. Recognition remains distinct from diagnosis.

## Complete baseline mappings

The current runtime assets are mapped exactly once to a primary concept:

- 38 top-level lesson sections
- 50 active flashcards
- 30 current quiz questions

The mapping layer preserves the current runtime IDs:

- flashcards remain `fc-9-001` through `fc-9-050`
- quiz questions remain `q9-001` through `q9-030`

C9-1 does not rename the older `q9-` IDs because migration risk has not yet been assessed.

Integrity tests compare the mapping tables directly against the runtime lesson, flashcard, and quiz exports so additions, removals, duplicates, or unmapped assets fail loudly.

## Shared grading/evidence model

Chapter 9 does not create a new grading system.

A shared mastery engine now codifies the same architecture already used by Chapters 7/8:

- micro-checks: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario application: 15%
- remediation reassessment: 15%

The recovery component remains non-punitive: weak remediation cannot lower the established base grade, while strong later recovery may improve it.

Concept mastery retains the proven difficulty/source/phase/recency weighting pattern:

- scenario/application evidence carries more weight than simple recall;
- sparse evidence cannot create strong confidence;
- original initial misses remain preserved after later recovery;
- reassessment evidence is counted as later evidence rather than rewriting history.

Chapter 9 calls the shared grading engine rather than maintaining a separate Chapter 9 formula.

## Exam relevance guardrail

Because C9-1 is an architecture phase rather than an exam-blueprint verification phase, Chapter 9 concepts are currently marked `INDIRECT_REFERENCE_ONLY` rather than `DIRECT_VERIFIED`.

Direct exam relevance can only be promoted after explicit source/blueprint verification in a later Chapter 9 phase.

## C9-1 exit criteria

C9-1 is complete when:

- all 8 current learning objectives are represented;
- all 10 concept families are stable and typed;
- all 38 lesson sections map exactly once;
- all 50 active flashcards map exactly once;
- all 30 current quiz questions map exactly once;
- every concept has lesson, flashcard, and assessment coverage;
- Chapter 9 uses the shared 20/10/40/15/15 grading architecture;
- recovery remains non-punitive;
- initial evidence remains immutable in the mastery model;
- Engineering Verification and exact-head Vercel are GREEN.

No Chapter 9 content hardening begins until these architecture gates are satisfied.
