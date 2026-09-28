# C12-0 — Chapter 12 Baseline Audit and Unified Architecture Entry Gate

Baseline production commit: `b0ad45dabeba768059905239c0a2c3d29ca0a7d9`

This audit starts Chapter 12 only after Chapters 1–11 live evidence and percentage alignment was merged and verified in production. It is a repository/runtime architecture audit. It does **not** independently reverify Milady textbook pages, state-board blueprints, or any external source claims.

## Current runtime inventory

- Lesson: `src/lib/chapter-12-premium.ts`
- Flashcards: `src/lib/chapter-12-premium-flashcards.ts`
- Assessment: `src/lib/chapter-12-premium-quiz.ts`
- Flashcard registry: `src/lib/flashcards-data.ts`
- Quiz registry: `src/lib/quiz-data.ts`

Measured from the current repository state:

- 115 flashcards, `fc-ch12-001` through `fc-ch12-115`
- 45 assessment questions, `qq-12-001` through `qq-12-045`
- Assessment difficulty distribution: 25 easy / 15 medium / 5 hard
- Assessment answer-position distribution: A=45 / B=0 / C=0 / D=0
- Lesson contains 31 section IDs
- Lesson currently contains 1 scenario/pro-scenario section

## Unified-architecture gaps

Chapter 12 does not yet have the Chapter 1–11 unified concept/grading implementation. The following expected architecture files are absent:

- `src/lib/chapter-12-concepts/concepts.ts`
- `src/lib/chapter-12-concepts/mappings.ts`
- `src/lib/chapter-12-concepts/micro-checks.ts`
- `src/lib/chapter-12-concepts/instructor-diagnostics.ts`
- `src/lib/chapter-12-concepts/reassessment-reserve.ts` or an equivalent Chapter 12 reserve module

Because those pieces are absent, Chapter 12 does not yet have:

- canonical learning objectives and stable concept families
- lesson / flashcard / assessment mapping into one evidence model
- durable first-attempt micro-check evidence
- targeted remediation tied to detected concept gaps
- fresh five-question reassessment recovery by concept
- Chapter 12 safety escalation / urgent-recovery rules
- instructor and school-admin concept diagnostics on the same shared model
- full live 20/10/40/15/15 grade wiring

## Shared grading contract to inherit

Chapter 12 must reuse the same shared grading foundation already certified for Chapters 1–11:

- micro-checks: 20%
- flashcard/study evidence: 10%
- chapter assessment: 40%
- scenario/application evidence: 15%
- remediation/reassessment recovery: 15%

Implementation source of truth: `src/lib/concept-mastery/shared-grading.ts`.

Completion/progress must remain separate from academic grade/mastery.

## Content hardening flags found in the current lesson

The repository currently contains statements that require source-grounding or wording review before Chapter 12 can be certified, including:

- “Men’s skin is approximately 25% thicker than women’s”
- “removes toxins”
- “therapy your clients will pay for”
- “appear on every state board exam”
- hot-towel temperature wording using “120-140°F”
- “Hyaluronic acid holds 1000x its weight in water”
- “opens pores”
- “products penetrate deeper”
- “healing”

These are audit flags only. This baseline does not decide whether each statement is supportable; C12 source hardening must verify, narrow, or remove them as appropriate.

## Assessment blocker

The 45-question Chapter 12 assessment currently places every keyed answer in position A. This is a certification blocker. The answer key/content must be independently reviewed before rebalancing; answer positions must not be shuffled blindly if doing so risks changing correctness or explanation alignment.

## Entry plan

1. **C12-1 — Canonical Concept Architecture + Shared Grading/Evidence Model**
   - define learning objectives and stable concept families
   - map current lesson, 115 flashcards, 45 assessment questions, and application sections
   - register Chapter 12 with the existing durable activity-evidence architecture
   - reuse shared grading rather than introducing Chapter 12-specific grading logic

2. **C12-2 — Source-Grounded Lesson Hardening**
   - remove unsupported board-exam certainty
   - remove or narrow medical/diagnostic/therapeutic overreach
   - verify numeric and physiological claims against the approved source basis
   - preserve ASCYN PRO original wording rather than copying textbook prose

3. **C12-3 — Flashcard Audit and Mapping**
   - verify coverage, duplication, source support, safety boundaries, and concept balance
   - preserve stable IDs where possible

4. **C12-4 — Assessment Audit and Repair**
   - independently review all 45 keyed answers and explanations
   - repair unsupported items
   - correct the A=45 answer-position defect without altering verified meaning
   - calibrate difficulty and application coverage

5. **C12-5 — Micro-Checks + Immutable Evidence Binding**

6. **C12-6 — Safety Escalation**

7. **C12-7 — Targeted Remediation + Five-Question Reassessment**

8. **C12-8 — Instructor/School-Admin Diagnostics + Live Five-Component Grade**

9. **C12-9 — Final Chapter 12 End-to-End Certification**
   - lesson → flashcards → assessment → micro-checks → concept detection → safety escalation → targeted remediation → fresh five-question reassessment → mastery recovery → instructor/school-admin visibility
   - exact-head Engineering Verification
   - exact-head Vercel preview
   - merge only after explicit authorization
