# C18-7 — Fresh Reassessment Reserve + Mastery Recovery

C18-7 adds the formal Chapter 18 recovery layer without altering the certified lesson, flashcards, assessment, micro-checks, concept architecture, or C18-6 safety rules.

## Fresh reserve

The reserve contains exactly 35 questions:

- 7 canonical concept families
- exactly 5 questions per concept
- IDs use the dedicated `r18-*` namespace
- understanding/application/scenario difficulty only
- no recall-only reserve items

The reserve is separate from:

- the 15 certified `qq-18-*` assessment questions
- the 14 certified `mcq-18-*` micro-check questions

Certification tests also require reserve prompts to be distinct from the assessment and micro-check prompts.

## Formal cycle

Every formal reassessment cycle uses exactly five unique questions for one concept family.

Ordinary recovery:

- 5 questions
- 4/5 = 80% passes

Urgent multi-hazard safety recovery:

- 5 questions
- 5/5 = 100% required
- 4/5 = 80% does not pass

The C18-6 safety intervention decides whether the concept requires 80% or 100%.

## Immutable history

Reassessment evidence is appended with:

- `source = remediation_reassessment`
- `attemptPhase = reassessment`
- the target canonical concept
- the fresh reserve question ID

Original evidence is never overwritten or rewritten.

Duplicate reassessment evidence with the same student/chapter/source/phase/item identity is ignored.

## Mastery recovery

Successful reassessment may raise current mastery.

It does not erase:

- original micro-check misses
- original assessment misses
- original timestamps
- original initial-miss count

The recovery calculation explicitly returns whether the original evidence prefix remains byte-for-byte equivalent by serialized value.

## Shared providers

C18-7 registers Chapter 18 in the shared reassessment mapping registry.

For every concept, the canonical mapping provider returns exactly the five fresh reserve IDs.

The reassessment-aware detection provider recognizes both:

- original `qq-18-*` assessment mappings
- new `r18-*` reassessment mappings

The shared remediation content provider now serves both the certified assessment bank and the fresh reserve as quiz-compatible items.

## Preserved grade contract

The shared weighting remains:

- micro-check: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

C18-7 does not alter those weights.

## Certification gate

C18-7 can be GREEN only when:

1. reserve count is exactly 35;
2. each of seven concepts has exactly five reserve questions;
3. reserve IDs and prompts are separate from assessment and micro-check banks;
4. formal cycles require exactly five unique questions;
5. ordinary recovery passes at 80%;
6. urgent safety recovery requires 100%;
7. reassessment evidence uses reassessment semantics;
8. successful reassessment raises mastery in the recovery test;
9. all original initial misses remain preserved;
10. duplicate reassessment evidence does not duplicate history;
11. mapping/detection/remediation providers all support Chapter 18;
12. C18-1 through C18-6 regression tests remain green;
13. exact-head Engineering Verification succeeds;
14. exact-head Vercel reaches READY.
