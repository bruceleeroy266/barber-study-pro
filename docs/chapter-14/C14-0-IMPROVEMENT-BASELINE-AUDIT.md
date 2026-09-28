# C14-0 — Chapter 14 Improvement Baseline Audit

Baseline production commit: `760d408cbe31dba15f06951750f1de2306f9a105`

This audit starts Chapter 14 from the existing production implementation. It is a repository/runtime architecture audit only. It does **not** independently reverify Milady textbook pages, NIC/state-board blueprints, or outside regulatory claims. Source-grounding decisions belong in the later content-hardening phase.

## Existing runtime implementation

Chapter 14 is already built and registered in the live curriculum:

- Lesson: `src/lib/chapter-14-premium.ts`
- Flashcards: `src/lib/chapter-14-premium-flashcards.ts`
- Assessment: `src/lib/chapter-14-premium-quiz.ts`
- Lesson registry: `src/lib/chapter-content.ts`
- Flashcard registry: `src/lib/flashcards-data.ts`
- Quiz registry: `src/lib/quiz-data.ts`

Current title: **Men's Haircutting and Styling**.

The improvement strategy is therefore to preserve useful educational structure and stable IDs while bringing Chapter 14 onto the same hardened concept, evidence, grading, remediation, safety, and oversight standard already certified through Chapter 12.

## Measured inventory

### Lesson

- 64 top-level lesson sections
- Section-type distribution:
  - 34 content blocks
  - 8 tabbed sections
  - 8 checklists
  - 4 scenario blocks
  - 3 challenge cards
  - 2 feature grids
  - 2 level-up sections
  - 1 info-card section
  - 1 quote section
  - 1 action-prompt section
- 4 scenario/application blocks currently exist in the lesson.

The lesson is substantial and should be hardened in place rather than rewritten from scratch.

### Flashcards

- 112 active flashcards
- Stable IDs: `fc-ch14-001` through `fc-ch14-112`
- Duplicate IDs found: 0
- Difficulty:
  - easy: 75
  - medium: 37
  - hard: 0
- 21 category labels are currently used.

The complete lack of hard flashcards is a calibration flag, not an automatic defect. C14-3 must determine whether higher-order/application coverage is already carried by other assets or whether selected cards should be hardened.

### Chapter assessment

- 70 questions
- Stable IDs: `qq-14-001` through `qq-14-070`
- Duplicate IDs found: 0
- Difficulty:
  - easy: 40
  - medium: 23
  - hard: 7
- Answer-position distribution:
  - A = 70
  - B = 0
  - C = 0
  - D = 0

The all-A answer key is a **RED certification blocker**.

The answer key must not be cosmetically randomized. Every question, explanation, distractor set, and correct-answer mapping must be independently reviewed before answer positions are changed.

## What already passes the baseline

The existing implementation already has several useful foundations worth preserving:

- complete lesson, flashcard, and quiz assets exist
- Chapter 14 is wired into the shared lesson, flashcard, and quiz registries
- flashcard and assessment IDs are stable and unique
- the lesson contains multiple scenario/application sections
- the curriculum covers consultation, facial design, head structure, cutting geometry, elevation, guides, shear/clipper/razor techniques, texturizing, haircut styles, finish work, styling, safety, and locks
- the assessment contains an explicit difficulty field and includes some scenario-style prompts
- the existing lesson is already structured into reusable interactive section types rather than one long text block

These assets should be preserved unless later source verification or certification testing proves a specific item needs repair.

## Unified architecture gaps

No Chapter 14 concept architecture currently exists on production `main`.

The following Chapter 14 modules are absent:

- `src/lib/chapter-14-concepts/concepts.ts`
- `src/lib/chapter-14-concepts/mappings.ts`
- `src/lib/chapter-14-concepts/grading.ts`
- `src/lib/chapter-14-concepts/micro-checks.ts`
- `src/lib/chapter-14-concepts/micro-check-persistence.ts`
- `src/lib/chapter-14-concepts/safety-intervention.ts`
- `src/lib/chapter-14-concepts/reassessment-reserve.ts`
- `src/lib/chapter-14-concepts/targeted-remediation.ts`
- `src/lib/chapter-14-concepts/instructor-diagnostics.ts`
- final Chapter 14 end-to-end certification coverage

No `buildChapter14InstructorDiagnostics` implementation is present, and Chapter 14 is not yet registered for the same concept-detection/remediation architecture used by the certified earlier chapters.

Therefore Chapter 14 does not yet have proven:

- canonical learning objectives and stable concept families
- one-to-one lesson/content mapping into those concept families
- flashcard and assessment mapping into the same evidence model
- durable first-attempt micro-check evidence
- live five-component grading through the shared mastery engine
- concept-gap detection
- targeted remediation content
- five fresh reassessment questions per ordinary remediation cycle
- 80% ordinary reassessment pass rule
- urgent safety escalation with five fresh questions at 100%
- preserved immutable initial misses after recovery
- instructor and school-admin concept diagnostics on the same authorized student evidence route
- final end-to-end Chapter 14 certification

## Shared grading contract to inherit

Chapter 14 must reuse the certified shared grading model rather than create chapter-specific grading logic:

- micro-checks: 20%
- flashcard/study evidence: 10%
- chapter assessment: 40%
- scenario/application evidence: 15%
- remediation/reassessment recovery: 15%

Completion/progress must remain separate from academic grade/mastery.

Ordinary reassessment remains exactly five fresh questions with an 80% pass requirement. Urgent safety recovery remains exactly five fresh questions with a 100% pass requirement.

## Source-grounding flags

The current repository contains wording that requires later source verification before Chapter 14 can be called content-certified. These are **audit flags only**, not conclusions that the statements are wrong.

Examples include:

- subtitle wording promising “board-exam mastery”
- a lesson section titled “Guards vs. Detachable Blades — State Board Critical”
- claims that clipper guards are “typically NOT acceptable for state board practical examinations”
- a flashcard and assessment question repeating that state-board guard claim
- broad absolute wording such as “Never cut into or above the natural hairline”
- sanitation/cross-contamination instructions that should be checked against the approved infection-control and regulatory source basis
- razor/tool-maintenance safety statements that need source-aligned procedural boundaries
- flashcard language such as “there is no true trim in professional barbering,” which should be checked for textbook support versus instructional interpretation

C14 source hardening must preserve ASCYN PRO original wording where supportable and must not copy textbook prose.

## Assessment quality flags

Beyond the A=70 defect, the assessment needs a full quality review for:

- distractor plausibility
- answer-length clues
- overuse of definition/recall prompts
- application/scenario balance
- alignment between question, keyed answer, and explanation
- duplicated concepts or redundant prompts
- unsupported board/state certainty
- safety-sensitive procedural wording
- difficulty calibration against actual cognitive demand rather than labels alone

The current difficulty tags alone are not sufficient evidence that the bank is calibrated.

## Flashcard quality flags

C14-3 should specifically audit:

- the 75 easy / 37 medium / 0 hard distribution
- category fragmentation across 21 labels
- duplicate or near-duplicate learning targets
- terminology consistency with the lesson
- safety/regulatory claims
- whether state-board claims belong in core instruction
- whether each future concept family has enough flashcard coverage
- whether stable IDs can be preserved through repairs

## Entry plan

1. **C14-1 — Canonical Concept Architecture + Shared Grading/Evidence Binding**
   - define Chapter 14 learning objectives and stable concept families from the existing lesson
   - map the 64 lesson sections, 112 flashcards, 70 assessment questions, and application sections
   - connect Chapter 14 to the shared grading/evidence foundation already certified through Chapter 12
   - do not rewrite educational content yet

2. **C14-2 — Source-Grounded Lesson Hardening**
   - verify the existing lesson against Milady where authoritative source material is available
   - repair unsupported board-exam certainty, regulatory claims, safety wording, procedural overreach, and unsupported absolutes
   - preserve useful lesson structure and ASCYN PRO wording
   - do not copy textbook prose

3. **C14-3 — Flashcard Audit + Concept Mapping**
   - verify all 112 cards for coverage, duplication, terminology, difficulty, safety, and source support
   - preserve stable IDs where possible

4. **C14-4 — 70-Question Assessment Audit + Repair**
   - independently verify every correct answer and explanation
   - repair weak/unsupported distractors
   - fix the A=70 answer-position defect only after correctness is verified
   - improve scenario/application and difficulty balance where needed

5. **C14-5 — Micro-Checks + Immutable Evidence Binding**

6. **C14-6 — Safety Escalation + Hazard Mapping**

7. **C14-7 — Targeted Remediation + Fresh Five-Question Reassessment**

8. **C14-8 — Instructor/School-Admin Diagnostics + Live Five-Component Grade**

9. **C14-9 — Final Chapter 14 End-to-End Certification**
   - lesson → 112 flashcards → 70-question assessment → micro-checks → concept detection → safety escalation → targeted remediation → fresh five-question reassessment → mastery recovery → instructor/school-admin visibility
   - exact-head Engineering Verification
   - exact-head Vercel preview
   - merge only after explicit user authorization

## C14-0 disposition

**C14-0 status: GREEN as a baseline audit.**

The existing Chapter 14 implementation is usable as the starting educational foundation, but Chapter 14 itself is **not certified**. The primary blockers are the missing unified concept/evidence/remediation architecture, unverified source-sensitive wording, lack of instructor/admin diagnostics, and the 70/70 answer-A assessment defect.

No educational runtime content was changed during C14-0.
