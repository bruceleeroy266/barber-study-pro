# TLS-1A.3 — Evidence-to-Status Mapping Specification

Status: COMPLETE / LOCKED FOR PLANNING — NO RUNTIME CODE CHANGES

Baseline protected: 03bbd2f5793ca6fa5485dc1abcac0985e6f17801
Depends on: TLS-1A.1 and TLS-1A.2

## Goal

Deterministically translate the certified evidence pipeline into:
1. one existing certified score;
2. one learner status: Strong / Improving / Needs Attention;
3. one recommended action.

TLS does not recalculate the grade and does not replace certified remediation/reassessment logic.

## Required inputs

The status resolver may consume only already-certified facts:
- current certified grade/mastery result;
- evidence sufficiency/confidence;
- whether required remediation/reassessment is open;
- latest recovery outcome and required recovery threshold;
- unresolved urgent bodily-safety requirement;
- unresolved compliance/legal requirement;
- whether fresh normal evidence exists after successful recovery;
- learning-cycle identity / whether evidence belongs to the current cycle.

Original misses remain immutable diagnostic history and never disappear when status changes.

## Non-status state: Not Enough Evidence

Strong / Improving / Needs Attention must not be guessed before enough evidence exists.

If there is no evidence, or current evidence is classified as `insufficient_evidence`, the UI shows **Not Enough Evidence** as an evidence state, not as a fourth mastery status.

Action: **Continue the normal learning path.**

Partial work must not be converted into Needs Attention merely because missing components make the record incomplete. Existing certified calculations remain visible where appropriate, but TLS does not infer failure from absence.

## Deterministic precedence

Evaluate in this order.

### Rule 1 — Current-cycle safety/compliance requirement unresolved
Status: **Needs Attention**

This overrides a passing numeric score.

Action: **Complete the required safety/compliance remediation and reassessment.**

Certified threshold remains authoritative:
- ordinary recovery: 80%;
- urgent bodily-safety recovery: 100% where certified;
- Chapter 19 certified safety exception remains intact;
- Chapter 21 certified compliance semantics remain intact.

### Rule 2 — Required remediation/reassessment is open, incomplete, or unsuccessful
Status: **Needs Attention**

Action: **Complete targeted remediation/reassessment for the identified concept.**

A high aggregate score cannot hide an unresolved required intervention.

### Rule 3 — Sufficient current evidence and certified score/mastery is below 80%
Status: **Needs Attention**

Action: **Review the identified weak concept and complete the targeted recovery path when assigned.**

### Rule 4 — Required recovery succeeded in the current cycle, but no qualifying fresh normal evidence has yet followed it
Status: **Improving**

Action: **Continue normal targeted practice; monitor the next fresh evidence.**

Successful recovery does not erase the original miss and does not immediately rewrite the history as Strong.

### Rule 5 — Successful recovery is followed by qualifying fresh normal evidence at or above 80%, with no unresolved intervention
Status: **Strong**

Action: **Continue learning / maintain mastery.**

For this planning specification, **qualifying fresh normal evidence** means a new non-remediation evidence event from the certified normal learning pipeline, recorded after successful recovery, that updates the certified mastery/grade evidence and leaves the resulting current mastery at or above 80%.

No special TLS-only quiz is created to obtain this evidence.

### Rule 6 — No current-cycle recovery history requiring Improving, sufficient evidence exists, score/mastery >= 80%, and no unresolved intervention exists
Status: **Strong**

Action: **Continue learning / maintain mastery.**

## Transition table

- No/insufficient evidence → **Not Enough Evidence** → continue normal learning.
- Partial but insufficient evidence → **Not Enough Evidence** → continue normal learning.
- Sufficient evidence <80 → **Needs Attention**.
- Any unresolved required remediation → **Needs Attention**.
- Any unresolved required safety/compliance condition → **Needs Attention**, regardless of aggregate passing score.
- Successful required recovery → **Improving**.
- Improving + fresh qualifying normal evidence >=80 + no unresolved requirement → **Strong**.
- Strong + later sufficient evidence <80 or new required intervention → **Needs Attention**.
- Strong + new unresolved safety/compliance condition → **Needs Attention**.
- Improving + failed/new required recovery → **Needs Attention**.
- Improving without new evidence → remains **Improving**; time alone does not promote the learner.

## Freshness and cycle boundaries

### Time alone
Age does not automatically demote Strong or promote Improving. Existing mastery recency weighting remains untouched.

### New learning cycle
When a genuinely new chapter/concept learning cycle begins, prior diagnostic history remains preserved but does not automatically force the new cycle to inherit Improving or Needs Attention.

The new cycle starts from its own current evidence state:
- insufficient new-cycle evidence → Not Enough Evidence;
- sufficient new-cycle evidence then resolves through the precedence rules above.

### Stale historical misses
Historical misses remain available for instructor drill-down, but a resolved miss from an earlier cycle does not permanently block Strong.

## Score rule

The displayed score remains the existing certified calculation.

TLS status may override the *interpretation* of a passing score when a required safety/compliance/remediation condition is unresolved, but TLS must never secretly alter the number.

Example:
- certified score = 86;
- urgent required recovery unresolved;
- visible result = **86 — Needs Attention**;
- reason = required recovery is still open.

## Improving → Strong lock

Improving may become Strong only when ALL are true:
1. required recovery has succeeded;
2. no required remediation/reassessment remains open;
3. no unresolved safety/compliance requirement remains;
4. at least one qualifying fresh normal evidence event occurs after recovery;
5. the resulting current certified mastery/grade remains >=80%.

Time alone, instructor preference, or hiding the original miss cannot cause this transition.

## Instructor presentation

Default row/card:
- **Score:** existing certified score;
- **Status:** Strong / Improving / Needs Attention, or Not Enough Evidence before status resolution;
- **Action:** one concise recommended action.

Drill-down may show the exact reason and underlying evidence. If multiple reasons exist, display the highest-precedence unresolved reason first.

## Student presentation

Do not expose internal weighting or diagnostic machinery as extra work.

Student messaging should be behavioral:
- Strong → keep going;
- Improving → keep practicing; recovery succeeded and progress is being monitored;
- Needs Attention → focus on the named weak area / required recovery;
- Not Enough Evidence → continue the normal chapter activities.

## Invariants

- No fourth mastery status is introduced; Not Enough Evidence is an evidence state.
- No new grade formula.
- No new assessment solely for status.
- No automatic failure from incomplete evidence.
- No automatic promotion based on time.
- No erasure of initial misses.
- No weakening of 80% ordinary or 100% urgent-safety recovery.
- No change to certified Chapter 19 safety or Chapter 21 compliance behavior.
- No change to same-school authorization/privacy.
- Chapters 1–21 remain frozen.

## Planning examples

1. Student has 88% with sufficient evidence, no intervention history/open requirement → **Strong**.
2. Student has 88%, but required safety recovery is still open → **Needs Attention**.
3. Student has 74% with sufficient evidence → **Needs Attention**.
4. Student had a gap, completes required recovery successfully → **Improving**.
5. Same recovered student later produces fresh normal evidence and current mastery remains 84% → **Strong**.
6. Student has only one early activity and insufficient evidence → **Not Enough Evidence**, not Needs Attention.
7. Student was Strong, then new sufficient evidence creates a required gap → **Needs Attention**.
8. Old resolved miss exists from a prior cycle; current cycle has sufficient 90% evidence and no open requirement → **Strong** while old history remains preserved.

## Gate result

**GREEN.** The status mapping is deterministic and can be implemented without changing certified chapter content or grading mathematics.

## Next gate

**TLS-1A.4 — Instructor Presentation + Action Contract (paper only).**

Lock exactly what the instructor sees for each state, the reason/action vocabulary, drill-down boundaries, and how multiple weak concepts are summarized without turning the dashboard into an evidence wall.

No runtime coding is authorized until that presentation/action contract is locked.
