# Chapter 6 Heavy Baseline Audit — C6-0

**Chapter:** General Anatomy & Physiology  
**Status:** C6-0 complete  
**Purpose:** Establish the evidence-backed baseline before Chapter 6 hardening and concept/remediation integration.

## Active curriculum inventory

- Lesson: `src/lib/chapter-6-premium.ts`
- Quiz: `src/lib/chapter-6-premium-quiz.ts` — 50 questions, passing threshold wired as 80%
- Legacy/enhanced flashcards: `src/lib/chapter6-enhanced-flashcards.ts` — 105 cards
- Active flashcard registry: `src/lib/flashcards-data.ts`
- Chapter 6 has no active `chapter-6-premium-flashcards.ts` entry and is absent from `chapterFlashcards`.
- Chapter 6 does not yet have a canonical concept registry, question-to-concept mappings, detection provider, or Chapter 6 remediation provider.

## Flashcard baseline

The enhanced deck contains 105 cards:

| Source group | Count |
|---|---:|
| Cell biology | 15 |
| Skeletal | 20 |
| Muscular | 25 |
| Nervous | 20 |
| Circulatory | 15 |
| Endocrine / lymphatic / integumentary | 10 |
| **Total** | **105** |

### Coverage finding

The deck is broad enough to salvage rather than replace wholesale. It substantially covers cells, bones, muscles, nerves, circulation, endocrine, lymphatic, and a small amount of integumentary material. Coverage is uneven relative to the current premium lesson: skin/integumentary, body-systems overview, homeostasis/metabolism, and the respiratory/digestive/urinary/reproductive systems are comparatively thin.

### Flashcard defects requiring C6 hardening

1. **Facial-bone enumeration is incomplete.** A card asks for the 14 facial bones but its answer lists only 9 bones: nasal (2), lacrimal (2), zygomatic (2), maxillae (2), and mandible (1). It omits the palatine bones (2), inferior nasal conchae (2), and vomer (1).
2. **Scalp-muscle card is internally inconsistent.** It asks for "four muscles" but names frontalis, occipitalis, and the epicranial aponeurosis; the aponeurosis is connective tissue, not a muscle.
3. **Mastication card overstates masseter/temporalis action.** It says the main chewing muscles coordinate to open and close the mouth. Masseter and temporalis primarily elevate/close the mandible; lateral pterygoid and accessory muscles participate in opening/depression.
4. **Several service/application claims exceed what the lesson needs to teach** and should be rewritten conservatively rather than treated as board facts (for example, cellular effects of heat/products, massage claims, and diagnosis-adjacent language).
5. **Several exact statistics are brittle or unnecessary** for readiness training (for example, one-square-centimeter skin counts and fixed blood composition/volume wording) unless retained with a reliable source and clear educational purpose.

## Quiz baseline

The active bank contains exactly 50 questions:

| Current quiz section | Questions |
|---|---:|
| Cell biology | 10 |
| Body systems overview | 8 |
| Skin structure | 8 |
| Skeletal | 5 |
| Muscular | 5 |
| Nervous | 5 |
| Cardiovascular & lymphatic | 5 |
| Endocrine & other systems | 4 |
| **Total** | **50** |

### Alignment finding

The quiz broadly follows the premium lesson, but it does not provide balanced diagnostic resolution. Cells receive 10 questions while several body systems are represented by only one question or are not independently measured. A 50-question score therefore cannot currently identify all Chapter 6 weak areas with useful precision.

### Quiz defects requiring C6 hardening

1. **Artery/vein definitions are overgeneralized.** Questions 43–44 define arteries as oxygenated and veins as deoxygenated. Direction relative to the heart is the defining distinction; pulmonary circulation is the obvious exception to the oxygenation shortcut.
2. **Question 29 calls the cranium "the skull bone."** The cranium is a group/portion of skull bones enclosing the brain, not one bone.
3. **Question 46 is underspecified.** It asks what to do for a swollen lymph node but the keyed answer says "since it has persisted" even though persistence is not stated in the stem.
4. **Question 41 embeds medical/first-aid specificity** ("elevate their feet") that should be reviewed against the intended barber safety scope. The core response should be to stop the service, keep the client safe, assess, and follow appropriate emergency procedures.
5. **Questions 43–44 duplicate the same artery/vein distinction** instead of using one slot for capillaries, circulation pathways, or a higher-value application.
6. **The bank has no canonical concept IDs.** Wrong answers cannot yet deterministically resolve to Chapter 6 concept families.
7. **Coverage is too recall-heavy in several areas.** More application-level items are needed for safe service decisions and to produce meaningful gap evidence.
8. **Respiratory and digestive each receive only one direct question; urinary and reproductive do not receive independent diagnostic questions.**
9. **Endocrine coverage is too shallow** relative to the lesson's gland/hormone material.

## Premium lesson baseline

The premium lesson has strong breadth but needs a factual/scope hardening pass before certification.

### High-priority lesson corrections

- Replace "sebaceous glands are connected to EVERY hair follicle" with qualified wording; most are associated with follicles, with exceptions.
- Remove or qualify the claim that the pituitary "controls all other endocrine glands."
- Replace artery/vein oxygenation shortcuts with direction-first definitions and note pulmonary exceptions where useful.
- Remove unsupported universal exam-frequency language such as "they appear on every exam" unless tied to a specific documented exam blueprint.
- Remove diagnosis-adjacent or causal overstatements such as kidney function being inferred from dry/itchy skin, cortisol directly "causing" multiple conditions, and simplistic hormone-to-beard explanations.
- Rewrite swollen-node guidance so ASCYN PRO teaches observation, service safety, and referral without diagnosing.
- Review the dizziness/neck-massage scenario so it stays within barber scope and does not teach unsupported medical treatment.
- Replace fixed biological timing/statistical claims where variability matters (for example, exact epidermal replacement timing) with appropriately qualified wording.
- Correct overly broad anatomy statements and remove claims whose only purpose is trivia rather than service safety or assessment readiness.

## C6-1 canonical concept families

These are the exact concept families to use for Chapter 6 mapping, detection, remediation, and instructor reporting.

| ID | Canonical concept | Scope |
|---|---|---|
| `ch6-cells-tissues` | Cells, Tissues & Basic Physiology | Cell structure/function, mitosis, four tissue types, homeostasis, metabolism |
| `ch6-body-systems` | Body Systems Overview | Eleven systems, major functions, system relationships, anatomy vs physiology |
| `ch6-skeletal` | Skeletal System | Skull/cranium/facial bones, vertebrae, barber-relevant landmarks |
| `ch6-muscular` | Muscular System | Muscle types, scalp/facial/neck muscles, mastication, movement |
| `ch6-nervous` | Nervous System | CNS/PNS, sensory/motor pathways, cranial nerves V/VII, service-safety relevance |
| `ch6-cardiovascular` | Cardiovascular System | Heart, blood, arteries/veins/capillaries, circulation, head/neck blood supply |
| `ch6-lymphatic` | Lymphatic & Immune System | Lymph, vessels, nodes, immune role, observation/referral boundaries |
| `ch6-integumentary` | Integumentary System | Epidermis/dermis/subcutaneous tissue, hair/skin glands, skin structures |
| `ch6-endocrine` | Endocrine System | Hormones, major glands, regulation, hair/skin relationships without diagnosis |
| `ch6-other-systems` | Respiratory, Digestive, Urinary & Reproductive Systems | Core functions and limited barber-relevant relationships |

### Mapping rules for C6-1

1. Every active lesson assessment target maps to one primary concept family.
2. Every quiz question maps to exactly one primary Chapter 6 concept family.
3. Flashcards may map to one primary family and optional supporting tags, but remediation uses the primary family.
4. A concept family must have enough independent evidence to support a weak-area determination; one isolated quiz item is not sufficient diagnostic coverage.
5. Safety/referral questions map to the anatomy system being tested rather than a generic "safety" bucket.
6. Skin/hair detail belongs in `ch6-integumentary` only when the target is anatomy/physiology; disease/disorder material belongs in its dedicated later chapter.
7. C6-1 should rebalance or expand the quiz only after the canonical mappings expose evidence gaps.

## C6-1 entry criteria

C6-0 is complete. C6-1 can now build:
- Chapter 6 concept registry and stable IDs
- lesson/content mappings
- flashcard normalization and concept mappings
- all 50 question mappings
- coverage tests that fail on unmapped content/questions
- evidence-count checks before detection/remediation is enabled

## C6-0 disposition

**GO to C6-1.** The existing lesson, 105-card enhanced deck, and 50-question quiz are usable source material, but they are not certification-ready without the corrections and canonical mapping work above.
