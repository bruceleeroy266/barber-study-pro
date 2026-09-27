# G6 — Chapters 1–9 Final Unified Grading Certification

Status: IN CERTIFICATION.

## Cross-chapter audit findings

The audit found two structural gaps that prevented a truthful Chapters 1–9 certification:

1. Chapter 1 had premium lesson, flashcards, and a 30-question assessment, but no canonical concept architecture, no shared detection/remediation provider registration, no fresh reassessment reserve, no immutable micro-check evidence, and no instructor mastery diagnostics.
2. Chapter 7 had mature concept/grading/remediation assets but was missing from the browser-safe detection-handoff registry, so quiz completion could not use the same chapter-aware detection path as the other supported chapters.

The audit also found that Chapters 7 and 8 still carried local copies of the shared grading/mastery formula rather than importing the canonical shared engine.

## G6 repairs

- added a five-family canonical Chapter 1 concept architecture
- mapped Chapter 1 lesson blocks, 45 flashcards, and all 30 initial questions
- added a 75-question Chapter 1 reassessment reserve: 15 fresh questions per family
- registered Chapter 1 in mapping, detection, targeted-remediation, and five-question sequencing registries
- added 5 Chapter 1 micro-checks / 10 immutable first-attempt questions
- added Chapter 1 instructor diagnostics and student-detail visibility
- repaired Chapter 7 detection-handoff registration
- rebound Chapter 7 and Chapter 8 grading/mastery to the canonical shared engine
- added a cross-chapter G6 certification suite covering Chapters 1–9

## Required final invariants

For every chapter 1–9:
- concept-level detection is registered
- formal remediation selects fresh reserve questions, not initial assessment questions
- remediation sequence length is five
- micro-check evidence is first-attempt and concept-bound
- grading weights use the canonical shared contract
- targeted remediation has mapped lesson and flashcard material
- instructor diagnostic code is available
- initial misses remain part of the mastery evidence after reassessment

G6 is GREEN only after the exact final head passes Engineering Verification, production build, full tests, bundle-size verification, Pilot Onboarding Certification, exact-head Vercel preview, and final preview smoke checks.

No merge authorization is implied.
