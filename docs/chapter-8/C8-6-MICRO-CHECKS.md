# C8-6 — Micro-Knowledge Checks & Evidence Integration

C8-6 begins by reusing the proven Chapter 7+ micro-check architecture rather than creating a parallel grading system.

## First functional slice

- 10 lesson-embedded micro-check placements
- 22 total questions
- all ten canonical Chapter 8 concepts represented
- no recall-only items
- immutable first-attempt persistence through the existing `chapter_micro_check_attempts` table
- conversion into Chapter 8 `micro_check` evidence records
- micro-check percentage available to the shared Chapter 8 grade calculation
- per-concept micro-check diagnostics
- stricter safety-evidence classification for electrical equipment safety and light-therapy safety

## Safety escalation

A wrong **scenario** micro-check in:
- `ch8-equipment-safety`, or
- `ch8-light-therapy-safety`

is classified as **critical safety evidence**.

A wrong understanding/application item in those concepts is classified as elevated evidence; correct responses do not create an escalation signal.

This does not by itself impose a punitive grade. It provides structured evidence for the intervention/escalation layer while preserving the shared Chapter 7+ mastery calculation.

## Persistence

The existing database table is chapter-generic and already enforces one immutable first-attempt row per user/chapter/question. C8-6 therefore does not add a duplicate table or migration.

## Remaining C8-6 work

- render the Chapter 8 micro-check cards in the lesson UI;
- load/persist Chapter 8 attempts through ChapterContent;
- connect critical/elevated safety evidence to Chapter 8 intervention flags;
- add end-to-end UI/persistence regression tests;
- run Engineering Verification and exact-head Vercel certification.
