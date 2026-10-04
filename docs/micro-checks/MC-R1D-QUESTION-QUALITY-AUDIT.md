# MC-R1D — Micro-Check Question Quality Audit

Status: IN PROGRESS  
Base production commit: `d233725b70a4d8c6c9e1599552790095502a4a70`  
Scope: Chapters 1–21 micro-check banks (330 questions)  
Question rewrites in this slice: **NONE**

## Purpose

MC-R1D audits the existing 330 micro-check questions for whether they measure concept discrimination rather than test-taking strategy.

This slice does **not** rewrite question stems, answers, correct keys, grading, evidence, TLS, remediation, reassessment, safety/compliance behavior, or reporting. Rewrites belong to MC-R1E after this audit is certified.

## Locked Quality Rubric

Each question is reviewed against the following dimensions.

### Q1 — Distractor Plausibility

PASS when every incorrect choice could plausibly attract a partially trained student.

FLAG when one or more distractors are:
- obviously absurd,
- unrelated to the concept,
- professionally unrealistic,
- trivially eliminated without knowing the lesson,
- substantially less specific than the correct response.

### Q2 — Concept Neighborhood

PASS when all four options test the same concept, decision, procedure, sequence, or closely neighboring misconception.

FLAG when the correct answer is the only option operating in the actual concept neighborhood.

### Q3 — Wording / Cue Neutrality

PASS when wording does not reveal correctness through tone or test-taking patterns.

FLAG when the item relies on cues such as:
- `always`, `never`, `automatically`, `completely`, `guaranteed`,
- obviously absolute wrong answers while the correct answer is carefully qualified,
- a uniquely professional or nuanced correct answer surrounded by casual/implausible distractors,
- grammar or sentence-completion clues.

### Q4 — Length / Specificity Parity

PASS when the correct answer is not consistently much longer, more detailed, or more professionally qualified than the distractors.

FLAG when answer length or specificity itself is a strong clue.

### Q5 — One Defensible Best Answer

PASS when exactly one answer is best under the lesson's intended facts.

FLAG when:
- two choices can reasonably be defended,
- a missing condition changes the answer,
- the stem is too broad for a single best response,
- correctness depends on hidden assumptions.

### Q6 — Fair Difficulty

PASS when difficulty comes from distinguishing concepts, sequence, conditions, or application.

FLAG when difficulty comes from:
- trick wording,
- obscure wording not taught,
- unnecessary linguistic complexity,
- negative phrasing that does not serve the concept,
- hidden exceptions.

### Q7 — Professional / Safety Integrity

PASS when the item reflects the certified lesson, scope, safety, compliance, and professional boundaries.

FLAG when a distractor could unintentionally teach unsafe, illegal, or out-of-scope behavior without a clearly defensible reason for inclusion.

## Severity

- **P0 — Critical:** ambiguous key, unsafe/legal/compliance error, wrong answer keyed correct, or grading-integrity defect.
- **P1 — High:** item can be answered primarily from wording/position/obvious distractor cues rather than knowledge.
- **P2 — Medium:** distractors are uneven, weak, or too easy but still technically valid.
- **P3 — Low:** style/polish improvement with little effect on measurement integrity.

MC-R1E will repair P0/P1 first, then P2, without changing learning objectives or grading semantics.

## Baseline Findings Already Proven

The cross-chapter baseline contains 330 questions.

Stored correct-answer source-key distribution before runtime randomization:
- A: 144 (43.6%)
- B: 111 (33.6%)
- C: 59 (17.9%)
- D: 16 (4.8%)

MC-R1B and MC-R1C remove the visible-position exploit by shuffling display choices while preserving canonical grading identity.

MC-R1D now addresses the separate problem: a student may still infer the answer from wording quality even when visible positions are randomized.

## Initial Qualitative Finding — Chapter 21

Chapter 21 demonstrates the exact pattern MC-R1D is intended to detect.

Examples include distractors such as:
- assuming a label "automatically" creates a legal status,
- fixed universal rules presented beside a nuanced fact-based correct answer,
- "always" / "every" language appearing primarily in incorrect options,
- obviously weak operational choices beside a substantially more complete professional response.

These items are not being changed in MC-R1D. They are audit evidence for MC-R1E distractor hardening.

## Required Audit Output

For every Chapter 1–21 bank, MC-R1D must record:
- question count,
- P0 count,
- P1 count,
- P2 count,
- P3 count,
- flagged question IDs,
- failed rubric dimensions,
- concise reason for each flag,
- whether the stem, distractors, or both require repair.

The final MC-R1D certification must reconcile to exactly **330 questions**.

## Protected Boundaries

MC-R1D must not change:
- any `micro-checks.ts` question text,
- answer text,
- correctAnswer values,
- question IDs,
- concept IDs,
- learning objectives,
- difficulty metadata,
- grading weights,
- first-attempt evidence,
- persistence,
- TLS,
- remediation/reassessment,
- safety/compliance escalation,
- instructor/admin reporting,
- Exam Ready,
- Hours & Attendance,
- Communications.

## Exit Criteria

MC-R1D is GREEN only when:
1. all 21 chapter banks are reviewed,
2. exactly 330 questions are accounted for,
3. every flagged item has a severity and failed rubric dimension,
4. no question content has changed,
5. Engineering Verification passes on the exact head,
6. Vercel preview is READY on that same exact head.

The next slice after MC-R1D is **MC-R1E — Distractor Hardening**.


# MC-R1D Full Audit Results

Questions reviewed: **330**  
P0: **0**  
P1: **85**  
P2: **153**  
P3: **0**  
Flagged: **238**  
Unflagged: **92**  
Reconciliation: **238 + 92 = 330**

No invalid correct-answer keys or duplicate-answer grading ambiguities were detected. The dominant findings are Q1/Q3/Q4 issues: distractor plausibility, cue-heavy absolute wording, and correct-answer length/specificity imbalance.

| Ch | Q | P1 | P2 | Unflagged |
|---:|---:|---:|---:|---:|
|1|10|2|2|6|
|2|20|4|11|5|
|3|8|1|4|3|
|4|12|4|5|3|
|5|12|3|4|5|
|6|20|5|12|3|
|7|23|3|11|9|
|8|22|10|8|4|
|9|21|3|9|9|
|10|19|1|7|11|
|11|17|4|7|6|
|12|16|0|13|3|
|13|16|3|7|6|
|14|14|5|5|4|
|15|14|4|9|1|
|16|16|4|5|7|
|17|14|10|4|0|
|18|14|4|7|3|
|19|14|1|11|2|
|20|12|3|7|2|
|21|16|11|5|0|
|**Total**|**330**|**85**|**153**|**92**|

## High-priority Q2 concept-neighborhood flags

mcq-2-020, mcq-17-004, mcq-17-013, mcq-19-002, mcq-21-005, mcq-21-016.

These items have a correct answer that is uniquely nuanced/professional relative to the distractors and should be repaired first in MC-R1E.
