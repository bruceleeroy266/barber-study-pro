# G5-5 — Chapter 5 Unified Grading Audit & Upgrade

Status: IN CERTIFICATION.

## Baseline audit

Chapter 5 already had:
- six locked concept families
- a hardened 90-card flashcard deck
- a hardened 50-question initial assessment
- a 90-question reassessment reserve
- exactly 15 reserve questions per concept family
- concept detection and targeted remediation registration
- a canonical mapping provider that resolved both initial and reserve questions

The grading/runtime gaps were:
- Chapter 5 was still configured as a one-question knowledge check
- no shared chapter grading/mastery binding
- no immutable first-attempt micro-check evidence
- no Chapter 5 student-detail instructor mastery diagnostics
- formal reassessment selection exposed initial + reserve questions rather than a reserve-only pool

## G5-5 changes

- bound Chapter 5 to the canonical shared grading/mastery engine
- upgraded Chapter 5 remediation from one question to the shared five-question sequence
- added six embedded micro-checks, two questions per concept family
- persisted immutable first-attempt micro-check evidence through chapter_micro_check_attempts
- added instructor diagnostics combining micro-check, initial assessment, and formal reassessment evidence
- preserved initial misses after remediation
- aggregate five persisted one-question reassessment attempts by remediation cycle before recovery applies
- changed formal reassessment selection to reserve-only while preserving initial-question resolution for diagnosis/evidence
- preserved the hardened 90 flashcards, 50-question initial assessment, and 90-question reassessment reserve

## Certification gates

G5-5 is GREEN only after the exact final head passes TypeScript, changed-file lint, full unit/regression tests, production build, bundle-size check, Pilot Onboarding Certification, exact-head Vercel preview, and Chapter 5 grading/remediation regression checks.

No merge is authorized by this document.
