# C8-1 — Grading/Evidence Schema & Electrical-Safety Mastery Rules

## Goal

Reuse the certified Chapters 7+ grading/mastery mechanics for Chapter 8 while adding a stricter safety overlay for high-priority electrical-equipment and light-therapy evidence.

This phase defines **how evidence behaves** before any existing Chapter 8 lesson, flashcard, or quiz item is mapped into the model.

## Grade hierarchy — unchanged

Chapter 8 keeps the certified Chapter 7+ grade hierarchy:

| Evidence component | Weight |
|---|---:|
| Micro knowledge checks | 20% |
| Flashcard mastery | 10% |
| Chapter assessment | 40% |
| Scenario/application | 15% |
| Remediation/reassessment recovery | 15% |

The chapter assessment remains the heaviest ordinary component.

The four ordinary components total 85% and are normalized to the base grade when remediation is not required.

Reassessment is a recovery mechanism. It may improve the final grade but may never lower the student's base grade.

## Evidence schema

Every graded Chapter 8 evidence record identifies:

- student
- Chapter 8
- one canonical Chapter 8 concept family
- evidence source
- item ID
- difficulty
- correctness
- attempt phase
- timestamp

Evidence sources remain:

- micro_check
- flashcard
- chapter_assessment
- scenario_application
- remediation_reassessment

Difficulty remains:

- recall
- understanding
- application
- scenario

Attempt phase remains:

- initial
- remediation
- reassessment

## Mastery rules inherited from Chapter 7

Chapter 8 deliberately keeps the same deterministic mastery behavior:

- recall evidence contributes less than understanding/application/scenario evidence;
- chapter assessment and scenario/application evidence contribute more than flashcard interactions;
- remediation evidence is supportive;
- reassessment can demonstrate recovery;
- initial misses stay in the evidence trail;
- older evidence decays modestly but is not deleted;
- confidence is independent of raw mastery score;
- one or two correct items cannot produce stable confidence;
- strong confidence requires repeated, diverse, harder evidence;
- identical evidence plus identical reference time must return identical results.

## Chapter 8 safety overlay

The stricter overlay applies only to these two canonical concept families:

- `ch8-equipment-safety`
- `ch8-light-therapy-safety`

This is an ASCYN PRO mastery/intervention design rule. It is **not** presented as a textbook scoring rule or NIC scoring rule.

Only application/scenario evidence participates in the shortcut escalation. Recall misses still affect ordinary mastery but do not independently create a safety emergency flag.

### Watch threshold

A single most-recent **scenario-level** safety miss produces a WATCH state.

Effect:

- instructor review required;
- no automatic formal reassessment yet.

### Urgent threshold

Two distinct safety misses among the latest three application/scenario observations produce an URGENT state.

Effect:

- instructor review required;
- formal concept-targeted reassessment required.

This is intentionally stricter than Chapter 7's chemical-safety rule, which reviewed the latest four hard observations.

### Clearing threshold

A safety escalation requires **five consecutive correct application/scenario observations** to clear through evidence.

This is intentionally stricter than Chapter 7's four-consecutive-correct rule.

### Formal safety reassessment

The Chapter 8 safety policy reserves these requirements for later remediation wiring:

- 5 unseen questions;
- target the same safety concept;
- 100% required to clear the formal safety reassessment gate.

The 100% safety-clearing requirement does **not** mean the student's chapter grade is forced to 100%, and it does not change the 20/10/40/15/15 grade weights.

It is an intervention-clearance rule for critical safety concepts.

## Important separation

Three things remain separate:

1. **Grade** — weighted academic result.
2. **Mastery** — evidence-weighted concept understanding.
3. **Safety escalation** — operational instructor attention for repeated high-priority misses.

A student can have a passing chapter grade while still carrying an active electrical/light-therapy safety intervention.

Completion alone never clears mastery or safety risk.

## C8-1 exit criteria

C8-1 closes only after:

- Chapter 8 grade weights are locked;
- Chapter 8 evidence schema is implemented;
- deterministic mastery tests pass;
- insufficient-evidence confidence behavior is preserved;
- initial misses survive reassessment recovery;
- electrical/light-therapy safety families are explicitly identified;
- watch/urgent/clear rules are deterministic;
- stricter safety thresholds are tested;
- Engineering Verification is GREEN;
- Vercel is READY on the exact C8-1 head.

After C8-1, begin **C8-2 — Existing Asset Mapping & Coverage Audit**, mapping lesson blocks, flashcards, and the current 30-question assessment into the ten canonical concept families before rewriting content.
