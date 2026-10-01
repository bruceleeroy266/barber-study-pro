# C20-2 — Chapter 20 Lesson Hardening

## Parent architecture
C20-2 is stacked on C20-1 head `f94330c5a5f37422e14cf41e4dcd63e0f96cb8b6`.

The six approved canonical concept families remain unchanged.

## Scope
This phase hardens the learner lesson only. It does not change:

- the 60-card flashcard inventory;
- the 17-question chapter assessment;
- the 80% chapter-quiz passing threshold;
- the shared 20/10/40/15/15 grading weights;
- remediation or reassessment runtime behavior;
- instructor/school-admin diagnostics.

## Structural cleanup
The repeated learner HTML wrapper was renamed from the stale `ch20-legacy-content` class to `ch20-lesson-content`.

Each real Chapter 20 learning-objective section is now tagged with its canonical concept family in the rendered lesson markup:

- `ch20-lo1` → professional transition/workplace expectations
- `ch20-lo2` → teamwork/workplace relationships
- `ch20-lo3` → employment classification/compensation
- `ch20-lo4` → financial responsibility/income reporting
- `ch20-lo5` → ethical selling/retailing
- `ch20-lo6` → client retention/marketing/consent

This makes later evidence placement explicit without inventing duplicate lesson IDs.

## Employment / classification hardening
The inherited lesson previously described employee, independent-contractor, booth-renter, tax-form, and threshold details too categorically.

C20-2 now teaches that:

- labels do not by themselves determine legal or tax status;
- worker classification depends on the actual relationship and relevant control/independence facts;
- tax, insurance, contract, information-return, and estimated-tax obligations can depend on the facts and current law;
- students should verify current federal requirements with the IRS and state/local requirements with the applicable authority or a qualified professional;
- booth-rental responsibilities must be confirmed from the actual agreement and applicable law.

No Chapter 20 content is presented as individualized legal or tax advice.

## Income-reporting hardening
The lesson now avoids freezing changing thresholds into curriculum text.

It teaches:

- track tips and other taxable income consistently;
- employees receiving tips should keep a daily tip record;
- employer-reporting, return-filing, estimated-tax, and self-employment duties may differ;
- current rules must be verified from the IRS or a qualified tax professional.

## Privacy / consent hardening
Social-media marketing now requires clear permission before posting identifiable client photos and directs students to consider applicable privacy, advertising, platform, school, and shop rules.

This remains a compliance-sensitive concept, not an urgent bodily-safety concept.

## Application coverage
C20-2 adds six learner-facing, ungraded **Apply It** anchors:

1. `ch20-apply-01` — reliability/workplace expectations
2. `ch20-apply-02` — direct conflict resolution/teamwork
3. `ch20-apply-03` — classification/compensation fact gathering
4. `ch20-apply-04` — income recordkeeping/current-rule verification
5. `ch20-apply-05` — ethical objection handling
6. `ch20-apply-06` — marketing/client-image consent

These strengthen application reasoning but do **not** generate durable grading evidence in C20-2.

## Planned micro-check placement
C20-2 reserves one micro-check placement after each canonical LO section.

Each placement plans **two fresh questions**, for a future total of **12 micro-check questions**:

- after `ch20-lo1` → professional transition/workplace expectations
- after `ch20-lo2` → teamwork/workplace relationships
- after `ch20-lo3` → employment classification/compensation
- after `ch20-lo4` → financial responsibility/income reporting
- after `ch20-lo5` → ethical selling/retailing
- after `ch20-lo6` → client retention/marketing/consent

C20-2 only defines placement and purpose. C20-5 will create the actual fresh questions and immutable evidence behavior.

## Criticality boundary
Chapter 20 still has no bodily-safety family.

Compliance-sensitive families remain:

- `ch20-employment-classification-compensation`
- `ch20-financial-responsibility-income-reporting`
- `ch20-client-retention-marketing-consent`

They must not inherit the 100% urgent-safety recovery rule.

## Certification target
C20-2 is GREEN only if the exact head passes:

1. C20-1 architecture certification;
2. C20-2 lesson-hardening certification;
3. TypeScript/unit/build Engineering Verification;
4. exact-head Vercel deployment.

## Next phase
**C20-3 — Flashcard Hardening:** audit all 60 cards against the six canonical families, current hardened lesson meaning, compliance boundaries, duplication, ambiguity, and board-readiness usefulness while preserving stable card IDs.
