# MC-R1A — Micro-Check Randomization & Grading Contract

**Status:** Planning contract only  
**Scope:** Chapters 1–21 micro-check system  
**Bank edits:** PROHIBITED in MC-R1A  
**Production behavior changes:** PROHIBITED in MC-R1A  
**Base production commit:** `aec58df1f2f46fa97bde1d89cc8aaee8f742510c`

## 1. Purpose

MC-R1A defines the rules for making ASCYN PRO micro-checks resistant to answer-position memorization while preserving existing grading, evidence, TLS, remediation, instructor diagnostics, and chapter mappings.

The intended student behavior is:

1. Read the question.
2. Evaluate four plausible choices.
3. Select the answer because of content knowledge.
4. Receive feedback only after submission.
5. If incorrect, receive a concept-level hint.
6. Re-evaluate the same concept without being handed the answer.

The system must not reward memorizing that a correct answer is usually A, B, C, or D.

## 2. Stable Answer Identity

Every answer choice must have a stable internal identity that does not depend on display position.

The canonical question bank may continue storing source choices as:

- `answer_a`
- `answer_b`
- `answer_c`
- `answer_d`
- `correctAnswer`

However, display rendering must transform those source choices into answer objects before presentation.

Required conceptual model:

```ts
type MicroCheckChoice = {
  sourceKey: 'a' | 'b' | 'c' | 'd'
  text: string
}

type DisplayedMicroCheckChoice = MicroCheckChoice & {
  displayIndex: number
}
```

The student's response must be evaluated against `sourceKey`, never against the visible index or visible letter.

### Non-negotiable grading rule

A correct answer remains correct regardless of whether it is displayed first, second, third, or fourth.

## 3. Randomization Rule

For every eligible micro-check question:

- Shuffle all four answer choices when the question attempt is initialized.
- Shuffle independently per question.
- Use the shuffled order consistently for the full life of that attempt.
- Do not reshuffle while the student is actively answering.
- Do not reshuffle immediately after a selection.
- A new attempt may receive a different order.

The UI may relabel the displayed choices A/B/C/D after shuffling, but those labels are presentation-only.

## 4. Attempt Stability

Once an attempt begins, the answer order must remain stable across:

- selection changes before submission;
- temporary UI rerenders;
- scrolling;
- validation messages;
- feedback rendering;
- local component state changes.

If an attempt is intentionally persisted across navigation or refresh, the shuffle seed/order must also be persisted for that attempt. If micro-check attempts are not currently resumable, MC-R1A does not require adding persistence.

## 5. Randomization Quality

The implementation must not use a deterministic fixed rotation such as:

- A→B→C→D by question number;
- chapter-number-based rotation;
- alternating patterns;
- always moving the correct answer away from its source slot in a predictable way.

The implementation must produce a true permutation of the four choices.

Acceptance tests must confirm that:

- every source choice appears in every display position across repeated deterministic test seeds;
- the correct answer can appear in positions 1–4;
- no choice is duplicated or dropped;
- the source question object is not mutated.

## 6. Grading Preservation

MC-R1 randomization must not change:

- question IDs;
- concept family IDs;
- learning objective IDs;
- difficulty labels;
- chapter IDs;
- attempt phase;
- evidence source `micro_check`;
- correctness semantics;
- grading weights;
- chapter percentages;
- readiness/TLS inputs;
- remediation triggers;
- reassessment behavior;
- instructor diagnostics.

Existing evidence builders may continue comparing:

```ts
response.selectedAnswer === question.correctAnswer
```

provided `selectedAnswer` is the stable source key, not the displayed slot.

## 7. Response Contract

The submitted response must identify the original answer identity.

Approved conceptual response:

```ts
{
  questionId: 'mcq-...',
  selectedAnswer: 'c'
}
```

where `'c'` means the canonical source choice `answer_c`, even if it was displayed as visible option A.

Disallowed response:

```ts
{
  questionId: 'mcq-...',
  selectedIndex: 0
}
```

unless the runtime converts that display index back to the stable source key before any grading/evidence call.

## 8. Feedback Rule

Before submission:

- do not indicate correctness;
- do not visually favor the correct answer;
- do not expose explanation text;
- do not expose source answer letters.

After submission:

### Correct
Show:
- confirmation;
- concise explanation reinforcing why the answer is correct.

### Incorrect
Show:
- that the response was incorrect;
- a short concept-level hint;
- no automatic disclosure of the correct answer before the re-evaluation step if the student is expected to retry.

The hint should direct attention back to the governing principle, sequence, safety rule, distinction, or scenario fact.

## 9. Hint Contract

Hints must:

- teach the concept, not reveal the answer;
- avoid naming the correct choice;
- avoid saying "look for the longest answer";
- avoid positional language such as "choice B";
- be concise;
- be tied to the tested concept.

Good hint:
> Think about which step actually removes or destroys the hazard rather than only making the surface look clean.

Bad hint:
> The correct answer is the one about disinfection.

MC-R1A defines hint behavior only. It does not require editing all 330 questions yet.

## 10. Re-Evaluation Contract

Preferred learning sequence after an incorrect first attempt:

1. Record the initial response normally.
2. Show a concept-level hint.
3. Require a re-evaluation.
4. Prefer a parallel question/scenario testing the same concept when such an item exists.
5. Otherwise permit the original question with a newly shuffled answer order only after the original attempt is complete.
6. Keep first-attempt evidence separate from retry/re-evaluation evidence.

A retry must never overwrite the original incorrect evidence.

## 11. Evidence Integrity

Initial and re-evaluation evidence must remain distinguishable.

Minimum invariant:

- first response stays `attemptPhase: 'initial'`;
- retry/remediation evidence must use the existing remediation/reassessment evidence architecture rather than rewriting the original record.

MC-R1A must not invent a second grading system.

## 12. Question Quality Standard for Later MC-R1B+

Future question-bank hardening must use these distractor standards:

Every incorrect answer should be:

- plausible to a partially trained student;
- in the same conceptual neighborhood as the correct answer;
- grammatically parallel;
- similar in specificity and professional tone;
- clearly wrong for a definable reason.

Distractors should preferably represent:

- a common misconception;
- a correct step used at the wrong time;
- an incomplete procedure;
- a nearby concept confused with the target concept;
- a technically plausible action missing a required condition;
- a safety/compliance choice that is close but insufficient.

Avoid:

- joke answers;
- obviously reckless answers unless the concept specifically tests recognizing that hazard;
- wildly unrelated choices;
- one extremely long correct answer surrounded by short distractors;
- absolute cue words used only in wrong answers;
- repeated correct-answer phrasing from the lesson;
- grammatical cues that reveal the answer.

## 13. Positional/Composite Answer Exceptions

The following item types are not automatically safe to shuffle:

- "All of the above"
- "None of the above"
- "Both A and C"
- "Choices 1 and 3"
- answers referring to "the previous option";
- ordered sequence answers whose meaning depends on displayed position.

Such questions must be flagged during the bank audit.

Preferred remedy:
- rewrite them into self-contained choices.

Only when rewriting would reduce instructional quality may an item be explicitly marked non-shufflable.

## 14. Accessibility

Randomization must not harm accessibility.

Requirements:

- screen readers announce displayed choices in their actual visual order;
- labels must match visible ordering;
- keyboard navigation follows visible ordering;
- focus must not jump because of reshuffling;
- feedback must be announced accessibly;
- hints must be associated with the relevant question.

## 15. Security / Integrity

Clients must not receive unnecessary hidden fields that make the correct answer trivially discoverable before submission.

If current architecture requires the correct source key client-side, MC-R1 implementation must explicitly audit whether that exposure can be reduced without breaking existing chapter behavior.

At minimum:

- do not render correct-answer metadata into visible DOM attributes;
- do not expose "correct" CSS/data markers before submission;
- never infer correctness from display position.

## 16. Analytics & Instructor Reporting

Instructor-facing evidence must continue reporting the same question IDs and concept mappings regardless of shuffle order.

Display position is not educational evidence and must not affect:

- gap detection;
- risk/status classification;
- chapter mastery;
- instructor diagnostics;
- TLS status;
- recommended actions.

Optional future analytics may track display-position bias globally, but that is outside MC-R1A.

## 17. Deterministic Testing

Production may use runtime randomness, but tests must use deterministic shuffling.

The shuffle utility must support injection of a deterministic RNG or seedable equivalent so regression tests can prove all ordering behaviors reliably.

Do not write flaky tests that depend on `Math.random()` producing a certain order.

## 18. Cross-Chapter Compatibility

The final implementation must support all Chapter 1–21 micro-check banks without requiring 21 separate randomization algorithms.

One shared randomization contract should be reusable by every chapter.

Chapter-specific bank content remains chapter-owned.

## 19. MC-R1A Protected Boundaries

MC-R1A must not change:

- any of the 330 micro-check questions;
- any answer text;
- any correct-answer key;
- chapter scoring;
- TLS;
- reassessment;
- remediation thresholds;
- attendance/hours;
- Communications;
- Exam Ready;
- instructor/admin reporting logic.

This slice is contract/documentation only.

## 20. Required Next Slices

After MC-R1A is certified:

### MC-R1B — Shared Randomization Runtime
Implement the shared stable-identity shuffle utility and adapt one isolated test harness without editing question content.

### MC-R1C — Cross-Chapter Runtime Integration
Connect Chapters 1–21 to the shared shuffle behavior while preserving all grading/evidence contracts.

### MC-R1D — Question Quality Audit
Audit all 330 micro-check questions for weak distractors, positional/composite choices, wording clues, and difficulty.

### MC-R1E — Distractor Hardening
Rewrite only flagged weak questions. Preserve IDs, concept mappings, intended correct concepts, and grading semantics.

### MC-R1F — Hint & Re-Evaluation
Add concept-level hint and retry/re-evaluation behavior using existing evidence architecture.

### MC-R1G — Final Cross-Chapter Adversarial Certification
Prove randomization, grading parity, evidence integrity, TLS parity, remediation behavior, accessibility, and question-quality standards across Chapters 1–21.

## 21. MC-R1A Acceptance Criteria

MC-R1A is GREEN only when the contract explicitly proves that the future implementation will:

- randomize eligible answer display order;
- preserve stable answer identity;
- grade independently of display position;
- keep order stable during an attempt;
- preserve existing evidence and percentages;
- keep original incorrect evidence immutable;
- support concept-level hints without answer leakage;
- identify positional/composite exceptions;
- protect accessibility;
- avoid flaky randomization tests;
- use one shared cross-chapter runtime;
- make no question-bank or production behavior changes in this planning slice.
