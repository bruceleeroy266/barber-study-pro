# C8-4 — Targeted Expansion & Adversarial Audit

## Expansion decision

The hardened 50-card baseline passed its certification gate.

Coverage review justified expansion only for the two remaining thin concept families:

- Microcurrent & High-Frequency Modalities — 2 cards
- Light-Therapy Safety — 1 card

Seven new cards were added:

- fc-8-051 through fc-8-053 → Microcurrent & High-Frequency
- fc-8-054 through fc-8-057 → Light-Therapy Safety

The new deck total is **57 active cards**.

All original 50 IDs remain unchanged and active.

## Post-expansion coverage

- Microcurrent & High-Frequency: **5 cards**
- Light-Therapy Safety: **5 cards**

No additional cards were added to already-dense concept families.

## Adversarial audit checks

The deck is now tested for:

- duplicate fronts
- duplicate backs
- duplicate/missing mappings
- unsafe board-exam certainty
- universal legal/treatment claims
- targeted-expansion difficulty
- concept-specific expansion mapping
- excessive back-side verbosity
- application/safety reasoning signals

## C8-4 closure gate

C8-4 closes only if:

- all 57 active cards are uniquely identified and mapped;
- the original 50 IDs remain intact;
- both formerly thin concept families have at least five cards;
- adversarial flashcard tests pass;
- TypeScript, lint, unit tests, production build, bundle check, and Pilot Onboarding Certification are GREEN;
- exact-head Vercel is READY.
