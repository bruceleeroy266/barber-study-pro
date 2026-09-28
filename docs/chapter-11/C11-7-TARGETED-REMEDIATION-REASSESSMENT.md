# C11-7 — Targeted Remediation + Five-Question Reassessment

**Baseline:** C11-6 exact certified head `234093dc0f116e20178315ae3941a9b8a1a99c9c`

## Objective

Complete Chapter 11's detection → targeted remediation → fresh five-question reassessment → mastery-recovery chain while preserving the Chapters 1–10 grading/evidence architecture.

## Fresh reassessment reserve

C11-7 adds **40 fresh reassessment questions**:

- 8 canonical concept families;
- exactly 5 questions per concept;
- dedicated `r11-` namespace;
- no reuse of `qq-11-` chapter-assessment IDs;
- no reuse of `mcq-11-` micro-check IDs;
- all questions are understanding, application, or scenario level.

## Targeted remediation rules

Chapter 11 uses the same hardened recovery policy as Chapter 10:

- ordinary remediation target when concept mastery is **<= 70%** OR there are **>= 2 preserved initial misses**;
- ordinary formal reassessment = **5 questions**;
- ordinary pass = **80% (4/5)**;
- urgent safety reassessment = **5 questions**;
- urgent safety pass = **100% (5/5)**.

A current single tagged safety miss remains priority review unless the ordinary formal-reassessment rule is also met. C11-6 urgent distinct-hazard escalation overrides the ordinary threshold and requires 100%.

## Evidence semantics

Every completed formal reassessment generates evidence with:

- `chapterId: 'ch-11'`;
- `source: 'remediation_reassessment'`;
- `attemptPhase: 'reassessment'`;
- canonical target concept ID;
- fresh reassessment item ID;
- original response correctness and timestamp.

Reassessment evidence is appended. Existing initial evidence is never edited, replaced, or removed.

Successful recovery therefore can raise current concept mastery while the shared mastery record continues to retain the original miss count.

## Live runtime wiring

C11-7 registers Chapter 11 in the same chapter-generic systems used by Chapters 1–10:

- concept detection / remediation handoff registry;
- remediation content provider registry;
- canonical reassessment mapping provider;
- reassessment detection provider factory.

Targeted remediation pulls the existing Chapter 11 lesson blocks and flashcards from canonical C11 mappings rather than duplicating content.

## Shared grading unchanged

`src/lib/concept-mastery/shared-grading.ts` is not changed.

The existing 20 / 10 / 40 / 15 / 15 contract remains intact.

## Source basis and limitation

The fresh questions use only the Chapter 11 content already hardened in C11-2 through C11-6 and remain grounded in `CHAPTER-11-MATERIAL-SUMMARY.md`, the repository summary of Milady Chapter 11 pages 276–285.

This phase does not claim fresh independent page-by-page Milady verification.

## Next phase

**C11-8 — Final Chapter 11 End-to-End Certification.**


Verification trigger: PR #131 is tested against `main`; no merge authorization is implied.
