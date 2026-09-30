# C18-4 — Assessment Source-Grounding + Answer-Key Certification

C18-4 independently hardens all 15 existing Chapter 18 assessment questions against the certified C18-2 lesson, certified C18-3 flashcards, and authoritative public safety/manufacturer sources.

## Preserved invariants

C18-4 preserves:

- all 15 stable assessment IDs: `qq-18-01` through `qq-18-15`
- all 15 `standardId` values and order indexes
- all 50 certified Chapter 18 flashcards
- all seven Chapter 18 concept families
- the two C18-1 safety-critical concept flags
- the existing one-question-to-one-concept assessment mappings
- the C18-2 hardened lesson
- the shared 20/10/40/15/15 grading/evidence architecture

## Source boundary

The inherited assessment contained textbook page references and categorical claims that cannot be independently page-verified from the repository because no licensed Chapter 18 source scan is present.

C18-4 therefore removes unverified page-citation claims and grounds the assessment in:

- the certified C18-2 lesson;
- the certified C18-3 50-card bank;
- FDA Hair Dyes guidance and Cosmetics Safety Q&A;
- FDA's description of the coal-tar hair-dye caution-label / preliminary-test framework;
- professional manufacturer technical guidance showing that developer strength, lift, gray coverage, mixing ratio, processing, scalp use, heat, and lightener rules are product-system specific.

No textbook prose is copied.

## Answer-key certification

The hardened answer key is:

| ID | Correct |
| --- | --- |
| qq-18-01 | B |
| qq-18-02 | B |
| qq-18-03 | B |
| qq-18-04 | A |
| qq-18-05 | C |
| qq-18-06 | C |
| qq-18-07 | C |
| qq-18-08 | C |
| qq-18-09 | B |
| qq-18-10 | B |
| qq-18-11 | B |
| qq-18-12 | C |
| qq-18-13 | C |
| qq-18-14 | C |
| qq-18-15 | C |

Certification tests lock these keys and require four distinct choices plus a substantive explanation for every question.

## Major repairs

### Developer / lightener

The old assessment treated 20-volume as a generic standard for permanent color and gray coverage, and implied developer volume alone determined lift.

C18-4 now tests the correct professional principle: use only the developer strengths, ratios, scalp/off-scalp use, processing limits, and gray-coverage guidance permitted by the exact product system.

### Porosity / gray coverage / tint-back

Removed as universal rules:

- automatically choosing one to two levels lighter for porous hair;
- fixed gray-percentage capability for demipermanent color;
- automatically applying a filler first for every tint-back.

The hardened items test analysis, strand testing when appropriate, and manufacturer-supported equalization/tint-back/filler strategies.

### Allergy / regulatory wording

The old assessment asserted that a 24–48-hour patch test for “aniline derivative” products is universally required by law.

The hardened assessment instead tests:

- following the exact product allergy-alert / skin-test directions;
- FDA advice to perform a skin test before each hair-dye use;
- the separate federal caution-label / preliminary-test framework for qualifying coal-tar hair dyes.

### Facial hair

The old assessment used a blanket ingredient-class prohibition.

The hardened item requires using only a product whose manufacturer expressly permits the intended beard/mustache application and following its allergy-alert, skin, timing, rinsing, and eye-area precautions.

### Chemical packaging

The old peroxide-bottle item asserted one specific causal mechanism for a bulging bottle.

The hardened item teaches the safer general rule: do not use damaged, swollen, leaking, or otherwise compromised chemical packaging; secure it and follow manufacturer/workplace handling and disposal instructions.

## Concept mapping certification

All 15 assessment IDs remain mapped exactly once:

- qq-18-01, qq-18-02 → Hair Analysis & Structure
- qq-18-03, qq-18-06 → Color Theory & Neutralization
- qq-18-04, qq-18-08, qq-18-11 → Haircolor Product Classes
- qq-18-05 → Developers, Lighteners & Toners
- qq-18-09, qq-18-10 → Consultation & Application Procedures
- qq-18-07, qq-18-15 → Corrective Color, Gray Coverage & Porosity
- qq-18-12, qq-18-13, qq-18-14 → Service Safety, Contraindications & Chemical Handling

Every one of the seven certified concepts remains represented in the 15-question bank.

## Public source references

- https://www.fda.gov/cosmetics/cosmetic-products/hair-dyes
- https://www.fda.gov/cosmetics/resources-consumers-cosmetics/cosmetics-safety-qa-hair-dyes
- https://www.matrix.com/professional/products/haircolor/cream-developer-20-volume
- https://www.matrix.com/professional/products/haircolor/cream-developer-30-volume
- https://www.matrix.com/professional/products/haircolor/cream-developer-40-volume
- https://www.matrix.com/professional/products/haircolor/open-air-pre-bonded
- https://www.matrix.com/professional/products/haircolor/lightening-accelerator

## Certification gate

C18-4 can be certified GREEN only when:

1. all 15 stable IDs remain present exactly once;
2. all 15 certified answer keys pass;
3. every question has four distinct distractor/answer choices and a substantive explanation;
4. every question maps exactly once to its certified concept family;
5. all seven concept families remain represented;
6. the certified 50-card bank remains intact;
7. C18-1 through C18-3 regression tests remain green;
8. exact-head Engineering Verification succeeds;
9. the matching exact-head Vercel deployment reaches READY.
