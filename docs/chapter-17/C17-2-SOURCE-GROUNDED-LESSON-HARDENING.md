# C17-2 — Source-Grounded Lesson Hardening

C17-2 hardens the existing 24-section Chapter 17 lesson without changing the certified C17-1 architecture.

## Source boundary

The repository does not currently contain a `textbook-images/chapter-17` source folder, so C17-2 does **not** claim page-by-page textbook verification.

The hardening pass uses:

- the current Chapter 17 lesson, competency, learning-objective, and remediation traceability already present in the repository;
- the C17-1 canonical concept architecture;
- conservative manufacturer-instruction boundaries for timing, product strength, application, rinsing, neutralizing, and compatibility;
- independent chemistry/safety cross-checks for the distinction between thioglycolate reduction/oxidation and hydroxide lanthionization, the incompatibility of hydroxide- and thioglycolate-treated hair, and the need to follow product directions.

No textbook prose is copied.

## Major chemistry repair

The previous lesson incorrectly stated that permanent waves, chemical relaxers, and curl reformation all use one identical:

`reduce → reshape → oxidize`

cycle.

C17-2 now distinguishes:

- **thio/permanent-wave systems** — reducing chemistry breaks disulfide bonds, hair is reshaped, and compatible oxidation/neutralization helps reform bonds;
- **hydroxide relaxers** — highly alkaline chemistry alters sulfur-containing bonds through **lanthionization** and is not completed with the same oxidizing-neutralizer cycle.

The R-R-O mnemonic is now explicitly limited to thio/permanent-wave chemistry.

## Manufacturer-dependent claims hardened

Removed or narrowed:

- fixed alkaline-wave pH range
- fixed true-acid-wave pH range
- blanket claim that acid waves usually require heat
- fixed “at least three areas” test-curl rule
- blanket product-strength advice based on hair diameter alone
- generic “weaker acid perm / shorter processing” prescription
- universal relaxer application order
- treating all relaxer post-service steps as one neutralization process
- defining texturizers only by processing time

The lesson now directs timing, heat use, application, processing, rinsing, neutralizing/pH-restoring steps, and product compatibility to the specific manufacturer system plus the hair analysis.

## Safety and compatibility hardening

C17-2 now:

- treats hydroxide and thioglycolate histories as chemically incompatible on the same treated hair unless verified product-system guidance explicitly supports the planned service;
- states that a strand test does not override a known incompatibility or manufacturer prohibition;
- requires stopping/removing product according to safety directions when burning, pain, or another concerning reaction occurs;
- avoids applying chemical services over visibly irritated, abraded, open, or otherwise compromised scalp tissue;
- removes diagnostic medical wording and does not claim specific medication effects;
- refers medical questions appropriately.

## Exam-certainty hardening

Student-facing wording was changed from:

- “the board expects”
- “Board Ready”
- “Board Alerts”

to neutral professional-study language.

Internal legacy fields such as `boardQuestionIds` remain unchanged because they are traceability metadata, not student-facing claims that a current licensing exam will test a particular item.

## Preserved C17-1 invariants

C17-2 preserves:

- 24 / 24 lesson sections
- 60 / 60 flashcards
- 30 / 30 chapter-assessment questions
- 16 / 16 existing learning questions
- seven canonical concept families
- C17-1 mappings
- shared 20/10/40/15/15 grading/evidence architecture

Only the Chapter 17 lesson wording is hardened in this phase.

## Certification gate

C17-2 can be certified GREEN only when:

1. the lesson-hardening certification test passes;
2. the exact branch head passes full Engineering Verification;
3. the matching exact-head Vercel preview succeeds.

Flashcards and assessment content remain unchanged until their later hardening phases.
