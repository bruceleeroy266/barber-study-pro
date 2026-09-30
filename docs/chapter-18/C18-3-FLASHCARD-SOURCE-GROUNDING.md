# C18-3 — Flashcard Source-Grounding + Concept Certification

C18-3 independently audits and hardens all 50 Chapter 18 flashcards while preserving the certified C18-1 concept architecture and the C18-2 lesson.

## Scope

C18-3 changes flashcard wording only.

Preserved:

- all 50 stable flashcard IDs: `fc-ch18-001` through `fc-ch18-050`
- all 50 `standardId` values
- chapter assignment `ch-18`
- order indexes 1–50
- existing seven canonical concept families
- the two C18-1 safety-critical concept flags
- all 15 chapter-assessment questions and IDs
- the C18-2 hardened lesson
- shared 20/10/40/15/15 grading/evidence architecture

## Source boundary

The inherited flashcards contained textbook page citations, but the repository does not contain an authoritative licensed Chapter 18 source scan that allows those page references to be independently verified.

C18-3 therefore removes unverified page citations from the flashcard backs rather than presenting them as verified sourcing.

The hardening pass is grounded in:

- the certified C18-2 hardened lesson;
- FDA Hair Dyes and Cosmetics Safety Q&A guidance;
- the federal coal-tar hair-dye caution-label / preliminary-test framework described by FDA;
- professional manufacturer technical guidance demonstrating that developer, lightener, ratio, lift, heat, scalp, timing, and overlap rules vary by product system;
- current Oklahoma barbering scope materials for the legal scope of applying lighteners and color.

No textbook prose is copied.

## Regulatory and allergy-test repairs

Cards 019, 034, 042, and 049 no longer claim that FDA or federal law imposes one universal 24–48-hour “aniline derivative” patch-test rule.

They now distinguish:

- FDA safety guidance to perform a skin test before each hair-dye use;
- the special federal treatment of qualifying coal-tar hair dyes when the required caution statement and adequate preliminary-test directions are present;
- the controlling role of the exact product-label allergy-alert / skin-test procedure.

## Developer and lightener repairs

Cards 021–027 and 035 no longer teach universal developer-volume lift formulas or universal cream/powder/oil hierarchies.

They now teach:

- volume expresses peroxide strength;
- actual lift and permitted use depend on the whole product system;
- manufacturer instructions control allowed developer strength, mixing ratio, scalp/off-scalp use, timing, heat, and overlap;
- lightener format alone does not establish strength or scalp safety;
- toner chemistry varies by product.

## Hair-analysis, gray, and porosity repairs

The flashcard bank no longer presents as universal:

- 50% wet-hair elasticity;
- a fixed 1/8-inch subsection;
- a universal 1–10 level scale;
- automatic stronger developer for low porosity;
- fixed wash-count longevity;
- fixed gray-coverage percentages.

The cards now use hair analysis to guide caution while keeping formulation and processing claims product-specific.

## Compatibility and facial-hair repairs

Cards 020, 036, 047, 048, 049, and 050 now:

- treat unknown or potentially incompatible prior color chemistry as a stop-and-verify problem;
- avoid diagnosing scalp disease;
- use FDA-supported scalp-integrity precautions;
- require facial-hair color to be expressly permitted for the intended beard/mustache application by the manufacturer;
- avoid blanket ingredient-class claims unsupported as universal rules.

## Concept certification

All 50 stable flashcard IDs remain mapped exactly once to one of the seven certified Chapter 18 concept families.

The assessment bank remains 15/15 and is not rewritten in C18-3.

## Public source references

- https://www.fda.gov/cosmetics/cosmetic-products/hair-dyes
- https://www.fda.gov/cosmetics/resources-consumers-cosmetics/cosmetics-safety-qa-hair-dyes
- https://www.fda.gov/cosmetics/cosmetics-laws-regulations/prohibited-restricted-ingredients-cosmetics
- https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-industry-color-additive-petitions-fda-recommendations-submission-chemical-and-technological
- https://www.matrix.com/professional/products/haircolor/lightening-accelerator
- https://oklahoma.gov/cosmo/licenses/barbering.html

## Certification gate

C18-3 can be certified GREEN only when:

1. the 50-card hardening test passes;
2. all 50 IDs remain stable and unique;
3. all 50 cards map exactly once to a valid Chapter 18 concept family;
4. the 15-question assessment bank remains unchanged in count and stable IDs;
5. C18-1 and C18-2 certification tests remain green;
6. exact-head Engineering Verification succeeds;
7. the matching exact-head Vercel deployment reaches READY.
