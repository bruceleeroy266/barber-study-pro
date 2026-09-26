# C7-5 — Chapter 7 Assessment Rebuild

## Rebuild result

The Chapter 7 scored assessment has been rebuilt as a 50-question bank using original ASCYN PRO wording.

The rebuild follows the source hierarchy established in C7-0/C7-3:
- Chapter 7 textbook coverage and terminology define the subject scope.
- NIC Barber Theory chemistry competencies define the exam-domain emphasis.
- ASCYN PRO wording, scenarios, distractors, explanations, and remediation architecture are original.

## Locked assessment profile

### Difficulty
- Easy: 5
- Medium: 20
- Hard: 25

### Concept distribution
- Organic/inorganic: 3
- Matter/structure: 4
- Properties/changes: 4
- Redox/reactions: 6
- Mixtures: 6
- Water/pH: 7
- Shampoos: 5
- Conditioners: 4
- Other preparations: 4
- Chemical safety: 7

Total: 50

## Design changes

The old bank was 62% easy and 78% of stems began with "What." The rebuilt bank is application-heavy and uses client, product, service, reaction, label, sequencing, and safety contexts.

The rebuild:
- removes the incorrect qq-7-024 key/explanation contradiction,
- removes organic/inorganic burn shortcuts,
- removes reversible/permanent shortcuts,
- separates acid-alkali neutralization from permanent-wave oxidation neutralization,
- removes fixed shampoo schedules,
- removes universal patch-test rules,
- removes brand-specific disinfectant trivia,
- removes unsupported exact peroxide/antiseptic concentration trivia,
- removes unverified BOARD EXAM labels,
- requires product-specific label/manufacturer/SDS reasoning for safety items.

## Distractor standard

Every item has four distinct options and one best stored answer.

Distractors are designed to remain within the same chemistry/product/safety domain whenever possible. They should be rejected by:
1. identifying the tested keyword,
2. distinguishing the relevant chemistry relationship,
3. applying product-purpose or safety logic,
4. eliminating the near-miss condition.

## Deterministic remediation

Every scored question maps to exactly one canonical Chapter 7 concept family.

This prevents:
- double-counting one miss across multiple concepts,
- keyword-based remediation guesses,
- cross-concept contamination.

A miss can therefore drive remediation and unseen reassessment from the exact same canonical family while preserving the initial attempt in mastery history.

## Verification tests

Automated tests now enforce:
- exactly 50 unique questions,
- exactly 5 easy / 20 medium / 25 hard,
- four unique options per question,
- valid stored answer keys,
- 50/50 exact concept mappings,
- the locked concept distribution,
- at least 30 application-context stems,
- no more than 8 "What..." stems,
- no return of the known unsafe shortcuts,
- separation of neutralization concepts,
- no textbook publisher name in runtime assessment copy.

## Remaining C7-5 exit work

Before C7-5 can close:
1. Engineering Verification must pass.
2. Vercel preview for the current PR head must be READY.
3. Any failing assessment invariant must be corrected.
4. The live assessment flow must remain compatible with Chapter 7 remediation mapping.
