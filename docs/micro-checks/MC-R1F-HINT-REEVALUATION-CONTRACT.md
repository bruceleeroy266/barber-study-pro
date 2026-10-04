# MC-R1F — Hint + Re-Evaluation Contract

**Status:** Planning contract only  
**Scope:** Chapters 1–21 micro-check system  
**Question-bank edits:** PROHIBITED in this contract slice  
**Production behavior changes:** PROHIBITED in this contract slice  
**Base production commit:** `d062038b50f14ef944dea45a9bf0d982bcbd134c`

## 1. Purpose

MC-R1F defines the learning contract that follows an incorrect micro-check response.

The intended student sequence is:

1. First attempt is presented with randomized choices and **no hint**.
2. Student submits one answer.
3. The first attempt is recorded immutably as `attemptPhase: 'initial'`.
4. If correct, the student receives concise confirmation/explanation and the item is complete.
5. If incorrect, the system says the response was incorrect **without revealing the correct answer**.
6. A concise **concept-level hint** is shown.
7. The student re-evaluates the **same concept**.
8. The re-evaluation is recorded separately as `attemptPhase: 'remediation'`.
9. The remediation record never overwrites, replaces, or changes the initial record.
10. Formal later reassessment, if invoked by existing remediation architecture, remains `attemptPhase: 'reassessment'` and is outside the immediate hint retry.

The goal is retrieval + correction, not answer disclosure.

## 2. Non-Negotiable First-Attempt Rule

Before the first submission:

- no hint is visible;
- no explanation is visible;
- no answer is marked correct or incorrect;
- no correct source key is exposed in visible UI;
- no option receives styling that implies correctness;
- randomized display order remains stable for that attempt.

The first submitted answer is the **only** response that counts as the ordinary micro-check first-attempt result.

A student must not be able to erase a miss by answering correctly after seeing a hint.

## 3. Initial Evidence Contract

The first submitted response must continue to produce ordinary micro-check evidence:

```ts
{
  source: 'micro_check',
  itemId: 'mcq-...',
  correct: boolean,
  attemptPhase: 'initial'
}
```

Existing question ID, chapter ID, concept family, learning objective mapping, difficulty, and timestamp semantics remain unchanged.

### Initial evidence is immutable

After submission, the initial record must never be:

- overwritten;
- converted from false to true;
- deleted because remediation succeeded;
- replaced with the retry answer;
- recomputed from a later selection;
- hidden from instructor/TLS evidence.

## 4. Correct First Attempt

If the first response is correct:

- lock the submitted attempt;
- show concise positive confirmation;
- show the existing explanation or a concise equivalent;
- do not require remediation;
- do not create a remediation evidence record;
- do not offer a second attempt merely to improve the score.

Correct-first-attempt behavior should remain fast and low-friction.

## 5. Incorrect First Attempt

If the first response is incorrect:

The UI may say:

> Not quite. Use this hint and try the concept again.

It must **not**:

- reveal the correct option;
- identify the source key;
- say which visible letter is correct;
- visually highlight the correct choice;
- expose the full explanation before re-evaluation;
- eliminate choices in a way that reveals the answer;
- turn the hint into a disguised answer.

The original selected answer may remain visibly identifiable as the student's submitted response, but the correct answer must remain undisclosed until the re-evaluation step is complete.

## 6. Hint Contract

Every hint must teach the governing concept without giving away the answer.

A valid hint should redirect attention to one or more of:

- the governing principle;
- the required sequence;
- the difference between two nearby concepts;
- the safety/compliance rule;
- the most important scenario fact;
- the condition that makes one procedure appropriate;
- the scope boundary;
- the cause/effect relationship being tested.

Hints must be:

- concise;
- concept-specific;
- professionally worded;
- answer-position neutral;
- source-key neutral;
- useful even if answer order changes;
- understandable without revealing the correct wording.

Hints must not:

- quote the correct answer closely enough to identify it;
- name the correct answer choice;
- say “choose the longest/most detailed answer”;
- mention A/B/C/D or first/second/third/fourth;
- eliminate three choices;
- use wording copied uniquely from the correct choice;
- reveal hidden grading metadata.

## 7. Hint Source Strategy

MC-R1F implementation should use one shared hint-resolution contract across Chapters 1–21.

Preferred resolution order:

1. Question-specific concept hint, when explicitly authored.
2. Concept-family hint reusable across questions testing the same principle.
3. Safe generated fallback from existing question explanation only when it can be transformed without answer leakage.

A fallback must never simply display the existing explanation if that explanation directly names the correct answer.

If a safe hint cannot be resolved, the runtime must fail closed by using a neutral concept prompt such as:

> Review the key rule for this concept and compare each option against that rule.

The absence of a perfect hint must not cause answer disclosure.

## 8. Re-Evaluation Target

After a miss, the student must re-evaluate the **same concept family**.

Preferred target order:

1. A parallel micro-check item in the same concept family that tests the same principle through a different scenario.
2. A parallel item in the same concept family at equal or greater cognitive difficulty.
3. If no appropriate parallel item exists, retry the original item after the initial attempt is complete.

The system must not redirect the student to an unrelated concept merely because another question is available.

## 9. Original-Item Retry Rule

If the original question is reused for remediation:

- the initial attempt must already be locked and recorded;
- the correct answer must still not be revealed before the retry;
- answer display order may be newly randomized for the remediation attempt;
- the randomized order must remain stable during that remediation attempt;
- the student's original incorrect selection must not remain preselected;
- grading still uses canonical source keys, never display position.

Re-randomization is permitted because remediation is a new attempt, but it must not alter the original evidence record.

## 10. Parallel-Item Rule

If a parallel item is used:

- it must map to the same concept family;
- it should test the same governing principle;
- it must preserve the same safety/professional standard;
- it should not be materially easier merely because remediation has started;
- it may use a different scenario or wording;
- it must have its own stable question ID.

A parallel item is preferred when it tests transfer of knowledge rather than recognition of the original wording.

## 11. Remediation Evidence Contract

The immediate hint-driven re-evaluation must use the existing evidence architecture:

```ts
{
  source: 'micro_check',
  itemId: 'mcq-...',
  correct: boolean,
  attemptPhase: 'remediation'
}
```

This is intentionally different from `attemptPhase: 'reassessment'`.

### Why remediation

The existing shared grading model already distinguishes:

- `initial`
- `remediation`
- `reassessment`

The immediate hint retry is instructional correction directly following a miss, so it belongs to `remediation`.

Formal reassessment remains reserved for later evidence produced by the existing remediation/reassessment flow.

MC-R1F must not invent a fourth attempt phase.

## 12. Evidence Separation

For a student who answers incorrectly first and correctly after a hint, evidence should conceptually look like:

```ts
[
  {
    source: 'micro_check',
    itemId: 'mcq-...',
    correct: false,
    attemptPhase: 'initial'
  },
  {
    source: 'micro_check',
    itemId: 'mcq-...',
    correct: true,
    attemptPhase: 'remediation'
  }
]
```

Both records are legitimate observations.

The remediation success demonstrates learning after support; it does not retroactively convert the initial miss into a first-attempt success.

## 13. Grade Integrity

MC-R1F must preserve the meaning of the existing micro-check percentage.

The ordinary micro-check score must remain based on **initial attempts only**, unless existing production grading explicitly defines otherwise.

Immediate hint-driven remediation must not:

- raise the original micro-check percentage as if the student answered correctly first;
- replace an initial miss in chapter reporting;
- change existing component weights;
- alter the 20% micro-check grade weight;
- create bonus points;
- double-count a question in the ordinary first-attempt percentage.

Remediation evidence may influence existing concept mastery/TLS according to the shared evidence weighting model, because the shared model already weights `remediation` separately from `initial`.

MC-R1F must not modify those weights.

## 14. Reassessment Integrity

MC-R1F must keep immediate re-evaluation distinct from formal reassessment.

Immediate re-evaluation:
- follows directly after a miss;
- is hint-supported;
- uses `attemptPhase: 'remediation'`;
- remains part of the learning loop.

Formal reassessment:
- occurs through the existing remediation/reassessment architecture;
- may be separated in time or workflow;
- uses `attemptPhase: 'reassessment'` where already defined;
- must not be silently created merely because a student retried one micro-check.

## 15. Attempt Limits

Default MC-R1F behavior is:

- one initial attempt;
- one immediate hint-supported remediation attempt.

The system should not create an unlimited answer-guessing loop.

If the remediation attempt is also incorrect:

- record it as remediation evidence;
- then reveal the concise explanation;
- mark the concept as needing further review/remediation according to existing architecture;
- do not allow repeated rapid guesses solely to discover the answer.

Any later formal practice or reassessment is a separate workflow.

## 16. Explanation Timing

### After correct first attempt
The explanation may be shown immediately.

### After incorrect first attempt
Before remediation:
- show only the concept-level hint;
- do not show the answer-revealing explanation.

### After remediation attempt completes
The explanation may be shown regardless of whether remediation was correct or incorrect.

This preserves the value of the second retrieval attempt.

## 17. UI State Contract

Each question must have clear states:

1. **initial_active**
   - choices enabled
   - no hint
   - no explanation

2. **initial_correct**
   - choices locked
   - correct feedback/explanation visible
   - no remediation required

3. **initial_incorrect_hint**
   - initial answer locked/recorded
   - correct answer undisclosed
   - concept hint visible
   - re-evaluation action available

4. **remediation_active**
   - new stable randomized choice order for that attempt
   - no preselected answer
   - hint remains available
   - correct answer still undisclosed

5. **remediation_complete**
   - remediation evidence recorded
   - explanation available
   - concept outcome communicated without rewriting initial score

State transitions must be one-way for the submitted initial attempt.

## 18. Accessibility

Hints and remediation must remain accessible.

Requirements:

- incorrect feedback is announced without relying on color alone;
- the hint is programmatically associated with the relevant question;
- focus moves predictably to the hint/re-evaluation control after an incorrect submission;
- starting remediation must not unexpectedly move focus to an arbitrary choice;
- screen-reader order must match visible choice order;
- correct-answer disclosure after remediation must be announced clearly;
- keyboard-only users must be able to complete the full flow.

## 19. Security / Answer Leakage

Before remediation is completed, the client UI must not expose the correct answer through:

- DOM data attributes;
- CSS classes such as `data-correct`;
- hidden accessibility text;
- pre-rendered explanation content;
- disabled-choice patterns;
- source answer letters;
- predictable display position.

If the current client architecture necessarily contains the source key for grading, MC-R1F must at minimum avoid rendering answer-revealing metadata into user-visible DOM state.

## 20. Persistence / Navigation

MC-R1F must not silently erase an already submitted initial attempt because of rerendering or navigation.

If micro-check attempts are currently session-local, this slice does not require full cross-device persistence.

However, within the active runtime:

- an initial submitted answer must stay locked;
- hint state must not reset into a fresh unrecorded initial attempt;
- remediation must not masquerade as a brand-new initial attempt;
- duplicate submits must not create duplicate evidence.

## 21. Duplicate Evidence Protection

The existing evidence architecture commonly deduplicates by a composite including attempt phase and item ID.

MC-R1F implementation must preserve the invariant that:

- `initial + itemId` and `remediation + itemId` may coexist;
- duplicate `initial + itemId` records are rejected;
- duplicate `remediation + itemId` records are rejected;
- remediation cannot overwrite initial;
- rapid double-clicking cannot create multiple remediation records.

## 22. Instructor / TLS Semantics

Instructor and TLS consumers must be able to distinguish:

- knew it on first attempt;
- learned it after a hint;
- still missed it after remediation.

MC-R1F must not collapse those three states into a single final boolean.

At minimum:

- initial miss remains visible in evidence;
- remediation success remains visible as recovery after support;
- remediation miss remains visible as continued weakness.

Existing TLS status rules and mastery weights remain unchanged in MC-R1F unless a later explicitly authorized slice changes them.

## 23. Protected Boundaries

MC-R1F contract work must not change:

- any of the 330 question stems;
- any answer text;
- any `correctAnswer` key;
- MC-R1B randomization algorithm;
- MC-R1C cross-chapter renderer behavior yet;
- MC-R1E hardened distractors;
- chapter grading weights;
- TLS thresholds;
- remediation/reassessment weights;
- attendance/hours;
- Communications;
- Exam Ready;
- instructor/admin report calculations.

This contract slice is documentation only.

## 24. Required Implementation Slices

After this contract is certified:

### MC-R1F.1 — Shared Hint Resolver
Create one shared hint-resolution model with answer-leakage guards and deterministic tests.

### MC-R1F.2 — Shared Attempt State Machine
Implement initial → hint → remediation state transitions without changing question banks.

### MC-R1F.3 — Evidence Adapter
Record `initial` and `remediation` separately and prove no overwrite/double-count behavior.

### MC-R1F.4 — Cross-Chapter Integration
Apply the shared behavior to Chapters 1–21 through the common micro-check UI/runtime.

### MC-R1F.5 — Hint Content Coverage
Author/validate concept-level hints for all required concept families/questions without changing correct-answer identity.

### MC-R1F.6 — Accessibility + UX Hardening
Verify focus, screen-reader announcements, keyboard operation, mobile layout, duplicate-submit protection, and no answer leakage.

### MC-R1F.7 — Final Certification
Run cross-chapter adversarial checks proving learning-loop integrity before MC-R1G.

## 25. Acceptance Criteria

MC-R1F contract is GREEN only when the implementation contract explicitly guarantees:

- first attempt has no hint;
- first submitted response is immutable `initial` evidence;
- correct-first-attempt ends the item without remediation;
- an incorrect first attempt does not reveal the answer;
- a concept-level hint appears only after the miss;
- re-evaluation tests the same concept;
- parallel item is preferred when appropriate;
- original-item retry is allowed when no parallel item exists;
- remediation uses `attemptPhase: 'remediation'`;
- formal later reassessment remains `attemptPhase: 'reassessment'`;
- initial and remediation evidence stay separate;
- ordinary micro-check first-attempt percentage is not inflated by remediation;
- existing TLS/mastery weighting remains unchanged;
- remediation is limited to one immediate retry by default;
- explanations are delayed until after re-evaluation on a miss;
- duplicate evidence is prevented;
- accessibility is protected;
- answer leakage is prohibited;
- no question-bank, grading-weight, TLS-threshold, or unrelated production behavior changes occur in the contract-only slice.
