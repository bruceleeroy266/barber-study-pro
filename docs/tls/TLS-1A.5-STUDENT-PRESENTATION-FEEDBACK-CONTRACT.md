# TLS-1A.5 — Student Presentation + Feedback Contract

Status: COMPLETE / LOCKED FOR PLANNING — NO RUNTIME CODE CHANGES

Baseline protected: 03bbd2f5793ca6fa5485dc1abcac0985e6f17801
Depends on: TLS-1A.1 through TLS-1A.4

## Goal

Give students immediate, useful, low-stress feedback while the certified evidence system continues to detect gaps, preserve misses, assign targeted remediation, and verify recovery underneath.

Student feedback answers three questions:
1. **How am I doing?**
2. **What should I focus on next?**
3. **What do I do now?**

Do not expose the instructor diagnostic engine as the student experience.

## Student default presentation

Show:
1. learner-friendly status or evidence state;
2. existing certified score only where the existing workflow treats a score as meaningful;
3. one short feedback message;
4. one next action.

Do not show:
- internal evidence weights;
- confidence enums;
- raw diagnostic history;
- database/internal IDs;
- hidden correct-answer keys;
- instructor-only escalation details;
- other students' results or rankings.

Status meaning must not depend on color alone.

## Feedback by state

### Not Enough Evidence
Message:
**Keep going — ASCYN PRO needs a little more of your work to understand this area.**

Action:
**Continue the normal chapter activities.**

Rules:
- do not call this failure;
- do not display Needs Attention simply because activities are incomplete;
- do not create extra TLS-only work to resolve the state.

### Strong
Message:
**You’re showing strong understanding in this area.**

Action:
**Continue learning.**

After recovery and fresh confirmation:
**Your new work confirms that you’ve strengthened this area.**

Rules:
- do not require extra proof solely to retain the label;
- do not imply perfection;
- later certified evidence may legitimately change the status.

### Needs Attention — ordinary learning gap
Message:
**This area needs more practice. Let’s focus on [learner-friendly concept].**

Action:
**Review the targeted support and complete the recovery activity.**

Rules:
- identify the concept, not a technical concept ID;
- focus on the next step rather than listing every miss;
- multiple gaps are sequenced by certified intervention priority.

### Needs Attention — safety/compliance
Message:
**This area requires additional review before it is considered complete.**

Action:
**Complete the required safety/compliance review and recovery activity.**

Rules:
- clearly distinguish required work from optional practice;
- do not weaken the certified threshold;
- do not expose internal escalation/security language.

### Improving
Immediately after successful required recovery:
**Nice progress — you completed the recovery for this area. Keep using it in your normal work.**

Action:
**Continue targeted practice and your normal chapter activities.**

Rules:
- do not immediately force another TLS-only test;
- the student remains Improving until qualifying fresh normal evidence confirms sustained mastery;
- do not say the original miss disappeared.

### Improving → Strong
When qualifying fresh normal evidence occurs after successful recovery and current mastery remains >=80% with no unresolved requirement:
**Your recent work confirms your progress. This area is now Strong.**

Action:
**Continue learning.**

No instructor approval or extra status test is required.

## Immediate feedback contract

For practice-oriented interactions where the certified product already supports immediate correctness feedback:
- tell the student whether the response was correct/incorrect;
- provide concise corrective guidance when wrong;
- direct attention to the relevant concept;
- allow the certified evidence/remediation system to decide whether formal intervention is required.

Immediate feedback must not itself create a new grading formula or status rule.

For formal exam/simulator contexts where answers are intentionally withheld until completion, preserve that existing behavior. TLS does not leak answer keys in the name of immediate feedback.

## Wrong-answer feedback

Preferred pattern:
1. outcome: **Correct** or **Not quite**;
2. concise explanation of the governing concept;
3. next learning cue.

Avoid:
- punitive language;
- revealing hidden answer keys in protected assessment contexts;
- long remediation lessons inside a single feedback message;
- telling the student they have “failed” a concept from one isolated miss unless the certified system actually establishes a gap.

## Multiple gaps

Do not present a wall of weaknesses.

Student default:
- show the highest-priority current focus area;
- optionally show **+N more areas to review**;
- move through targeted recovery in the certified order.

Priority remains:
1. urgent bodily-safety;
2. compliance/legal;
3. open/failed required recovery;
4. lowest current mastery;
5. remaining gaps.

## Scores and pressure

- Practice/retrieval activities should remain practice-oriented.
- Do not turn every flashcard or micro-check into a prominent high-stakes percentage.
- Formal certified scores remain visible where they are already meaningful.
- Status should help the student decide what to do, not become a separate grade.
- No public leaderboard or peer comparison is introduced by TLS.

## Recovery feedback

Failed/incomplete recovery:
**This area still needs practice. Review the targeted material and try the required recovery again when ready.**

Successful ordinary recovery:
**Recovery complete. Keep practicing this skill in your normal work.**

Successful urgent-safety/compliance recovery:
**Required recovery complete. Continue applying this correctly in your normal work.**

The exact certified recovery thresholds remain authoritative underneath.

## Preserved history, student-facing restraint

ASCYN PRO preserves original misses for diagnostics, but the default student view does not repeatedly surface old resolved errors as punishment.

Resolved historical evidence may appear in a progress/history view if useful, clearly labeled as resolved.

A resolved miss from an earlier learning cycle must not make the current student message sound as though the issue is still open.

## Accessibility and clarity

- use plain language;
- pair icons/color with text labels;
- keep the primary message short;
- make the next action keyboard/touch accessible;
- avoid relying on red/green alone;
- use learner-friendly concept names;
- distinguish **required** recovery from optional practice.

## Student-facing examples

- **Not Enough Evidence** — “Keep going — complete your normal chapter activities.”
- **Strong** — “You’re showing strong understanding. Continue learning.”
- **Needs Attention** — “Disinfection procedures need more practice. Review this area and complete the recovery activity.”
- **Improving** — “Nice progress — recovery complete. Keep applying this in your normal work.”
- **Strong after recovery** — “Your recent work confirms your progress. This area is now Strong.”

## Invariants

- No new grade formula.
- No fourth mastery status; Not Enough Evidence remains an evidence state.
- No extra TLS-only exam.
- No failure inferred from missing evidence.
- No immediate retest solely to escape Improving.
- No erasure of original diagnostic history.
- No weakening of 80% ordinary or 100% urgent-safety recovery.
- No change to Chapter 19 safety behavior or Chapter 21 compliance semantics.
- No answer-key leakage from protected formal assessments/simulators.
- No peer ranking.
- No change to Chapters 1–21 runtime/content.
- Existing privacy/authorization remains authoritative.

## Gate result

**GREEN.** Students can receive immediate, actionable feedback without adding workload or turning the certified evidence pipeline into a high-stakes experience.

## Next gate

**TLS-1A.6 — Status Lifecycle + Edge-Case Contract (paper only).**

Lock behavior for conflicting evidence, multiple simultaneous remediation cycles, interrupted/incomplete work, retries, stale evidence, chapter-cycle resets, and status changes when new evidence arrives out of order.

No runtime coding is authorized until that lifecycle contract is locked.
