# C17-6 — Gap Detection + Safety Escalation + Targeted Remediation Architecture

C17-6 adds the Chapter 17 detection, safety, and targeted-remediation layer without changing the certified educational inventories.

## Locked inventories

C17-6 preserves:

- 24 lesson sections
- 60 flashcards
- 30 chapter-assessment questions
- 16 learning questions
- 14 micro-check questions
- seven canonical concept families
- shared 20/10/40/15/15 grading contract

## Combined immutable evidence

Targeting can combine evidence from:

- micro-checks
- flashcards
- chapter assessment
- scenario/application

Duplicate evidence is ignored by the same student/chapter/source/attempt-phase/item identity. Original first-attempt misses remain preserved.

## Gap detection

Chapter 17 is now registered in the shared concept-detection/remediation assignment registry.

The initial 30-question assessment maps into the shared detection engine through the C17-1 canonical question-to-concept mappings.

Combined-evidence mastery targeting adds a remediation target when:

- there are at least two observations and mastery is at or below 70%, or
- there are at least two preserved initial misses, or
- a safety-sensitive miss requires priority/urgent review.

## Four Chapter 17 safety hazards

C17-6 defines exactly four high-risk classes:

1. **Chemical incompatibility**
   - especially hydroxide/thio conflicts
   - a strand test does not override a known incompatibility

2. **Scalp compromise / burning**
   - visibly open, abraded, irritated, or otherwise compromised scalp tissue
   - burning or pain during chemical exposure

3. **Overprocessing control**
   - unsafe automatic time/heat extensions
   - failure to use representative product-directed processing checks

4. **Unsafe service sequencing**
   - proceeding with unclear prior chemistry
   - incorrect rinsing/neutralization order
   - uncontrolled multi-stage curl-reformation sequencing

A single tagged miss triggers immediate targeted safety review and instructor visibility.

Recent misses across at least two distinct hazard classes trigger **urgent** safety remediation.

## Recovery policy contract

C17-6 reserves the same policy used by hardened prior chapters:

- ordinary formal reassessment: exactly 5 questions, **80%**
- urgent safety reassessment: exactly 5 questions, **100%**

The fresh 35-question reserve itself is not created until C17-7.

## Targeted remediation

Every concept family resolves to canonical:

- Chapter 17 lesson blocks
- Chapter 17 flashcards

No remediation content is duplicated or rewritten.

Targets are ranked:

1. urgent
2. priority safety review
3. standard mastery gap

## Live safety feedback

The Chapter 17 micro-check card now identifies a tagged incorrect first attempt and displays a targeted safety-review message immediately. Student-facing language is deliberately non-diagnostic and non-prescriptive.

## Certification gate

C17-6 is GREEN only when:

1. the 24/60/30/16 + 14 inventories remain intact;
2. four-source evidence combination is proven;
3. all seven canonical remediation paths are non-empty;
4. shared Chapter 17 detection registration works;
5. all four intended hazard classes are proven;
6. ordinary 80% and urgent 100% policies remain locked;
7. full exact-head Engineering Verification passes;
8. matching exact-head Vercel succeeds.
