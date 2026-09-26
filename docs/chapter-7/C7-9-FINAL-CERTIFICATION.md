# C7-9 — Final Chapter 7 Grading & Integrity Certification

## Certification basis

This phase implements the final automated integrity requirements in the ASCYN PRO Chapters 7+ Grading & Mastery Framework.

The governing checks are:
- weights sum correctly,
- chapter assessment remains the heaviest component,
- flashcards/completion cannot dominate,
- concept evidence maps correctly,
- insufficient evidence cannot create falsely high confidence,
- reassessment uses unseen questions,
- first-attempt misses remain preserved,
- concept mastery updates after new evidence,
- unrelated/cross-chapter evidence does not contaminate Chapter 7,
- instructor presentation does not expose internal IDs,
- grading/mastery are deterministic for the same evidence set.

## Integrity gap found and corrected

The C7-9 audit found that Chapter 7 did not yet have an operational reassessment reserve registered with the shared remediation system.

That meant the framework's unseen-reassessment requirement could not be certified.

C7-9 corrects that by adding:
- 150 Chapter 7 reserve questions,
- 15 reserve questions for each of the 10 canonical concept families,
- capacity for three formal five-question reassessment cycles per concept,
- complete separation from the initial 50-question assessment,
- canonical question-to-concept mappings,
- a Chapter 7 mapping provider,
- a Chapter 7 detection provider,
- remediation content-provider registration,
- shared-provider registry registration,
- five-question knowledge-check sequencing,
- instructor diagnostic support for reserve-question evidence.

## Certification boundaries

The initial 50 scored assessment questions remain the initial assessment bank.

The 150 reserve questions use IDs qq-7-051 through qq-7-200 and are not part of the ordinary chapter assessment.

Historical exclusion uses both:
1. initial assessment history, and
2. prior reassessment-question history.

A reserve question is eligible only if the student has not previously attempted it for that concept.

## Final pass requirements

Chapter 7 is not fully certified until the current C7-9 head passes:
- TypeScript,
- lint,
- all unit/integrity tests,
- production build,
- bundle-size check,
- pilot onboarding certification,
- Vercel READY on the exact current head.

No merge is authorized by this document.
