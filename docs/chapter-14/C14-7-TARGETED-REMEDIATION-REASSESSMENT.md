# C14-7 — Targeted Remediation + Fresh Five-Question Reassessment

C14-7 completes Chapter 14's concept-targeted recovery loop.

## Fresh reserve

Seven canonical concept families now each have exactly five fresh reassessment questions:

- consultation & professional design
- facial/head design analysis
- cutting geometry & guides
- shear/clipper/razor/texturizing
- haircut styles & procedures
- styling/volume/locks
- service safety & sanitation

Total reserve: **35 questions**.

Reserve IDs use the separate `r14-...` namespace and do not reuse `qq-14-...` or `mcq-14-...` items.

## Remediation targeting

A concept becomes an ordinary remediation target when its mastery is at or below the shared threshold or it has enough preserved initial misses to demonstrate a meaningful gap.

The plan returns concept family, current mastery, observation count, preserved initial miss count, mapped lesson sections for review, priority, and the required five-question reassessment threshold.

Targeted lesson and flashcard assignments come from the canonical C14 mappings rather than hard-coded duplicate lists.

## Recovery rules

Formal reassessment is always exactly **five unique fresh questions**.

- ordinary concept recovery: **80% = 4/5**
- urgent safety recovery: **100% = 5/5**

A 4/5 result therefore passes an ordinary concept but does **not** clear an urgent safety requirement.

## Evidence preservation

Reassessment produces new evidence with:

- source = `remediation_reassessment`
- attemptPhase = `reassessment`
- Chapter 14 concept family preserved
- original first-attempt evidence unchanged

Successful recovery can raise calculated mastery while the original miss count remains intact.

## Shared runtime registration

C14-7 registers Chapter 14 with the existing shared infrastructure:

- detected-gap remediation assignment registry
- remediation content provider
- canonical reassessment mapping provider
- Chapter 14 reassessment detection adapter

The content provider resolves both the certified 70-question initial assessment and the 35 fresh reassessment items.

No chapter-specific database fork or parallel grade formula was created.

## Certification gate

C14-7 is GREEN only after:

1. all seven concepts have exactly five fresh questions,
2. all 35 reserve IDs are unique and outside initial/micro-check namespaces,
3. ordinary 4/5 passes,
4. urgent-safety 4/5 fails and 5/5 is required,
5. original misses remain immutable,
6. recovered mastery retains the original miss count,
7. all three shared runtime provider paths resolve Chapter 14,
8. every concept resolves targeted lesson/flashcard material and its five-question reserve,
9. Engineering Verification is GREEN on the exact head,
10. matching Vercel preview is GREEN on the same exact head.
