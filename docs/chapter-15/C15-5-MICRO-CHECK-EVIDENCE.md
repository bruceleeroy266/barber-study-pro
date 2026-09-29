# C15-5 — Micro-Checks + Immutable Evidence Integration

C15-5 implements the seven two-question micro-check placements planned in C15-1 and binds them to ASCYN PRO's existing immutable first-attempt evidence contract.

## Locked invariants

- 54 lesson sections remain unchanged
- 90 certified flashcards remain unchanged
- 72 certified assessment questions remain unchanged
- seven C15-1 concept families remain unchanged
- shared grading remains 20/10/40/15/15
- no Chapter 15-specific database table or grading fork is introduced

## Micro-check inventory

| Check | Placement | Concept | Questions |
|---|---|---|---:|
| mc-15-01 | after marketing-challenge | Consultation, Ethics & Marketing | 2 |
| mc-15-02 | after scope-scenario | Alternatives, Scope & Referral | 2 |
| mc-15-03 | after manufacturer-evaluation | Materials & Base Construction | 2 |
| mc-15-04 | after template-creation | Selection, Measurement & Template | 2 |
| mc-15-05 | after attachment-scenario | Attachment, Bonding & Cure | 2 |
| mc-15-06 | after memory-anchor-floating | Cleaning, Maintenance & Chemical Care | 2 |
| mc-15-07 | after common-mistakes | Cutting, Blending & Customization | 2 |

Total: 7 checks / 14 unique questions / exactly one check per canonical concept family.

## Evidence behavior

Each submitted answer:

- is recorded as source `micro_check`
- is bound to the question's canonical Chapter 15 concept family
- uses attempt phase `initial`
- records correctness and difficulty
- preserves the first attempt
- cannot be overwritten by a later answer
- remains separate from future remediation/reassessment evidence

Persistence reuses `public.chapter_micro_check_attempts`, whose unique key is `(user_id, chapter_id, question_id)`. Authenticated students have SELECT + INSERT only; there is no ordinary UPDATE or DELETE grant.

## Runtime integration

ChapterContent now:

1. loads existing `ch-15` micro-check rows for the signed-in student,
2. places each check directly after its planned lesson section,
3. restores already-recorded answers,
4. locks recorded first attempts,
5. persists new first attempts through the shared immutable table, and
6. updates local state without replacing an existing question attempt.

## Grading

Persisted correctness feeds the existing `microCheckPercent` input. C15-5 does not change the shared weights:

- Micro-checks: 20%
- Flashcards: 10%
- Chapter assessment: 40%
- Scenario/application: 15%
- Remediation/reassessment: 15%

## Certification gate

C15-5 is GREEN only after:

- 7/7 placements match current lesson section IDs,
- 14/14 questions are unique and non-recall,
- all seven concept families generate durable evidence,
- first-attempt misses survive duplicate/correct-later attempts,
- the 54/90/72 inventories remain exact,
- full Engineering Verification passes, and
- the matching exact-head Vercel preview is READY.
