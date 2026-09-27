# G5-3 — Chapter 3 Unified Grading Upgrade

Status: IN CERTIFICATION.

## Baseline audit

Chapter 3 already had:
- four locked concept families
- a 30-question initial assessment
- a 60-question reassessment reserve
- exactly 15 reserve questions per concept family
- a five-question remediation sequence
- concept detection and evaluation providers

The main grading gaps were:
- no shared chapter grading/mastery binding
- no immutable first-attempt micro-check evidence
- no Chapter 3 instructor mastery diagnostics
- formal reassessment selection still exposed initial + reserve questions through the mapping provider and relied on historical exclusion to keep initial questions out

## G5-3 changes

- bound Chapter 3 to the canonical shared grading/mastery engine
- added four embedded micro-checks, two questions per concept family
- persisted first-attempt micro-check evidence through the shared chapter_micro_check_attempts table
- added instructor diagnostics combining micro-check, initial assessment, and formal reassessment evidence
- preserved initial misses after remediation
- aggregated five persisted one-question reassessment attempts by remediation cycle before applying recovery
- kept the existing five-question sequence
- changed formal reassessment selection to reserve-only while keeping initial questions resolvable for detection/evidence
- kept the 30-question initial assessment and 60-question reserve unchanged

## Certification gates

G5-3 is GREEN only after the exact final head passes TypeScript, lint, full unit/regression tests, production build, bundle-size check, Pilot Onboarding Certification, and an exact-head Vercel preview.

No merge is authorized by this document.
