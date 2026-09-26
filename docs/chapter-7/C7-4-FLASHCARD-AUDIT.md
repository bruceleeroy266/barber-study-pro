# C7-4 — Chapter 7 Flashcard Audit Before Rewrite

## Rule

This is an audit-only pass. No flashcard wording is changed in this phase.

Each active card is reviewed against:
1. the hardened Chapter 7 lesson,
2. Chapter 7 textbook coverage and terminology,
3. the canonical Chapter 7 concept map, and
4. NIC Barber Theory chemistry emphasis (pH, product/ingredient purpose and effects, chemical interactions, reaction/overexposure safety).

Statuses:
- **KEEP** — supported and aligned; may still receive style cleanup later.
- **REWRITE** — concept belongs in Chapter 7, but wording contains a shortcut, overclaim, weak framing, or insufficiently precise explanation.
- **REPLACE** — current card teaches a misleading or weak target; replace with a better card for the same mapped concept.
- **SOURCE-VERIFY** — plausible content, but the Chapter 7 source support must be confirmed before the card is retained.

## Audit Summary

- Active cards audited: **80/80**
- Concept mappings already present: **80/80**
- No card text changed in this audit commit.
- Highest-risk clusters: organic/inorganic shortcuts, physical-vs-chemical reversibility shortcuts, pH universal claims, neutralization confusion, fixed shampoo schedules, universal pre-service testing claims, brand/legal absolutes, and product-specific ingredient claims that exceed the verified Chapter 7 source.

## Per-card audit

| Card | Concept | Status | Audit finding |
|---|---|---|---|
| fc-7-001 | Matter/structure | KEEP | Definition fits chapter scope; later shorten to retrieval-friendly wording. |
| fc-7-002 | Organic/inorganic | REWRITE | Uses “living or once-living” shortcut removed from hardened lesson. |
| fc-7-003 | Organic/inorganic | REPLACE | “Organic burns / inorganic does not burn” is false and unsafe as a classification rule. |
| fc-7-004 | Matter/structure | KEEP | Core matter definition and states are aligned. |
| fc-7-005 | Properties/changes | KEEP | Physical vs chemical property distinction is aligned. |
| fc-7-006 | Properties/changes | REWRITE | Ends with “chemical changes are permanent,” an overbroad shortcut removed from lesson. |
| fc-7-007 | Matter/structure | KEEP | Element definition aligns with chapter coverage. |
| fc-7-008 | Matter/structure | KEEP | Atom/subatomic-particle terminology aligns. |
| fc-7-009 | Matter/structure | REWRITE | Good target, but simplify molecule/compound wording and avoid teaching category shortcuts as absolutes. |
| fc-7-010 | Matter/structure | KEEP | Pure substance vs mixture is within source scope. |
| fc-7-011 | Redox | KEEP | Oxidation framed as gain of oxygen/loss of hydrogen aligns. |
| fc-7-012 | Redox | KEEP | Reduction framed as loss of oxygen/gain of hydrogen aligns. |
| fc-7-013 | Redox | REWRITE | Electron-transfer explanation exceeds the Chapter 7 teaching frame used in the hardened lesson; use the verified oxygen/hydrogen relationship. |
| fc-7-014 | Redox | REWRITE | Permanent-wave sequence belongs, but wording should be aligned to the hardened neutralization distinction and source terminology. |
| fc-7-015 | Redox | KEEP | Hydrogen peroxide as oxidizing agent/reduced substance aligns after minor future style cleanup. |
| fc-7-016 | Reactions | REWRITE | “Warm is normal and expected” is too universal; retain exothermic definition without normalizing client heat exposure. |
| fc-7-017 | Reactions | SOURCE-VERIFY | Endothermic definition is in scope; barbering example should be confirmed against source wording. |
| fc-7-018 | Redox | REWRITE | Core oxidation-neutralization idea belongs, but “weak, frizzy curls” consequence is not needed and is insufficiently source-grounded. |
| fc-7-019 | Mixtures | REWRITE | A solution is stable/uniform; “solutions are clear” should not be taught as a universal identifier. |
| fc-7-020 | Mixtures | REWRITE | Suspensions may settle; “must be shaken” should follow the product label, not become a universal classification rule. |
| fc-7-021 | Mixtures | REWRITE | Emulsion definition is useful; “most shampoos and conditioners are emulsions” needs source-tight wording. |
| fc-7-022 | Mixtures | SOURCE-VERIFY | O/W vs W/O concept is valid, but “most barbering products” and dry-hair use claim need direct source support. |
| fc-7-023 | Mixtures | KEEP | Surfactant head/tail and surface-tension concept align with chapter coverage. |
| fc-7-024 | Mixtures | KEEP | Four surfactant classes/charges fit chapter shampoo chemistry coverage; later remove “BOARD EXAM” label unless directly tied to NIC. |
| fc-7-025 | Mixtures | REPLACE | “Shake well means suspension” is an unsafe exam shortcut; replace with particle-settling/product-label reasoning. |
| fc-7-026 | Mixtures | SOURCE-VERIFY | O/W classification may be retained only if direct source support is confirmed. |
| fc-7-027 | Water/pH | REWRITE | pH should be taught as hydrogen-ion conditions/concentration in water-based solutions, not “a substance” universally. |
| fc-7-028 | Water/pH | REWRITE | 4.5–5.5 range is aligned; bacteria/fungi protection and universal damage claim exceed hardened lesson. |
| fc-7-029 | Water/pH | REWRITE | Treats the entire acid range as having one hair effect; needs strength/concentration nuance. |
| fc-7-030 | Water/pH | REPLACE | “Mild alkali pH 5.5–10” conflicts with the pH scale because values below 7 are acidic; rebuild from source-accurate pH logic. |
| fc-7-031 | Water/pH | REPLACE | Conflates acid-alkali neutralization with permanent-wave oxidation neutralization and universal post-service shampoo use. |
| fc-7-032 | Water/pH | KEEP | Soft vs hard water/mineral content and lather concept are aligned; later trim cosmetic outcomes if needed. |
| fc-7-033 | Water/pH | SOURCE-VERIFY | Water swelling percentage may be source-supported; fragility/cuticle explanation must be verified before retention. |
| fc-7-034 | Water/pH | REWRITE | Extreme-pH damage belongs, but universal “pH 10–14 dissolves hair” and “never contact scalp” wording is too broad. |
| fc-7-035 | Water/pH | KEEP | Water as a strong solvent concept fits chapter scope; wording can be tightened. |
| fc-7-036 | Water/pH | REWRITE | Boiling/filtration/distillation are source topics; “kills pathogens” and “purest water” claims should be narrowed to source-supported effects. |
| fc-7-037 | Water/pH | REWRITE | Hard-water/mineral effect is valid; “soap scum instead of lather” and universal dryness/dullness should be source-tight. |
| fc-7-038 | Conditioners | REWRITE | Conditioner acidity belongs; “locks in moisture” and “after alkaline shampooing” are overly universal. |
| fc-7-039 | Shampoos | REWRITE | Primary cleansing function is valid; “mostly O/W emulsions” should be retained only with verified source support. |
| fc-7-040 | Shampoos | REWRITE | Four surfactant classes fit; antibacterial/pH-adjusting descriptors need source-tight wording. |
| fc-7-041 | Shampoos | REWRITE | Clarifying vs moisturizing distinction belongs; fixed “weekly, not daily” schedule removed from hardened lesson. |
| fc-7-042 | Shampoos | REPLACE | Incorrectly says neutralizing shampoo stops perms, relaxers, and haircolor; confuses different reaction types. |
| fc-7-043 | Shampoos | REWRITE | Medicated shampoo concept fits; “do not use on healthy scalps” and doctor-recommendation claim are too universal. |
| fc-7-044 | Shampoos | REWRITE | Sulfate-free purpose fits chapter coverage; “ideal for” should become conditional product-selection language. |
| fc-7-045 | Conditioners | KEEP | Conditioner classifications fit the chapter source; future wording can be made more retrieval-oriented. |
| fc-7-046 | Conditioners | REWRITE | Ingredient families fit, but “proteins repair” and “silicones protect from heat” are too absolute without formula-specific qualification. |
| fc-7-047 | Shampoos | SOURCE-VERIFY | Dry/powder shampoo is in source scope; use/application details need direct source confirmation. |
| fc-7-048 | Shampoos | REWRITE | Balancing shampoo for oily hair/scalp fits; “regulates sebum production” is too strong. |
| fc-7-049 | Shampoos | SOURCE-VERIFY | Color-enhancing shampoo belongs; UV-protection and “between salon visits” claims need direct source support. |
| fc-7-050 | Shampoos | REPLACE | Prescriptive hair-type matrix is too rigid and includes categories not established in the hardened source; replace with product-purpose/client-condition reasoning. |
| fc-7-051 | Other preparations | REWRITE | USP terminology is in source, but “official body” and blanket safety assurance need precision. |
| fc-7-052 | Redox/products | SOURCE-VERIFY | Peroxide as oxidizer is supported; antiseptic percentages/volume ranges must be verified directly before retention. |
| fc-7-053 | Other preparations | REWRITE | Glycerin/humectant concept may fit; “draws moisture from the air” and dry-climate claim should be source-tight. |
| fc-7-054 | Other preparations | SOURCE-VERIFY | Petrolatum/barrier use may fit source, but service examples and “prevent irritation” claim need direct support. |
| fc-7-055 | Other preparations | REWRITE | Ammonia/pH concept fits; specific service list and “modern alternatives like MEA” exceed verified core coverage. |
| fc-7-056 | Other preparations | SOURCE-VERIFY | Alkanolamines may be in source; preference/sensitivity language is not yet verified. |
| fc-7-057 | Other preparations | REPLACE | “Every barber should have alum” is an unsupported practice directive; replace with source-supported product-purpose terminology if alum remains. |
| fc-7-058 | Other preparations | REPLACE | Brand-specific Barbicide and broad antimicrobial mechanism claims exceed Chapter 7 source framing. |
| fc-7-059 | Other preparations | SOURCE-VERIFY | Alcohol terminology may be in source; concentration efficacy claims require direct verification. |
| fc-7-060 | Chemical safety | SOURCE-VERIFY | Formaldehyde risk may be relevant, but product examples, carcinogenic framing, and OSHA statement require outside/regulatory sourcing, not Chapter 7 alone. |
| fc-7-061 | Other preparations | REWRITE | Silicone function may fit; “breathable,” heat protection, buildup, and clarifying schedule need product/formula qualification. |
| fc-7-062 | Other preparations | REWRITE | Witch hazel/astringent use may fit; inflammation, gentleness, and botanical comparison claims exceed verified lesson scope. |
| fc-7-063 | Chemical safety | SOURCE-VERIFY | SDS is legitimate workplace safety content, but OSHA-specific requirement wording is outside Chapter 7 textbook source and must be separately verified if retained. |
| fc-7-064 | Chemical safety | SOURCE-VERIFY | 16-section SDS structure is external regulatory detail; retain only with verified OSHA/GHS sourcing, not textbook inference. |
| fc-7-065 | Chemical safety | REWRITE | Incompatible-chemical safety is NIC-aligned; specific bleach/ammonia gas chemistry is external detail and should be separately sourced if retained. |
| fc-7-066 | Chemical safety | REPLACE | Universal patch-test method/timing/service list directly conflicts with hardened lesson’s product/rule-specific testing approach. |
| fc-7-067 | Chemical safety | REWRITE | PPE concept is NIC-aligned; specific glove material/mask rules must defer to label/SDS instead of being universal. |
| fc-7-068 | Chemical safety | REWRITE | Immediate eye-exposure response belongs, but exact 15-minute rule/medical documentation should follow label/SDS or verified safety source. |
| fc-7-069 | Chemical safety | REWRITE | Ventilation/overexposure concept is NIC-aligned; symptoms and air-purifier prescription exceed Chapter 7 source. |
| fc-7-070 | Chemical safety | REPLACE | “Must be on every professional product label” list is a regulatory claim and contains questionable universal fields (expiration date, pH). |
| fc-7-071 | Matter/structure | KEEP | States of matter and physical state changes align; later remove unverified “BOARD EXAM” label. |
| fc-7-072 | Matter/structure | SOURCE-VERIFY | Compound categories appear in legacy lesson; verify exact Chapter 7 textbook classification before retaining all four as a required list. |
| fc-7-073 | Water/pH | REWRITE | H₂O and water chemistry fit; “neutral pH 7” should be framed under standard/reference conditions rather than as an absolute in all contexts. |
| fc-7-074 | Water/pH | REPLACE | Again conflates acid-alkali neutralization with universal neutralizing-shampoo use. |
| fc-7-075 | Water/pH | REWRITE | Alkalinity/hair swelling concept fits; “without alkalinity chemicals cannot reach inner structure” is too absolute. |
| fc-7-076 | Properties/changes | REWRITE | Physical vs chemical color concept is useful but needs tighter source-supported wording and should avoid overgeneralizing every temporary/permanent formula. |
| fc-7-077 | Water/pH/shampoo | REPLACE | “Ideal shampoo pH 4.5–5.5” is too universal and repeats the removed claim that alkaline shampoo necessarily causes damage over time. |
| fc-7-078 | Water/pH/shampoo | SOURCE-VERIFY | Chelating concept likely fits clarifying shampoo coverage; “essential before chemical services” is too absolute. |
| fc-7-079 | Matter/structure | KEEP | Same-element vs different-element molecule distinction fits the chapter concept. |
| fc-7-080 | Chemical safety | SOURCE-VERIFY | Storage principles may be sound, but eight-item regulatory-style checklist must be grounded in label/SDS or verified safety source before use. |

## Priority rewrite queue

### Critical — rewrite/replace first
fc-7-002, 003, 006, 013, 016, 019, 020, 025, 027, 028, 029, 030, 031, 034, 038, 041, 042, 050, 057, 058, 066, 070, 074, 077

### Secondary — source-tightening
fc-7-009, 014, 018, 021, 036, 037, 039, 040, 043, 044, 046, 048, 051, 053, 055, 061, 062, 065, 067, 068, 069, 073, 075, 076

### Direct source verification before decision
fc-7-017, 022, 026, 033, 047, 049, 052, 054, 056, 059, 060, 063, 064, 072, 078, 080

### Strongest keep candidates
fc-7-001, 004, 005, 007, 008, 010, 011, 012, 015, 023, 024, 032, 035, 045, 071, 079

## C7-4 rewrite constraints

When rewrite begins:
- preserve 80 active cards unless a deliberate replacement keeps concept coverage intact,
- preserve each card's canonical concept mapping,
- use original ASCYN PRO wording,
- do not copy textbook sentences or examples,
- remove “BOARD EXAM” labels unless the claim is directly supported by NIC exam-domain evidence,
- favor one retrieval target per card,
- prefer application/decision prompts over trivia where possible,
- never use a shortcut that contradicts the hardened lesson,
- keep product/regulatory claims conditional on label, manufacturer directions, SDS, or verified rule when applicable.
