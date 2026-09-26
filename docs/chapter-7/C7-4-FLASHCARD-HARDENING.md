# C7-4 — Chapter 7 Flashcard Content Hardening

## Result

The Chapter 7 premium flashcard deck remains **80 active cards** with all existing IDs and concept mappings preserved.

## Rewrite order completed

1. 24 critical rewrite/replace cards
2. 16 cards directly source-verified before rewrite
3. 40 remaining cards tightened for consistency and source discipline

## Hardening rules applied

- Original ASCYN PRO wording throughout
- No textbook sentences or question wording copied
- One retrieval target per card where practical
- Organic/inorganic classification no longer predicts safety or flammability
- Physical vs chemical change no longer relies on reversible/permanent shortcuts
- Redox wording is aligned with oxygen/hydrogen relationships used in Chapter 7
- Acid-alkali neutralization remains separate from permanent-wave oxidation neutralization
- pH effects include strength/concentration context instead of universal cutoffs
- Shampoo choice is based on product purpose and client condition, not fixed schedules
- Pre-service testing is product/service/rule specific
- Regulatory or workplace-safety claims defer to labels, SDS, manufacturer directions, or applicable rules
- Brand-specific disinfectant claims were removed
- Unsupported “BOARD EXAM” labels were removed from runtime flashcards

## Source verification outcomes

Direct Chapter 7 support was confirmed for:
- oil-in-water and water-in-oil emulsions
- surfactant classifications
- water/pH effects
- shampoo categories including dry/powder, balancing, clarifying, color-enhancing, medicated, neutralizing, and sulfate-free
- conditioner categories
- alkanolamines and selected cosmetic-preparation ingredients
- USP terminology
- cosmetic preparations used in barbering

Where the textbook did not support a specific percentage, universal schedule, brand claim, or regulatory requirement, the card was narrowed or rewritten.

## Regression protection

Automated tests now enforce:
- exactly 80 active cards
- 80 unique IDs
- one canonical concept mapping per active card
- no return of the removed chemistry shortcuts
- no universal shampoo schedule
- no universal shampoo pH prescription
- no universal patch-test or product-label checklist claim
- no unverified “BOARD EXAM” labels
- no publisher name in runtime flashcard copy

## Validation note

C7-4 is not considered complete until the current PR head has both Engineering Verification GREEN and a READY Vercel preview deployment.

## C7-4 exit criteria

C7-4 closes only when:
- Engineering Verification is GREEN
- Vercel is GREEN
- all 80 cards remain active and mapped
- flashcard regression tests pass

After that, proceed to C7-5 — Chapter 7 Assessment Hardening.
