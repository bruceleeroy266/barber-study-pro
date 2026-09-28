# C12-2 — Source-Grounded Lesson Hardening

## Scope

This pass hardens only the Chapter 12 student lesson in `src/lib/chapter-12-premium.ts`.

The Chapter 12 flashcard bank and assessment are intentionally **not** changed in C12-2. They remain reserved for later dedicated audits.

## Source basis and limitation

Repository source basis:

- `CHAPTER-12-COMPREHENSIVE-ANALYSIS.md` — retained repository analysis describing Chapter 12 subject coverage, including facial anatomy, massage manipulations, equipment/modalities, contraindications, consultation, sanitation, product selection, treatment sequence, professional safety, and client communication.
- Current Chapter 12 runtime lesson and the C12-1 canonical concept architecture.

This is repository-source-grounded hardening. It is **not** fresh page-by-page verification of the underlying textbook pages, and it does not claim that the repository analysis independently proves every historical numeric, physiological, medical, device, or exam statement.

## Hardening rules applied

1. **No universal licensing-exam certainty**
   - removed statements that a concept appears on every state board exam
   - removed failure predictions and unsupported practical-exam certainty
   - converted the old board-alert section into a Chapter 12 core review with explicit jurisdiction/provider variability

2. **No medical diagnosis or treatment overreach**
   - consultation now separates observable findings from diagnosis
   - medication/health-condition language is framed as a service-safety question rather than a medical interpretation
   - unsafe or uncertain services are deferred, with appropriate professional evaluation recommended when needed
   - the lesson no longer classifies named medical conditions into universal barber-treatment rules

3. **No unsupported universal numeric settings**
   - removed the fixed hot-towel `120-140°F` rule
   - removed the `25% thicker` skin claim
   - removed the `1000x its weight in water` claim
   - product/device-specific timing and settings defer to manufacturer directions and applicable rules

4. **No pore-opening, detox, or guaranteed penetration language**
   - pore language is reframed as cosmetic product selection rather than anatomy changing state
   - mask/product language avoids unsupported detoxification or medical-treatment claims
   - deeper-product-penetration promises were removed

5. **Safer sanitation and exposure-control wording**
   - replaces unverified one-size-fits-all disinfectant/antiseptic language with applicable rules, product labels, exposure-control procedures, and contamination prevention

6. **Product selection stays cosmetic**
   - cleanser, toner, astringent, mask, and skin-type sections now emphasize observation, client sensitivity, manufacturer directions, and cosmetic scope
   - no product category is presented as a cure or guaranteed treatment

7. **Massage technique stays within cosmetic scope**
   - removes sinus-treatment and other therapeutic claims
   - pressure, rhythm, movement, and client comfort remain the service focus
   - contraindications and client response control whether a movement is appropriate

## What remains for later phases

C12-2 does not certify:

- the 115 flashcards
- the 45-question assessment
- answer-key correctness or answer-position balance
- current textbook page-by-page traceability
- a current NIC/state-board blueprint
- micro-checks, safety escalation rules, remediation, five-question reassessment, or instructor diagnostics

Those remain separate gates.

## C12-2 certification condition

C12-2 is GREEN only when:

- the hardened lesson passes its source-boundary tests
- C12-1 architecture tests remain GREEN
- Engineering Verification succeeds on the exact head
- the exact-head Vercel preview is READY
