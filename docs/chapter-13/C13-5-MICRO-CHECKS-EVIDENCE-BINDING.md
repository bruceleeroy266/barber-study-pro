# C13-5 — Micro-Checks + Immutable Evidence Binding

## Scope

C13-5 adds live Chapter 13 lesson micro-checks and binds their **first attempts** to the same immutable evidence and grading model already used by the unified Chapters 1–11 architecture.

C13-5 does not reopen the certified C13-2 lesson, C13-3 flashcards, or C13-4 assessment.

## Micro-check inventory

- Canonical concepts: **8**
- Micro-check blocks: **8**
- Questions per block: **2**
- Total micro-check questions: **16**
- Recall-only questions: **0**

Each check is placed after the lesson section defined during C13-1:

1. Consultation & Preparation — after `shaving-fundamentals`
2. Growth Pattern & Ingrown-Hair — after `grain-terms`
3. Shaving Areas & Positioning — after `body-positions`
4. Razor Control & Stretching — after `skin-stretching-tips`
5. Professional Shave Procedure — after `shave-types`
6. Facial-Hair Design — after `beard-tips`
7. Shaving Safety & Infection Control — after `safety-precautions`
8. Client Care & Professional Practice — after `satisfaction-factors`

## Immutable first-attempt contract

C13-5 uses the existing `chapter_micro_check_attempts` table.

The database-level unique constraint:

`unique (user_id, chapter_id, question_id)`

prevents a second attempt from replacing the original answer.

The Chapter 13 persistence adapter also handles duplicate inserts by returning the already-recorded row instead of overwriting it.

Every persisted row carries:

- user
- chapter
- check
- question
- canonical concept
- difficulty
- selected answer
- correctness
- answer timestamp
- immutable creation timestamp

## Shared evidence binding

Persisted Chapter 13 micro-check rows convert into the existing shared evidence contract as:

- `chapterId = ch-13`
- `source = micro_check`
- `attemptPhase = initial`
- stable micro-check item ID
- stable canonical concept ID
- source difficulty
- correctness
- timestamp

Later remediation/reassessment evidence uses a separate source and `attemptPhase = reassessment`, so recovery can improve mastery without deleting or rewriting the original miss.

## Shared grading

C13-5 does not invent a new grading formula.

Persisted micro-check accuracy supplies the existing **20% micro-check component** of the unchanged shared grade model:

- Micro-checks — 20%
- Flashcards — 10%
- Chapter assessment — 40%
- Scenario/application — 15%
- Remediation/reassessment — 15%

## Student runtime

`ChapterContent` now:

- loads Chapter 13 persisted micro-check attempts for the signed-in student
- renders each check immediately after its mapped lesson section
- locks previously answered questions
- persists a first response only
- displays the supported explanation after the answer is locked
- retains recorded evidence across reloads

Safety-specific urgent intervention messaging is intentionally deferred to **C13-6**, where hazard classification and 100% safety recovery rules will be defined explicitly.

## Certification gates

C13-5 is GREEN only when:

1. all 8 concepts have a live micro-check
2. all 16 questions are understanding/application/scenario level
3. all placement IDs exist in the current lesson
4. every question matches its parent canonical concept
5. duplicate responses cannot replace first-attempt evidence
6. initial misses remain separate from later reassessment recovery
7. persisted rows convert to the shared evidence contract
8. diagnostics return all 8 canonical concepts
9. persisted accuracy feeds the unchanged shared 20% micro-check grade component
10. student runtime loads/renders/persists Chapter 13 checks
11. C13-1 through C13-4 remain intact
12. exact-head Engineering Verification is GREEN
13. exact-head Vercel preview is READY
