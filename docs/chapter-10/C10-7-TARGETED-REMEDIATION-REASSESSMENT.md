# C10-7 — Targeted Remediation + 5-Question Reassessment

**Chapter:** 10 — Properties and Disorders of the Hair and Scalp  
**Branch:** `feat/c10-7-targeted-remediation-reassessment`  
**Certified C10-6 baseline:** `b3b9f5edfca1875c87a54c01c7f6675d83e102fa`

## Goal

Complete the Chapter 10 weak-concept recovery chain:

`preserved evidence → exact concept target → mapped lesson remediation → five fresh reserve questions → reassessment evidence → recovered mastery`

without erasing the student's original struggle or introducing a new grading formula.

## Reassessment reserve

C10-7 adds **45 fresh reassessment questions**:

- 9 canonical concept families
- exactly 5 questions per concept
- unique `r10-...` namespace
- no reuse of the 75-question chapter assessment IDs
- no reuse of the 19 micro-check IDs
- all questions are understanding/application/scenario level

The reserve remains grounded to the same Chapter 10 source record used in C10-2 through C10-6.

## Targeting rules

An ordinary concept becomes a remediation target when either:

- shared concept mastery is **70% or below**, or
- the concept retains **2 or more initial misses**.

The remediation plan uses the canonical C10-1 concept mapping to return the lesson content blocks for that exact weak concept.

## Five-question recovery

Every formal reassessment requires exactly **5 unique questions** from the target concept.

- ordinary concept gap: **80% (4/5)** passes
- urgent safety gap: **100% (5/5)** passes

A 4/5 result therefore passes ordinary remediation but does **not** clear an urgent safety reassessment.

## Safety integration

C10-7 consumes the certified C10-6 intervention state.

A current single high-risk miss can receive priority targeted review.

Repeated distinct high-risk misses that C10-6 classifies as urgent require:

- targeted remediation;
- formal five-question reassessment;
- 100% passing score.

## Evidence preservation

Reassessment records are appended as:

- `source: 'remediation_reassessment'`
- `attemptPhase: 'reassessment'`

Original evidence remains in place.

C10-7 explicitly verifies that:

- initial incorrect answers remain incorrect in history;
- original `initialMissCount` is retained after successful recovery;
- successful reassessment can raise current mastery;
- recovery evidence cannot overwrite the original evidence stream.

## Shared grading

C10-7 does not modify `src/lib/concept-mastery/shared-grading.ts`.

Recovery uses the existing Chapter 10 wrapper over the shared mastery engine.

## Status

**Implementation complete. Exact-head Engineering Verification, Vercel Preview, and final end-to-end recovery adversarial certification are required before C10-7 can be certified GREEN.**
