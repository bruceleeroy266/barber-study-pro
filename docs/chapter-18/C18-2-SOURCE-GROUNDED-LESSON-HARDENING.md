# C18-2 — Source-Grounded Lesson Hardening

C18-2 hardens the existing Chapter 18 Haircoloring and Lightening lesson while preserving the certified C18-1 architecture.

## Source boundary

The repository does not contain a licensed Chapter 18 textbook scan or an authoritative manufacturer manual that can be treated as a single controlling source for every product system. C18-2 therefore does not claim page-by-page Milady verification.

The hardening pass uses authoritative public sources to define what can safely be stated as universal and what must stay manufacturer-specific:

- U.S. Food and Drug Administration, **Hair Dyes** and **Cosmetics Safety Q&A: Hair Dyes** — allergy/skin-test guidance, scalp contraindications, package directions, gloves, timing, eye-area restrictions, and warnings against mixing unrelated dye products.
- U.S. Food and Drug Administration, **How Safe are Color Additives?** and cosmetics-labeling guidance — the special statutory treatment of coal-tar hair dyes and the federal caution-label / preliminary-test requirement.
- Matrix Professional technical/product guidance — developer percentages, product-specific lift claims, developer substitution warnings, lightener on/off-scalp restrictions, mixing ratios, processing limits, glove/nonmetallic-tool directions, overlap restrictions, and hair-integrity cautions.
- Wella Professional technical guidance — additional evidence that developer/lift relationships and processing rules depend on the specific color/lightener system.
- Oklahoma State Board of Cosmetology and Barbering, current rulebook/scope materials — confirms that applying lighteners and color is within Oklahoma barbering scope; C18-2 does not invent a state-specific patch-test rule where one was not established by the source.

No textbook prose is copied.

## Regulatory wording repaired

The inherited lesson said that FDA universally requires a 24–48-hour patch test before every application of an “aniline derivative” product.

That was too broad.

C18-2 now distinguishes:

- FDA consumer/salon safety guidance: perform the product skin test before each use and follow package directions;
- federal statutory treatment of coal-tar hair dyes: qualifying products rely on specified caution labeling plus adequate directions for a preliminary skin test;
- manufacturer instructions: exact test procedure and timing must come from the specific product.

The lesson no longer presents a generic “aniline derivative = federal 24–48-hour rule” as universal law.

## Developer and lightener claims repaired

Removed as universal rules:

- 10 volume = deposit/minimal lift
- 20 volume = standard permanent color + gray coverage + 1–2 levels
- 30 volume = up to 3 levels
- 40 volume = up to 4 levels
- cream lightener is inherently the standard on-scalp/milder option
- powder lightener is inherently stronger/off-scalp
- oil lightener is inherently mildest / 1–2 levels

Professional manufacturers publish materially different lift capabilities, developer limits, mixing ratios, scalp restrictions, processing times, and heat instructions across systems.

The lesson now teaches that developer volume describes peroxide strength while actual lift and safe use are product-system dependent.

## Toner and application wording repaired

The inherited lesson defined toner as permanent, deposit-only color on pre-lightened hair. C18-2 now treats toner as a functional use—refining/adjusting tone—whose chemistry depends on the product.

The inherited fixed “soap cap = equal parts tint, developer, shampoo” recipe was removed. Improvised mixtures are not taught outside manufacturer directions.

## Gray, porosity, and damaged-hair wording repaired

Removed or narrowed:

- fixed 25% gray-blending claim
- fixed 80–100% gray shade recommendation
- automatic use of stronger developer for low porosity
- fixed 1/8-inch subsection rule
- blanket protein/lanolin pre-treatment prescription
- fixed 50% elasticity claim as a universal service rule
- universal 1–10 level scale wording

The lesson now uses hair analysis to guide caution and requires product-specific gray coverage, lift, developer, processing, and strand-test guidance.

## Safety and compatibility hardening

C18-2 now:

- tells students not to color an irritated, sunburned, or damaged scalp, consistent with FDA safety guidance;
- requires product directions, gloves, permitted tools/containers, storage, timing, and mixing limits;
- avoids claiming one generic metallic-salt test method;
- treats unknown/incompatible prior chemical systems as a stop-and-verify problem rather than a guess;
- warns against unapproved lightener overlap on previously lightened/sensitized hair;
- does not claim a conditioning treatment can make compromised hair safe for chemical service.

## Facial-hair wording repaired

The inherited lesson used blanket ingredient-class bans on beards and mustaches.

C18-2 replaces that with the stronger operational rule: use a color product on facial hair only when the manufacturer expressly permits that intended beard/mustache use, and follow that product's allergy-alert, skin, timing, rinsing, and eye-area warnings.

This avoids inventing a universal ingredient-class rule while still preventing transfer of scalp-hair directions to facial hair.

## Preserved C18-1 invariants

C18-2 preserves:

- 1 runtime lesson shell
- 10 logical instructional sections
- 50 / 50 flashcards
- 15 / 15 chapter-assessment questions
- seven canonical concept families
- two C18-1 safety-critical concept flags
- all C18-1 mappings
- shared 20/10/40/15/15 grading/evidence architecture

Flashcard wording and assessment wording remain unchanged in C18-2 and are reserved for later hardening phases.

## Public source references

- https://www.fda.gov/cosmetics/cosmetic-products/hair-dyes
- https://www.fda.gov/cosmetics/resources-consumers-cosmetics/cosmetics-safety-qa-hair-dyes
- https://www.fda.gov/consumers/consumer-updates/how-safe-are-color-additives
- https://www.fda.gov/cosmetics/cosmetics-labeling-regulations/summary-cosmetics-labeling-requirements
- https://www.matrix.com/professional/products/haircolor/cream-developer-20-volume
- https://www.matrix.com/professional/products/haircolor/cream-developer-30-volume
- https://www.matrix.com/professional/products/haircolor/cream-developer-40-volume
- https://www.matrix.com/professional/products/haircolor/open-air-pre-bonded
- https://www.oklahoma.gov/cosmo/resources/rules-and-regulations.html

## Certification gate

C18-2 can be certified GREEN only when:

1. the lesson-hardening certification test passes;
2. the C18-1 architecture/inventory tests remain green;
3. the exact branch head passes full Engineering Verification;
4. the matching exact-head Vercel preview reaches READY.
