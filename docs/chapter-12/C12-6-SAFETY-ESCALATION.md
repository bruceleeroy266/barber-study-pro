# C12-6 — Safety Escalation

## Baseline

C12-5 exact certified head: `aff984526aa2279de5fdfc90e6074e048888d7f3`

Engineering Verification #889: GREEN  
Exact-head Vercel preview: `dpl_GZQdA9U5nwVNEbfaXoiRuPYr1SJq` READY

## Objective

Add a Chapter 12 safety/scope escalation layer on top of the immutable evidence created in C12-5 while preserving the shared Chapters 1–12 grading foundation.

## Source-supported safety hazards

C12-6 defines five hazard categories already supported by the hardened Chapter 12 repository content:

1. `contamination_exposure_control`
   - contaminated tools/surfaces and blood/body-fluid exposure require appropriate stopping, exposure-control, cleaning, disinfection, and contamination-prevention decisions.

2. `contagious_condition_service_deferral`
   - an active or potentially contagious facial condition can make contact unsafe and require service deferral without diagnosis or prescribing.

3. `equipment_contraindication_deferral`
   - electrical or heat equipment is used only when manufacturer directions, training, consultation, and applicable rules establish safe use; uncertainty requires deferral rather than testing on the client.

4. `adverse_reaction_stop_service`
   - burning, dizziness, increasing irritation, excessive heat, or another unsafe client response requires stopping and reassessing the service.

5. `scope_diagnosis_treatment_boundary`
   - facial and beard services remain cosmetic; the barber observes, makes a service-safety decision, and refers when appropriate without diagnosing, prescribing, or presenting cosmetic care as medical treatment.

## Tagged evidence

C12-6 tags **17 existing evidence items** without altering immutable response records.

Micro-checks:
- `mcq-12-004`
- `mcq-12-005`
- `mcq-12-006`
- `mcq-12-010`
- `mcq-12-012`
- `mcq-12-013`
- `mcq-12-014`
- `mcq-12-016`

Assessment:
- `qq-12-029`
- `qq-12-035`
- `qq-12-037`
- `qq-12-038`
- `qq-12-041`
- `qq-12-042`
- `qq-12-043`
- `qq-12-044`
- `qq-12-045`

## Escalation rules

C12-6 reuses the same hardened safety-escalation pattern already proven in Chapter 11:

- recent tagged-evidence window: 3 observations
- one tagged miss: immediate targeted safety/scope review + instructor-review flag
- urgent escalation: at least 2 distinct missed tagged items spanning at least 2 distinct hazards inside the recent 3 tagged observations
- formal urgent safety reassessment: exactly 5 questions
- urgent safety reassessment pass requirement: 100%
- intervention clears after 5 consecutive correct tagged safety observations

Two misses from the same hazard do not independently trigger urgent escalation.

These thresholds affect the safety layer only and do not redefine academic grading weights.

## Student experience

`Chapter12MicroCheckCard` now distinguishes:

- correct answer → normal correct feedback
- ordinary miss → normal concept review
- tagged safety/scope miss → `⚠ Safety review required` plus an immediate targeted safety/scope intervention message

The stored first attempt remains immutable. C12-6 adds interpretation and escalation; it does not overwrite evidence.

## Formal safety recovery

An urgent intervention requires:

- targeted safety remediation
- exactly five fresh safety reassessment questions
- 100% correct to clear urgent safety recovery

C12-6 defines and tests this requirement. The actual reassessment reserve and remediation flow are C12-7 scope.

## Shared grading unchanged

C12-6 does not modify `src/lib/concept-mastery/shared-grading.ts`.

Weights remain:

- micro-checks: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

## Source limitation

This remains repository-source-grounded Chapter 12 work based on the C12-2 lesson, C12-3 flashcards, and C12-4 assessment. It is not represented as fresh page-by-page textbook verification.

## Next phase

**C12-7 — Targeted Remediation + Five-Question Reassessment.**
