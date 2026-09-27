# C10-3 — Flashcard Source & Concept Hardening

**Chapter:** 10 — Properties and Disorders of the Hair and Scalp  
**Branch:** `feat/c10-3-flashcard-source-concept-hardening`  
**Certified C10-2 baseline:** `560ada9065f03e2332c2ba172048fdffde3c29b4`

## Scope

C10-3 independently audits all **118 active Chapter 10 flashcards** against:

1. the repository Chapter 10 material summary covering pages 248–268;
2. the Chapter 10 analysis record;
3. the certified C10-1 canonical concept-family mappings.

This phase changes only Chapter 10 flashcard wording and flashcard-specific tests/documentation. It does **not** change the shared grading engine.

## Audit result

All 118 cards were classified exactly once:

- **KEEP: 24**
- **REPAIR: 69**
- **REWRITE: 25**

No card ID was deleted or renumbered.

### Why the repair count is high

The pre-C10-3 deck contained many details that were more specific than the current textual Chapter 10 source record. Examples included:

- unsupported prevalence numbers;
- unsupported treatment instructions and side-effect claims;
- state-board certainty;
- “one-third of hair strength” bond claims;
- extreme-heat disulfide claims;
- unsupported lice survival timing;
- unsupported hair-length measurements;
- unsupported alopecia subtypes not present in the current textual source record;
- incorrect totalis/universalis equivalence;
- barber-facing medical/diagnostic overreach;
- unsupported hypertrophy/skin-cancer detection language.

C10-3 removes those unsupported details instead of filling them from general knowledge.

## Source-grounded repairs

The hardened deck now tracks the current source record for:

- root and shaft structures;
- cuticle, cortex, and medulla;
- COHNS percentages;
- peptide/polypeptide and side-bond concepts;
- hydrogen, salt, and disulfide bond behavior;
- pigment and cross-sectional wave patterns;
- anagen, catagen, and telogen;
- normal shedding and average growth rate;
- androgenic alopecia, areata, totalis, and universalis;
- hair-shaft disorders explicitly present in the source record;
- pityriasis / Malassezia;
- tinea barbae, capitis, and favosa;
- pediculosis capitis and scabies;
- folliculitis, pseudofolliculitis, furuncles, carbuncles, and sycosis vulgaris;
- texture, density, porosity, and elasticity;
- service-safety boundaries for parasites, irritation, and abrasions.

## Major correctness repairs

C10-3 specifically corrects several important defects:

- **Alopecia totalis** is complete **scalp** hair loss; **alopecia universalis** is complete **body** hair loss. They are not treated as two names for the same condition.
- Anagen is aligned to the source-recorded **2–10 years**.
- Telogen is aligned to **3–6 months** and **less than 10%** of scalp hair.
- Normal shedding remains **75–100 hairs per day**.
- Average scalp growth remains about **½ inch per month**.
- COHNS remains **51 / 21 / 6 / 17 / 5**, with sulfur correctly recognized as the smallest percentage.
- Tinea and parasite cards are framed around recognition, service safety, cleaning/disinfection, and referral boundaries rather than barber treatment.

## Concept integrity

The C10-1 one-to-one mapping remains unchanged:

- Hair anatomy & structure: 15 cards
- Hair chemistry & bonds: 16 cards
- Pigment, wave & growth patterns: 14 cards
- Growth cycle & hair types: 6 cards
- Hair/scalp analysis: 21 cards
- Alopecia & hair loss: 17 cards
- Hair-shaft disorders: 8 cards
- Infectious/parasitic scalp: 14 cards
- Service safety/referral: 7 cards

Total: **118 cards**.

## Guardrails

`src/lib/chapter-10-concepts/flashcard-hardening.test.ts` now verifies:

- all 118 runtime IDs exist and are unique;
- all 118 are classified exactly once as KEEP / REPAIR / REWRITE;
- all 118 remain mapped exactly once to C10-1 concepts;
- every canonical concept family still has flashcard coverage;
- the specific unsupported legacy claims found in this audit cannot silently return;
- key source-recorded anchors remain present.

## Source limitation

As in C10-2, this pass is grounded in the repository Chapter 10 source-image set and its pages 248–268 textual material-summary/analysis record. It is **not** represented as a fresh page-by-page transcription from a standalone Chapter 10 PDF.

## Status

**C10-3 implementation complete. Exact-head Engineering Verification, Vercel Preview, and final adversarial flashcard check are still required before certification.**
