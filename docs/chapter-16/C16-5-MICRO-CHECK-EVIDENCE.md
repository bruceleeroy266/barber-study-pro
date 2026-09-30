# C16-5 — Micro-Check Architecture + Immutable Evidence Integration

**Base:** C16-4 certified head `1ca4d9939282dba2ccebfd225d9e53961a4c1de1`

## Scope

C16-5 activates the eight micro-check placements planned in C16-1.

Each of the eight canonical Chapter 16 concept families receives one two-question micro-check:

- 8 placements
- 2 questions per placement
- 16 total questions
- stable IDs `mcq-16-001` through `mcq-16-016`
- non-recall difficulty only: understanding, application, or scenario

## Immutable first-attempt evidence

Chapter 16 reuses the existing `chapter_micro_check_attempts` persistence path.

The database uniqueness rule remains:

`unique (user_id, chapter_id, question_id)`

Therefore the first submitted answer to a micro-check question is the academic evidence used by the mastery system. A later answer cannot overwrite that initial evidence.

All persisted Chapter 16 rows convert to canonical evidence with:

- chapterId = `ch-16`
- source = `micro_check`
- attemptPhase = `initial`
- conceptFamilyId = the canonical C16 concept family
- itemId = the stable micro-check question ID

## Grading integration

Persisted Chapter 16 micro-check accuracy feeds the existing shared grading input as `microCheckPercent`.

The shared weights remain unchanged:

- micro-check: 20%
- flashcard/study evidence: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

## Lesson integration

The shared ChapterContent renderer now:

- loads Chapter 16 first-attempt micro-check rows;
- inserts each check after its planned Chapter 16 lesson section;
- locks answered questions after the first persisted attempt;
- displays the explanation after persistence;
- preserves all previous Chapter 1–15 micro-check behavior.

## Explicitly deferred

C16-5 does **not** add:

- safety escalation classification;
- targeted remediation;
- reassessment questions;
- mastery recovery;
- instructor/admin Chapter 16 diagnostics.

Those remain later phases, beginning with C16-6.

## Preserved invariants

- 11 instructional sections
- 93 top-level lesson blocks
- 68 flashcards
- 30 assessment questions
- 30 assessment answer keys unchanged
- 8 canonical concept families
- shared 20/10/40/15/15 grading unchanged

C16-5 is not formally GREEN until exact-head Engineering Verification and Vercel both pass.
