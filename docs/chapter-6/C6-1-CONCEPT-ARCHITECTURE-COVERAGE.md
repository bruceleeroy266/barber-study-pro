# Chapter 6 C6-1 Coverage Report

## Canonical architecture

Chapter 6 now has 10 stable concept families and 10 learning objectives. The mapping layer covers the ten primary lesson blocks, all 105 existing enhanced flashcards by stable positional ID, and all 50 premium quiz questions.

## Current evidence distribution

| Concept | Flashcards | Quiz questions | Diagnostic readiness |
|---|---:|---:|---|
| Cells, Tissues & Basic Physiology | 15 | 12 | Ready by count |
| Body Systems Overview | 0 | 2 | Strengthen |
| Skeletal System | 20 | 5 | Ready by count |
| Muscular System | 25 | 5 | Ready by count |
| Nervous System | 20 | 5 | Ready by count |
| Cardiovascular System | 15 | 4 | Ready by count |
| Lymphatic & Immune System | 4 | 3 | Ready by count |
| Integumentary System | 2 | 11 | Flashcards weak |
| Endocrine System | 4 | 1 | Quiz weak |
| Respiratory, Digestive, Urinary & Reproductive | 0 | 2 | Strengthen |

The C6-1 minimum diagnostic evidence rule is **3 independent quiz questions per concept**. This is an architecture gate, not a claim that three questions alone prove mastery.

## Exposed strengthening work before content rewrite

### Quiz bank
- Add at least 1 independent Body Systems Overview question.
- Add at least 2 independent Endocrine questions.
- Add at least 1 independent Other Systems question.
- Prefer replacing low-value/duplicative questions when possible rather than growing the bank without control.
- Preserve the 50-question target unless C6-3 deliberately changes the specification.
- Rebalance application/recognition/recall after factual corrections.

### Flashcard deck
- Body Systems Overview currently has no dedicated card.
- Other Systems currently has no dedicated card.
- Integumentary has only 2 dedicated cards despite 11 quiz questions.
- Endocrine and Lymphatic have only 4 cards each.
- Cells, skeletal, muscular, nervous, and cardiovascular are comparatively overrepresented.

## Important normalization note

The 105-card enhanced source does not contain stable card IDs. C6-1 assigns `fc-6-001` through `fc-6-105` according to the canonical `chapter6AllEnhanced` concatenation order. The integrity test locks the count and mapping. C6-2/C6-3 should convert the retained/corrected cards into the normal premium `Flashcard` structure with explicit IDs so future reordering cannot change identity.

## Gates now enforced by tests

- exactly 10 canonical families/objectives
- bidirectional objective/family validity
- all 10 canonical lesson blocks exist and map to a family
- exactly 105 existing enhanced cards mapped
- exactly 50 served quiz questions mapped
- no duplicate mapping IDs
- unknown IDs fail closed
- known evidence gaps are explicitly asserted so they cannot disappear silently

## C6-1 disposition

**Architecture complete. Assessment strengthening is intentionally exposed, not hidden.** Content accuracy corrections and evidence rebalancing should occur in the next content/assessment phases before Chapter 6 detection/remediation is enabled.
