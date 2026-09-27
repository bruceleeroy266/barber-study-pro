# G5 — Chapter 2 Shared Grading Upgrade

Status: PARTIAL — shared grading / micro-check / instructor visibility implemented; five-question reassessment reserve expansion still required.

## Completed in this slice

- Chapter 2 bound to the canonical shared grading and mastery engine.
- 10 embedded micro-checks / 20 first-attempt questions added to the Chapter 2 lesson runtime.
- First-attempt micro-check evidence persists immutably in chapter_micro_check_attempts.
- Instructor diagnostics consume Chapter 2 micro-check, initial assessment, and reassessment evidence.
- All 25 active Chapter 2 concepts appear in instructor mastery diagnostics.
- Original misses remain preserved after later reassessment evidence.
- Formal recovery is blocked until five unique reassessment questions exist and are completed for the target concept.

## Important existing-bank gap

Chapter 2 currently has 25 reassessment reserve questions total: exactly one reserve question per active concept.

The G2 canonical standard requires five fresh reassessment questions per remediated concept. Therefore Chapter 2 requires 100 additional source-grounded reserve questions before the shared five-question remediation sequence can be enabled.

Until that expansion is complete:

- do not change ch-2 knowledge-check length to 5;
- do not mark Chapter 2 G5 GREEN;
- do not grant formal reassessment grade recovery from a one-question legacy cycle.

The diagnostics intentionally show a legacy single-question reassessment as `1/5 in progress` and do not apply recovery.

## Remaining G5 Chapter 2 work

1. Author + source-audit 4 additional reserve questions for each of 25 active concepts.
2. Extend canonical question-to-concept mappings.
3. Set Chapter 2 shared knowledge-check length to 5.
4. Run historical-exclusion / pool-exhaustion tests.
5. Run five-question persistence + evaluation + instructor recovery certification.
6. Run exact-head Engineering Verification and Vercel preview.

Only then can Chapter 2 be certified under G2.
