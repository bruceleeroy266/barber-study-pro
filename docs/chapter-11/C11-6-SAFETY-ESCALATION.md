# C11-6 — Safety Escalation

**Baseline:** C11-5 exact certified head `84f6e4cb56550543319bab24fd6655568463f743`

## Objective

Add Chapter 11 safety/scope escalation on top of the immutable evidence created in C11-5 while preserving the shared Chapters 1–10 grading foundation.

## Source-supported safety hazards

C11-6 defines four Chapter 11 hazard categories supported by the repository Chapter 11 source record:

1. `parasite_treatment_referral`
   - parasitic scalp disorders are outside barber treatment and require physician referral.
2. `staphylococcal_treatment_referral`
   - staphylococcal scalp infections are outside barber treatment and require physician referral.
3. `compromised_scalp_service_decision`
   - abrasions, disorders, or uncertain findings can make a cosmetic service inappropriate and require a safer service decision.
4. `scope_diagnosis_treatment_boundary`
   - the barber observes, makes cosmetic service decisions, and refers; the barber does not diagnose, prescribe, or medically treat.

## Tagged evidence

C11-6 tags **10 existing evidence items** without altering their immutable response records:

- Micro-checks:
  - `mcq-11-013` — parasite treatment/referral
  - `mcq-11-014` — staphylococcal treatment/referral
  - `mcq-11-015` — diagnosis/treatment scope
- Assessment:
  - `qq-11-031` — compromised scalp/service decision
  - `qq-11-038` — scope/prohibited-disorder treatment
  - `qq-11-039` — parasite treatment/referral
  - `qq-11-040` — staphylococcal treatment/referral
  - `qq-11-042` — diagnosis/treatment scope
  - `qq-11-043` — compromised scalp/service decision
  - `qq-11-050` — professional scope

## Escalation rules

Chapter 11 reuses the hardened Chapter 10 safety pattern rather than inventing a new rule set:

- recent tagged-evidence window: 3 observations;
- one tagged miss: immediate targeted safety/scope review + instructor visibility;
- urgent escalation: at least 2 distinct missed tagged items spanning at least 2 distinct hazards inside the recent 3 tagged observations;
- formal urgent safety reassessment: exactly 5 questions;
- urgent safety reassessment pass requirement: 100%;
- safety intervention clears after 5 consecutive correct tagged safety observations.

These thresholds affect the safety intervention layer only. They do not redefine the shared grade formula.

## Student experience

The Chapter 11 micro-check card now mirrors the Chapter 10 intervention experience:

- a normal miss shows ordinary concept review;
- a tagged safety/scope miss shows `⚠ Safety review required`;
- the card displays the targeted source-grounded safety/scope message immediately;
- the persisted first attempt remains unchanged.

C11-7 will provide the formal five-question safety reassessment reserve and remediation workflow required by an urgent intervention.

## Shared grading unchanged

C11-6 does not modify `src/lib/concept-mastery/shared-grading.ts`.

The existing weights remain:

- micro-checks: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

## Source limitation

The Chapter 11 content basis remains `CHAPTER-11-MATERIAL-SUMMARY.md`, a repository summary of Milady Chapter 11 pages 276–285. C11-6 does not claim fresh independent page-by-page textbook verification.

## Next phase

**C11-7 — Targeted Remediation + Five-Question Reassessment.**
