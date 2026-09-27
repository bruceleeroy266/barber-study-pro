# G3 — Chapter 9 Shared Runtime Registration

Status: IN CERTIFICATION  
Parent architecture: G2 Canonical Chapters 1–9 Grading Standard

## Goal

Connect Chapter 9's already-built concept, mastery, remediation, reassessment, safety, and instructor-diagnostic logic to the same production runtime used by the shared remediation system.

## Runtime wiring added

- Chapter 9 initial-quiz concept detection provider
- Chapter 9 canonical mapping provider
- Chapter 9 detection provider for reassessment evaluation
- Chapter 9 remediation content provider
- Chapter 9 five-question knowledge-check sequencing
- Chapter 9 fresh reassessment reserve through the historical-exclusion engine
- Chapter 9 registration in the quiz-completion detection/remediation handoff

## G3-2 certification chain

The required chain is:

weak initial Chapter 9 assessment
→ shared concept detection
→ concept-specific remediation cycle
→ canonical targeted content + flashcards
→ five fresh reserve questions
→ persisted reassessment semantics
→ updated concept mastery/recovery
→ instructor diagnostics preserving the original misses

Automated regression coverage is provided by:

- `src/lib/reassessment/__tests__/chapter-9-runtime-registration.test.ts`
- `src/lib/chapter-9-concepts/g3-shared-runtime-certification.test.ts`

G3 may only be marked GREEN after exact-head Engineering Verification succeeds.
