# C17-3 — Flashcard Source-Grounding & Concept Certification

C17-3 independently audits and hardens the existing 60-card Chapter 17 flashcard deck against the certified C17-2 lesson while preserving the C17-1 architecture.

## Source boundary

The repository still does not contain a `textbook-images/chapter-17` source folder, so C17-3 does **not** claim page-by-page textbook verification.

The governing baseline is:

- the hardened C17-2 Chapter 17 lesson;
- the existing Chapter 17 competency and learning-objective traceability;
- the C17-1 canonical concept mappings;
- conservative manufacturer-direction boundaries for chemical timing, strength, heat, compatibility, rinsing, and finishing;
- independent chemistry/safety cross-checks already reflected in the C17-2 lesson.

No textbook prose is copied.

## Locked inventory

C17-3 preserves:

- 60 / 60 flashcard IDs `fc-ch17-001` through `fc-ch17-060`
- original order indices
- `chapter_id: ch-17`
- competency IDs
- C17-1 flashcard-to-concept mappings
- 24 lesson sections
- 30 chapter-assessment questions
- 16 existing learning questions
- seven canonical concept families
- shared 20/10/40/15/15 grading/evidence architecture

## Chemistry hardening

The deck no longer teaches all chemical texture services as one identical reduction/oxidation process.

Repairs include:

- limiting reduction/oxidation explanations to thio/permanent-wave systems;
- stating that hydroxide relaxers use different chemistry and lanthionization;
- separating thio oxidizing neutralization from hydroxide post-service finishing;
- removing blanket claims that thio relaxers are automatically compatible with thio perms.

## Manufacturer-dependent claims hardened

Removed or narrowed:

- fixed alkaline-wave pH range
- fixed true-acid-wave pH range
- blanket heat requirement for acid waves
- generic stronger-solution / longer-processing advice for resistant hair
- generic processing-time explanations not tied to product directions
- universal 48-hour shampoo/aftercare rule
- automatic “milder acid perm” prescription for highlighted hair
- fixed rod-placement angle/tension certainty where the hardened lesson uses method-dependent language

Timing, heat, product strength, application, aftercare, and compatibility now defer to the selected system, complete hair analysis, and manufacturer directions.

## Compatibility and safety hardening

C17-3 now:

- treats hydroxide-treated hair and planned thio services as incompatible unless verified product-system guidance explicitly supports the service;
- states that a strand test does not override a known incompatibility;
- removes the incorrect idea that “hydroxide may still be present” months later as the reason for incompatibility;
- postpones service over visibly irritated, abraded, open, or otherwise compromised scalp tissue;
- removes unsupported medication-effect claims and refers medical questions appropriately;
- frames chemical-injury risk without diagnosing infection or disease.

## Texturizer / chemical blowout hardening

The deck no longer defines texturizers or chemical blowouts only by:

- a “mild” formula,
- a weaker formula,
- shorter processing time.

The cards instead teach the intended service outcome and require product-system-specific chemistry and processing guidance.

## Exam-certainty hardening

The first 38 cards were previously labeled `Board Essential`.

C17-3 changes that student-facing category to `Core Knowledge`, preserving all IDs and mappings while removing an unsupported claim that those exact items are guaranteed licensing-exam content.

## Certification gate

C17-3 is GREEN only after:

1. all 60 IDs and mappings remain exact;
2. the flashcard-hardening certification test passes;
3. full exact-head Engineering Verification passes;
4. the matching exact-head Vercel preview succeeds.

The 30-question assessment and 16 existing learning questions remain untouched in C17-3.
