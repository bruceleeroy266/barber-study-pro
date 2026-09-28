# C13-1 — Canonical Concept Architecture + Shared Grading/Evidence Binding

## Scope

C13-1 aligns the **existing** Chapter 13 implementation to the same shared concept/grading/evidence foundation already used by Chapters 1–11.

This phase does **not** rewrite the lesson, flashcards, or assessment. It also does not repair the known 45-A answer-position defect; that remains C13-4.

## Canonical concept families

1. `ch13-consultation-service-preparation` — Consultation, Skin/Hair Analysis & Service Preparation
2. `ch13-hair-growth-ingrown-prevention` — Hair Growth, Grain & Ingrown-Hair Prevention
3. `ch13-shaving-areas-body-positioning` — Shaving Areas & Barber Body Positioning
4. `ch13-razor-handling-stretching-technique` — Razor Handling, Skin Stretching & Stroke Technique
5. `ch13-professional-shave-procedure` — Professional Shave Procedure & Shave Types
6. `ch13-facial-hair-design` — Mustache & Beard Design
7. `ch13-infection-control-service-safety` — Infection Control, Service Safety & Regulatory Boundaries
8. `ch13-client-care-professional-practice` — Client Care, Satisfaction & Professional Practice

All eight are active and use the same concept metadata vocabulary as the unified Chapters 1–11 architecture.

## Mapping coverage

### Lesson

- 41 authored IDs
- 41 mapped IDs
- 41 unique mappings
- no unmapped lesson IDs
- no extra mapping IDs

### Flashcards

- 90 active flashcards
- 90 mapped exactly once
- no unmapped flashcards
- stable IDs preserved

Mapping distribution:

- Consultation / preparation: 8
- Hair growth / ingrown prevention: 8
- Shaving areas / body positioning: 8
- Razor handling / stretching / technique: 30
- Professional shave procedure: 7
- Facial-hair design: 13
- Infection control / service safety: 13
- Client care / professional practice: 3

The uneven distribution is intentional: C13-1 maps the existing curriculum as authored rather than inventing content to force equal counts.

### Assessment

- 45 questions
- 45 mapped exactly once
- no unmapped questions
- stable IDs preserved

Mapping distribution:

- Consultation / preparation: 3
- Hair growth / ingrown prevention: 8
- Shaving areas / body positioning: 4
- Razor handling / stretching / technique: 15
- Professional shave procedure: 7
- Facial-hair design: 3
- Infection control / service safety: 3
- Client care / professional practice: 2

The assessment remains content-uncertified in C13-1. C13-4 must independently verify item support, answer keys, distractors, difficulty, source anchors, and answer-position balance.

## Planned micro-check coverage

C13-1 defines one planned placement for each canonical concept family, with two questions planned per family. The actual micro-check questions and immutable persistence are deferred to C13-5.

## Shared grading

Chapter 13 reuses `SHARED_GRADE_WEIGHTS` unchanged:

- micro-check: 20%
- flashcard: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

Chapter 13 does not define its own formula.

## Shared durable activity evidence

Chapter 13 flashcard/content mappings are registered in the shared activity-evidence registry.

The registry was hardened so support is based on **actual mapping registration**, not a numeric `1..N` chapter range. This is necessary because Chapter 12 remains on an independent in-progress PR while Chapter 13 is developed in parallel.

Therefore:

- Chapters 1–11 remain supported.
- Chapter 13 is supported on this branch.
- Chapter 12 remains fail-closed here until its own PR lands.

The backward-compatible `isG7EvidenceChapter` alias remains available for existing call sites.

## Concept detection handoff

Chapter 13 initial assessment mappings are bound to the same shared concept-detection engine used by prior chapters and registered in the remediation chapter registry.

C13-1 detection uses the existing 45-question assessment only.

C13-7 will extend the detection evidence source with the fresh Chapter 13 reassessment reserve.

## Milady/source boundary

C13-1 is architecture-only.

The concept taxonomy is based on the existing ASCYN PRO Chapter 13 runtime. C13-1 does **not** claim page-by-page Milady certification.

C13-2 through C13-4 must:

- treat Milady as the primary content/terminology reference when the authoritative source is available
- preserve concepts while writing original ASCYN PRO language
- avoid reproducing proprietary textbook passages/questions
- document source support
- repair unsupported medical, safety, regulatory, or exam-certainty claims

## Explicit non-scope

C13-1 does not:

- rewrite lesson content
- rewrite flashcards
- alter the 45 assessment questions
- repair the known 45-A answer-position defect
- create actual micro-check questions
- create safety escalation
- create targeted remediation content
- create the five-question reassessment reserve
- claim final instructor/admin Chapter 13 certification
- authorize merge

## Certification gates

C13-1 is GREEN only when:

- all 8 concepts are stable and active
- 41/41 lesson IDs map exactly once
- 90/90 flashcards map exactly once
- 45/45 assessment questions map exactly once
- all 8 concepts have lesson, flashcard, assessment, and planned micro-check coverage
- Chapter 13 reuses the unchanged shared grading contract
- Chapter 13 joins durable activity evidence without falsely enabling unfinished Chapter 12
- Chapter 13 joins the shared concept-detection handoff
- C13-0 baseline remains intact
- Engineering Verification succeeds on the exact head
- exact-head Vercel preview is READY
