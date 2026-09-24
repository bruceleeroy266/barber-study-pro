# C4 30-Question Quiz Book-Alignment Audit — Milady + NIC + LO1–LO8

## Scope
Audit only. No production quiz question is changed in this phase.

Current bank: `qq-4-001..030` in `src/lib/chapter-4-premium-quiz.ts`.

## Source controls
### Milady
Primary chapter source: connected Drive `chapter 4.pdf`, Chapter 4 **Infection Control: Principles and Practices**.

Use Milady for coverage, terminology, sequence, procedures, and factual scope. The scanned PDF is the authority; the already locked Chapter 4 LO1–LO8 source matrix is the audit control derived from that scan.

### NIC
NIC National Barber Theory Examination CIB currently hosted by NIC (Barber Theory CIB, effective 6/1/2018, rev. 3.1.2020) is the exam-domain control. For Chapter 4, the relevant NIC targets are:
- disease/infection cause and transmission
- sanitation/cleansing
- disinfection
- sterilization
- contamination/cross-contamination
- blood exposure procedures
- government-agency requirements related to public protection (including OSHA/EPA)

NIC is used for domain emphasis, not as permission to invent chapter facts that Milady does not support.

### ASCYN PRO
Use original ASCYN PRO wording, difficult-but-fair application, diagnostic mapping, targeted remediation compatibility, and five-step explanations. Do not copy textbook passages.

## Locked audit result
- Current bank: **30**
- **RETAIN: 16**
- **REWRITE: 14**
- Final bank remains exactly **30**
- Stable IDs remain `qq-4-001..030`
- The 90-question reassessment reserve remains untouched during this implementation phase
- Do **not** convert weak questions to `hard` by metadata alone; difficulty must come from the stem, scenario, and plausible distractors

## Exact question disposition

| ID | Decision | Primary LO | Audit finding / locked target |
|---|---|---|---|
| qq-4-001 | REWRITE | LO-4-02 | Broad pathogen-group recall with giveaway distractors. Replace with applied bacterial morphology/classification (cocci/bacilli/spirilla). |
| qq-4-002 | RETAIN | LO-4-03 | Strong indirect-transmission application; directly supports Milady/NIC transmission coverage. |
| qq-4-003 | RETAIN | LO-4-03 | Strong asymptomatic-transmission reasoning and source-aligned professional relevance. |
| qq-4-004 | REWRITE | LO-4-02 | Direct-transmission concept is already sufficiently represented by qq-4-002/003/005. Replace with active vs inactive bacterial-stage reasoning. |
| qq-4-005 | RETAIN | LO-4-03 / LO-4-08 | Strong transmission-risk/professional-boundary scenario; prevents diagnosis while testing safe service judgment. |
| qq-4-006 | REWRITE | LO-4-05 | Basic cleaning-before-disinfection recall is already tested more strongly by qq-4-011. Replace with label/use-claim disinfectant selection. |
| qq-4-007 | REWRITE | LO-4-05 | Definition-only disinfection item with weak distractors. Replace with antiseptic vs disinfectant decision in a barbering scenario. |
| qq-4-008 | RETAIN | LO-4-04 / LO-4-05 | Label-directed contact time is source-correct and guards against the removed universal-time error. |
| qq-4-009 | REWRITE | LO-4-05 | Near-duplicate of qq-4-008. Replace with disinfectant-class/use-limitation reasoning under product-label control. |
| qq-4-010 | RETAIN | LO-4-04 | Correct sterilization-vs-disinfection distinction; matches NIC infection-control levels. |
| qq-4-011 | RETAIN | LO-4-04 | Strong sequence/application: clean → label-directed disinfect → protected storage. |
| qq-4-012 | REWRITE | LO-4-03 | Definition-only cross-contamination is overrepresented elsewhere. Replace with local-vs-systemic infection terminology. |
| qq-4-013 | REWRITE | LO-4-03 | Clean-storage principle overlaps qq-4-011/016/030. Replace with immunity/resistance-to-infection reasoning. |
| qq-4-014 | RETAIN | LO-4-03 / LO-4-06 | Good cross-contamination application involving contaminated gloves and clean equipment. |
| qq-4-015 | REWRITE | LO-4-03 | Dropped-towel contamination is valid but low-value relative to source gaps. Replace with bloodborne-organism/transmission recognition without sensationalized risk claims. |
| qq-4-016 | RETAIN | LO-4-04 | Strong recontamination scenario requiring separation of processed and used implements. |
| qq-4-017 | RETAIN | LO-4-06 | Foundational Standard Precautions item; explicitly aligned to Milady and NIC. |
| qq-4-018 | REWRITE | LO-4-06 | PPE question is too obvious. Replace with higher-value blood-exposure/sharps/hand-hygiene decision making. |
| qq-4-019 | RETAIN | LO-4-06 | Strong first-action blood-exposure scenario. |
| qq-4-020 | REWRITE | LO-4-07 | Overlaps qq-4-014/021 on contaminated gloves. Replace with electrical/water/appliance or damaged-equipment safety. |
| qq-4-021 | RETAIN | LO-4-06 | Strong post-glove hand-hygiene/cross-contamination reasoning. |
| qq-4-022 | REWRITE | LO-4-01 | OSHA role is important, but this is shallow recall with implausible distractors. Replace with OSHA vs EPA vs state-board authority in an applied scenario. |
| qq-4-023 | REWRITE | LO-4-01 | SDS is important, but current answer can be guessed from trivial distractors. Replace with SDS/GHS use in chemical handling/exposure decision making. |
| qq-4-024 | REWRITE | LO-4-01 / LO-4-05 | EPA role is source/NIC relevant, but current recall format is too easy. Replace with EPA registration/label-use reasoning. |
| qq-4-025 | RETAIN | LO-4-01 / LO-4-07 | Strong chemical-label/SDS scenario; correctly rejects guessing and unsafe mixing. |
| qq-4-026 | RETAIN | LO-4-07 | Valid single-use-item handling principle with operational safety value. |
| qq-4-027 | REWRITE | LO-4-08 | Linen separation is correct but lower priority than explicit professional responsibility. Replace with current-rule/license/hazard-information responsibility. |
| qq-4-028 | RETAIN | LO-4-03 / LO-4-08 | Strong open-lesion/service-boundary scenario; avoids diagnosis and unsafe service. |
| qq-4-029 | RETAIN | LO-4-07 | Useful between-client station-preparation application. |
| qq-4-030 | RETAIN | LO-4-07 / LO-4-08 | Strong recontamination/client-contact environment scenario requiring correction before service. |

## Final RETAIN set — 16
`qq-4-002, 003, 005, 008, 010, 011, 014, 016, 017, 019, 021, 025, 026, 028, 029, 030`

## Final REWRITE set — 14
`qq-4-001, 004, 006, 007, 009, 012, 013, 015, 018, 020, 022, 023, 024, 027`

## LO1–LO8 coverage findings

### LO-4-01 — Federal/state regulation; OSHA, EPA, SDS/GHS
Current coverage exists but is too recall-heavy.

Locked action:
- rewrite qq-4-022 into agency/authority application
- rewrite qq-4-023 into SDS/GHS application
- rewrite qq-4-024 into EPA registration/label application
- retain qq-4-025 as a strong chemical-safety scenario

### LO-4-02 — Bacterial classifications and stages
**Major assessment gap.**

Locked action:
- qq-4-001 → cocci/bacilli/spirilla applied identification
- qq-4-004 → active vs inactive bacterial-stage reasoning

### LO-4-03 — Pathogens, infection terminology, transmission, immunity
Transmission is strong; infection terminology and immunity are weak.

Locked action:
- retain qq-4-002, 003, 005, 014, 028
- qq-4-012 → local vs systemic infection
- qq-4-013 → immunity/resistance
- qq-4-015 → bloodborne-organism/transmission recognition

### LO-4-04 — Cleaning, disinfection, sterilization
Strong overall; remove duplication rather than adding more questions.

Locked action:
- retain qq-4-008, 010, 011, 016
- free qq-4-006/007/009 for LO-4-05 deficits

### LO-4-05 — Disinfectants and antiseptics
**Major assessment gap relative to the hardened lesson/source matrix.**

Locked action:
- qq-4-006 → label/use-claim product selection
- qq-4-007 → antiseptic vs disinfectant
- qq-4-009 → disinfectant class/use limitation
- qq-4-024 also reinforces EPA registration + label logic

### LO-4-06 — Standard Precautions and blood exposure
Strong, but one weak PPE item and some glove duplication remain.

Locked action:
- retain qq-4-017, 019, 021
- qq-4-018 → higher-value blood-exposure/sharps/hand-hygiene application

### LO-4-07 — Safe work practices
Current infection-control workflow is decent, but broader accident/injury prevention is thin.

Locked action:
- qq-4-020 → water/electrical/appliance/damaged-equipment safety
- retain qq-4-025, 026, 029, 030

### LO-4-08 — Professional responsibilities
Mostly indirect in the current bank.

Locked action:
- qq-4-027 → explicit responsibility for current rules/license/hazard or emergency information
- retain professional-boundary evidence in qq-4-005 and qq-4-028

## Duplication / overweight findings
- Direct/indirect transmission is tested repeatedly while LO-4-02 is thin.
- Contact-time logic is duplicated in qq-4-008/009.
- Cleaning/disinfection sequence is repeated in qq-4-006/011/029.
- Cross-contamination is repeated in qq-4-012/014/015/016/020/021/030.
- Basic PPE/glove logic consumes too much of LO-4-06.
- The current bank under-tests Milady LO-4-05 and LO-4-08 despite both being explicitly hardened in the lesson.

## Difficulty findings
Legacy distribution is 12 easy / 12 medium / 6 hard. That is not enough for the desired ASCYN PRO diagnostic standard.

Critical rule: **do not simply change `difficulty:'easy'` to `difficulty:'hard'`.** Retained questions stay retained because their question bodies are source-safe and diagnostically useful; rewritten questions must earn their difficulty through:
- applied scenarios
- plausible same-domain distractors
- competing but distinguishable procedures
- sequencing/priority decisions
- label/regulation logic
- no joke or unrelated distractors

Retained easy/medium items can keep their content where foundational discrimination is useful. Any later difficulty-normalization pass must preserve validity rather than manufacture difficulty.

## Source-conflict guardrails
Do not reintroduce:
- universal 10-minute disinfectant rules
- unsupported 50% / 99.9% kill claims
- sensational disease-risk multipliers as memorization targets
- guaranteed lawsuit/license-revocation outcomes
- universal inspection-order claims
- fixed sharps thresholds without controlling instructions
- any claim that overrides the product label or current controlling regulation

## Implementation lock
Implementation is authorized only under these constraints:
1. Rewrite **only** the 14 locked IDs: `001, 004, 006, 007, 009, 012, 013, 015, 018, 020, 022, 023, 024, 027`.
2. Preserve the other 16 question bodies unless a new source defect is discovered.
3. Preserve all IDs and keep exactly 30 initial questions.
4. Use original ASCYN PRO wording.
5. Use plausible same-domain distractors.
6. Keep exactly one defensible correct answer.
7. Every rewritten explanation must use the five-step strategy:
   - Read carefully
   - Identify the keyword
   - Eliminate wrong answers
   - Apply safety/procedure logic
   - Make the best remaining choice
8. Rebalance concept mappings only as required by the rewritten targets.
9. Add direct LO1–LO8 coverage tests, unique-stem/options tests, answer-key validation, source-conflict regression checks, and five-step explanation checks.
10. Do **not** modify the 90-question reassessment reserve until this initial-bank implementation passes adversarial review and Engineering Verification.

## Audit status
**LOCKED. No quiz content changed in this audit phase.**

Next phase: implement the 14 rewrites, preserve the 16 retained question bodies, rebalance mappings, add certification, and run adversarial + Engineering Verification before touching the reassessment reserve.
