# G2 — Canonical Chapters 1–9 Grading Standard

Status: LOCKED ARCHITECTURE BASELINE  
Scope: Chapters 1–9  
Purpose: Define one shared grading, mastery, remediation, reassessment, and instructor-visibility architecture before chapter-by-chapter implementation.

## 1. Canonical student-learning chain

Every supported chapter must use the same logical chain:

1. Student completes lesson and embedded micro-checks.
2. First-attempt evidence is persisted immutably.
3. Flashcard, chapter-assessment, scenario/application, and reassessment evidence are mapped to canonical concept families.
4. Shared concept detection identifies insufficient evidence, emerging weakness, repeated weakness, improving, or currently performing well.
5. Shared mastery scoring calculates concept mastery and confidence.
6. Weak concepts create targeted remediation using only content mapped to that concept.
7. Formal reassessment uses fresh questions mapped to the same concept.
8. Reassessment evidence is appended; original misses remain preserved.
9. Final grade may improve through recovery but remediation can never lower the student's pre-remediation base grade.
10. Instructor/admin views read the same persisted evidence and show the same concept-level diagnosis.

## 2. Canonical evidence model

All chapters must normalize evidence into these five sources:

- micro_check
- flashcard
- chapter_assessment
- scenario_application
- remediation_reassessment

Each evidence record must include:

- studentId
- chapterId
- conceptFamilyId
- source
- itemId
- difficulty
- correct
- attemptPhase
- timestamp

Canonical difficulty values:

- recall
- understanding
- application
- scenario

Canonical attempt phases:

- initial
- remediation
- reassessment

No chapter may invent an alternate evidence vocabulary when the shared vocabulary is sufficient.

## 3. Canonical grade weights

Use the existing shared grading weights as the Chapters 1–9 standard:

- Micro-checks: 20%
- Flashcards: 10%
- Chapter assessment: 40%
- Scenario/application: 15%
- Remediation reassessment: 15% recovery component

Ordinary evidence is normalized across the evidence buckets that are actually available so an incomplete source integration does not artificially lower a student's grade.

Reassessment is a recovery path. The final grade must be:

max(base grade, recovery-blended grade)

A student may recover from weakness, but remediation must never reduce the student's existing grade.

## 4. Canonical concept mastery weighting

All chapters must use the shared mastery model.

Difficulty weights:

- recall: 0.75
- understanding: 1.00
- application: 1.25
- scenario: 1.50

Evidence-source weights:

- micro_check: 1.00
- flashcard: 0.60
- chapter_assessment: 1.40
- scenario_application: 1.50
- remediation_reassessment: 1.25

Attempt-phase weights:

- initial: 1.00
- remediation: 0.75
- reassessment: 1.10

Recency may modestly reduce old evidence weight, but historical evidence must never be erased.

## 5. Canonical confidence semantics

Every concept must expose one of:

- insufficient_evidence
- emerging
- developing
- proficient
- strong

Confidence must depend on evidence quantity, question diversity, evidence-source diversity, and application/scenario exposure. A single correct answer must not be treated as strong mastery.

## 6. Canonical learning-gap detection

The existing shared concept-detection engine is authoritative for Chapters 1–9.

Detection states:

- insufficient_evidence
- emerging_weakness
- repeated_weakness
- improving
- currently_performing_well

Existing production thresholds in the shared engine are preserved during migration. Chapter migrations must not silently retune detection thresholds.

Important behavior:

- one isolated miss does not automatically become repeated weakness;
- repeated weakness requires sufficient evidence;
- alternating results reduce certainty;
- recent sustained correct performance can move a learner to improving/currently-performing-well;
- historical weakness remains auditable.

## 7. Canonical remediation rule

Remediation is concept-targeted, not chapter-wide.

A remediation cycle must identify:

- chapterId
- target conceptFamilyId
- why the concept was targeted
- mapped lesson/content blocks
- mapped flashcards
- reassessment reserve
- current status/outcome

Only canonical chapter assets mapped to that concept may be served in targeted remediation.

No generic "review the whole chapter" fallback may be treated as equivalent to concept remediation.

## 8. Canonical reassessment rule

The target standard for Chapters 1–9 is a five-question fresh reassessment per remediated concept.

Requirements:

- exactly five unique questions when a formal reassessment is required;
- each question must map canonically to the target concept;
- reassessment questions must not overwrite initial evidence;
- reassessment attempts must persist with is_reassessment=true and target_concept_id;
- original misses remain visible after successful recovery;
- ordinary reassessment pass standard: 80%;
- safety-critical reassessment may require 100% when chapter-specific safety policy explicitly calls for it.

Legacy chapter behavior with fewer than five questions is a migration gap, not the long-term standard.

## 9. Safety and scope interventions

Safety escalation is chapter-specific, but must plug into the same shared evidence/remediation architecture.

A chapter should only define safety escalation when its content has genuine service-safety, infection-control, scope, or client-harm implications.

Safety policy may:

- require instructor review;
- raise remediation priority;
- require a formal five-question reassessment;
- require 100% on that safety reassessment when justified.

Safety logic must not make medical diagnoses or exceed barber/cosmetology scope.

## 10. Canonical persistence rules

First-attempt micro-check evidence is immutable.

All persisted learning evidence must be:

- student-scoped;
- chapter-scoped;
- concept-scoped where applicable;
- timestamped;
- auditable;
- protected from silent overwrite;
- readable by authorized same-school instructor/admin roles under RLS.

Retries and reassessment create new evidence; they do not rewrite the student's original performance history.

## 11. Canonical instructor visibility

Every Chapter 1–9 instructor student-detail section must expose the same minimum diagnostic fields:

- chapter grade
- overall mastery
- overall confidence
- chapter assessment percentage
- micro-check percentage
- remediation reassessment percentage
- strongest concepts
- weakest concepts
- all concept mastery rows
- observation count
- initial misses
- reassessment correct count
- latest evidence timestamp
- active remediation status
- latest reassessment result
- safety/intervention state when applicable

The instructor must be able to distinguish:

- low score due to lack of evidence;
- a true repeated concept weakness;
- recent improvement;
- successful reassessment recovery;
- unresolved safety intervention.

## 12. Canonical admin visibility

Admin and school-admin views must consume the same underlying evidence model as instructor views.

Admin presentation may aggregate by school/class, but must never calculate a separate conflicting mastery score.

Future school-level views should aggregate:

- students weak by concept
- active remediation counts
- unresolved safety flags
- reassessment completion
- average mastery by concept
- chapter-level trends

## 13. Canonical student-facing behavior

Students should see:

- what concept needs work;
- what material to review;
- whether reassessment is required;
- reassessment progress/result;
- recovery after improvement.

Students should not receive internal confidence-engine labels or raw diagnostic implementation details unless intentionally translated into learner-friendly language.

## 14. Required runtime registration

A chapter is not considered fully unified until it is registered in all applicable shared runtime layers:

- canonical mapping provider
- concept detection provider
- remediation content provider
- reassessment sequencing
- reassessment submission/evaluation
- micro-check persistence
- instructor diagnostics

A chapter-specific library alone is not sufficient if the live runtime cannot reach it.

## 15. Required certification chain

A chapter may only be marked GREEN under this standard when regression coverage proves:

student answer
→ persisted evidence
→ canonical concept mapping
→ weakness detection
→ targeted remediation
→ five fresh reassessment questions
→ persisted reassessment evidence
→ updated mastery/recovery
→ instructor visibility

For safety-enabled chapters, certification must additionally prove:

high-risk miss
→ safety intervention
→ required review/remediation
→ formal reassessment
→ correct instructor visibility
→ safe clearing behavior

## 16. Migration order

1. Chapter 9 runtime registration gap
2. Chapter 8 instructor diagnostics
3. Chapters 2–6 shared grading + micro-check + persistence + instructor visibility
4. Chapter 1 full concept/detection/remediation architecture
5. Cross-chapter Chapter 1–9 certification

Chapter 7 remains a reference implementation but must still pass the final cross-chapter certification.

## 17. Non-negotiable invariants

- No answer key exposure to students.
- No loss of historical first-attempt evidence.
- No reassessment that lowers an existing grade.
- No concept diagnosis from unrelated questions.
- No chapter-specific grading weights without explicit architecture approval.
- No duplicated remediation engine when shared infrastructure can be reused.
- No production chapter declared unified until end-to-end runtime wiring is proven.
- No merge without exact-head Engineering Verification and Vercel readiness.

This document is the architecture contract for all G3+ implementation work.
