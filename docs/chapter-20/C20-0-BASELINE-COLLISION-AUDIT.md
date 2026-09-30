# C20-0 — Chapter 20 Baseline / Collision Audit

## Chapter
**Chapter 20 — Working Behind the Chair**

## Baseline SHA
`29b759eb5e95b5c341995aba16de5d51f5fe0cc5`

## Purpose
Establish the exact production baseline before Chapter 20 is upgraded into the same evidence, grading, remediation, reassessment, mastery-recovery, and instructor-visibility architecture used by Chapters 14–19.

C20-0 is an audit only. It does not change curriculum, grading weights, student evidence, or production behavior.

## Existing production assets

### Lesson
- Production Chapter 20 lesson content exists in `src/lib/chapter-20-premium-content.ts`.
- The lesson title is **Working Behind the Chair**.
- Existing content covers professional expectations, teamwork, compensation/employment classification, money management, ethical selling, client retention, referrals, and professional growth.
- The current lesson is still substantially wrapped as legacy HTML inside the premium content shell.
- Existing lesson blocks expose six learning-objective identifiers (`CH20-LO01` through `CH20-LO06`).

### Flashcards
- `src/lib/chapter-20-premium-flashcards.ts` contains **60 active premium flashcards**.
- IDs use the `fc-ch20-###` namespace.
- Flashcards are grouped by existing topical categories.
- They do not yet carry a canonical Chapter 20 concept-family mapping suitable for the shared mastery/remediation pipeline.

### Assessment
- `src/lib/chapter-20-premium-quiz.ts` contains **17 questions**.
- Passing score is **80%**.
- Quiz questions map to the six current learning objectives.
- Existing `QuizClient.ch20.test.tsx` tests the Chapter 20 quiz flow and explicitly expects all 17 questions.
- The assessment is therefore live and tested, but it is not yet hardened into the newer Chapter 14–19 concept/evidence architecture.

## Missing shared architecture

The following Chapter 20 artifacts were not found on the audited production baseline:

1. Canonical Chapter 20 concept registry.
2. Stable concept-family mapping across lesson blocks, flashcards, assessment questions, and remediation.
3. Chapter 20 embedded micro-check inventory with immutable first-attempt evidence.
4. Chapter 20 gap-detection registration against the shared remediation system.
5. Chapter 20 safety/compliance escalation rules.
6. Chapter 20 targeted remediation registry.
7. Chapter 20 fresh five-question-per-concept reassessment reserve.
8. Chapter 20 mastery-recovery certification.
9. Chapter 20 instructor/school-admin diagnostic certification.
10. Final Chapter 20 end-to-end certification documentation.

## Existing inconsistency
`src/lib/demo-data.ts` contains a stale Chapter 20 comment stating **15 questions**, while the same entry description and the live premium quiz contain **17 questions**. This must be reconciled during assessment hardening so the repository has one authoritative inventory.

## Shared grading contract to preserve
Chapter 20 must join the existing shared five-component model without creating a parallel calculator:

- Micro-checks: **20%**
- Flashcards/study: **10%**
- Chapter assessment: **40%**
- Scenario/application: **15%**
- Remediation/reassessment: **15%**

Completion remains separate from academic mastery.

## Collision risks
- Do not overwrite or renumber the 60 existing flashcards without an explicit migration need.
- Do not silently replace the live 17-question assessment while building the canonical concept architecture.
- Do not create a Chapter 20-specific remediation engine or grade calculator.
- Do not duplicate school-admin diagnostics; extend the authorized shared student-detail path.
- Preserve initial misses and immutable evidence through successful reassessment.
- Keep ordinary recovery at 80%; any future urgent safety/compliance recovery must require 100%.
- Server-authoritative writes must remain behind the hardened shared Supabase service-role path established by Chapter 19 H2.

## Recommended hardening sequence

### C20-1 — Canonical Concept Architecture
Define the canonical Chapter 20 concept families and map lesson blocks, 60 flashcards, and all 17 current assessment questions to them. Lock the shared 20/10/40/15/15 grading contract.

### C20-2 — Lesson Hardening
Convert/normalize the legacy lesson structure into explicit production blocks, preserve source meaning, add concept IDs and embedded application/micro-check coverage without duplicating curriculum.

### C20-3 — Flashcard Hardening
Audit all 60 flashcards for accuracy, duplication, ambiguity, concept coverage, and board-exam usefulness; bind each card to exactly the intended canonical concept family/families.

### C20-4 — Assessment Hardening
Audit the 17-question assessment, resolve the stale 15-question metadata, expand or rebalance only if concept coverage requires it, preserve the 80% pass threshold, and certify question-to-concept coverage.

### C20-5 — Micro-Checks + Immutable Evidence
Add fresh embedded micro-checks across the canonical concept families and persist first-attempt evidence through the shared immutable evidence path.

### C20-6 — Gap Detection + Safety/Compliance Escalation + Targeted Remediation
Register Chapter 20 with shared detection/remediation. Define any employment, tax, client-consent, privacy, professional-conduct, or other compliance concepts that warrant elevated recovery behavior.

### C20-7 — Fresh Reassessment Reserve + Mastery Recovery
Create exactly five fresh reassessment questions per canonical concept family, separate from the live assessment and micro-check namespaces; preserve original misses while allowing successful recovery to raise mastery.

### C20-8 — Instructor / School-Admin Diagnostics
Expose Chapter 20 mastery, weak concepts, original misses, reassessment recovery, remediation state, and any safety/compliance escalation through the existing same-school authorized diagnostic route.

### C20-9 — Final End-to-End Certification
Audit the entire Chapter 20 chain:
lesson → flashcards → assessment → micro-checks → gap detection → escalation → targeted remediation → fresh reassessment → mastery recovery → instructor/school-admin visibility.

Require exact-head Engineering Verification and Vercel before merge authorization.

## C20-0 Result
**YELLOW — baseline is functional but not aligned with the shared Chapter 14–19 hardening architecture.**

The current Chapter 20 lesson, 60 flashcards, and 17-question quiz provide a usable starting inventory. The next engineering task is **C20-1 — Canonical Concept Architecture**.
