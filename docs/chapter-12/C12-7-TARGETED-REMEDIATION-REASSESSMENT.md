# C12-7 — Targeted Remediation + Five-Question Reassessment

**Baseline:** C12-6 exact certified head `23f4ae085f0055074bb65a0cd1cbbc15fb15df7f`

## Objective

Complete Chapter 12's concept detection → targeted remediation → fresh five-question reassessment → mastery-recovery chain while preserving the same shared grading/evidence architecture used by Chapters 1–11.

## Fresh reassessment reserve

C12-7 adds **40 fresh reassessment questions**:

- 8 canonical Chapter 12 concept families
- exactly 5 questions per concept
- dedicated `r12-` namespace
- no reuse of `qq-12-` assessment IDs
- no reuse of `mcq-12-` micro-check IDs
- all questions are understanding, application, or scenario level

The reserve is repository-source-grounded in the already-certified C12-2 through C12-6 content. This phase does not claim fresh page-by-page textbook verification.

## Targeted remediation rules

Chapter 12 inherits the established recovery policy:

- ordinary target when concept mastery is **<= 70%** or there are **>= 2 preserved initial misses**
- ordinary reassessment = exactly **5 questions**
- ordinary pass = **80% (4/5)**
- urgent safety reassessment = exactly **5 questions**
- urgent safety pass = **100% (5/5)**

A single tagged safety miss remains priority review unless the ordinary threshold also requires formal reassessment. C12-6 urgent distinct-hazard escalation overrides the ordinary threshold and requires 100%.

## Evidence semantics

Every completed formal reassessment produces evidence with:

- `chapterId: 'ch-12'`
- `source: 'remediation_reassessment'`
- `attemptPhase: 'reassessment'`
- canonical concept ID
- fresh `r12-` item ID
- preserved response correctness and timestamp

Reassessment evidence is appended. Existing initial evidence is never edited, removed, or replaced.

## Mastery recovery

C12-7 uses the same Chapter 12 binding over the shared concept-mastery engine already locked in C12-1. A successful five-question recovery can raise current mastery while the original initial-miss count remains visible.

## Grade recovery

The existing shared grade formula remains unchanged:

- micro-checks: 20%
- flashcards/study: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

Successful formal reassessment feeds the existing **15% remediation/reassessment bucket**. The shared recovery formula remains monotonic, so recovery cannot lower the student's grade.

## Live runtime/provider wiring

C12-7 registers Chapter 12 with the existing generic systems used by Chapters 1–11:

- concept-detection/remediation handoff registry
- remediation content-provider registry
- canonical reassessment mapping provider
- reassessment detection-provider factory

Remediation assignments reuse existing Chapter 12 lesson blocks and flashcards through the canonical mappings instead of duplicating content.

## Certification gates

C12-7 is GREEN only if exact-head tests prove:

- 40 unique fresh reserve questions
- exactly 5 questions for every concept
- no initial-bank or micro-check ID reuse
- ordinary 4/5 = pass
- urgent safety 4/5 = fail
- exactly five unique responses required
- original misses remain intact
- successful recovery raises mastery while preserving initial-miss history
- recovery feeds the same shared 15% grade bucket
- Chapter 12 is live in the generic remediation/reassessment provider registries
- exact-head Engineering Verification succeeds
- exact-head Vercel preview is READY

## Next phase

**C12-8 — Final Chapter 12 End-to-End Certification.**
