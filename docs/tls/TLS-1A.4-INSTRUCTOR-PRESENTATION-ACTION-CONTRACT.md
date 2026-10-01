# TLS-1A.4 — Instructor Presentation + Action Contract

Status: COMPLETE / LOCKED FOR PLANNING — NO RUNTIME CODE CHANGES

Baseline protected: 03bbd2f5793ca6fa5485dc1abcac0985e6f17801
Depends on: TLS-1A.1 through TLS-1A.3

## Goal

Make the instructor understand a student's current learning state in seconds without exposing the full diagnostic engine by default.

Primary contract: **one score + one status + one reason + one recommended action.**

## Default student row/card

Show only:
1. Student name.
2. Existing certified score. If evidence is insufficient, show the available score only if the existing product already considers it valid; otherwise show **—**.
3. Status: **Strong**, **Improving**, **Needs Attention**, or the non-status evidence state **Not Enough Evidence**.
4. One short reason.
5. One recommended action.
6. Optional compact indicator that more detail is available.

Do not place raw component weights, question IDs, initial-miss lists, evidence timestamps, reassessment internals, or multiple competing calls-to-action in the default row.

## Locked vocabulary

### Strong
Reason priority:
- **Mastery is at or above 80% with no open intervention.**
- After recovery: **Fresh evidence confirms mastery after recovery.**

Action:
- **Continue learning.**

### Improving
Reason:
- **Required recovery was completed; waiting for fresh normal evidence to confirm sustained mastery.**

Action:
- **Continue targeted practice.**

The instructor is not asked to manually promote the student.

### Needs Attention
Choose exactly one primary reason using precedence:
1. **Safety/compliance recovery required.**
2. **Required remediation or reassessment is incomplete.**
3. **Required recovery was unsuccessful.**
4. **Current mastery is below 80%.**

Primary action aligned to the reason:
1. **Complete required safety/compliance recovery.**
2. **Complete targeted remediation/reassessment.**
3. **Repeat the targeted recovery path.**
4. **Review the weak concept and begin targeted recovery when assigned.**

### Not Enough Evidence
Reason:
- **Not enough current evidence to determine mastery.**

Action:
- **Continue normal chapter activities.**

This is an evidence state, not a mastery status.

## Multiple weak concepts

The default row must not list every weak concept.

If one unresolved concept exists:
- show its learner-friendly concept name in the reason/action context.

If multiple unresolved concepts exist:
- show the highest-precedence concept/reason first;
- append a compact count such as **+2 more areas**;
- drill-down reveals the remaining areas.

Ordering:
1. unresolved urgent bodily-safety;
2. unresolved compliance/legal;
3. open/failed required recovery;
4. lowest current concept mastery;
5. remaining concepts ordered by intervention need, then lowest mastery.

Do not rank students against one another.

## Drill-down contract

Opening a student detail may show:
- current certified score;
- current TLS status and primary reason;
- recommended action;
- weak concepts, using learner-friendly names;
- evidence source summary;
- preserved initial misses;
- remediation state;
- latest reassessment/recovery result;
- safety/compliance state where applicable;
- evidence freshness/current-cycle context.

Keep advanced diagnostic details behind progressive disclosure.

Do not expose:
- internal database IDs;
- raw answer payloads;
- hidden correct-answer keys;
- service-role/security internals;
- implementation-only weighting/debug data.

Existing same-school authorization and student privacy rules remain authoritative.

## Action contract

TLS actions are recommendations over certified workflow state, not a parallel task system.

Rules:
- never create an instructor task merely because a status label changes;
- never require instructor approval to move Improving → Strong when certified evidence satisfies the transition;
- never allow an instructor button to bypass required remediation, safety, compliance, or reassessment;
- never offer a generic “mark Strong” control;
- actions should deep-link to or explain the existing certified workflow when an intervention is actually required;
- no extra work is assigned to a Strong student solely for status confirmation.

## Passing score with unresolved requirement

The score and status are both shown truthfully.

Example:
**86% · Needs Attention**
Reason: **Safety recovery required.**
Action: **Complete required safety recovery.**

Do not hide or lower the 86. Do not show Strong merely because the numeric score passes.

## Instructor scanning hierarchy

For a roster/list view, visual information order is:
1. student;
2. status;
3. score;
4. primary reason;
5. recommended action;
6. drill-down affordance.

The interface may use accessible visual emphasis, but status meaning must never depend on color alone.

## Noise controls

Default surfaces must not:
- show all five grading components simultaneously;
- show every evidence event;
- show all historical misses;
- show more than one primary recommended action;
- show more than one primary reason;
- expose technical status names or IDs;
- force an instructor to open drill-down to understand what to do next.

## Example rows

- **Jordan — Strong — 88%** | Mastery is at or above 80% with no open intervention. | **Continue learning.**
- **Alex — Improving — 84%** | Required recovery completed; fresh confirmation is pending. | **Continue targeted practice.**
- **Taylor — Needs Attention — 86%** | Safety recovery required. | **Complete required safety recovery.**
- **Morgan — Needs Attention — 74%** | Current mastery is below 80%. | **Review the weak concept.**
- **Casey — Not Enough Evidence — —** | Not enough current evidence to determine mastery. | **Continue normal chapter activities.**
- **Riley — Needs Attention — 72%** | Infection Control needs recovery **+2 more areas**. | **Complete targeted remediation/reassessment.**

## Instructor intervention summary

A dashboard-level summary may group students by action need, but must not produce a competitive ranking.

Allowed summary:
- Needs Attention: count;
- Improving: count;
- Strong: count;
- Not Enough Evidence: count.

Within Needs Attention, optional action buckets:
- safety/compliance;
- remediation/reassessment;
- below-mastery threshold.

The summary must link back to individual students and preserve same-school authorization.

## Invariants

- Existing certified score remains the displayed score.
- Strong / Improving / Needs Attention definitions remain those locked in TLS-1A.3.
- Not Enough Evidence remains an evidence state, not a fourth mastery status.
- One primary reason and one primary action.
- No manual status override.
- No new grading system or TLS-only assessment.
- No weakening of recovery thresholds.
- No erasure of diagnostic history.
- No change to Chapters 1–21 runtime/content.
- No change to same-school authorization/privacy.

## Gate result

**GREEN.** The instructor presentation can remain simple even when the evidence model underneath is complex.

## Next gate

**TLS-1A.5 — Student Presentation + Feedback Contract (paper only).**

Lock what students see after normal evidence, a detected gap, remediation, successful recovery, and fresh confirmation. Keep feedback immediate and useful without exposing instructor-only diagnostics or turning every activity into a high-stakes score.

No runtime coding is authorized until that contract is locked.
