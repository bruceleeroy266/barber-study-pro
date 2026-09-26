# Chapter 7 Baseline Audit — C7-0

**Chapter:** Basics of Chemistry  
**Status:** C7-0 source baseline and concept architecture started  
**Purpose:** Establish a source-grounded Chapter 7 baseline before grading/mastery implementation and content hardening.

## Source rules

1. The Chapter 7 textbook source is used for subject coverage, terminology, sequence, and learning-objective scope.
2. NIC is used for exam-domain and competency alignment where applicable.
3. ASCYN PRO content must remain original wording. Textbook sentences, explanations, examples, and question wording are not copied into production content.
4. Publisher names are not stored as active runtime provenance. Stable neutral provenance values are used instead.
5. The existing Chapter 7 implementation is treated as material to audit, not as proof of correctness.

## Verified Chapter 7 source structure

The source contains two major instructional blocks:

- Basic chemistry, including organic/inorganic chemistry, matter, properties and changes, oxidation-reduction, mixtures, water, pH, acids/alkalis, and neutralization.
- Cosmetic preparations used in barbering, including shampoos, conditioners, and other professional preparations.

The source exposes eight learning-objective areas. ASCYN PRO rewrites those objectives into original language and maps them to stable concept families.

## NIC alignment

The current NIC Barber Theory Candidate Information Bulletin places **Basic chemistry of products used in barbering** inside Scientific Concepts. Verified competency areas include:

- chemical pH scale
- purpose and effects of products and ingredients
- interactions among chemicals
- chemical reactions, including unsafe exposure outcomes

These are alignment targets, not a license to copy NIC question wording.

## Existing Chapter 7 implementation baseline

Active assets already exist and are salvageable, including a premium quiz and flashcard deck. The prior enhancement report claims production readiness, but that conclusion predates the Chapters 4–6 mastery architecture and therefore is not sufficient for Chapter 7 certification.

### Known risks requiring re-audit

- The current quiz is heavily definition/recall oriented in places and must be reclassified by concept and difficulty before it can support mastery detection.
- Existing content contains broad or absolute chemistry statements that must be checked against the source before reuse.
- Existing safety/product claims must be separated into textbook-supported subject matter, official exam-guide alignment, and ASCYN original application material.
- Flashcard completion cannot be allowed to dominate mastery.
- No Chapter 7 concept-confidence model currently proves that one or two correct answers are enough for a stable mastery conclusion.

## Canonical Chapter 7 concept families

| ID | Concept family | Primary scope |
|---|---|---|
| `ch7-organic-inorganic` | Organic & Inorganic Chemistry | Core distinctions and professional product relevance |
| `ch7-matter-structure` | Matter, Elements, Atoms, Molecules & Compounds | Matter and basic chemical structure |
| `ch7-properties-changes` | Physical & Chemical Properties and Changes | Physical/chemical properties, states, and changes |
| `ch7-redox-reactions` | Oxidation-Reduction & Chemical Reactions | Redox and service-relevant reactions |
| `ch7-mixtures` | Solutions, Suspensions & Emulsions | Mixture types and product behavior |
| `ch7-water-ph` | Water, pH, Acids, Alkalis & Neutralization | Water chemistry, pH, acid/alkali reasoning |
| `ch7-shampoos` | Shampoo Chemistry & Selection | Shampoo chemistry, categories, and selection |
| `ch7-conditioners` | Conditioner Chemistry & Selection | Conditioner classifications and selection |
| `ch7-other-preparations` | Other Cosmetic Preparations | Other professional cosmetic preparations |
| `ch7-chemical-safety` | Chemical Safety, Labels & Interactions | Cross-cutting safety, labels, interactions, and exposure risk |

## Grading/mastery constraints carried into C7-1

- Completion, mastery, and application remain separate signals.
- Chapter assessment remains the heaviest ordinary grade component.
- Flashcards remain a low-weight evidence source.
- Scenario/application evidence is tracked distinctly from ordinary recall.
- Remediation is conditional recovery evidence, not a mandatory penalty bucket for students who did not need remediation.
- First-attempt evidence is preserved after remediation.
- High confidence requires multiple observations across meaningful evidence types.
- Recent improvement can raise confidence and mastery without erasing the historical weakness.
- No single correct answer can establish Strong mastery.
- The same evidence set must always produce the same deterministic result.

## C7-1 entry criteria

C7-0 is ready to move into C7-1 once the registry compiles and CI is green. C7-1 will define the grading/evidence schema and deterministic calculation rules before Chapter 7 question hardening begins.

## C7-0 disposition

**GO to C7-1 after engineering verification.**
