# C16-6 — Gap Detection + Safety Escalation

**Base:** C16-5 certified head `fa91b1c024dca37b7239f206bf273e46b391aa5b`

## Gap detection

Chapter 16 now binds its 30-question assessment to the shared concept-detection engine and registers `ch-16` in the shared chapter detection registry.

Combined preserved evidence from micro-checks, flashcards, chapter assessment, and scenario/application sources can be deduplicated and evaluated by canonical concept family.

An ordinary concept gap is identified when either:

- there are at least two observations and mastery is 70% or lower; or
- there are at least two preserved initial misses.

C16-6 detects and prioritizes gaps only. Targeted remediation content delivery remains C16-7.

## Narrow safety scope

Chapter 16 safety escalation is intentionally restricted to two high-risk hazard classes:

1. `razor_tool_suitability`
2. `thermal_heat_client_protection`

Tagged evidence items:

- `mcq-16-013`
- `qq-16-022`
- `mcq-16-015`
- `qq-16-027`

Ordinary design, elevation, layering, curl-behavior, and styling-result misses are not safety escalations.

## Escalation behavior

- one tagged miss → immediate targeted safety review + instructor-review flag;
- repeated misses inside only one hazard → review remains active;
- recent misses spanning both distinct hazards → urgent intervention;
- urgent intervention → future formal safety reassessment is five questions at 100%;
- ordinary concepts retain the 80% recovery threshold.

C16-6 does not create reassessment questions. That reserve is implemented later.

## Preserved history

Combined evidence deduplicates by student, chapter, source, attempt phase, and item ID. Original first-attempt misses are never rewritten by gap detection or safety escalation.

## Preserved architecture

- 11 instructional sections
- 93 lesson blocks
- 68 flashcards
- 30 assessment questions
- 8 micro-check placements
- 16 immutable micro-check questions
- 8 canonical concepts
- shared 20/10/40/15/15 grading unchanged

C16-6 is not formally GREEN until exact-head Engineering Verification and Vercel both pass.
