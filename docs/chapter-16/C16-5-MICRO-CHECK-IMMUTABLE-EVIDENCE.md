# C16-5 — Micro-Check Architecture + Immutable Evidence Integration

**Chapter:** 16 — Women's Haircutting & Styling  
**Base:** C16-4 certified head `1ca4d9939282dba2ccebfd225d9e53961a4c1de1`

## Architecture

C16-5 implements the eight placements planned in C16-1:

1. Design Foundations — after `foundational-cuts-overview`
2. Blunt Cutting — after `blunt-cut-scenario`
3. Graduated Cutting — after `graduated-cut-scenario`
4. Uniform Layering — after `uniform-layer-scenario`
5. Long Layering — after `long-layer-scenario`
6. Hair Analysis / Texture — after `texture-curly-scenario`
7. Advanced Cutting / Texturizing — after `advanced-techniques-scenario`
8. Styling / Finishing / Safety — after `styling-scenario`

Each placement contains exactly two fresh micro-check questions, for **16 total**.

Question namespace is isolated as `mcq-16-001` through `mcq-16-016`, separate from the 30-question assessment namespace.

## Immutable evidence

Chapter 16 uses the existing shared `chapter_micro_check_attempts` table.

That table already enforces first-attempt immutability with:

`unique (user_id, chapter_id, question_id)`

C16-5 therefore does not add a new table or weaken existing RLS.

When a student answers a micro-check:

- the first answer is persisted;
- a duplicate insert resolves to the existing first row;
- evidence is emitted as `source: 'micro_check'`;
- evidence is emitted as `attemptPhase: 'initial'`;
- later retries cannot replace the initial academic evidence.

## Shared grading

Persisted Chapter 16 micro-check performance feeds only the shared `micro_check` component.

The global weighting remains unchanged:

- micro-check: 20%
- flashcard: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

## Student lesson integration

The shared ChapterContent surface now:

- loads Chapter 16 first-attempt rows;
- renders the appropriate Chapter 16 micro-check after each planned lesson block;
- locks a question after the first persisted answer;
- shows correctness and the source-grounded explanation;
- does not yet trigger safety escalation.

Safety classification and urgent escalation are intentionally deferred to C16-6.

## Locked invariants

C16-5 does not alter:

- 11 instructional sections
- 93 lesson blocks
- 68 flashcards or stable flashcard IDs
- 30 assessment questions or answer-key vector
- 68 flashcard mappings
- 30 assessment mappings
- shared 20/10/40/15/15 weighting
- remediation or reassessment behavior

## Certification gate

C16-5 is not formally GREEN until exact-head Engineering Verification and exact-head Vercel both pass.
