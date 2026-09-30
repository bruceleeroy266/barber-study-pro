# C16-8 — 40 Fresh Reassessment Questions + Mastery Recovery

**Base:** C16-7 certified head `85b5d40acaf8a2b8edda213ef3266bf40ae858d7`

## Fresh reassessment reserve

C16-8 adds exactly 40 fresh reassessment questions:

- 8 canonical concept families
- exactly 5 questions per concept
- IDs use the separate `r16-*` namespace
- no `r16-*` ID overlaps the 30-question initial assessment or 16 micro-check questions
- all items are understanding, application, or scenario difficulty

The reassessment reserve is separate from the initial assessment and micro-check evidence namespaces.

## Recovery policy

Each formal reassessment cycle requires exactly five unique questions for one concept family.

- ordinary remediation: 4/5 = 80% passes
- urgent safety remediation: 5/5 = 100% passes
- 4/5 does not clear an urgent safety requirement

The stricter threshold applies only to concept families affected by the current urgent two-hazard intervention.

## Evidence semantics

Successful or unsuccessful reassessment creates new evidence with:

- chapterId = `ch-16`
- source = `remediation_reassessment`
- attemptPhase = `reassessment`
- stable `r16-*` item IDs

Reassessment evidence is appended. It never overwrites or deletes the original diagnostic evidence.

## Mastery recovery

C16-8 calculates mastery before and after appended reassessment evidence.

A successful five-question recovery can raise concept mastery and add reassessment-correct observations while the original initial miss count remains unchanged.

## Runtime wiring

C16-8 registers:

- a Chapter 16 canonical mapping provider for the reassessment runtime;
- exactly five `r16-*` questions per canonical concept;
- a Chapter 16 remediation content provider capable of serving targeted lesson blocks, flashcards, initial assessment items, and fresh reassessment items.

## Preserved architecture

- 11 instructional sections
- 93 lesson blocks
- 68 flashcards
- 30 initial assessment questions
- 8 micro-check placements
- 16 immutable micro-check questions
- 8 canonical concepts
- two narrow safety hazards
- shared 20/10/40/15/15 grading unchanged
- all original misses preserved

C16-8 is not formally GREEN until exact-head Engineering Verification and Vercel both pass.
