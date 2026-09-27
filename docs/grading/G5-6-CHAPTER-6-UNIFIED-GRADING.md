# G5-6 — Chapter 6 Unified Grading Audit & Upgrade

Status: IN CERTIFICATION.

## Baseline audit

Chapter 6 already had:
- ten locked concept families
- a hardened 125-card flashcard deck
- a hardened 50-question initial assessment
- a 150-question reassessment reserve
- exactly 15 reserve questions per concept family
- a five-question remediation sequence
- concept detection and targeted remediation registration
- scope-safe anatomy/physiology content that repeatedly preserves observation/referral boundaries

Safety review found no dedicated Chapter 6 safety-intervention module. Instead, safety and professional-boundary handling is embedded in the lesson, assessment, reassessment, and instructor guidance, especially for nervous-system symptoms, cardiovascular awareness, lymphatic swelling, skin observations, and endocrine/other-system diagnosis boundaries.

The unified-grading gaps were:
- no shared chapter grading/mastery binding
- no immutable first-attempt micro-check evidence
- no Chapter 6 student-detail instructor mastery diagnostics
- formal reassessment selection still exposed initial + reserve questions rather than a reserve-only pool

## G5-6 changes

- bound Chapter 6 to the canonical shared grading/mastery engine
- preserved the existing five-question remediation sequence
- added ten embedded micro-checks, two questions per concept family
- included explicit service-safety and scope-boundary checks in the new micro-check layer
- persisted immutable first-attempt micro-check evidence through chapter_micro_check_attempts
- added instructor diagnostics combining micro-check, initial assessment, and formal reassessment evidence
- preserved initial misses after remediation
- aggregate five persisted one-question reassessment attempts by remediation cycle before recovery applies
- changed formal reassessment selection to reserve-only while preserving initial-question resolution for diagnosis/evidence
- preserved the hardened lesson, 125 flashcards, 50-question initial assessment, and 150-question reassessment reserve

## Certification gates

G5-6 is GREEN only after the exact final head passes TypeScript, changed-file lint, full unit/regression tests, production build, bundle-size check, Pilot Onboarding Certification, exact-head Vercel preview, and Chapter 6 grading/remediation regression checks.

No merge is authorized by this document.
