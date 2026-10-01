# C20-3 — Chapter 20 Flashcard Hardening + Concept Certification

## Parent architecture
C20-3 is stacked on C20-2 head `67521f1ab2e900f028dbb9e4968ec5d3a6726cb6`.

## Scope
C20-3 audits and hardens all 60 active Chapter 20 flashcards against:

- the six-family C20-1 canonical architecture;
- the C20-2 hardened lesson;
- the compliance-vs-safety boundary;
- stable inventory and ID requirements.

No assessment question, lesson structure, grading weight, remediation runtime, reassessment runtime, or instructor diagnostic behavior is changed.

## Inventory preserved
C20-3 preserves:

- exactly 60 active flashcards;
- IDs `fc-ch20-001` through `fc-ch20-060`;
- standard IDs `CH20-F001` through `CH20-F060`;
- order indexes 1–60;
- chapter assignment `ch-20`;
- exactly ten cards in each canonical concept family;
- all 17 existing chapter-assessment IDs;
- shared 20/10/40/15/15 grading.

## Hardening repairs

### Teamwork and workplace hierarchy
Cards 016–019 were narrowed so they no longer imply:

- blind loyalty to management;
- acceptance of inappropriate conduct;
- one universal evaluation schedule.

They now preserve professional loyalty, appropriate boundaries, constructive feedback, and employer-specific review schedules.

### Worker classification
Cards 021–030 previously treated employee, independent-contractor, and booth-renter labels as if each label alone established the legal or tax relationship.

C20-3 now teaches that:

- classification depends on the actual facts and working relationship;
- behavioral/financial control and business independence matter;
- a label, compensation method, chair-rental term, or one isolated factor does not settle status;
- booth-rental responsibilities depend on the actual agreement and applicable law.

### Tax forms and thresholds
The inherited deck hardcoded a Form 1099-MISC / $600 rule.

That wording was removed.

The hardened deck now requires students to verify the current IRS form and reporting threshold rather than memorizing a potentially stale form/threshold combination.

### Tip and income reporting
Cards 029 and 031–033 now:

- distinguish taxable income from generic “all money” language;
- emphasize daily/consistent recordkeeping;
- direct students toward current tax rules;
- avoid presenting one fixed list of legal or financial consequences as universal.

### Pricing and retail compensation
Card 038 no longer teaches one universal moment when a barber is “allowed” to raise prices.

Card 039 no longer assumes most shops pay retail commission.

The deck now teaches evaluation of skill, costs, demand, shop policy, market conditions, and the actual compensation plan.

### Ethical selling
Card 050 no longer tells a barber to assure a client that they will be happy with a purchase.

It now requires professional completion of the sale and avoids promises or guarantees that cannot be supported.

### Marketing, consent, and referrals
Cards 054–056 now:

- avoid dependence on named platforms;
- require clear permission before posting identifiable client content;
- recognize applicable privacy/platform/shop rules;
- require referral offers to use clear terms and follow applicable shop/advertising rules;
- frame local referral partnerships as ethical, mutually beneficial arrangements.

## Duplication audit
All 60 normalized front prompts remain unique.

Related topics such as tip reporting versus income-recordkeeping remain intentionally separate because they assess different knowledge:

- tax/reporting principle;
- recordkeeping practice;
- financial consequences.

## Criticality boundary
Chapter 20 still has no bodily-safety family.

Compliance-sensitive families remain:

- `ch20-employment-classification-compensation`
- `ch20-financial-responsibility-income-reporting`
- `ch20-client-retention-marketing-consent`

These do not inherit the urgent-safety 100% recovery rule.

## Certification target
C20-3 is GREEN only if the exact final head passes:

1. C20-1 architecture certification;
2. C20-2 lesson-hardening certification;
3. C20-3 flashcard-hardening certification;
4. TypeScript/unit/build Engineering Verification;
5. exact-head Vercel deployment.

## Next phase
**C20-4 — Assessment Hardening:** audit all 17 active questions against the hardened lesson and six canonical families, correct stale or overbroad compliance wording, reconcile the stale “15 question” metadata, preserve stable assessment IDs where possible, and certify concept coverage and the 80% pass threshold.
