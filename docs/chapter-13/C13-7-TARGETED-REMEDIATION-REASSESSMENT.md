# C13-7 — Targeted Remediation + Five-Question Reassessment

## Scope

C13-7 completes the recovery loop for Chapter 13:

**detected concept gap → mapped lesson/flashcard review → five fresh reassessment questions → recovery evidence → shared mastery recovery**

It consumes the safety policy certified in C13-6 rather than creating a second grading system.

## Fresh reassessment reserve

Chapter 13 now has **40 fresh reassessment questions**:

- 8 canonical concepts
- exactly 5 reserve questions per concept
- IDs use the separate `r13-...` namespace
- no reassessment item reuses an initial `qq-13-...` or micro-check `mcq-13-...` ID
- questions are understanding/application/scenario level
- wording is original ASCYN PRO language grounded in the already-certified Chapter 13 source/content work

## Target selection

A concept enters ordinary targeted remediation when:

- shared mastery is **70% or lower**, or
- it contains **2 or more preserved initial misses**

C13-6 safety evidence can increase priority:

- one current tagged safety miss → **priority review**
- active urgent multi-hazard escalation → **urgent remediation**

Targets resolve to the canonical Chapter 13 lesson blocks and flashcards already mapped in C13-1.

## Reassessment policy

Every formal Chapter 13 reassessment uses:

- exactly **5 unique fresh questions**
- one target concept only
- one response for every selected question
- reassessment evidence source = `remediation_reassessment`
- attempt phase = `reassessment`

Passing threshold:

- ordinary concept recovery: **80% = 4/5**
- active urgent-safety concept recovery: **100% = 5/5**

Therefore an urgent safety concept does **not** recover at 4/5.

## Evidence preservation

Reassessment evidence is appended to the existing evidence history.

It never:

- overwrites a micro-check miss
- converts an initial miss to correct
- deletes prior assessment evidence
- replaces the student’s original evidence history

The shared mastery engine sees both the historical miss and the later recovery.

## Shared runtime wiring

C13-7 registers Chapter 13 with:

- canonical reassessment mapping provider
- concept detection provider
- targeted remediation content provider
- fresh reassessment question lookup

The existing chapter-agnostic remediation/reassessment runtime can therefore serve Chapter 13 without a special parallel workflow.

## Certification gates

C13-7 is GREEN only when:

1. 40/40 fresh questions exist with unique IDs
2. all 8 concepts have exactly five reserve items
3. reassessment IDs are separate from initial/micro-check IDs
4. targeted remediation resolves mapped content and flashcards
5. ordinary weak concepts receive the 80% / five-question rule
6. urgent safety concepts receive the 100% / five-question rule
7. 4/5 passes ordinary recovery but fails urgent safety recovery
8. exactly five unique responses are required
9. reassessment evidence is appended, not substituted
10. original miss count remains preserved after recovery
11. recovery feeds the same shared mastery engine
12. recovery feeds the existing 15% remediation/reassessment grade component
13. Chapter 13 is registered in all shared remediation/reassessment providers
14. exact-head Engineering Verification is GREEN
15. exact-head Vercel preview is READY
