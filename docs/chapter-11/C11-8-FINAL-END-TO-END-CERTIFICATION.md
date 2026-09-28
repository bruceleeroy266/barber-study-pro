# C11-8 — Final Chapter 11 End-to-End Certification

**Baseline:** C11-7 exact certified head `9f6f7f7836d6d9462ece70bf49638c9b12f2355e`

## Objective

Adversarially certify the complete Chapter 11 learning and oversight chain:

lesson → 80 flashcards → 50-question assessment → 17 micro-check questions → concept detection → safety escalation → targeted remediation → five-question reassessment → mastery recovery → instructor/school-admin visibility.

## Final inventory

- canonical concept families: 8
- mapped lesson/content blocks: 27
- active flashcards: 80
- chapter-assessment questions: 50
- micro-check questions: 17 across 8 checks
- fresh reassessment questions: 40
- reassessment reserve: exactly 5 questions per concept

Every canonical concept has mapped lesson content, flashcards, assessment evidence, a micro-check, and a five-question reassessment reserve.

## Runtime chain

C11-8 verifies Chapter 11 is registered in the chapter-generic runtime for:

- concept detection;
- remediation assignment generation;
- remediation content serving;
- canonical fresh-question mapping;
- reassessment detection.

Historical assessment questions are excluded from the fresh reassessment pool, and reassessment selection resolves to the dedicated `r11-` reserve.

## Evidence and recovery

First-attempt micro-check evidence remains immutable.

Ordinary gaps continue to use:

- mastery <= 70% OR >= 2 preserved initial misses;
- exactly 5 reassessment questions;
- pass at 80% (4/5).

Urgent safety recovery continues to require:

- exactly 5 reassessment questions;
- pass at 100% (5/5).

Reassessment evidence is appended as `remediation_reassessment / reassessment`. Original misses remain in the evidence record while successful reassessment can raise current mastery.

## Instructor and school-admin visibility repair

The final audit found one remaining runtime gap: Chapter 11 evidence and diagnostics were not yet included on the canonical instructor/student detail page.

C11-8 repairs that gap by:

- extending the single shared `chapter_micro_check_attempts` query through `ch-11`;
- partitioning Chapter 11 rows from the same shared evidence read;
- adding Chapter 11 instructor diagnostics;
- filtering Chapter 11 assessment/reassessment attempts to `quiz-11` and `ch11-` concepts;
- rendering Chapter 11 grade, mastery, confidence, micro-check score, assessment score, remediation status, latest reassessment, safety intervention, strongest/weakest concepts, and preserved initial misses;
- keeping school-admin on the exact same canonical student-detail diagnostics route already used by instructors.

The existing same-school authorization and RLS model remains unchanged.

## Residual source-boundary repair

The audit also found residual promotional `healing` language in the Chapter 11 theme/subtitle left over from the pre-hardening presentation layer. C11-8 removes that wording and replaces it with professional hair/scalp care language. This does not alter source-supported instructional content.

## Shared grading unchanged

C11-8 does not modify `src/lib/concept-mastery/shared-grading.ts`.

The shared weights remain:

- micro-checks 20%
- flashcards 10%
- chapter assessment 40%
- scenario/application 15%
- remediation/reassessment 15%

## Source limitation

Chapter 11 remains grounded in the repository `CHAPTER-11-MATERIAL-SUMMARY.md`, described as a summary of Milady Chapter 11 pages 276–285. This certification does not claim fresh independent page-by-page textbook verification.

## Merge gate

Chapter 11 is merge-ready only if:

1. the exact C11-8 head passes Engineering Verification;
2. the exact-head Vercel preview reaches READY;
3. the full end-to-end certification tests pass;
4. no shared-grading regression is introduced;
5. instructor and school-admin oversight remain on the same authorized evidence route.

No merge is authorized by this certification alone.


Verification trigger: PR #132 is tested against `main`; no merge authorization is implied.
