# G5-4 — Chapter 4 Unified Grading Audit & Upgrade

Status: IN CERTIFICATION.

## Baseline audit

Chapter 4 already had:
- six locked concept families
- a hardened 70-card flashcard deck
- a hardened 30-question initial assessment
- a 90-question reassessment reserve
- exactly 15 reserve questions per concept family
- a five-question remediation sequence
- concept detection, targeted remediation, reassessment selection, and instructor-safe presentation helpers

The main unified-grading gaps were:
- no shared chapter grading/mastery binding
- no immutable first-attempt micro-check evidence
- no Chapter 4 student-detail mastery diagnostics
- formal reassessment selection still exposed initial + reserve questions and relied on historical exclusion to keep initial assessment items out

## G5-4 changes

- bound Chapter 4 to the canonical shared grading/mastery engine
- added six embedded micro-checks, two questions per concept family
- persisted first-attempt micro-check evidence through the shared chapter_micro_check_attempts table
- added instructor diagnostics combining micro-check, initial assessment, and formal reassessment evidence
- preserved initial misses after remediation
- aggregated five persisted one-question reassessment attempts by remediation cycle before applying recovery
- kept the existing five-question sequence
- changed formal reassessment selection to reserve-only while keeping initial questions resolvable for detection/evidence
- preserved the hardened lesson, 70 flashcards, 30-question initial assessment, and 90-question reassessment reserve

## Certification gates

G5-4 is GREEN only after the exact final head passes TypeScript, changed-file lint, the full unit/regression suite, production build, bundle-size check, Pilot Onboarding Certification, exact-head Vercel preview, and Chapter 4 grading/remediation regression checks.

No merge is authorized by this document.
