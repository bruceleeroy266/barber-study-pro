# C17-5 — Micro-Checks + Immutable Evidence Integration

C17-5 implements the seven two-question Chapter 17 micro-check placements defined and certified in C17-1.

## Locked educational inventories

C17-5 preserves:

- 24 lesson sections
- 60 flashcards
- 30 chapter-assessment questions
- 16 existing learning questions
- seven canonical concept families
- C17-1 lesson/flashcard/assessment/learning-question mappings
- shared 20/10/40/15/15 grading contract

No certified C17-2/C17-3/C17-4 educational asset is rewritten in this phase.

## Micro-check inventory

Seven checks are implemented, exactly one per canonical concept family:

1. consultation & hair analysis
2. chemical bond transformation
3. permanent waving procedures
4. chemical relaxing procedures
5. curl reformation
6. safety, testing & compatibility
7. texturizers & chemical blowouts

Each check contains exactly two questions, for **14 total** unique `mcq-17-*` questions.

All questions use understanding, application, or scenario difficulty. No recall-only item is introduced.

## Placement

The checks render immediately after the C17-1 planned lesson anchors:

- `hair-analysis`
- `bond-science`
- `perm-service-check`
- `relaxer-procedure`
- `curl-reformation`
- `common-mistakes`
- `texturizers`

## Source-hardening boundary

Micro-check wording follows the certified C17-2/C17-4 safety and chemistry boundaries:

- no one-chemistry-for-all model
- hydroxide/thio chemistry separated
- no universal processing/heat rule
- no fixed test-curl count
- no strand-test override for known hydroxide/thio incompatibility
- burning/pain requires stopping exposure and product-directed removal
- compromised scalp tissue postpones the service
- texturizers/chemical blowouts are not defined only by weaker formula or shorter time

## Immutable first-attempt persistence

Chapter 17 reuses the existing generic table:

`public.chapter_micro_check_attempts`

The database-level unique key is:

`unique (user_id, chapter_id, question_id)`

Authenticated student access is SELECT + INSERT. Ordinary UPDATE and DELETE are not granted.

The runtime therefore:

- records the first submitted answer
- restores that answer after reload
- prevents a second answer from overwriting the first
- converts the stored row into shared `micro_check` evidence with `attemptPhase: initial`
- keeps future remediation/reassessment evidence separate

## Mastery and grading integration

Every one of the seven concept families can now produce durable student evidence.

Persisted first-attempt correctness feeds the existing shared micro-check component of the academic grade:

- micro-check: 20%
- flashcard: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

No Chapter 17-specific grade formula or evidence fork is introduced.

## Runtime integration

`ChapterContent` now:

- loads persisted Chapter 17 micro-check attempts
- finds the check associated with each certified lesson anchor
- renders the Chapter 17 micro-check card
- locks already-recorded answers
- restores first-attempt feedback after reload
- appends newly persisted rows to local state without replacing prior evidence

## Certification gate

C17-5 is GREEN only when:

1. all 24/60/30/16 certified inventories remain intact;
2. seven checks and 14 unique questions exist;
3. all seven concept families can generate durable evidence;
4. first-attempt immutability is proven in code and database contract;
5. the shared 20/10/40/15/15 grading contract remains unchanged;
6. full exact-head Engineering Verification passes;
7. matching exact-head Vercel succeeds.

Safety escalation, targeted remediation, fresh reassessment, and instructor diagnostics remain later Chapter 17 phases.
