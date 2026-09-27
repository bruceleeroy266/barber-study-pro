# C10-6 — Safety Escalation

**Chapter:** 10 — Properties and Disorders of the Hair and Scalp  
**Branch:** `feat/c10-6-safety-escalation`  
**Certified C10-5 baseline:** `15a5db5f99c56d2c018250e4032fb0ba6d1dc3ce`

## Goal

Align Chapter 10 safety handling to the hardened Chapters 1–9 pattern without creating a new grading formula or overwriting first-attempt evidence.

## Safety hazards

C10-6 defines four Chapter 10 source-supported high-risk hazard classes:

- `parasite_service_stop`
- `contagious_condition_referral`
- `chemical_service_compromised_scalp`
- `scope_diagnosis_treatment_boundary`

Tagged evidence comes from both Chapter 10 micro-checks and the hardened Chapter 10 assessment bank.

## Escalation behavior

A single tagged miss creates immediate targeted safety review and instructor-review status.

Repeated recent misses escalate to **urgent** only when the recent window contains:

- at least **2 distinct missed safety items**, and
- at least **2 distinct hazard classes**.

Urgent status requires:

- targeted safety remediation;
- instructor review;
- a formal **5-question safety reassessment**;
- **100%** required to clear that formal safety reassessment.

The intervention can clear after **5 consecutive correct tagged safety observations**, matching the hardened safety pattern used before Chapter 10.

## Scope boundaries

Student-facing messages stay within barbering scope:

- observe and describe;
- do not begin a service when parasites are present;
- avoid affected service for contagious conditions and use referral guidance;
- do not proceed with chemical service over irritation/abrasions;
- clean/disinfect as required;
- do not diagnose, prescribe, or treat medical conditions.

## Safety-critical key repair found during C10-6

The C10-6 adversarial setup exposed two latent assessment-key defects that were not caught by C10-4 structural certification:

- `qq-10-034` (live head lice) had the safe answer in option A but the key pointed to B.
- `qq-10-040` (suspected tinea) had the safe/referral answer in option A but the key pointed to D.

Both keys are repaired, and C10-6 now has explicit regression tests proving the correct-answer pointer resolves to the safe response.

The same inspection also removed a residual unsupported `EACH hair follicle` sebaceous-gland overstatement from `qq-10-071`.

## Evidence integrity

C10-6 does not rewrite or delete first-attempt evidence. It evaluates the existing concept-bound evidence produced by C10-5.

The urgent/review status is derived from evidence; it does not mutate historical misses.

## Shared grading

C10-6 does **not** modify:

`src/lib/concept-mastery/shared-grading.ts`

Safety escalation remains a parallel intervention layer over the shared evidence/mastery architecture.

## UI

Chapter 10 micro-check misses that are tagged as high-risk now display a **Safety / Scope Intervention** block with the source-supported service decision.

## Status

**Implementation complete. Exact-head Engineering Verification, Vercel Preview, and final safety adversarial certification are required before C10-6 can be certified GREEN.**
