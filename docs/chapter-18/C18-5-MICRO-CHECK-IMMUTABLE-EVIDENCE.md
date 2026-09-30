# C18-5 — Micro-Checks + Immutable Evidence Integration

C18-5 adds the Chapter 18 micro-check evidence layer without changing the certified lesson, flashcards, or assessment.

## Inventory

C18-5 creates exactly:

- 7 micro-check groups
- 2 questions per concept family
- 14 total questions
- stable IDs `mcq-18-001` through `mcq-18-014`
- understanding/application/scenario difficulty only
- no recall-only micro-check questions

The questions are separate from the certified 15-question chapter assessment and use a separate `mcq-18-*` namespace.

## Canonical concept coverage

Exactly two questions are bound to each certified Chapter 18 concept family:

1. Hair Analysis & Structure
2. Color Theory & Neutralization
3. Haircolor Product Classes
4. Developers, Lighteners & Toners
5. Consultation & Application Procedures
6. Corrective Color, Gray Coverage & Porosity
7. Service Safety, Contraindications & Chemical Handling

## Runtime placement

Chapter 18 still has one real runtime `htmlContent` shell: `chapter-18-lesson`.

C18-5 does not invent seven fake runtime lesson section IDs. All seven micro-check groups are anchored after that real shell and rendered in canonical concept order.

The semantic 10-section map created in C18-1 remains unchanged and continues to describe the internal instructional coverage of the HTML lesson.

## Immutable first-attempt evidence

C18-5 reuses the existing shared table:

`chapter_micro_check_attempts`

The database contract already provides:

- unique `(user_id, chapter_id, question_id)`
- authenticated `SELECT` and `INSERT`
- no authenticated `UPDATE`
- no authenticated `DELETE`
- same-school staff read policy
- platform-admin read policy

Chapter 18 writes `chapter_id = 'ch-18'`.

If a duplicate submission encounters the database uniqueness constraint, the application restores the existing first-attempt row instead of replacing it.

## Shared evidence conversion

Persisted rows convert to Chapter 18 evidence with:

- `source = 'micro_check'`
- `attemptPhase = 'initial'`
- the certified concept-family ID
- immutable original correctness
- original answer timestamp

Later reassessment evidence uses a different evidence source and attempt phase. It can improve mastery without erasing an original micro-check miss.

## Shared 20% grading path

`calculatePersistedChapter18MicroCheckPercent` computes the percent correct from the immutable persisted first-attempt rows.

`withPersistedChapter18MicroCheckGrade` supplies that result to the existing shared grading input.

The shared weights remain unchanged:

- micro-check: 20%
- flashcards: 10%
- chapter assessment: 40%
- scenario/application: 15%
- remediation/reassessment: 15%

C18-5 does not fabricate scenario or remediation scores that Chapter 18 has not implemented yet.

## Safety boundary

Two micro-checks target the safety concept family and the developer/lightener family includes a product-restriction scenario, but C18-5 does not yet implement Chapter 18 safety escalation.

Safety escalation and targeted remediation are reserved for C18-6 so the risk model can be defined explicitly rather than hidden inside the micro-check component.

## Preserved certified inventory

C18-5 preserves:

- 1 real Chapter 18 runtime lesson shell
- 10 logical lesson sections
- 50 certified flashcards
- 15 certified chapter-assessment questions
- 7 canonical concept families
- 2 safety-critical concept flags
- C18-1 through C18-4 source hardening and mappings

## Certification gate

C18-5 can be GREEN only when:

1. exactly 14 unique micro-check questions exist;
2. exactly two questions bind to each of the seven concepts;
3. no question uses recall difficulty;
4. micro-check prompts are separate from the 15 assessment prompts;
5. duplicate responses cannot overwrite first-attempt evidence;
6. persisted rows convert to initial shared micro-check evidence;
7. persisted correctness feeds the unchanged 20% micro-check grade component;
8. the shared immutable database contract is reused without a Chapter 18 schema fork;
9. ChapterContent loads, restores, renders, and persists Chapter 18 micro-check attempts;
10. C18-1 through C18-4 regression tests remain green;
11. exact-head Engineering Verification succeeds;
12. exact-head Vercel reaches READY.
