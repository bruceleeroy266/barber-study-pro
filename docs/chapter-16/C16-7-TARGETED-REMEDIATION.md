# C16-7 — Targeted Remediation

**Base:** C16-6 certified head `77629fc8787f549e5bc98fe55bbcde2f7d7c8327`

## Purpose

C16-7 converts Chapter 16 detected gaps into canonical targeted remediation paths.

For each weak concept, the remediation plan points only to lesson blocks and flashcards already mapped to that canonical concept family. No duplicate curriculum registry is introduced.

## Targeting rules

A concept becomes a standard remediation target when either:

- it has at least two observations and mastery is 70% or lower; or
- it has at least two preserved initial misses.

Safety-sensitive concepts retain the C16-6 escalation policy:

- one tagged miss → priority review;
- recent misses across both hazards → urgent;
- urgent targets are ordered before priority and standard targets.

## Remediation assets

Each target includes:

- canonical concept ID and name;
- mastery/confidence/observation data;
- preserved initial miss count;
- mapped lesson block IDs;
- mapped flashcard IDs;
- priority;
- future formal reassessment requirement;
- future reassessment question count;
- future pass threshold.

Every one of the eight canonical concept families has at least one lesson block and at least one flashcard available for targeted remediation.

## Recovery policy carried forward

C16-7 does not create reassessment questions yet. It carries forward the policy that C16-8 must enforce:

- ordinary recovery: 5 fresh questions, 80% pass;
- urgent safety recovery: 5 fresh questions, 100% pass.

A single safety-review miss can trigger immediate targeted review without prematurely requiring formal reassessment.

## Evidence preservation

The plan returns the original evidence collection unchanged as `preservedEvidence`. Remediation targeting does not rewrite, delete, or replace initial diagnostic misses.

## Preserved architecture

- 11 instructional sections
- 93 lesson blocks
- 68 flashcards
- 30 assessment questions
- 8 micro-check placements
- 16 immutable micro-check questions
- 8 canonical concepts
- two narrow safety hazards
- shared 20/10/40/15/15 grading unchanged

C16-7 is not formally GREEN until exact-head Engineering Verification and Vercel both pass.
