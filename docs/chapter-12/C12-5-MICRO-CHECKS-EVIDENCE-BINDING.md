# C12-5 — Micro-Checks + Immutable Evidence Binding

## Objective

Add Chapter 12 lesson micro-checks across all eight canonical concept families and bind them to the same immutable first-attempt evidence and shared grading/mastery architecture already used by Chapters 1–11.

## Micro-check architecture

Chapter 12 now has **8 embedded micro-checks / 16 total questions**, with exactly two questions per canonical concept family:

1. Facial anatomy & neurovascular
2. Massage principles & manipulations
3. Equipment & electrotherapy
4. Skin analysis & product selection
5. Facial treatment procedures
6. Sanitation & infection control
7. Contraindications & service safety
8. Client care & professional practice

Every item is understanding, application, or scenario level. No recall-only item is used as the Chapter 12 micro-check evidence layer.

## Source basis

Items are grounded in the already-certified Chapter 12 repository work:

- C12-2 hardened lesson
- C12-3 audited flashcards
- C12-4 audited 45-question assessment
- C12-1 canonical concept architecture

This remains repository-source-grounded work and is not represented as fresh page-by-page textbook verification.

## Immutable evidence contract

Chapter 12 reuses the existing generic `public.chapter_micro_check_attempts` table.

The deployed migration defines:

`unique (user_id, chapter_id, question_id)`

Authenticated students have SELECT + INSERT access but no ordinary UPDATE/DELETE grant. Duplicate inserts therefore cannot overwrite an original miss.

Each Chapter 12 row stores:

- `chapter_id = 'ch-12'`
- stable check ID
- stable question ID
- canonical Chapter 12 concept ID
- difficulty
- selected answer
- correctness
- immutable first-answer timestamp

Persisted rows normalize to the shared evidence model as:

- `source: 'micro_check'`
- `attemptPhase: 'initial'`
- original correctness
- original timestamp
- canonical concept family

## Shared grading/mastery binding

Chapter 12 continues to reuse the shared grading engine. The persisted micro-check accuracy fills only the existing `microCheckPercent` component.

The weights stay unchanged:

- micro-check: 20%
- flashcard: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

Completion signals are not inputs to the Chapter 12 micro-check score. The score is computed from persisted first-attempt correctness.

## Runtime integration

`ChapterContent` now:

- loads persisted Chapter 12 micro-check attempts
- renders each check after its mapped lesson section
- restores previously recorded first attempts
- locks already-recorded answers
- inserts new first attempts through the immutable shared table
- keeps the lesson-completion UI separate from academic micro-check accuracy

`Chapter12MicroCheckCard` intentionally does **not** implement C12-6 safety escalation yet. C12-5 captures immutable safety-relevant misses; C12-6 will classify and escalate them.

## C12-5 certification gates

C12-5 is GREEN only when tests prove:

- 8 checks cover all 8 canonical concepts
- 16 unique non-recall questions exist
- all placements reference current lesson sections
- each question matches its parent concept
- duplicate evidence cannot overwrite the first answer
- later recovery evidence remains separate from the initial miss
- persisted rows convert to shared `micro_check` evidence
- diagnostics cover all eight concepts
- micro-check accuracy feeds the existing 20% grade component
- completion is not substituted for academic accuracy
- runtime wiring loads, renders, persists, and restores Chapter 12 attempts
- the existing DB uniqueness/RLS contract remains the source of immutability
- exact-head Engineering Verification succeeds
- exact-head Vercel preview is READY

## Explicit non-scope

C12-5 does not add:

- safety escalation — C12-6
- targeted remediation or reassessment reserve — C12-7
- final instructor/admin Chapter 12 diagnostics — later phase
- a new grading formula
