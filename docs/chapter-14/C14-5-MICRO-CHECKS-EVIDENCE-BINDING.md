# C14-5 — Micro-Checks + Immutable Evidence Binding

C14-5 adds targeted Chapter 14 lesson micro-checks and binds their **first attempt** into the same durable evidence and grading architecture already used by earlier certified chapters.

## Micro-check architecture

Seven checks are placed after existing Chapter 14 sections, one for each canonical concept family:

1. consultation & professional design
2. facial/head design analysis
3. cutting geometry & guides
4. shear/clipper/razor/texturizing
5. haircut styles & procedures
6. styling/volume/locks
7. service safety & sanitation

Each check has two questions, for **14 total micro-check questions**.

All questions use understanding, application, or scenario difficulty. None are recall-only.

## Immutable first-attempt evidence

Chapter 14 reuses the existing `chapter_micro_check_attempts` table.

The persistence contract preserves:

- one row per user + chapter + question
- insert/select only for normal authenticated users
- no student update permission
- no student delete permission
- duplicate attempts return the already-recorded first attempt
- all converted evidence is tagged `source: micro_check`
- all micro-check evidence is tagged `attemptPhase: initial`

A later correct answer cannot overwrite an original miss. Future remediation/reassessment evidence remains a separate evidence record.

## Shared grade binding

Persisted Chapter 14 micro-check correctness feeds the existing shared grade input.

The shared weight remains:

- micro-check = 20%

The value is based on first-attempt correctness, **not completion**.

## Runtime wiring

`ChapterContent` now:

- loads Chapter 14 attempts when `chapterId === 'ch-14'`
- restores previously recorded answers
- renders the appropriate micro-check after each configured lesson section
- persists only the first attempt
- appends newly persisted rows without replacing previous evidence

The lesson, 112 certified flashcards, and 70-question certified assessment were not altered during C14-5.

## Scope boundary

C14-5 does not yet implement safety escalation, targeted remediation, fresh five-question reassessment, or instructor diagnostics. Those remain C14-6 through C14-8.

## Certification gate

C14-5 is GREEN only after:

1. 7/7 concept families have checks,
2. all 14 questions are unique and non-recall,
3. every placement points to a real current Chapter 14 section,
4. duplicate evidence cannot overwrite the first attempt,
5. the shared immutable database contract is reused,
6. ChapterContent runtime wiring is present,
7. Engineering Verification is GREEN on the exact head,
8. the matching Vercel preview is GREEN on the same exact head.
