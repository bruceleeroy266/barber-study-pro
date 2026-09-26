# C7-5 — Chapter 7 Assessment Hardening Baseline Audit

## Scope

Audit the existing 50-question Chapter 7 assessment before changing any quiz item.

Sources used:
1. Hardened Chapter 7 lesson and concept registry.
2. Chapter 7 textbook coverage/terminology reference.
3. NIC National Barber Theory CIB exam-domain guidance for basic chemistry.
4. Hardened 80-card Chapter 7 flashcard deck as a consistency check, not as the primary source.

No quiz wording, answer choices, answer keys, explanations, difficulty labels, or IDs are changed in this audit commit.

## Current-bank metrics

- Questions: **50**
- Easy: **31 (62%)**
- Medium: **14 (28%)**
- Hard: **5 (10%)**
- Stems beginning with "What": **39/50 (78%)**
- True application/scenario questions: **effectively 0**
- Current question-to-concept mappings: **50/50 present**
- Current mapping rule: one primary concept per question
- Correct-answer distribution before runtime randomization: A=10, B=23, C=9, D=8

The current bank is therefore heavily recall-dominant and does not meet the Chapters 7+ framework requirement for difficult exam-style application, scenario reasoning, same-domain distractors, and strong diagnostic value.

## Critical defect found

**qq-7-024 has a keyed-answer contradiction.**

The question asks at what pH hair is dissolved. Choice C says both very strong acid and strong alkali; choice D says only strong alkali. The stored key is **D**, while the stored explanation says **both extremes**, which corresponds to **C**.

This is a deterministic scoring defect and the item must not survive the hardening pass in its current form.

## Current concept distribution

| Concept family | Current questions |
|---|---:|
| Organic & inorganic chemistry | 2 |
| Matter & structure | 4 |
| Physical/chemical properties & changes | 1 |
| Redox & chemical reactions | 7 |
| Solutions, suspensions & emulsions | 6 |
| Water, pH, acids & alkalis | 9 |
| Shampoo chemistry & selection | 6 |
| Conditioner chemistry & selection | 2 |
| Other cosmetic preparations | 7 |
| Chemical safety, labels & interactions | 6 |
| **Total** | **50** |

The single-question properties/changes family and two-question conditioner family are too thin for reliable concept diagnosis. Water/pH and other-preparations are comparatively overrepresented.

## Target hardened distribution

The rebuilt 50-question assessment should use this initial target:

| Concept family | Target |
|---|---:|
| Organic & inorganic chemistry | 3 |
| Matter & structure | 4 |
| Physical/chemical properties & changes | 4 |
| Redox & chemical reactions | 6 |
| Solutions, suspensions & emulsions | 6 |
| Water, pH, acids & alkalis | 7 |
| Shampoo chemistry & selection | 5 |
| Conditioner chemistry & selection | 4 |
| Other cosmetic preparations | 4 |
| Chemical safety, labels & interactions | 7 |
| **Total** | **50** |

This preserves broad textbook coverage while increasing diagnostic depth for safety, application, properties/changes, and conditioner selection.

## Target cognitive/difficulty profile

The rebuilt assessment should not be a trivia bank.

Target difficulty:
- Easy: approximately **5**
- Medium: approximately **20**
- Hard: approximately **25**

Target cognitive style:
- no more than 10 simple definition/recognition items,
- at least 20 application items,
- at least 15 scenario/priority/safety items,
- remaining items may test relationships, sequencing, classification, or interpretation.

Every difficult item should be difficult because it requires reasoning, not because it uses obscure wording or unsupported trick details.

## Test-taking strategy

Every item should support the established ASCYN PRO five-step strategy:

1. Read carefully.
2. Identify the keyword.
3. Eliminate wrong answers.
4. Apply safety/procedure logic.
5. Make the best remaining choice.

Distractors should be realistic same-domain alternatives that can be eliminated through chemistry knowledge and safe-service reasoning.

## Per-question audit

Status meanings:
- **SEED** — core target is source-aligned and may be retained as the conceptual seed, but can still be rewritten harder.
- **REWRITE** — concept belongs, but stem/distractors/explanation/difficulty are too weak, overbroad, or recall-heavy.
- **REPLACE** — current item contains a material accuracy, safety, sourcing, scoring, or design problem; replace with a new item mapped to the same or intentionally rebalanced concept.

| ID | Primary concept | Status | Finding |
|---|---|---|---|
| qq-7-001 | Matter/structure | REWRITE | Pure definition recall; distractors are unrelated domains and too easy. |
| qq-7-002 | Organic/inorganic | REWRITE | Correct concept, but explanation still uses the removed living/once-living shortcut. |
| qq-7-003 | Organic/inorganic | REPLACE | False rule: carbon content does not mean all organic substances burn or all inorganic substances do not. |
| qq-7-004 | Matter/structure | SEED | Accurate matter concept; suitable as seed but too basic for final assessment weight. |
| qq-7-005 | Properties/changes | REWRITE | Good distinction, but explanation still says chemical changes are permanent; needs application context. |
| qq-7-006 | Matter/structure | REWRITE | Accurate element target but pure recall with implausible distractors. |
| qq-7-007 | Redox | SEED | Oxidation definition is aligned; can become a reaction-identification item. |
| qq-7-008 | Redox | SEED | Reduction definition is aligned; can become paired-reaction reasoning. |
| qq-7-009 | Redox | REWRITE | Core pairing is valid; explanation introduces electron-transfer framing beyond the active Chapter 7 teaching frame. |
| qq-7-010 | Redox | SEED | Permanent-wave reduction/oxidation sequence is diagnostically useful; convert to sequencing/application. |
| qq-7-011 | Redox | SEED | Hydrogen peroxide role is aligned; convert to service-reaction reasoning. |
| qq-7-012 | Redox/reactions | REWRITE | Definition is valid, but service example normalizes warmth without enough safety context. |
| qq-7-013 | Mixtures | REWRITE | Solution concept is valid; “clear” should not become the decisive universal clue. |
| qq-7-014 | Mixtures | REWRITE | Suspension concept is valid; “must be shaken” should defer to product directions rather than become universal. |
| qq-7-015 | Mixtures | SEED | Emulsion definition is aligned and can become product-identification reasoning. |
| qq-7-016 | Mixtures | REWRITE | O/W content is source-supported, but question is simple recall and “most” wording needs careful scope. |
| qq-7-017 | Mixtures | SEED | Surfactant head/tail concept is sound; can be converted to cleansing-mechanism reasoning. |
| qq-7-018 | Mixtures | SEED | Anionic charge/cleansing relationship is useful; distractors can be made more diagnostic. |
| qq-7-019 | Water/pH | REWRITE | pH should be framed as hydrogen-ion conditions in water-based solutions, not any “substance” universally. |
| qq-7-020 | Water/pH | REWRITE | 4.5–5.5 range is useful; explanation adds unsupported bacterial/fungal protection claims. |
| qq-7-021 | Water/pH | REPLACE | Treats entire acidic range as one effect and calls mild acids broadly beneficial. Needs strength/concentration reasoning. |
| qq-7-022 | Water/pH | REPLACE | Explanation calls pH 5.5–10 “mild alkali,” contradicting the pH scale below 7. |
| qq-7-023 | Water/pH | REPLACE | Conflates acid-alkali neutralization with universal neutralizing-shampoo use after chemical services. |
| qq-7-024 | Water/pH | REPLACE | Stored key contradicts stored explanation; also relies on rigid danger cutoffs. |
| qq-7-025 | Water/pH | SEED | Soft/hard water distinction is source-aligned; can become product-selection application. |
| qq-7-026 | Water/pH | REWRITE | 20% swelling may be source-supported, but current item is isolated-number recall with added fragility claims. |
| qq-7-027 | Shampoos | SEED | Primary cleansing function is sound; convert to client/product selection context. |
| qq-7-028 | Shampoos | REPLACE | Incorrectly treats neutralizing shampoo as a universal step for perms, relaxers, and haircolor and says it stops the reaction. |
| qq-7-029 | Shampoos | REWRITE | Sulfate-free concept belongs; “ideal” client categories are too absolute. |
| qq-7-030 | Shampoos | REPLACE | Fixed “weekly, not daily” schedule was removed from hardened source logic. |
| qq-7-031 | Shampoos | SEED | Medicated-shampoo purpose is valid; can become label/client-condition reasoning. |
| qq-7-032 | Conditioners | SEED | Conditioner categories are source-aligned; should become selection/application rather than list recall. |
| qq-7-033 | Conditioners | REWRITE | Acidic conditioner range belongs, but explanation overstates universal cuticle/moisture effects and alkaline-shampoo premise. |
| qq-7-034 | Shampoos | SEED | Dry/powder shampoo belongs; convert to contraindication/client-condition reasoning. |
| qq-7-035 | Other preparations | SEED | USP terminology is source-supported; low diagnostic value as acronym-only recall. |
| qq-7-036 | Redox/products | REPLACE | Mixes source-supported oxidation role with unverified concentration/antiseptic claims; replace with oxidizer application. |
| qq-7-037 | Other preparations | REWRITE | Glycerin/humectant concept fits; wording should avoid formula-independent absolutes. |
| qq-7-038 | Other preparations | REPLACE | “Every barber should have alum” directive is unsupported and not a chemistry mastery target. |
| qq-7-039 | Other preparations | REPLACE | Brand-specific disinfectant claim and antimicrobial mechanism exceed Chapter 7 source frame. |
| qq-7-040 | Other preparations | REWRITE | Ammonia/pH concept is useful; convert to pH/service reasoning and remove broad service-list assumptions. |
| qq-7-041 | Other preparations | REPLACE | Treats all silicones as breathable, heat-protective, buildup-causing ingredients; formula-specific claims are too broad. |
| qq-7-042 | Other preparations | REPLACE | Witch-hazel pore/inflammation claims are overbroad and low-value compared with product-purpose selection. |
| qq-7-043 | Chemical safety | REWRITE | SDS purpose is useful and NIC-aligned safety context; OSHA-specific scope should be verified and question made application-based. |
| qq-7-044 | Chemical safety | REWRITE | Chemical-interaction safety is strong; specific reaction detail should be sourced and distractors made procedural. |
| qq-7-045 | Chemical safety | REPLACE | Universal patch-test method, timing, and service list conflicts with product/service-specific testing rules. |
| qq-7-046 | Chemical safety | REWRITE | Immediate flushing/no neutralization is sound safety logic; exact time/medical steps should follow label/SDS or verified source. |
| qq-7-047 | Chemical safety | REWRITE | Ventilation is NIC-aligned; symptoms and equipment prescriptions are too broad. |
| qq-7-048 | Chemical safety | REWRITE | PPE selection is valid, but nitrile-not-latex and one-size-fits-all PPE wording are unsupported universal rules. |
| qq-7-049 | Matter/structure | REWRITE | States of matter are valid but item is trivial and uses an unverified “BOARD EXAM” label. |
| qq-7-050 | Water/pH | REWRITE | Alkaline swelling/porosity principle is useful; “without alkalinity” claim is too absolute and should become service reasoning. |

### Status totals

- **SEED:** 14
- **REWRITE:** 24
- **REPLACE:** 12
- **Total:** 50

## Distractor audit

Common current weaknesses:
- distractors from unrelated subject areas,
- obviously absurd choices,
- opposite-definition distractors that require only memorization,
- choices with noticeably different specificity/length,
- safety questions where one answer is obviously the only cautious option,
- no realistic “almost right but wrong because of one condition” distractors.

Hardened distractors must stay in the same domain and differ by one meaningful chemistry, sequence, pH, product-purpose, label, or safety condition.

## Deterministic remediation mapping

The existing 50 questions already have one primary concept-family mapping each. C7-5 will preserve the one-question/one-primary-concept rule.

Requirements for the rebuilt bank:
1. Every scored question maps to exactly one canonical Chapter 7 concept family.
2. A safety scenario that mentions pH still maps to the concept whose mastery it is primarily testing; no duplicate evidence.
3. Wrong-answer remediation uses the stored primary concept ID, never keyword guessing.
4. Reassessment questions must be unseen and drawn from the same canonical concept family.
5. Initial miss history remains preserved under the Chapter 7 mastery engine.
6. Question IDs remain stable where feasible; when a target changes materially, the ID may stay only if the primary concept mapping stays valid.
7. Mapping integrity tests must fail if any active assessment question is unmapped or mapped more than once.

## Rebuild order

1. Replace the 12 unsafe/inaccurate/scoring-defect items.
2. Rewrite the 24 weak/recall-heavy items.
3. Upgrade the 14 seed items into stronger application or scenario prompts where appropriate.
4. Rebalance concept counts toward the target distribution.
5. Audit all 200 answer choices for one-best-answer validity and same-domain distractor quality.
6. Audit all 50 explanations for source accuracy and original ASCYN PRO wording.
7. Set difficulty labels from actual cognitive demand, not vocabulary complexity.
8. Add deterministic assessment-hardening tests.
9. Run Engineering Verification and Vercel before closing C7-5.

## C7-5 exit criteria

C7-5 cannot close until:
- 50/50 questions are source-accurate,
- all answer keys match the actual best answer,
- all explanations agree with the key,
- all questions map exactly once to a canonical concept,
- the bank meets the target difficulty/application profile,
- no unsupported shortcut from C7-3/C7-4 returns,
- remediation mappings are deterministic,
- Engineering Verification is GREEN,
- Vercel is GREEN.
