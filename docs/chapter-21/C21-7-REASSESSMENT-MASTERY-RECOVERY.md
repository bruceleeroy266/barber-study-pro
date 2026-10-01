# C21-7 — Fresh Reassessment Reserve + Mastery Recovery

## Parent head
C21-7 is stacked on C21-6 head `dee53443fe594a1844a559c6e01a1844b8dcf53d`.

## Objective
Add one full fresh formal-reassessment cycle for every Chapter 21 concept family while preserving every original diagnostic miss.

## Reserve inventory
C21-7 creates exactly **40 fresh reassessment questions**:

- 8 canonical concept families
- exactly 5 questions per family
- IDs use the isolated `r21-*` namespace
- all questions are understanding, application, or scenario level
- no prompt duplicates the 17-question initial assessment
- no prompt duplicates the 16-question micro-check bank

The eight five-question families are:

1. `r21-entry-001..005`
2. `r21-opening-001..005`
3. `r21-ownership-001..005`
4. `r21-plan-001..005`
5. `r21-records-001..005`
6. `r21-rental-001..005`
7. `r21-operations-001..005`
8. `r21-marketing-001..005`

## Freshness / exclusion behavior
A formal Chapter 21 cycle requires exactly **5 unique questions** from the target concept.

Because C21-7 intentionally provides exactly one full five-question reserve per family, excluding even one reserve item leaves fewer than five fresh questions.

The selector therefore fails closed rather than silently reusing an excluded question.

This gives Chapter 21 one certified fresh recovery cycle per family in C21-7.

## Recovery threshold
Both ordinary remediation and business/legal compliance remediation use:

- question count: **5**
- pass threshold: **80%**
- passing score: **4/5**

Chapter 21 has zero bodily-safety families, so the urgent-safety 100% recovery rule is not introduced.

## Evidence semantics
Reassessment evidence is written with:

- chapter: `ch-21`
- source: `remediation_reassessment`
- attempt phase: `reassessment`
- canonical target concept
- fresh reassessment item ID
- timestamp

It is appended to prior evidence.

Original assessment, micro-check, flashcard, and scenario misses remain unchanged.

No recovery operation deletes, mutates, or rewrites initial diagnostic evidence.

## Mastery recovery
`calculateChapter21RecoveredMastery` calculates mastery before and after the appended reassessment evidence.

A successful 5/5 recovery can raise mastery, while the original incorrect records remain at the beginning of the combined evidence history exactly as originally stored.

This means ASCYN PRO can show both:

- the original gap;
- the later recovery.

## Shared reassessment runtime
C21-7 adds:

- `chapter-21-adapter.ts`
- `chapter-21-detection-provider.ts`

and registers Chapter 21 with `reassessment/provider-registry`.

The canonical mapping provider exposes:

- all 17 initial assessment IDs;
- all 40 reassessment IDs;
- all 8 concept IDs;
- exactly 5 fresh reserve IDs per concept to reassessment selection.

The detection provider understands the initial and reassessment banks for post-cycle evaluation.

## Remediation content provider
The shared remediation content provider now resolves Chapter 21 reassessment questions as real `QuizQuestion` records in addition to the 17 initial questions.

This allows the live remediation/reassessment runtime to serve the reserve without duplicating question content elsewhere.

## Preserved architecture
C21-7 does not change:

- 60 hardened flashcards;
- 17-question initial assessment;
- 16 immutable micro-checks;
- 13 scored scenario/application items;
- 8 canonical concept families;
- 5 compliance/legal-critical families;
- 0 bodily-safety families;
- shared 20/10/40/15/15 chapter grading.

## Next phase
**C21-8 — Instructor / School-Admin Diagnostics + Final Visibility Integration:** expose Chapter 21 mastery, weak concepts, preserved initial misses, compliance-escalation state, latest reassessment/recovery, and targeted-remediation status to authorized instructor and school-admin views while preserving same-school authorization and student privacy.
