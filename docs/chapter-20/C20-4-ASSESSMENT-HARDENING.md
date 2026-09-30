# C20-4 — Chapter 20 Assessment Hardening + Canonical Mapping Certification

## Parent architecture
C20-4 is stacked on C20-3 head `fad4bfd9f039f9ab9b42c735d2ac125958090332`.

## Scope
C20-4 audits and hardens the complete active **17-question** Chapter 20 assessment against:

- the six-family C20-1 canonical architecture;
- the C20-2 hardened lesson;
- the C20-3 hardened 60-card bank;
- the compliance-vs-safety boundary.

The phase also reconciles the stale Chapter 20 “15 questions” metadata comment.

## Assessment inventory preserved

C20-4 preserves:

- 17 active questions;
- IDs `qq-20-01` through `qq-20-17`;
- standard IDs `CH20-Q01` through `CH20-Q17`;
- order indexes 1–17;
- quiz assignment `quiz-20`;
- passing threshold 80%;
- all six canonical concept mappings;
- all 60 hardened flashcards;
- shared 20/10/40/15/15 grading.

## Canonical learning-objective metadata

The assessment previously stored legacy-style `CH20-LO01` through `CH20-LO06` values.

C20-4 aligns every question to the canonical C20-1 identifiers:

- `LO-20-01` — professional transition/workplace expectations;
- `LO-20-02` — teamwork/workplace relationships;
- `LO-20-03` — employment classification/compensation;
- `LO-20-04` — financial responsibility/income reporting;
- `LO-20-05` — ethical selling/retailing;
- `LO-20-06` — client retention/marketing/consent.

## Key assessment repairs

### Teamwork
Q06 no longer teaches “subordination” as a broad virtue.

It now tests respectful learning from experienced coworkers while preserving the right to raise legitimate concerns and reject inappropriate or unsafe expectations.

### Worker classification
Q07 no longer presents independent contractor and booth renter as mutually exclusive legal categories determined by labels.

It now tests facts-and-circumstances reasoning, including control, financial independence, and the relationship between the parties.

### Compensation
Q08 keeps the base-plus-commission concept but requires students to confirm the actual written compensation formula rather than assuming one universal calculation.

### Booth rental
Q09 now tests verification of the actual agreement and applicable rules for:

- scheduling;
- pricing;
- client records;
- fees;
- taxes;
- insurance;
- related business responsibilities.

It explicitly rejects automatic status conclusions from the booth-rental label.

### Income reporting
Q10 now tests consistent recordkeeping plus current reporting requirements rather than claims about guaranteed borrowing or Social Security effects.

### Pricing
Q12 removes the inherited fixed “every year or two” pricing formula.

It now tests a multi-factor pricing decision using skill, costs, demand, client communication, market conditions, and shop policy.

### Ethical selling
Q14 now requires:

- listening to the objection;
- clarifying client need;
- explaining honest relevant benefits;
- respecting the client’s decision;
- avoiding pressure and unsupported guarantees.

### Client image consent
Q17 preserves clear permission before posting identifiable client content while avoiding a universal claim that one particular consent format is always legally required.

## 15-versus-17 reconciliation

The active assessment bank and runtime tests already used 17 questions, while `src/lib/demo-data.ts` still contained a stale comment saying Chapter 20 had 15 questions.

C20-4 changes that comment to 17.

The active demo quiz description already said 17 and the runtime Chapter 20 quiz test already asserts 17, so C20-4 brings the repository into one consistent inventory.

## Criticality boundary

Chapter 20 still has no bodily-safety family.

Compliance-sensitive families remain:

- `ch20-employment-classification-compensation`
- `ch20-financial-responsibility-income-reporting`
- `ch20-client-retention-marketing-consent`

No compliance, financial, tax, privacy, or economic mistake is reclassified as urgent bodily safety.

## Certification target

C20-4 is GREEN only if the exact final head passes:

1. C20-1 architecture certification;
2. C20-2 lesson-hardening certification;
3. C20-3 flashcard-hardening certification;
4. C20-4 assessment-hardening certification;
5. existing Chapter 20 QuizClient 17-question / 80% tests;
6. TypeScript/unit/build Engineering Verification;
7. exact-head Vercel deployment.

## Next phase

**C20-5 — Micro-Checks + Immutable Evidence:** create the planned 12 fresh micro-check questions — exactly two per canonical concept family — place them after their matching LO sections, persist first-attempt evidence through the shared immutable evidence architecture, and keep those items fully separate from the 17-question initial assessment.
