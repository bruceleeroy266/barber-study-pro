# C9-3 — Chapter 9 Flashcard Adversarial Audit

## Audit rule

This phase is **audit only**. No Chapter 9 flashcard content is changed here.

Each of the current 50 cards is classified as:

- **KEEP** — source-supported, concept-mapped correctly, and no material scope/certainty defect.
- **REPAIR** — the core teaching target is valid, but wording, certainty, scope, examples, statistics, or recall framing needs correction.
- **REWRITE** — the central premise is conflicting, unsupported, too medically prescriptive, or should be replaced by a more durable source-grounded learning target.

Primary content reference: connected textbook file `chapter 9.pdf`, *The Skin: Structure, Disorders, and Diseases*, book pages 222–240.

Canonical concept mapping reference: `src/lib/chapter-9-concepts/mappings.ts`.

Current flashcard source SHA at audit start: `43b50f2e564b75a53d3a3144b8e67a7ad1b35700`.

## Summary

| Classification | Count |
|---|---:|
| KEEP | 15 |
| REPAIR | 29 |
| REWRITE | 6 |
| **Total** | **50** |

### Highest-priority defects

1. **fc-9-004 — REWRITE:** memorizes an unstable blood-supply percentage instead of the durable blood/lymph function.
2. **fc-9-022 — REWRITE:** treats all pustules as active infection and applies an overbroad service prohibition.
3. **fc-9-034 — REWRITE:** says sebaceous cyst and steatoma are the same condition; the source distinguishes them.
4. **fc-9-042 — REWRITE:** asks for albinism precautions and supplies medical advice not established by the chapter.
5. **fc-9-046 — REWRITE:** includes unsupported 80%/20% prevalence figures and over-certain skin-cancer statistics.
6. **fc-9-048 — REWRITE:** current 99%/27% melanoma survival figures conflict with this source edition and are volatile.

## Full 50-card audit

| ID | Concept family | Source | Verdict | Adversarial finding | Exact remediation before editing |
|---|---|---|---|---|---|
| fc-9-001 | ch9-epidermis-skin-barrier | p.222 | **KEEP** | Largest-organ/protective-function target is directly supported. | No content repair. Keep as foundational recall. |
| fc-9-002 | ch9-epidermis-skin-barrier | p.222 | **REPAIR** | Source says healthy skin is *slightly acidic* but does not establish the card's exact pH 5.5 or alkaline-product warning. | Remove exact 5.5 requirement and product warning; test the protective significance of slightly acidic skin. |
| fc-9-003 | ch9-epidermis-skin-barrier | p.222 | **KEEP** | Eyelids vs palms/soles is directly supported; card is recall-heavy but legitimate anatomy. | Keep; later difficulty hardening may convert to application without changing fact. |
| fc-9-004 | ch9-epidermis-skin-barrier | p.225 | **REWRITE** | Source states one-half to two-thirds of blood supply may be distributed to skin; card narrows this to 50% and makes it a brittle percentage-memory target. | Replace with a card on how blood and lymph support skin nourishment, growth, repair, and circulation rather than memorizing a volatile percentage. |
| fc-9-005 | ch9-epidermis-skin-barrier | pp.222–224 | **KEEP** | Epidermis/dermis divisions and subcutaneous tissue position are source-supported. | No repair. |
| fc-9-006 | ch9-epidermis-skin-barrier | pp.223–224 | **KEEP** | Five epidermal strata and order are supported. Recall-heavy but foundational. | Keep; mnemonic may remain as ASCYN aid if clearly instructional rather than source quotation. |
| fc-9-007 | ch9-epidermis-skin-barrier | p.224 | **KEEP** | Germinativum/melanocytes/melanin is supported. | No repair. |
| fc-9-008 | ch9-epidermis-skin-barrier | pp.223–225 | **REPAIR** | No-blood-vessel fact is supported; “BOARD EXAM ALERT” and “most commonly tested” certainty are not verified by the chapter. | Remove exam-frequency language; keep avascular epidermis + nourishment from dermis. |
| fc-9-009 | ch9-epidermis-skin-barrier | pp.223, 228 | **KEEP** | Stratum corneum shedding/keratin/sebum waterproof barrier is supported across the chapter. | No repair. |
| fc-9-010 | ch9-epidermis-skin-barrier | p.224 | **KEEP** | Granulosum cells contain keratin and are nearly dead as described. | No repair. |
| fc-9-011 | ch9-dermis-subcutaneous-support | p.224 | **REPAIR** | ~25× thickness is source-supported; “contains all the skin's functional structures” overstates the source. | Change “all” to a source-faithful list/“many key structures”; keep 25× only as textbook-edition wording. |
| fc-9-012 | ch9-dermis-subcutaneous-support | p.225 | **KEEP** | Papillary/reticular layer contents are source-supported. | No repair. |
| fc-9-013 | ch9-dermis-subcutaneous-support | p.225 | **KEEP** | Motor, sensory, secretory nerve-fiber functions are source-supported. | No repair. |
| fc-9-014 | ch9-dermis-subcutaneous-support | p.226 | **REPAIR** | Collagen/elastin functions and age-related loss are supported; smoking/sun/poor-nutrition acceleration is not established in this section. | Remove unsupported causal add-ons; retain collagen=strength/support and elastin=elasticity/flexibility. |
| fc-9-015 | ch9-dermis-subcutaneous-support | p.225 | **KEEP** | Adipose/subcutaneous functions of smoothness, energy storage, cushion, insulation are supported. | No repair. |
| fc-9-016 | ch9-skin-functions-glands | pp.228–229 | **KEEP** | SHAPES functions are source-supported. | No repair; preserve as memory aid. |
| fc-9-017 | ch9-skin-functions-glands | pp.227–228 | **KEEP** | Sebaceous vs sudoriferous distinction is source-supported. | No repair. |
| fc-9-018 | ch9-skin-functions-glands | pp.227, 234 | **REPAIR** | Open/closed comedones are supported; card adds melanin as the reason blackheads darken while the source attributes darkening to oxidized sebum. | Remove “and melanin”; state exposed sebum oxidizes/turns black and is not simply dirt. |
| fc-9-019 | ch9-skin-functions-glands | p.227 | **REPAIR** | Distribution is supported; “2–4 million” and life-threatening thermoregulation language are not established here. | Keep palms/soles/forehead/armpits + thermoregulation; remove unsupported count and dramatic consequence. |
| fc-9-020 | ch9-pigmentation-hypertrophies | pp.224, 226 | **REPAIR** | Melanocytes/melanin/color/protective-screen function are supported; DNA-damage mechanism and “more natural UV protection” wording exceed the chapter. | Remove DNA/mechanistic certainty; state melanin helps screen/protect skin from sun rays and contributes to skin color. |
| fc-9-021 | ch9-primary-lesions | pp.230–232 | **REPAIR** | Bulla vs vesicle distinction is supported; “size is the only difference” and board-exam certainty overstate source. | Remove exam claim and “only”; use large watery-fluid blister vs small clear-fluid blister. |
| fc-9-022 | ch9-primary-lesions | p.231 + p.230 caution | **REWRITE** | Pustule definition/examples are supported, but “pustules indicate active infection” and blanket “never perform services on skin with pustules” are overbroad. | Replace with recognition + service-safety card: pustule = inflamed papule with pus; pause/avoid working directly over inflamed or potentially infectious lesions and refer when appropriate. |
| fc-9-023 | ch9-primary-lesions | p.231 + pp.237–240 | **REPAIR** | Macule is flat discoloration; non-palpable wording and melanoma-specific monitoring are not how the chapter frames macules. | Keep flat/discolored/not raised distinction; remove melanoma leap and use general “changes in lesions/moles warrant attention.” |
| fc-9-024 | ch9-primary-lesions | p.232 | **REPAIR** | Wheal description/causes supported; “disappears within hours” is not the source standard (source says typically resolves, consider referral if >3 days). | Replace time certainty with source wording: usually resolves on its own; persistent lesions may warrant medical referral. |
| fc-9-025 | ch9-primary-lesions | p.231 | **KEEP** | Papule vs nodule size/depth distinction is supported; 0.4 in/1 cm threshold matches source. | No repair. |
| fc-9-026 | ch9-secondary-lesions | pp.230, 232–233 | **KEEP** | Primary vs secondary distinction is supported. | No repair. |
| fc-9-027 | ch9-secondary-lesions | p.233 | **REPAIR** | Keloid = thick scar from excessive fibrous tissue is supported; darker-skin prevalence, boundary extension, and “do not flatten” are not stated in this source. | Remove unsupported demographic/behavior claims; keep source definition. |
| fc-9-028 | ch9-secondary-lesions | p.233 | **REPAIR** | Fissure definition supported; athlete's-foot example, infection prediction, and product guidance are outside this source entry. | Keep crack penetrating dermis + severely chapped/cracked hands/lips; remove extras. |
| fc-9-029 | ch9-secondary-lesions | p.233 + p.230 caution | **REPAIR** | Ulcer/open-lesion/referral concept supported; “chicken pox scars” is inaccurate to source, and service language should be scope-safe. | Use source examples chicken pox/herpes, not “scars”; say do not work directly over open/compromised lesion and medical referral may be required, especially with underlying conditions. |
| fc-9-030 | ch9-secondary-lesions | p.233 | **REPAIR** | Scale definition/examples supported; “appropriate products can help manage” risks implying treatment beyond the source. | Keep identification; replace treatment advice with gentle service judgment and referral if condition is unknown, inflamed, or outside barber scope. |
| fc-9-031 | ch9-sebaceous-sudoriferous-disorders | p.234 | **KEEP** | Acne mechanism and Grades I–IV are directly source-supported. | No repair in C9-3; terminology remains tied to this textbook edition. |
| fc-9-032 | ch9-inflammatory-infectious-conditions | p.235 | **REPAIR** | Rosacea description/triggers supported; hot-towel/friction prohibitions and dermatologist directive are not stated that way. | Keep source triggers and sensitive-skin handling; phrase medical care as physician-directed medication/medical evaluation rather than barber diagnosis/treatment. |
| fc-9-033 | ch9-inflammatory-infectious-conditions | p.235 | **REPAIR** | Seborrheic dermatitis appearance is supported; “not contagious,” frequency claim, medicated-product/hygiene management wording need tighter source grounding. | Retain red/dry/oily/scaly/crusted description; remove frequency and self-treatment certainty; keep gentle service handling. |
| fc-9-034 | ch9-sebaceous-sudoriferous-disorders | pp.234–235 | **REWRITE** | Direct conflict: source treats **sebaceous cyst** as a sebum-filled pocket-like lesion and **steatoma** as a subcutaneous tumor of fatty tissue, sometimes called a wen. They are not presented as the same condition. | Replace with a discrimination card contrasting sebaceous cyst vs steatoma using the source definitions. Remove all board-exam certainty. |
| fc-9-035 | ch9-sebaceous-sudoriferous-disorders | p.235 | **REPAIR** | Asteatosis/sebum deficiency/older age are supported; cold-climate and moisturizer/dermatologist advice are not the chapter wording. | Use source causes: age, exposure to cold/alkalies, bodily disorders; remove prescriptive advice. |
| fc-9-036 | ch9-sebaceous-sudoriferous-disorders | p.236 | **REPAIR** | Anhidrosis definition and life-threatening/medical-attention statement are supported; warm-towel/steam scenario is an ASCYN inference, not source wording. | Keep source definition and need for medical attention; if service application remains, label it as safety application rather than textbook fact. |
| fc-9-037 | ch9-inflammatory-infectious-conditions | p.236 | **REPAIR** | Dermatitis general inflammation and eczema inflammatory disease/noncontagious are supported; “eczema = specific chronic,” trigger list, and broad service advice are overstated. | Reframe: dermatitis is general inflammation; eczema may be acute or chronic, is noncontagious, and source says cases should be referred to physician for treatment. |
| fc-9-038 | ch9-inflammatory-infectious-conditions | p.236 | **REPAIR** | Psoriasis appearance/chronic/noncontagious are supported; autoimmune claim is outside this source and service instructions exceed it. | Remove autoimmune claim; keep chronic red patches with coarse silvery scales, common locations, noncontagious status, and cautious handling. |
| fc-9-039 | ch9-inflammatory-infectious-conditions | pp.236–237 | **REPAIR** | Herpes simplex I is recurrent viral infection, contagious, requires medical treatment; glove/transmission/“sanitation violation” details exceed source. | Keep contagious/recurrent/medical-treatment boundary; remove unverified glove and penalty claims; say pause services contacting active lesions. |
| fc-9-040 | ch9-sebaceous-sudoriferous-disorders | p.236 | **REPAIR** | Miliaria rubra/red vesicles/itching/excess heat are supported; blocked-duct/hot-humid/heat-service prohibition are not source wording. | Keep source definition and heat cause; phrase avoiding added heat as ASCYN service-safety application, not textbook fact. |
| fc-9-041 | ch9-pigmentation-hypertrophies | pp.237–238 | **REPAIR** | Hyper/hypopigmentation definitions supported; “neither contagious” and “not contraindications for most services” are not established here. | Keep pigment definitions/examples only; remove blanket service-clearance conclusion. |
| fc-9-042 | ch9-pigmentation-hypertrophies | p.238 | **REWRITE** | Source defines congenital hypopigmentation/albinism and describes appearance/light sensitivity; card's SPF 50+, “no natural UV protection,” clothing, and prolonged-sun prescriptions exceed source. | Rewrite front/back to source-described definition and characteristics; do not prescribe numeric SPF or individualized medical precautions. |
| fc-9-043 | ch9-pigmentation-hypertrophies | p.239 | **REPAIR** | Verruca/wart = viral, infectious, can spread via scratching; source says dermatologist can help remove/reduce recurrence. Card adds blanket shaving prohibition and physician-removal certainty. | Keep infectious/spread/referral concept; say avoid traumatizing/working directly over the lesion and recommend qualified evaluation rather than prescribing removal. |
| fc-9-044 | ch9-pigmentation-hypertrophies | pp.222, 238 | **REPAIR** | Keratoma/callus caused by continued pressure/friction and natural-defense concept are supported; “removing exposes tissue to injury/infection” is not. | Keep keratoma/callus/corn definitions and source note that calluses generally should not be removed because they return and harden. |
| fc-9-045 | ch9-pigmentation-hypertrophies | pp.237–240 | **REPAIR** | Mole/nevus/change-warning/referral concepts supported; “you could save their life” is unnecessary medical certainty. | Keep observation of changes and medical follow-up; remove lifesaving claim and keep non-diagnostic language. |
| fc-9-046 | ch9-skin-cancer-recognition | p.239 | **REWRITE** | Qualitative ranking is source-supported, but 80%/20% prevalence numbers are not in this source and the card embeds volatile/over-certain melanoma wording. | Rewrite around source distinctions only: basal = most common/least severe; squamous = more serious/can spread; melanoma = least common/most dangerous. Avoid prevalence percentages. |
| fc-9-047 | ch9-skin-cancer-recognition | p.240 | **REPAIR** | ABCDE is source-supported; “EVERY board exam” and lifesaving certainty are not. | Remove exam-frequency/lifesaving claims; retain ABCDE as observation framework and referral trigger. |
| fc-9-048 | ch9-skin-cancer-recognition | p.239 | **REWRITE** | Current 99%/27% numbers conflict with this textbook edition (which gives different figures) and are volatile. | Replace with durable concept: earlier diagnosis/treatment has better outcomes; prognosis worsens after spread. Do not require memorizing survival percentages. |
| fc-9-049 | ch9-service-safety-referral | pp.230, 236–239 | **REPAIR** | Source explicitly says not to perform services on open sores/infectious/contagious disorders and names pediculosis/scabies; herpes/verruca are contagious/infectious. License-suspension certainty is unsupported. | Keep service refusal/affected-area boundary and named contagious conditions; remove penalty claim; anchor to school/state sanitation rules. |
| fc-9-050 | ch9-service-safety-referral | pp.229–230, 237–240 | **REPAIR** | Recognize/refer/stay in scope is source-aligned; mandatory documentation, lawsuit, and permanent-damage language are not sourced. | Keep observe/recognize → do not diagnose → refer; make documentation conditional on school/shop policy and remove litigation rhetoric. |

## Recall-heavy / weak discrimination findings

The current bank contains several cards that are accurate but function mainly as **one-step recall**. These are not automatically bad, but they create a weak “flashcard equivalent of an obvious distractor” if overused.

### High recall-only concentration
- fc-9-003 — thinnest/thickest
- fc-9-005 — two divisions
- fc-9-006 — five epidermal layers
- fc-9-007 — melanocytes/melanin
- fc-9-010 — granulosum
- fc-9-011 — 25× thicker
- fc-9-016 — SHAPES
- fc-9-017 — sebaceous vs sudoriferous
- fc-9-019 — sweat-gland locations
- fc-9-025 — papule vs nodule
- fc-9-031 — acne grades
- fc-9-036 — anhidrosis definition
- fc-9-041 — hyper vs hypopigmentation
- fc-9-046 — cancer-type ordering
- fc-9-047 — ABCDE

### C9-3 remediation principle
Do **not** delete all recall cards. Keep enough for terminology and structure, but convert selected repaired/rewrite cards into:
- comparison/discrimination prompts,
- safe service-decision prompts,
- “which observation changes the next action?” prompts,
- cause/effect or structure/function prompts,
- scope-boundary prompts.

That keeps the bank useful for memory while reducing superficial recognition.

## Scope/safety overreach queue

The following cards need explicit scope/safety correction before certification:

- **fc-9-022** — all pustules treated as active infection + blanket service prohibition.
- **fc-9-029** — service/referral language needs source-safe affected-area framing.
- **fc-9-030** — product-management advice risks treatment implication.
- **fc-9-032** — service modifications presented too categorically.
- **fc-9-035** — product recommendation/dermatology directive not source-grounded.
- **fc-9-036** — heat-service inference should be labeled as ASCYN safety application.
- **fc-9-037** — eczema definition/treatment boundary needs source wording.
- **fc-9-038** — autoimmune claim not source-grounded.
- **fc-9-039** — glove/transmission/penalty certainty exceeds source.
- **fc-9-040** — heat-treatment prohibition is an application, not source wording.
- **fc-9-041** — blanket service clearance unsupported.
- **fc-9-042** — prescriptive UV precautions exceed chapter.
- **fc-9-043** — removal/shaving instructions overstate source.
- **fc-9-045** — lifesaving certainty.
- **fc-9-047** — exam/lifesaving certainty.
- **fc-9-049** — license-suspension certainty.
- **fc-9-050** — documentation/lawsuit/permanent-damage rhetoric.

## Exact remediation order

No flashcards have been changed yet. When repair is authorized, use this order:

### Batch A — six REWRITES
1. fc-9-004
2. fc-9-022
3. fc-9-034
4. fc-9-042
5. fc-9-046
6. fc-9-048

### Batch B — source-conflict / unsupported statistics and exam certainty
7. fc-9-002
8. fc-9-008
9. fc-9-011
10. fc-9-014
11. fc-9-018
12. fc-9-019
13. fc-9-020
14. fc-9-021
15. fc-9-047

### Batch C — lesion precision
16. fc-9-023
17. fc-9-024
18. fc-9-027
19. fc-9-028
20. fc-9-029
21. fc-9-030

### Batch D — disorders / professional scope
22. fc-9-032
23. fc-9-033
24. fc-9-035
25. fc-9-036
26. fc-9-037
27. fc-9-038
28. fc-9-039
29. fc-9-040

### Batch E — pigmentation / hypertrophies / safety
30. fc-9-041
31. fc-9-043
32. fc-9-044
33. fc-9-045
34. fc-9-049
35. fc-9-050

The 15 KEEP cards remain unchanged unless a later difficulty-balancing pass explicitly upgrades their prompt style without altering the verified fact.

## Certification gate for the future repair pass

C9-3 should not close until:
1. all 6 REWRITE cards are replaced with source-grounded prompts,
2. all 29 REPAIR cards have their specific defects removed,
3. all 15 KEEP cards remain factually stable,
4. every card still maps to exactly one canonical C9-1 concept family,
5. no universal board-exam-frequency claims remain,
6. no unsupported medical diagnosis/treatment instructions remain,
7. no unsupported penalty/license claims remain,
8. flashcard count remains exactly 50 unless an explicitly approved bank-size change is made,
9. full Engineering Verification and exact-head Vercel Preview are GREEN.

## Current C9-3 status

**AUDIT COMPLETE — REMEDIATION LIST LOCKED.**

Flashcard content remains unchanged at this checkpoint.


---

# C9-3 Remediation Pass — Applied

The locked remediation plan above has now been executed without changing the bank size.

## Applied changes

- 6/6 REWRITE cards rebuilt: `fc-9-004`, `022`, `034`, `042`, `046`, `048`
- 29/29 REPAIR cards corrected in the locked priority order
- 15 KEEP cards left unchanged
- flashcard bank remains exactly 50 active cards
- order indices remain 1–50
- no universal board-exam-frequency claims remain
- no unsupported 80%/20% skin-cancer prevalence figures remain
- no 99%/27% melanoma survival-memory target remains
- no “100% fatal” claim remains
- no license-suspension certainty remains
- no 50% blood-supply memory target remains
- sebaceous cyst and steatoma are now correctly distinguished
- medical/scope language now separates observation from diagnosis/treatment
- service-safety guidance is framed around the affected area, sanitation requirements, and appropriate referral

## Certification guardrail

`src/lib/chapter-9-concepts/flashcard-remediation.test.ts` verifies:
- exactly 50 unique active cards
- sequential order 1–50
- exactly 50 unique concept mappings covering the same card IDs
- high-risk unsupported phrases remain absent
- all six rewritten-card targets remain present
- professional scope/referral boundaries remain explicit

## Current status

**REMEDIATION IMPLEMENTED — AWAITING EXACT-HEAD ENGINEERING VERIFICATION + VERCEL PREVIEW.**

C9-4 assessment hardening must not begin until this exact remediated head is GREEN.
