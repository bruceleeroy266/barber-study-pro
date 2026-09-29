# C17-7 — Fresh Reassessment Reserve + Mastery Recovery

C17-7 adds the formal reassessment and mastery-recovery layer for Chapter 17 without altering the certified instructional inventories.

## Locked inventories

C17-7 preserves:

- 24 lesson sections
- 60 flashcards
- 30 initial chapter-assessment questions
- 16 existing learning questions
- 14 micro-check questions
- seven canonical concept families
- shared 20/10/40/15/15 grading contract

## Fresh reserve

C17-7 adds exactly **35 new reassessment questions**:

- five per canonical concept family
- all IDs use the separate `r17-*` namespace
- no overlap with `qq-17-*`, `lq-17-*`, or `mcq-17-*`
- no recall-only items
- each item contains four distinct choices, a certified answer key, and an explanation

Concept-specific prefixes are:

- `r17-consult-*`
- `r17-chem-*`
- `r17-perm-*`
- `r17-relax-*`
- `r17-curl-*`
- `r17-safe-*`
- `r17-texture-*`

## Recovery thresholds

The C17-6 policy is now executable:

- ordinary remediation: exactly **5 questions**, pass at **4/5 = 80%**
- urgent safety remediation: exactly **5 questions**, pass only at **5/5 = 100%**

Urgent status continues to come from the C17-6 multi-hazard safety model.

## Immutable recovery evidence

Formal reassessment emits shared evidence with:

- `chapterId: ch-17`
- `source: remediation_reassessment`
- `attemptPhase: reassessment`

Reassessment evidence is appended after the original evidence. Duplicate reassessment items are ignored by the same student/chapter/source/phase/item identity.

The original evidence array remains the leading, unchanged portion of the recovered evidence history.

## Mastery recovery

C17-7 proves that successful reassessment:

- increases concept mastery when new correct evidence is added;
- increases reassessment-correct count;
- does **not** reduce or erase preserved initial-miss count;
- does **not** overwrite the original micro-check, flashcard, assessment, or scenario evidence.

This lets mastery recover while diagnostic history stays honest.

## Shared runtime providers

Chapter 17 is now registered with:

- the canonical reassessment mapping-provider registry;
- the reassessment-aware detection provider;
- the remediation content-provider registry.

The canonical mapping provider returns exactly the five fresh `r17-*` questions for a requested concept.

The content provider serves:

- mapped lesson blocks;
- mapped flashcards;
- the initial 30-question assessment;
- the fresh 35-question reassessment reserve.

No Chapter 17-specific reassessment framework or grading fork is introduced.

## Source/safety boundary

Fresh reassessment items inherit the certified C17-2 through C17-6 boundaries:

- thio/permanent-wave chemistry is separated from hydroxide lanthionization;
- no universal pH, heat, timing, or test-curl rules;
- known hydroxide/thio incompatibility cannot be overridden by a strand test;
- compromised scalp tissue postpones chemical service;
- burning/pain requires stopping exposure and product-directed removal;
- unsafe multi-stage sequencing is not allowed;
- texturizers and chemical blowouts are not defined only by weaker formula or shorter time.

## Certification gate

C17-7 is GREEN only when:

1. the 24/60/30/16 + 14 certified inventories remain intact;
2. the reserve is exactly 35 questions / five per concept;
3. namespaces remain non-overlapping;
4. 4/5 passes ordinary recovery;
5. 4/5 fails and 5/5 passes urgent safety recovery;
6. successful reassessment raises mastery while original misses remain;
7. shared mapping/content/detection providers serve Chapter 17 correctly;
8. exact-head Engineering Verification passes;
9. matching exact-head Vercel succeeds.
