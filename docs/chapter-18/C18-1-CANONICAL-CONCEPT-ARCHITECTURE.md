# C18-1 — Canonical Concept Architecture + Shared Grading/Evidence Binding

## Scope

C18-1 is architecture-only. It preserves the existing Chapter 18 educational content exactly as inherited:

- 1 runtime HTML lesson shell containing 10 logical instructional sections
- 50 flashcards
- 15 chapter-assessment questions
- no new learning-question bank
- no micro-check questions yet
- no reassessment reserve yet
- no safety-escalation behavior yet

C18-2 will independently source-harden inherited chemical, safety, manufacturer, timing, regulatory, and certainty wording.

## Canonical concept families

1. Hair Analysis & Structure
2. Color Theory & Neutralization
3. Haircolor Product Classes
4. Developers, Lighteners & Toners
5. Consultation & Application Procedures
6. Corrective Color, Gray Coverage & Porosity
7. Service Safety, Contraindications & Chemical Handling

The concept families are derived from the actual Chapter 18 lesson and existing flashcard/assessment inventory, not copied from Chapter 17.

## Safety-critical architecture flags

C18-1 flags two concept families as safety-critical:

- Developers, Lighteners & Toners
- Service Safety, Contraindications & Chemical Handling

The current content associates these areas with peroxide/developer handling, lightener overlap and overprocessing, allergy/predisposition testing, scalp/skin contraindications, metallic/compound dye compatibility, PPE, storage/handling, and facial-hair product restrictions.

These flags identify where later safety architecture must focus; they do not certify the exact inherited safety claims. C18-2 must source-ground those claims before C18-6 defines escalation logic.

## Mapping decisions

### Lesson

The runtime lesson remains one `htmlContent` block with id `chapter-18-lesson`. C18-1 does not invent fake runtime section IDs. Instead, `chapter18LessonSectionConceptMappings` records the 10 logical instructional sections and their concept coverage.

The one runtime shell is registered with the shared activity-evidence architecture through `chapter18ContentConceptMappings`.

### Flashcards

All 50 stable `fc-ch18-*` IDs are preserved and mapped exactly once. Existing category labels are used as the default mapping source, with safety-bearing cards explicitly assigned to the safety family when their content is primarily harm-prevention.

### Assessment

All 15 stable `qq-18-*` IDs are preserved and mapped exactly once. No question, answer key, distractor, explanation, or wording is changed in C18-1.

## Shared grading/evidence binding

Chapter 18 delegates to the same shared grading/mastery implementation used by hardened chapters:

- 20% micro-check
- 10% flashcard
- 40% chapter assessment
- 15% scenario/application
- 15% remediation/reassessment

C18-1 adds Chapter 18 flashcard/content mappings to the shared activity-evidence registry. Because the current Chapter 18 lesson contains no runtime `scenarioBlock` or `proScenario`, C18-1 correctly reports an empty scenario inventory rather than fabricating scenario evidence.

Later phases will add the currently missing evidence sources instead of treating absent components as completed work.
