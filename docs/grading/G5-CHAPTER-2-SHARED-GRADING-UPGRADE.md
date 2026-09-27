# G5 — Chapter 2 Shared Grading Upgrade

Status: IN CERTIFICATION — five-question reassessment expansion implemented.

## Completed

- Chapter 2 bound to the canonical shared grading and mastery engine.
- 10 embedded micro-checks / 20 first-attempt questions added to the Chapter 2 lesson runtime.
- First-attempt micro-check evidence persists immutably in `chapter_micro_check_attempts`.
- Instructor diagnostics consume Chapter 2 micro-check, initial assessment, and reassessment evidence.
- All 25 active Chapter 2 concepts appear in instructor mastery diagnostics.
- Original misses remain preserved after later reassessment evidence.
- 100 additional reassessment questions were authored, giving exactly five reserve questions for each of the 25 active concepts.
- Every new reassessment item is source-audited to canonical Chapter 2 lesson blocks.
- Formal reassessment now requires five persisted questions before recovery can be applied.
- Chapter 2's mapping provider now exposes only dedicated reserve questions to the formal reassessment selector; unseen initial-quiz questions cannot silently substitute.
- The original 48-question initial assessment remains unchanged.

## Source-grounding rule

The 100-question G5 expansion is grounded in ASCYN PRO's canonical Chapter 2 lesson blocks and approved concept architecture. The source-audit metadata records the concept, supporting lesson block IDs, and the source basis for every new question.

Questions use original ASCYN PRO wording and do not introduce publisher reproduction or direct board-exam certainty.

## Certification gates

Chapter 2 becomes GREEN only after the exact final head passes:

1. TypeScript
2. changed-file lint
3. full unit/regression suite
4. production build
5. Pilot Onboarding Certification
6. exact-head Vercel preview READY
7. five-question runtime regression: selection → persistence → completion gate → grade recovery → instructor visibility

No merge is authorized by this document.
